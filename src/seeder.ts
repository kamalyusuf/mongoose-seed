import type { AnyObject, InsertManyResult, Model } from "mongoose";
import { SchemaAnalyzer, type AnalyzerOptions } from "./schema-analyzer.js";
import { Generator, type GeneratorOptions } from "./generator.js";
import { faker } from "@faker-js/faker";
import {
  info,
  success,
  measure,
  format_memory,
  warning,
  memory_usage,
  BLUE,
  RESET
} from "./utils.js";
import { registry } from "./registry.js";
import { OpenAIGenerator, type OpenAIConfig } from "./openai-generator.js";
import ora, { type Ora } from "ora";

export interface SeedConfig<T>
  extends AnalyzerOptions<T>,
    Omit<GeneratorOptions<T>, "labels"> {
  quantity: number | [min: number, max: number];
  clean?: boolean;
  debug?: boolean;
  openai?: Omit<
    OpenAIConfig,
    | "exclude"
    | "timestamps"
    | "optional_field_probability"
    | "quantity"
    | "constraints"
  >;
}

export const seed = async <T>(
  model: Model<T>,
  config: SeedConfig<T>
): Promise<InsertManyResult<T>> => {
  const debug = config.debug ?? true;
  let peak_memory = 0;

  const update_peak_memory = () => {
    const current = process.memoryUsage().heapUsed;
    if (current > peak_memory) peak_memory = current;
  };

  let cooker: Ora | undefined;

  if (!debug)
    cooker = ora(`${BLUE} [${model.modelName}] Cooking${RESET}`).start();

  const start = performance.now();

  if (config.clean) {
    let cleaner: Ora | undefined;

    if (debug)
      cleaner = ora(
        `${BLUE} [${model.modelName}] Cleaning collection${RESET}`
      ).start();

    const { result, elapsed } = await measure.async(model.deleteMany({}));

    cleaner?.stop();

    if (debug) {
      update_peak_memory();

      success(
        `[${model.modelName}] Cleaned ${result.deletedCount.toLocaleString()} documents in ${elapsed}ms`
      );

      warning(
        `[${model.modelName}] Memory after clean: ${format_memory(process.memoryUsage().heapUsed)}`
      );
    }
  }

  const analyzer = new SchemaAnalyzer(model.schema, {
    exclude: config.exclude
  });

  const constraints = analyzer.constraints(model.schema);

  const quantity = Array.isArray(config.quantity)
    ? faker.number.int({ min: config.quantity[0], max: config.quantity[1] })
    : config.quantity;

  const interval = Math.max(1, Math.floor(quantity / 10));
  let last_memory_log = 0;

  const documents = config.openai?.apikey
    ? await measure.async(async () => {
        const openai = config.openai!;

        return await new OpenAIGenerator(model, analyzer, {
          apikey: openai.apikey,
          quantity,
          constraints,
          description: openai.description,
          exclude: config.exclude as string[] | undefined,
          max_tokens: openai.max_tokens,
          model: openai.model,
          temperature: openai.temperature,
          timestamps: config.timestamps,
          optional_field_probability: config.optional_field_probability
        }).generate();
      })
    : await measure.async(async () => {
        const docs: AnyObject[] = [];

        for (let index = 0; index < quantity; index++) {
          docs.push(
            await new Generator<T>(model, analyzer, {
              generators: config.generators,
              timestamps: config.timestamps,
              optional_field_probability: config.optional_field_probability,
              labels: analyzer.labels
            }).generate(constraints)
          );

          if (debug) update_peak_memory();

          if (debug && (index % interval === 0 || index === quantity - 1)) {
            const progress = (((index + 1) / quantity) * 100).toFixed(1);

            const now = Date.now();
            if (index % (interval * 5) === 0 || now - last_memory_log > 5000) {
              const mem = memory_usage();

              warning(
                `[${model.modelName}] Memory - Heap: ${mem.heapUsed}, RSS: ${mem.rss}`
              );

              last_memory_log = now;
            }

            info(
              `[${model.modelName}] Progress: ${(index + 1).toLocaleString()}/${quantity.toLocaleString()} documents generated (${progress}%)`
            );
          }
        }

        return docs;
      });

  let inserter: Ora | undefined;

  if (debug) {
    success(
      `[${model.modelName}] Generated ${quantity.toLocaleString()} documents in ${documents.elapsed}ms`
    );

    warning(
      `[${model.modelName}] Peak memory during generation: ${format_memory(peak_memory)}`
    );

    inserter = ora(
      `${BLUE} [${model.modelName}] Inserting ${quantity.toLocaleString()} documents${RESET}`
    ).start();
  }

  const result = await measure.async(
    model.insertMany(documents.result, {
      rawResult: true,
      ordered: false
    })
  );

  cooker?.stop();
  inserter?.stop();

  if (debug) {
    update_peak_memory();

    const final_memory = memory_usage();

    success(
      `[${model.modelName}] Seeded ${result.result.insertedCount.toLocaleString()} / ${quantity.toLocaleString()} documents in ${result.elapsed}ms`
    );

    warning(`[${model.modelName}] Final memory usage:
      - Heap: ${final_memory.heapUsed}
      - RSS: ${final_memory.rss}
      - Peak: ${format_memory(peak_memory)}`);
  }

  const end = performance.now();

  if (debug) info(`[${model.modelName}] Total time elapsed ${end - start}ms`);
  else
    success(
      `[${model.modelName}] Seeded ${result.result.insertedCount.toLocaleString()} / ${quantity.toLocaleString()} documents in ${end - start}ms`
    );

  registry.register(model.modelName, Object.values(result.result.insertedIds));

  return result.result as any;
};

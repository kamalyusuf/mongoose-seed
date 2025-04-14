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
  memory_usage
} from "./utils.js";
import { registry } from "./registry.js";

export interface SeedConfig<T> extends AnalyzerOptions<T>, GeneratorOptions<T> {
  quantity: number | [min: number, max: number];
  clean?: boolean;
  debug?: boolean;
}

export const seed = async <T>(
  model: Model<T>,
  options: SeedConfig<T>
): Promise<InsertManyResult<T>> => {
  const debug = options.debug ?? true;
  let peak_memory = 0;

  const update_peak_memory = () => {
    const current = process.memoryUsage().heapUsed;
    if (current > peak_memory) peak_memory = current;
  };

  if (!debug) info(`[${model.modelName}] Cooking`);

  const start = performance.now();

  if (options.clean) {
    if (debug) info(`[${model.modelName}] Cleaning collection`);

    const { result, elapsed } = await measure.async(model.deleteMany({}));

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

  const analyzer = new SchemaAnalyzer({ exclude: options.exclude });

  const constraints = analyzer.constraints(model.schema);

  const quantity = Array.isArray(options.quantity)
    ? faker.number.int({ min: options.quantity[0], max: options.quantity[1] })
    : options.quantity;

  const interval = Math.max(1, Math.floor(quantity / 10));
  let last_memory_log = 0;

  const documents = await measure.async(async () => {
    const docs: AnyObject[] = [];

    for (let index = 0; index < quantity; index++) {
      docs.push(
        await new Generator<T>(model, {
          generators: options.generators,
          timestamps: options.timestamps,
          optional_field_probability: options.optional_field_probability
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

  if (debug) {
    success(
      `[${model.modelName}] Generated ${quantity.toLocaleString()} documents in ${documents.elapsed}ms`
    );

    warning(
      `[${model.modelName}] Peak memory during generation: ${format_memory(peak_memory)}`
    );

    info(
      `[${model.modelName}] Inserting ${quantity.toLocaleString()} documents`
    );
  }

  const result = await measure.async(
    model.insertMany(documents.result, {
      rawResult: true,
      ordered: false
    })
  );

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

  info(`[${model.modelName}] Total time elapsed ${end - start}ms`);

  registry.register(model.modelName, Object.values(result.result.insertedIds));

  return result.result as any;
};

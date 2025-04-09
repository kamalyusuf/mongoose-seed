import type { InsertManyResult, Model } from "mongoose";
import { SchemaAnalyzer, type AnalyzerOptions } from "./schema-analyzer.js";
import { Generator, type GeneratorOptions } from "./generator.js";
import { faker } from "@faker-js/faker";

interface SeedOptions<T> extends AnalyzerOptions<T>, GeneratorOptions<T> {
  quantity: number | [min: number, max: number];
  clean?: boolean;
}

export const seed = async <T>(
  model: Model<T>,
  options: SeedOptions<T>
): Promise<InsertManyResult<T>> => {
  if (options.clean) await model.deleteMany({});

  const analyzer = new SchemaAnalyzer({ exclude: options.exclude });

  const constraints = analyzer.constraints(model.schema);

  const quantity = Array.isArray(options.quantity)
    ? faker.number.int({ min: options.quantity[0], max: options.quantity[1] })
    : options.quantity;

  const documents = Array.from({ length: quantity }, () =>
    new Generator<T>(model.schema, {
      generators: options.generators,
      timestamps: options.timestamps,
      optional_field_probability: options.optional_field_probability
    }).generate(constraints)
  );

  const result = await model.insertMany(documents, {
    rawResult: true,
    ordered: false
  });

  return result as any;
};

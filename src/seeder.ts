import type { AnyObject, Model } from "mongoose";
import { SchemaAnalyzer, type AnalyzerOptions } from "./schema-analyzer.js";
import { Generator, type GeneratorOptions } from "./generator.js";
import { faker } from "@faker-js/faker";

interface SeedOptions<T> extends AnalyzerOptions, GeneratorOptions<T> {
  quantity: number | [min: number, max: number];
  clean?: boolean;
}

export const seed = async <T>(model: Model<T>, options: SeedOptions<T>) => {
  if (options.clean) await model.deleteMany({});

  const analyzer = new SchemaAnalyzer({ exclude: options.exclude });

  const constraints = analyzer.constraints(model.schema);

  const generator = new Generator<T>(model.schema, {
    generators: options.generators,
    timestamps: options.timestamps,
    optional_field_probability: options.optional_field_probability
  });

  const documents: AnyObject[] = [];

  const quantity = Array.isArray(options.quantity)
    ? faker.number.int({ min: options.quantity[0], max: options.quantity[1] })
    : options.quantity;

  for (let i = 1; i <= quantity; i++)
    documents.push(generator.generate(constraints));

  return documents;
};

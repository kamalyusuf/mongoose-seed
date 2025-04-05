import type { AnyObject, Model } from "mongoose";
import { analyzer } from "./schema-analyzer.js";
import type { SchemaConstraints } from "./types.js";
import { generator } from "./generator.js";
import { Limbo } from "../dev/model.js";

interface SeedOptions {
  quantity: number;
  clean?: boolean;
}

export const seed = async (model: Model<any>, options: SeedOptions) => {
  const schema = model.schema;

  if (options.clean) await model.deleteMany({});

  const constraints = analyzer.constraints(schema);

  const documents: AnyObject[] = [];

  for (let i = 1; i <= options.quantity; i++)
    documents.push(generate_document(constraints));

  return documents;
};

function generate_document(constraints: SchemaConstraints) {
  const doc: AnyObject = {};

  for (const [path, constraint] of Object.entries(constraints))
    doc[path] = generator.generate(constraint);

  return doc;
}

console.dir(await seed(Limbo, { quantity: 1 }), { depth: Infinity });

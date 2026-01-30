import { faker } from "@faker-js/faker";
import type { Model, Types } from "mongoose";
import { BLUE, info, gauge, RESET } from "./utils.js";
import ora from "ora";

export class Registry {
  #documents: Map<string, Types.ObjectId[]>;

  constructor() {
    this.#documents = new Map();
  }

  register(model: string, ids: Types.ObjectId[]): void {
    const documents = this.#documents.get(model) ?? [];

    this.#documents.set(model, documents.concat(ids));
  }

  async single(parent: Model<any>, ref_model: string) {
    let ids = this.#documents.get(ref_model);

    if (!ids || ids.length === 0) ids = await this.#load(parent, ref_model);

    if (ids.length === 0)
      throw new Error(
        `Unable to resolve reference for model '${ref_model}'. The collection is empty and no reference documents are available. Please seed the '${ref_model}' collection first.`
      );

    return faker.helpers.arrayElement(ids);
  }

  async multiple(parent: Model<any>, ref_model: string, count: number) {
    let ids = this.#documents.get(ref_model);

    if (!ids || ids.length === 0) ids = await this.#load(parent, ref_model);

    if (ids.length === 0)
      throw new Error(
        `Unable to resolve reference for model '${ref_model}'. The collection is empty and no reference documents are available. Please seed the '${ref_model}' collection first.`
      );

    return faker.helpers.arrayElements(ids, count);
  }

  async #load(
    parent: Model<any>,
    ref_model: string
  ): Promise<Types.ObjectId[]> {
    const Ref =
      parent.modelName === ref_model ? parent : parent.db.model(ref_model);

    if (!Ref)
      throw new Error(
        `Reference resolution failed: The model '${ref_model}' is not registered with Mongoose. Ensure the model is defined and registered before attempting to seed documents that reference it.`
      );

    const loader = ora(
      `${BLUE} [${Ref.modelName}] Loading reference documents for resolving ${parent.modelName} references ${RESET}`
    ).start();

    const { result: docs, elapsed } = await gauge.async(
      Ref.find({}, { _id: 1 }).lean()
    );

    loader.stop();

    if (!docs.length)
      throw new Error(
        `Reference resolution failed: The '${ref_model}' collection contains no documents. Please seed the '${ref_model}' collection before attempting to seed documents that reference it.`
      );

    info(
      `[${Ref.modelName}] Loaded ${docs.length.toLocaleString()} reference documents for resolving ${parent.modelName} references in ${elapsed}ms`
    );

    this.#documents.set(ref_model, docs as any);

    return docs as any;
  }
}

export const registry = new Registry();

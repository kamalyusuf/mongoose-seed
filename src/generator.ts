import { Types, type AnyObject, type Schema } from "mongoose";
import type {
  ArrayConstraints,
  BigIntConstraints,
  BooleanConstraints,
  BufferConstraints,
  DateConstraints,
  Decimal128Constraints,
  DoubleConstraints,
  EmbeddedConstraints,
  FieldConstraints,
  GeneratorFn,
  Instance,
  Int32Constraints,
  MapConstraints,
  MixedConstraints,
  NumberConstraints,
  ObjectIdConstraints,
  SchemaConstraints,
  StringConstraints,
  UUIDConstraints
} from "./types.js";
import { faker, type Faker } from "@faker-js/faker";
import { createHash, randomUUID } from "node:crypto";
import { matchers } from "./string-matchers.js";

export interface GeneratorOptions<T> {
  timestamps?: boolean;
  optional_field_probability?: number;
  generators?: {
    [K in keyof T]?: GeneratorFn<T[K]>;
  } & { timestamps?: (faker: Faker) => Record<string, Date> };
}

export class Generator<T> {
  #schema: Schema;

  #doc: AnyObject;

  #labels: {
    created?: string;
    updated?: string;
  };

  #timestamp?: Date;

  #options?: GeneratorOptions<T>;

  constructor(schema: Schema, options?: GeneratorOptions<T>) {
    this.#schema = schema;
    this.#doc = {};
    this.#labels = this.#extract_timestamp_labels();
    this.#options = options;
  }

  generate(constraints: SchemaConstraints): AnyObject {
    for (const [path, constraint] of Object.entries(constraints))
      this.#doc[path] = this.#value(constraint);

    if (Object.keys(this.#labels).length > 0) this.#resolve_timestamps();

    return this.#doc;
  }

  #value(constraints: FieldConstraints) {
    if (constraints.default !== undefined)
      return this.#default_value(constraints);

    if (!this.#should_generate(constraints)) return undefined;

    if (this.#is_timestamp_field(constraints.path)) return undefined;

    if ((this.#options?.generators as AnyObject)?.[constraints.path])
      return (this.#options?.generators as AnyObject)[constraints.path]?.(
        faker
      );

    switch (constraints.type) {
      case "String":
        return this.#string(constraints);
      case "Number":
        return this.#number(constraints);
      case "Boolean":
        return this.#boolean(constraints);
      case "Date":
        return this.#date(constraints);
      case "Buffer":
        return this.#buffer(constraints);
      case "Decimal128":
        return this.#decimal128(constraints);
      case "Double":
        return this.#double(constraints);
      case "Int32":
        return this.#int32(constraints);
      case "BigInt":
        return this.#bigint(constraints);
      case "ObjectId":
        return this.#objectid(constraints);
      case "UUID":
        return this.#uuid(constraints);
      case "Embedded":
        return this.#embedded(constraints);
      case "Array":
        return this.#array(constraints);
      case "Map":
        return this.#map(constraints);
      case "Mixed":
        return this.#mixed(constraints);
    }
  }

  #string(constraints: StringConstraints): string {
    if (constraints.enum) return faker.helpers.arrayElement(constraints.enum);

    if (constraints.match) return faker.helpers.fromRegExp(constraints.match);

    const path = constraints.path.toLowerCase();

    if (
      path.toLowerCase().includes("password") ||
      path.toLowerCase().includes("hash")
    )
      return this.#hash(constraints);

    const min = constraints.minlength ?? 1;
    const max = constraints.maxlength ?? 255;

    let value: string | undefined;

    for (const [regex, generator] of matchers) {
      if (regex.test(path)) {
        value = generator();
        break;
      }
    }

    if (!value) value = this.#lorem(min, max);

    if (constraints.trim) value = value.trim();

    if (constraints.lowercase) value = value.toLowerCase();
    else if (constraints.uppercase) value = value.toUpperCase();

    return value;
  }

  #hash(constraints: StringConstraints): string {
    const min = constraints.minlength ?? 8;
    const max = constraints.maxlength ?? 128;

    const length = faker.number.int({ min, max });

    const password = faker.internet.password({ length });

    return createHash("sha256").update(password).digest("hex");
  }

  #number(constraints: NumberConstraints): number {
    if (constraints.enum) return faker.helpers.arrayElement(constraints.enum);

    const min = constraints.min ?? Number.MIN_SAFE_INTEGER;
    const max = constraints.max ?? Number.MAX_SAFE_INTEGER;

    return faker.number.int({ min, max });
  }

  #boolean(_constraints: BooleanConstraints): boolean {
    return faker.datatype.boolean();
  }

  #double(_constraints: DoubleConstraints): number {
    return faker.number.float({ min: 1, max: 1_000_000, fractionDigits: 2 });
  }

  #bigint(_constraints: BigIntConstraints): bigint {
    return BigInt(faker.number.int({ min: -1_000_000, max: 1_000_000 }));
  }

  #date(constraints: DateConstraints): Date {
    const min = constraints.min ?? new Date(1970, 0, 1);
    const max = constraints.max ?? new Date();

    return faker.date.between({ from: min, to: max });
  }

  #buffer(_constraints: BufferConstraints): Buffer {
    return Buffer.from(faker.lorem.word());
  }

  #decimal128(_constraints: Decimal128Constraints): Types.Decimal128 {
    return new Types.Decimal128(
      faker.number.float({ min: 1, max: 1_000_000 }).toString()
    );
  }

  #int32(_constraints: Int32Constraints) {
    return faker.number.int({ min: -1_000_000, max: 1_000_000 });
  }

  #objectid(_constraints: ObjectIdConstraints): Types.ObjectId {
    return new Types.ObjectId();
  }

  #uuid(_constraints: UUIDConstraints) {
    return randomUUID();
  }

  #embedded(constraints: EmbeddedConstraints) {
    const result: AnyObject = {};

    for (const [field, constraint] of Object.entries(constraints.schema))
      result[field] = this.#value(constraint);

    return result;
  }

  #array(constraints: ArrayConstraints): any[] {
    const length = faker.number.int({ min: 1, max: 10 });

    if (typeof constraints.of !== "string" && constraints.of.type === "Array")
      return Array.from({ length }, () =>
        this.#array(constraints.of as ArrayConstraints)
      );

    if (typeof constraints.of === "string")
      return Array.from({ length }, () =>
        this.#value({
          path: constraints.path,
          type: constraints.of as any,
          required: constraints.required,
          default: constraints.default
        })
      );

    return Array.from({ length }, () => {
      const doc: AnyObject = {};

      for (const [field, constraint] of Object.entries(
        constraints.of as SchemaConstraints
      ))
        doc[field] = this.#value(constraint);

      return doc;
    });
  }

  #map(constraints: MapConstraints): AnyObject {
    const entries = faker.number.int({ min: 1, max: 5 });

    const obj: AnyObject = {};

    for (let i = 0; i < entries; i++) {
      const key = faker.word.sample();

      if (typeof constraints.of === "string")
        obj[key] = this.#value({
          path: constraints.path,
          type: constraints.of as any,
          required: constraints.required
        });
      else {
        const entry: AnyObject = {};

        for (const [field, constraint] of Object.entries(constraints.of))
          entry[field] = this.#value(constraint);

        obj[key] = entry;
      }
    }

    return obj;
  }

  #mixed(constraints: MixedConstraints, depth = 0): any {
    const primitives: Instance[] = [
      "String",
      "Number",
      "Boolean",
      "Date",
      "Buffer",
      "Decimal128",
      "Double",
      "Int32",
      "BigInt",
      "ObjectId",
      "UUID"
    ];

    if (depth >= 3)
      return this.#value({
        path: constraints.path,
        type: faker.helpers.arrayElement(primitives) as any,
        required: true
      });

    const type = faker.helpers.arrayElement(["primitive", "array", "object"]);

    switch (type) {
      case "primitive":
        return this.#value({
          path: constraints.path,
          type: faker.helpers.arrayElement(primitives) as any,
          required: true
        });

      case "array":
        return Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => this.#mixed(constraints, depth + 1)
        );

      case "object":
        const entries = faker.number.int({ min: 1, max: 3 });
        const obj: AnyObject = {};

        for (let i = 0; i < entries; i++)
          obj[faker.word.sample()] = this.#mixed(constraints, depth + 1);

        return obj;
    }
  }

  #should_generate(constraints: FieldConstraints): boolean {
    if (this.#is_timestamp_field(constraints.path)) return true;

    if (typeof constraints.required === "function")
      return this.#evaluate_with_context(constraints.required);

    if (constraints.required === undefined || constraints.required === false)
      return faker.datatype.boolean({
        probability: this.#options?.optional_field_probability ?? 0.7
      });

    return constraints.required;
  }

  #default_value(constraints: FieldConstraints) {
    if (typeof constraints.default === "function")
      return this.#evaluate_with_context(constraints.default);

    return constraints.default;
  }

  #evaluate_with_context(value: Function) {
    return value.call(
      new Proxy(this.#doc, {
        get: (target, prop, receiver) => Reflect.get(target, prop, receiver)
      })
    );
  }

  #resolve_timestamps() {
    if (this.#options?.generators?.timestamps) {
      const fields = this.#options.generators.timestamps(faker);

      if (this.#labels.created && fields[this.#labels.created])
        this.#doc[this.#labels.created] = fields[this.#labels.created];

      if (this.#labels.updated && fields[this.#labels.updated])
        this.#doc[this.#labels.updated] = fields[this.#labels.updated];
    } else if (this.#options?.timestamps) {
      const timestamp = this.#document_timestamp();

      if (this.#labels.created) this.#doc[this.#labels.created] = timestamp;

      if (this.#labels.updated) this.#doc[this.#labels.updated] = timestamp;
    }
  }

  #extract_timestamp_labels(): { created?: string; updated?: string } {
    const options = this.#schema.get("timestamps");

    if (options === true)
      return {
        created: "createdAt",
        updated: "updatedAt"
      };

    if (!options) return {};

    const fields: { created?: string; updated?: string } = {};

    if (typeof options.createdAt === "string")
      fields.created = options.createdAt;
    else if (options.createdAt === true) fields.created = "createdAt";

    if (typeof options.updatedAt === "string")
      fields.updated = options.updatedAt;
    else if (options.updatedAt === true) fields.updated = "updatedAt";

    return fields;
  }

  #document_timestamp(): Date {
    if (!this.#timestamp)
      this.#timestamp = faker.date.between({
        from: new Date(1970, 0, 1),
        to: new Date()
      });

    return this.#timestamp;
  }

  #is_timestamp_field(path: string): boolean {
    return this.#labels.created === path || this.#labels.updated === path;
  }

  #lorem(min: number, max: number): string {
    const length = faker.number.int({ min, max });

    let text = "";

    while (text.length < length) text += faker.lorem.paragraph() + " ";

    return text.length > max ? text.substring(0, max) : text;
  }
}

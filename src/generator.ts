import { Types, type AnyObject } from "mongoose";
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
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

// todo: refs

class Generator {
  generate(constraints: FieldConstraints) {
    if (constraints.default !== undefined)
      return this.#default_value(constraints);

    if (!this.#should_generate(constraints)) return undefined;

    switch (constraints.type) {
      case "String":
        return this.string(constraints);
      case "Number":
        return this.number(constraints);
      case "Boolean":
        return this.boolean(constraints);
      case "Date":
        return this.date(constraints);
      case "Buffer":
        return this.buffer(constraints);
      case "Decimal128":
        return this.decimal128(constraints);
      case "Double":
        return this.double(constraints);
      case "Int32":
        return this.int32(constraints);
      case "BigInt":
        return this.bigint(constraints);
      case "ObjectId":
        return this.objectid(constraints);
      case "UUID":
        return this.uuid(constraints);
      case "Embedded":
        return this.embedded(constraints);
      case "Array":
        return this.array(constraints);
      case "Map":
        return this.map(constraints);
      case "Mixed":
        return this.mixed(constraints);
    }
  }

  #should_generate(constraints: FieldConstraints): boolean {
    if (typeof constraints.required === "function")
      return constraints.required.call(undefined);

    if (constraints.required === undefined || !constraints.required)
      return faker.datatype.boolean({ probability: 0.7 });

    return constraints.required;
  }

  #default_value(constraints: FieldConstraints) {
    if (typeof constraints.default === "function")
      return constraints.default.call(undefined);

    return constraints.default;
  }

  string(constraints: StringConstraints): string {
    if (constraints.enum) return faker.helpers.arrayElement(constraints.enum);

    const min = constraints.minlength ?? 1;
    const max = constraints.maxlength ?? 255;
    const length = faker.number.int({ min, max });

    let value: string;

    if (constraints.match) value = faker.helpers.fromRegExp(constraints.match);
    else if (constraints.ref) value = new Types.ObjectId().toString();
    else {
      const path = constraints.path.toLowerCase();

      if (path.includes("name")) value = faker.person.fullName();
      else if (path.includes("email")) value = faker.internet.email();
      else if (path.includes("username")) value = faker.internet.username();
      else if (path.includes("password"))
        value = faker.internet.password({ length });
      else if (path.includes("address")) value = faker.location.streetAddress();
      else if (path.includes("phone")) value = faker.phone.number();
      else if (path.includes("url")) value = faker.internet.url();
      else value = faker.lorem.paragraph().substring(0, length);
    }

    if (constraints.trim) value = value.trim();

    if (constraints.lowercase) value = value.toLowerCase();
    else if (constraints.uppercase) value = value.toUpperCase();

    return value;
  }

  boolean(_constraints: BooleanConstraints): boolean {
    return faker.datatype.boolean();
  }

  number(constraints: NumberConstraints): number {
    if (constraints.enum) return faker.helpers.arrayElement(constraints.enum);

    const min = constraints.min ?? Number.MIN_SAFE_INTEGER;
    const max = constraints.max ?? Number.MAX_SAFE_INTEGER;

    return faker.number.int({ min, max });
  }

  double(constraints: DoubleConstraints): number {
    const min = constraints.min ?? 1;
    const max = constraints.max ?? 1_000_000;

    return faker.number.float({ min, max, fractionDigits: 2 });
  }

  bigint(constraints: BigIntConstraints): bigint {
    const min = constraints.min
      ? BigInt(constraints.min)
      : BigInt(Number.MIN_SAFE_INTEGER);

    const max = constraints.max
      ? BigInt(constraints.max)
      : BigInt(Number.MAX_SAFE_INTEGER);

    return BigInt(faker.number.int({ min: Number(min), max: Number(max) }));
  }

  date(constraints: DateConstraints): Date {
    const min = constraints.min ?? new Date(1970, 0, 1);
    const max = constraints.max ?? new Date();

    return faker.date.between({ from: min, to: max });
  }

  buffer(_constraints: BufferConstraints): Buffer {
    return Buffer.from(faker.lorem.word());
  }

  decimal128(constraints: Decimal128Constraints): Types.Decimal128 {
    const min = constraints.min ?? Number.MIN_SAFE_INTEGER;
    const max = constraints.max ?? Number.MAX_SAFE_INTEGER;

    return new Types.Decimal128(faker.number.float({ min, max }).toString());
  }

  int32(constraints: Int32Constraints) {
    const min = constraints.min ?? -2147483648;
    const max = constraints.max ?? 2147483647;

    return faker.number.int({ min, max });
  }

  objectid(_constraints: ObjectIdConstraints): Types.ObjectId {
    // todo
    // // If it's a reference field, we might want to generate a valid reference
    // if (constraints.ref) {
    //   // In a real implementation, you might want to:
    //   // 1. Check if referenced model exists
    //   // 2. Potentially create a document in that model
    //   // 3. Return its _id
    //   // For now, we'll just return a new ObjectId
    //   return new Types.ObjectId();
    // }

    return new Types.ObjectId();
  }

  uuid(_constraints: UUIDConstraints) {
    return randomUUID();
  }

  embedded(constraints: EmbeddedConstraints) {
    const result: AnyObject = {};

    for (const [field, constraint] of Object.entries(constraints.schema))
      result[field] = this.generate(constraint);

    return result;
  }

  array(constraints: ArrayConstraints): any[] {
    const length = faker.number.int({ min: 1, max: 10 });

    if (typeof constraints.of !== "string" && constraints.of.type === "Array")
      return Array.from({ length }, () =>
        this.array(constraints.of as ArrayConstraints)
      );

    if (typeof constraints.of === "string")
      return Array.from({ length }, () =>
        this.#generate_primitive_value(
          constraints.of as Instance,
          constraints.path
        )
      );

    return Array.from({ length }, () => {
      const doc: AnyObject = {};

      for (const [field, constraint] of Object.entries(
        constraints.of as SchemaConstraints
      ))
        doc[field] = this.generate(constraint);

      return doc;
    });
  }

  map(constraints: MapConstraints): AnyObject {
    const entries = faker.number.int({ min: 1, max: 5 });

    const obj: AnyObject = {};

    for (let i = 0; i < entries; i++) {
      const key = faker.word.sample();

      if (typeof constraints.of === "string")
        obj[key] = this.#generate_primitive_value(
          constraints.of,
          constraints.path
        );
      else {
        const entry: AnyObject = {};

        for (const [field, constraint] of Object.entries(constraints.of))
          entry[field] = this.generate(constraint);

        obj[key] = entry;
      }
    }

    return obj;
  }

  mixed(constraints: MixedConstraints, depth = 0): any {
    const instances: Instance[] = [
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
      return this.#generate_primitive_value(
        faker.helpers.arrayElement(instances),
        constraints.path
      );

    const type = faker.helpers.arrayElement(["primitive", "array", "object"]);

    switch (type) {
      case "primitive":
        return this.#generate_primitive_value(
          faker.helpers.arrayElement(instances),
          constraints.path
        );

      case "array":
        const length = faker.number.int({ min: 1, max: 3 });
        return Array.from({ length }, () => this.mixed(constraints, depth + 1));

      case "object":
        const entries = faker.number.int({ min: 1, max: 3 });
        const obj: AnyObject = {};

        for (let i = 0; i < entries; i++) {
          const key = faker.word.sample();
          obj[key] = this.mixed(constraints, depth + 1);
        }

        return obj;
    }
  }

  #generate_primitive_value(instance: Instance, path: string) {
    switch (instance) {
      case "String":
        return faker.lorem.sentence();
      case "Number":
        return faker.number.int({
          min: Number.MIN_SAFE_INTEGER,
          max: Number.MAX_SAFE_INTEGER
        });
      case "Boolean":
        return faker.datatype.boolean();
      case "Date":
        return faker.date.between({
          from: new Date(1970, 0, 1),
          to: new Date()
        });
      case "Buffer":
        return Buffer.from(faker.lorem.word());
      case "Decimal128":
        return new Types.Decimal128(
          faker.number
            .float({
              min: Number.MIN_SAFE_INTEGER,
              max: Number.MAX_SAFE_INTEGER
            })
            .toString()
        );
      case "Double":
        return faker.number.float({
          min: 1,
          max: 1_000_000,
          fractionDigits: 2
        });
      case "Int32":
        return faker.number.int({ min: -2147483648, max: 2147483647 });
      case "BigInt":
        return BigInt(
          faker.number.int({
            min: Number(BigInt(Number.MIN_SAFE_INTEGER)),
            max: Number(BigInt(Number.MAX_SAFE_INTEGER))
          })
        );
      case "ObjectId":
        return new Types.ObjectId();
      case "UUID":
        return randomUUID();

      default:
        throw new Error(`Unsupported primitive type: ${instance} for ${path}`);
    }
  }
}

export const generator = new Generator();

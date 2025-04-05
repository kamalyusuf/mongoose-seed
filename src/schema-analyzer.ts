import { Schema, type AnyObject } from "mongoose";
import type { ArrayConstraints, SchemaConstraints } from "./types.js";

// todo: ref

class SchemaAnalyzer {
  constraints(schema: Schema): SchemaConstraints {
    const constraint: AnyObject = {};

    schema.eachPath((path, type) => {
      if (["_id", "__v"].includes(path) || path.includes(".$*")) return;

      const options = type.options;

      const required = Array.isArray(options.required)
        ? options.required[0]
        : options.required;

      if (type.instance === "Embedded")
        constraint[path] = {
          path,
          type: type.instance,
          required,
          default: options.default,
          ref: options.ref,
          schema: this.constraints(type.schema)
        };
      else if (type.instance === "Array") {
        const caster = (type as AnyObject).caster;

        if (caster.schema)
          // Array of documents
          constraint[path] = {
            path,
            type: type.instance,
            required,
            default: options.default,
            of: this.constraints(caster.schema)
          };
        else if (caster.instance === "Array")
          // Nested array (e.g., [[Number]])
          constraint[path] = {
            path,
            type: type.instance,
            required,
            default: options.default,
            of: this.#nested_array(caster)
          };
        else {
          // Simple array (e.g., [Number])
          constraint[path] = {
            path,
            type: type.instance,
            required,
            of: caster.instance
          };
        }
      } else if (type.instance === "Map") {
        const inner = (type as AnyObject).$__schemaType;

        let oftype: any;

        if (inner.schema instanceof Schema)
          oftype = this.constraints(inner.schema);
        else oftype = inner.instance;

        constraint[path] = {
          path,
          type: "Map",
          required,
          default: options.default,
          of: oftype
        };
      } else
        constraint[path] = {
          path,
          type: type.instance,
          required,
          enum: options.enum,
          min: options.min,
          max: options.max,
          minlength: options.minlength,
          maxlength: options.maxlength,
          match: options.match,
          default: options.default,
          ref: options.ref,
          trim: options.trim,
          lowercase: options.lowercase,
          uppercase: options.uppercase
        };
    });

    return constraint;
  }

  #nested_array(caster: AnyObject) {
    const nested = caster.caster;
    const constraint: ArrayConstraints = {
      type: "Array",
      path: nested.path,
      of: nested.instance
    };

    if (nested.schema)
      // Array of documents
      constraint.of = this.constraints(nested.schema);
    else if (nested.instance === "Array")
      // Further nested array (e.g., [[[String]]])
      constraint.of = this.#nested_array(nested) as any;

    return constraint;
  }
}

export const analyzer = new SchemaAnalyzer();

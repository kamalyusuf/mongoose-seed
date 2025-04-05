import type { Types } from "mongoose";

export type Instance = FieldConstraints["type"];

export type SchemaConstraints = Record<string, FieldConstraints>;

export type FieldConstraints =
  | StringConstraints
  | NumberConstraints
  | DateConstraints
  | BufferConstraints
  | BooleanConstraints
  | ObjectIdConstraints
  | ArrayConstraints
  | Decimal128Constraints
  | MapConstraints
  | EmbeddedConstraints
  | UUIDConstraints
  | BigIntConstraints
  | DoubleConstraints
  | Int32Constraints
  | MixedConstraints;

interface AbstractConstraints<T> {
  path: string;
  default?: T | (() => T);
  required?: boolean | (() => boolean);
  ref?: string;
}

export interface StringConstraints extends AbstractConstraints<string> {
  type: "String";
  enum?: string[];
  minlength?: number;
  maxlength?: number;
  match?: RegExp;
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
}

export interface NumberConstraints extends AbstractConstraints<number> {
  type: "Number";
  min?: number;
  max?: number;
  enum?: number[];
}

export interface DateConstraints extends AbstractConstraints<Date> {
  type: "Date";
  min?: Date;
  max?: Date;
}

export interface BufferConstraints extends AbstractConstraints<Buffer> {
  type: "Buffer";
}

export interface BooleanConstraints extends AbstractConstraints<boolean> {
  type: "Boolean";
}

export interface ObjectIdConstraints
  extends AbstractConstraints<Types.ObjectId> {
  type: "ObjectId";
}

export interface ArrayConstraints
  extends AbstractConstraints<Types.Array<unknown>> {
  type: "Array";
  of: Instance | SchemaConstraints | ArrayConstraints;
}

export interface Decimal128Constraints
  extends AbstractConstraints<Types.Decimal128> {
  type: "Decimal128";
  min?: number;
  max?: number;
}

export interface MapConstraints
  extends AbstractConstraints<Map<string, unknown>> {
  type: "Map";
  of: Instance | SchemaConstraints;
}

export interface EmbeddedConstraints extends AbstractConstraints<unknown> {
  type: "Embedded";
  schema: SchemaConstraints;
}

export interface UUIDConstraints extends AbstractConstraints<Types.UUID> {
  type: "UUID";
}

export interface BigIntConstraints extends AbstractConstraints<number> {
  type: "BigInt";
  min?: number;
  max?: number;
}

export interface DoubleConstraints extends AbstractConstraints<Types.Double> {
  type: "Double";
  min?: number;
  max?: number;
}

export interface Int32Constraints extends AbstractConstraints<number> {
  type: "Int32";
  min?: number;
  max?: number;
}

export interface MixedConstraints extends AbstractConstraints<any> {
  type: "Mixed";
}

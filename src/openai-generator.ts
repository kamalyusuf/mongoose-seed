import OpenAI from "openai";
import ora from "ora";
import type { SchemaConstraints } from "./types.js";
import type { ChatModel } from "openai/resources.js";
import type { AnyObject, Model } from "mongoose";
import type { SchemaAnalyzer } from "./schema-analyzer.js";
import { BLUE, RESET } from "./utils.js";

export interface OpenAIConfig {
  apikey: string;
  quantity: number;
  constraints: SchemaConstraints;
  model?: ChatModel;
  optional_field_probability?: number;
  temperature?: number;
  max_tokens?: number;
  description?: string;
  exclude?: string[];
  timestamps?: boolean;
}

export class OpenAIGenerator<T> {
  #config: Required<OpenAIConfig>;

  #client: OpenAI;

  #analyzer: SchemaAnalyzer<T>;

  #model: Model<any>;

  constructor(
    model: Model<any>,
    analyzer: SchemaAnalyzer<T>,
    config: OpenAIConfig
  ) {
    this.#model = model;
    this.#analyzer = analyzer;

    this.#config = {
      apikey: config.apikey,
      constraints: config.constraints,
      quantity: config.quantity,
      model: config.model ?? "gpt-4.1",
      temperature: config.temperature ?? 0.7,
      max_tokens: config.max_tokens ?? 2048,
      optional_field_probability: config.optional_field_probability ?? 0.7,
      description: config.description ?? "",
      timestamps: config.timestamps ?? true,
      exclude: config.exclude ?? []
    };

    this.#client = new OpenAI({
      apiKey: this.#config.apikey
    });
  }

  async generate(): Promise<AnyObject[]> {
    const prompt = this.#build();

    let result: { documents: AnyObject[] };

    const spinner = ora(`${BLUE} ChatGPT Cooking${RESET}`).start();

    try {
      const response = await this.#client.chat.completions.create({
        model: this.#config.model,
        max_tokens: this.#config.max_tokens,
        temperature: this.#config.temperature,
        response_format: {
          type: "json_object"
        },
        messages: [
          {
            role: "system",
            content:
              "You are a data generation assistant. Generate realistic test data based on mongoose schemas."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      result = JSON.parse(response.choices[0]!.message.content || "{}");
    } catch (e) {
      throw e;
    } finally {
      spinner.stop();
    }

    return result.documents.map((doc) =>
      this.#model.castObject(doc, { ignoreCastErrors: true })
    );
  }

  #build(): string {
    const schema_description = this.#describe(this.#config.constraints);
    const model_description = this.#config.description
      ? `\nModel Description: ${this.#config.description}\n`
      : "";

    const excludes_description = this.#config.exclude.length
      ? `- DO NOT generate '${this.#config.exclude.join(", ")}' fields`
      : "";

    return `Generate ${this.#config.quantity} realistic test documents for a mongoose model named "${this.#model.modelName}" with the following schema structure:
${model_description}
${schema_description}

Additional generation guidelines:
- DO NOT generate '_id' field - MongoDB will automatically assign these
${excludes_description}
- For ObjectId type fields, generate random valid ObjectId strings (24 character hex strings)
- For optional fields, generate values with a probability of ${this.#config.optional_field_probability * 100}%
- For Array types, generate between 1 and 10 items
- For Map types, generate between 1 and 5 key-value entries
- For Mixed types, generate random values which can be any type
  - If the Mixed value is an array or object, limit to 1-3 entries
  - For nested Mixed types, limit recursion depth to 3 levels, then use primitive values (string, number, boolean, date)

Please generate ${this.#config.quantity} documents in valid JSON format that match this schema and its constraints. Return the data in this format:
{
  "documents": [ /* array of ${this.#config.quantity} documents */ ]
}

The documents should be realistic and contextually appropriate for a "${this.#model.modelName}" model.`;
  }

  #describe(constraints: SchemaConstraints, indent = ""): string {
    const description: string[] = [];

    for (const [path, constraint] of Object.entries(constraints)) {
      if (this.#analyzer.is_timestamp_field(path) && !this.#config.timestamps)
        continue;

      let fielddesc = `${indent}- ${path}:`;

      if (constraint.type === "Array") {
        fielddesc += " Array of objects with structure:";
        description.push(fielddesc);
        description.push(
          this.#describe(constraint.of as SchemaConstraints, indent + "  ")
        );
        continue;
      }

      if (constraint.type === "Embedded") {
        fielddesc += " Embedded document with structure:";
        description.push(fielddesc);
        description.push(this.#describe(constraint.schema, indent + "  "));
        continue;
      }

      if (constraint.type === "Map") {
        fielddesc += " Map containing objects with structure:";
        description.push(fielddesc);
        description.push(
          this.#describe(constraint.of as SchemaConstraints, indent + "  ")
        );
        continue;
      }

      fielddesc += ` ${constraint.type}`;

      const conditions: string[] = [];

      if (constraint.required !== undefined) {
        const required =
          typeof constraint.required === "function"
            ? constraint.required.call(undefined)
            : constraint.required;

        if (required) conditions.push("required");
      }

      if (
        (constraint.type === "String" || constraint.type === "Number") &&
        constraint.enum
      )
        conditions.push(`enum: [${constraint.enum.join(", ")}]`);

      if (constraint.type === "String") {
        if (constraint.minlength)
          conditions.push(`minlength: ${constraint.minlength}`);

        if (constraint.maxlength)
          conditions.push(`maxlength: ${constraint.maxlength}`);

        if (constraint.match) conditions.push(`match: ${constraint.match}`);

        if (constraint.trim) conditions.push("trim");

        if (constraint.lowercase) conditions.push("lowercase");
        else if (constraint.uppercase) conditions.push("uppercase");
      }

      if (constraint.type === "Number" || constraint.type === "Date") {
        if (constraint.min !== undefined)
          conditions.push(`min: ${constraint.min}`);

        if (constraint.max !== undefined)
          conditions.push(`max: ${constraint.max}`);
      }

      if (constraint.default !== undefined) {
        const value =
          typeof constraint.default === "function"
            ? constraint.default.call(undefined)
            : constraint.default;

        conditions.push(`default: ${JSON.stringify(value)}`);
      }

      if (conditions.length > 0) fielddesc += ` (${conditions.join(", ")})`;

      description.push(fielddesc);
    }

    return description.join("\n");
  }
}

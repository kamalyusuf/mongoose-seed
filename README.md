# Mongoose Seed

A powerful utility for seeding Mongoose models with realistic fake data using Faker.js.
Perfect for testing, development, and populating your database with mock data.

## Features

- 🎲 Faker-powered data generation
- 📊 Supports all Mongoose schema types
- 🎯 Fully respects your Mongoose schema options (e.g., `required`, `default`, `enum`, `min`, `max`, etc.)
- 🪆 Handles complex nested structures, Maps, arrays, and embedded documents
- ⏱️ Supports automatic and custom timestamp generation
- 📈 Includes debug mode with memory tracking and progress logging
- 📝 Realistic data based on field names
- 🔧 Customizable field generators
- 🔗 Automatic resolution of ObjectId references (including arrays of references)

## Installation

```bash
npm install @kamalyb/mongoose-seed -D
# or
yarn add @kamalyb/mongoose-seed -D
# or
pnpm add @kamalyb/mongoose-seed -D
```

## Usage

```typescript
import mongoose from "mongoose";
import { seed } from "@kamalyb/mongoose-seed";

const schema = new mongoose.Schema(
  {
    str: {
      type: String
    },
    num: {
      type: Number,
      required: () => true
    },
    date: {
      type: Date,
      required: true
    },
    bool: Boolean,
    oid: mongoose.Schema.Types.ObjectId,
    buffer: mongoose.Schema.Types.Buffer,
    dec128: mongoose.Schema.Types.Decimal128,
    uuid: mongoose.Schema.Types.UUID,
    bigint: mongoose.Schema.Types.BigInt,
    double: mongoose.Schema.Types.Double,
    int32: mongoose.Schema.Types.Int32,
    schema: new mongoose.Schema(
      {
        num: Number,
        email: {
          type: String
        },
        username: {
          type: String
        }
      },
      { _id: false }
    ),
    array: [
      new mongoose.Schema({
        node: {
          type: Number,
          required: true,
          min: 1,
          max: 10
        },
        word: String,
        name: String,
        email: String,
        phone: String,
        address: String
      })
    ],
    map: {
      type: Map,
      of: {
        name: Number,
        email: String,
        address: Date,
        active: Boolean
      }
    },
    mixed: mongoose.Schema.Types.Mixed
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "inserted_at",
      updatedAt: true
    }
  }
);

const Test = mongoose.model("Test", schema);

await mongoose.connect();

await seed(Test, {
  quantity: 5000 // or within range [1000, 5000],
  clean: true, // Remove existing documents before seeding
  debug: false, // Log progress and performance information
  exclude: ["mixed"], // Fields to exclude
  timestamps: true, // Generate random timestamps or let mongoose generate as it normally would
  optional_field_probability: 0.8, // 80% chance that optional fields will be included
  generators: { // Custom generators for specific fields
    num: (faker) => Math.random(),
    timestamps: (faker, doc) => {
      const at = doc.date
        ? faker.date.past({ refDate: doc.date })
        : faker.date.anytime();

      return {
        inserted_at: at,
        updatedAt: at
      }
    }
  }
});

await mongoose.disconnect();
```

## Behaviors

1. Documents are inserted into the database using `Model.insertyMany()`.

## Caveats

### Field functions and `this` context

In the seeding context, if a field's `default` or `required` is a function,
`this` refers to a plain JavaScript object (POJO), unlike in regular Mongoose
usage where `this` would be a Mongoose document.

### Bulk Write Error – "offset is out of range"

If you encounter this error: `The value of "offset" is out of range. It must be >= 0 && <= 17825792.`,
this means the total size of the bulk insert exceeded MongoDB's BSON buffer limit.
This typically happens when seeding a large number of complex or deeply nested documents.
The error is **not caused by this package** but is related to MongoDB's inherent
limitations and internal mechanics for handling bulk writes.

To resolve this, try reducing the quantity parameter to a smaller value — 5,000–10,000
is often a safe range for complex documents. For very large datasets with deeply
nested structures, consider making multiple calls to the `seed()` function,
each with a smaller quantity, to stay within the BSON size limits.

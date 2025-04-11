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
import { seed } from "@kamalyb/mongoose-seed";
import { Post } from "./models/post";

const Post = mongoose.model(
  "Post",
  new mongoose.Schema(
    {
      content: String,
      published: Boolean,
      tags: [String],
      views: Number,
      deleted_at: Date
    },
    {
      timestamps: {
        createdAt: "inserted_at",
        updatedAt: true
      }
    }
  )
);

await seed(Post, {
  quantity: 500_000 // or within range [100_000, 500_000],
  clean: true, // Remove existing documents before seeding
  debug: false, // Log progress and performance information
  exclude: ["deleted_at"], // Fields to exclude
  timestamps: true, // Generate random timestamps or let mongoose generate as it normally would
  optional_field_probability: 0.8, // 80% chance that optional fields will be included
  generators: { // Custom generators for specific fields
    views: (faker) => faker.number.int({ min: 1, max: 100_000 }),
    tags: (faker) => Array.from({ length: 5 }, () => faker.word.sample()),
    timestamps: (faker, doc) => {
      const at = doc.deleted_at
        ? faker.date.past({ refDate: doc.deleted_at })
        : faker.date.anytime();

      return {
        inserted_at: at,
        updatedAt: at
      }
    }
  }
});
```

## Behaviors

1. Documents are inserted into the database using `Model.insertyMany()`.
2. If a field's `default` or `required` is a function, `this` refers to a plain
   JavaScript object (POJO) in this context, not a Mongoose document.
3. For string fields, if both `lowercase` and `uppercase` are set, `lowercase`
   takes precedence.
4. For ObjectId references (ref fields), a fresh ObjectId is currently generated.
   This behavior will soon be updated to support resolving references with real document IDs.

## Caveats

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

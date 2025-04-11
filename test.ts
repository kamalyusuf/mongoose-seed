import { seed } from "./src/seeder.js";
import mongoose from "mongoose";

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
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Stuff = mongoose.model("Stuff", schema);

await mongoose.connect("mongodb://localhost:27017/mongoose-seeder");

try {
  const result = await seed(Stuff, {
    quantity: 2500,
    clean: true,
    exclude: [],
    debug: true,
    timestamps: true,
    optional_field_probability: 1,
    generators: {}
  });

  // console.log(result);
} catch (e) {
  const error = e as Error;

  console.error({ error: error.message });
} finally {
  await mongoose.disconnect();
}

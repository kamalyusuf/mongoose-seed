import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    str: {
      type: String,
      required: false,
      minlength: 2
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
    point: {
      x: Number,
      y: Number
    },
    scheme: new mongoose.Schema({
      num: Number,
      email: {
        type: String
      },
      username: {
        type: String
      }
    }),
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
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

export const Limbo = mongoose.model("Limbo", schema);

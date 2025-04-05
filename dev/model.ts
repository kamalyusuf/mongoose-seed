import mongoose from "mongoose";

const schema = new mongoose.Schema({
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
      word: String
    })
  ],
  map: {
    type: Map,
    of: {
      age: Number,
      name: String,
      dob: Date,
      active: Boolean
    }
  },
  mixed: mongoose.Schema.Types.Mixed
});

export const Limbo = mongoose.model("Limbo", schema);

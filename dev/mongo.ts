import mongoose from "mongoose";

export const connect = async () => {
  await mongoose.connect("mongodb://localhost:27017/mongoose-seeder");
};

export const schemaoptions = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  id: false,
  versionKey: false,
  strict: "throw",
  strictQuery: "throw"
} satisfies mongoose.SchemaOptions;

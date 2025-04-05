import { connect } from "./mongo.js";
import mongoose, { Types } from "mongoose";
import { Limbo } from "./model.js";

await connect();

await Limbo.deleteMany({});

await mongoose.disconnect();

import { Schema } from "mongoose";

export const TodoSchema = new Schema({
  completed: { type: Boolean, default: false },
  description: { type: String, required: true },
  creatorId: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true }
)
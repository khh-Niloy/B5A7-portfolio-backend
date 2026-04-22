import { Schema, model } from "mongoose";

export interface IVisitor {
  date: string; // YYYY-MM-DD
  count: number;
}

const visitorSchema = new Schema<IVisitor>(
  {
    date: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Visitor = model<IVisitor>("Visitor", visitorSchema);

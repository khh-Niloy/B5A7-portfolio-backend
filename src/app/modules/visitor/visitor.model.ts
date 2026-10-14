import { Schema, model } from "mongoose";
import { IVisitor } from "./visitor.interface";

const visitorSchema = new Schema<IVisitor>(
  {
    date: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Visitor = model<IVisitor>("Visitor", visitorSchema);
export { VisitorLog } from "./visitorLog.model";

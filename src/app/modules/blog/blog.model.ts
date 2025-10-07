import { model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";

export const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true },
}, {
  timestamps: true,
});

export const Blog = model<IBlog>("Blog", blogSchema);



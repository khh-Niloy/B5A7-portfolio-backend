import { ISkills } from "./skills.interface";
import { model, Schema } from "mongoose";

export const skillsSchema = new Schema<ISkills>(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    skills: { type: [String], required: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Skills = model<ISkills>("Skills", skillsSchema);

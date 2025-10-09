import { ISkills } from "./skills.interface";
import { model, Schema } from "mongoose";

export const skillsSchema = new Schema<ISkills>(
  {
    category: {
      type: String,
      enum: ["frontend", "backend", "database", "Tools & Services"],
      required: true,
    },
    skills: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

export const Skills = model<ISkills>("Skills", skillsSchema);

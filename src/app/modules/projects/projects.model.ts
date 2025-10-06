import { model, Schema } from "mongoose";
import { IProjects } from "./projects.interface";

export const projectsSchema = new Schema<IProjects>({
  image: { type: String, required: true },
  projectName: { type: String, required: true },
  shortDes: { type: String, required: true },
  techStack: { type: [String], required: true },
  liveSite: { type: String, required: true },
}, {
  timestamps: true,
});

export const Projects = model<IProjects>("Projects", projectsSchema);


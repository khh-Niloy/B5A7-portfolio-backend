import { model, Schema } from "mongoose";
import { IProjects } from "./projects.interface";

export const projectsSchema = new Schema<IProjects>({
  image: { type: String, required: true },
  shortDes: { type: String, required: true },
  techStack: { type: [String], required: true },
  liveSite: { type: String, required: true },
  projectName: { type: String, required: true },
  tagline: { type: String, required: true },
  problemSolution: { type: String, required: true },
  features: { type: [String], required: true },
  dependencies: { type: String, required: true },
  responsibilities: { type: String, required: true },
  githubRepo: { type: String, required: true },
}, {
  timestamps: true,
});

export const Projects = model<IProjects>("Projects", projectsSchema);


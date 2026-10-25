import { model, Schema } from "mongoose";
import { IProjects } from "./projects.interface";

export const projectsSchema = new Schema<IProjects>(
  {
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    projectName: { type: String, required: true },
    tagline: { type: String, required: true },
    role: { type: String, required: false },
    status: { type: String, required: false },
    techStack: { type: [String], required: true },
    liveSite: { type: String, required: false, default: "" },
    frontendRepo: { type: String, required: false, default: "" },
    backendRepo: { type: String, required: false, default: "" },
    githubRepo: { type: String, required: false, default: "" },
    backendLive: { type: String, required: false, default: "" },
    rerankerRepo: { type: String, required: false, default: "" },
    demoCheckerRepo: { type: String, required: false, default: "" },
    technicalHighlights: { type: String, required: false },
    projectType: {
      type: String,
      required: true,
      enum: ["client project", "personal project"],
      default: "personal project",
    },
    isActive: { type: Boolean, default: true },

    // Case Study Sections strictly following framework / output.md
    overview: { type: String, required: false },
    problem: { type: String, required: false },
    myContribution: { type: String, required: false },
    architecture: { type: String, required: false },
    keyDecisions: { type: String, required: false },
    resultsEvidence: { type: String, required: false },
    limitationsNextSteps: { type: String, required: false },

    // Legacy fields preserved for backward compatibility
    shortDes: { type: String, required: false },
    problemSolution: { type: String, required: false },
    features: { type: [String], default: [] },
    dependencies: { type: String, required: false },
    responsibilities: { type: String, required: false },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Projects = model<IProjects>("Projects", projectsSchema);

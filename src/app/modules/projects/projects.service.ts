import { IProjects } from "./projects.interface";
import { Projects } from "./projects.model";

const createProjectService = async (payload: IProjects) => {
  const project = await Projects.create(payload);
  return project;
};

const updateProjectService = async (id: string, payload: Partial<IProjects>) => {
  // If projectType is not in payload, check if existing document has it
  // If not, set default to avoid validation errors
  if (!payload.projectType) {
    const existingProject = await Projects.findById(id);
    if (existingProject && !existingProject.projectType) {
      payload.projectType = "personal project";
    }
  }
  
  const updated = await Projects.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updated;
};

const getProjectByIdService = async (id: string) => {
  const project = await Projects.findById(id);
  return project;
};

const getAllProjectsService = async () => {
  const projects = await Projects.find();
  return projects;
};

export const projectsServices = {
  createProjectService,
  updateProjectService,
  getProjectByIdService,
  getAllProjectsService,
};

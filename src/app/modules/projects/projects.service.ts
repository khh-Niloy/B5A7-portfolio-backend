import { IProjects } from "./projects.interface";
import { Projects } from "./projects.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createProjectService = async (payload: IProjects) => {
  const project = await Projects.create(payload);
  await deleteCache("all_projects");
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
  if (updated) {
    await deleteCache(`project_${id}`);
    await deleteCache("all_projects");
  }
  return updated;
};

const getProjectByIdService = async (id: string) => {
  const cachedProject = await getCachedData<IProjects>(`project_${id}`);
  if (cachedProject) return cachedProject;

  const project = await Projects.findById(id);
  if (project) {
    await cacheData(`project_${id}`, project);
  }
  return project;
};

const getAllProjectsService = async () => {
  const cachedProjects = await getCachedData<IProjects[]>("all_projects");
  if (cachedProjects) return cachedProjects;

  const projects = await Projects.find();
  await cacheData("all_projects", projects);
  return projects;
};

export const projectsServices = {
  createProjectService,
  updateProjectService,
  getProjectByIdService,
  getAllProjectsService,
};

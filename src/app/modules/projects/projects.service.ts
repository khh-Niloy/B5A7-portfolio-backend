import { IProjects } from "./projects.interface";
import { Projects } from "./projects.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createProjectService = async (payload: IProjects) => {
  const project = await Projects.create(payload);
  try {
    await deleteCache("all_projects");
  } catch (err) {
    console.error("Redis cache delete error:", err);
  }
  return project;
};

const updateProjectService = async (id: string, payload: Partial<IProjects>) => {
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
    try {
      await deleteCache(`project_${id}`);
      await deleteCache("all_projects");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return updated;
};

const getProjectByIdService = async (id: string) => {
  try {
    const cachedProject = await getCachedData<IProjects>(`project_${id}`);
    if (cachedProject) return cachedProject;
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const project = await Projects.findById(id);
  if (project) {
    try {
      await cacheData(`project_${id}`, project);
    } catch (err) {
      console.error("Redis cache set error:", err);
    }
  }
  return project;
};

const getAllProjectsService = async () => {
  try {
    const cachedProjects = await getCachedData<IProjects[]>("all_projects");
    if (cachedProjects && Array.isArray(cachedProjects) && cachedProjects.length > 0) {
      return cachedProjects;
    }
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const projects = await Projects.find().sort({ createdAt: -1 });
  try {
    if (projects && projects.length > 0) {
      await cacheData("all_projects", projects);
    }
  } catch (err) {
    console.error("Redis cache set error:", err);
  }
  return projects;
};

const deleteProjectService = async (id: string) => {
  const deleted = await Projects.findByIdAndDelete(id);
  if (deleted) {
    try {
      await deleteCache(`project_${id}`);
      await deleteCache("all_projects");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return deleted;
};

export const projectsServices = {
  createProjectService,
  updateProjectService,
  getProjectByIdService,
  getAllProjectsService,
  deleteProjectService,
};

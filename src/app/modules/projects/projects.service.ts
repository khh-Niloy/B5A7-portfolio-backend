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

const formatProjectImages = (project: any): any => {
  if (!project) return project;
  const doc = typeof project.toObject === "function" ? project.toObject() : { ...project };
  if (!doc.images || !Array.isArray(doc.images) || doc.images.length === 0) {
    doc.images = doc.image ? [doc.image] : [];
  }
  if (!doc.shortDes && doc.overview) {
    doc.shortDes = doc.overview;
  }
  return doc;
};

const getProjectByIdService = async (id: string) => {
  try {
    const cachedProject = await getCachedData<IProjects>(`project_${id}`);
    if (cachedProject) return formatProjectImages(cachedProject);
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const project = await Projects.findById(id);
  if (project) {
    const formatted = formatProjectImages(project);
    try {
      await cacheData(`project_${id}`, formatted);
    } catch (err) {
      console.error("Redis cache set error:", err);
    }
    return formatted;
  }
  return project;
};

const getAllProjectsService = async () => {
  try {
    const cachedProjects = await getCachedData<IProjects[]>("all_projects");
    if (cachedProjects && Array.isArray(cachedProjects) && cachedProjects.length > 0) {
      return cachedProjects.map(formatProjectImages);
    }
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const projects = await Projects.find().sort({ createdAt: -1 });
  const formattedProjects = (projects || []).map(formatProjectImages);
  try {
    if (formattedProjects && formattedProjects.length > 0) {
      await cacheData("all_projects", formattedProjects);
    }
  } catch (err) {
    console.error("Redis cache set error:", err);
  }
  return formattedProjects;
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

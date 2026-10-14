import { ISkills, SkillCategory } from "./skills.interface";
import { Skills } from "./skills.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createSkillsService = async (payload: ISkills) => {
  const skills = await Skills.create(payload);
  try {
    await deleteCache("all_skills");
  } catch (err) {
    console.error("Redis cache delete error:", err);
  }
  return skills;
};

const getSkillsService = async () => {
  try {
    const cachedSkills = await getCachedData<ISkills[]>("all_skills");
    if (cachedSkills && Array.isArray(cachedSkills) && cachedSkills.length > 0) {
      return cachedSkills;
    }
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const skills = await Skills.find().sort({ order: 1, createdAt: 1 });
  try {
    if (skills && skills.length > 0) {
      await cacheData("all_skills", skills);
    }
  } catch (err) {
    console.error("Redis cache set error:", err);
  }
  return skills;
};

const updateSkillsService = async (id: string, payload: Partial<ISkills>) => {
  const updated = await Skills.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (updated) {
    try {
      await deleteCache("all_skills");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return updated;
};

const deleteSkillsService = async (id: string) => {
  const deleted = await Skills.findByIdAndDelete(id);
  if (deleted) {
    try {
      await deleteCache("all_skills");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return deleted;
};

const addSkillsToCategoryService = async (
  category: SkillCategory,
  skills: string[]
) => {
  const updated = await Skills.findOneAndUpdate(
    { category: { $regex: new RegExp(`^${category}$`, "i") } },
    { $addToSet: { skills: { $each: skills } } },
    { new: true, upsert: true, runValidators: true }
  );

  if (updated) {
    try {
      await deleteCache("all_skills");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return updated;
};

const upsertSkillsForCategory = async (
  category: SkillCategory,
  skills: string[]
) => {
  const updated = await Skills.findOneAndUpdate(
    { category: { $regex: new RegExp(`^${category}$`, "i") } },
    { $set: { category, skills } },
    { new: true, upsert: true, runValidators: true }
  );
  if (updated) {
    try {
      await deleteCache("all_skills");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return updated;
};

export const skillsServices = {
  createSkillsService,
  getSkillsService,
  updateSkillsService,
  deleteSkillsService,
  addSkillsToCategoryService,
  upsertSkillsForCategory,
};

import { ISkills, SkillCategory } from "./skills.interface";
import { Skills } from "./skills.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createSkillsService = async (payload: ISkills) => {
  const skills = await Skills.create(payload);
  await deleteCache("all_skills");
  return skills;
};

const getSkillsService = async () => {
  const cachedSkills = await getCachedData<ISkills[]>("all_skills");
  if (cachedSkills) return cachedSkills;

  const skills = await Skills.find();
  await cacheData("all_skills", skills);
  return skills;
};

const updateSkillsService = async (id: string, payload: Partial<ISkills>) => {
  const updated = await Skills.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (updated) {
    await deleteCache("all_skills");
  }
  return updated;
};

const addSkillsToCategoryService = async (
  category: SkillCategory,
  skills: string[]
) => {
  const updated = await Skills.findOneAndUpdate(
    { category },
    { $addToSet: { skills: { $each: skills } } },
    { new: true, upsert: true, runValidators: true }
  );

  if (updated) {
    await deleteCache("all_skills");
  }
  return updated;
};

const upsertSkillsForCategory = async (
  category: SkillCategory,
  skills: string[]
) => {
  const updated = await Skills.findOneAndUpdate(
    { category },
    { $addToSet: { skills: { $each: skills } } },
    { new: true, upsert: true, runValidators: true }
  );
  if (updated) {
    await deleteCache("all_skills");
  }
  return updated;
};

export const skillsServices = {
  createSkillsService,
  getSkillsService,
  updateSkillsService,
  addSkillsToCategoryService,
  upsertSkillsForCategory,
};

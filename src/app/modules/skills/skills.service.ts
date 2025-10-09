import { ISkills, SkillCategory } from "./skills.interface";
import { Skills } from "./skills.model";

const createSkillsService = async (payload: ISkills) => {
  const skills = await Skills.create(payload);
  return skills;
};

const getSkillsService = async () => {
  const skills = await Skills.find();
  return skills;
};

const updateSkillsService = async (id: string, payload: Partial<ISkills>) => {
  const updated = await Skills.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
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
  return updated;
};

export const skillsServices = {
  createSkillsService,
  getSkillsService,
  updateSkillsService,
  addSkillsToCategoryService,
  upsertSkillsForCategory,
};

type SkillCategory = string;

interface ISkills {
  _id?: string;
  category: SkillCategory;
  skills: string[];
  order?: number;
}

export { ISkills, SkillCategory };

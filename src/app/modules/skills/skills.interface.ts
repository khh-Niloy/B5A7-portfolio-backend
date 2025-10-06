type SkillCategory = "frontend" | "backend" | "database" | "Tools & Services";

interface ISkills {
  category: SkillCategory;
  skills: string[];
}

export { ISkills, SkillCategory };

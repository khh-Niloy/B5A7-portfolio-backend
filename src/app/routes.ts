import { Router } from "express";
import { aboutRoutes } from "./modules/about/about.routes";
import { skillsRoutes } from "./modules/skills/skills.routes";
import { projectsRoutes } from "./modules/projects/projects.routes";
import { blogRoutes } from "./modules/blog/blog.routes";
// import { authRoutes } from "./modules/auth/auth.routes";

export const routes = Router()

const allRoutes = [
    // {path: "/auth", route: authRoutes},
    {path: "/about", route: aboutRoutes},
    {path: "/skills", route: skillsRoutes},
    {path: "/projects", route: projectsRoutes},
    {path: "/blog", route: blogRoutes},
]

allRoutes.forEach(({path, route}) => routes.use(path, route))
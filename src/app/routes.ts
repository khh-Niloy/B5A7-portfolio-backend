import { Router } from "express";
import { aboutRoutes } from "./modules/dashboard/about.routes";
// import { authRoutes } from "./modules/auth/auth.routes";

export const routes = Router()

const allRoutes = [
    // {path: "/auth", route: authRoutes},
    {path: "/about", route: aboutRoutes},
]

allRoutes.forEach(({path, route}) => routes.use(path, route))
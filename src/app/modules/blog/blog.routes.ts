import { Router } from "express";
import { blogController } from "./blog.controller";
import { multerUpload } from "../../config/multer.config";

export const blogRoutes = Router()

blogRoutes.post("/", multerUpload.array("files"), blogController.createBlog)
blogRoutes.patch("/:id", multerUpload.array("files"), blogController.updateBlog)
blogRoutes.get("/:id", blogController.getBlogById)
blogRoutes.get("/", blogController.getAllBlogs)



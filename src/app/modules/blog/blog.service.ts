import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";

const createBlogService = async (payload: IBlog) => {
  const blog = await Blog.create(payload);
  return blog;
};

const updateBlogService = async (id: string, payload: Partial<IBlog>) => {
  const updated = await Blog.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return updated;
};

const getBlogByIdService = async (id: string) => {
  const blog = await Blog.findById(id);
  return blog;
};

const getAllBlogsService = async () => {
  const blogs = await Blog.find().sort({ publishDate: -1 });
  return blogs;
};

export const blogServices = {
  createBlogService,
  updateBlogService,
  getBlogByIdService,
  getAllBlogsService,
};



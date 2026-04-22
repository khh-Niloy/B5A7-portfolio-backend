import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createBlogService = async (payload: IBlog) => {
  const blog = await Blog.create(payload);
  await deleteCache("all_blogs");
  return blog;
};

const updateBlogService = async (id: string, payload: Partial<IBlog>) => {
  const updated = await Blog.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (updated) {
    await deleteCache(`blog_${id}`);
    await deleteCache("all_blogs");
  }
  return updated;
};

const getBlogByIdService = async (id: string) => {
  const cachedBlog = await getCachedData<IBlog>(`blog_${id}`);
  if (cachedBlog) return cachedBlog;

  const blog = await Blog.findById(id);
  if (blog) {
    await cacheData(`blog_${id}`, blog);
  }
  return blog;
};

const getAllBlogsService = async () => {
  const cachedBlogs = await getCachedData<IBlog[]>("all_blogs");
  if (cachedBlogs) return cachedBlogs;

  const blogs = await Blog.find().sort({ publishDate: -1 });
  await cacheData("all_blogs", blogs);
  return blogs;
};

export const blogServices = {
  createBlogService,
  updateBlogService,
  getBlogByIdService,
  getAllBlogsService,
};



import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createBlogService = async (payload: IBlog) => {
  const blog = await Blog.create(payload);
  try {
    await deleteCache("all_blogs");
  } catch (err) {
    console.error("Redis cache delete error:", err);
  }
  return blog;
};

const updateBlogService = async (id: string, payload: Partial<IBlog>) => {
  const updated = await Blog.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (updated) {
    try {
      await deleteCache(`blog_${id}`);
      await deleteCache("all_blogs");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return updated;
};

const getBlogByIdService = async (id: string) => {
  try {
    const cachedBlog = await getCachedData<IBlog>(`blog_${id}`);
    if (cachedBlog) return cachedBlog;
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const blog = await Blog.findById(id);
  if (blog) {
    try {
      await cacheData(`blog_${id}`, blog);
    } catch (err) {
      console.error("Redis cache set error:", err);
    }
  }
  return blog;
};

const getAllBlogsService = async () => {
  try {
    const cachedBlogs = await getCachedData<IBlog[]>("all_blogs");
    if (cachedBlogs && Array.isArray(cachedBlogs) && cachedBlogs.length > 0) {
      return cachedBlogs;
    }
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const blogs = await Blog.find().sort({ createdAt: -1 });
  try {
    if (blogs && blogs.length > 0) {
      await cacheData("all_blogs", blogs);
    }
  } catch (err) {
    console.error("Redis cache set error:", err);
  }
  return blogs;
};

const deleteBlogService = async (id: string) => {
  const deleted = await Blog.findByIdAndDelete(id);
  if (deleted) {
    try {
      await deleteCache(`blog_${id}`);
      await deleteCache("all_blogs");
    } catch (err) {
      console.error("Redis cache delete error:", err);
    }
  }
  return deleted;
};

export const blogServices = {
  createBlogService,
  updateBlogService,
  getBlogByIdService,
  getAllBlogsService,
  deleteBlogService,
};

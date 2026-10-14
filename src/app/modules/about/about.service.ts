import { IAbout } from "./about.interface";
import { About } from "./about.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createAboutService = async (payload: IAbout) => {
  if (payload?.aboutInfo?.sampleText) {
    if (typeof payload.aboutInfo.sampleText === "string") {
      payload.aboutInfo.sampleText = (payload.aboutInfo.sampleText as string)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  const aboutContent = await About.create(payload);
  try {
    await deleteCache("about_content");
  } catch (err) {
    console.error("Redis cache delete error:", err);
  }
  return aboutContent;
};

const getAboutContentService = async () => {
  try {
    const cachedAbout = await getCachedData<IAbout[]>("about_content");
    if (cachedAbout && Array.isArray(cachedAbout) && cachedAbout.length > 0) {
      return cachedAbout;
    }
  } catch (err) {
    console.error("Redis cache get error:", err);
  }

  const aboutContent = await About.find();
  try {
    if (aboutContent && aboutContent.length > 0) {
      await cacheData("about_content", aboutContent);
    }
  } catch (err) {
    console.error("Redis cache set error:", err);
  }
  return aboutContent;
};

const updateAboutContentService = async (payload: Partial<IAbout>, id?: string) => {
  if (payload.aboutInfo?.sampleText) {
    if (typeof payload.aboutInfo.sampleText === "string") {
      payload.aboutInfo.sampleText = (payload.aboutInfo.sampleText as string)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  let existingDoc = null;
  if (id && id !== "undefined" && id !== "null") {
    existingDoc = await About.findById(id);
  }
  if (!existingDoc) {
    existingDoc = await About.findOne();
  }

  let updatedAboutContent;
  if (existingDoc) {
    updatedAboutContent = await About.findByIdAndUpdate(existingDoc._id, payload, {
      new: true,
      runValidators: true,
    });
  } else {
    updatedAboutContent = await About.create(payload);
  }

  try {
    await deleteCache("about_content");
  } catch (err) {
    console.error("Redis cache delete error:", err);
  }

  return updatedAboutContent;
};

export const aboutServices = {
  createAboutService,
  getAboutContentService,
  updateAboutContentService,
};

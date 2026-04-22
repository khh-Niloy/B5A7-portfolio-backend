import { IAbout } from "./about.interface";
import { About } from "./about.model";
import { cacheData, deleteCache, getCachedData } from "../../utils/redis";

const createAboutService = async (payload: IAbout) => {
  if (payload?.aboutInfo?.sampleText) {
    payload.aboutInfo.sampleText = (
      payload?.aboutInfo?.sampleText as unknown as string
    )
      .split(",")
      .map((item) => item.trim());
  }
  const aboutContent = await About.create(payload);
  console.log(aboutContent);
  await deleteCache("about_content");
  return aboutContent;
};

const getAboutContentService = async () => {
  const cachedAbout = await getCachedData<IAbout[]>("about_content");
  if (cachedAbout) return cachedAbout;

  const aboutContent = await About.find();
  await cacheData("about_content", aboutContent);
  return aboutContent;
};

const updateAboutContentService = async (payload: Partial<IAbout>, id: string) => {
  if (!id) {
    throw new Error("ID is required");
  }

  console.log(payload);
  console.log(id);
  
  const existingDoc = await About.findById(id);
  if (!existingDoc) {
    throw new Error("About content not found");
  }
  
  if (payload.aboutInfo?.sampleText) {
    payload.aboutInfo.sampleText = (
      payload.aboutInfo.sampleText as unknown as string
    )
      .split(",")
      .map((item) => item.trim());
  }
  
  const updatedAboutContent = await About.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (updatedAboutContent) {
    await deleteCache("about_content");
  }
  return updatedAboutContent;
};

export const aboutServices = {
  createAboutService,
  getAboutContentService,
  updateAboutContentService,
};

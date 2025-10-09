import { IAbout } from "./about.interface";
import { About } from "./about.model";

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
  return aboutContent;
};

const getAboutContentService = async () => {
  const aboutContent = await About.find();
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
  return updatedAboutContent;
};

export const aboutServices = {
  createAboutService,
  getAboutContentService,
  updateAboutContentService,
};

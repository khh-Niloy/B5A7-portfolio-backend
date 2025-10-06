import {
  IAbout,
  IAboutInfo,
  IContacts,
  IJourney,
  IUniversityInfo,
} from "./about.interface";
import { model, Schema } from "mongoose";

const universityInfoSchema = new Schema<IUniversityInfo>(
  {
    varsity: { type: String, required: true },
    department: { type: String, required: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
  },
  { _id: false }
);

const journeySchema = new Schema<IJourney>(
  {
    year: { type: String, required: true },
    description: { type: String, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);

const contactsSchema = new Schema<IContacts>(
  {
    link: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const aboutInfoSchema = new Schema<IAboutInfo>(
  {
    sampleText: { type: [String], required: true },
    email: { type: String, required: true },
  },
  { _id: false }
);

export const aboutSchema = new Schema<IAbout>({
  universityInfo: universityInfoSchema,
  aboutInfo: aboutInfoSchema,
  journey: { type: [journeySchema], required: true },
  contacts: { type: [contactsSchema], required: true },
}, {
  timestamps: true,
});

export const About = model<IAbout>("About", aboutSchema);

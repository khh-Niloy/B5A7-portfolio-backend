import {
  IAbout,
  IAboutInfo,
  IContacts,
  IExperience,
  IJourney,
  IUniversityInfo,
  IAiTool,
  ICoreStack,
  IService,
  ICurrentlyBuilding,
  ICurrentlyLearning,
  IFaq,
  ISocialLink,
  ISeo,
  ICertification,
} from "./about.interface";
import { model, Schema } from "mongoose";

const universityInfoSchema = new Schema<IUniversityInfo>(
  {
    varsity: { type: String, default: "" },
    department: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endYear: { type: String, default: "" },
    degree: { type: String, default: "" },
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
    sampleText: { type: [String], default: [] },
    email: { type: String, default: "" },
  },
  { _id: false }
);

const experienceSchema = new Schema<IExperience>(
  {
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Schema.Types.Mixed, required: true },
    endDate: { type: Schema.Types.Mixed, required: true },
    location: { type: String, default: "remote" },
    jobType: { type: String, default: "full-time" },
    jobTechStack: { type: [String], default: [] },
    worked: { type: [String], default: [] },
    isCurrent: { type: Boolean, default: false },
  },
  { _id: false }
);

const aiToolSchema = new Schema<IAiTool>(
  {
    name: { type: String, required: true },
    color: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const coreStackSchema = new Schema<ICoreStack>(
  {
    name: { type: String, required: true },
    color: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const currentlyBuildingSchema = new Schema<ICurrentlyBuilding>(
  {
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
  },
  { _id: false }
);

const currentlyLearningSchema = new Schema<ICurrentlyLearning>(
  {
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
    badge: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    topics: { type: [String], default: [] },
  },
  { _id: false }
);

const faqSchema = new Schema<IFaq>(
  {
    id: { type: String, default: () => Math.random().toString(36).substring(2, 9) },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isSidebar: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const socialLinkSchema = new Schema<ISocialLink>(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    handle: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const seoSchema = new Schema<ISeo>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, default: "" },
  },
  { _id: false }
);

const certificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
  },
  { _id: false }
);

export const aboutSchema = new Schema<IAbout>(
  {
    // Hero & Identity
    name: { type: String, default: "Hasib Hossain Niloy" },
    title: { type: String, default: "Software Engineer & Full-Stack Builder" },
    avatar: { type: String, default: "https://avatars.githubusercontent.com/u/174131986?v=4" },
    tagline: { type: String, default: "I value ownership, problem solving, and taking responsibility for my work." },
    statusText: { type: String, default: "Open to Work & Collaboration" },
    seekingRole: { type: String, default: "Actively seeking Software Engineer roles" },
    location: { type: String, default: "Dhaka, Bangladesh" },
    timezone: { type: String, default: "Asia/Dhaka" },
    resumeUrl: { type: String, default: "https://drive.google.com/file/d/1mepMM01uzz6R7qLAdUZM-ODszg-Kvz7V/view?usp=sharing" },
    aiTools: { type: [aiToolSchema], default: [] },
    coreStack: { type: [coreStackSchema], default: [] },

    // About Content
    bioLead: { type: String, default: "" },
    bioExpanded: { type: [String], default: [] },
    workValues: { type: [String], default: ["High ownership", "Clean architecture", "Continuous learner"] },
    remoteText: { type: String, default: "Comfortable across global teams, shipping robust code with disciplined ownership." },

    // Education, Journey, Experience
    universityInfo: universityInfoSchema,
    education: { type: [universityInfoSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    aboutInfo: aboutInfoSchema,
    journey: { type: [journeySchema], default: [] },
    contacts: { type: [contactsSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },

    // Highlights & Sidebar
    currentlyBuilding: currentlyBuildingSchema,
    currentlyLearning: currentlyLearningSchema,
    faqs: { type: [faqSchema], default: [] },

    // Services & Socials
    services: { type: [serviceSchema], default: [] },
    socialLinks: { type: [socialLinkSchema], default: [] },

    // SEO
    seo: seoSchema,
  },
  {
    timestamps: true,
  }
);

export const About = model<IAbout>("About", aboutSchema);

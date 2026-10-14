interface IUniversityInfo {
  varsity: string;
  department: string;
  startYear: string;
  endYear: string;
  degree?: string;
}

interface IJourney {
  year: string;
  description: string;
  title: string;
}

interface IContacts {
  link: string;
  name: string;
}

interface IAboutInfo {
  sampleText: string[];
  email: string;
}

interface IExperience {
  companyName: string;
  role: string;
  startDate: Date | string;
  endDate: "present" | Date | string;
  location: "remote" | "onsite" | "hybrid" | string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | string;
  jobTechStack: string[];
  worked: string[];
  isCurrent?: boolean;
}

interface IAiTool {
  name: string;
  color?: string;
  icon?: string;
}

interface ICoreStack {
  name: string;
  color?: string;
  icon?: string;
}

interface IService {
  title: string;
  desc: string;
  icon?: string;
  link?: string;
}

interface ICurrentlyBuilding {
  title: string;
  desc: string;
  liveUrl?: string;
  repoUrl?: string;
}

interface ICurrentlyLearning {
  title: string;
  desc: string;
  badge?: string;
  repoUrl?: string;
  topics?: string[];
}

interface IFaq {
  id?: string;
  question: string;
  answer: string;
  isSidebar?: boolean;
  isPublic?: boolean;
  order?: number;
}

interface ISocialLink {
  name: string;
  link: string;
  handle?: string;
  icon?: string;
}

interface ISeo {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

interface ICertification {
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

interface IAbout {
  _id?: string;
  // Hero & Identity
  name?: string;
  title?: string;
  avatar?: string;
  tagline?: string;
  statusText?: string;
  seekingRole?: string;
  location?: string;
  timezone?: string;
  resumeUrl?: string;
  aiTools?: IAiTool[];
  coreStack?: ICoreStack[];

  // About Content
  bioLead?: string;
  bioExpanded?: string[];
  workValues?: string[];
  remoteText?: string;

  // Education & Journey
  universityInfo?: IUniversityInfo;
  education?: IUniversityInfo[];
  certifications?: ICertification[];
  journey?: IJourney[];
  experience?: IExperience[];

  // Highlights & Sidebar
  currentlyBuilding?: ICurrentlyBuilding;
  currentlyLearning?: ICurrentlyLearning;
  faqs?: IFaq[];

  // Services, Socials & Contact
  services?: IService[];
  socialLinks?: ISocialLink[];
  contacts?: IContacts[];
  aboutInfo?: IAboutInfo;

  // SEO
  seo?: ISeo;

  createdAt?: Date;
  updatedAt?: Date;
}

export {
  IAbout,
  IUniversityInfo,
  IJourney,
  IContacts,
  IAboutInfo,
  IExperience,
  IAiTool,
  ICoreStack,
  IService,
  ICurrentlyBuilding,
  ICurrentlyLearning,
  IFaq,
  ISocialLink,
  ISeo,
  ICertification,
};

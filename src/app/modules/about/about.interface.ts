interface IUniversityInfo {
  varsity: string;
  department: string;
  startYear: string;
  endYear: string;
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
  startDate: Date;
  endDate: "present" | Date;
  location: "remote" | "onsite" | "hybrid";
  jobType: "full-time" | "part-time" | "contract" | "internship";
  jobTechStack: string[];
  worked: string[];
}

interface IAbout {
  _id?: string;
  universityInfo?: IUniversityInfo;
  aboutInfo?: IAboutInfo;
  journey?: IJourney[];
  contacts?: IContacts[];
  experience?: IExperience[];
}

export { IAbout, IUniversityInfo, IJourney, IContacts, IAboutInfo, IExperience };

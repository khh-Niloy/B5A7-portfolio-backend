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

interface IAbout {
  _id?: string;
  universityInfo?: IUniversityInfo;
  aboutInfo?: IAboutInfo;
  journey?: IJourney[];
  contacts?: IContacts[];
}

export { IAbout, IUniversityInfo, IJourney, IContacts, IAboutInfo };

export interface IDetails {
  projectName: string;
  tagline: string;
  problemSolution: string;
  features: string[];
  techStack: string[];
  dependencies: string[];
  responsibilities: string;
  liveSite: string;
  githubRepo: string;
}

export interface IProjects {
  image: string;
  projectName: string;
  shortDes: string;
  techStack: string[];
  liveSite: string;
  details: IDetails;
}
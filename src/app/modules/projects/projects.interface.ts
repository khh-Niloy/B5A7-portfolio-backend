export interface IProjects {
  image: string; // Thumbnail image for cards
  images?: string[]; // Multiple detail images for modal
  projectName: string;
  tagline: string;
  role?: string;
  status?: string;
  techStack: string[];
  liveSite: string;
  frontendRepo?: string;
  backendRepo?: string;
  githubRepo?: string;
  backendLive?: string;
  rerankerRepo?: string;
  demoCheckerRepo?: string;
  technicalHighlights?: string;
  projectType: "client project" | "personal project";
  isActive?: boolean;

  // Case Study Sections strictly following framework / output.md
  overview?: string; // Section 1. Overview
  problem?: string; // Section 2. Problem
  myContribution?: string; // Section 3. My Contribution
  architecture?: string; // Section 4. Architecture (ASCII diagram + Data Flows)
  keyDecisions?: string; // Section 5. Three Key Engineering Decisions
  resultsEvidence?: string; // Section 6. Results and Evidence
  limitationsNextSteps?: string; // Section 7. Limitations and Next Steps

  // Legacy fields preserved for backward compatibility
  shortDes?: string;
  problemSolution?: string;
  features?: string[];
  dependencies?: string;
  responsibilities?: string;
}

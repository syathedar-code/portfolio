export interface ServiceGroup {
  id: string;
  name: string;
  // status: "active" | "hardening";
  items: string[];
}

export interface ExperienceEntry {
  role: string;
  org: string;
  note: string;
  period: string;
  highlights: string[];
  tools: string[];
}

export interface Project {
  name: string;
  period: string;
  highlights: string[];
  tools: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  id?: string;
  credentialId?: string;
  skills?: string[];
  previewUrl?: string;
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  location: string;
  instagram: string;
  github?: string;
}

export interface Item {
  id: string;
  title: string;
  excerpt: string;
  category: "blog" | "newsletter";
  date: string; // ISO format: "2026-03-15"
}
import type { ServiceGroup } from "../types";

export const skills: ServiceGroup[] = [
  {
    id: "languages",
    name: "languages.service",
    // status: "active",
    items: ["Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    id: "frontend",
    name: "frontend.service",
    // status: "active",
    items: ["React.js", "Responsive UI", "Component architecture", "Cross-browser debugging"],
  },
  {
    id: "backend",
    name: "backend.service",
    // status: "active",
    items: ["Node.js", "Django", "REST APIs", "LAMP stack"],
  },
  {
    id: "data",
    name: "data.service",
    // status: "active",
    items: ["MySQL", "PostgreSQL", "Schema design", "Query optimisation"],
  },
  {
    id: "security",
    name: "security.service",
    // status: "active",
    items: ["Linux", "SafeLine WAF", "SSL/TLS", "Log analysis", "OWASP ZAP"],
  },
  {
    id: "tooling",
    name: "tooling.service",
    // status: "active",
    items: ["Git", "VS Code", "VirtualBox", "Docker", "Github"],
  },
];

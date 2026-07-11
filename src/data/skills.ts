import type { ServiceGroup } from "../types";

export const skills: ServiceGroup[] = [
  {
    id: "languages",
    name: "languages.service",
    // status: "active",
    items: ["Python", "JavaScript", "HTML", "CSS", "SQL"],
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
    items: ["MySQL", "Schema design", "Query optimisation"],
  },
  {
    id: "security",
    name: "security.service",
    // status: "hardening",
    items: ["Kali / Ubuntu", "SafeLine WAF", "SSL/TLS", "Log analysis", "Docker"],
  },
  {
    id: "tooling",
    name: "tooling.service",
    // status: "active",
    items: ["Git", "VS Code", "VirtualBox", "Scikit-learn", "NumPy"],
  },
];

import type { Project } from "../types";

export const projects: Project[] = [
  {
    name: "full-stack-lamp-lab — web app security & backend hardening",
    period: "Aug – Sep 2025",
    highlights: [
      "Achieved zero critical vulnerabilities on post-config scanning by standing up a full LAMP environment from scratch, implementing SSL/TLS, firewall rules, and a SafeLine WAF via Docker.",
      "Cut deployment complexity by containerising the WAF service in Docker for reproducible, scalable service deployment.",
      "Reduced incident triage time by building a systematic log-analysis workflow that isolates root causes across frontend, backend, and infrastructure in one pass.",
    ],
    tools: ["Linux (Kali/Ubuntu)", "Apache", "MySQL", "PHP", "Docker", "VirtualBox", "Git"],
  },
  {
    name: "blood-cancer-detection — hybrid ensemble deep learning",
    period: "Mar – Jun 2024",
    highlights: [
      "Hit 96% classification accuracy on blood cancer detection by co-building a Python ML pipeline in a 4-member team, outperforming a single-model baseline by ~8 percentage points.",
      "Ensured fully reproducible results across all test iterations by managing data pre-processing and model validation workflows with Scikit-learn and NumPy.",
    ],
    tools: ["Python", "Scikit-learn", "NumPy", "GitHub", "VS Code"],
  },
  {
    name: "ecommerce-grocery-app — responsive full-stack web app",
    period: "Nov – Dec 2023",
    highlights: [
      "Improved simulated user retention by 15% by designing and building a responsive full-stack grocery app with login and session management.",
      "Contributed to architecture decisions and code reviews across a 4-member team.",
    ],
    tools: ["HTML", "CSS", "JavaScript", "Git", "VS Code"],
  },
];

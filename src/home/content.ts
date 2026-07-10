import { interests, projects } from "../data";

export type ResearchAreaId = "agents" | "computational" | "visualization" | "ai-science";
export type EvidenceId = "hydrogen" | "em" | "memory" | "solid";
export type PreviewVariant = "orbital" | "wave" | "memory" | "lattice";

export type ResearchArea = {
  id: ResearchAreaId;
  label: string;
  labelZh: string;
  detail: string;
  position: { x: number; y: number };
  evidenceIds: EvidenceId[];
};

export type EvidenceItem = {
  id: EvidenceId;
  titleZh: string;
  titleEn: string;
  description: string;
  tags: string[];
  preview: PreviewVariant;
  areaIds: ResearchAreaId[];
  demoHref?: string;
  githubHref?: string;
};

const memoryProject = projects.find((project) => project.title === "memory_engine") ?? projects[0];
const solidPhysicsProject =
  projects.find((project) => project.title === "solid-physics-visualizer") ?? projects[1] ?? projects[0];

export const researchAreas: ResearchArea[] = [
  {
    id: "agents",
    label: "AI Agent",
    labelZh: interests[0].zh,
    detail: interests[0].detailZh,
    position: { x: 50, y: 14 },
    evidenceIds: ["memory"],
  },
  {
    id: "computational",
    label: "Computational Physics",
    labelZh: interests[1].zh,
    detail: interests[1].detailZh,
    position: { x: 82, y: 44 },
    evidenceIds: ["hydrogen", "em", "solid"],
  },
  {
    id: "visualization",
    label: "Physics Visualization",
    labelZh: interests[2].zh,
    detail: interests[2].detailZh,
    position: { x: 57, y: 82 },
    evidenceIds: ["hydrogen", "em", "solid"],
  },
  {
    id: "ai-science",
    label: "AI for Science",
    labelZh: interests[3].zh,
    detail: interests[3].detailZh,
    position: { x: 17, y: 59 },
    evidenceIds: [],
  },
];

export const evidenceItems: EvidenceItem[] = [
  {
    id: "hydrogen",
    titleZh: "氢原子轨道可视化系统",
    titleEn: "Hydrogen Orbital Demo",
    description: "通过 n、l、m 量子数生成氢原子轨道电子云，并显示径向节点、角向节点和概率密度分布。",
    tags: ["React", "Three.js", "Quantum mechanics"],
    preview: "orbital",
    areaIds: ["computational", "visualization"],
    demoHref: "./hydrogen-orbital-demo/index.html",
    githubHref: "https://github.com/hengqi61-maker/hydrogen-orbital",
  },
  {
    id: "em",
    titleZh: "电磁波偏振演示系统",
    titleEn: "EM Polarization Demo",
    description: "展示 E、B 场关系，以及线偏振片对偏振态和强度的投影作用。",
    tags: ["Three.js", "Electromagnetic wave", "Polarization"],
    preview: "wave",
    areaIds: ["computational", "visualization"],
    demoHref: "./em-polarization/index.html",
  },
  {
    id: "memory",
    titleZh: "Memory Engine",
    titleEn: memoryProject.subtitle,
    description: memoryProject.problemZh,
    tags: memoryProject.tech,
    preview: "memory",
    areaIds: ["agents"],
    githubHref: memoryProject.url,
  },
  {
    id: "solid",
    titleZh: "固体物理可视化教具",
    titleEn: solidPhysicsProject.subtitle,
    description: solidPhysicsProject.problemZh,
    tags: solidPhysicsProject.tech,
    preview: "lattice",
    areaIds: ["computational", "visualization"],
    githubHref: solidPhysicsProject.url,
  },
];

export const proofEvidenceIds: EvidenceId[] = ["hydrogen", "em", "memory"];

export const evidencePrimaryArea: Record<EvidenceId, ResearchAreaId> = {
  hydrogen: "computational",
  em: "computational",
  memory: "agents",
  solid: "visualization",
};

export const researchRoad = [
  {
    title: "观察问题",
    en: "Observe",
    detail: "从物理现象和学习困惑中提炼真正值得建模的问题。",
  },
  {
    title: "建模抽象",
    en: "Model",
    detail: "把概念转化为变量、边界条件、状态空间和可计算结构。",
  },
  {
    title: "数值模拟",
    en: "Simulate",
    detail: "用代码验证推导、参数和模型行为，而不是停留在描述层。",
  },
  {
    title: "可视化解释",
    en: "Explain",
    detail: "把抽象对象变成可交互、可比较、可讲清楚的图形证据。",
  },
  {
    title: "智能协作",
    en: "Collaborate",
    detail: "探索 AI Agent 如何辅助文献、代码实验和科研工作流。",
  },
];

export const homeNavigation = [
  { label: "Home", href: "#top", sectionId: "top" },
  { label: "Research", href: "#research", sectionId: "research" },
  { label: "Evidence", href: "#projects", sectionId: "projects" },
  { label: "Education", href: "#education", sectionId: "education" },
  { label: "Album", href: "#album-teaser", sectionId: "album-teaser" },
  { label: "Camps", href: "#camps", sectionId: "camps" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
] as const;

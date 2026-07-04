import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  BookOpen,
  Camera,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Mail,
  Microscope,
  Network,
  Sigma,
  Target,
} from "lucide-react";
import "./styles.css";
import {
  education,
  graduatePlan,
  honors,
  interests,
  metrics,
  profile,
  projects,
  summerCamps,
  targetMatrix,
} from "./data";

const iconMap = [Sigma, Microscope, Network, BookOpen];

const featuredDemos = [
  {
    title: "hydrogen-orbital",
    subtitle: "氢原子轨道电子云 · 量子数驱动的可视化",
    tags: ["React", "Three.js", "Quantum mechanics"],
    problem:
      "通过 n、l、m 量子数生成氢原子轨道电子云，并显示径向节点、角向节点和概率密度分布。",
    evidence:
      "Interactive hydrogen orbital electron-cloud visualization with editable quantum numbers and orbital metadata.",
    sectionHref: "#hydrogen-demo",
    externalHref: "./hydrogen-orbital-demo/index.html",
    githubHref: "https://github.com/hengqi61-maker/hydrogen-orbital",
  },
  {
    title: "em-polarization-demo",
    subtitle: "偏振态交互演示 · Maxwell plane-wave intuition",
    tags: ["Three.js", "Electromagnetic wave", "Polarization"],
    problem:
      "电磁波沿 +z 传播时的 E、B 场关系，以及线偏振片对偏振态和强度的投影作用。",
    evidence:
      "Interactive Maxwell plane-wave visualization with polarizer projection and intensity changes.",
    sectionHref: "#em-demo",
    externalHref: "./em-polarization/index.html",
  },
];

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-title ${align === "center" ? "centered" : ""}`}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{subtitle}</span>
    </div>
  );
}

function HeroActions({
  compact = false,
  includeStatement = false,
}: {
  compact?: boolean;
  includeStatement?: boolean;
}) {
  return (
    <div className={`action-row ${compact ? "compact" : ""}`}>
      <a className="button primary" href={profile.cv} target="_blank" rel="noreferrer">
        <FileText size={18} />
        查看简历
      </a>
      {includeStatement && (
        <a className="button secondary" href={profile.statementPdf} target="_blank" rel="noreferrer">
          <FileText size={18} />
          查看个人简述
        </a>
      )}
      <a className="button primary" href={profile.interviewDeck} download>
        <Download size={18} />
        下载面试 PPT
      </a>
      <a className="button secondary" href={profile.github} target="_blank" rel="noreferrer">
        <Github size={18} />
        GitHub
      </a>
      <a className="button secondary" href="./album/index.html">
        <Camera size={18} />
        个人爱好 · 相册
      </a>
    </div>
  );
}

function MetricStrip() {
  return (
    <section className="metric-strip" aria-label="Academic metrics">
      {metrics.map((item) => (
        <article className="metric-item" key={item.labelEn}>
          <strong>{item.value}</strong>
          <span>{item.labelZh}</span>
          <small>{item.labelEn}</small>
        </article>
      ))}
    </section>
  );
}

function ResearchInterest({
  item,
  index,
}: {
  item: (typeof interests)[number];
  index: number;
}) {
  const Icon = iconMap[index] ?? BookOpen;

  return (
    <article className="interest">
      <div className="interest-icon">
        <Icon size={22} />
      </div>
      <h3>{item.zh}</h3>
      <h4>{item.en}</h4>
      <p>{item.detailZh}</p>
      <small>{item.detailEn}</small>
    </article>
  );
}

function FeaturedDemoCard({ demo }: { demo: (typeof featuredDemos)[number] }) {
  return (
    <article className="featured-demo-card">
      <div className="project-head">
        <div>
          <span className="project-type">Featured interactive proof</span>
          <h3>{demo.title}</h3>
          <p>{demo.subtitle}</p>
        </div>
        <a className="icon-link" href={demo.sectionHref} aria-label={`Open ${demo.title} section`}>
          <ArrowUpRight size={20} />
        </a>
      </div>
      <div className="tags">
        {demo.tags.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <dl className="evidence-list">
        <dt>Problem</dt>
        <dd>{demo.problem}</dd>
        <dt>Evidence</dt>
        <dd className="en">{demo.evidence}</dd>
      </dl>
      <div className="inline-links">
        <a href={demo.sectionHref}>页面内嵌演示</a>
        <a href={demo.externalHref} target="_blank" rel="noreferrer">
          独立打开
        </a>
        {demo.githubHref && (
          <a href={demo.githubHref} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
      </div>
    </article>
  );
}

function EvidenceProject({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="evidence-project">
      <div className="project-head">
        <div>
          <span className="project-type">GitHub repository</span>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>
        <a className="icon-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`}>
          <ArrowUpRight size={20} />
        </a>
      </div>
      <div className="tags">
        {project.tech.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <dl className="evidence-list">
        <dt>Problem</dt>
        <dd>{project.problemZh}</dd>
        <dd className="en">{project.problemEn}</dd>
        <dt>Method</dt>
        <dd>{project.methodZh}</dd>
        <dd className="en">{project.methodEn}</dd>
        <dt>Evidence</dt>
        <dd>{project.evidenceZh}</dd>
        <dd className="en">{project.evidenceEn}</dd>
      </dl>
    </article>
  );
}

function DemoFeatureSection({
  id,
  eyebrow,
  title,
  subtitle,
  href,
  iframeTitle,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  iframeTitle: string;
}) {
  return (
    <section className="demo-feature" id={id}>
      <div className="demo-copy">
        <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <a className="button demo-button" href={href} target="_blank" rel="noreferrer">
          <ExternalLink size={18} />
          独立打开演示
        </a>
      </div>
      <div className="demo-frame-shell">
        <iframe title={iframeTitle} src={href} allow="fullscreen" />
      </div>
    </section>
  );
}

function EducationBlock() {
  return (
    <section className="section education-contact" id="education">
      <div className="education-panel">
        <SectionTitle
          eyebrow="Education"
          title="学业基础支撑建模与计算"
          subtitle="Physics and mathematics coursework as the base for computational training."
        />
        <article className="education-card">
          <GraduationCap size={26} />
          <h3>{education.school}</h3>
          <p>{education.program}</p>
          <span>{education.period}</span>
        </article>
        <div className="course-list">
          {education.courses.map((course) => (
            <span key={course}>{course}</span>
          ))}
        </div>
      </div>
      <aside className="honors">
        <h3>荣誉与竞赛 / Honors</h3>
        <ul>
          {honors.map((honor) => (
            <li key={honor}>{honor}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function ContactBlock() {
  return (
    <section className="contact" id="contact">
      <div>
        <p className="kicker">Contact</p>
        <h2>欢迎通过邮箱或 GitHub 联系我</h2>
        <p>
          I am open to academic communication around computational physics,
          physics visualization, and AI-assisted research tools.
        </p>
      </div>
      <div className="contact-actions">
        <a href={`mailto:${profile.email}`}>
          <Mail size={18} />
          {profile.email}
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Github size={18} />
          {profile.githubLabel}
        </a>
      </div>
    </section>
  );
}

function GraduateMatrix() {
  return (
    <div className="matrix-table" role="table" aria-label="Graduate target matching matrix">
      <div className="matrix-row matrix-head" role="row">
        <span role="columnheader">学校 / 平台</span>
        <span role="columnheader">导师</span>
        <span role="columnheader">排序</span>
        <span role="columnheader">优先级</span>
        <span role="columnheader">难度</span>
        <span role="columnheader">匹配理由与备注</span>
      </div>
      {targetMatrix.map((target) => (
        <article className="matrix-row" role="row" key={target.school}>
          <span role="cell" data-label="学校 / 平台">
            {target.school}
          </span>
          <span role="cell" data-label="导师">
            {target.mentors}
          </span>
          <span role="cell" data-label="排序">
            {target.order}
          </span>
          <span role="cell" data-label="优先级">
            <strong>{target.priority}</strong>
          </span>
          <span role="cell" data-label="难度">
            <strong>{target.difficulty}</strong>
          </span>
          <span role="cell" data-label="匹配理由与备注">
            {target.rationale}
            <em>{target.note}</em>
          </span>
        </article>
      ))}
    </div>
  );
}

function SummerCampSection() {
  return (
    <section className="section camp-section" id="camps">
      <div className="plan-heading">
        <SectionTitle eyebrow="Summer Camps" title={summerCamps.title} subtitle={summerCamps.subtitle} />
        <span className="status-pill">Updated {summerCamps.updatedAt}</span>
      </div>
      <article className="camp-statement">
        <CalendarDays size={26} />
        <p>{summerCamps.statement}</p>
      </article>
      <div className="camp-table" role="table" aria-label="Summer camp admissions and attendance plan">
        <div className="camp-row camp-head" role="row">
          <span role="columnheader">学校 / 院系</span>
          <span role="columnheader">活动</span>
          <span role="columnheader">举办时间</span>
          <span role="columnheader">当前状态</span>
          <span role="columnheader">公开备注</span>
        </div>
        {summerCamps.rows.map((camp) => (
          <article className="camp-row" role="row" key={`${camp.school}-${camp.program}`}>
            <span role="cell" data-label="学校 / 院系">
              {camp.school}
            </span>
            <span role="cell" data-label="活动">
              {camp.program}
            </span>
            <span role="cell" data-label="举办时间">
              {camp.time}
            </span>
            <span role="cell" data-label="当前状态">
              <strong className={`camp-status ${camp.statusKey}`}>{camp.status}</strong>
            </span>
            <span role="cell" data-label="公开备注">
              {camp.note}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function GraduatePlanSection() {
  return (
    <section className="section plan-section" id="plan">
      <div className="plan-heading">
        <SectionTitle eyebrow="Graduate Plan" title={graduatePlan.title} subtitle={graduatePlan.subtitle} />
        <span className="status-pill">Updated {graduatePlan.updatedAt}</span>
      </div>
      <div className="plan-intro">
        <article className="plan-statement">
          <Target size={26} />
          <p>{graduatePlan.statement}</p>
          <div className="action-row compact">
            <a className="button primary" href={profile.statementPdf} target="_blank" rel="noreferrer">
              <FileText size={18} />
              查看个人简述
            </a>
          </div>
        </article>
        <div className="plan-lists">
          <div>
            <h3>方向偏好</h3>
            <div className="tags">
              {graduatePlan.directions.map((direction) => (
                <span key={direction}>{direction}</span>
              ))}
            </div>
          </div>
          <div>
            <h3>匹配标准</h3>
            <div className="tags">
              {graduatePlan.criteria.map((criterion) => (
                <span key={criterion}>{criterion}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="statement-summary" aria-label="Statement summary">
        {graduatePlan.summary.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <GraduateMatrix />
    </section>
  );
}

function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Back to top">
          <span>QH</span>
          <strong>{profile.nameZh}</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#research">Research</a>
          <a href="#projects">Projects</a>
          <a href="#hydrogen-demo">Orbital</a>
          <a href="#em-demo">EM Demo</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
          <a href="#camps">Camps</a>
          <a href="#plan">Plan</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">{profile.directionEn}</p>
          <h1>
            {profile.nameZh}
            <span>{profile.nameEn}</span>
          </h1>
          <p className="hero-statement">{profile.statementZh}</p>
          <p className="hero-statement-en">{profile.statementEn}</p>
          <p className="hero-school">
            {profile.schoolZh} · {profile.majorZh}
          </p>
          <HeroActions includeStatement />
        </div>
      </section>

      <MetricStrip />

      <section className="section intro-band" aria-label="Research positioning">
        <p>From Exploration to Practice</p>
        <h2>把自由探索的习惯，转化为面向物理与智能系统的技术实践。</h2>
        <span>
          My current focus connects AI agents, computational physics, visualization,
          and AI for Science through systems that can be implemented and tested.
        </span>
      </section>

      <section className="section" id="research">
        <SectionTitle
          eyebrow="Research Interests"
          title="研究兴趣围绕物理问题的计算表达"
          subtitle="The common thread is translating physics concepts into computable, testable, and explainable systems."
          align="center"
        />
        <div className="interest-grid">
          {interests.map((item, index) => (
            <ResearchInterest item={item} index={index} key={item.en} />
          ))}
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <SectionTitle
          eyebrow="Selected Projects"
          title="项目证据来自公开仓库和可交互演示"
          subtitle="Each project is organized around the problem, method, and evidence a supervisor can evaluate quickly."
          align="center"
        />
        <div className="featured-demo-grid">
          {featuredDemos.map((demo) => (
            <FeaturedDemoCard demo={demo} key={demo.title} />
          ))}
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <EvidenceProject project={project} key={project.title} />
          ))}
        </div>
      </section>

      <DemoFeatureSection
        id="hydrogen-demo"
        eyebrow="Interactive Demo"
        title="氢原子轨道电子云可视化"
        subtitle="Edit n, l, and m to inspect electron-cloud probability density, radial nodes, angular nodes, and orbital metadata."
        href="./hydrogen-orbital-demo/index.html"
        iframeTitle="Hydrogen Orbital Electron Cloud Visualizer"
      />

      <DemoFeatureSection
        id="em-demo"
        eyebrow="Interactive Demo"
        title="偏振态交互演示"
        subtitle="Explore electromagnetic wave polarization, polarizer projection, and intensity attenuation through a direct 3D visual model."
        href="./em-polarization/index.html"
        iframeTitle="EM Polarization 3D Visualizer"
      />

      <EducationBlock />
      <ContactBlock />
      <SummerCampSection />
      <GraduatePlanSection />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

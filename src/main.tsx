import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  BookOpen,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Mail,
  Microscope,
  Network,
  Target,
  Sigma,
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
  targetMatrix,
} from "./data";

const iconMap = [Sigma, Microscope, Network, BookOpen];

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{subtitle}</span>
    </div>
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
          <a href="#plan">Plan</a>
          <a href="#projects">Projects</a>
          <a href="#em-demo">Demo</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
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
          <div className="hero-actions">
            <a className="button primary" href={profile.cv} download>
              <Download size={18} />
              下载简历
            </a>
            <a className="button secondary" href={profile.github} target="_blank" rel="noreferrer">
              <Github size={18} />
              GitHub
            </a>
          </div>
        </div>
        <aside className="hero-card" aria-label="Profile summary">
          <div className="avatar" aria-hidden="true">
            QH
          </div>
          <h2>{profile.schoolZh}</h2>
          <p>{profile.majorZh}</p>
          <p>{profile.schoolEn}</p>
          <div className="metric-grid">
            {metrics.map((item) => (
              <div className="metric" key={item.labelEn}>
                <strong>{item.value}</strong>
                <span>{item.labelZh}</span>
                <small>{item.labelEn}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="about-band" aria-label="About">
        <div>
          <strong>Current Focus</strong>
          <span>计算物理模拟 · 物理可视化 · AI 工具辅助科研</span>
        </div>
        <p>
          我希望把物理问题理解、数值建模和工程实现能力结合起来，在研究生阶段接受更系统的计算物理训练。
        </p>
      </section>

      <section className="section" id="research">
        <SectionTitle
          eyebrow="Research Interests"
          title="研究兴趣围绕物理问题的计算表达"
          subtitle="The common thread is translating physics concepts into computable, testable, and explainable systems."
        />
        <div className="interest-grid">
          {interests.map((item, index) => {
            const Icon = iconMap[index] ?? BookOpen;
            return (
              <article className="interest" key={item.en}>
                <Icon size={24} />
                <h3>{item.zh}</h3>
                <h4>{item.en}</h4>
                <p>{item.detailZh}</p>
                <small>{item.detailEn}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section plan-section" id="plan">
        <div className="plan-heading">
          <SectionTitle
            eyebrow="Graduate Plan"
            title={graduatePlan.title}
            subtitle={graduatePlan.subtitle}
          />
          <span className="status-pill">Current plan · Updated {graduatePlan.updatedAt}</span>
        </div>
        <div className="plan-intro">
          <article className="plan-statement">
            <Target size={26} />
            <p>{graduatePlan.statement}</p>
            <div className="hero-actions compact">
              <a className="button primary" href={profile.statementPdf} download>
                <Download size={18} />
                下载个人简述
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
      </section>

      <section className="section" id="projects">
        <SectionTitle
          eyebrow="Selected Projects"
          title="项目证据来自 GitHub 公开仓库"
          subtitle="Each project is presented by its problem, method, and evidence of capability."
        />
        <div className="project-grid">
          <article className="project project-demo">
            <div className="project-head">
              <div>
                <h3>em-polarization-demo</h3>
                <p>偏振态交互演示 · 今日临时入口</p>
              </div>
              <a href="#em-demo" aria-label="Open polarization demo section">
                <ArrowUpRight size={20} />
              </a>
            </div>
            <div className="tags">
              <span>Three.js</span>
              <span>Electromagnetic wave</span>
              <span>Polarization</span>
            </div>
            <dl>
              <dt>演示对象 / Demo</dt>
              <dd>电磁波沿 +z 传播时的 E、B 场关系，以及线偏振片对偏振态和强度的投影作用。</dd>
              <dd className="en">
                Interactive Maxwell plane-wave visualization with polarizer projection and intensity changes.
              </dd>
              <dt>打开方式 / Access</dt>
              <dd>
                <a className="text-link" href="#em-demo">
                  页面内嵌交互演示
                </a>
                <a className="text-link" href="./em-polarization/" target="_blank" rel="noreferrer">
                  独立打开
                </a>
              </dd>
            </dl>
          </article>
          {projects.map((project) => (
            <article className="project" key={project.title}>
              <div className="project-head">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.subtitle}</p>
                </div>
                <a href={project.url} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`}>
                  <ArrowUpRight size={20} />
                </a>
              </div>
              <div className="tags">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <dl>
                <dt>问题对象 / Problem</dt>
                <dd>{project.problemZh}</dd>
                <dd className="en">{project.problemEn}</dd>
                <dt>方法 / Method</dt>
                <dd>{project.methodZh}</dd>
                <dd className="en">{project.methodEn}</dd>
                <dt>能力证明 / Evidence</dt>
                <dd>{project.evidenceZh}</dd>
                <dd className="en">{project.evidenceEn}</dd>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="section demo-section" id="em-demo">
        <div className="demo-heading">
          <SectionTitle
            eyebrow="Interactive Demo"
            title="偏振态交互演示"
            subtitle="Temporary embedded demo for today: electromagnetic wave polarization, polarizer projection, and intensity attenuation."
          />
          <a className="button secondary" href="./em-polarization/" target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            独立打开演示
          </a>
        </div>
        <div className="demo-frame-shell">
          <iframe
            title="EM Polarization 3D Visualizer"
            src="./em-polarization/"
            allow="fullscreen"
          />
        </div>
      </section>

      <section className="section split" id="education">
        <div>
          <SectionTitle
            eyebrow="Education"
            title="学业基础支撑建模与计算"
            subtitle="Physics and mathematics coursework as the base for computational training."
          />
          <div className="education-card">
            <GraduationCap size={26} />
            <h3>{education.school}</h3>
            <p>{education.program}</p>
            <span>{education.period}</span>
          </div>
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
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

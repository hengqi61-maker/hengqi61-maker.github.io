import type { CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  Github,
  GraduationCap,
  Mail,
  Microscope,
  Network,
  Sigma,
} from "lucide-react";
import {
  education,
  honors,
  journeyRegions,
  metrics,
  profile,
  summerCamps,
  travelAlbums,
} from "../data";
import {
  evidenceItems,
  evidencePrimaryArea,
  researchRoad,
  type EvidenceItem,
  type ResearchAreaId,
} from "./content";
import { ScientificPreview } from "./Hero";
import { useReveal, useTilt } from "./motion";

const roadIcons = [Microscope, Sigma, Network, BookOpen, FileText];

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

export function ResearchRoad({ reducedMotion }: { reducedMotion: boolean }) {
  const reveal = useReveal<HTMLElement>(reducedMotion);

  return (
    <section
      ref={reveal.ref}
      className={`section research-road reveal-section ${reveal.visible ? "is-revealed" : ""}`}
      id="research"
    >
      <SectionTitle
        eyebrow="Research Road"
        title="我的研究路径"
        subtitle="从观察问题到智能协作，把物理概念组织成可计算、可验证、可解释的系统。"
        align="center"
      />
      <ol className="road-track">
        {researchRoad.map((node, index) => {
          const Icon = roadIcons[index] ?? BookOpen;
          return (
            <li className="road-node reveal-item" style={{ "--reveal-index": index } as CSSProperties} key={node.title}>
              <div className="road-icon">
                <Icon size={20} />
              </div>
              <strong>{node.title}</strong>
              <small>{node.en}</small>
              <p>{node.detail}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function EvidenceCard({
  item,
  activeAreaId,
  onAreaChange,
  reducedMotion,
  index,
}: {
  item: EvidenceItem;
  activeAreaId: ResearchAreaId;
  onAreaChange: (areaId: ResearchAreaId) => void;
  reducedMotion: boolean;
  index: number;
}) {
  const tiltRef = useTilt<HTMLElement>(reducedMotion);
  const related = item.areaIds.includes(activeAreaId);

  return (
    <article
      ref={tiltRef}
      className={`evidence-card reveal-item ${related ? "is-related" : ""}`}
      style={{ "--reveal-index": index } as CSSProperties}
      onPointerEnter={() => onAreaChange(evidencePrimaryArea[item.id])}
      onFocusCapture={() => onAreaChange(evidencePrimaryArea[item.id])}
    >
      <ScientificPreview variant={item.preview} large />
      <div className="evidence-card-body">
        <p className="project-type">Featured Evidence</p>
        <h3>{item.titleZh}</h3>
        <h4>{item.titleEn}</h4>
        <p>{item.description}</p>
        <div className="tags" aria-label="技术标签">
          {item.tags.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="inline-links">
          {item.demoHref && (
            <a href={item.demoHref} target="_blank" rel="noreferrer">
              打开演示 <ArrowUpRight size={14} />
            </a>
          )}
          {item.githubHref && (
            <a href={item.githubHref} target="_blank" rel="noreferrer">
              GitHub <Github size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeaturedEvidence({
  activeAreaId,
  onAreaChange,
  reducedMotion,
}: {
  activeAreaId: ResearchAreaId;
  onAreaChange: (areaId: ResearchAreaId) => void;
  reducedMotion: boolean;
}) {
  const reveal = useReveal<HTMLElement>(reducedMotion);

  return (
    <section
      ref={reveal.ref}
      className={`section featured-evidence reveal-section ${reveal.visible ? "is-revealed" : ""}`}
      id="projects"
    >
      <SectionTitle
        eyebrow="Featured Demos & Projects"
        title="精选研究证据"
        subtitle="用可交互演示、公开仓库和可复查的工程结构证明建模、实现与解释能力。"
        align="center"
      />
      <div className="evidence-grid">
        {evidenceItems.map((item, index) => (
          <EvidenceCard
            item={item}
            activeAreaId={activeAreaId}
            onAreaChange={onAreaChange}
            reducedMotion={reducedMotion}
            index={index}
            key={item.id}
          />
        ))}
      </div>
    </section>
  );
}

export function AcademicBaseline({ reducedMotion }: { reducedMotion: boolean }) {
  const reveal = useReveal<HTMLElement>(reducedMotion);
  const academicMetrics = [
    { label: "GPA", value: metrics[0].value },
    { label: "专业排名", value: metrics[1].value },
    { label: "均分", value: education.averageScore },
    { label: "CET-6", value: metrics[2].value.replace("CET-6 ", "") },
  ];

  return (
    <section
      ref={reveal.ref}
      className={`section academic-baseline reveal-section ${reveal.visible ? "is-revealed" : ""}`}
      id="education"
    >
      <SectionTitle
        eyebrow="Academic Baseline"
        title="学术基线"
        subtitle="物理与数学课程构成建模、模拟和可视化实践的基础。"
        align="center"
      />
      <article className="academic-card reveal-item">
        <div className="academic-school">
          <GraduationCap size={26} aria-hidden="true" />
          <h3>{education.school}</h3>
          <p>{education.program}</p>
          <span>{education.period}</span>
        </div>
        <dl className="academic-metrics">
          {academicMetrics.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className="course-list" aria-label="核心课程">
          {education.courses.map((course) => (
            <span key={course}>{course}</span>
          ))}
        </div>
      </article>
      <aside className="honors-strip reveal-item" aria-label="荣誉与竞赛">
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

function travelImage(file: string) {
  const normalized = file.replace(/^\.\/?travel\//, "").replace(/^\/travel\//, "");
  return `./travel/${normalized}`;
}

export function AlbumTeaser({ reducedMotion }: { reducedMotion: boolean }) {
  const reveal = useReveal<HTMLElement>(reducedMotion);
  const albumRegion = journeyRegions.find((region) => region.id === "hongkong") ?? journeyRegions[0];
  const album = albumRegion.albumId ? travelAlbums[albumRegion.albumId] : undefined;
  const albumPhotoFiles = album?.photos.map((photo) => photo.thumb ?? photo.preview ?? photo.file) ?? [];
  const imageCandidates = (albumPhotoFiles.length >= 3 ? albumPhotoFiles : [album?.cover, ...albumPhotoFiles]).filter(
    (file): file is string => Boolean(file),
  );
  const imageFiles = [...new Set(imageCandidates)].slice(0, 3);

  return (
    <section
      ref={reveal.ref}
      className={`section album-teaser reveal-section ${reveal.visible ? "is-revealed" : ""}`}
      id="album-teaser"
    >
      <div className="album-teaser-copy reveal-item">
        <p className="kicker">Beyond Research</p>
        <h2>旅行 · 徒步 · 摄影</h2>
        <span>Map Journey Atlas</span>
        <p>记录世界的足迹，把旅途折叠成可以展开的记忆。</p>
        <a className="action-button primary album-entry" href="./album/index.html">
          进入个人相册
          <ArrowRight size={18} />
        </a>
      </div>
      <div className="album-fold-preview reveal-item" aria-hidden="true">
        <article>
          <i>PERSONAL JOURNEY</i>
          <strong>Future Paper Fold</strong>
          <small>Map Journey Atlas</small>
        </article>
        {imageFiles.map((file, index) => (
          <figure style={{ "--fold-index": index } as CSSProperties} key={file}>
            <img src={travelImage(file)} alt="" loading="lazy" decoding="async" />
            <span>0{index + 1}</span>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function SummerCampSection({ reducedMotion }: { reducedMotion: boolean }) {
  const reveal = useReveal<HTMLElement>(reducedMotion);

  return (
    <section
      ref={reveal.ref}
      className={`section camp-section reveal-section ${reveal.visible ? "is-revealed" : ""}`}
      id="camps"
    >
      <div className="status-heading">
        <SectionTitle eyebrow="Summer Camps" title={summerCamps.title} subtitle={summerCamps.subtitle} />
        <span className="status-pill">Updated {summerCamps.updatedAt}</span>
      </div>
      <article className="camp-statement reveal-item">
        <CalendarDays size={26} aria-hidden="true" />
        <p>{summerCamps.statement}</p>
      </article>
      <div className="camp-table reveal-item" role="table" aria-label="夏令营入营与参营安排">
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

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-copy">
        <p className="kicker">Contact</p>
        <h2>欢迎围绕计算物理、物理可视化与 AI 辅助科研交流</h2>
        <p>Computational physics · Physics visualization · AI-assisted research tools</p>
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
      <div className="footer-meta">
        <span>{profile.nameZh} / {profile.nameEn}</span>
        <span>Built as a verifiable academic portfolio.</span>
      </div>
    </footer>
  );
}

import { useEffect, useRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from "react";
import {
  CalendarDays,
  Camera,
  ChevronRight,
  Download,
  FileText,
  Github,
} from "lucide-react";
import { metrics, profile } from "../data";
import {
  evidenceItems,
  evidencePrimaryArea,
  homeNavigation,
  proofEvidenceIds,
  researchAreas,
  type EvidenceId,
  type PreviewVariant,
  type ResearchAreaId,
} from "./content";
import { useLightField, useTilt } from "./motion";

const fieldParticles = [
  { x: 9, y: 18, size: 5, delay: -1.2, duration: 9.4 },
  { x: 23, y: 76, size: 4, delay: -3.8, duration: 11.8 },
  { x: 39, y: 29, size: 3, delay: -7.1, duration: 10.2 },
  { x: 56, y: 72, size: 5, delay: -4.9, duration: 13.4 },
  { x: 68, y: 17, size: 4, delay: -8.3, duration: 12.1 },
  { x: 79, y: 57, size: 3, delay: -2.6, duration: 9.8 },
  { x: 91, y: 31, size: 5, delay: -6.4, duration: 14.2 },
  { x: 87, y: 83, size: 4, delay: -9.2, duration: 11.1 },
];

type MagneticLinkProps = ComponentPropsWithoutRef<"a"> & {
  children: ReactNode;
  disabledMotion: boolean;
};

function MagneticLink({ children, className = "", disabledMotion, ...props }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabledMotion) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      frame = 0;
      element.style.setProperty("--magnetic-x", `${x.toFixed(1)}px`);
      element.style.setProperty("--magnetic-y", `${y.toFixed(1)}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
      y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [disabledMotion]);

  return (
    <a ref={ref} className={`magnetic-link ${className}`.trim()} {...props}>
      <span className="magnetic-link-content">{children}</span>
    </a>
  );
}

export function ScientificPreview({ variant, large = false }: { variant: PreviewVariant; large?: boolean }) {
  return (
    <div className={`scientific-preview ${variant} ${large ? "is-large" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 120 80" focusable="false">
        {variant === "orbital" && (
          <>
            <ellipse className="preview-line orbit-a" cx="60" cy="40" rx="37" ry="14" />
            <ellipse className="preview-line orbit-b" cx="60" cy="40" rx="37" ry="14" />
            <circle className="preview-nucleus" cx="60" cy="40" r="4" />
            <g className="preview-orbit-runner">
              <circle cx="92" cy="40" r="3" />
            </g>
          </>
        )}
        {variant === "wave" && (
          <>
            <path className="preview-axis" d="M14 60 H108" />
            <path className="preview-wave wave-a" d="M14 40 C28 15 40 65 54 40 S80 15 94 40 S108 62 114 46" />
            <path className="preview-wave wave-b" d="M14 45 C28 65 40 20 54 45 S80 65 94 45 S108 24 114 39" />
            <path className="preview-polarizer" d="M76 15 V66" />
          </>
        )}
        {variant === "memory" && (
          <>
            <path className="preview-edge" d="M22 24 L52 16 L84 28 L101 56 L64 66 L31 52 Z" />
            <path className="preview-edge secondary" d="M52 16 L64 66 M22 24 L84 28 M31 52 L101 56" />
            {[
              [22, 24],
              [52, 16],
              [84, 28],
              [101, 56],
              [64, 66],
              [31, 52],
            ].map(([cx, cy], index) => (
              <circle className="preview-memory-node" cx={cx} cy={cy} r={index === 2 ? 4 : 3} key={`${cx}-${cy}`} />
            ))}
          </>
        )}
        {variant === "lattice" && (
          <>
            <path className="preview-edge" d="M28 18 H88 L104 34 V64 H44 L28 48 Z" />
            <path className="preview-edge secondary" d="M28 18 L44 34 H104 M44 34 V64 M88 18 V48 L104 64 M28 48 H88" />
            {[
              [28, 18],
              [88, 18],
              [44, 34],
              [104, 34],
              [28, 48],
              [88, 48],
              [44, 64],
              [104, 64],
            ].map(([cx, cy], index) => (
              <circle className="preview-lattice-node" cx={cx} cy={cy} r={index % 3 === 0 ? 4 : 3} key={`${cx}-${cy}`} />
            ))}
          </>
        )}
      </svg>
      <span className="preview-scan" />
      <small>{variant === "wave" ? "E / B FIELD" : variant === "memory" ? "MEMORY GRAPH" : variant === "lattice" ? "LATTICE" : "ψ ORBITAL"}</small>
    </div>
  );
}

export function SiteHeader({ activeSection }: { activeSection: string }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="返回首页顶部">
        <span aria-hidden="true">QH</span>
        <strong>
          {profile.nameZh} / {profile.nameEn}
          <small>Personal Academic Website</small>
        </strong>
      </a>
      <nav className="site-nav" aria-label="主页导航">
        {homeNavigation.map((item) => (
          <a
            className={activeSection === item.sectionId ? "is-active" : ""}
            href={item.href}
            aria-current={activeSection === item.sectionId ? "page" : undefined}
            key={item.sectionId}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="theme-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </header>
  );
}

function LightFieldBackground({ reducedMotion }: { reducedMotion: boolean }) {
  const fieldRef = useLightField<HTMLDivElement>(reducedMotion);

  return (
    <div ref={fieldRef} className="light-field" aria-hidden="true">
      <div className="light-field-grid" />
      <div className="light-field-glow" />
      <svg className="light-field-paths" viewBox="0 0 1440 820" preserveAspectRatio="none">
        <path d="M-80 590 C260 320 480 720 780 410 S1180 140 1530 350" />
        <path d="M-40 250 C280 470 520 120 850 280 S1240 650 1510 500" />
        <path d="M180 880 C420 570 700 600 910 310 S1260 80 1440 130" />
      </svg>
      <div className="field-particles">
        {fieldParticles.map((particle, index) => (
          <i
            key={`${particle.x}-${particle.y}`}
            style={
              {
                "--particle-x": `${particle.x}%`,
                "--particle-y": `${particle.y}%`,
                "--particle-size": `${particle.size}px`,
                "--particle-delay": `${particle.delay}s`,
                "--particle-duration": `${particle.duration}s`,
                "--particle-index": index,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

function HeroActions({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="hero-actions" aria-label="个人资料入口">
      <div className="primary-actions">
        <MagneticLink
          className="action-button primary"
          href={profile.cv}
          target="_blank"
          rel="noreferrer"
          disabledMotion={reducedMotion}
        >
          <FileText size={18} />
          查看简历
        </MagneticLink>
        <MagneticLink
          className="action-button primary subtle"
          href={profile.interviewDeck}
          download
          disabledMotion={reducedMotion}
        >
          <Download size={18} />
          下载面试 PPT
        </MagneticLink>
      </div>
      <div className="secondary-actions">
        <a className="quick-link" href={profile.statementPdf} target="_blank" rel="noreferrer">
          <FileText size={16} />
          查看个人简述
        </a>
        <a className="quick-link" href="#camps">
          <CalendarDays size={16} />
          夏令营入营情况
        </a>
        <a className="quick-link" href={profile.github} target="_blank" rel="noreferrer">
          <Github size={16} />
          GitHub
        </a>
        <a className="quick-link album-portal" href="./album/index.html">
          <Camera size={16} />
          <span className="album-portal-orbit" aria-hidden="true" />
          <span>个人爱好 · 相册</span>
        </a>
      </div>
    </div>
  );
}

function MetricStrip() {
  return (
    <section className="metric-strip" aria-label="学术指标">
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

function ResearchOrbit({
  activeAreaId,
  onAreaChange,
  reducedMotion,
}: {
  activeAreaId: ResearchAreaId;
  onAreaChange: (areaId: ResearchAreaId) => void;
  reducedMotion: boolean;
}) {
  const activeArea = researchAreas.find((area) => area.id === activeAreaId) ?? researchAreas[0];
  const orbitRef = useTilt<HTMLDivElement>(reducedMotion);

  return (
    <section className="research-orbit" aria-label="Research Orbit 研究图谱">
      <div ref={orbitRef} className="orbit-stage">
        <div className="orbit-plane">
          <svg className="orbit-lines" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="orbit-ring ring-one" cx="50" cy="50" r="35" />
            <ellipse className="orbit-ring ring-two" cx="50" cy="50" rx="44" ry="20" />
            <ellipse className="orbit-ring ring-three" cx="50" cy="50" rx="20" ry="44" />
            {researchAreas.map((area) => (
              <line
                className={`orbit-connection ${area.id === activeAreaId ? "is-active" : ""}`}
                x1="50"
                y1="50"
                x2={area.position.x}
                y2={area.position.y}
                key={area.id}
              />
            ))}
          </svg>
          <div className="orbit-core">
            <span>Qi Heng</span>
            <small>Research Map</small>
            <i>{activeArea.label}</i>
          </div>
          {researchAreas.map((area) => (
            <button
              type="button"
              className={`orbit-node ${area.id === activeAreaId ? "is-active" : ""}`}
              style={{ "--node-x": `${area.position.x}%`, "--node-y": `${area.position.y}%` } as CSSProperties}
              onPointerEnter={() => onAreaChange(area.id)}
              onFocus={() => onAreaChange(area.id)}
              onClick={() => onAreaChange(area.id)}
              aria-pressed={area.id === activeAreaId}
              aria-describedby="orbit-context"
              key={area.id}
            >
              <strong>{area.label}</strong>
              <span>{area.labelZh}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="orbit-context" id="orbit-context" aria-live="polite">
        <span>{activeArea.evidenceIds.length ? `${activeArea.evidenceIds.length} 项公开证据` : "研究兴趣"}</span>
        <p>{activeArea.detail}</p>
      </div>
    </section>
  );
}

function ProofPanel({
  activeAreaId,
  onEvidenceFocus,
}: {
  activeAreaId: ResearchAreaId;
  onEvidenceFocus: (evidenceId: EvidenceId) => void;
}) {
  const activeArea = researchAreas.find((area) => area.id === activeAreaId) ?? researchAreas[0];
  const activeEvidence = new Set(activeArea.evidenceIds);
  const proofItems = proofEvidenceIds
    .map((id) => evidenceItems.find((item) => item.id === id))
    .filter((item): item is (typeof evidenceItems)[number] => Boolean(item));

  return (
    <aside className="proof-panel" aria-label="Interactive Proof Panel">
      <div className="proof-panel-head">
        <div>
          <p>Interactive Proof Panel</p>
          <h2>可直接验证的项目入口</h2>
        </div>
        <span className="proof-signal" aria-label="链接可用">
          LIVE
        </span>
      </div>
      <div className="proof-list">
        {proofItems.map((item) => {
          const href = item.demoHref ?? item.githubHref;
          return (
            <a
              className={`proof-item ${activeEvidence.has(item.id) ? "is-related" : ""}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              onPointerEnter={() => onEvidenceFocus(item.id)}
              onFocus={() => onEvidenceFocus(item.id)}
              key={item.id}
            >
              <ScientificPreview variant={item.preview} />
              <span>
                <strong>{item.titleZh}</strong>
                <small>{item.titleEn}</small>
              </span>
              <ChevronRight size={18} />
            </a>
          );
        })}
      </div>
      <div className={`proof-context ${activeArea.evidenceIds.length ? "" : "is-interest"}`}>
        <span>{activeArea.label}</span>
        <p>
          {activeArea.evidenceIds.length
            ? "相关真实项目已高亮，可直接打开验证。"
            : "这是明确的研究兴趣方向，暂不把它包装成已有项目成果。"}
        </p>
      </div>
    </aside>
  );
}

export function HeroSection({
  activeAreaId,
  onAreaChange,
  reducedMotion,
}: {
  activeAreaId: ResearchAreaId;
  onAreaChange: (areaId: ResearchAreaId) => void;
  reducedMotion: boolean;
}) {
  const onEvidenceFocus = (evidenceId: EvidenceId) => onAreaChange(evidencePrimaryArea[evidenceId]);

  return (
    <section className="hero evidence-hero" id="top">
      <LightFieldBackground reducedMotion={reducedMotion} />
      <div className="hero-identity">
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
        <HeroActions reducedMotion={reducedMotion} />
      </div>
      <ResearchOrbit activeAreaId={activeAreaId} onAreaChange={onAreaChange} reducedMotion={reducedMotion} />
      <div className="hero-proof-column">
        <ProofPanel activeAreaId={activeAreaId} onEvidenceFocus={onEvidenceFocus} />
        <MetricStrip />
      </div>
    </section>
  );
}

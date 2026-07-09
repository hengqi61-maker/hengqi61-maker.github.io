import {
  StrictMode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe2,
  Layers3,
  Map as MapIcon,
  MapPin,
  Maximize2,
  MousePointer2,
  Navigation,
  Plane,
  Search,
  X,
} from "lucide-react";
import {
  chinaDestinations,
  defaultAlbumId,
  defaultJourneyRegionId,
  journeyRegions,
  travelAlbums,
  type ChinaDestination,
  type JourneyRegion,
  type TravelAlbum,
  type TravelAlbumPhoto,
} from "./data";
import { chinaMapPaths, projectChinaPoint } from "./generated/chinaMapPaths";
import "./album.css";

type ViewMode = "global" | "china" | "album";

type ChinaMapPoint = {
  x: number;
  y: number;
};

const exploreSteps = [
  {
    number: "01",
    title: "国家/地区总览",
    detail: "先看旅行网络中的节点",
    icon: Globe2,
  },
  {
    number: "02",
    title: "进入国家地图",
    detail: "中国可继续展开省市足迹",
    icon: MapIcon,
  },
  {
    number: "03",
    title: "选择目的地",
    detail: "点击地区进入对应折页相册",
    icon: MousePointer2,
  },
  {
    number: "04",
    title: "聚焦某一页",
    detail: "点击照片进入沉浸式查看",
    icon: Maximize2,
  },
];

const travelImage = (file: string) => `../travel/${file}`;
const CHINA_MAP_SIZE = { width: 720, height: 460 };
const chinaHighlightProvinceByDestination: Record<string, string[]> = {
  wuhan: ["湖北省"],
  yunnan: ["云南省"],
  rizhao: ["山东省"],
  huangshan: ["安徽省"],
  ningbo: ["浙江省"],
  wugongshan: ["江西省"],
  kulagangri: ["西藏自治区"],
  laojunshan: ["河南省"],
  changbaishan: ["吉林省"],
};

const chinaMarkerLabelOffsets: Record<string, ChinaMapPoint> = {
  wuhan: { x: 14, y: -22 },
  yunnan: { x: 8, y: 10 },
  rizhao: { x: 14, y: -21 },
  huangshan: { x: -54, y: 18 },
  ningbo: { x: 15, y: -18 },
  wugongshan: { x: -60, y: 16 },
  kulagangri: { x: -26, y: 5 },
  laojunshan: { x: -54, y: -18 },
  changbaishan: { x: -28, y: -10 },
};

function chinaMarkerPosition(destination: ChinaDestination): ChinaMapPoint {
  if (destination.geo) {
    return projectChinaPoint(destination.geo.lon, destination.geo.lat);
  }

  return destination.node;
}

function chinaMarkerSvgPoint(destination: ChinaDestination): ChinaMapPoint {
  const point = chinaMarkerPosition(destination);
  return {
    x: (point.x / 100) * CHINA_MAP_SIZE.width,
    y: (point.y / 100) * CHINA_MAP_SIZE.height,
  };
}

function formatSvgPoint(value: number) {
  return Number(value.toFixed(1));
}

function chinaRoutePath(destinations: ChinaDestination[], ids: string[]) {
  const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
  const points = ids
    .map((id) => destinationById.get(id))
    .filter((destination): destination is ChinaDestination => Boolean(destination))
    .map(chinaMarkerSvgPoint);

  if (points.length < 2) return "";

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const midX = (previous.x + point.x) / 2;
    const lift = index % 2 === 0 ? -26 : 20;
    return `${path} C ${formatSvgPoint(midX)} ${formatSvgPoint(previous.y + lift)} ${formatSvgPoint(
      midX,
    )} ${formatSvgPoint(point.y - lift)} ${formatSvgPoint(point.x)} ${formatSvgPoint(point.y)}`;
  }, `M ${formatSvgPoint(points[0].x)} ${formatSvgPoint(points[0].y)}`);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getAlbumById(albumId: string) {
  return travelAlbums[albumId] ?? travelAlbums[defaultAlbumId] ?? Object.values(travelAlbums)[0];
}

function AtlasNav({
  view,
  onOpenGlobal,
  onOpenChina,
}: {
  view: ViewMode;
  onOpenGlobal: () => void;
  onOpenChina: () => void;
}) {
  return (
    <header className="atlas-nav" aria-label="相册导航">
      <a className="atlas-brand" href="../index.html" aria-label="返回个人主页">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="brand-avatar" aria-hidden="true">
          QH
        </span>
        <span>
          <strong>折页记忆 / Future Paper Fold</strong>
          <small>Personal Album</small>
        </span>
      </a>

      <nav className="atlas-links" aria-label="相册页面章节">
        <button className={view === "global" ? "is-active" : ""} type="button" onClick={onOpenGlobal}>
          国家/地区总览
        </button>
        <button className={view === "china" ? "is-active" : ""} type="button" onClick={onOpenChina}>
          中国地图
        </button>
        <a className={view === "album" ? "is-active" : ""} href="#album">
          折页相册
        </a>
        <a href="#route">路线</a>
        <a href="../index.html">关于我</a>
      </nav>

      <div className="atlas-actions">
        <button className="nav-icon-button" type="button" aria-label="搜索相册">
          <Search size={18} />
        </button>
        <div className="journey-year" aria-label="旅行年份">
          <strong>2024-2026</strong>
          <span>Let the journey unfold.</span>
        </div>
      </div>
    </header>
  );
}

function HeroStats({
  items,
}: {
  items: Array<{
    value: string;
    label: string;
  }>;
}) {
  return (
    <dl className="hero-stats" aria-label="旅行相册统计">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function GlobalJourneyMap({
  regions,
  activeRegionId,
  onSelect,
}: {
  regions: JourneyRegion[];
  activeRegionId: string;
  onSelect: (region: JourneyRegion) => void;
}) {
  return (
    <section className="journey-network-panel" aria-label="国家和地区旅行网络">
      <div className="network-paper-grain" aria-hidden="true" />
      <svg className="network-routes" viewBox="0 0 100 100" aria-hidden="true">
        <path className="network-route primary" d="M40 56 C48 42 56 36 74 42" />
        <path className="network-route secondary" d="M40 56 C48 58 54 62 62 62" />
        <path className="network-route secondary" d="M62 62 C58 52 54 42 52 34" />
        <path className="network-route dotted" d="M52 34 C62 30 70 34 74 42" />
      </svg>

      <div className="network-center-mark" aria-hidden="true">
        <Plane size={18} />
        <span>Journey Network</span>
      </div>

      {regions.map((region, index) => {
        const isActive = region.id === activeRegionId;
        const style = {
          "--node-x": `${region.node.x}%`,
          "--node-y": `${region.node.y}%`,
          "--node-accent": region.accent,
          "--node-index": index,
        } as CSSProperties;

        return (
          <button
            key={region.id}
            className={`journey-node ${isActive ? "is-active" : ""}`}
            type="button"
            style={style}
            onClick={() => onSelect(region)}
            aria-pressed={isActive}
            aria-label={`选择${region.nameZh}`}
          >
            <span className="node-orbit" aria-hidden="true" />
            <span className="node-copy">
              <small>{region.type}</small>
              <strong>{region.nameZh}</strong>
              <em>{region.nameEn}</em>
            </span>
          </button>
        );
      })}
    </section>
  );
}

function ChinaMapView({
  destinations,
  activeDestinationId,
  onBack,
  onSelect,
}: {
  destinations: ChinaDestination[];
  activeDestinationId: string;
  onBack: () => void;
  onSelect: (destination: ChinaDestination) => void;
}) {
  const activeDestination = destinations.find((destination) => destination.id === activeDestinationId);
  const activeMarkerPosition = activeDestination ? chinaMarkerPosition(activeDestination) : null;
  const highlightedProvinces = new Set(chinaHighlightProvinceByDestination[activeDestinationId] ?? []);
  const mainRoutePath = chinaRoutePath(destinations, [
    "kulagangri",
    "yunnan",
    "wugongshan",
    "wuhan",
    "rizhao",
    "changbaishan",
  ]);
  const secondaryRoutePath = chinaRoutePath(destinations, ["laojunshan", "wuhan", "huangshan", "ningbo"]);

  return (
    <section className="china-map-panel" aria-label="中国内部旅行足迹">
      <div className="map-paper-grain" aria-hidden="true" />
      <button className="map-back-button" type="button" onClick={onBack}>
        <ArrowLeft size={15} />
        国家/地区总览
      </button>
      <svg className="china-map-svg" viewBox={chinaMapPaths.viewBox} aria-hidden="true">
        <defs>
          <filter id="paper-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#6b7280" floodOpacity="0.18" />
          </filter>
          <linearGradient id="map-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="58%" stopColor="#f1eee7" />
            <stop offset="100%" stopColor="#e7edf4" />
          </linearGradient>
          <linearGradient id="map-active-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#eaf4ff" />
            <stop offset="62%" stopColor="#cfe4ff" />
            <stop offset="100%" stopColor="#9ec8ff" />
          </linearGradient>
        </defs>
        <g className="china-province-layer" filter="url(#paper-shadow)">
          {chinaMapPaths.provincePaths.map((path) => {
            const provinceName = "name" in path ? path.name : undefined;

            return (
              <path
                className={`china-province ${
                  provinceName && highlightedProvinces.has(provinceName) ? "is-highlighted" : ""
                }`}
                d={path.d}
                key={path.id}
              />
            );
          })}
        </g>
        <g className="china-outline-layer">
          {chinaMapPaths.outlinePaths.map((path) => (
            <path className="china-outline" d={path.d} key={path.id} />
          ))}
        </g>
        {mainRoutePath && <path className="travel-route" d={mainRoutePath} />}
        {secondaryRoutePath && <path className="travel-route secondary" d={secondaryRoutePath} />}
        <g className="south-sea-inset" aria-hidden="true">
          <rect
            className="south-sea-frame"
            x={chinaMapPaths.insetBox.x}
            y={chinaMapPaths.insetBox.y}
            width={chinaMapPaths.insetBox.width}
            height={chinaMapPaths.insetBox.height}
            rx="10"
          />
          {chinaMapPaths.southSeaInsetPaths.map((path) => (
            <path className="south-sea-path" d={path.d} key={path.id} />
          ))}
          {chinaMapPaths.tenDashPaths.map((path) => (
            <path className="ten-dash-line" d={path.d} key={path.id} />
          ))}
          <text className="south-sea-label" x={chinaMapPaths.insetBox.x + 13} y={chinaMapPaths.insetBox.y + 20}>
            南海诸岛
          </text>
        </g>
      </svg>

      {activeMarkerPosition && (
        <span
          className="active-region-glow"
          style={
            {
              "--marker-x": `${activeMarkerPosition.x}%`,
              "--marker-y": `${activeMarkerPosition.y}%`,
              "--marker-accent": activeDestination?.accent ?? "#0b6ffb",
            } as CSSProperties
          }
          aria-hidden="true"
        />
      )}

      {destinations.map((destination, index) => {
        const isActive = destination.id === activeDestinationId;
        const markerPosition = chinaMarkerPosition(destination);
        const markerLabelOffset = chinaMarkerLabelOffsets[destination.id] ?? { x: 0, y: 0 };
        const style = {
          "--marker-x": `${markerPosition.x}%`,
          "--marker-y": `${markerPosition.y}%`,
          "--marker-accent": destination.accent,
          "--marker-label-x": `${markerLabelOffset.x}px`,
          "--marker-label-y": `${markerLabelOffset.y}px`,
          "--marker-index": index,
        } as CSSProperties;

        return (
          <button
            className={`map-marker ${isActive ? "is-active" : ""}`}
            type="button"
            key={destination.id}
            style={style}
            onClick={() => onSelect(destination)}
            aria-pressed={isActive}
            aria-label={`进入${destination.nameZh}相册`}
          >
            <span className="marker-dot" aria-hidden="true" />
            <span className="marker-label">
              <strong>{destination.nameZh}</strong>
              <small>{destination.nameEn}</small>
            </span>
          </button>
        );
      })}

      <div className="map-compass" aria-hidden="true">
        <Compass size={18} />
        <span>China Atlas</span>
      </div>
    </section>
  );
}

function DestinationInfoCard({
  title,
  subtitle,
  status,
  description,
  cover,
  stats,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  status: string;
  description: string;
  cover: string;
  stats: {
    places: number;
    photos: number;
    videos: number;
  };
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <aside className="destination-card" aria-label={`${title}信息`}>
      <div className="destination-cover">
        <img src={travelImage(cover)} alt={`${title}封面`} loading="eager" decoding="async" />
      </div>
      <div className="destination-body">
        <p className="destination-status">
          <MapPin size={14} />
          {status}
          <span aria-hidden="true" />
        </p>
        <h2>
          {title} · {subtitle}
        </h2>
        <p>{description}</p>
        <button className="destination-cta" type="button" onClick={onAction}>
          {actionLabel}
          <ChevronRight size={18} />
        </button>
        <small>
          共 {stats.places} 个地点 · {stats.photos} 张照片 · {stats.videos} 段视频
        </small>
      </div>
    </aside>
  );
}

function FoldAlbum({
  album,
  onFocus,
}: {
  album: TravelAlbum;
  onFocus: (photoIndex: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const featuredEntries = useMemo(() => {
    const entries = album.photos.map((photo, index) => ({ photo, index }));
    const featured = entries.filter(({ photo }) => photo.featured);
    return (featured.length > 0 ? featured : entries).slice(0, 8);
  }, [album]);

  const scrollAlbum = (direction: -1 | 1) => {
    const scrollNode = scrollRef.current;
    if (!scrollNode) return;

    scrollNode.scrollBy({
      left: direction * Math.min(640, scrollNode.clientWidth * 0.74),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width - 0.5;
    trackRef.current?.style.setProperty("--album-drift", `${(-ratio * 70).toFixed(1)}px`);
  };

  const resetPointerDrift = () => {
    trackRef.current?.style.setProperty("--album-drift", "0px");
  };

  return (
    <section className="fold-section" id="album" aria-labelledby="fold-title">
      <div className="fold-heading">
        <p>Accordion Journey</p>
        <h2 id="fold-title">{album.titleZh}</h2>
        <span>
          只展示精选折页，完整照片在下方分批索引中按需加载。
        </span>
      </div>

      <div className="fold-album-stage" onPointerMove={handlePointerMove} onPointerLeave={resetPointerDrift}>
        <button
          className="album-arrow previous"
          type="button"
          onClick={() => scrollAlbum(-1)}
          aria-label="向左浏览相册"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="fold-scroll" ref={scrollRef}>
          <div className="fold-track" ref={trackRef}>
            <article
              className="fold-panel fold-cover"
              style={
                {
                  "--panel-index": 0,
                  "--fold-rotate": "-1.2deg",
                  "--fold-skew": "0.8deg",
                  "--fold-origin": "right center",
                } as CSSProperties
              }
            >
              <span className="fold-label">{album.titleEn.toUpperCase()}</span>
              <h3>{album.titleZh}</h3>
              <p>{album.titleEn}</p>
              <div className="cover-stamp">
                <Camera size={18} />
                {album.stats.photos} frames
              </div>
              <img src={travelImage(album.cover)} alt="" aria-hidden="true" loading="eager" />
            </article>

            {featuredEntries.map(({ photo, index }, panelIndex) => {
              const rotate = panelIndex % 2 === 0 ? "1.1deg" : "-1.1deg";
              const skew = panelIndex % 2 === 0 ? "-1.5deg" : "1.5deg";
              const origin = panelIndex % 2 === 0 ? "left center" : "right center";

              return (
                <article
                  className="fold-panel photo-panel"
                  style={
                    {
                      "--panel-index": panelIndex + 1,
                      "--fold-rotate": rotate,
                      "--fold-skew": skew,
                      "--fold-origin": origin,
                    } as CSSProperties
                  }
                  key={`${album.id}-${photo.id ?? photo.file}-${index}`}
                  onClick={() => onFocus(index)}
                >
                  <span className="page-number">{String(panelIndex + 1).padStart(2, "0")}</span>
                  <span className="photo-frame">
                    <img
                      src={travelImage(photo.preview ?? photo.file)}
                      alt={`${photo.titleZh} · ${photo.place}`}
                      loading={panelIndex < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </span>
                  <span className="page-caption">
                    <strong>{photo.titleZh}</strong>
                    <em>{photo.titleEn}</em>
                    <small>
                      <MapPin size={12} />
                      {photo.meta}
                    </small>
                  </span>
                  <button
                    className="fold-open-button"
                    type="button"
                    data-photo-index={index}
                    onClick={(event) => {
                      event.stopPropagation();
                      onFocus(index);
                    }}
                    aria-label={`聚焦查看${photo.titleZh}`}
                  >
                    <span className="open-cue">
                      <Maximize2 size={18} />
                      聚焦
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <button
          className="album-arrow next"
          type="button"
          onClick={() => scrollAlbum(1)}
          aria-label="向右浏览相册"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

function PhotoIndex({
  album,
  onFocus,
}: {
  album: TravelAlbum;
  onFocus: (photoIndex: number) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(24);
  const visiblePhotos = album.photos.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(24);
  }, [album.id]);

  return (
    <section className="photo-index" aria-labelledby="photo-index-title">
      <div className="photo-index-heading">
        <p>All Frames</p>
        <h2 id="photo-index-title">全部照片索引</h2>
        <span>
          当前显示 {visiblePhotos.length} / {album.photos.length} 张。缩略图按需加载，大图只在聚焦模式中请求。
        </span>
      </div>
      <div className="photo-index-grid">
        {visiblePhotos.map((photo, index) => (
          <button
            className="photo-index-item"
            type="button"
            key={`${album.id}-index-${photo.id ?? photo.file}-${index}`}
            onClick={() => onFocus(index)}
            aria-label={`打开${photo.titleZh}`}
          >
            <img
              src={travelImage(photo.thumb ?? photo.preview ?? photo.file)}
              alt={`${photo.titleZh} · ${photo.place}`}
              loading="lazy"
              decoding="async"
            />
            <span>
              <strong>{photo.titleZh}</strong>
              <small>{photo.time}</small>
            </span>
          </button>
        ))}
      </div>
      {visibleCount < album.photos.length && (
        <button
          className="load-more-photos"
          type="button"
          onClick={() => setVisibleCount((current) => Math.min(current + 24, album.photos.length))}
        >
          加载更多照片
          <ChevronRight size={18} />
        </button>
      )}
    </section>
  );
}

function FocusViewer({
  album,
  photo,
  index,
  total,
  onClose,
  onPrevious,
  onNext,
}: {
  album: TravelAlbum;
  photo: TravelAlbumPhoto;
  index: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (closeTimerRef.current !== null) return;

    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, 240);
  }, [onClose]);

  useEffect(() => {
    document.body.classList.add("atlas-focus-open");
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      document.body.classList.remove("atlas-focus-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [requestClose, onNext, onPrevious]);

  return (
    <div
      className={`focus-overlay ${isClosing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.titleZh}聚焦查看`}
      onClick={requestClose}
    >
      <button
        ref={closeButtonRef}
        className="focus-close"
        type="button"
        onClick={requestClose}
        aria-label="关闭聚焦模式"
      >
        <X size={24} />
      </button>

      <button
        className="focus-nav previous"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPrevious();
        }}
        aria-label="上一张照片"
      >
        <ChevronLeft size={28} />
      </button>

      <figure className="focus-card" onClick={(event) => event.stopPropagation()}>
        <div className="focus-photo-wrap">
          <img src={travelImage(photo.large ?? photo.preview ?? photo.file)} alt={`${photo.titleZh} · ${photo.place}`} />
        </div>
        <figcaption className="focus-info">
          <p>
            {album.titleEn.toUpperCase()} · {String(index + 1).padStart(2, "0")} / {total}
          </p>
          <h2>{photo.titleZh}</h2>
          <h3>{photo.titleEn}</h3>
          <dl>
            <div>
              <dt>地点</dt>
              <dd>{photo.place}</dd>
            </div>
            <div>
              <dt>时间</dt>
              <dd>{photo.time}</dd>
            </div>
            <div>
              <dt>心情</dt>
              <dd>{photo.mood}</dd>
            </div>
          </dl>
          <blockquote>{photo.note}</blockquote>
          <small>Esc 关闭 · ← / → 切换</small>
        </figcaption>
      </figure>

      <button
        className="focus-nav next"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        aria-label="下一张照片"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}

function ExploreSteps() {
  const stepsRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = stepsRef.current;
    if (!node) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`explore-steps ${isVisible ? "is-visible" : ""}`}
      id="route"
      ref={stepsRef}
      aria-labelledby="explore-title"
    >
      <div className="steps-title">
        <h2 id="explore-title">如何探索我的旅程</h2>
        <p>How to explore</p>
      </div>
      <ol>
        {exploreSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.number} style={{ "--step-index": index } as CSSProperties}>
              <Icon size={24} />
              <strong>{step.number}</strong>
              <span>
                <b>{step.title}</b>
                <small>{step.detail}</small>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function RouteConnector({ view }: { view: ViewMode }) {
  return (
    <div className="atlas-route-connector" aria-hidden="true">
      <svg viewBox="0 0 980 120">
        <path d="M58 76 C218 6 354 26 454 72 C560 120 696 114 898 38" />
        <path className="route-dash" d="M250 92 C370 116 514 116 658 88" />
      </svg>
      <span>
        {view === "global"
          ? "点击国家/地区节点，进入下一层旅程"
          : "左右移动鼠标，展开连续折页记忆"}
      </span>
    </div>
  );
}

function JourneyAlbumPage() {
  const [view, setView] = useState<ViewMode>("global");
  const [selectedRegionId, setSelectedRegionId] = useState(defaultJourneyRegionId);
  const [selectedChinaDestinationId, setSelectedChinaDestinationId] = useState(
    chinaDestinations[0]?.id ?? "yunnan",
  );
  const [selectedAlbumId, setSelectedAlbumId] = useState(defaultAlbumId);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const selectedRegion =
    journeyRegions.find((region) => region.id === selectedRegionId) ?? journeyRegions[0];
  const selectedChinaDestination =
    chinaDestinations.find((destination) => destination.id === selectedChinaDestinationId) ??
    chinaDestinations[0];
  const selectedAlbum = getAlbumById(selectedAlbumId);
  const activePhoto =
    activePhotoIndex === null ? null : selectedAlbum.photos[activePhotoIndex] ?? null;
  const isChinaDestinationContext = selectedRegionId === "china" && Boolean(selectedChinaDestination);

  const heroStats = useMemo(() => {
    if (view === "china") {
      const photos = chinaDestinations.reduce((total, destination) => total + destination.stats.photos, 0);
      return [
        { value: String(chinaDestinations.length), label: "个中国目的地" },
        { value: String(photos), label: "张照片" },
        { value: "1", label: "国家地图" },
        { value: "可扩展", label: "更多省市" },
      ];
    }

    if (view === "album") {
      return [
        { value: String(selectedAlbum.stats.photos), label: "张照片" },
        { value: String(Math.min(8, selectedAlbum.photos.length)), label: "精选折页" },
        { value: String(selectedAlbum.stats.places), label: "个地点" },
        { value: "按需", label: "大图加载" },
      ];
    }

    const photos = journeyRegions.reduce((total, region) => total + region.stats.photos, 0);
    return [
      { value: String(journeyRegions.length), label: "国家/地区节点" },
      { value: String(photos), label: "张照片" },
      { value: String(chinaDestinations.length), label: "中国内部地点" },
      { value: "232", label: "已优化图片" },
    ];
  }, [selectedAlbum, view]);

  const openGlobal = () => {
    setView("global");
    setSelectedRegionId(defaultJourneyRegionId);
    setActivePhotoIndex(null);
  };

  const openChina = () => {
    setView("china");
    setSelectedRegionId("china");
    setActivePhotoIndex(null);
  };

  const openRegion = (region: JourneyRegion) => {
    setSelectedRegionId(region.id);
    setActivePhotoIndex(null);

    if (region.childrenType === "province-map") {
      setView("china");
      return;
    }

    if (region.albumId) {
      setSelectedAlbumId(region.albumId);
      setView("album");
      window.requestAnimationFrame(() => {
        document.getElementById("album")?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };

  const openChinaDestination = (destination: ChinaDestination) => {
    setSelectedRegionId("china");
    setSelectedChinaDestinationId(destination.id);
    setSelectedAlbumId(destination.albumId);
    setActivePhotoIndex(null);
    setView("album");
    window.requestAnimationFrame(() => {
      document.getElementById("album")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const openSelectedCard = () => {
    if (isChinaDestinationContext && selectedChinaDestination) {
      openChinaDestination(selectedChinaDestination);
      return;
    }

    openRegion(selectedRegion);
  };

  const showPrevious = () => {
    setActivePhotoIndex((current) =>
      current === null ? null : (current - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length,
    );
  };

  const showNext = () => {
    setActivePhotoIndex((current) =>
      current === null ? null : (current + 1) % selectedAlbum.photos.length,
    );
  };

  const heroTitle =
    view === "china" ? (
      <>
        中国
        <span>·</span>
        省市足迹
      </>
    ) : view === "album" ? (
      <>
        折页
        <span>·</span>
        旅行相册
      </>
    ) : (
      <>
        旅程网络
        <span>·</span>
        折页相册
      </>
    );

  const heroScript =
    view === "china" ? "China Inner Atlas" : view === "album" ? "Accordion Memory Atlas" : "Journey Network Atlas";

  const heroDescription =
    view === "china"
      ? "中国足迹进入第二层地图：从城市、山线到高原节点，点击任意目的地展开对应折页相册。"
      : view === "album"
        ? "当前折页只放精选照片，完整照片通过下方索引分批浏览；大图只在聚焦模式中加载。"
        : "第一层不是传统地图，而是一张国家/地区旅行网络：点击中国进入内部地图，点击香港、日本或济州岛直接展开对应相册。";

  const mapMode = view === "china" || selectedRegionId === "china" ? "china" : "global";
  const cardSource =
    isChinaDestinationContext && selectedChinaDestination
      ? {
          title: selectedChinaDestination.nameZh,
          subtitle: selectedChinaDestination.nameEn,
          status: selectedChinaDestination.status,
          description: selectedChinaDestination.descriptionZh,
          cover: selectedChinaDestination.cover,
          stats: selectedChinaDestination.stats,
          actionLabel: `进入${selectedChinaDestination.nameZh}相册`,
        }
      : {
          title: selectedRegion.nameZh,
          subtitle: selectedRegion.nameEn,
          status: selectedRegion.status,
          description: selectedRegion.descriptionZh,
          cover: selectedRegion.cover,
          stats: selectedRegion.stats,
          actionLabel: selectedRegion.childrenType ? "进入中国地图" : `进入${selectedRegion.nameZh}相册`,
        };

  return (
    <main className="album-page">
      <div className="atlas-frame">
        <AtlasNav view={view} onOpenGlobal={openGlobal} onOpenChina={openChina} />

        <section className="atlas-hero" id="map">
          <div className="hero-copy">
            <a className="back-home" href="../index.html">
              <ArrowLeft size={16} />
              返回个人主页
            </a>
            <p className="hero-kicker">Personal Journey Archive</p>
            <h1>{heroTitle}</h1>
            <p className="atlas-script">{heroScript}</p>
            <p className="hero-description">{heroDescription}</p>
            <HeroStats items={heroStats} />
          </div>

          <div className="map-and-card">
            {mapMode === "china" ? (
              <ChinaMapView
                destinations={chinaDestinations}
                activeDestinationId={selectedChinaDestinationId}
                onBack={openGlobal}
                onSelect={openChinaDestination}
              />
            ) : (
              <GlobalJourneyMap
                regions={journeyRegions}
                activeRegionId={selectedRegion.id}
                onSelect={openRegion}
              />
            )}
            <DestinationInfoCard {...cardSource} onAction={openSelectedCard} />
          </div>
        </section>

        <RouteConnector view={view} />

        {view === "album" && (
          <>
            <FoldAlbum key={`fold-${selectedAlbum.id}`} album={selectedAlbum} onFocus={setActivePhotoIndex} />
            <PhotoIndex key={`index-${selectedAlbum.id}`} album={selectedAlbum} onFocus={setActivePhotoIndex} />
          </>
        )}

        {view !== "album" && (
          <section className="story-strip" id="stories" aria-label="旅行故事说明">
            <Layers3 size={18} />
            <p>
              先从国家/地区网络进入，再展开中国内部地图或具体地区相册。真实照片已经按 zip 文件夹生成网页优化图，
              首屏不会一次加载全部 232 张照片。
            </p>
          </section>
        )}

        <ExploreSteps />
      </div>

      {activePhoto && activePhotoIndex !== null && (
        <FocusViewer
          album={selectedAlbum}
          photo={activePhoto}
          index={activePhotoIndex}
          total={selectedAlbum.photos.length}
          onClose={() => setActivePhotoIndex(null)}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById("album-root")!).render(
  <StrictMode>
    <JourneyAlbumPage />
  </StrictMode>,
);

import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { journeyPhotos, personalStatement } from "./data";
import "./album.css";

function Album() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => setActiveIndex(null);
  const showPrevious = () =>
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + journeyPhotos.length) % journeyPhotos.length,
    );
  const showNext = () =>
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % journeyPhotos.length,
    );

  useEffect(() => {
    if (activeIndex === null) {
      document.body.classList.remove("lightbox-open");
      return;
    }

    document.body.classList.add("lightbox-open");
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  return (
    <main className="album-page">
      <header className="album-header">
        <a className="back-link" href="../index.html">
          <ArrowLeft size={18} />
          返回学术主页
        </a>
        <span>Qi Heng · Personal Album</span>
      </header>

      <section className="album-intro">
        <p className="album-kicker">Travel · Hiking · Photography</p>
        <h1>个人爱好 · 相册</h1>
        <p>
          旅行、徒步和摄影，是我理解世界、重新确认自我的方式。它们与技术实践来自同一种动力：
          不断走向未知，并把模糊的兴趣变成可以真实验证的东西。
        </p>
        <small>{personalStatement.paragraphs.length} 段个人简述 · 12 张公开照片</small>
      </section>

      <section className="album-grid" aria-label="旅行、徒步与摄影照片">
        {journeyPhotos.map((photo, index) => (
          <button
            className={`album-photo ${photo.layout}`}
            type="button"
            key={photo.file}
            onClick={() => setActiveIndex(index)}
            aria-label={`查看第 ${index + 1} 张照片：${photo.alt}`}
          >
            <img
              src={`../travel/${photo.file}`}
              alt={photo.alt}
              loading={index < 4 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </section>

      <footer className="album-footer">
        <p>探索并不与学术训练分离，它构成了我观察、判断和实践的起点。</p>
        <a className="back-link" href="../index.html">
          <ArrowLeft size={18} />
          返回学术主页
        </a>
      </footer>

      {activeIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`照片 ${activeIndex + 1} / ${journeyPhotos.length}`}
          onClick={close}
        >
          <button
            ref={closeButtonRef}
            className="lightbox-close"
            type="button"
            onClick={close}
            title="关闭"
          >
            <X size={24} />
          </button>
          <button
            className="lightbox-nav previous"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            title="上一张"
          >
            <ChevronLeft size={30} />
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img
              src={`../travel/${journeyPhotos[activeIndex].file}`}
              alt={journeyPhotos[activeIndex].alt}
            />
            <figcaption>
              {String(activeIndex + 1).padStart(2, "0")} / {journeyPhotos.length}
            </figcaption>
          </figure>
          <button
            className="lightbox-nav next"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            title="下一张"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("album-root")!).render(
  <StrictMode>
    <Album />
  </StrictMode>,
);

import { useEffect, useState } from "react";
import { homeNavigation, type ResearchAreaId } from "./content";
import { HeroSection, SiteHeader } from "./Hero";
import {
  AcademicBaseline,
  AlbumTeaser,
  FeaturedEvidence,
  ResearchRoad,
  SiteFooter,
  SummerCampSection,
} from "./Sections";
import { useActiveSection, useReducedMotion } from "./motion";

const sectionIds = homeNavigation.map((item) => item.sectionId);

export function HomeApp() {
  const reducedMotion = useReducedMotion();
  const activeSection = useActiveSection(sectionIds);
  const [activeAreaId, setActiveAreaId] = useState<ResearchAreaId>("agents");

  useEffect(() => {
    const sectionId = decodeURIComponent(window.location.hash.slice(1));
    if (!sectionId) return;
    const section = document.getElementById(sectionId);
    if (!section) return;
    const frame = window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      section.scrollIntoView({ block: "start", behavior: "auto" });
      root.style.scrollBehavior = previousScrollBehavior;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main className={reducedMotion ? "reduced-motion" : ""}>
      <SiteHeader activeSection={activeSection} />
      <HeroSection
        activeAreaId={activeAreaId}
        onAreaChange={setActiveAreaId}
        reducedMotion={reducedMotion}
      />
      <ResearchRoad reducedMotion={reducedMotion} />
      <FeaturedEvidence
        activeAreaId={activeAreaId}
        onAreaChange={setActiveAreaId}
        reducedMotion={reducedMotion}
      />
      <AcademicBaseline reducedMotion={reducedMotion} />
      <AlbumTeaser reducedMotion={reducedMotion} />
      <SummerCampSection reducedMotion={reducedMotion} />
      <SiteFooter />
    </main>
  );
}

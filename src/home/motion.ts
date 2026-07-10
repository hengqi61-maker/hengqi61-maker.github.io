import { useEffect, useRef, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useLightField<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = window.scrollY;
    let frame = 0;

    const render = () => {
      frame = 0;
      element.style.setProperty("--field-x", pointerX.toFixed(3));
      element.style.setProperty("--field-y", pointerY.toFixed(3));
      element.style.setProperty("--field-scroll", `${Math.min(scrollY, 1200) * 0.035}px`);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
      schedule();
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      schedule();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [disabled]);

  return ref;
}

export function useReveal<T extends HTMLElement>(disabled = false) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(disabled);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (disabled || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [disabled]);

  return { ref, visible };
}

export function useTilt<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    let frame = 0;
    let rotateX = 0;
    let rotateY = 0;

    const render = () => {
      frame = 0;
      element.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      rotateX = y * -5;
      rotateY = x * 6;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onLeave = () => {
      rotateX = 0;
      rotateY = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [disabled]);

  return ref;
}

export function useActiveSection(sectionIds: readonly string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "top");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const visibleSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target.id);
          else visibleSections.delete(entry.target.id);
        });
        const next = [...sectionIds].reverse().find((id) => visibleSections.has(id));
        if (next) setActiveSection(next);
      },
      { rootMargin: "-18% 0px -70%", threshold: 0 },
    );

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        if (atPageEnd) setActiveSection(sectionIds[sectionIds.length - 1] ?? "top");
      });
    };

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeSection;
}

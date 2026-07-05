import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function CustomCursor() {
  const { isNight } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);

  const updateDot = useCallback(() => {
    if (!dotRef.current) return;
    const h = hoveringRef.current;
    dotRef.current.style.width = h ? "16px" : "8px";
    dotRef.current.style.height = h ? "16px" : "8px";
    dotRef.current.style.marginLeft = h ? "-8px" : "-4px";
    dotRef.current.style.marginTop = h ? "-8px" : "-4px";
    dotRef.current.style.opacity = h ? "0.7" : "1";
  }, []);

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]")
      ) {
        hoveringRef.current = true;
        updateDot();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      if (
        target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]") &&
        (!related || !related.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]"))
      ) {
        hoveringRef.current = false;
        updateDot();
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [updateDot]);

  // Hide on mobile/touch
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999]"
      style={{
        opacity: 0,
        willChange: "transform",
      }}
    >
      <div
        ref={dotRef}
        className="rounded-full"
        style={{
          backgroundColor: accentColor,
          width: "8px",
          height: "8px",
          marginLeft: "-4px",
          marginTop: "-4px",
          opacity: 1,
          transition: "width 200ms cubic-bezier(0.16, 1, 0.3, 1), height 200ms cubic-bezier(0.16, 1, 0.3, 1), margin 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}

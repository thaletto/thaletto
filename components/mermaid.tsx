"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
    });
    mermaid.render("mermaid-" + Date.now(), children).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg;
    });
  }, [children]);

  return <div ref={ref} className="mt-4" />;
}

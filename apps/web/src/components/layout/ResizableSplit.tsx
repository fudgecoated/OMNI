import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  left: ReactNode;
  right: ReactNode;
  storageKey?: string;
  defaultLeftPct?: number;
  minPct?: number;
  maxPct?: number;
}

export function ResizableSplit({
  left,
  right,
  storageKey = "split:hermes:leftPct",
  defaultLeftPct = 42,
  minPct = 28,
  maxPct = 72,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct] = useState<number>(() => {
    if (typeof window === "undefined") return defaultLeftPct;
    const stored = window.localStorage.getItem(storageKey);
    const n = stored ? Number(stored) : NaN;
    return Number.isFinite(n) && n >= minPct && n <= maxPct ? n : defaultLeftPct;
  });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.max(minPct, Math.min(maxPct, pct)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [dragging, minPct, maxPct]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(leftPct));
  }, [leftPct, storageKey]);

  return (
    <div
      ref={containerRef}
      className="flex flex-1 min-h-0 relative hermes-split"
      style={{ display: "flex", flex: 1, minHeight: 0, position: "relative" }}
    >
      <div className="hermes-split__pane hermes-split__pane--left" style={{ width: `${leftPct}%`, minWidth: 0, flexShrink: 0 }}>{left}</div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
        onMouseDown={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDoubleClick={() => setLeftPct(defaultLeftPct)}
        data-testid="split-resizer"
        className="hermes-split__resizer"
        style={{
          width: 6,
          flexShrink: 0,
          cursor: "col-resize",
          background: dragging ? "var(--vl-accent)" : "var(--vl-menu-border)",
        }}
      />
      <div className="hermes-split__pane hermes-split__pane--right" style={{ flex: 1, minWidth: 0 }}>{right}</div>
    </div>
  );
}

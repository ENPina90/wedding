import { useEffect, useRef, useState } from "react";
import { WEDDING_COLORS } from "../constants/weddingColors";

interface WeddingColorSwatchesProps {
  size?: "sm" | "md";
}

export default function WeddingColorSwatches({ size = "md" }: WeddingColorSwatchesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sizeClass =
    size === "sm"
      ? "w-6 h-6 sm:w-7 sm:h-7"
      : "w-7 h-7 sm:w-8 sm:h-8";

  useEffect(() => {
    if (activeIndex === null) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeIndex]);

  return (
    <div ref={wrapperRef} className="flex flex-nowrap justify-center gap-2 sm:gap-2.5">
      {WEDDING_COLORS.map((color, i) => (
        <div key={i} className="relative">
          {activeIndex === i && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-10 flex flex-col items-center">
              <div
                className="shrink-0"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderBottom: `6px solid ${color.hex}`,
                }}
              />
              <div
                className="px-2 py-1 rounded text-xs sm:text-sm font-body text-plum bg-cream whitespace-nowrap shadow-md -mt-px"
                style={{ border: `1px solid ${color.hex}` }}
              >
                {color.name}
              </div>
            </div>
          )}
          <button
            type="button"
            className={`${sizeClass} rounded-[5px] shrink-0 cursor-pointer border-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-plum/50 focus-visible:ring-offset-2 focus-visible:ring-offset-beige`}
            style={{ backgroundColor: color.hex }}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            aria-label={`${color.name} (${color.hex})`}
          />
        </div>
      ))}
    </div>
  );
}

import flowerLogoSvg from "../assets/flower_logo.svg?raw";

export type FlowerLogoColor = "base" | "blue" | "green" | "pink" | "purple";

const colorMap: Record<FlowerLogoColor, string> = {
  base: "#EA785B",
  blue: "#626D8D",
  green: "#889944",
  pink: "#E193D2",
  purple: "#894864",
};

interface FlowerLogoProps {
  color?: FlowerLogoColor;
  className?: string;
}

export default function FlowerLogo({
  color = "base",
  className = "",
}: FlowerLogoProps) {
  const svgWithColor = flowerLogoSvg.replace(
    /fill="[^"]*"/g,
    `fill="${colorMap[color]}"`
  );
  return (
    <span
      className={`inline-block h-12 sm:h-16 md:h-20 w-auto [&>svg]:h-full [&>svg]:w-auto [&>svg]:block ${className}`}
      dangerouslySetInnerHTML={{ __html: svgWithColor }}
      aria-hidden
    />
  );
}

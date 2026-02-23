import flowerCenter from "../assets/flower_center.svg";

export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-10 sm:my-14 md:my-16 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Left divider line with diamond */}
      <div className="flex items-center flex-1 max-w-[60px] sm:max-w-[100px] md:max-w-[150px]">
        <div className="flex-1 h-px bg-plum/20" />
        <div className="w-1.5 h-1.5 bg-plum/20 rotate-45" />
      </div>

      {/* Center flower image */}
      <img
        src={flowerCenter}
        alt=""
        className="max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px] h-auto object-contain flex-shrink-0"
      />

      {/* Right divider line with diamond */}
      <div className="flex items-center flex-1 max-w-[60px] sm:max-w-[100px] md:max-w-[150px]">
        <div className="w-1.5 h-1.5 bg-plum/20 rotate-45" />
        <div className="flex-1 h-px bg-plum/20" />
      </div>
    </div>
  );
}

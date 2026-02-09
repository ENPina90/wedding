import flowersCenter from "../assets/flowers_center.png";

export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-16 max-w-2xl mx-auto px-6">
      {/* Left divider line with diamond */}
      <div className="flex items-center flex-1 max-w-[100px] md:max-w-[150px]">
        <div className="flex-1 h-px bg-plum/20" />
        <div className="w-1.5 h-1.5 bg-plum/20 rotate-45" />
      </div>

      {/* Center flower image */}
      <img
        src={flowersCenter}
        alt=""
        className="max-w-[80px] md:max-w-[100px] lg:max-w-[120px] h-auto object-contain flex-shrink-0"
      />

      {/* Right divider line with diamond */}
      <div className="flex items-center flex-1 max-w-[100px] md:max-w-[150px]">
        <div className="w-1.5 h-1.5 bg-plum/20 rotate-45" />
        <div className="flex-1 h-px bg-plum/20" />
      </div>
    </div>
  );
}

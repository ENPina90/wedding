import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <FlowerLogo color="blue" />
      </div>

      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum text-2xl sm:text-3xl md:text-4xl tracking-[2.24px] italic">
          FAQ
        </h2>
      </div>

      <SectionDivider />

      <div className="text-center">
        <p className="font-body text-plum/75 text-sm sm:text-base leading-7">
          Frequently asked questions coming soon.
        </p>
      </div>
    </div>
  );
}

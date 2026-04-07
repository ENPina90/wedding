import { Link } from "react-router-dom";
import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";
import WeddingColorSwatches from "../components/WeddingColorSwatches";

export default function Info() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-[35px]">
        <FlowerLogo color="blue" />
      </div>

      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum tracking-[2.24px] italic">
          Event
        </h2>
      </div>

      {/* Intro */}
      <div className="text-center mb-10 sm:mb-12 px-1">
        <p className="sub-header font-body text-plum leading-7 max-w-2xl mx-auto text-center">
          Here you'll find details and instructions pertaining to all things
          wedding day. If your question isn't answered here, try the{" "}
          <Link
            to="/faq"
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            FAQ
          </Link>
          !
        </p>
      </div>

      <SectionDivider />

      {/* Location */}
      <div className="text-center mb-8 sm:mb-10 px-1">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic mb-2 sm:mb-3">
          Location
        </h3>
        <div className="font-body text-plum leading-7 max-w-xl mx-auto text-center">
          <p className="font-bold mb-0">Lucky Arrow Retreat</p>
          <p>3600 Bell Springs Rd, Dripping Springs, TX 78620, United States</p>
        </div>
        <p className="font-body text-plum leading-7 mt-3 sm:mt-4 max-w-xl mx-auto text-center">
          <span className="font-bold">Attire</span>
          {`: come dressed to celebrate! We're envisioning a semi-formal affair, cocktail dresses, suits, and floor-length gowns are all perfectly at home. Our wedding colors are shared below if you'd like a little inspiration, but wear whatever color you like!`}
        </p>
        <div className="mt-4 sm:mt-5">
          <WeddingColorSwatches />
        </div>
      </div>

      <SectionDivider />

      {/* Wedding Event */}
      <div className="text-center mb-8 sm:mb-10 px-1">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic mb-2 sm:mb-3">
          Wedding Event
        </h3>
        <div className="font-body text-plum leading-7 max-w-xl mx-auto text-center">
          <p className="mb-0">Saturday, November 21 2026</p>
          <p>4:00 P.M. - 11:00 P.M.</p>
        </div>
        <div className="font-nav text-plum text-base sm:text-lg mt-3 sm:mt-4 space-y-1 text-center max-w-xl mx-auto">
          <p className="mb-0">
            <span className="font-bold">arrival</span>: 4:00 p.m.
          </p>
          <p className="mb-0">
            <span className="font-bold">ceremony</span>: 4:30 p.m.
          </p>
          <p className="mb-0">
            <span className="font-bold">cocktail hour</span>: 5:00 p.m.
          </p>
          <p>
            <span className="font-bold">reception</span>: 6:00 p.m.
          </p>
        </div>
        <p className="font-body text-plum leading-7 mt-3 sm:mt-4 max-w-xl mx-auto text-center">
          Please arrive by 4:00 PM to get settled before the ceremony begins.
          Light refreshments will be available as you arrive. We can't wait to
          welcome you!
        </p>
        <p className="font-body text-plum leading-7 mt-3 sm:mt-4 max-w-xl mx-auto text-center">
          If you're staying at the{" "}
          <span className="font-bold">Sleep Inn & Suites Dripping Springs</span>{" "}
          there will be a shuttle provided to the venue for drop off and pick
          up. More details TBA.
        </p>
        <p className="font-body text-plum leading-7 mt-3 sm:mt-4 max-w-xl mx-auto text-center italic">
          For those of you staying on the property with us:
          <br />
          Check-in is at 4:00 P.M. — please arrive a little bit earlier since
          there will be many of you checking in at once.
        </p>
      </div>

      <SectionDivider />

      {/* Farewell Breakfast */}
      <div className="text-center mb-12 sm:mb-16 px-1">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic mb-2 sm:mb-3">
          Farewell Breakfast
        </h3>
        <div className="font-body text-plum leading-7 max-w-xl mx-auto text-center">
          <p className="mb-0">Sunday, November 22 2026</p>
          <p>9:30 A.M.</p>
        </div>
        <p className="font-body text-plum leading-7 mt-3 sm:mt-4 max-w-xl mx-auto text-center">
          For guests staying on property overnight, there will be a small
          grab-and-go taco breakfast and coffee or tea provided on the lawn in
          the morning before check-out at 11:00 A.M.
        </p>
      </div>
    </div>
  );
}

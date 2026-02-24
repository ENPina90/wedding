import SectionDivider from "../components/SectionDivider";
import proposalPhoto from "../assets/proposal-photo.png";
import sparkleIcon from "../assets/sparkle.svg";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Hero Image - mobile: less margin, full width */}
      <div className="relative mx-auto mt-6 sm:mt-10 md:mt-12 mb-10 sm:mb-14 md:mb-16 max-w-xl">
        <div className="overflow-hidden">
          <img
            src={proposalPhoto}
            alt="Proposal moment"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Announcement */}
      <div className="text-center">
        <h2 className="font-display text-plum tracking-[2.24px] italic -mt-6 -mb-6">
          We're gettin' hitched!
        </h2>

        {/* Date with sparkles */}
        <div className="mt-16 mb-2 sm:mb-3">
          <p className="font-nav text-plum font-medium text-xs sm:text-sm tracking-[1.4px] uppercase pt-4">
            wedding date
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6">
          <img
            src={sparkleIcon}
            alt=""
            className="w-12 h-12 shrink-0"
          />
          <p className="font-display text-plum text-xl sm:text-2xl md:text-3xl tracking-[2px] italic">
            November 21, 2026
          </p>
          <img
            src={sparkleIcon}
            alt=""
            className="w-12 h-12 shrink-0"
          />
        </div>

        {/* RSVP Button - full width on mobile for touch target */}
        <div className="mt-6 px-2 sm:px-0">
          <a
            href="https://withjoy.com/kirsten-and-nic/rsvp"
            target="_blank"
            rel="noopener noreferrer"
            className="block sm:inline-block text-center bg-pink hover:bg-[#E193D2] active:bg-[#B762A7] active:text-white text-burgundy font-body font-bold text-base tracking-[1.92px] px-6 py-4 sm:px-8 min-h-[48px] flex items-center justify-center rounded-lg transition-colors"
          >
            RSVP Here
          </a>
        </div>
      </div>

      <SectionDivider />

      {/* Our Story Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
        <h3 className="font-nav text-plum font-medium text-xs sm:text-sm tracking-[1.4px] uppercase pt-0 pb-6">
          our story
        </h3>
        <div className="font-body text-plum/80 leading-7 text-left max-w-2xl mx-auto space-y-4 sm:space-y-6 px-1">
          <p>
            It all started with a chance meeting and a spark that neither of us
            could ignore. From our very first conversation, we knew something
            special was unfolding — a connection built on laughter, shared
            dreams, and an unwavering sense of adventure.
          </p>
          <p>
            Through every season, every late-night talk, every quiet morning
            together, our love has grown into something we never imagined
            possible. Now, surrounded by the beauty of the world and the people
            we cherish most, we're ready to take the next step on this
            incredible journey.
          </p>
          <p>
            We can't wait to celebrate with you — the people who have supported
            us, cheered us on, and filled our lives with so much joy. Thank you
            for being part of our story.
          </p>
        </div>
      </div>
    </div>
  );
}

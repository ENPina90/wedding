import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import SectionDivider from "../components/SectionDivider";
import proposalPhoto from "../assets/proposal-photo.png";
import sparkleIcon from "../assets/sparkle.svg";
import flowerDetailLeft from "../assets/flower_detail_left.png";
import flowerDetailRight from "../assets/flower_detail_right.png";

const homeCarouselImageModules = import.meta.glob(
  "../assets/photos/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

export default function Home() {
  const { openRsvpModal } = useOutletContext<{ openRsvpModal: () => void }>();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const heroPhotos = useMemo(() => {
    const sortedPhotos = Object.entries(homeCarouselImageModules)
      .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
      .map(([, src]) => src);

    if (sortedPhotos.length === 0) {
      return [proposalPhoto];
    }

    return sortedPhotos;
  }, []);

  useEffect(() => {
    if (heroPhotos.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActivePhotoIndex((current) => (current + 1) % heroPhotos.length);
    }, 6000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [heroPhotos]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Hero Image - mobile: less margin, full width */}
      <div className="relative mx-auto mt-6 sm:mt-10 md:mt-12 mb-10 sm:mb-14 md:mb-16 max-w-xl">
        <img
          src={flowerDetailLeft}
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute -top-14 -left-14 w-28 lg:w-32 z-20 select-none pointer-events-none"
        />
        <img
          src={flowerDetailRight}
          alt=""
          aria-hidden="true"
          className="hidden md:block absolute -bottom-16 -right-12 w-32 lg:w-36 z-20 select-none pointer-events-none"
        />
        <div className="relative overflow-hidden">
          <img
            src={heroPhotos[0]}
            alt="Proposal moment"
            className="w-full h-auto object-cover opacity-0 select-none pointer-events-none"
            aria-hidden="true"
          />
          {heroPhotos.map((photoSrc, index) => (
            <img
              key={photoSrc}
              src={photoSrc}
              alt="Proposal moment"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1800ms] ${index === activePhotoIndex ? "opacity-100" : "opacity-0"}`}
            />
          ))}
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
        <div className="mt-6 px-2 sm:px-0 flex justify-center">
          <button
            type="button"
            onClick={openRsvpModal}
            className="block sm:inline-block text-center bg-pink hover:bg-[#E193D2] active:bg-[#B762A7] active:text-white text-burgundy font-body font-bold text-base tracking-[1.92px] px-6 py-4 sm:px-8 min-h-[48px] flex items-center justify-center rounded-lg transition-colors"
          >
            RSVP Here
          </button>
        </div>
      </div>

      <SectionDivider />

      {/* Our Story Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
        <h3 className="font-nav text-plum font-medium text-xs sm:text-sm tracking-[1.4px] uppercase pt-0 pb-6">
          our story
        </h3>
        <div className="font-body text-plum leading-7 text-left max-w-2xl mx-auto space-y-4 sm:space-y-6 px-1">
            <p>
            Where to start our story? We could begin at the beginning of the rest of our lives together. When Nic and friends tricked Kirsten into thinking she was going on a girls trip to Dresden, only to ambush her beneath an arch in the old town with an opera singer, an engagement ring, and a series of cinematic near-misses along the way (a story for another time).
            </p>
            <p>
            Or perhaps ten years earlier, on the night that inspired it all. When we traveled together for the first time to that same city, and on our very first evening happened upon an opera singer performing in that very same arch. Watching tears roll down Kirsten’s face stirred something in Nic’s heart, but then of course, we were still just friends.
            </p>
            <p>
            So maybe we land somewhere in between. When we found ourselves falling into will-they-won’t-they situationship straight out of a sitcom. That is until we unintentionally caught feelings for each other in a plot twist that surprised utterly no one but ourselves. Only for Kirsten to then decide the only solution to said feelings was to end our friendship completely and leave Berlin entirely. But Nic refused to let her go until she saw what was right in front of us the whole time, and we decided to give this whole life together a chance.
            </p>
            <p>
            Or perhaps not long after in the heart of lockdown, when we became each other’s entire worlds and social circles, and what felt like life times were lived in months alone together.
            </p>
            <p>
            But why stop there when we could go all the way back to flirtations at co-op parties and kisses on the Barb’s dance floor circa Austin, 2012.
            </p>
            <p>
            However you choose to tell it, whatever city, whatever year, it turns out we've been falling in love everyday, every fact, feeling, adventure, and tribulation along the way.
            </p>
        </div>
      </div>
    </div>
  );
}

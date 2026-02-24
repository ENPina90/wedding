import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";

interface AccommodationCardProps {
  name: string;
  description: string;
  distance: string;
  website?: string;
  phone?: string;
}

function AccommodationCard({
  name,
  description,
  distance,
  website,
  phone,
}: AccommodationCardProps) {
  return (
    <div className="bg-cream rounded-xl p-4 sm:p-6 md:p-8 border border-pink/30">
      <h3 className="font-display text-plum text-lg sm:text-xl tracking-[1.68px] italic mb-2">
        {name}
      </h3>
      <p className="font-nav text-plum/60 text-xs tracking-[1px] uppercase mb-2 sm:mb-3">
        {distance} from venue
      </p>
      <p className="font-body text-plum/75 leading-7 mb-3 sm:mb-4">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-pink hover:bg-pink/80 text-burgundy font-body font-bold text-sm tracking-[1.5px] px-5 py-2.5 rounded-lg transition-colors"
          >
            VISIT WEBSITE
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-block border border-plum/30 hover:bg-plum/5 text-plum font-body text-sm tracking-[1.5px] px-5 py-2.5 rounded-lg transition-colors"
          >
            {phone}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Accommodations() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      {/* Flower logos above header - smaller on mobile */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-[35px]">
        <FlowerLogo color="base" />
      </div>

      {/* Accommodations header */}
      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum tracking-[2.24px] italic">
          Accommodations
        </h2>
        <p className="font-body text-plum/70 text-base sm:text-lg mt-2 sm:mt-3">
          Places to stay near the venue
        </p>
      </div>

      {/* Section divider with flower_center.svg */}
      <SectionDivider />

      <div className="space-y-6">
        <AccommodationCard
          name="The Cape Codder Resort & Spa"
          description="A full-service resort with an indoor wave pool, spa, and on-site dining. We have a room block reserved — mention the Kirsten & Nic wedding for a special rate."
          distance="5 minutes"
          website="https://example.com"
          phone="(508) 555-0101"
        />

        <AccommodationCard
          name="Sea Crest Beach Hotel"
          description="Charming oceanfront hotel with beautiful views, a private beach, and cozy rooms. Perfect for extending your stay into a mini vacation."
          distance="10 minutes"
          website="https://example.com"
          phone="(508) 555-0202"
        />

        <AccommodationCard
          name="The Inn at the Oaks"
          description="A quaint bed & breakfast nestled among oak trees, offering a warm and intimate atmosphere with complimentary homemade breakfast."
          distance="8 minutes"
          website="https://example.com"
        />
      </div>

      <SectionDivider />

      {/* Transportation Info */}
      <div className="text-center px-1">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic mb-3 sm:mb-4">
          Getting Around
        </h3>
        <p className="font-body text-plum/75 leading-7 max-w-xl mx-auto text-left sm:text-center">
          While Uber and Lyft are available on the Cape, they can be less
          reliable than in the city. We recommend arranging rides with fellow
          guests or booking a car service in advance. Shuttle information will
          be shared closer to the date.
        </p>
      </div>
    </div>
  );
}

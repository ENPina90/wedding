import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";

import sleepInnMap from "../assets/google maps/sleep_nn_suites_dripping_springs.png";
import holidayInnMap from "../assets/google maps/holiday_inn_express_suites_dripping_springs.png";
import hillCountryMap from "../assets/google maps/hill_country_casitas.png";
import luckyArrowMap from "../assets/google maps/lucky_arrow_retreat.png";

const EMAIL = "kirschroder@gmail.com";
const LUCKY_ARROW_PHONE = "(512) 400-4197";
const LUCKY_ARROW_ADDRESS = "3600 Bell Springs Rd, Dripping Springs, TX 78620";
const LUCKY_ARROW_MAPS_URL = "https://maps.app.goo.gl/213U9Q74ZMqf5iGK7";
const LUCKY_ARROW_WEBSITE = "https://luckyarrowretreat.com";
const SLEEP_INN_PHONE = "(512) 858-2400";
const SLEEP_INN_BOOKING_URL =
  "https://www.choicehotels.com/texas/dripping-springs/sleep-inn-hotels/txe80?mc=llgoxxpx";
const GROUP_NAME = "Schroder Piña Wedding";
const GROUP_CODE = "b969991";

const BOOKING_INSTRUCTIONS_PDF = "/room_booking_guide.pdf";
const LODGING_FAQ_URL = "https://luckyarrowretreat.com/faq";
const LODGING_TYPES_URL = "https://luckyarrowretreat.com";

interface HotelCardProps {
  name: string;
  distance: string;
  distanceSuffix?: string;
  note?: string;
  mapsUrl: string;
  website: string;
  phone: string;
  mapImage?: string;
  primaryButtonText?: string;
}

function HotelCard({
  name,
  distance,
  distanceSuffix = " from venue",
  note,
  mapsUrl,
  website,
  phone,
  mapImage,
  primaryButtonText = "Visit website",
}: HotelCardProps) {
  return (
    <div className="w-full md:max-w-[335px] mx-auto bg-cream rounded-lg p-4 sm:p-6 md:p-8 border border-[#a1a8be]/50 [border-image:none] flex flex-col">
      <div className="h-[8.5rem] sm:h-[9rem] flex flex-col shrink-0 justify-center items-center text-center">
        <h3 className="font-display text-[#6e799b] text-lg sm:text-xl tracking-[1.68px] italic mb-2">
          {name}
        </h3>
        <p className="font-nav text-[#626D8D] text-[15px] tracking-[1px] uppercase mb-2 sm:mb-3">
          {distance}
          {distanceSuffix}
        </p>
        {note && (
          <p className="font-body text-plum text-xs sm:text-sm mb-2 sm:mb-3 italic">
            {note}
          </p>
        )}
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block mb-3 sm:mb-4 rounded-lg overflow-hidden border border-pink/20 bg-white/50 relative"
      >
        <div className="aspect-video bg-sage/20 flex items-center justify-center overflow-hidden">
          {mapImage ? (
            <img
              src={mapImage}
              alt={`${name} on Google Maps`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-body text-plum text-xs sm:text-sm font-bold tracking-[1px]">
              View on Google Maps
            </span>
          )}
        </div>
        <span
          className="absolute top-[108px] left-1/2 -translate-x-1/2 inline-flex w-[172px] h-[42px] items-center justify-center border border-plum/25 bg-cream/95 group-hover:bg-[#FCF2EE] text-[#626D8D] font-body font-bold text-xs tracking-[1.5px] px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap pointer-events-none"
          aria-hidden
        >
          View on Google Maps
        </span>
      </a>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-coral hover:bg-coral-hover active:bg-coral-active text-white font-body font-bold text-sm tracking-[1.5px] px-5 py-2.5 rounded-lg transition-colors"
        >
          {primaryButtonText}
        </a>
        <a
          href={`tel:${phone.replace(/\D/g, "")}`}
          className="inline-block border border-plum/30 hover:bg-plum/5 text-plum font-body text-sm tracking-[1.5px] px-5 py-2.5 rounded-lg transition-colors"
        >
          {phone}
        </a>
      </div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-nav text-plum text-xs sm:text-sm tracking-[1px] uppercase mb-2 sm:mb-3 mt-4 sm:mt-6 first:mt-0 text-center">
      {children}
    </h4>
  );
}

export default function Accommodations() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-[35px]">
        <FlowerLogo color="base" />
      </div>

      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum tracking-[2.24px] italic">
          Accommodations
        </h2>
        <p className="font-body text-plum text-base sm:text-lg mt-2 sm:mt-3 max-w-xl mx-auto text-left sm:text-center">
          Everything you need to know about your overnight stay, reach out to us
          for help with bookings anytime at{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            {EMAIL}
          </a>{" "}
          💌
        </p>
      </div>

      <SectionDivider />

      {/* Hotel Room Blockings */}
      <div className="space-y-6 text-center">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic">
          Hotel Room Blockings
        </h3>
        <div className="font-body text-plum leading-7 text-left sm:text-center space-y-3 max-w-2xl mx-auto">
          <p>
            We have reserved rooms at{" "}
            <span className="font-bold">
              Sleep Inn & Suites Dripping Springs - Austin Area.
            </span>
          </p>
          <p>
            Please use the provided link below to book online or call Sleep Inn
            & Suites directly at{" "}
            <a
              href={`tel:${SLEEP_INN_PHONE.replace(/\D/g, "")}`}
              className="text-plum underline hover:text-burgundy transition-colors"
            >
              {SLEEP_INN_PHONE}
            </a>{" "}
            and make sure to ask for the group name &quot;{GROUP_NAME}&quot;.
          </p>
          <p>
            Please book{" "}
            <span className="font-bold">as soon as possible</span> as hotels are
            already filling up — latest by{" "}
            <span className="font-bold">August 2nd, 2026.</span>
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full md:max-w-[335px]">
            <HotelCard
              name="Sleep Inn & Suites Dripping Springs - Austin Area"
              distance="15 minutes"
              mapsUrl="https://maps.app.goo.gl/dbKwBWfbw9HY51499"
              website={SLEEP_INN_BOOKING_URL}
              phone={SLEEP_INN_PHONE}
              mapImage={sleepInnMap}
              primaryButtonText="Book with discount"
            />
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Additional Recommended Hotels */}
      <div className="space-y-6 text-center">
        <h3 className="font-nav text-plum text-xs sm:text-sm tracking-[1px] uppercase">
          additional recommended hotels
        </h3>
        <p className="font-body text-plum leading-7 text-left sm:text-center max-w-2xl mx-auto">
          The following hotels are within 10-15 minutes of Lucky Arrow Retreat if
          you'd prefer to stay elsewhere, there would then be no shuttle
          provided but you should easily be able to book an Uber to and from the
          suggested hotels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 justify-items-center">
          <HotelCard
            name="Holiday Inn Express & Suites Dripping Springs"
            distance="10 minutes"
            mapsUrl="https://maps.app.goo.gl/R49uNWSdeLsY4nns6"
            website="https://www.ihg.com/holidayinnexpress/hotels/us/en/dripping-springs/ausds/hoteldetail"
            phone="(512) 858-0280"
            mapImage={holidayInnMap}
          />
          <HotelCard
            name="Hill Country Casitas"
            distance="14 minutes"
            mapsUrl="https://maps.app.goo.gl/preEYjggrCYhxNTx5"
            website="https://www.hillcountrycasitas.com/"
            phone="(512) 829-1558"
            mapImage={hillCountryMap}
          />
        </div>
      </div>

      <SectionDivider />

      {/* On-site Lodging */}
      <div className="space-y-6 text-center">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic">
          On-site Lodging
        </h3>
        <p className="font-body text-plum leading-7 text-left sm:text-center max-w-2xl mx-auto">
          Those of you who we've spoken with about staying on-site, please book
          as early as possible — latest{" "}
          <span className="font-bold">by August 2nd, 2026.</span>
        </p>

        <SubHeading>address</SubHeading>
        <div className="font-body text-plum leading-7 text-left sm:text-center">
          <p className="font-bold mb-0">Lucky Arrow Retreat</p>
          <p>
            <a
              href={LUCKY_ARROW_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum no-underline hover:text-burgundy transition-colors"
            >
              {LUCKY_ARROW_ADDRESS}, United States
            </a>
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full md:max-w-[335px]">
            <HotelCard
              name="Lucky Arrow Retreat"
              distance="dripping springs, texas"
              distanceSuffix=""
              mapsUrl={LUCKY_ARROW_MAPS_URL}
              website={LUCKY_ARROW_WEBSITE}
              phone={LUCKY_ARROW_PHONE}
              mapImage={luckyArrowMap}
            />
          </div>
        </div>

        <SubHeading>booking instructions</SubHeading>
        <p className="font-body text-plum leading-7 text-left sm:text-center max-w-2xl mx-auto">
          For those of you booking online, you may{" "}
          <a
            href={BOOKING_INSTRUCTIONS_PDF}
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            download instructions to book here
          </a>
          .
        </p>
        <p className="font-body text-plum leading-7 text-left sm:text-center max-w-2xl mx-auto">
          For those of you who have either been instructed to book by phone or
          would prefer to book by phone, please call Lucky Arrow Retreat at{" "}
          <a
            href={`tel:${LUCKY_ARROW_PHONE.replace(/\D/g, "")}`}
            className="text-plum font-bold underline hover:text-burgundy transition-colors"
          >
            {LUCKY_ARROW_PHONE}
          </a>{" "}
          during regular business hours.
        </p>

        <p className="font-body font-bold text-plum text-lg sm:text-xl text-center">
          group code: {GROUP_CODE}
        </p>

        <SubHeading>accommodation details</SubHeading>
        <ul className="font-body text-plum leading-7 space-y-2 mb-4 text-left max-w-2xl mx-auto list-disc list-inside">
          <li>Check in: 4 P.M.</li>
          <li>Check out: 11 A.M.</li>
          <li>
            There are 5 types of lodging on property:
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Breezeway Cabins</li>
              <li>Porchyard Cabins</li>
              <li>Courtyard Cabins</li>
              <li>Safari Tents</li>
              <li>Yurts</li>
            </ul>
          </li>
          <li>
            You may{" "}
            <a
              href={LODGING_TYPES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum underline hover:text-burgundy transition-colors"
            >
              learn more about each lodging type here
            </a>
            .
          </li>
          <li>
            If we have not already spoken about which cabin type you are staying
            in or you are not sure, please reach out to us!
          </li>
          <li>Your parking will be in front of your cabin type area</li>
          <li>
            Please read{" "}
            <a
              href={LODGING_FAQ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum font-bold underline hover:text-burgundy transition-colors"
            >
              Lucky Arrow Retreat's Lodging FAQ here
            </a>
            .
          </li>
        </ul>

        <SubHeading>directions</SubHeading>
        <div className="font-body text-plum leading-7 space-y-3 text-left sm:text-center max-w-2xl mx-auto">
          <p>
            <span className="font-bold">From Austin:</span> Head west on Highway
            290 towards Dripping Springs for approximately 28 miles. Turn right
            (north) on Bell Springs Road and travel for 2.6 miles. Lucky Arrow
            Retreat will be on your left, just past Bell Springs Winery.
          </p>
          <p>
            <span className="font-bold">From San Antonio:</span> Take US-281
            north towards Blanco for 74 miles. Head east on TX-163 for 18 miles.
            Turn right (east) on FM 165E and continue for 16 miles. Turn right
            (east) on Highway 290 and continue for 6 miles. Turn left (north)
            onto Bell Springs Road and continue for 2.6 miles. Lucky Arrow
            Retreat will be on your left, just past Bell Springs Winery.
          </p>
        </div>
      </div>

      <SectionDivider />

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
        <a
          href={BOOKING_INSTRUCTIONS_PDF}
          download="room_booking_guide.pdf"
          className="inline-block text-center bg-pink hover:bg-pink/80 text-burgundy font-body font-bold text-sm tracking-[1.5px] px-6 py-3 rounded-lg transition-colors"
        >
          Download Booking instructions
        </a>
        <a
          href={LODGING_FAQ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-center bg-pink hover:bg-pink/80 text-burgundy font-body font-bold text-sm tracking-[1.5px] px-6 py-3 rounded-lg transition-colors"
        >
          Lucky Arrow Retreat's Lodging FAQ
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-block text-center bg-pink hover:bg-pink/80 text-burgundy font-body font-bold text-sm tracking-[1.5px] px-6 py-3 rounded-lg transition-colors"
        >
          Email us
        </a>
      </div>
    </div>
  );
}

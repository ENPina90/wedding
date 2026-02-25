import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";

import sleepInnMap from "../assets/google maps/sleep_nn_suites_dripping_springs.png";
import courtyardMap from "../assets/google maps/courtyard_by_marriott_austin_dripping_springs.png";
import holidayInnMap from "../assets/google maps/holiday_inn_express_suites_dripping_springs.png";
import hillCountryMap from "../assets/google maps/hill_country_casitas.png";
import luckyArrowMap from "../assets/google maps/lucky_arrow_retreat.png";

const EMAIL = "kirstenandnic@gmail.com";
const LUCKY_ARROW_PHONE = "(512) 400-4197";
const LUCKY_ARROW_ADDRESS = "3600 Bell Springs Rd, Dripping Springs, TX 78620";
const LUCKY_ARROW_MAPS_URL = "https://maps.app.goo.gl/213U9Q74ZMqf5iGK7";
const LUCKY_ARROW_WEBSITE = "https://luckyarrowretreat.com";

const BOOKING_INSTRUCTIONS_PDF = "/room_booking_guide.pdf";
const LODGING_FAQ_URL = "https://luckyarrowretreat.com/faq";
const LODGING_TYPES_URL = "https://luckyarrowretreat.com";

interface HotelCardProps {
  name: string;
  distance: string;
  distanceSuffix?: string; // e.g. " from venue" or empty for subtitle-only
  note?: string;
  mapsUrl: string;
  website: string;
  phone: string;
  mapImage?: string;
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
}: HotelCardProps) {
  return (
    <div className="bg-cream rounded-xl p-4 sm:p-6 md:p-8 border border-pink/30 flex flex-col">
      {/* Fixed-height header so map window aligns across all cards; title centered */}
      <div className="h-[8.5rem] sm:h-[9rem] flex flex-col shrink-0 justify-center items-center text-center">
        <h3 className="font-display text-[#6e799b] text-lg sm:text-xl tracking-[1.68px] italic mb-2">
          {name}
        </h3>
        <p className="font-nav text-plum/60 text-xs tracking-[1px] uppercase mb-2 sm:mb-3">
          {distance}
          {distanceSuffix}
        </p>
        {note && (
          <p className="font-body text-plum/70 text-xs sm:text-sm mb-2 sm:mb-3 italic">
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
            <span className="font-body text-plum/70 text-xs sm:text-sm font-bold tracking-[1px]">
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
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-coral hover:bg-coral-hover active:bg-coral-active text-white font-body font-bold text-sm tracking-[1.5px] px-5 py-2.5 rounded-lg transition-colors"
        >
          Visit website
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
    <h4 className="font-nav text-plum/80 text-xs sm:text-sm tracking-[1px] uppercase mb-2 sm:mb-3 mt-4 sm:mt-6 first:mt-0 text-center">
      {children}
    </h4>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside font-body text-plum/75 leading-7 space-y-1 mb-4">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function Accommodations() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      {/* Flower logos above header - shared with other pages */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-[35px]">
        <FlowerLogo color="base" />
      </div>

      {/* Accommodations header */}
      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum tracking-[2.24px] italic">
          Accommodations
        </h2>
        <p className="font-body text-plum/70 text-base sm:text-lg mt-2 sm:mt-3 max-w-xl mx-auto text-left sm:text-center">
          Everything you need to know about your overnight stay. Reach out to us
          for help with bookings anytime at{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            {EMAIL}
          </a>
          .
        </p>
      </div>

      <SectionDivider />

      {/* Hotel Recommendations */}
      <div className="space-y-6 text-center">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic">
          Hotel Recommendations
        </h3>
        <p className="font-body text-plum/75 leading-7">
          Unfortunately we are not able to secure room blockings for only one
          night stays in Dripping Springs, so if you are planning on staying in
          a hotel in Dripping Springs, please do so as soon as possible as
          hotels are already filling up — latest by August 2nd, 2026.
        </p>

        <SubHeading>Recommended hotels details</SubHeading>
        <BulletList
          items={[
            "The following hotels are within 10-15 minutes of Lucky Arrow Retreat",
            "There is plenty of parking at the suggested hotels",
            "You should be able to easily book an Uber to and from the suggested hotels",
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <HotelCard
            name="Sleep Inn & Suites Dripping Springs - Austin Area"
            distance="15 minutes"
            mapsUrl="https://maps.app.goo.gl/dbKwBWfbw9HY51499"
            website="https://www.choicehotels.com/texas/dripping-springs/sleep-inn-hotels/txe80?mc=llgoxxpx"
            phone="(512) 697-1646"
            mapImage={sleepInnMap}
          />
          <HotelCard
            name="Holiday Inn Express & Suites Dripping Springs"
            distance="10 minutes"
            mapsUrl="https://maps.app.goo.gl/R49uNWSdeLsY4nns6"
            website="https://www.ihg.com/holidayinnexpress/hotels/us/en/dripping-springs/ausds/hoteldetail"
            phone="(512) 858-0186"
            mapImage={holidayInnMap}
          />
          <HotelCard
            name="Hill Country Casitas"
            distance="14 minutes"
            mapsUrl="https://maps.app.goo.gl/preEYjggrCYhxNTx5"
            website="https://www.hillcountrycasitas.com/"
            phone="(512) 894-3556"
            mapImage={hillCountryMap}
          />
          <HotelCard
            name="Courtyard by Marriott Austin Dripping Springs"
            distance="10 minutes"
            note="*Possibly already booked out"
            mapsUrl="https://maps.app.goo.gl/hZ5cQQaLcGsBcbEA8"
            website="https://www.marriott.com/en-us/hotels/ausdi-courtyard-austin-dripping-springs/overview/?scid=f2ae0541-1279-4f24-b197-a979c79310b0"
            phone="(512) 894-3556"
            mapImage={courtyardMap}
          />
        </div>
      </div>

      <SectionDivider />

      {/* On-site Lodging */}
      <div className="space-y-6 text-center">
        <h3 className="font-display text-plum text-[20px] sm:text-[24px] tracking-[1.68px] italic">
          On-site Lodging
        </h3>
        <p className="font-body text-plum/75 leading-7">
          Those of you who we've spoken with about staying on-site, please book
          as early as possible — latest by August 2nd, 2026.
        </p>

        <SubHeading>Address</SubHeading>
        <p className="font-body text-plum/75 leading-7">
          <strong>Lucky Arrow Retreat</strong>
          <br />
          <a
            href={LUCKY_ARROW_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            {LUCKY_ARROW_ADDRESS}, United States
          </a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
          <div className="md:col-span-2 flex md:justify-center">
            <div className="w-full md:max-w-[calc((100%-1.5rem)/2)]">
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
        </div>

        <SubHeading>Booking instructions</SubHeading>
        <p className="font-body text-plum/75 leading-7 space-y-3">
          For those of you booking online, you may{" "}
          <a
            href={BOOKING_INSTRUCTIONS_PDF}
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            download instructions to book here
          </a>
          .
        </p>
        <p className="font-body text-plum/75 leading-7">
          For those of you who have either been instructed to book by phone or
          would prefer to book by phone, please call Lucky Arrow Retreat at{" "}
          <a
            href={`tel:${LUCKY_ARROW_PHONE.replace(/\D/g, "")}`}
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            {LUCKY_ARROW_PHONE}
          </a>{" "}
          during regular business hours.
        </p>

        <SubHeading>Accommodation details</SubHeading>
        <ul className="font-body text-plum/75 leading-7 space-y-2 mb-4 text-left">
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
              className="text-plum underline hover:text-burgundy transition-colors"
            >
              Lucky Arrow Retreat's Lodging FAQ here
            </a>
            .
          </li>
        </ul>

        <SubHeading>Directions</SubHeading>
        <p className="font-body text-plum/75 leading-7 space-y-3">
          From Austin: Head west on Highway 290 towards Dripping Springs for
          approximately 28 miles. Turn right (north) on Bell Springs Road and
          travel for 2.6 miles. Lucky Arrow Retreat will be on your left, just
          past Bell Springs Winery.
        </p>
        <p className="font-body text-plum/75 leading-7">
          16 miles. Turn right (east) on Highway 290 and continue for 6 miles.
          Turn left (north) onto Bell Springs Road and continue for 2.6 miles.
          Lucky Arrow Retreat will be on your left, just past Bell Springs
          Winery.
        </p>
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

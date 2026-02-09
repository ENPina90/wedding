import SectionDivider from "../components/SectionDivider";
import flowerLogosBlue from "../assets/flower_logos_blue.png";

interface EventBlockProps {
  title: string;
  datetime: string;
  description: string;
}

function EventBlock({ title, datetime, description }: EventBlockProps) {
  return (
    <div className="text-center mb-10">
      <h3 className="font-display text-plum text-xl md:text-2xl tracking-[1.68px] italic">
        {title}
      </h3>
      <p className="font-nav text-burgundy text-sm tracking-[1px] mt-3 uppercase">
        {datetime}
      </p>
      <p className="font-body text-plum/75 text-base leading-7 mt-4 max-w-xl mx-auto">
        {description}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex justify-center my-6">
      <div className="w-36 h-px bg-plum/20" />
    </div>
  );
}

export default function Info() {
  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* Flower logos above header */}
      <div className="flex justify-center items-center gap-6 md:gap-8 pt-6 pb-4">
        <img
          src={flowerLogosBlue}
          alt=""
          className="h-16 md:h-20 w-auto object-contain"
        />
      </div>

      {/* Event Info header */}
      <div className="text-center pb-8">
        <h2 className="font-display text-plum text-3xl md:text-4xl tracking-[2.24px] italic">
          Event Info
        </h2>
      </div>

      {/* Section divider with flowers_center.png */}
      <SectionDivider />

      <EventBlock
        title="Arrival"
        datetime="Saturday, November 21, 2026 — 4:00 P.M."
        description="Please arrive by 4:00 PM to get settled before the ceremony begins. Light refreshments will be available as you arrive. We can't wait to welcome you!"
      />

      <Divider />

      <EventBlock
        title="Wedding Ceremony & Reception"
        datetime="Saturday, November 21, 2026 — 4:30 P.M."
        description="The ceremony will begin promptly at 4:30 PM. Please note that while there are Ubers and car services on the cape, they are less immediate than in the city. Please plan your transportation in advance. More information on transportation on the FAQ page."
      />

      <Divider />

      <EventBlock
        title="Farewell Breakfast"
        datetime="Sunday, November 22, 2026 — 9:30 A.M."
        description="Join us the morning after for a relaxed farewell breakfast. It's a wonderful chance to say goodbye, share memories from the night before, and enjoy one last meal together before heading home."
      />

      {/* Dress Code */}
      <Divider />
      <div className="text-center mb-16">
        <h3 className="font-display text-plum text-xl md:text-2xl tracking-[1.68px] italic">
          Dress Code
        </h3>
        <p className="font-body text-plum/75 text-base leading-7 mt-4 max-w-xl mx-auto">
          Cocktail attire. Think elegant and comfortable — we want everyone to
          dance the night away!
        </p>
      </div>
    </div>
  );
}

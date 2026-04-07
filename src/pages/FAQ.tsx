import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";
import WeddingColorSwatches from "../components/WeddingColorSwatches";

const faqs = [
  {
    question: "When is the RSVP Deadline?",
    answer:
      "Please RSVP by August 2nd, 2026. If you've been invited to stay on the property, the earlier you can confirm the better ♡",
  },
  {
    question: "Can I bring a guest?",
    answer:
      "With so many people we'd love to celebrate with, we've had to keep our numbers tight. If you're unsure whether your invitation includes a guest, check your RSVP link — you'll see the option to add one if it applies to your invitation.",
  },
  {
    question: "Are kids welcome?",
    answer:
      "Children named on your invitation are warmly welcome! If you have any questions about whether your kids are included or anything is unclear, please feel free to reach out to us directly.",
  },
  {
    question: "What will the weather be like?",
    answer:
      "Late November in the hill country should be pretty mild, plan for upper 60s°F and anywhere from the 40s to 50s in the evening. Since we'll be mostly outdoors, we'd recommend bringing enough warm layers in case it does get chilly. Of course, it is Texas, so you never can know...! We recommend checking the weather for the weekend as the date nears.",
  },
  {
    question: "Where can I park?",
    answer:
      "There's plenty of parking around the property, especially near the check-in area (more info TBA). If you're staying on the property with us you can park your car near your accommodation areas which will be better explained to you at check-in.",
  },
  {
    question: "What's the dress code?",
    answer: (
      <>
        Come dressed to celebrate! We're envisioning a semi-formal affair,
        cocktail dresses, suits, and floor-length gowns are all perfectly at
        home. Our wedding colors are shared below if you'd like a little
        inspiration, but wear whatever color you like. The main dress code is
        feeling your best!
        <div className="mt-4">
          <WeddingColorSwatches size="sm" />
        </div>
      </>
    ),
  },
  {
    question: "Is the wedding inside or outside?",
    answer:
      "The wedding will take place mainly outdoors, so again please make sure to bring warm layers and be prepared for any weather.",
  },
  {
    question: "What sort of shoes should I wear (or avoid)?",
    answer:
      "We recommend shoes that can deal well with gravel. We're not necessarily \"roughing it\" but we will be in the hill country, so just consider that when selecting any heels...and don't forget to be comfortable and ready to dance ♫ ♪ ♬",
  },
  {
    question: "Who should I contact if I have questions?",
    answer: (
      <>
        Always feel free to reach out to Kirsten at{" "}
        <a
          href="mailto:kirschroder@gmail.com"
          className="text-plum underline hover:text-burgundy transition-colors"
        >
          kirschroder@gmail.com
        </a>{" "}
        or Nic at{" "}
        <a
          href="tel:+12106433449"
          className="text-plum underline hover:text-burgundy transition-colors"
        >
          (210) 643 3449
        </a>
        .
      </>
    ),
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <div className="mb-8 sm:mb-10 last:mb-0">
      <p className="font-body font-bold text-plum text-lg sm:text-xl tracking-[1.68px] mb-2 sm:mb-3">
        {question}
      </p>
      <div className="font-body text-plum leading-7 text-left">{answer}</div>
    </div>
  );
}

function FaqDivider() {
  return (
    <div className="flex justify-center my-6 sm:my-8">
      <div className="w-24 sm:w-36 h-px bg-plum/20" />
    </div>
  );
}

const LODGING_FAQ_URL = "https://luckyarrowretreat.com/faq";

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 pb-[35px]">
        <FlowerLogo color="pink" />
      </div>

      <div className="text-center pb-6 sm:pb-8">
        <h2 className="font-display text-plum tracking-[2.24px] italic">
          FAQ
        </h2>
      </div>

      {/* Intro */}
      <div className="text-center mb-10 sm:mb-12 px-1">
        <p className="sub-header font-body text-plum leading-7 max-w-2xl mx-auto text-left sm:text-center">
          To all our friends and family with plenty of questions, please take a
          look here. If you still have questions, you're always welcome to
          reach out to either me at{" "}
          <a
            href="mailto:kirschroder@gmail.com"
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            kirschroder@gmail.com
          </a>{" "}
          or text Nic at{" "}
          <a
            href="tel:+12106433449"
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            210 643 3449
          </a>
          !
        </p>
      </div>

      <SectionDivider />

      {/* FAQ list */}
      <div className="space-y-0">
        {faqs.map((faq, index) => (
          <div key={index}>
            <FaqItem question={faq.question} answer={faq.answer} />
            {index < faqs.length - 1 && <FaqDivider />}
          </div>
        ))}
      </div>

      <SectionDivider />

      {/* CTA */}
      <div className="flex justify-center mt-8 sm:mt-10">
        <a
          href={LODGING_FAQ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-center bg-pink hover:bg-pink/80 text-burgundy font-body font-bold text-sm tracking-[1.5px] px-6 py-3 rounded-lg transition-colors"
        >
          Lucky Arrow Retreat's Lodging FAQ
        </a>
      </div>
    </div>
  );
}

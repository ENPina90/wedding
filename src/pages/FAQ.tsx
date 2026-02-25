import SectionDivider from "../components/SectionDivider";
import FlowerLogo from "../components/FlowerLogo";
import doubleArrowLeft from "../assets/double-arrow-left.svg";

const faqs = [
  {
    question: "When is the RSVP Deadline?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    question: "Can I bring a guest?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    question: "Are kids welcome?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
  },
  {
    question: "What will the weather be like?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  },
  {
    question: "Where can I park?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi ut aliquip ex ea commodo consequat duis aute irure dolor.",
  },
  {
    question: "What's the dress code?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
  },
  {
    question: "Is the wedding inside or outside?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.",
  },
  {
    question: "What sort of shoes should I wear (or avoid)?",
    answer: (
      <>
        Ladies, a quick heads up: please don't wear stiletto heels. Seriously,
        leave the stilettos at home. There are quite a few grassy and muddy
        spots to walk through, so opt for block heels or sandals instead. We'd
        hate for you to ruin your lovely shoes—or twist an ankle!
      </>
    ),
  },
  {
    question:
      "Can we take photos on our phones and cameras during the wedding?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Who should I contact if I have questions?",
    answer: (
      <>
        You're always welcome to reach out! Email Kirsten at{" "}
        <a
          href="mailto:kirschroder@gmail.com"
          className="text-plum underline hover:text-burgundy transition-colors"
        >
          kirschroder@gmail.com
        </a>{" "}
        or call Nic at{" "}
        <a
          href="tel:+12106433449"
          className="text-plum underline hover:text-burgundy transition-colors"
        >
          210 643 3449
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
      <div className="mb-2 sm:mb-3 flex items-start gap-2">
        <img
          src={doubleArrowLeft}
          alt=""
          aria-hidden="true"
          className="mt-1 h-4 w-4 shrink-0"
        />
        <p className="font-body font-bold text-plum text-lg sm:text-xl md:text-2xl tracking-[1.68px]">
          {question}
        </p>
      </div>
      <p className="font-body text-plum/75 leading-7 text-left">
        {answer}
      </p>
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
        <p className="sub-header font-body text-plum/75 leading-7 max-w-2xl mx-auto text-left sm:text-center">
          To all our friends and family with plenty of questions, please take a
          look here. If you still have questions, you're always welcome to
          reach out to either me at{" "}
          <a
            href="mailto:kirschroder@gmail.com"
            className="text-plum underline hover:text-burgundy transition-colors"
          >
            kirschroder@gmail.com
          </a>{" "}
          or call Nic at{" "}
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
    </div>
  );
}

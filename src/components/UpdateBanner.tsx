import { Link, useLocation } from "react-router-dom";

// Month is 0-indexed: 10 = November. Local time, so the count flips at the guest's midnight.
const WEDDING_DATE = new Date(2026, 10, 21);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const linkClass = "text-plum underline hover:text-burgundy transition-colors";

function getDaysUntilWedding(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Math.round absorbs the 1-hour shift when a DST change falls in between.
  return Math.round((WEDDING_DATE.getTime() - today.getTime()) / MS_PER_DAY);
}

function getHeading(daysLeft: number) {
  if (daysLeft < 0) return "Thank Y'all for Joining!";
  if (daysLeft === 0) return "Today Is the Day!";
  if (daysLeft === 1) return "Just 1 Day to Go!";
  return `Just ${daysLeft} Days to Go!`;
}

/* Site-wide banner, rendered in Layout so it appears on every page.
 * Before/on the wedding day: countdown + arrival time & transportation reminder.
 * After the wedding: thank-you note pointing guests to the Photos page.
 */
export default function UpdateBanner() {
  const { pathname } = useLocation();
  const daysLeft = getDaysUntilWedding();
  const isAfterWedding = daysLeft < 0;

  return (
    <aside
      aria-label={isAfterWedding ? "Thank you from Kirsten & Nic" : "Wedding day reminder"}
      // z-0 + rendered before the corner flowers in Layout, so the flowers paint on top of it.
      className="relative z-0 w-full bg-cream border-b border-pink/40"
    >
      {/* lg:px-16 keeps the text clear of the fixed corner flowers at 1280px */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 pt-4 sm:pt-5 pb-6 sm:pb-8 text-center">
        <h3 className="font-display text-plum text-[18px] sm:text-[22px] tracking-[1.68px] italic mb-1">
          {getHeading(daysLeft)}
        </h3>

        {isAfterWedding ? (
          <p className="font-body text-plum leading-6 sm:leading-7 mb-0">
            Stay tuned for pictures from the wedding{" "}
            {pathname === "/photos" ? (
              "right here"
            ) : (
              <Link to="/photos" className={linkClass}>
                here
              </Link>
            )}{" "}
            ♡
          </p>
        ) : (
          <p className="font-body text-plum leading-6 sm:leading-7 mb-0">
            A quick reminder: please{" "}
            <span className="font-bold">
              arrive by <span className="whitespace-nowrap">4:00 p.m.</span>
            </span>
            , especially if you're checking into an on-site accommodation. Come dressed
            and ready to go, because the{" "}
            <span className="font-bold">
              ceremony begins at{" "}
              <span className="whitespace-nowrap">4:30 p.m. sharp</span>
            </span>
            !
            {pathname !== "/info" && (
              <>
                {" "}You can find the full schedule {" "}
                <Link to="/info" className={`${linkClass} whitespace-nowrap`}>
                  here
                </Link>
                .
              </>
            )}{" "}
            Unfortunately, we weren't able to secure a shuttle service for the
            evening, but we'd be happy to help you find a.{" "}
          </p>
        )}
        <p className="font-body text-plum leading-6 sm:leading-7 mb-0">See y'all soon ♡</p>
      </div>
    </aside>
  );
}

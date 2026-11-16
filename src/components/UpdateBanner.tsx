import { Link, useLocation } from "react-router-dom";

// Month is 0-indexed: 10 = November. Local time, so the count flips at the guest's midnight.
const WEDDING_DATE = new Date(2026, 10, 21);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/* Visible gap above and below the banner is 48px (mt-12) on every page. Each page's own
 * top spacing counts toward the gap below, so the bottom margin makes up the difference:
 * - Info/Accommodations/Photos/FAQ start with pt-4 sm:pt-6 (16px / 24px).
 * - Home's hero photo has mt-6 sm:mt-10 md:mt-12, and from md up a flower sprig pokes 56px above it.
 */
const PAGE_BOTTOM_MARGIN = "mb-8 sm:mb-6";
const HOME_BOTTOM_MARGIN = "mb-6 sm:mb-2 md:mb-14";

const linkClass ="text-plum underline hover:text-burgundy transition-colors";

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
      className={`relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 mt-12 ${
        pathname === "/" ? HOME_BOTTOM_MARGIN : PAGE_BOTTOM_MARGIN
      }`}
    >
      <div className="bg-cream rounded-md border border-pink/40 px-5 sm:px-10 pt-5 sm:pt-6 pb-6 sm:pb-8 text-center">
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
            evening, but we'd be happy to help you find a ride.{" "}
          </p>
        )}
        <p className="font-body text-plum leading-6 sm:leading-7 mb-0">See y'all soon ♡</p>
      </div>
    </aside>
  );
}

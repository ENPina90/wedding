import { NavLink, Outlet, useLocation } from "react-router-dom";
import flowerCorners from "../assets/flower_corners.png";
import SectionDivider from "./SectionDivider";
import "./flower-corners.css";
import "./layout.css";

const navLinks = {
  row1: [
    { to: "/", label: "home", external: false },
    { to: "https://withjoy.com/kirsten-and-nic/rsvp", label: "rsvp", external: true },
    { to: "/info", label: "info", external: false },
  ],
  row2: [{ to: "/accommodations", label: "accommodations", external: false }],
  row3: [
    { to: "https://withjoy.com/kirsten-and-nic/registry", label: "registry", external: true },
    { to: "/photos", label: "photos", external: false },
    { to: "/faq", label: "faq", external: false },
  ],
};

const allNavLinks = [...navLinks.row1, ...navLinks.row2, ...navLinks.row3];

function NavLinkItem({
  link,
}: {
  link: { to: string; label: string; external: boolean };
}) {
  const baseClass =
    "font-nav text-plum text-xs max-[430px]:text-sm sm:text-sm md:text-lg tracking-[1.68px] uppercase transition-colors hover:text-burgundy";
  if (link.external) {
    return (
      <a
        href={link.to}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {link.label}
      </a>
    );
  }
  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        `${baseClass} ${
          isActive ? "text-burgundy underline underline-offset-4 font-bold" : ""
        }`
      }
    >
      {link.label}
    </NavLink>
  );
}

export default function Layout() {
  const location = useLocation();
  const isFaqPage = location.pathname === "/faq";

  return (
    <div className="min-h-screen flex flex-col bg-beige relative overflow-x-hidden">
      {/* Corner floral decorations - styles in flower-corners.css */}
      <img
        src={flowerCorners}
        alt=""
        className="flower-corner-left pointer-events-none z-0 h-auto"
      />
      <img
        src={flowerCorners}
        alt=""
        className="flower-corner-right pointer-events-none z-0 h-auto"
      />

      {/* Header */}
      <header className="relative z-10 pt-32 sm:pt-12 md:pt-16 pb-4 sm:pb-6 text-center px-4">
        <NavLink to="/">
          <h1 className="font-display text-plum text-4xl sm:text-5xl md:text-6xl tracking-[4.48px] italic">
            <span className="hidden max-[430px]:inline">Kirsten<br />& Nic</span>
            <span className="max-[430px]:hidden">Kirsten & Nic</span>
          </h1>
        </NavLink>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-center pt-4 pb-0 sm:pt-6 sm:pb-0 px-4">
        {/* Mobile: 3-1-3 layout per Figma Mobile - Home */}
        <div className="nav-mobile flex flex-col items-center gap-y-3 max-[430px]:gap-y-6 sm:hidden">
          <div className="nav-row flex justify-center gap-x-4 max-[430px]:gap-x-7 sm:gap-x-7">
            {navLinks.row1.map((link) => (
              <NavLinkItem key={link.to} link={link} />
            ))}
          </div>
          <div className="nav-row flex justify-center">
            {navLinks.row2.map((link) => (
              <NavLinkItem key={link.to} link={link} />
            ))}
          </div>
          <div className="nav-row flex justify-center gap-x-4 max-[430px]:gap-x-7 sm:gap-x-7">
            {navLinks.row3.map((link) => (
              <NavLinkItem key={link.to} link={link} />
            ))}
          </div>
        </div>
        {/* Desktop: single row */}
        <ul className="nav-desktop hidden flex-wrap justify-center gap-x-4 gap-y-2 sm:flex sm:gap-x-7 font-nav text-plum text-xs sm:text-sm md:text-lg tracking-[1.68px] uppercase">
          {allNavLinks.map((link) => (
            <li key={link.to}>
              {link.external ? (
                <a
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-burgundy"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `transition-colors hover:text-burgundy ${
                      isActive
                        ? "text-burgundy underline underline-offset-4 font-bold"
                        : ""
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Page Content - FAQ renders between nav and main per design */}
      {isFaqPage ? (
        <div className="relative z-10 flex-1">
          <Outlet />
        </div>
      ) : (
        <main className="relative z-10 flex-1 text-sm">
          <Outlet />
        </main>
      )}

      {/* Section divider above footer - on every page (same container as page content for consistent rendering) */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 w-full">
        <SectionDivider />
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 sm:py-12 md:py-16 text-plum/60 font-body text-xs sm:text-sm tracking-wide px-4">
        <p>Kirsten & Nic &middot; November 21, 2026</p>
      </footer>
    </div>
  );
}

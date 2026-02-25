import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import flowerCorner from "../assets/flower_corner.svg";
import weddingRings from "../assets/wedding_rings.svg";
import SectionDivider from "./SectionDivider";
import "./flower-corners.css";
import "./layout.css";

const RSVP_URL = "https://withjoy.com/kirsten-and-nic/rsvp";

const navLinks = {
  row1: [
    { to: "/", label: "home", external: false },
    { to: RSVP_URL, label: "rsvp", external: true, opensModal: true },
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

// Tablet (768–1024px): row1 = 5 links, row2 = 2 links
const navTabletRow1 = [...navLinks.row1, ...navLinks.row2, navLinks.row3[0]];
const navTabletRow2 = navLinks.row3.slice(1);

function NavLinkItem({
  link,
  onRsvpClick,
}: {
  link: { to: string; label: string; external: boolean; opensModal?: boolean };
  onRsvpClick: () => void;
}) {
  const baseClass =
    "font-nav text-plum text-[22px] tracking-[1.68px] uppercase";
  if (link.opensModal) {
    return (
      <button type="button" onClick={onRsvpClick} className={baseClass}>
        {link.label}
      </button>
    );
  }

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
          isActive ? "underline underline-offset-4 font-bold" : ""
        }`
      }
    >
      {link.label}
    </NavLink>
  );
}

export default function Layout() {
  const location = useLocation();
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const isFaqPage = location.pathname === "/faq";
  const openRsvpModal = () => setIsRsvpModalOpen(true);

  return (
    <div className="min-h-screen flex flex-col bg-beige relative overflow-x-hidden">
      {/* Corner floral decorations - styles in flower-corners.css */}
      <img
        src={flowerCorner}
        alt=""
        className="flower-corner-left cursor-default z-0 h-auto"
      />
      <img
        src={flowerCorner}
        alt=""
        className="flower-corner-right cursor-default z-0 h-auto"
      />

      {/* Header */}
      <header className="relative z-10 pt-32 sm:pt-12 md:pt-16 pb-4 sm:pb-6 text-center px-4">
        <NavLink to="/" className="cursor-default">
          <h1 className="font-display text-plum text-[54px] sm:text-[64px] tracking-[4.48px] italic">
            <span className="hidden max-[767px]:inline-block max-[767px]:leading-[64px] pt-2.5">Kirsten<br />& Nic</span>
            <span className="max-[767px]:hidden">Kirsten & Nic</span>
          </h1>
        </NavLink>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-center pt-4 pb-0 sm:pt-6 sm:pb-0 px-4">
        {/* Mobile: 3-1-3 layout per Figma Mobile - Home (< 768px) */}
        <div className="nav-mobile flex flex-col items-center gap-y-3 md:hidden">
          <div className="nav-row flex justify-center gap-x-4 max-[767px]:gap-x-7">
            {navLinks.row1.map((link) => (
              <NavLinkItem
                key={link.to}
                link={link}
                onRsvpClick={openRsvpModal}
              />
            ))}
          </div>
          <div className="nav-row flex justify-center">
            {navLinks.row2.map((link) => (
              <NavLinkItem
                key={link.to}
                link={link}
                onRsvpClick={openRsvpModal}
              />
            ))}
          </div>
          <div className="nav-row flex justify-center gap-x-4 max-[767px]:gap-x-7">
            {navLinks.row3.map((link) => (
              <NavLinkItem
                key={link.to}
                link={link}
                onRsvpClick={openRsvpModal}
              />
            ))}
          </div>
        </div>
        {/* Tablet (768–1024px): two rows, 5 links + 2 links */}
        <div className="nav-tablet hidden flex-col items-center gap-y-3 md:flex lg:hidden">
          <div className="flex justify-center gap-x-7">
            {navTabletRow1.map((link) => (
              <NavLinkItem
                key={link.to}
                link={link}
                onRsvpClick={openRsvpModal}
              />
            ))}
          </div>
          <div className="flex justify-center gap-x-7">
            {navTabletRow2.map((link) => (
              <NavLinkItem
                key={link.to}
                link={link}
                onRsvpClick={openRsvpModal}
              />
            ))}
          </div>
        </div>
        {/* Desktop: single row (1024px+) */}
        <ul className="nav-desktop hidden flex-wrap justify-center gap-x-4 gap-y-2 lg:flex lg:gap-x-7">
          {allNavLinks.map((link) => (
            <li key={link.to}>
              <NavLinkItem
                link={link}
                onRsvpClick={openRsvpModal}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Page Content - FAQ renders between nav and main per design */}
      {isFaqPage ? (
        <div className="relative z-10 flex-1">
          <Outlet context={{ openRsvpModal }} />
        </div>
      ) : (
        <main className="relative z-10 flex-1 text-sm">
          <Outlet context={{ openRsvpModal }} />
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

      {isRsvpModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#5A2F42]/70 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsRsvpModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-cream rounded-md border border-pink/25 px-6 sm:px-10 py-[60px] relative text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsRsvpModalOpen(false)}
              className="absolute top-4 right-4 text-plum/80 hover:text-plum font-body text-3xl leading-none"
              aria-label="Close RSVP modal"
            >
              ×
            </button>

            <img
              src={weddingRings}
              alt=""
              aria-hidden="true"
              className="mx-auto mb-6 h-12 w-12"
            />
            <h3 className="font-display text-plum text-[32px] tracking-[1.2px] italic mb-4">
              A Small Step Before We Begin
            </h3>
            <p className="font-body text-plum/85 text-[20px] leading-[1.45] max-w-2xl mx-auto mb-8">
              Kindly enter your first and last name on the next page <span className="font-bold">exactly as
                enclosed in your Save the Date.</span> Using the same format ensures we
              can locate your invitation properly and display your full party ♡
            </p>

            <a
              href={RSVP_URL}
              className="inline-block bg-pink hover:bg-pink/85 active:bg-pink/75 text-plum font-body font-bold text-xl tracking-[1px] px-8 py-3 rounded-lg transition-colors"
            >
              Proceed to RSVP
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

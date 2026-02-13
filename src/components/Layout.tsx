import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import flowerCorners from "../assets/flower_corners.png";

const navLinks = [
  { to: "/", label: "home", external: false },
  { to: "https://withjoy.com/kirsten-and-nic/rsvp", label: "rsvp", external: true },
  { to: "/info", label: "info", external: false },
  { to: "/accommodations", label: "accommodations", external: false },
  { to: "https://withjoy.com/kirsten-and-nic/registry", label: "registry", external: true },
  { to: "/photos", label: "photos", external: false },
];

// Easily editable positioning values for corner flowers
// Both use fixed positioning so they stay at viewport edges on resize and don't interfere with content
// Left corner flower
const leftFlowerLeft = -145; // px from left (negative = off-screen edge)
const leftFlowerY = 0; // px from top
const leftFlowerRotation = 357; // degrees
const leftFlowerWidth = 350; // px

// Right corner flower — mobile uses left: 95; larger screens use right: -9
const rightFlowerRightDesktop = -9; // px from right on larger screens
const rightFlowerLeftMobile = 95; // px from left on mobile only
const rightFlowerY = 293; // px from top
const rightFlowerRotation = 289; // degrees
const rightFlowerWidth = 350; // px
const rightFlowerScaleX = -1;
const rightFlowerScaleY = -1;

const MOBILE_BREAKPOINT = 640; // Tailwind sm

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-beige relative overflow-x-hidden">
      {/* Corner floral decorations */}
      <img
        src={flowerCorners}
        alt=""
        className="pointer-events-none z-0 h-auto"
        style={{
          ...(isMobile ? { position: "absolute" } : { position: "fixed" }),
          left: `${leftFlowerLeft}px`,
          top: `${leftFlowerY}px`,
          width: `${leftFlowerWidth}px`,
          transform: `rotate(${leftFlowerRotation}deg)`,
          transformOrigin: 'top left'
        }}
      />
      <img
        src={flowerCorners}
        alt=""
        className="pointer-events-none z-0 h-auto"
        style={{
          ...(isMobile ? { position: "absolute" } : { position: "fixed" }),
          ...(isMobile
            ? { left: `${rightFlowerLeftMobile}px` }
            : { right: `${rightFlowerRightDesktop}px` }),
          top: `${rightFlowerY}px`,
          width: `${rightFlowerWidth}px`,
          transform: `rotate(${rightFlowerRotation}deg) scaleX(${rightFlowerScaleX}) scaleY(${rightFlowerScaleY})`,
          transformOrigin: "top right"
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-32 sm:pt-12 md:pt-16 pb-4 sm:pb-6 text-center px-4">
        <NavLink to="/">
          <h1 className="font-display text-plum text-4xl sm:text-5xl md:text-6xl tracking-[4.48px] italic">
            Kirsten & Nic
          </h1>
        </NavLink>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-center py-4 sm:py-6 px-4">
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-7 font-nav text-plum text-xs sm:text-sm md:text-lg tracking-[1.68px] uppercase">
          {navLinks.map((link) => (
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

      {/* Page Content */}
      <main className="relative z-10 flex-1 text-sm">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 sm:py-12 md:py-16 text-plum/60 font-body text-xs sm:text-sm tracking-wide px-4">
        <p>Kirsten & Nic &middot; November 21, 2026</p>
      </footer>
    </div>
  );
}

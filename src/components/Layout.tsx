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
// Left corner flower positioning
const leftFlowerX = -9; // px
const leftFlowerY = 0; // px
const leftFlowerRotation = 357; // degrees
const leftFlowerWidth = 350; // px (base width, responsive sizes below)

// Right corner flower positioning
const rightFlowerX = -9; // px (right position offset, matching left flower)
const rightFlowerY = 293; // px (top position)
const rightFlowerRotation = 289; // degrees
const rightFlowerWidth = 350; // px (base width, responsive sizes below)
const rightFlowerScaleX = -1; // scaleX value
const rightFlowerScaleY = -1; // scaleY value

export default function Layout() {
  // Responsive styling for left flower on lg screens (768-1023px)
  const [isLgScreen, setIsLgScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsLgScreen(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Left flower positioning: absolute with left: -105px for lg screens, fixed with left: -9px otherwise
  const leftFlowerPosition = isLgScreen ? 'absolute' : 'fixed';
  const leftFlowerLeft = isLgScreen ? -105 : leftFlowerX;

  return (
    <div className="min-h-screen flex flex-col bg-beige relative">
      {/* Corner floral decorations */}
      <img
        src={flowerCorners}
        alt=""
        className="pointer-events-none z-0 h-auto"
        style={{
          position: leftFlowerPosition,
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
          position: 'fixed',
          right: `${rightFlowerX}px`,
          top: `${rightFlowerY}px`,
          width: `${rightFlowerWidth}px`,
          transform: `rotate(${rightFlowerRotation}deg) scaleX(${rightFlowerScaleX}) scaleY(${rightFlowerScaleY})`,
          transformOrigin: 'top right'
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-16 pb-6 text-center">
        <NavLink to="/">
          <h1 className="font-display text-plum text-5xl md:text-6xl tracking-[4.48px] italic">
            Kirsten & Nic
          </h1>
        </NavLink>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-center py-6">
        <ul className="flex flex-wrap justify-center gap-x-7 gap-y-2 font-nav text-plum text-sm md:text-lg tracking-[1.68px] uppercase">
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
      <footer className="relative z-10 text-center py-16 text-plum/60 font-body text-sm tracking-wide">
        <p>Kirsten & Nic &middot; November 21, 2026</p>
      </footer>
    </div>
  );
}

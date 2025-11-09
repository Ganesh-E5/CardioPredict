import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(
    location.pathname === "/predict" || location.pathname === "/result" ? "predict" : "hero"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  // Links
  const homeLinks = [
    { id: "hero", label: "Home", path: "/" },
    { id: "about", label: "About", path: "/" },
    { id: "features", label: "Features", path: "/" },
    { id: "how", label: "How", path: "/" },
    { id: "testimonials", label: "Testimonials", path: "/" },
    { id: "cta", label: "CTA", path: "/" },
    { id: "predict", label: "Predict", path: "/predict", highlight: true },
  ];

  const predictResultLinks = [
    { id: "home", label: "Home", path: "/" },
    { id: "predict", label: "Predict", path: "/predict" },
  ];

  const links =
    location.pathname === "/"
      ? homeLinks
      : predictResultLinks; // /predict or /result

  // Scroll listener for HomePage sections
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 80;
      for (let i = links.length - 1; i >= 0; i--) {
        if (links[i].path !== "/") continue;
        const el = document.getElementById(links[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveLink(links[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleClick = (link) => {
    setMenuOpen(false);
    setActiveLink(link.id);

    if (location.pathname !== link.path) {
      window.location.href = link.path;
    } else if (link.path === "/") {
      const el = document.getElementById(link.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#161b22]/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-blue-400 cursor-pointer"
          onClick={() => handleClick({ id: "hero", path: "/" })}
        >
          CardioPredict
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 text-sm md:text-base relative">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleClick(link)}
              className={`relative px-3 py-2 font-medium transition-all rounded ${
                location.pathname === "/" && link.highlight
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : activeLink === link.id
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-blue-400"
              }`}
            >
              {link.label}
              {activeLink === link.id && !(location.pathname === "/" && link.highlight) && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-2/3 h-0.5 bg-blue-400 rounded-full transition-all" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 hover:text-blue-400 focus:outline-none"
          >
            {menuOpen ? "✖️" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#161b22] border-t border-[#30363d] md:hidden flex flex-col items-center py-4 space-y-4">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleClick(link)}
                className={`font-medium text-lg rounded px-3 py-2 w-3/4 text-center transition-all ${
                  location.pathname === "/" && link.highlight
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : activeLink === link.id
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-blue-400"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

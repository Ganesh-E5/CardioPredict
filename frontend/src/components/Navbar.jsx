import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = ["hero", "about", "features", "how", "testimonials", "cta"];

  // Scroll listener to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 80; // offset for sticky navbar
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false); // close menu on mobile after click
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#161b22]/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-400 cursor-pointer" onClick={() => scrollToSection("hero")}>
          CardioPredict
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-400 text-sm md:text-base relative">
          {sections.slice(1).map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="relative px-1 py-2 font-medium hover:text-blue-400 transition"
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
              {activeSection === section && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 rounded-full transition-all duration-300" />
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
            {sections.slice(1).map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`font-medium text-lg hover:text-blue-400 ${
                  activeSection === section ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

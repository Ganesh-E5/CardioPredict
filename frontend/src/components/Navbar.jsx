import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#161b22] border-b border-[#30363d] shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
        CardioPredict
      </Link>
      <div className="text-sm text-gray-400">AI Health Insights</div>
    </nav>
  );
}

import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f1419] via-[#1a1f2e] to-[#0d1117] text-[#e6edf3]">
      <Navbar />
      <main className="p-4 md:p-8">
        <Outlet /> 
      </main>
    </div>
  );
}

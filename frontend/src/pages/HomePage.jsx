import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="text-[#e6edf3] scroll-smooth bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0d1117]">

      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-400 mb-4">CardioPredict</h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl">
          AI-powered cardiovascular risk prediction. Enter your health metrics and get insights instantly.
        </p>
        <Link
          to="/predict"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-200"
        >
          🔮 Start Prediction
        </Link>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-16 bg-[#161b22] border-t border-b border-[#30363d]">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-8">About CardioPredict</h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-10">
          CardioPredict is an AI-powered platform designed to analyze key health metrics
          and estimate your cardiovascular risk. Make informed health decisions and take control of your heart health.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Smart Analysis", desc: "AI evaluates your vitals and predicts risk levels.", icon: "⚙️" },
            { title: "Data Driven", desc: "Built on validated cardiovascular datasets.", icon: "📊" },
            { title: "Easy to Use", desc: "Fill simple details; AI handles the rest.", icon: "🧠" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#1a1f2e] rounded-2xl p-8 shadow-md border border-[#30363d] transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500 cursor-pointer"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-16">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { title: "Real-time Predictions", desc: "Get instant AI feedback on your heart health.", icon: "⚡" },
            { title: "Secure & Private", desc: "Your data is always safe and confidential.", icon: "🔒" },
            { title: "Scientifically Backed", desc: "Reliable predictions based on medical datasets.", icon: "📊" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#1a1f2e] rounded-2xl p-8 shadow-lg border border-[#30363d] transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/20 hover:border-indigo-500 cursor-pointer"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-24 px-6 md:px-16 bg-[#11151d]">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { step: "1️⃣", title: "Enter Details", desc: "Provide your basic health metrics." },
            { step: "2️⃣", title: "AI Analysis", desc: "The AI evaluates your risk factors." },
            { step: "3️⃣", title: "Insights", desc: "View prediction score & recommendations." },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#1a1f2e] rounded-2xl p-8 shadow-md border border-[#30363d] transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/20 hover:border-indigo-500 cursor-pointer"
            >
              <div className="text-4xl mb-3">{s.step}</div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">{s.title}</h3>
              <p className="text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 md:px-16">
        <h2 className="text-4xl font-bold text-blue-400 text-center mb-12">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { name: "Alice", text: "CardioPredict gave me clear insights about my heart health!", icon: "💬" },
            { name: "Bob", text: "Simple and accurate AI predictions I can trust.", icon: "💬" },
            { name: "Carol", text: "Highly recommend for anyone wanting proactive heart care.", icon: "💬" },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-[#1a1f2e] rounded-2xl p-6 shadow-md border border-[#30363d] transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500 cursor-pointer"
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <p className="text-gray-300 mb-2">"{t.text}"</p>
              <p className="text-blue-300 font-semibold">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 text-center bg-[#161b22] border-t border-[#30363d]">
        <h2 className="text-4xl font-bold text-blue-400 mb-4">Ready to Know Your Risk?</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Take control of your heart health with CardioPredict. Personalized AI feedback in minutes.
        </p>
        <Link
          to="/predict"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg transition-all duration-200"
        >
          🚀 Start Prediction
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d1117] border-t border-[#30363d] py-10 text-center text-gray-500">
        <p>© {new Date().getFullYear()} CardioPredict — All Rights Reserved.</p>
        <p className="text-sm mt-2">Made with ❤️ using React & TailwindCSS</p>
      </footer>
    </div>
  );
}

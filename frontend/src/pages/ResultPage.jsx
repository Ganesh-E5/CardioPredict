import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Helmet } from "react-helmet";
ChartJS.register(ArcElement, Tooltip, Legend);

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) 
    return <p className="text-center mt-10 text-gray-400">No result to display.</p>;

  // Chart Data
  const chartData = {
    labels: ["Healthy Factors", "Unhealthy Factors"],
    datasets: [
      {
        data: [result.healthy_factors?.length || 0, result.unhealthy_factors?.length || 0],
        backgroundColor: ["#34D399", "#F87171"],
        hoverBackgroundColor: ["#10B981", "#EF4444"],
      },
    ],
  };

  // Filter factors (remove age, gender, height)
  const filteredHealthyFactors = (result.healthy_factors || []).filter(
    f => !["Age", "Gender", "Height"].includes(f.factor)
  );
  const filteredUnhealthyFactors = (result.unhealthy_factors || []).filter(
    f => !["Age", "Gender", "Height"].includes(f.factor)
  );

  // Card background colors using near-black RGBA for maximum contrast
  // Main Cards: Near-black (0,0,0) with 85% opacity - significantly darker than page BG
  const mainCardBg = "bg-[rgba(0,0,0,0.85)]"; 
  // Factor Cards: Near-black (0,0,0) with 75% opacity
  const factorCardBg = "bg-[rgba(0,0,0,0.75)]"; 

  return (
    <>
    <Helmet>
      <title>CardioPredict | Result</title>
    </Helmet>
    <div className="min-h-screen bg-linear-to-br from-[#0f1419] via-[#1a1f2e] to-[#0d1117] flex justify-center py-10 px-4">
      <div className="w-full max-w-5xl space-y-6">

        {/* Header */}
        <div className="text-center text-white space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-400">CardioPredict Results</h1>
          <p className="text-gray-400 text-lg md:text-xl">Your cardiovascular risk assessment summary</p>
        </div>

        {/* Risk Card - Uses mainCardBg (near-black 85% opacity) */}
        <div className={`${mainCardBg} p-6 rounded-2xl shadow-xl text-white space-y-4`}>
          <div className="text-center">
            <p className="text-lg md:text-xl font-semibold">Predicted Risk:</p>
            <p className="text-3xl md:text-4xl font-bold mt-1">{(result.probability * 100).toFixed(2)}%</p>
            <p className={`text-2xl md:text-3xl font-bold mt-1 ${
              result.risk_level === "High" ? "text-red-500" :
              result.risk_level === "Medium" ? "text-yellow-400" : "text-green-400"
            }`}>{result.risk_level} Risk</p>
            <p className="text-gray-400 mt-1 text-sm md:text-base">
              Model Accuracy: <span className="text-yellow-400 font-semibold">{result.model_accuracy.toFixed(2)}%</span> | ⚠️ Always verify predictions with a healthcare professional.
            </p>
          </div>

          {/* Doughnut Chart */}
          <div className={`max-w-sm mx-auto p-4 rounded-xl`} >
            <Doughnut data={chartData} />
          </div>
        </div>

        {/* Personal Info - Uses mainCardBg (near-black 85% opacity) */}
        <div className={`${mainCardBg} p-6 rounded-2xl shadow-inner text-white`}>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-center text-blue-400">🧍 Personal Information</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
            {Object.entries(result.personal_info || {}).map(([key, value], i) => (
              <li key={i}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>

        {/* Calculated Info - Uses mainCardBg (near-black 85% opacity) */}
        <div className={`${mainCardBg} p-6 rounded-2xl shadow-inner text-white`}>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-center text-blue-400">📊 Calculated Values</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
            {Object.entries(result.calculated_info || {}).map(([key, value], i) => (
              <li key={i}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>

        {/* Healthy Factors - Uses factorCardBg (near-black 75% opacity) */}
        <div className={`${factorCardBg} p-6 rounded-2xl shadow-md text-white`}>
          <h3 className="text-green-400 font-bold mb-2 text-2xl md:text-3xl">✅ Healthy Factors</h3>
          {filteredHealthyFactors.length > 0 ? (
            <ul className="list-disc pl-5 text-sm md:text-base text-gray-300">
              {filteredHealthyFactors.map((f, i) => (
                <li key={i}><strong>{f.factor}:</strong> {f.description}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No strong healthy indicators detected.</p>
          )}
        </div>

        {/* Unhealthy Factors - Uses factorCardBg (near-black 75% opacity) */}
        <div className={`${factorCardBg} p-6 rounded-2xl shadow-md text-white`}>
          <h3 className="text-red-400 font-bold mb-2 text-2xl md:text-3xl">⚠️ Unhealthy Factors</h3>
          {filteredUnhealthyFactors.length > 0 ? (
            <ul className="list-disc pl-5 text-sm md:text-base text-gray-300">
              {filteredUnhealthyFactors.map((f, i) => (
                <li key={i}><strong>{f.factor}:</strong> {f.description}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No major risk factors detected.</p>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 font-semibold text-lg md:text-xl"
          >
            🔁 Go Back
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ResultPage;
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function PredictForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      age: Number(formData.age),
      gender: Number(formData.gender),
      height: Number(formData.height),
      weight: Number(formData.weight),
      ap_hi: Number(formData.ap_hi),
      ap_lo: Number(formData.ap_lo),
      cholesterol: Number(formData.cholesterol),
      gluc: Number(formData.gluc),
      smoke: Number(formData.smoke),
      alco: Number(formData.alco),
      active: Number(formData.active),
    };

    try {
      setLoading(true);
      const response = await fetch("https://cardiopredict-cztq.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      navigate("/result", { state:data });
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f1419] via-[#1a1f2e] to-[#0d1117] text-[#e6edf3] flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-4xl space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="bg-[#161b22] border border-[#30363d] shadow-xl rounded-2xl p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400">CardioPredict</h1>
          <p className="text-gray-400 mt-2">Enter your health metrics for AI-powered risk assessment</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold border-b border-[#30363d] pb-3 mb-4">🧍 Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Age (years)</label>
                <input
                  type="number"
                  {...register("age", { required: true, min: 1, max: 120 })}
                  placeholder="e.g., 45"
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d] focus:border-blue-500 focus:ring transition"
                />
                {errors.age && <p className="text-red-400 text-sm mt-1">Age is required (1–120)</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Gender</label>
                <select
                  {...register("gender", { required: true })}
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d] focus:border-blue-500 transition"
                >
                  <option value="">Select</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
                {errors.gender && <p className="text-red-400 text-sm mt-1">Gender is required</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Height (cm)</label>
                <input
                  type="number"
                  {...register("height", { required: true, min: 50, max: 250 })}
                  placeholder="e.g., 170"
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d] focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Weight (kg)</label>
                <input
                  type="number"
                  {...register("weight", { required: true, min: 20, max: 300 })}
                  placeholder="e.g., 75"
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d] focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Health Indicators */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold border-b border-[#30363d] pb-3 mb-4">❤️ Health Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Systolic BP</label>
                <input type="number" {...register("ap_hi", { required: true })} placeholder="e.g., 120"
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d]" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Diastolic BP</label>
                <input type="number" {...register("ap_lo", { required: true })} placeholder="e.g., 80"
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d]" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Cholesterol</label>
                <select {...register("cholesterol", { required: true })}
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d]">
                  <option value="">Select</option>
                  <option value="1">Normal</option>
                  <option value="2">Above Normal</option>
                  <option value="3">Well Above Normal</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Glucose</label>
                <select {...register("gluc", { required: true })}
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d]">
                  <option value="">Select</option>
                  <option value="1">Normal</option>
                  <option value="2">Above Normal</option>
                  <option value="3">Well Above Normal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold border-b border-[#30363d] pb-3 mb-4">🚬 Lifestyle Factors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Smoke</label>
                <select {...register("smoke", { required: true })}
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d]">
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Alcohol</label>
                <select {...register("alco", { required: true })}
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d]">
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">Physically Active</label>
                <select {...register("active", { required: true })}
                  className="w-full p-3 rounded-xl bg-[#0d1117] border-2 border-[#30363d]">
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-1/2 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500"
              } text-white font-semibold text-lg py-3 rounded-xl shadow-lg transition`}
            >
              {loading ? "⏳ Predicting..." : "🔮 Predict Cardiovascular Risk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PredictForm;

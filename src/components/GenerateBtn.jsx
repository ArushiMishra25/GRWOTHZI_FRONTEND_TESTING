import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const GenerateBtn = () => {
  const { generateImage, website, setWebsite } = useContext(AppContext);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const [business_type_raw, industry_raw] = prompt
      .split(",")
      .map((s) => s.trim());

    if (!business_type_raw || !industry_raw) {
      alert(
        "Please enter in format: BusinessType, Industry (e.g., Ecommerce, Fashion)"
      );
      setLoading(false);
      return;
    }

    const business_type = business_type_raw;
    const industry = industry_raw;

    try {
      const result = await generateImage({ business_type, industry });
      if (result.content) {
        setWebsite((prev) => [...prev, result]);
        setContent(result.content);
      }
    } catch (err) {
      console.error("Error generating content:", err);
      alert("Something went wrong while generating content.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-600 hover:underline hover:text-blue-800 font-medium"
      >
        ← Back to Home
      </button>

      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        Generate Website Content
      </h2>

      <textarea
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Please enter in format: BusinessType, Industry (e.g., Ecommerce, Fashion)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {content && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2 text-gray-700">
            Generated Content:
          </h3>
          <pre className="whitespace-pre-wrap text-gray-800">{content}</pre>
        </div>
      )}
    </div>
  );
};

export default GenerateBtn;

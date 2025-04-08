import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Home = () => {
  const { website, setWebsite } = useContext(AppContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [editingSite, setEditingSite] = useState(null); // holds the site being edited
  const [updatedContent, setUpdatedContent] = useState(""); // content from the textarea

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/websites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWebsite(res.data.websites); // ⬅️ array here
      } catch (err) {
        console.error("Error fetching websites:", err);
      }
    };

    fetchWebsites();
  }, []);

  const handleGenerateClick = () => {
    navigate("/Generate");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/websites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWebsite(website.filter((site) => site._id !== id));
    } catch (err) {
      console.error("Error deleting website:", err);
    }
  };
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/websites/${editingSite._id}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state
      const updatedList = website.map((site) =>
        site._id === editingSite._id
          ? { ...site, content: updatedContent }
          : site
      );

      setWebsite(updatedList);
      setEditingSite(null);
      setUpdatedContent("");
    } catch (err) {
      console.error("Error updating website:", err);
    }
  };
  return (
    <div>
      <button
        onClick={handleGenerateClick}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Generate
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 p-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Your Generated Websites
        </h1>

        {website.length === 0 ? (
          <p>No websites found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {website.map((site) => (
              <div key={site._id} className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {site.business_type}
                </h2>
                <p className="text-gray-600 mb-2">
                  <strong>Industry:</strong> {site.industry}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(site.created_at).toLocaleString()}
                </p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(site.content, null, 2)}
                </pre>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingSite(site);
                      setUpdatedContent(site.content);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(site._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  {/* You can add Update logic here later */}
                </div>
              </div>
            ))}
          </div>
        )}
        {editingSite && (
          <div className="mt-10 w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Edit Website Content
            </h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded mb-4"
              rows={6}
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditingSite(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

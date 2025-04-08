import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./components/login";
import { AppContext } from "./context/AppContext";
import GenerateBtn from "./components/GenerateBtn";
const App = () => {
  const { showLogin } = useContext(AppContext);
  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      <ToastContainer position="bottom-right" />
      {showLogin ? (
        <Login />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Generate" element={<GenerateBtn />} />
        </Routes>
      )}
    </div>
  );
};

export default App;

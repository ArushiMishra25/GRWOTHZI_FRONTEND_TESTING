import { createContext, useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [website, setWebsite] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const generateImage = async (prompt) => {
    const { business_type, industry } = prompt;
    try {
      const { data } = await axios.post(
        backendUrl + "/api/websites/generate",
        { business_type, industry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        console.log(data);
        toast.success("Website generated successfully!");
        return data.website;
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    generateImage,
    website,
    setWebsite,
  };

  return <AppContext value={value}>{props.children}</AppContext>;
};
export default AppContextProvider;

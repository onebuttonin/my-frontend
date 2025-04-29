import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);   // ✅ Add loading state

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.get(`${import.meta.env.VITE_API_URL}/user-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);  // ✅ Mark loading complete
      }
    };

    verifyToken();
  }, []);

  return { isLoggedIn, loading };
};

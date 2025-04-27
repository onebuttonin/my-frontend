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
          await axios.get("http://127.0.0.1:8000/api/user-token", {
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

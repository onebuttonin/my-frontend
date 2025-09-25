// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function AllUsers() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get(`${import.meta.env.VITE_API_URL}/Allusers`);
                
//                 // Ensure correct data extraction
//                 const userData = Array.isArray(response.data) && Array.isArray(response.data[0]) 
//                     ? response.data[0] // Extract first array if response is nested
//                     : response.data;
                
//                 setUsers(userData);
//             } catch (err) {
//                 setError("Failed to fetch users.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();
//     }, []);

//     if (loading) return <p>Loading users...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;

//     return (
//         <div className="container mx-auto px-4 py-6">
//             <h2 className="text-2xl font-bold mb-4">All Users</h2>
//             <div className="overflow-x-auto">
//                 <table className="table-auto w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="border border-gray-300 px-4 py-2">User ID</th>
//                             <th className="border border-gray-300 px-4 py-2">Name</th>
//                             <th className="border border-gray-300 px-4 py-2">Phone</th>
//                             <th className="border border-gray-300 px-4 py-2">Email</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user.id}>
//                                 <td className="border border-gray-300 px-4 py-2">{user.id || "N/A"}</td>
//                                 <td className="border border-gray-300 px-4 py-2">{user.name || "N/A"}</td>
//                                 <td className="border border-gray-300 px-4 py-2">{user.phone || "N/A"}</td>
//                                 <td className="border border-gray-300 px-4 py-2">{user.email || "N/A"}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token =
        localStorage.getItem("admin_token") || localStorage.getItem("token");

      if (!token) {
        navigate("/admin/login"); // No token, redirect
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/Allusers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Ensure correct data extraction
        const userData =
          Array.isArray(response.data) && Array.isArray(response.data[0])
            ? response.data[0]
            : response.data;

        setUsers(userData);
      } catch (err) {
        console.error("Error fetching users:", err);

        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem("admin_token");
          navigate("/admin/login"); // Unauthorized, redirect
          return;
        }

        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {user.id || user._id || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.phone || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

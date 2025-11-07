// import { Link } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
// import axios from "axios";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
// const [isSticky, setIsSticky] = useState(false);

//     useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 60) {
//         setIsSticky(true);
//       } else {
//         setIsSticky(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       if (searchQuery.trim() === "") {
//         setSearchResults([]); 
//         return;
//       }

//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/search?query=${searchQuery}`);
//         setSearchResults(response.data);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//     };

//     const delayDebounce = setTimeout(fetchSearchResults, 300);
//     return () => clearTimeout(delayDebounce);
//   }, [searchQuery]);

//   return (
//     <nav
//       className={`bg-neutral-100 text-black shadow-md transition-all duration-300 
//       ${isSticky ? "fixed top-0 w-full z-50" : "relative"} 
//       p-2 md:p-4`}
//     >
//       <div className="container mx-auto flex items-center justify-between">
//         {/* Menu Button */}
//         <button className="focus:outline-none mr-2" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>

//         {/* Logo */}
//         <h1 className="text-3xl font-bold flex-1" href="/">OneButton</h1>

//         {/* Icons */}
//         <ul className="hidden md:flex space-x-4">
//           <li>
//             <button
//               onClick={() => setSearchOpen(!searchOpen)}
//               className="w-6 h-6 cursor-pointer hover:border-b"
//             >
//               <Search className="w-6 h-6" />
//             </button>
//           </li>
//           <li><Link to="/login" onClick={() => setIsOpen(false)}><User className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
//           <li><Link to="/wishlist" onClick={() => setIsOpen(false)}><Heart className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
//           <li><Link to="/cart" onClick={() => setIsOpen(false)}><ShoppingCart className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
//         </ul>

//         {/* Cart Icon for Small Screens */}
//         <ul className="flex md:hidden space-x-4">
//           <li><Link to="/cart" onClick={() => setIsOpen(false)}><ShoppingCart className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
//         </ul>
//       </div>

//       {/* Search Dropdown */}
//       {searchOpen && (
//         <div className="bg-neutral-100 p-2 shadow-md border-t">
//           <div className="container mx-auto flex items-center border rounded-lg px-3 py-2">
//             <Search className="w-5 h-5 text-gray-600" />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="ml-2 focus:outline-none w-full bg-transparent"
//             />
//           </div>

//           {/* Display Search Results */}
//           {searchQuery && (
//             <div className="bg-neutral-100 p-2 max-h-60 overflow-y-auto">
//               {searchResults.length > 0 ? (
//                 searchResults.map((product) => (
//                   <div key={product.id} className="p-2">
//                     <Link 
//                       to={`/product/${product.id}`} 
//                       className="flex items-center" 
//                       onClick={() => { setIsOpen(false); setSearchOpen(false); }}
//                     >
//                       <img 
//                         src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`} 
//                         alt={product.name} 
//                         className="w-10 h-10 object-cover mr-3" 
//                       />
//                       <span>{product.name}</span>
//                     </Link>
//                   </div>
//                 ))
//               ) : (
//                 <p className="p-2 text-gray-500">No results found.</p>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Menu */}
//       {isOpen && (
//         <div className="bg-neutral-100 p-4 shadow-md mt-2">
//           <ul className="flex flex-col md:flex-row md:space-x-4">
//             <li>
//               <button onClick={() => setSearchOpen(!searchOpen)} className="block text-gray-700 hover:border-b w-full text-left">
//                 Search
//               </button>
//             </li>
//             <li><Link to="/" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Home</Link></li>
//             <li><Link to="/category" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Category</Link></li>
//             <li><Link to="/login" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Profile</Link></li>
//             <li><Link to="/wishlist" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Wishlist</Link></li>
//             <li><Link to="/OrderDetails" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Orders</Link></li>
//             <li><a href="#" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>About</a></li>
//             <li><a href="#" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Contact</a></li>
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// }



// import { Link } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
// import axios from "axios";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSticky, setIsSticky] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY > 60);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       if (searchQuery.trim() === "") {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/search?query=${searchQuery}`
//         );
//         setSearchResults(response.data);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//     };

//     const delayDebounce = setTimeout(fetchSearchResults, 300);
//     return () => clearTimeout(delayDebounce);
//   }, [searchQuery]);

//   return (
//     <nav
//       className={`bg-white text-black transition-all duration-300 border-b 
//       ${isSticky ? "fixed top-0 w-full z-50 shadow-md" : "relative"}`}
//     >
//       <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         {/* Mobile menu button */}
//         <button
//           className="md:hidden focus:outline-none"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         {/* Centered Logo */}
//         <div className="flex-1 text-center">
//           <Link
//             to="/"
//             className="text-2xl md:text-3xl font-semibold tracking-wide uppercase"
//           >
//             OneButton
//           </Link>
//         </div>

//         {/* Right-side icons */}
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => setSearchOpen(!searchOpen)}
//             className="hover:opacity-70 hidden md:flex"
//           >
//             <Search className="w-5 h-5" />
//           </button>
//           <Link to="/login" onClick={() => setIsOpen(false)}>
//             <User className="w-5 h-5 hover:opacity-70 hidden md:flex" />
//           </Link>
//           <Link to="/wishlist" onClick={() => setIsOpen(false)}>
//             <Heart className="w-5 h-5 hover:opacity-70 hidden md:flex" />
//           </Link>
//           <Link to="/cart" onClick={() => setIsOpen(false)}>
//             <ShoppingCart className="w-5 h-5 hover:opacity-70" />
//           </Link>
//         </div>
//       </div>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex justify-center space-x-8 py-2 border-t">
//         <Link
//           to="/"
//           className="text-sm uppercase tracking-wider hover:opacity-70"
//         >
//           Home
//         </Link>
//         <Link
//           to="/category"
//           className="text-sm uppercase tracking-wider hover:opacity-70"
//         >
//           Category
//         </Link>
//         <Link
//           to="/OrderDetails"
//           className="text-sm uppercase tracking-wider hover:opacity-70"
//         >
//           Orders
//         </Link>
//         <Link
//           to="#"
//           className="text-sm uppercase tracking-wider hover:opacity-70"
//         >
//           About
//         </Link>
//         <Link
//           to="#"
//           className="text-sm uppercase tracking-wider hover:opacity-70"
//         >
//           Contact
//         </Link>
//       </div>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-t">
//           <ul className="flex flex-col p-4 space-y-3">
            
//          <button
//   onClick={() => setSearchOpen(!searchOpen)}
//   className="text-gray-700 uppercase tracking-wide w-full text-left"
// >
//   Search
// </button>



//             <Link
//               to="/"
//               className="text-gray-700 uppercase tracking-wide"
//               onClick={() => setIsOpen(false)}
//             >
//               Home
//             </Link>
//             <Link
//               to="/category"
//               className="text-gray-700 uppercase tracking-wide"
//               onClick={() => setIsOpen(false)}
//             >
//               Category
//             </Link>
//             <Link
//               to="/OrderDetails"
//               className="text-gray-700 uppercase tracking-wide"
//               onClick={() => setIsOpen(false)}
//             >
//               Orders
//             </Link>
//             <Link
//               to="/login"
//               className="text-gray-700 uppercase tracking-wide"
//               onClick={() => setIsOpen(false)}
//             >
//               Profile
//             </Link>
//             <Link
//               to="/wishlist"
//               className="text-gray-700 uppercase tracking-wide"
//               onClick={() => setIsOpen(false)}
//             >
//               Wishlist
//             </Link>
//             <a
//               href="#"
//               className="text-gray-700 uppercase tracking-wide"
//               onClick={() => setIsOpen(false)}
//             >
//               About
//             </a>
//             <a
//               href="#"
//               className="text-gray-700 uppercase tracking-wide"
//               onClick={() => setIsOpen(false)}
//             >
//               Contact
//             </a>
//           </ul>
//         </div>
//       )}

//       {/* Search Bar */}
//       {searchOpen && (
//         <div className="bg-white border-t shadow-md">
//           <div className="container mx-auto flex items-center px-3 py-2">
//             <Search className="w-5 h-5 text-gray-600" />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="ml-2 focus:outline-none w-full bg-transparent"
//             />
//           </div>

//           {searchQuery && (
//             <div className="bg-white p-2 max-h-60 overflow-y-auto">
//               {searchResults.length > 0 ? (
//                 searchResults.map((product) => (
//                   <div key={product.id} className="p-2">
//                     <Link
//                       to={`/product/${product.id}`}
//                       className="flex items-center"
//                       onClick={() => {
//                         setIsOpen(false);
//                         setSearchOpen(false);
//                       }}
//                     >
//                       <img
//                         src={`${import.meta.env.VITE_BASE_URL}/storage/${
//                           product.image
//                         }`}
//                         alt={product.name}
//                         className="w-10 h-10 object-cover mr-3"
//                       />
//                       <span>{product.name}</span>
//                     </Link>
//                   </div>
//                 ))
//               ) : (
//                 <p className="p-2 text-gray-500">No results found.</p>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }



import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/search?query=${searchQuery}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <nav
      className={`bg-red-500 text-black transition-all duration-300 border-b 
      ${isSticky ? "fixed top-0 w-full z-50 shadow-md" : "relative"}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4 relative">
        {/* Mobile menu button (left) */}
        <button
          className="md:hidden focus:outline-none absolute left-4 top-1/2 -translate-y-1/2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Centered Logo */}
        <div className="mx-auto">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-semibold tracking-wide uppercase"
          >
            OneButton
          </Link>
        </div>

        {/* Right-side icons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:opacity-70 hidden md:flex"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link to="/login" onClick={() => setIsOpen(false)}>
            <User className="w-5 h-5 hover:opacity-70 hidden md:flex" />
          </Link>
          <Link to="/wishlist" onClick={() => setIsOpen(false)}>
            <Heart className="w-5 h-5 hover:opacity-70 hidden md:flex" />
          </Link>
          <Link to="/cart" onClick={() => setIsOpen(false)}>
            <ShoppingCart className="w-5 h-5 hover:opacity-70" />
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center space-x-8 py-2 border-t">
        <Link
          to="/"
          className="text-sm uppercase tracking-wider hover:opacity-70"
        >
          Home
        </Link>
        <Link
          to="/category"
          className="text-sm uppercase tracking-wider hover:opacity-70"
        >
          Category
        </Link>
        <Link
          to="/Orders"
          className="text-sm uppercase tracking-wider hover:opacity-70"
        >
          Orders
        </Link>
        <Link
          to="/AboutUs"
          className="text-sm uppercase tracking-wider hover:opacity-70"
        >
          About
        </Link>
        <Link
          to="/Contactus"
          className="text-sm uppercase tracking-wider hover:opacity-70"
        >
          Contact
        </Link>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col p-4 space-y-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 uppercase tracking-wide w-full text-left"
            >
              Search
            </button>
            <Link
              to="/"
              className="text-gray-700 uppercase tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/category"
              className="text-gray-700 uppercase tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Category
            </Link>
            <Link
              to="/Orders"
              className="text-gray-700 uppercase tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Orders
            </Link>
            <Link
              to="/login"
              className="text-gray-700 uppercase tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/wishlist"
              className="text-gray-700 uppercase tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Wishlist
            </Link>
            <a
              href="/AboutUs"
              className="text-gray-700 uppercase tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="/Contactus"
              className="text-gray-700 uppercase tracking-wide"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </ul>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="bg-white border-t shadow-md">
          <div className="container mx-auto flex items-center px-3 py-2">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 focus:outline-none w-full bg-transparent"
            />
          </div>

          {searchQuery && (
            <div className="bg-white p-2 max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div key={product.id} className="p-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center"
                      onClick={() => {
                        setIsOpen(false);
                        setSearchOpen(false);
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}/storage/${
                          product.image
                        }`}
                        alt={product.name}
                        className="w-10 h-10 object-cover mr-3"
                      />
                      <span>{product.name}</span>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="p-2 text-gray-500">No results found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}





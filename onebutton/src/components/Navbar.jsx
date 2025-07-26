import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]); 
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/search?query=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <nav className="bg-neutral-100 text-black p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Menu Button */}
        <button className="focus:outline-none mr-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <h1 className="text-3xl font-bold flex-1" href="/">OneButton</h1>

        {/* Icons */}
        <ul className="hidden md:flex space-x-4">
          <li>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-6 h-6 cursor-pointer hover:border-b"
            >
              <Search className="w-6 h-6" />
            </button>
          </li>
          <li><Link to="/login" onClick={() => setIsOpen(false)}><User className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
          <li><Link to="/wishlist" onClick={() => setIsOpen(false)}><Heart className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
          <li><Link to="/cart" onClick={() => setIsOpen(false)}><ShoppingCart className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
        </ul>

        {/* Cart Icon for Small Screens */}
        <ul className="flex md:hidden space-x-4">
          <li><Link to="/cart" onClick={() => setIsOpen(false)}><ShoppingCart className="w-6 h-6 cursor-pointer hover:border-b" /></Link></li>
        </ul>
      </div>

      {/* Search Dropdown */}
      {searchOpen && (
        <div className="bg-neutral-100 p-2 shadow-md border-t">
          <div className="container mx-auto flex items-center border rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 focus:outline-none w-full bg-transparent"
            />
          </div>

          {/* Display Search Results */}
          {searchQuery && (
            <div className="bg-neutral-100 p-2 max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div key={product.id} className="p-2">
                    <Link 
                      to={`/product/${product.id}`} 
                      className="flex items-center" 
                      onClick={() => { setIsOpen(false); setSearchOpen(false); }}
                    >
                      <img 
                        src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`} 
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

      {/* Menu */}
      {isOpen && (
        <div className="bg-neutral-100 p-4 shadow-md mt-2">
          <ul className="flex flex-col md:flex-row md:space-x-4">
            <li>
              <button onClick={() => setSearchOpen(!searchOpen)} className="block text-gray-700 hover:border-b w-full text-left">
                Search
              </button>
            </li>
            <li><Link to="/" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Home</Link></li>
            <li><Link to="/category" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Category</Link></li>
            <li><Link to="/login" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Profile</Link></li>
            <li><Link to="/wishlist" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Wishlist</Link></li>
            <li><Link to="/OrderDetails" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Orders</Link></li>
            <li><a href="#" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>About</a></li>
            <li><a href="#" className="block text-gray-700 hover:border-b" onClick={() => { setIsOpen(false); setSearchOpen(false); }}>Contact</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

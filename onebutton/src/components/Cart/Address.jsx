import { useState, useEffect } from 'react';
import axios from 'axios';

function AddressSelection() {
  const [address, setAddress] = useState(null); // user's previous address
  const [selectedOption, setSelectedOption] = useState(''); // 'existing' or 'new'

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function fetchAddress() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-previous-address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setAddress(response.data); // previous address available
        }
      } catch (error) {
        console.error('No previous address found');
      }
    }

    fetchAddress();
  }, []);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="p-4">
      {address ? (
        <>
          <h2 className="text-lg font-bold mb-2">Choose Address</h2>
          <div className="mb-4">
            <label>
              <input
                type="radio"
                value="existing"
                checked={selectedOption === 'existing'}
                onChange={handleOptionChange}
              />
              <span className="ml-2">
                Use Existing Address: {address.name},{address.street1},{address.street2}, {address.city}, {address.state},{address.pincode}
              </span>
            </label>
          </div>
          <div className="mb-4">
            <label>
              <input
                type="radio"
                value="new"
                checked={selectedOption === 'new'}
                onChange={handleOptionChange}
              />
              <span className="ml-2">Add New Address</span>
            </label>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-2">Add New Address</h2>
        </>
      )}

      {/* Form to Add New Address */}
      {(!address || selectedOption === 'new') && (
        <div>
          <input type="text" placeholder="Street 1" className="border p-2 mb-2 w-full" />
          <input type="text" placeholder="Street 2" className="border p-2 mb-2 w-full" />
          <input type="text" placeholder="City" className="border p-2 mb-2 w-full" />
          <input type="text" placeholder="State" className="border p-2 mb-2 w-full" />
          <input type="text" placeholder="Pincode" className="border p-2 mb-2 w-full" />
          <input type="text" placeholder="Mobile" className="border p-2 mb-2 w-full" />
        </div>
      )}

      {/* Button to Proceed */}
      <button className="bg-blue-500 text-white p-2 rounded mt-4">
        Proceed to Place Order
      </button>
    </div>
  );
}

export default AddressSelection;

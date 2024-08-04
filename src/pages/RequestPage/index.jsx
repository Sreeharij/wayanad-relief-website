import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import "./styles.css";
import { Link } from 'react-router-dom';
import Filter from 'bad-words'; 

const filter = new Filter();
const RequestForm = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    items: [{ itemName: '', itemQuantity: '' }],
    status: 'open' // default status
  });
  const [previousItems, setPreviousItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

  // Fetch previous item names from Firestore
  useEffect(() => {
    const fetchPreviousItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'wayanad-relief'));
        const items = new Set(); // Use a Set to avoid duplicates
        querySnapshot.forEach((doc) => {
          const requestData = doc.data();
          requestData.items.forEach((item) => {
            items.add(item.itemName);
          });
        });
        setPreviousItems([...items]);
      } catch (error) {
        console.error('Error fetching previous items: ', error);
      }
    };

    fetchPreviousItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    if (name === 'itemName') {
      const filteredSuggestions = previousItems.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }

    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', itemQuantity: '' }]
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleSelectSuggestion = (index, suggestion) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], itemName: suggestion };
    setFormData({
      ...formData,
      items: updatedItems
    });
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasProfanity = [
      formData.location,
      formData.description,
      ...formData.items.map(item => item.itemName)
    ].some(text => filter.isProfane(text));
  
    if (hasProfanity) {
      alert('Please remove any inappropriate content before submitting.');
      return;
    }

    try {
      const requestRef = collection(db, 'wayanad-relief');
      await addDoc(requestRef, formData);

      setFormData({
        location: '',
        description: '',
        items: [{ itemName: '', itemQuantity: '' }],
        status: 'open' // reset status
      });

      alert('Request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request: ', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
  <div className="mb-4">
    <Link to="/" className="request-btn bg-gray-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-gray-600">
      Home
    </Link>
  </div>
  <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Emergency Item Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          {formData.items.map((item, index) => (
            <div key={index} className="border p-4 rounded-md relative">
              <h3 className="text-xl font-semibold mb-2">Item {index + 1}</h3>
              <div ref={suggestionsRef}>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded-md shadow-sm mt-1 max-h-40 overflow-auto z-10">
                    {suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        onClick={() => handleSelectSuggestion(index, suggestion)}
                        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Quantity</label>
                <input
                  type="number"
                  name="itemQuantity"
                  value={item.itemQuantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remove Item
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="request-btn bg-blue-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Another Item
          </button>
          <div>
            <button
              type="submit"
              className="request-btn bg-indigo-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;

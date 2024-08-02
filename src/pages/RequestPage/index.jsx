import React, { useState } from 'react';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc } from 'firebase/firestore';
import "./styles.css";

const RequestForm = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    items: [{ itemName: '', itemQuantity: '' }],
    status: 'open' // default status
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestRef = collection(db, 'wayanad-relief');
      await addDoc(requestRef, formData);

      // setData([...data, formData]);
      
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
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
            <div key={index} className="border p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Item {index + 1}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
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

import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [showClosed, setShowClosed] = useState(false);
  const [aggregateItems, setAggregateItems] = useState({});
  const [locationItems, setLocationItems] = useState({});
  const [viewMode, setViewMode] = useState('default'); // 'default', 'itemsCount', 'locationItems'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'wayanad-relief'));
        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docsData);
        aggregateData(docsData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const aggregateData = (docsData) => {
    const itemCounts = {};
    const locItems = {};

    docsData.forEach((doc) => {
      doc.items.forEach((item) => {
        if (doc.status === 'open') {
          itemCounts[item.itemName] = (itemCounts[item.itemName] || 0) + Number(item.itemQuantity);
        }
      });

      if (!locItems[doc.location]) {
        locItems[doc.location] = [];
      }
      if (doc.status === 'open') {
        locItems[doc.location].push(...doc.items);
      }
    });

    setAggregateItems(itemCounts);
    setLocationItems(locItems);
  };

  const handleStatusChange = async (id) => {
    try {
      const requestDoc = doc(db, 'wayanad-relief', id);
      await updateDoc(requestDoc, { status: 'closed' });
      const updatedData = data.map((item) => (item.id === id ? { ...item, status: 'closed' } : item));
      setData(updatedData);
      aggregateData(updatedData);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  const closedRequestsCount = data.filter((item) => item.status === 'closed').length;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
      <nav className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 shadow-xl">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0">
                <Link to="/" className="text-white text-3xl font-extrabold">Wayanad Relief</Link>
              </div>
            </div>
            <div className="flex items-center ml-4 space-x-4">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={() => setShowClosed(!showClosed)}
                className="mr-2"
              />
              <label className="text-gray-200 text-lg font-medium">Show Closed Requests</label>
              <span className="ml-2 text-gray-200 text-lg">{closedRequestsCount}</span>
            </div>
            <div className="flex items-center ml-4 space-x-4">
              <button
                onClick={() => setViewMode('itemsCount')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
              >
                View Items Count
              </button>
              <button
                onClick={() => setViewMode('locationItems')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
              >
                View Items by Location
              </button>
              <button
                onClick={() => setViewMode('default')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
              >
                Default View
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-6">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Request Data</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewMode === 'default' && data
              .filter(item => showClosed || item.status === 'open')
              .map((item, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-500 transform transition-transform duration-300 hover:scale-105">
                  <h2 className="text-2xl font-semibold mb-2 text-blue-600">Location: {item.location}</h2>
                  <p className="text-gray-700 mb-2"><strong>Description:</strong> {item.description}</p>
                  <h3 className="text-lg font-semibold mt-4">Items:</h3>
                  <ul className="list-disc list-inside">
                    {item.items.map((itemDetail, idx) => (
                      <li key={idx} className="text-gray-700">
                        <span className="font-medium">{itemDetail.itemName}</span>: {itemDetail.itemQuantity}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700 mt-4"><strong>Status:</strong> {item.status}</p>
                  {item.status === 'open' && (
                    <button
                      onClick={() => handleStatusChange(item.id)}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
                    >
                      Mark as Closed
                    </button>
                  )}
                </div>
              ))}
            {viewMode === 'itemsCount' && (
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
                <h2 className="text-2xl font-semibold mb-4 text-blue-600">Aggregate Item Counts</h2>
                <ul className="list-disc list-inside">
                  {Object.entries(aggregateItems).map(([itemName, count]) => (
                    <li key={itemName} className="text-gray-700">
                      <span className="font-medium">{itemName}</span>: {count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {viewMode === 'locationItems' && (
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
                <h2 className="text-2xl font-semibold mb-4 text-blue-600">Items by Location</h2>
                {Object.entries(locationItems).map(([location, items]) => (
                  <div key={location} className="mb-4">
                    <h3 className="text-xl font-semibold mb-2 text-blue-600">Location: {location}</h3>
                    <ul className="list-disc list-inside pl-4">
                      {items.map((itemDetail, idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="font-medium">{itemDetail.itemName}</span>: {itemDetail.itemQuantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

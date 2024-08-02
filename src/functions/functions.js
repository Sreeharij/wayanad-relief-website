import { db } from '../../firebaseConfig.js';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const [data, setData] = useState([]);
const [showClosed, setShowClosed] = useState(false);
const [aggregateItems, setAggregateItems] = useState({});
const [locationItems, setLocationItems] = useState({});
const [viewMode, setViewMode] = useState('default'); 

export const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'wayanad-relief'));
      const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(docsData);
      aggregateData(docsData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
};

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
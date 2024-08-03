import { Link } from "react-router-dom";
import ItemsTable from "./ItemsTable";
import "./styles.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const HomePage = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'wayanad-relief'));
        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docsData);
        console.log(data);
        // aggregateData(docsData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="home-page">
      <Link className="home-login" to="/admin">Admin Login</Link>
      <h1 className="home-h1">Wayanad Relief</h1>

      <ul className="home-ul">
        <li><Link to="/request-form">Request New Item</Link></li>
      </ul>

      <div className="home-main">
        <h3 className="home-h3">Pending Requests</h3>
        <ItemsTable data={data} />
      </div>
    </div>
  )
}

export default HomePage

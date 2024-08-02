import { Link } from "react-router-dom";
import ItemsTable from "./ItemsTable";
import "./styles.css";

const HomePage = () => {

  return (
    <div className="home-page">
      <Link className="home-login" to="admin">Admin Login</Link>
      <h1 className="home-h1">Wayanad Relief</h1>

      <ul className="home-ul">
        <li>Request Item</li>
        <li>Required Items</li>
        <li>Donate Money</li>
      </ul>

      <div className="home-main">
        <h3 className="home-h3">Requested Items</h3>
        <ItemsTable />
      </div>
    </div>
  )
}

export default HomePage

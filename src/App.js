import './App.css';
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import RequestForm from './pages/RequestPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/request-form" element={<RequestForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

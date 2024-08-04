import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import RequestForm from './pages/RequestPage';

function App() {
  useEffect(() => {
    const scriptId = 'google-translate-script';

    // Ensure the script is added to the document only once
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = scriptId;
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = function() {
      // Remove any existing widget before creating a new one
      const existingWidget = document.getElementById('google_translate_element');
      if (existingWidget) {
        existingWidget.innerHTML = '';
      }

      try {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ta,hi,ml', // Include only the languages you want
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
      }
    };

    return () => {
      // Cleanup: Remove the widget and script when the component is unmounted
      const script = document.getElementById(scriptId);
      if (script) {
        document.body.removeChild(script);
      }
      const widget = document.getElementById('google_translate_element');
      if (widget) {
        widget.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div className="App">
      <header style={{ position: 'relative', padding: '1px', backgroundColor: '#ffffff' }}>
        <div id="google_translate_element"></div> 
      </header>
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


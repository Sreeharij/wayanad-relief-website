import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    };

    if (!window.google || !window.google.translate) {
      addGoogleTranslateScript();
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div id="google_translate_element" style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}></div>
  );
};

export default GoogleTranslate;


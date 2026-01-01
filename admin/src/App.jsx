// App.js

import React, { useState } from 'react';
import Navbar from '/Volumes/Mateen/e-commerce/admin/src/Components/Navbar/Navbar.jsx';
import Admin from '/Volumes/Mateen/e-commerce/admin/src/Pages/Admin/Admin.jsx';
import LoginSignup from '/Volumes/Mateen/e-commerce/admin/src/Components/Login/login.jsx';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  // Function to handle successful authentication
  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <div>
      {authenticated ? (
        <div>
          <Navbar />
          <Admin />
        </div>
      ) : (
        <LoginSignup onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;

// LoginSignup.js

import React, { useState } from 'react';
import '/Volumes/Mateen/e-commerce/admin/src/Components/Login/login.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const response = await fetch('http://localhost:4000/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success('Login successful');
        localStorage.setItem('auth-token', responseData.token);
        // Call the callback function passed from App to handle successful login
        onLogin();
        
      } else {
        toast.error(responseData.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to log in');
    }
  };

  return (
    <div className="loginsignup">
         <ToastContainer />
      <div className="loginsignup-container">
        <h1>Login</h1>
        <div className="loginsign-fields">
          <input
            name="id"
            value={formData.id}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button onClick={login}>Continue</button>

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By Continuing, I agree to the terms and Conditions</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

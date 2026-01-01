import React from "react";
import './Navbar.css';
import nav_logo from'../../assets/logo.png';
import navprofile from '../../assets/navprofile.jpeg';

const Navbar=()=>{
    return(
        <div className="navbar">
            <img className="nav-logo" src={nav_logo} alt="" />
            <div className="right">
            <img src={navprofile} className="nav-profile"alt="" />
            {localStorage.getItem('auth-token')?<button className="login" onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Log Out</button>:<></>}
                 </div>
            
        </div>
    )
}
export default Navbar;
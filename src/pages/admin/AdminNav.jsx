import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from './firebase.js'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './AdminNav.css'

export function AdminNav() {

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch(err) {
      console.log(err);
    }
  };
  
  return (
    <nav className="adminNav">
      <span className="adminNavLogo">Prime+</span>
        <div className="adminMidRow">
          <Link
            to="/Users"
            style={{textDecoration: 'none', color: 'white'}}
            >
            Users
          </Link>
          <Link
            to="/Products"
            style={{textDecoration: 'none', color: 'white', marginLeft: '20px'}}
            >
            Products
          </Link>
        </div>
      <button 
        onClick={() => logout()}
        className="logoutBtn"
        >
        Logout
      </button>
    </nav>
  )
}
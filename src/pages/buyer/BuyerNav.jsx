import React from 'react'
import { Link } from 'react-router-dom'
import './buyerNav.css'

export function BuyerNav() {
  
  return (
    <nav className="buyerNav">
      <span className="buyerNavLogo">Prime+</span>
      <input 
        className="searchBar" 
        placeholder="Search"
        type="string"
      />
      <Link
        to="/Compare"
        style={{textDecoration: 'none', color: 'white'}}
        >
        Compare
      </Link>
      <Link
        to="/Cart"
        style={{textDecoration: 'none', color: 'white'}}
        >
        Cart
      </Link>
      <Link
        to="/Return"
        style={{textDecoration: 'none', color: 'white'}}
        >
        Returns
      </Link>
      <button className="buyerLogoutBtn">Logout</button>
    </nav>
  )
}
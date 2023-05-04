import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from './firebase'
import './buyerNav.css'
import { SearchResults } from './SearchPage'

export function BuyerNav() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  const handleSearch = async () => {
    // Search for products that match the search term
    const productRef = collection(db, 'products')
    const q = query(productRef, where('title', '==', searchTerm))
    const querySnapshot = await getDocs(q)

    // Create an array of product objects from the query snapshot
    const searchResults = []

    querySnapshot.forEach((doc) => {
      searchResults.push({ id: doc.id, ...doc.data() })
    })

    // Navigate to the search results page and pass the search results as a prop
    navigate({
      pathname: '/search',
      state: { searchResults },
    })
  }

  const logout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <nav className="buyerNav">
      <span className="buyerNavLogo">Prime+</span>
      <input
        className="searchBar"
        placeholder="Search"
        type="string"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="searchBtn" onClick={handleSearch}>
        Search
      </button>
      <Link to="/Compare" style={{ textDecoration: 'none', color: 'white' }}>
        Compare
      </Link>
      <Link to="/Cart" style={{ textDecoration: 'none', color: 'white' }}>
        Cart
      </Link>
      <Link to="/Return" style={{ textDecoration: 'none', color: 'white' }}>
        Returns
      </Link>
      <button className="buyerLogoutBtn" onClick={() => logout()}>
        Logout
      </button>

      {searchResults.length > 0 && <SearchResults results={searchResults} />}
    </nav>
  )
}

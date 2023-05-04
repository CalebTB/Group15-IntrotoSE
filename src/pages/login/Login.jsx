import React, { useState } from 'react'
import { auth } from './firebase'
import './login.css'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password).then(() => {
      // Redirect to appropriate page based on user role
      switch (role) {
        case 'buyer':
          window.location.href = '/buyer'
          break
        case 'seller':
          window.location.href = '/seller'
          break
        case 'admin':
          window.location.href = '/admin'
          break
        default:
          console.log('Invalid role')
      }
    })
  }

  return (
    <div className="login">
      <form className="loginForm" onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <label>
          Role:
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Select a role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

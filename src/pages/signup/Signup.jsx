import { React, useState } from 'react'
import { auth, db } from './firebase'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import './Signup.css'

export const Auth = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const signUp = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: role,
      })
      const rolePath = `/${role.toLowerCase()}`
      navigate(rolePath)
      console.log(rolePath)
    } catch (err) {
      console.log(err)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const checkAuthentication = () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      navigate('/')
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <body className="signUpPage">
            <div className="box">
              <h1 className="signUpLogo">Prime+</h1>
              <input
                className="emailField"
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="passwordField"
                placeholder="Password..."
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                className="role roleField"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Seller">Seller</option>
                <option value="Buyer">Buyer</option>
              </select>
              <div className="formBottom">
                <p className="info">Already have an account? </p>
                <Link to="/login" className="accountLink">
                  {' '}
                  Log In!
                </Link>
              </div>
              <button className="signUpButton" onClick={signUp}>
                Sign Up
              </button>
            </div>
          </body>
        }
      />
      <Route
        path="/admin"
        element={<div>Admin Page</div>}
        onEnter={checkAuthentication}
      />
      <Route
        path="/seller"
        element={<div>Seller Page</div>}
        onEnter={checkAuthentication}
      />
      <Route
        path="/buyer"
        element={<div>Buyer Page</div>}
        onEnter={checkAuthentication}
      />
      <Route
        path="/logout"
        element={<div>Logging Out...</div>}
        onEnter={logout}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

import { React, useState, useEffect } from 'react'
import { db, auth } from './firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { AdminNav } from './AdminNav'
import './adminUsers.css'

export function AdminUsers() {
  const [users, setUsers] = useState([])

const deleteUser = async (id, uid) => {
  try {
    console.log('Deleting user with id', id, 'and uid', uid)
    await deleteDoc(doc(db, 'users', id)) // remove the user from the database
    console.log('User deleted from Firestore')
    await auth.deleteUser(uid) // remove the user from Firebase Authentication
    console.log('User deleted from Firebase Authentication')
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id)) // update the state of the users array
    console.log('User removed from state')
  } catch (err) {
    console.log('Error deleting user:', err)
  }
}

  useEffect(() => {
    const getUsers = async () => {
      const usersCollectionRef = collection(db, 'users')
      const data = await getDocs(usersCollectionRef)
      const usersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      setUsers(usersData)
    }

    getUsers()
  }, [])

  return (
    <div>
      <AdminNav />

      <div className="container">
        <div className="userBox">
          <h1 className="userHeader">User List</h1>
          <div className="userComp">
            {users.map((user) => (
              <div className="userInfo" key={user.id}>
                <div className="userClass">
                  <h1 className="userEmail">Email: {user.email} </h1>
                </div>
                <div className="buttonCol">
                  <button
                    className="deleteUser"
                    onClick={() => deleteUser(user.id, user.uid)}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

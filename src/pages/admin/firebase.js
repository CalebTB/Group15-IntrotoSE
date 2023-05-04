import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBwXj16G7RmKpuvqRmig9ADrrKHXzZpJlk',
  authDomain: 'primeplus-aa83e.firebaseapp.com',
  projectId: 'primeplus-aa83e',
  storageBucket: 'primeplus-aa83e.appspot.com',
  messagingSenderId: '525981945308',
  appId: '1:525981945308:web:1d7e3ee454f43879d9d319',
  measurementId: 'G-ZPNKT19R41',
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export const db = firebaseApp.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()

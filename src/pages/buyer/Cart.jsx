import { useState, useEffect } from 'react'
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { BuyerNav } from './BuyerNav'
import './cart.css'

export function Cart() {
  const [cartList, setCartList] = useState([])

  useEffect(() => {
    const cartCollectionRef = collection(db, 'Cart')
    const q = query(cartCollectionRef)
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const updatedCartList = []
      for (const docRef of snapshot.docs) {
        const cartItem = { id: docRef.id, productId: docRef.data().productId }
        const productDocRef = doc(db, 'products', cartItem.productId)
        const productDoc = await getDoc(productDocRef)
        const productData = { ...productDoc.data(), id: productDoc.id }
        updatedCartList.push({ ...cartItem, productData })
      }
      setCartList(updatedCartList)
    })
    return () => unsubscribe()
  }, [])

  const handleCheckout = async () => {
    try {
      const previousOrdersCollectionRef = collection(db, 'PreviousOrders')
      for (const cartItem of cartList) {
        await addDoc(previousOrdersCollectionRef, {
          productId: cartItem.productId,
        })
      }
      for (const cartItem of cartList) {
        await deleteDoc(doc(db, 'Cart', cartItem.id))
      }
      alert('Checkout successful!')
    } catch (error) {
      console.error('Error checking out: ', error)
    }
  }

  return (
    <div>
      <BuyerNav />
      <div>
        {cartList.map((cartItem) => (
          <div className="cartContainer" key={cartItem.id}>
            <div className="cartLeft">
              <img
                className="cartImg"
                src={cartItem.productData.imageUrl}
                alt={cartItem.productData.title}
              />
              <div className="cartTop">
                <h2 className="cartTitle">{cartItem.productData.title}</h2>
                <h2 className="cartPrice">${cartItem.productData.price}</h2>
              </div>
            </div>
            <button className="cartRemove">Remove</button>
          </div>
        ))}
      </div>
      <button className="checkoutBtn" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  )
}

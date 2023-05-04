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
import './return.css'

export function Return() {
  const [previousOrderList, setPreviousOrderList] = useState([])

  useEffect(() => {
    const previousOrderCollectionRef = collection(db, 'PreviousOrders')
    const q = query(previousOrderCollectionRef)
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const updatedPreviousOrderList = []
      for (const docRef of snapshot.docs) {
        const previousOrderItem = {
          id: docRef.id,
          productId: docRef.data().productId,
        }
        const productDocRef = doc(db, 'products', previousOrderItem.productId)
        const productDoc = await getDoc(productDocRef)
        const productData = { ...productDoc.data(), id: productDoc.id }
        updatedPreviousOrderList.push({ ...previousOrderItem, productData })
      }
      setPreviousOrderList(updatedPreviousOrderList)
    })
    return () => unsubscribe()
  }, [])

  const handleReturn = async (itemId) => {
    await deleteDoc(doc(db, 'PreviousOrders', itemId))
    setPreviousOrderList(previousOrderList.filter((item) => item.id !== itemId))
    alert('Item successfully returned!')
  }

  return (
    <div>
      <BuyerNav />
      <div>
        {previousOrderList.map((previousOrderItem) => (
          <div className="returnContainer" key={previousOrderItem.id}>
            <div className="returnLeft">
              <img
                className="returnImg"
                src={previousOrderItem.productData.imageUrl}
                alt={previousOrderItem.productData.title}
              />
              <div className="returnDetails">
                <div className="returnTop">
                  <h2 className="returnTitle">
                    {previousOrderItem.productData.title}
                  </h2>
                  <h2 className="returnPrice">
                    ${previousOrderItem.productData.price}
                  </h2>
                </div>
                <p className="returnDesc">
                  {previousOrderItem.productData.description}
                </p>
              </div>
            </div>
            <button
              className="returnBtn"
              onClick={() => handleReturn(previousOrderItem.id)}
            >
              Return
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

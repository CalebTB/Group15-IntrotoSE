import { useState, useEffect } from 'react'
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { BuyerNav } from './BuyerNav'
import './compare.css'

export function Compare() {
  const [compareList, setCompareList] = useState([])

  useEffect(() => {
    const compareCollectionRef = collection(db, 'Compare')
    const q = query(compareCollectionRef)
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const updatedCompareList = []
      for (const docRef of snapshot.docs) {
        const compareItem = {
          id: docRef.id,
          productId: docRef.data().productId,
        }
        const productDocRef = doc(db, 'products', compareItem.productId)
        const productDoc = await getDoc(productDocRef)
        const productData = { ...productDoc.data(), id: productDoc.id }
        updatedCompareList.push({ ...compareItem, productData })
      }
      setCompareList(updatedCompareList)
    })
    return () => unsubscribe()
  }, [])

  async function AddToCart(productId) {
    const cartCollectionRef = collection(db, 'Cart')
    await addDoc(cartCollectionRef, { productId })
  }

  const handleRemoveCompare = async (compareItemId) => {
    try {
      await deleteDoc(doc(db, 'Compare', compareItemId))
    } catch (error) {
      console.error('Error removing compare item: ', error)
    }
  }

  return (
    <div>
      <BuyerNav />
      <div>
        {compareList.map((compareItem) => (
          <div className="compareContainer" key={compareItem.id}>
            <div className="compareLeft">
              <img
                className="compareImg"
                src={compareItem.productData.imageUrl}
                alt={compareItem.productData.title}
              />
              <div className="compareDetails">
                <div className="compareTop">
                  <h2 className="compareTitle">
                    {compareItem.productData.title}
                  </h2>
                  <h2 className="comparePrice">
                    ${compareItem.productData.price}
                  </h2>
                </div>
                <p className="compareDesc">
                  {compareItem.productData.description}
                </p>
              </div>
            </div>
            <div className="buttonRow">
              <button
                className="compareCart"
                onClick={() => AddToCart(compareItem.productId)}
              >
                Add to Cart
              </button>
              <button
                className="compareRemove"
                onClick={() => handleRemoveCompare(compareItem.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

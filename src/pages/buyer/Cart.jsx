import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { BuyerNav } from './BuyerNav';

export function Cart() {
  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    const cartCollectionRef = collection(db, "Cart");
    const q = query(cartCollectionRef);
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const updatedCartList = [];
      for (const docRef of snapshot.docs) {
        const cartItem = { id: docRef.id, productId: docRef.data().productId };
        const productDocRef = doc(db, "products", cartItem.productId);
        const productDoc = await getDoc(productDocRef);
        const productData = { ...productDoc.data(), id: productDoc.id };
        updatedCartList.push({ ...cartItem, productData });
      }
      setCartList(updatedCartList);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <BuyerNav />
      <div>
        <h2>Cart List</h2>
        {cartList.map((cartItem) => (
          <div key={cartItem.id}>
            <img src={cartItem.productData.imageUrl} alt={cartItem.productData.title} />
            <h2>{cartItem.productData.title}</h2>
            <h2>${cartItem.productData.price}</h2>
            <p>{cartItem.productData.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

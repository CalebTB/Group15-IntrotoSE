import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { BuyerNav } from './BuyerNav'

export function Compare() {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const compareCollectionRef = collection(db, "Compare");
    const q = query(compareCollectionRef);
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const updatedCompareList = [];
      for (const docRef of snapshot.docs) {
        const compareItem = { id: docRef.id, productId: docRef.data().productId };
        const productDocRef = doc(db, "products", compareItem.productId);
        const productDoc = await getDoc(productDocRef);
        const productData = { ...productDoc.data(), id: productDoc.id };
        updatedCompareList.push({ ...compareItem, productData });
      }
      setCompareList(updatedCompareList);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <BuyerNav />
    <div>
      <h2>Compare List</h2>
        {compareList.map((compareItem) => (
          <div key={compareItem.id}>
            <img src={compareItem.productData.imageUrl} alt={compareItem.productData.title} />
            <h2>{compareItem.productData.title}</h2>
            <h2>${compareItem.productData.price}</h2>
            <p>{compareItem.productData.description}</p>
          </div>
        ))}
    </div>
    </div>
  );
}

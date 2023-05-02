import { React, useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { AdminNav } from './AdminNav';
import './adminProduct.css';

export function AdminProducts() {

  const [productList, setProductList] = useState([]);
  const productCollectionRef = collection(db, "products");

  const getProductList = async () => {
    try {
      const data = await getDocs(productCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(), 
        id: doc.id,
      }));
      setProductList(filteredData);
    } catch (err) {
      console.error(err)
    }
  };
  
  useEffect(() => {
    getProductList();
  }, []);

  const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
    await getProductList();
  };

  
  return (
    <div>
      <AdminNav />
      <h1 className="productHeader">Products</h1>
      {productList.map((product) => {
      return (
        <div key={product.id} className="productBox">
          <div className="leftSide">
            {product.imageUrl && <img className="adminProductImg" src={product.imageUrl} alt="Product" />}
            <div className="infoRow">
              <h3 className="productTitle">{product.title}</h3>
              <h3 className="productPrice">${product.price}</h3>
            </div>
          </div>
          <button className="adminRemoveProduct" onClick={() => deleteProduct(product.id)}>Remove Product</button>
        </div>
      );
    })}
  </div>
);
}
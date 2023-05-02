import { React, useState, useEffect } from "react"
import { db, storage, auth } from "./firebase.js";
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SellerNav } from "./SellerNav"
import "./product.css"

export function ViewProduct() {

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
      <SellerNav />
    <div>
      <h1 className="productPageHeader">Products</h1>
      {productList.map((product) => (
        <div className="sellerProductCard" key={product.id}>
          <img className="sellerImg" src={product.imageUrl} alt={product.title} />
          <div className="cardTopRow">
            <h2 className="sellerProductTitle">{product.title}</h2>
            <h2 className="sellerProductPrice">${product.price}</h2>
          </div>
          <p className="sellerProductDesc">{product.description}</p>
          <button className="sellerRemove" onClick={() => deleteProduct(product.id)}>Remove Product</button>
        </div>
      ))}
    </div>
  </div>
  );
}

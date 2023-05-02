import { React, useState, useEffect } from "react"
import { db, storage, auth } from "./firebase.js";
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './buyerProduct.css'
import { BuyerNav } from './BuyerNav'

export function BuyerViewProduct() {

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

  const addToCompare = async (productId) => {
    try {
      const compareCollectionRef = collection(db, "Compare");
      await addDoc(compareCollectionRef, { productId });
      console.log("Product added to Compare!");
    } catch (err) {
      console.error(err);
    }
  }

  const addToCart = async (productId) => {
    try {
      const cartCollectionRef = collection(db, "Cart");
      await addDoc(cartCollectionRef, { productId });
      console.log("Product added to Cart!");
    } catch (err) {
      console.error(err);
    }
  }

  
  return (
    <div>
      {productList.map((product) => (
        <div className="buyerProductCard" key={product.id}>
          <img className="buyerImg" src={product.imageUrl} alt={product.title} />
          <div className="buyerCardTopRow">
            <h2 className="buyerProductTitle">{product.title}</h2>
            <h2 className="buyerProductPrice">${product.price}</h2>
          </div>
          <p className="buyerProductDesc">{product.description}</p>
          <div className="btnRow">
            <button className="compareBtn" onClick={() => addToCompare(product.id)}>Compare</button>
            <button className="addToCartBtn" onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
}
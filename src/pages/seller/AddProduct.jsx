import { React, useState, useEffect } from "react"
import { db, storage, auth } from "./firebase.js";
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SellerNav } from "./SellerNav"

export function AddProduct() {

  const [newProductTitle, setNewProductTitle] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductDescription, setNewProductDescription] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
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

  const onSubmitProduct = async () => {
    try {
      const fileRef = ref(storage, `productFiles/${fileUpload.name}`);
      await uploadBytes(fileRef, fileUpload);
      const url = await getDownloadURL(fileRef);
      const docRef = await addDoc(productCollectionRef, {
        title: newProductTitle,
        price: newProductPrice,
        description: newProductDescription,
        imageUrl: url
      });
      setNewProductTitle('');
      setNewProductPrice(0);
      setNewProductDescription("");
      setFileUpload(null);
      await getProductList();
    } catch (err) {
      console.log(err)
    } 
  };

  const uploadFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `productFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
      const downloadURL = await getDownloadURL(filesFolderRef);
      console.log("File uploaded successfully", downloadURL);
    } catch (err) {
      console.error(err)
    }
  };
  
  return (
    <div>
      <SellerNav />
      <div className="addProductForm">
        <h1 className="productHeader">Add Product</h1>
        <input 
          className="title"
          placeholder="Product title..."
          onChange={(e) => setNewProductTitle(e.target.value)}
          />
        <input 
          className="price"
          placeholder="Product price..." 
          type="number" 
          onChange={(e) => setNewProductPrice(Number(e.target.value))}
          />
        <input
          className="description"
          placeholder="Product description..."
          type="string"
          onChange={(e) => setNewProductDescription(e.target.value)}
          >
        </input>
        <input
          className="file"
          type="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
          />
        <div className="content">
        <button 
          className="submit"
          onClick={onSubmitProduct}
          >
          Add Product
        </button>
        </div>
      </div>
    </div>
  )
}
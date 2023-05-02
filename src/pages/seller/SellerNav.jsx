import { signOut } from 'firebase/auth';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { auth } from "./firebase.js";
import './seller.css';

export function SellerNav() {

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch(err) {
      console.log(err);
    }
  };
  
  return (
      <nav className="sellerNav">
        <span className="sellerNavLogo">Prime+</span>
        <div 
          className="middleRow"
          style={{display: 'flex', alignItems: 'center'}}
          >
          <Link 
            to="/AddProduct"
            className="link"
            style={{textDecoration: 'none', color: 'white'}}
            >
            Add Product
          </Link>
          <Link 
            to="/ViewProduct"
            className="link"
            style={{marginLeft: '10px', textDecoration: 'none', color: 'white'}}
            >
            View Products
          </Link>
        </div>
        <button 
          onClick={() => logout()}
          className="logoutBtn"
          >
          Logout
        </button>
      </nav>
  )
}

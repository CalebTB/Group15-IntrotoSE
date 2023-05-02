import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth } from './pages/signup/Signup';
import { Login } from './pages/login/Login';
import { Admin } from './pages/admin/Admin';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Buyer } from './pages/buyer/Buyer';
import { Cart } from './pages/buyer/Cart';
import { Compare } from './pages/buyer/Compare';
import { Return } from './pages/buyer/Return';
import { Seller } from './pages/seller/Seller';
import { AddProduct } from './pages/seller/AddProduct';
import { ViewProduct } from './pages/seller/ViewProduct';



export const App = () => {
  return (
      <Routes>
        <Route path="*" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/buyer" element={<Buyer />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/ViewProduct" element={<ViewProduct />} />
        <Route path="/Compare" element={<Compare />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Return" element={<Return />} />
        <Route path="/Users" element={<AdminUsers />} />
        <Route path="/Products" element={<AdminProducts />} />
      </Routes>
  );
};

export default App

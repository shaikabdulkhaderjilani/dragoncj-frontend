import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from "react";

// --- IMPORTS FROM COMPONENTS FOLDER ---
// Chudu bro, prathi daniki mundu './components/' add chesa
import Navbar from './components/Navbar'; 
import Home from './components/home';
import Shop from './components/shop';
import ProductDetails from './components/ProductDetails';
import Cart from './components/cart';
import Checkout from './components/CheckOut';
import OrderSuccess from './components/OrderSuccess';
import Login from './components/Login';
import Signup from './components/signup';
import UserProfile from './components/Userprofile';
import Contact from './components/Contactus';
import OrderDetails from './components/Orderdetails';
import ElitePage from './components/Elitepage';
import { CartProvider } from './components/CartContext';
import Categories from './components/Categories'; 

// Scroll To Top Logic (Page marina prathisari paiki velladaniki)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <CartProvider>
    <Router>
      {/* ScrollToTop ni Router lopala pettali */}
      <ScrollToTop />
      
      {/* Navbar ni kuda Router lopala pettali, lekapothe Links pani cheyyavu */}
      <Navbar cartCount={2} /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/elite" element={<ElitePage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/Categories' element={<Categories />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
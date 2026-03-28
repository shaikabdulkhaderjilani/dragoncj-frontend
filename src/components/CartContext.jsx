import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  // 🔥 1. Initial Load: User unte DB nundi, lekapothe LocalStorage nundi thestham
  useEffect(() => {
    const userStr = localStorage.getItem('dragonUser');
    if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUserEmail(parsedUser.email);
        fetchUserCart(parsedUser.email);
    } else {
        const localCart = JSON.parse(localStorage.getItem('dragonCart')) || [];
        setCart(localCart);
    }
  }, []);

  const fetchUserCart = async (email) => {
      try {
          const res = await fetch(`http://localhost:5000/api/cart/${email}`);
          if (res.ok) {
              const dbCart = await res.json();
              setCart(dbCart);
              localStorage.setItem('dragonCart', JSON.stringify(dbCart)); 
          }
      } catch (err) { console.error("Cart fetch error:", err); }
  };

  // 🔥 2. Cart marithe Local lo save chesi, ventane DB ki sync chestham
  const updateCartAndSync = (newCart) => {
    setCart(newCart);
    localStorage.setItem('dragonCart', JSON.stringify(newCart));
    
    if (userEmail) {
        fetch('http://localhost:5000/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, cartItems: newCart })
        }).catch(err => console.error("Cart sync error:", err));
    }
  };

  const addToCart = (product) => {
    const exist = cart.find((x) => x._id === product._id);
    let newCart;
    
    if (exist) {
      newCart = cart.map((x) =>
        x._id === product._id ? { ...x, qty: x.qty + 1 } : x
      );
    } else {
      newCart = [...cart, { ...product, qty: 1, size: "M" }];
    }
    
    updateCartAndSync(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((x) => x._id !== id);
    updateCartAndSync(newCart);
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    const newCart = cart.map(item => 
      item._id === id ? { ...item, qty: newQty } : item
    );
    updateCartAndSync(newCart);
  };

  const clearCart = () => {
    updateCartAndSync([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
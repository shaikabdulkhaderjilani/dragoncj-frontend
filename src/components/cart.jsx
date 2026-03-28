import React, { useContext } from 'react'; // 1. useContext import
import { CartContext } from './CartContext'; // 2. Context import
import Navbar from './Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

const Cart = () => {
  // --- 🔥 REAL DATA CONNECTION ---
  const { cart, removeFromCart, updateQty } = useContext(CartContext);

  // 🔥 Navbar లో లాగానే ఇక్కడ కూడా టోటల్ క్వాంటిటీ కాలిక్యులేట్ చేస్తున్నాం
  const totalItemsCount = cart.reduce((total, item) => total + item.qty, 0); 

  // Calculations (Based on Real Data)
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 1999 ? 0 : 59; // Logic: 2000 పైన free shipping
  const total = subtotal + shipping;

  // --- YOUR STYLES (UNCHANGED) ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');

    :root {
      --dragon-red: #D90429;
      --pure-black: #000000;
      --border-color: #333;
    }

    body { background-color: var(--pure-black); color: #fff; font-family: 'Rajdhani', sans-serif; }
    h1, h2, h3, h4, h5 { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; }

    /* --- CART ITEMS --- */
    .cart-item-row {
        border: 1px solid var(--border-color);
        background: #080808;
        margin-bottom: 20px;
        position: relative;
        transition: 0.3s;
    }
    .cart-item-row:hover { border-color: #555; }

    .cart-img {
        width: 120px; height: 160px; object-fit: cover;
        border-right: 1px solid var(--border-color);
    }

    .remove-btn {
        background: transparent; border: none; color: #555; font-size: 1.2rem;
        transition: 0.3s;
    }
    .remove-btn:hover { color: var(--dragon-red); }

    /* --- QUANTITY CONTROLS --- */
    .qty-control-box {
        display: flex; border: 1px solid #444; width: fit-content;
    }
    .qty-btn-small {
        background: transparent; border: none; color: white; width: 30px; height: 30px;
        display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    .qty-btn-small:hover { background: #222; color: var(--dragon-red); }
    .qty-display {
        width: 30px; text-align: center; border-left: 1px solid #444; border-right: 1px solid #444;
        background: transparent; color: white; border-top: none; border-bottom: none;
        font-size: 0.9rem; line-height: 30px;
    }

    /* --- ORDER SUMMARY --- */
    .summary-card {
        border: 1px solid var(--border-color);
        background: #080808;
        padding: 30px;
        position: sticky; top: 100px;
    }

    .checkout-btn {
        background: var(--dragon-red); color: white; width: 100%; height: 50px;
        border: none; font-weight: bold; font-family: 'Oswald'; font-size: 1.2rem; letter-spacing: 1px;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 100%, 0 80%);
        transition: 0.3s;
    }
    .checkout-btn:hover { background: #ff0033; box-shadow: 0 0 15px var(--dragon-red); }

    .promo-input {
        background: transparent; border: 1px solid var(--border-color); color: white;
        padding: 10px; width: 100%;
    }
    .promo-input:focus { outline: none; border-color: var(--dragon-red); }

    .empty-cart-box {
        text-align: center; padding: 80px 20px; border: 1px dashed #333;
    }
  `;

  return (
    <div className="min-vh-100">
      <style>{styles}</style>
      <Navbar /> 

      <div className="container" style={{marginTop: '100px'}}>
        
        {/* HEADER AREA */}
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
            {/* 🔥 cart.length తీసేసి totalItemsCount పెట్టాం */}
            <h1 className="mb-0 border-start border-4 border-danger ps-3">YOUR LOADOUT ({totalItemsCount})</h1>
            <Link to="/" className="btn btn-outline-secondary rounded-0 text-white border-secondary small fw-bold">
                <i className="bi bi-arrow-left me-2"></i> CONTINUE SHOPPING
            </Link>
        </div>

        {cart.length === 0 ? (
            // EMPTY STATE
            <div className="empty-cart-box">
                <i className="bi bi-cart-x display-1 text-secondary mb-3"></i>
                <h3 className="text-white">YOUR STASH IS EMPTY</h3>
                <p className="text-white-50 mb-4">Looks like you haven't geared up yet.</p>
                <Link to="/shop" className="btn btn-outline-danger rounded-0 px-4 py-2 fw-bold">GO TO ARMORY</Link>
            </div>
        ) : (
            // CART CONTENT
            <div className="row g-5">
                
                {/* LEFT: CART ITEMS */}
                <div className="col-lg-8">
                    {cart.map(item => (
                        <div className="cart-item-row d-flex align-items-center" key={item._id}>
                            <img src={item.img} className="cart-img" alt={item.name}/>
                            
                            <div className="p-3 w-100">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="mb-1 fw-bold">{item.name}</h5>
                                        <p className="text-white-50 small mb-2">SIZE: {item.size || 'M'}</p>
                                        
                                        {/* QUANTITY CONTROLS */}
                                        <div className="qty-control-box">
                                            <button className="qty-btn-small" onClick={() => updateQty(item._id, item.qty - 1)}>-</button>
                                            <div className="qty-display">{item.qty}</div>
                                            <button className="qty-btn-small" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-end mt-2">
                                    <span className="text small">Unit Price: ₹{item.price}</span>
                                    <span className="text-danger fw-bold fs-4">₹{item.price * item.qty}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <div className="col-lg-4">
                    <div className="summary-card">
                        <h4 className="mb-4 pb-2 border-bottom border-secondary">ORDER SUMMARY</h4>
                        
                        <div className="d-flex justify-content-between mb-2 text-white-50">
                            <span>Subtotal</span>
                            <span className="text-white">₹{subtotal}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4 text-white-50">
                            <span>Shipping</span>
                            <span className={shipping === 0 ? "text-success fw-bold" : "text-white"}>
                                {shipping === 0 ? "FREE" : `₹${shipping}`}
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="small text-white-50 mb-2">PROMO CODE</p>
                            <div className="input-group">
                                <input type="text" className="promo-input" placeholder="ENTER CODE" />
                                <button className="btn btn-outline-secondary rounded-0 text-white border-secondary">APPLY</button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mb-4 pt-3 border-top border-secondary">
                            <span className="fs-5 fw-bold">TOTAL</span>
                            <span className="fs-4 fw-bold text-danger">₹{total}</span>
                        </div>

                        <button className="checkout-btn p-0">
                          <Link to="/checkout" className="text-decoration-none text-white d-block w-100 h-100 d-flex align-items-center justify-content-center">  
                            PROCEED TO CHECKOUT
                          </Link>
                        </button>
                        
                        <div className="mt-3 text-center">
                            <p className="text-white-50 x-small mb-0"><i className="bi bi-shield-lock-fill"></i> SECURE CHECKOUT</p>
                        </div>
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
import React, { useEffect } from 'react';
import Navbar from './Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state; 

  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  const { orderId, items, totalAmount, shipping, address, method } = orderData;
  const date = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  
  // 🔥 FEATURE 1: Expected Delivery Date (ఒక 5 రోజులు కలుపుతున్నాం)
  const deliveryDateObj = new Date();
  deliveryDateObj.setDate(deliveryDateObj.getDate() + 5);
  const expectedDelivery = deliveryDateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  // 🔥 FEATURE 2: Dragon Points Earned (నువ్వు సెట్ చేసిన 0.01 (1%) ప్రకారం)
  const earnedPoints = Math.floor(totalAmount * 0.01);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');

    :root {
      --dragon-red: #D90429;
      --pure-black: #000000;
      --border-color: #333;
      --success-green: #28a745;
    }

    body { background-color: var(--pure-black); color: #fff; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }
    h1, h2, h3 { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 2px; }

    @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); } 70% { box-shadow: 0 0 0 20px rgba(40, 167, 69, 0); } 100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); } }
    @keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

    .success-card {
        background: #080808; border: 1px solid var(--border-color);
        padding: 50px 40px; position: relative; max-width: 600px; margin: 0 auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        animation: slideUp 0.8s ease-out forwards; 
    }
    
    .success-card::before {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px;
        background: var(--success-green); box-shadow: 0 0 15px var(--success-green);
    }

    .check-circle {
        width: 80px; height: 80px; border-radius: 50%; border: 2px solid var(--success-green);
        display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
        color: var(--success-green); font-size: 2.5rem; animation: pulse-green 2s infinite; 
    }

    .receipt-box {
        background: #111; border: 1px dashed #444; padding: 25px;
        font-family: 'Share Tech Mono', monospace; color: #ccc; margin-top: 30px;
        text-align: left; position: relative; overflow: hidden;
    }
    
    .scanner-line {
        position: absolute; left: 0; width: 100%; height: 2px;
        background: rgba(40, 167, 69, 0.8); box-shadow: 0 0 10px rgba(40, 167, 69, 0.8);
        animation: scan 3s linear infinite;
    }

    .receipt-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; }
    .receipt-divider { border-bottom: 1px dashed #444; margin: 15px 0; }

    /* 🔥 NEW: Barcode Style */
    .barcode-bg {
        height: 40px; width: 100%; margin-top: 20px; opacity: 0.6;
        background-image: repeating-linear-gradient(to right, #fff 0, #fff 2px, transparent 2px, transparent 4px, #fff 4px, #fff 5px, transparent 5px, transparent 8px, #fff 8px, #fff 12px, transparent 12px, transparent 14px);
    }

    /* 🔥 NEW: Tracker Steps */
    .step-indicator {
        width: 15px; height: 15px; border-radius: 50%; background: #333; z-index: 2; position: relative;
    }
    .step-indicator.active { background: var(--success-green); box-shadow: 0 0 10px var(--success-green); }
    
    .action-btn {
        padding: 12px 30px; font-family: 'Oswald'; letter-spacing: 1px; transition: 0.3s; 
        text-decoration: none; display: inline-block; width: 48%; text-align: center; font-weight: bold;
    }
    .home-btn { background: transparent; color: white; border: 1px solid #555; }
    .home-btn:hover { background: white; color: black; border-color: white; }
    .track-btn { background: var(--dragon-red); color: white; border: 1px solid var(--dragon-red); }
    .track-btn:hover { background: #ff0033; box-shadow: 0 0 20px var(--dragon-red); color: white; }
  `;

  return (
    <div className="min-vh-100 d-flex flex-column pb-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(40, 167, 69, 0.05) 0%, transparent 50%)' }}>
      <style>{styles}</style>
      <Navbar cartCount={0} />

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center" style={{marginTop: '100px'}}>
        
        <div className="success-card w-100">
            
            <div className="text-center">
                <div className="check-circle">
                    <i className="bi bi-check-lg"></i>
                </div>
                <h1 className="text-white mb-1">MISSION SECURED</h1>
                <p className="text-white-50 mb-4 small">Target acquired. Your gear is being prepped for deployment.</p>
            </div>

            {/* 🔥 FEATURE 3: Live Tracker Visual 🔥 */}
            <div className="position-relative my-4" style={{width: '80%', margin: '0 auto'}}>
                <div className="position-absolute top-50 start-0 w-100 bg-secondary" style={{height: '2px', zIndex: 1, transform: 'translateY(-50%)'}}></div>
                <div className="position-absolute top-50 start-0 bg-success" style={{height: '2px', width: '25%', zIndex: 1, transform: 'translateY(-50%)'}}></div>
                <div className="d-flex justify-content-between position-relative" style={{zIndex: 2}}>
                    <div className="d-flex flex-column align-items-center">
                        <div className="step-indicator active"></div>
                        <span className="text-success mt-2" style={{fontSize: '0.7rem', fontFamily: 'Oswald', letterSpacing: '1px'}}>PLACED</span>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <div className="step-indicator active" style={{opacity: 0.5}}></div>
                        <span className="text-white-50 mt-2" style={{fontSize: '0.7rem', fontFamily: 'Oswald', letterSpacing: '1px'}}>PREPPING</span>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <div className="step-indicator"></div>
                        <span className="text-white-50 mt-2" style={{fontSize: '0.7rem', fontFamily: 'Oswald', letterSpacing: '1px'}}>SHIPPED</span>
                    </div>
                </div>
            </div>

            <div className="receipt-box">
                <div className="scanner-line"></div>

                <div className="receipt-row">
                    <span>ORDER ID:</span>
                    <span className="text-white">{orderId.slice(-6).toUpperCase()}</span>
                </div>
                <div className="receipt-row">
                    <span>DATE:</span>
                    <span>{date}</span>
                </div>
                <div className="receipt-row">
                    <span>EXPECTED DROP:</span>
                    <span className="text-info">{expectedDelivery}</span>
                </div>
                
                <div className="receipt-divider"></div>

                {items.map((item, index) => (
                    <div className="receipt-row" key={index}>
                        <span>{item.name} <span className="text-secondary">(x{item.qty})</span></span>
                        <span>₹{item.price * item.qty}</span>
                    </div>
                ))}
                
                <div className="receipt-divider"></div>
                
                <div className="receipt-row mb-1">
                    <span>SUBTOTAL</span>
                    <span>₹{totalAmount - shipping}</span>
                </div>
                <div className="receipt-row">
                    <span>SHIPPING ({method === 'Online Payment' ? 'PREPAID' : 'COD'})</span>
                    <span className={shipping === 0 ? "text-success" : ""}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-row fw-bold text-white fs-4 align-items-center">
                    <span>TOTAL</span>
                    <span className="text-danger">₹{totalAmount}</span>
                </div>

                {/* 🔥 FEATURE 4: Dragon Points Earned 🔥 */}
                <div className="text-end mt-1">
                    <span className="badge bg-danger text-black font-oswald" style={{letterSpacing: '1px'}}>
                        +{earnedPoints} DRAGON POINTS EARNED
                    </span>
                </div>

                <div className="receipt-divider"></div>

                {/* 🔥 FEATURE 5: Customer Intel (User Details) 🔥 */}
                <div>
                    <span className="text-white-50" style={{fontSize: '0.8rem', display: 'block', marginBottom: '8px'}}>CUSTOMER INTEL:</span>
                    <div style={{fontSize: '0.85rem', lineHeight: '1.4', color: '#bbb'}}>
                        <span className="text-white fw-bold">{address.firstName} {address.lastName}</span><br/>
                        {address.address}, {address.city}, {address.state} - {address.pincode}<br/>
                        <i className="bi bi-telephone-fill me-2 mt-1"></i>{address.phone}<br/>
                        <i className="bi bi-envelope-fill me-2"></i>{address.email}
                    </div>
                </div>

                {/* 🔥 FEATURE 1: Barcode Component 🔥 */}
                <div className="barcode-bg"></div>
                <div className="text-center mt-1 text-white-50" style={{fontSize: '0.6rem', letterSpacing: '4px'}}>
                    {orderId.toUpperCase()}
                </div>

            </div>

            <div className="mt-4 d-flex justify-content-between">
                <Link to="/profile" className="action-btn home-btn">
                    DASHBOARD
                </Link>
                <Link to="/shop" className="action-btn track-btn">
                    CONTINUE
                </Link>
            </div>
            
            <div className="mt-4 text-center text-white-50 x-small font-oswald" style={{letterSpacing: '1px'}}>
                <i className="bi bi-shield-check text-success me-1"></i> ENCRYPTED & SECURED
            </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state; 

  // --- 🔥 Modal States ---
  const [modalType, setModalType] = useState(null); // 'support', 'cancel', 'dispute'
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!order) {
      navigate('/profile');
    }
  }, [order, navigate]);

  if (!order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  const shippingFee = order.totalAmount > 1999 ? 0 : 59;
  const subtotal = order.totalAmount - shippingFee;
  const statusLevels = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
  const currentLevel = statusLevels.indexOf(order.status);

  // --- 🔥 Action Handler ---
  const handleActionSubmit = async () => {
    if (modalType === 'cancel') {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/status/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'Cancelled',
                    cancelReason: reason,
                    cancelDetails: description 
                })
            });
            if (response.ok) {
                alert("Mission Aborted! Order Cancelled successfully.");
                navigate('/profile');
            }
        } catch (error) {
            alert("Database connection failed. Try again.");
        }
    } else {
        // Support & Dispute Logic
        alert(`${modalType.toUpperCase()} Request Submitted!\nReason: ${reason}`);
    }
    setModalType(null);
    setReason("");
    setDescription("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(order._id);
    alert("Order ID Copied! 📋");
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');
    :root { --dragon-red: #D90429; --glass-bg: rgba(10, 10, 10, 0.95); --border-color: #222; }
    body { background-color: #000; color: #fff; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }
    h1, h2, h3, h4, h5, .brand-font { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 2px; }

    .map-container { height: 350px; width: 100%; background-color: #080808; position: relative; overflow: hidden; border-bottom: 3px solid var(--dragon-red); }
    .map-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg'); background-size: cover; background-position: center; filter: invert(1) brightness(20) opacity(0.3); transform: scale(1.2); }
    .map-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgb(56, 53, 53) 20%, rgba(0, 0, 0, 0.6) 50%, rgba(250, 0, 0, 0.2) 100%); z-index: 1; }
    .map-pulse { position: absolute; top: 35%; left: 70%; width: 18px; height: 18px; background: var(--dragon-red); border-radius: 50%; box-shadow: 0 0 20px var(--dragon-red); animation: pulse 2s infinite; z-index: 2; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(217, 4, 41, 0.8); } 70% { box-shadow: 0 0 0 25px rgba(217, 4, 41, 0); } 100% { box-shadow: 0 0 0 0 rgba(217, 4, 41, 0); } }

    .timeline { position: relative; border-left: 2px solid #222; margin-left: 10px; padding-left: 30px; }
    .timeline-item { position: relative; margin-bottom: 40px; }
    .timeline-dot { position: absolute; left: -36px; top: 0; width: 14px; height: 14px; background: #000; border: 2px solid #444; border-radius: 50%; z-index: 2; }
    .timeline-item.completed .timeline-dot { background: var(--dragon-red); border-color: var(--dragon-red); box-shadow: 0 0 10px var(--dragon-red); }
    .timeline-item.completed::before { content: ''; position: absolute; left: -32px; top: 0; height: 140%; width: 2px; background: var(--dragon-red); z-index: 1; }
    
    .detail-card { background: var(--glass-bg); border: 1px solid var(--border-color); padding: 25px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .item-row { display: flex; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 15px; }
    .item-img { width: 65px; height: 65px; object-fit: cover; border: 1px solid #333; }
    
    .btn-help { border: 1px solid #333; color: #aaa; width: 100%; padding: 12px; background: transparent; transition: 0.3s; font-family: 'Oswald'; font-size: 0.85rem; text-transform: uppercase; cursor: pointer; }
    .btn-help:hover { border-color: var(--dragon-red); color: #fff; background: rgba(217, 4, 41, 0.05); }

    /* Modal Styles */
    .action-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justifyContent: center; padding: 20px; backdrop-filter: blur(5px); }
    .modal-content-box { max-width: 500px; width: 100%; background: #0a0a0a; border: 1px solid #333; padding: 30px; }
    .modal-input { width: 100%; background: #000; border: 1px solid #333; color: #fff; padding: 10px; margin-bottom: 15px; font-family: 'Rajdhani'; }
  `;

  return (
    <div className="min-vh-100 pb-5">
      <style>{styles}</style>
      <Navbar cartCount={0} />

      {/* --- ACTION MODAL --- */}
      {modalType && (
        <div className="action-modal-overlay">
            <div className="modal-content-box" style={{ borderTop: `4px solid ${modalType === 'support' ? '#555' : '#D90429'}` }}>
                <h3 className="brand-font mb-4">{modalType === 'support' ? 'Support Ticket' : modalType === 'cancel' ? 'Abort Mission' : 'Report Dispute'}</h3>
                
                <p className="small text-white-50 mb-2">REASON FOR {modalType.toUpperCase()}</p>
                <select className="modal-input" value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option value="">-- Select Reason --</option>
                    {modalType === 'support' && <>
                        <option>Delivery Delay</option>
                        <option>Product Information</option>
                        <option>Payment Issue</option>
                    </>}
                    {modalType === 'cancel' && <>
                        <option>Ordered by mistake</option>
                        <option>Delivery time too long</option>
                        <option>Found better price elsewhere</option>
                        <option>Technical issue</option>
                    </>}
                    {modalType === 'dispute' && <>
                        <option>Package Tampered</option>
                        <option>Item not as described</option>
                        <option>Unauthorized Transaction</option>
                    </>}
                </select>

                <p className="small text-white-50 mb-2">ADDITIONAL DETAILS</p>
                <textarea className="modal-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Type here..."></textarea>

                <div className="d-flex gap-2 mt-2">
                    <button className="btn-help w-50" onClick={() => setModalType(null)}>CLOSE</button>
                    <button 
                        className="btn-help w-50 bg-danger text-white border-danger" 
                        onClick={handleActionSubmit}
                        disabled={!reason}
                    >
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 1. MAP HEADER */}
      <div className="map-container">
        <div className="map-bg"></div>
        <div className="map-overlay"></div>
        <div className="map-pulse"></div>
        
        <div className="position-absolute bottom-0 start-0 p-5 w-100" style={{ zIndex: 5 }}>
            <Link to="/profile" className="text-danger text-decoration-none mb-3 d-inline-block small fw-bold" style={{letterSpacing: '3px'}}>
                <i className="bi bi-chevron-left"></i> RETURN TO ARMORY
            </Link>
            
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end">
                <div>
                    <h1 className="brand-font text-white display-3 mb-0" style={{textShadow: '0 0 30px rgba(217,4,41,0.5)', lineHeight: '0.9'}}>
                        MISSION: <span className="text-danger">{order.status}</span>
                    </h1>
                    <p className="text-white-50 mt-2 mb-0 copy-id" onClick={copyToClipboard} style={{fontFamily: 'monospace', fontSize: '1.1rem'}}>
                        TRACKING_ID: <span className="text-white border-bottom border-danger">{order._id.toUpperCase()}</span> <i className="bi bi-copy ms-2"></i>
                    </p>
                </div>
                <div className="mt-3 mt-md-0">
                   <div className="px-3 py-1 border border-danger text-danger small fw-bold mb-1" style={{letterSpacing: '2px', background: 'rgba(217,4,41,0.1)'}}>
                      <i className="bi bi-broadcast me-2"></i>SIGNAL ACTIVE
                   </div>
                   <p className="text-white-50 small mb-0 text-md-end">EST. ARRIVAL: 5 DAYS</p>
                </div>
            </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row g-4">
            <div className="col-lg-7">
                <div className="detail-card">
                    <h4 className="brand-font mb-4 text-white-50">MISSION PROGRESS LOG</h4>
                    <div className="timeline">
                        {statusLevels.slice(0, 4).map((lvl, idx) => (
                            <div key={idx} className={`timeline-item ${currentLevel >= idx ? 'completed' : ''}`}>
                                <div className="timeline-dot"></div>
                                <h6 className="mb-0 text-white text-uppercase">{lvl}</h6>
                                <p className="text-white-50 x-small">{idx === 0 ? orderDate : ''} {currentLevel >= idx ? '// SECURED' : '// PENDING'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="detail-card">
                    <h5 className="brand-font mb-4">CARGO MANIFEST</h5>
                    {order.items.map((item, index) => (
                        <div className="item-row align-items-center" key={index}>
                            <img src={item.img} className="item-img" alt={item.name} />
                            <div className="flex-grow-1">
                                <h6 className="mb-0 text-white">{item.name}</h6>
                                <p className="text-white-50 small mb-0">QTY: {item.qty} | UNIT: ₹{item.price}</p>
                            </div>
                            <div className="text-end">
                                <span className="text-white fw-bold">₹{item.price * item.qty}</span>
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-4 pt-3 border-top border-secondary">
                        <div className="d-flex justify-content-between small mb-2">
                            <span className="text-white-50">CARGO SUBTOTAL</span>
                            <span className="text-white">₹{subtotal}</span>
                        </div>
                        <div className="d-flex justify-content-between small mb-3">
                            <span className="text-white-50">DEPLOYMENT FEE</span>
                            <span className={shippingFee === 0 ? "text-success fw-bold" : "text-white"}>
                                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between pt-3 border-top border-danger">
                            <span className="text-white-50 brand-font">TOTAL SETTLEMENT</span>
                            <span className="text-danger fw-bold fs-3">₹{order.totalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-5">
                <div className="detail-card">
                    <h5 className="brand-font mb-3 text-white-50">DROP ZONE INTEL</h5>
                    <p className="fw-bold text-white mb-1 text-uppercase">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p className="text-white-50 small mb-0 lh-lg">
                        {order.shippingAddress.address}, {order.shippingAddress.city}<br/>
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}<br/>
                        <span className="text-white"><i className="bi bi-telephone-outbound me-2 text-danger"></i>{order.shippingAddress.phone}</span>
                    </p>
                    
                    <h5 className="brand-font mb-3 text-white-50 mt-4">PAYMENT PROTOCOL</h5>
                    <div className="p-3 bg-black border border-secondary d-flex align-items-center">
                        <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                             <i className="bi bi-shield-lock-fill text-black"></i>
                        </div>
                        <div>
                            <p className="text-white mb-0 small fw-bold">{order.paymentMethod?.toUpperCase()}</p>
                            <p className="text-danger x-small mb-0 fw-bold" style={{letterSpacing: '1px'}}>VERIFIED TRANSACTION</p>
                        </div>
                    </div>
                </div>

                <div className="detail-card text-center">
                    <h5 className="brand-font mb-3">COMMAND CENTER</h5>
                    <p className="small text-white-50 mb-4">Any logistical issues? Contact base immediately.</p>
                    
                    <button className="btn-help mb-3" onClick={() => setModalType('support')}>
                        <i className="bi bi-chat-left-dots me-2"></i> OPEN SUPPORT TICKET
                    </button>

                    {(order.status === 'Placed' || order.status === 'Processing') && (
                        <button className="btn-help text-danger border-danger mb-3" onClick={() => setModalType('cancel')}>
                            <i className="bi bi-slash-circle me-2"></i> ABORT MISSION (CANCEL)
                        </button>
                    )}

                    <button className="btn-help text-secondary border-secondary small" style={{fontSize: '0.7rem'}} onClick={() => setModalType('dispute')}>
                        <i className="bi bi-shield-exclamation me-2"></i> REPORT DISPUTE
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
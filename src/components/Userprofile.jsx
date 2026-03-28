import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; 
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UserProfile = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); 
  const [orders, setOrders] = useState([]); 
  const [isFetching, setIsFetching] = useState(true);

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('dragonUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser); 
      
      const loadDataInBackground = async () => {
          try {
              await fetchUserData(parsedUser.email);
              await fetchOrders(parsedUser.email);
          } catch (error) {
              console.error("Data load failed:", error);
          } finally {
              setIsFetching(false); 
          }
      };
      
      loadDataInBackground();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${email}`);
      if (response.ok) {
          const data = await response.json();
          setDbUser(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchOrders = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${email}`);
      if (response.ok) {
          const data = await response.json();
          setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const viewOrderDetails = (order) => {
    navigate('/order-details', { state: order });
  };

  // 🔥 UPDATE CHESINA CODE IDHE (Cart Clear Logic added) 🔥
  const handleLogout = () => {
    localStorage.removeItem('dragonUser');
    localStorage.removeItem('dragonCart'); 
    window.location.href = '/'; 
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, ...pwdData })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("🔥 Password Changed Successfully!");
        setShowPwdModal(false);
        setPwdData({ oldPassword: '', newPassword: '' });
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Server Error!");
    }
  };

  const calculatedPoints = orders.reduce((total, order) => {
    return total + Math.floor(order.totalAmount * 0.01);
  }, 0);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');

    :root {
      --dragon-red: #D90429;
      --gold-elite: #FFD700; 
      --glass-bg: rgba(25, 25, 25, 0.6);
      --glass-border: rgba(255, 255, 255, 0.1);
    }

    body { background-color: #050505; color: #fff; font-family: 'Rajdhani', sans-serif; }
    h1, h2, h3, h5, .brand-font { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 2px; }

    .premium-bg { background-image: radial-gradient(circle at 10% 20%, rgba(217, 4, 41, 0.1) 0%, transparent 20%); min-height: 100vh; }

    .elite-card { background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0, 0, 0, 0.8)); border: 1px solid var(--gold-elite); padding: 25px; position: relative; overflow: hidden; box-shadow: 0 0 20px rgba(255, 215, 0, 0.15); transition: 0.3s; }
    .elite-card:hover { transform: translateY(-5px); box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
    .elite-title { color: var(--gold-elite); font-family: 'Oswald'; letter-spacing: 3px; font-size: 1.5rem; text-shadow: 0 0 10px var(--gold-elite); }
    .elite-badge { background: var(--gold-elite); color: black; font-weight: bold; padding: 2px 10px; font-size: 0.7rem; font-family: 'Oswald'; }

    .order-item { background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; transition: 0.3s; }
    .order-item:hover { border-color: var(--dragon-red); background: rgba(40, 40, 40, 0.8); }
    .order-img { width: 80px; height: 80px; object-fit: cover; border: 1px solid #444; }
    .status-text { font-size: 0.8rem; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
    .status-Shipped { color: #FFA500; } 
    .status-Delivered { color: #00FF00; } 
    .status-Processing { color: #0dcaf0; } 
    
    .btn-track { border: 1px solid var(--glass-border); color: white; background: transparent; padding: 8px 20px; font-size: 0.8rem; transition: 0.3s; font-family: 'Oswald'; cursor: pointer; }
    .btn-track:hover { border-color: white; background: white; color: black; }

    .btn-logout { border: 1px solid var(--dragon-red); color: var(--dragon-red); background: transparent; padding: 10px 30px; font-family: 'Oswald'; text-transform: uppercase; letter-spacing: 2px; transition: 0.3s; font-weight: bold; width: 100%; margin-top: 15px; }
    .btn-logout:hover { background: var(--dragon-red); color: white; box-shadow: 0 0 15px rgba(217, 4, 41, 0.5); }
    
    .btn-reset { border: 1px solid #555; color: #aaa; background: transparent; padding: 10px 30px; font-family: 'Oswald'; text-transform: uppercase; letter-spacing: 2px; transition: 0.3s; font-weight: bold; width: 100%; margin-top: 10px; }
    .btn-reset:hover { border-color: white; color: white; background: rgba(255,255,255,0.1); }

    .profile-section { text-align: center; margin-bottom: 30px; }
    .avatar-glow { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--dragon-red); box-shadow: 0 0 20px rgba(217, 4, 41, 0.4); margin-bottom: 15px; }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
    .dragon-modal { background: #0a0a0a; border: 1px solid #333; padding: 30px; width: 90%; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.9); }
    .dragon-input { background: transparent; border: 1px solid #444; color: white; padding: 10px; width: 100%; margin-bottom: 15px; font-family: 'Rajdhani'; }
    .dragon-input:focus { outline: none; border-color: var(--dragon-red); }

    @media (max-width: 768px) { .order-item { flex-direction: column; text-align: left; align-items: flex-start; } .order-img { margin-bottom: 15px; width: 100%; height: 150px; } .btn-track { width: 100%; margin-top: 10px; text-align: center; } }
  `;

  if (!user) return null; 

  return (
    <div className="premium-bg">
      <style>{styles}</style>
      <Navbar />

      {showPwdModal && (
        <div className="modal-overlay">
          <div className="dragon-modal border-top border-4 border-danger">
            <div className="d-flex justify-content-between mb-4">
              <h4 className="brand-font m-0">SECURITY KEY UPDATE</h4>
              <i className="bi bi-x-lg text-secondary" style={{cursor: 'pointer'}} onClick={() => setShowPwdModal(false)}></i>
            </div>
            <form onSubmit={handlePasswordReset}>
              <input type="password" placeholder="CURRENT PASSWORD" required className="dragon-input" 
                     value={pwdData.oldPassword} onChange={(e) => setPwdData({...pwdData, oldPassword: e.target.value})} />
              <input type="password" placeholder="NEW PASSWORD" required className="dragon-input" 
                     value={pwdData.newPassword} onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})} />
              <button type="submit" className="btn btn-danger w-100 rounded-0 font-oswald mt-2">UPDATE PROTOCOL</button>
            </form>
          </div>
        </div>
      )}

      <div className="container" style={{paddingTop: '120px', paddingBottom: '100px'}}>
        <div className="row g-5">
            
            <div className="col-lg-4">
                
                <div className="profile-section">
                    <img src="https://secure.gravatar.com/avatar/ade92c42d3856d9536d29994c9f13110?s=200&d=wavatar" alt="User" className="avatar-glow" />
                    <h2 className="brand-font mb-0">{user.name}</h2>
                    <p className="text-white-50 small mb-1">{user.email}</p>
                    <p className="text-white-50 small" style={{fontFamily: 'monospace'}}>STATUS: <span className="text-success">VERIFIED</span></p>
                </div>

                {!dbUser ? (
                    <div className="elite-card mb-4 text-center py-4" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.8))', borderColor: '#444' }}>
                        <div className="spinner-border text-secondary spinner-border-sm mb-2"></div>
                        <p className="text-white-50 small m-0" style={{fontFamily: 'Oswald'}}>FETCHING CLAN STATUS...</p>
                    </div>
                ) : dbUser.isElite ? (
                    <div className="elite-card mb-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <i className="bi bi-gem fs-3" style={{color: '#FFD700'}}></i>
                            <span className="elite-badge">ACTIVE</span>
                        </div>
                        <h3 className="elite-title mb-1">ELITE MEMBER</h3>
                        <p className="text-white-50 small mb-4" style={{fontSize: '0.8rem'}}>PLAN: TITANIUM YEARLY</p>
                        <div className="border-top border-secondary pt-3">
                            <div className="d-flex justify-content-between text-white-50 small" style={{fontFamily: 'monospace'}}>
                                <span>VALID THRU</span>
                                <span style={{color: '#FFD700'}}>
                                  {dbUser.eliteValidThru ? new Date(dbUser.eliteValidThru).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="elite-card mb-4" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.8))', borderColor: '#444', boxShadow: 'none' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <i className="bi bi-gem fs-3 text-secondary"></i>
                            <span className="elite-badge" style={{ background: '#444', color: '#fff' }}>INACTIVE</span>
                        </div>
                        <h3 className="elite-title mb-1 text-white" style={{ textShadow: 'none' }}>STANDARD MEMBER</h3>
                        <p className="text-white-50 small mb-4" style={{fontSize: '0.8rem'}}>NO ACTIVE SUBSCRIPTION</p>
                        <div className="border-top border-secondary pt-3 text-center">
                           <button onClick={() => navigate('/elite')} className="btn btn-sm w-100" style={{background: '#FFD700', color: 'black', fontWeight: 'bold', fontFamily: 'Oswald'}}>UPGRADE TO ELITE</button>
                        </div>
                    </div>
                )}

                <div className="row g-2 text-center mb-4">
                    <div className="col-6">
                        <div className="p-3 border border-secondary bg-black">
                            <h3 className="brand-font mb-0 text-white">{isFetching ? '-' : orders.length}</h3>
                            <small className="text-white-50">TOTAL ORDERS</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-3 border border-secondary bg-black">
                            <h3 className="brand-font mb-0 text-danger">{isFetching ? '-' : calculatedPoints}</h3>
                            <small className="text-white-50">DRAGON POINTS</small>
                        </div>
                    </div>
                </div>

                <button className="btn-logout" onClick={handleLogout}>
                   <i className="bi bi-box-arrow-right me-2"></i> TERMINATE SESSION
                </button>
                
                <button className="btn-reset" onClick={() => setShowPwdModal(true)}>
                   <i className="bi bi-shield-lock me-2"></i> CHANGE PASSWORD
                </button>

            </div>

            <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                    <h3 className="brand-font m-0 text-white">ORDER HISTORY</h3>
                    {orders.length > 0 && <button className="btn btn-sm btn-outline-secondary rounded-0 text-white">DOWNLOAD INVOICES</button>}
                </div>

                {isFetching ? (
                    <div className="text-center p-5 border border-secondary bg-black">
                        <div className="spinner-border text-danger mb-3" role="status"></div>
                        <h5 className="text-white-50 font-oswald">FETCHING VAULT DATA...</h5>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center p-5 border border-secondary bg-black">
                        <h5 className="text-white-50">NO ORDERS FOUND</h5>
                        <button onClick={() => navigate('/shop')} className="btn btn-outline-danger mt-3 rounded-0 font-oswald">GO TO ARMORY</button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div className="order-item" key={order._id}>
                            <div className="d-flex gap-3 align-items-center w-100">
                                <img src={order.items[0]?.img || "https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?q=80&w=200"} className="order-img" alt="Product" />
                                <div>
                                    <h5 className="mb-1 brand-font text-white">
                                        {order.items[0]?.name} {order.items.length > 1 && <span className="fs-6 text-white-50"> +{order.items.length - 1} more</span>}
                                    </h5>
                                    <p className="mb-1 small text-white-50" style={{fontFamily: 'monospace'}}>
                                        ORDER ID: {order._id.slice(-6).toUpperCase()} | {new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                    </p>
                                    <p className={`status-text status-${order.status} mb-0`}>
                                        ● {order.status}
                                    </p>
                                </div>
                            </div>

                            <div className="text-md-end mt-3 mt-md-0" style={{minWidth: '140px'}}>
                                <h4 className="brand-font text-white mb-2">₹{order.totalAmount}</h4>
                                <button className="btn-track w-100" onClick={() => viewOrderDetails(order)}>
                                    {order.status === 'Shipped' ? 'TRACK ORDER' : 'VIEW DETAILS'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
                
                {orders.length > 0 && !isFetching && (
                    <div className="text-center mt-4">
                        <p className="text-white-50 small">Showing recent {orders.length} orders</p>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
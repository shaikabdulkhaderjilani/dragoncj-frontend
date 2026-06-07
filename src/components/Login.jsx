import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import nab1 from '../images/NAB1.png'; 

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = Creds, 2 = OTP
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: Verify Password and Send OTP
  const handleVerifyCredentials = async (e) => {
    e.preventDefault(); 
    if (!formData.email || !formData.password) return alert("Email mariyu Password rendu fill chey mama!");

    setLoading(true);
    try {
      const response = await fetch('http://dragoncj-clothing-brand.onrender.com/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await response.json();
      if (response.ok) {
        setStep(2); // Move to OTP Box
      } else alert("Error: " + data.error);
    } catch (err) {
      alert("Server Error! Backend run avthundo ledo check chey.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Resend OTP Logic
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://dragoncj-clothing-brand.onrender.com/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await response.json();
      if (response.ok) {
        alert("🔥 Fresh Access Code sent to your email!");
      } else alert("Error: " + data.error);
    } catch (err) {
      alert("Server Error!");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Login
  const handleFinalLogin = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("OTP enter chey mama!");

    setLoading(true);
    try {
      const response = await fetch('http://dragoncj-clothing-brand.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('dragonUser', JSON.stringify(data.user));
        navigate('/shop'); 
      } else alert("Error: " + data.error);
    } catch (err) {
      alert("Server Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Oswald:wght@400;700&display=swap');
          .dragon-theme { color: rgba(255, 255, 255, 0.7) !important; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.9rem; }
          .dragon-theme input::placeholder { color: rgba(255, 255, 255, 0.4) !important; font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; }
          .custom-input-group { background-color: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s ease; }
          .custom-input-group:focus-within { border-color: #DC143C; box-shadow: 0 0 15px rgba(220, 20, 60, 0.2); background-color: rgba(20, 20, 20, 0.8); }
          .premium-login-btn { background: linear-gradient(45deg, #DC143C, #FF4D4D); border-radius: 12px; letter-spacing: 2px; font-weight: 700; box-shadow: 0 4px 20px rgba(220, 20, 60, 0.3); transition: all 0.3s ease; }
          .premium-login-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 30px rgba(220, 20, 60, 0.5); color: white !important; }
          .premium-login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
          .fire-pulse { background-color: rgba(220, 20, 60, 0.15); border-radius: 50%; animation: pulse-glow 2s infinite; }
          @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(220, 20, 60, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(220, 20, 60, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 20, 60, 0); } }
        `}
      </style>

      <div className="dragon-theme container-fluid min-vh-100 d-flex align-items-center justify-content-center" 
           style={{ backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.85), rgba(0, 0, 0, 0.95)), url(${nab1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        
        <div className="card border-0 p-4 p-md-5" 
             style={{ width: '100%', maxWidth: '480px', backgroundColor: 'rgba(15, 15, 15, 0.5)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.9)' }}>
          
          <div className="text-center mb-5 mt-2">
            <div className="d-inline-block p-3 mb-3 fire-pulse"><i className="bi bi-fire fs-2" style={{ color: '#DC143C' }}></i></div>
            <h3 className="fw-bolder text-white mb-1" style={{ letterSpacing: '3px', textTransform: 'uppercase' }}>DRAGON<span style={{ color: '#DC143C' }}>CJ</span></h3>
            <p className="small mt-2" style={{ color: '#888888', fontWeight: '500', letterSpacing: '1px' }}>
              {step === 1 ? "AUTHORIZE TO ACCESS VAULT" : "VERIFY SECURITY CODE"}
            </p>
          </div>

          <form onSubmit={step === 1 ? handleVerifyCredentials : handleFinalLogin}>
            {step === 1 ? (
              <>
                <div className="mb-4">
                  <div className="input-group custom-input-group">
                    <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-person-fill fs-5" style={{ color: '#DC143C' }}></i></span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2" placeholder="USERNAME OR EMAIL" style={{ outline: 'none', fontWeight: '500', fontFamily: 'Rajdhani' }} />
                  </div>
                </div>

                <div className="mb-2">
                   <div className="input-group custom-input-group">
                    <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-shield-lock-fill fs-5" style={{ color: '#DC143C' }}></i></span>
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2" placeholder="SECURITY KEY" style={{ outline: 'none', fontWeight: '500', fontFamily: 'Rajdhani' }} />
                    <span className="input-group-text bg-transparent border-0 px-3" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', color: '#888' }}><i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} fs-5 hover-white`}></i></span>
                  </div>
                </div>

                {/* 🔥 NEW: Forgot Password Link */}
                <div className="text-end mb-4">
                  <span onClick={() => alert("Forgot Password functionality coming soon! 🚀")} style={{ cursor: 'pointer', color: '#DC143C', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 'bold' }}>
                    FORGOT SECURITY KEY?
                  </span>
                </div>
              </>
            ) : (
              <div className="mb-4 text-center">
                <p className="text-success small fw-bold mb-3">OTP SENT TO {formData.email}</p>
                <div className="input-group custom-input-group mb-3">
                  <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-123 fs-5" style={{ color: '#DC143C' }}></i></span>
                  <input type="text" name="otp" value={formData.otp} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2 text-center fs-5" placeholder="ENTER 6-DIGIT OTP" style={{ outline: 'none', fontWeight: 'bold', fontFamily: 'Rajdhani', letterSpacing: '5px' }} />
                </div>
                
                {/* 🔥 NEW: Resend OTP Link */}
                <div className="mt-2">
                  <span style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    DIDN'T RECEIVE IT? <span onClick={handleResendOTP} style={{ cursor: 'pointer', color: '#DC143C', fontWeight: 'bold', borderBottom: '1px dashed #DC143C' }}>RESEND PROTOCOL</span>
                  </span>
                </div>
              </div>
            )}

            <div className="d-grid mb-4 mt-2">
              <button type="submit" disabled={loading} className="btn py-3 text-white border-0 premium-login-btn">
                {loading ? 'PROCESSING...' : (step === 1 ? 'INITIALIZE LOGIN' : 'VERIFY & ENTER')}
              </button>
            </div>

            <div className="text-center mt-3 mb-2">
              <p className="small mb-0" style={{ color: '#888', fontWeight: '400' }}>NO CLEARANCE YET? <br/>
                <a href="/signup" className="text-decoration-none mt-2 d-inline-block" style={{ color: '#DC143C', letterSpacing: '1.5px', fontWeight: '700', borderBottom: '1px dashed #DC143C' }}>JOIN THE CLAN</a>
              </p>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default Login;
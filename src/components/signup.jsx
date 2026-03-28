import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import nab1 from '../images/NAB1.png'; 

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Form, 2 = OTP

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 NEW: Password Strong vunda leda ani check chese function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // STEP 1: Form Validation & Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault(); 
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        return alert("All fields are required mama!");
    }
    
    // 🔥 NEW: Check Password Strength before sending OTP
    if (!validatePassword(formData.password)) {
        return alert("Password lo minimum 1 Capital letter, 1 Small letter, 1 Number, 1 Special Character, and 8 characters undali!");
    }

    if (formData.password !== formData.confirmPassword) {
        return alert("Passwords match avvatledu, check chesko!");
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      if (response.ok) {
        setStep(2); // Show OTP Box
      } else alert("Error: " + data.error);
    } catch (err) { alert("Server Error!"); } 
    finally { setLoading(false); }
  };

  // STEP 2: Verify OTP and Create Account
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("OTP kavali mama!");

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("🔥 " + data.message + " Now Login with your details.");
        navigate('/login'); 
      } else alert("Error: " + data.error);
    } catch (err) { alert("Server Error!"); }
    finally { setLoading(false); }
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

      <div className="dragon-theme container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5" 
           style={{ backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.85), rgba(0, 0, 0, 0.95)), url(${nab1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        
        <div className="card border-0 p-4 p-md-5 my-4" 
             style={{ width: '100%', maxWidth: '500px', backgroundColor: 'rgba(15, 15, 15, 0.5)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.9)' }}>
          
          <div className="text-center mb-4 mt-2">
            <div className="d-inline-block p-3 mb-3 fire-pulse"><i className="bi bi-shield-plus fs-2" style={{ color: '#DC143C' }}></i></div>
            <h3 className="fw-bolder text-white mb-1" style={{ letterSpacing: '3px', textTransform: 'uppercase' }}>JOIN THE <span style={{ color: '#DC143C' }}>CLAN</span></h3>
            <p className="small mt-2" style={{ color: '#888888', fontWeight: '500', letterSpacing: '1px' }}>
              {step === 1 ? "CREATE YOUR IDENTITY" : "VERIFY YOUR EMAIL"}
            </p>
          </div>

          <form onSubmit={step === 1 ? handleSendOtp : handleFinalSubmit}>
            {step === 1 ? (
              <>
                <div className="mb-3">
                  <div className="input-group custom-input-group">
                    <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-person-badge fs-5" style={{ color: '#DC143C' }}></i></span>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2" placeholder="FULL NAME" required style={{ outline: 'none', fontWeight: '500', fontFamily: 'Rajdhani' }} />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group custom-input-group">
                    <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-envelope-fill fs-5" style={{ color: '#DC143C' }}></i></span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2" placeholder="EMAIL ADDRESS" required style={{ outline: 'none', fontWeight: '500', fontFamily: 'Rajdhani' }} />
                  </div>
                </div>

                <div className="mb-3">
                   <div className="input-group custom-input-group">
                    <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-key-fill fs-5" style={{ color: '#DC143C' }}></i></span>
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2" placeholder="PASSWORD" required style={{ outline: 'none', fontWeight: '500', fontFamily: 'Rajdhani' }} />
                    <span className="input-group-text bg-transparent border-0 px-3" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', color: '#888' }}><i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} fs-5`}></i></span>
                  </div>
                  {/* 🔥 NEW: Helper Text for Password Requirement */}
                  <div className="text-white-50 mt-1" style={{fontSize: '0.7rem'}}>
                      * Must contain 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 chars long.
                  </div>
                </div>

                <div className="mb-4">
                   <div className="input-group custom-input-group">
                    <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-shield-check fs-5" style={{ color: '#DC143C' }}></i></span>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2" placeholder="CONFIRM PASSWORD" required style={{ outline: 'none', fontWeight: '500', fontFamily: 'Rajdhani' }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-4 text-center">
                <p className="text-success small fw-bold mb-3">OTP SENT TO {formData.email}</p>
                <div className="input-group custom-input-group mb-3">
                  <span className="input-group-text bg-transparent border-0 text-white px-3"><i className="bi bi-123 fs-5" style={{ color: '#DC143C' }}></i></span>
                  <input type="text" name="otp" value={formData.otp} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none py-3 px-2 text-center fs-5" placeholder="ENTER 6-DIGIT OTP" required style={{ outline: 'none', fontWeight: 'bold', fontFamily: 'Rajdhani', letterSpacing: '5px' }} />
                </div>
                <span className="text-white-50 x-small" style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setStep(1)}>Edit Details / Resend OTP</span>
              </div>
            )}

            <div className="d-grid mb-3">
              <button type="submit" disabled={loading} className="btn py-3 text-white border-0 premium-login-btn">
                {loading ? 'PROCESSING...' : (step === 1 ? 'CREATE ACCOUNT' : 'VERIFY & REGISTER')}
              </button>
            </div>

            <div className="text-center mt-3 mb-2">
              <p className="small mb-0" style={{ color: '#888', fontWeight: '400' }}>
                ALREADY A CLAN MEMBER? <br/>
                <Link to="/login" className="text-decoration-none mt-2 d-inline-block" style={{ color: '#DC143C', letterSpacing: '1.5px', fontWeight: '700', borderBottom: '1px dashed #DC143C' }}>AUTHORIZE ACCESS</Link>
              </p>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default Signup;
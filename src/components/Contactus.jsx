import React, { useState } from 'react';
import Navbar from './Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const response = await fetch('http://dragoncj-clothing-brand.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true); 
      } else {
        alert("Transmission Failed. Check Backend.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Server Offline!");
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');

    :root {
      --dragon-red: #D90429;
      --pure-black: #000000;
      --border-color: #333;
    }

    body { background-color: var(--pure-black); color: #fff; font-family: 'Rajdhani', sans-serif; }
    h1, h2, h3, h4, h5 { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; }

    /* --- FORM SECTION --- */
    .contact-card {
        background: #080808; border: 1px solid var(--border-color); padding: 40px;
    }
    
    .dragon-input {
        background: transparent; border: 1px solid var(--border-color); color: white;
        padding: 15px; width: 100%; margin-bottom: 20px; transition: 0.3s;
        font-family: 'Rajdhani';
    }
    .dragon-input:focus {
        outline: none; border-color: var(--dragon-red); 
        box-shadow: 0 0 10px rgba(217, 4, 41, 0.2);
    }
    
    textarea.dragon-input { min-height: 150px; resize: none; }

    .send-btn {
        background: var(--dragon-red); color: white; width: 100%; padding: 15px;
        border: none; font-weight: bold; font-family: 'Oswald'; font-size: 1.2rem; letter-spacing: 1px;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 100%, 0 80%);
        transition: 0.3s; cursor: pointer;
    }
    .send-btn:hover:not(:disabled) { background: #ff0033; box-shadow: 0 0 20px var(--dragon-red); }
    .send-btn:disabled { background: #555; cursor: not-allowed; clip-path: none; }

    /* --- INFO SECTION --- */
    .info-box {
        border: 1px solid var(--border-color); padding: 30px; margin-bottom: 20px;
        transition: 0.3s; cursor: pointer; text-decoration: none; display: block; color: white;
    }
    .info-box:hover {
        border-color: var(--dragon-red); background: rgba(217, 4, 41, 0.05);
    }
    .icon-box {
        width: 50px; height: 50px; background: #111; color: var(--dragon-red);
        display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
        margin-bottom: 15px; border: 1px solid #333;
    }

    /* --- SUCCESS MESSAGE --- */
    .success-msg {
        background: rgba(40, 167, 69, 0.1); border: 1px solid #28a745; color: #28a745;
        padding: 20px; text-align: center; margin-bottom: 20px; animation: fadeIn 0.5s;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `;

  return (
    <div className="min-vh-100">
      <style>{styles}</style>
      <Navbar cartCount={2} />

      <div className="container" style={{marginTop: '100px', marginBottom: '100px'}}>
        
        <div className="text-center mb-5">
            <h1 className="display-4 fw-bold">CONTACT <span className="text-danger">US</span></h1>
            <p className="text-white-50 lead">Have a question? The Dragon Clan is listening.</p>
        </div>

        <div className="row g-5">
            
            {/* --- LEFT: CONTACT FORM --- */}
            <div className="col-lg-7">
                <div className="contact-card">
                    <h3 className="mb-4 border-bottom border-secondary pb-3">SEND TRANSMISSION</h3>
                    
                    {submitted ? (
                        <div className="success-msg">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            MESSAGE TRANSMITTED SUCCESSFULLY. STAND BY FOR RESPONSE.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="text-white-50 small mb-1">CODENAME (NAME)</label>
                                    <input type="text" className="dragon-input" required 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="text-white-50 small mb-1">CONTACT EMAIL (OPTIONAL)</label>
                                    <input type="email" className="dragon-input"  
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <label className="text-white-50 small mb-1">MESSAGE / INTEL</label>
                            <textarea className="dragon-input" placeholder="Type your message here..." required
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>

                            <button type="submit" className="send-btn" disabled={loading}>
                                {loading ? "TRANSMITTING..." : "SEND MESSAGE"}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* --- RIGHT: DIRECT COMMS --- */}
            <div className="col-lg-5">
                <h3 className="mb-4 text-white-50">DIRECT CHANNELS</h3>
                
                {/* WhatsApp */}
                <a href="https://wa.me/919182455287" target="_blank" rel="noreferrer" className="info-box">
                    <div className="d-flex align-items-center">
                        <div className="icon-box"><i className="bi bi-whatsapp"></i></div>
                        <div className="ms-3">
                            <h5 className="mb-1 fw-bold">WHATSAPP SUPPORT</h5>
                            <p className="text-white-50 small mb-0">Instant response regarding orders.</p>
                            <p className="text-white-50 small mb-0">Contact: +91 91824 55287</p>
                        </div>
                    </div>
                </a>

                {/* Email */}
                <a href="mailto:support@dragoncj.com" className="info-box">
                    <div className="d-flex align-items-center">
                        <div className="icon-box"><i className="bi bi-envelope"></i></div>
                        <div className="ms-3">
                            <h5 className="mb-1 fw-bold">EMAIL</h5>
                            <p className="text-white-50 small mb-0">support@dragoncj.com</p>
                        </div>
                    </div>
                </a>

                <div className="info-box cursor-default" style={{cursor: 'default'}}>
                    <div className="d-flex align-items-center">
                        <div className="icon-box"><i className="bi bi-geo-alt"></i></div>
                        <div className="ms-3">
                            <h5 className="mb-1 fw-bold">BASE LOCATION</h5>
                            <p className="text-white-50 small mb-0">Rajahmundry, Andhra Pradesh, India.</p>
                        </div>
                    </div>
                    {/* Location - REAL MAP ADDED */}
                <div className="info-box cursor-default" style={{cursor: 'default'}}>
                    <div className="d-flex align-items-center">
                        <div className="icon-box"><i className="bi bi-geo-alt"></i></div>
                        <div className="ms-3">
                            <h5 className="mb-1 fw-bold">BASE LOCATION</h5>
                            <p className="text-white-50 small mb-0">Rajahmundry, Andhra Pradesh, India.</p>
                        </div>
                    </div>
                    
                    {/* 🔥 REAL GOOGLE MAP VISUAL (Rajahmundry) 🔥 */}
                    {/* Added border, grayscale and invert filter to match dark theme */}
                    <div className="mt-3 border border-secondary p-0" style={{overflow: 'hidden', height: '200px'}}>
                        <iframe 
                            title="Rajahmundry Base"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122047.368305047!2d81.7058882772658!3d17.00067345607315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a3f8b0e8b0b5%3A0x6a0a0100a89d98a0!2sRajahmundry%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1711110000000!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{border: 0, filter: 'grayscale(100%) invert(90%)', opacity: 0.7}} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
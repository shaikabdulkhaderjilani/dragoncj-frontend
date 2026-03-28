import React from 'react';
import Navbar from './Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ElitePage = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');

    :root {
      --gold-primary: #FFD700;
      --gold-secondary: #DAA520;
      --dragon-red: #D90429;
      --pure-black: #000000;
      --glass-bg: rgba(255, 255, 255, 0.05);
    }

    body { background-color: var(--pure-black); color: white; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }
    h1, h2, h3, h5, .brand-font { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 2px; }

    /* --- HERO BACKGROUND --- */
    .elite-hero {
        min-height: 100vh;
        background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        position: relative; overflow: hidden;
        padding-top: 80px;
    }
    
    /* Background Grid */
    .elite-hero::before {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background-image: linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 215, 0, 0.05) 1px, transparent 1px);
        background-size: 50px 50px; opacity: 0.5; pointer-events: none;
    }

    /* --- THE 3D GOLD CARD ANIMATION --- */
    .card-container { perspective: 1000px; margin-bottom: 40px; }
    .gold-card-3d {
        width: 320px; height: 200px;
        background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
        border-radius: 15px;
        position: relative;
        transform-style: preserve-3d;
        animation: float-card 6s ease-in-out infinite;
        box-shadow: 0 0 50px rgba(255, 215, 0, 0.4);
        display: flex; flex-direction: column; justify-content: space-between; padding: 20px;
        border: 1px solid white;
    }
    
    @keyframes float-card {
        0%, 100% { transform: rotateY(0deg) rotateX(0deg) translateY(0); }
        50% { transform: rotateY(10deg) rotateX(5deg) translateY(-20px); }
    }

    .card-chip { width: 40px; height: 30px; background: linear-gradient(to bottom right, #dcdcdc, #808080); border-radius: 5px; margin-bottom: 10px; }
    .card-number { font-family: 'monospace'; font-size: 1.2rem; letter-spacing: 3px; color: #333; text-shadow: 1px 1px 0 rgba(255,255,255,0.5); }
    .card-name { font-family: 'Oswald'; text-transform: uppercase; color: #222; font-weight: bold; }

    /* --- PRICING CARDS --- */
    .pricing-card {
        background: var(--glass-bg);
        border: 1px solid rgba(255, 215, 0, 0.2);
        padding: 40px; text-align: center;
        transition: 0.3s; position: relative;
        backdrop-filter: blur(10px);
    }
    .pricing-card:hover {
        transform: translateY(-10px);
        border-color: var(--gold-primary);
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
    }
    
    /* Best Value Badge */
    .best-value {
        position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
        background: var(--gold-primary); color: black;
        padding: 5px 20px; font-weight: bold; font-family: 'Oswald';
        letter-spacing: 1px; box-shadow: 0 0 10px var(--gold-primary);
    }

    .price-text { font-size: 3rem; font-weight: bold; font-family: 'Oswald'; color: white; }
    .price-sub { font-size: 1rem; color: #888; }
    
    .feature-list { list-style: none; padding: 0; margin: 30px 0; text-align: left; }
    .feature-list li { margin-bottom: 15px; color: #ccc; display: flex; align-items: center; gap: 10px; }
    .check-gold { color: var(--gold-primary); font-size: 1.2rem; }

    /* --- SHINY GOLD BUTTON --- */
    .btn-gold {
        background: linear-gradient(90deg, #bf953f, #fcf6ba, #b38728);
        color: black; border: none; padding: 15px 40px;
        font-family: 'Oswald'; font-weight: bold; text-transform: uppercase;
        letter-spacing: 2px; width: 100%;
        transition: 0.3s; position: relative; overflow: hidden;
    }
    .btn-gold:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); color: black; }
    
    /* Shine Animation */
    .btn-gold::after {
        content: ''; position: absolute; top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        transition: 0.5s;
    }
    .btn-gold:hover::after { left: 100%; }

    /* --- TEXT GLOW --- */
    .gold-text-glow {
        color: var(--gold-primary);
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <Navbar cartCount={6} />

      {/* HERO SECTION */}
      <div className="elite-hero">
        
        <div className="text-center mb-5">
            <h5 className="text-white-50 mb-3" style={{letterSpacing: '5px'}}>MEMBER ACCESS ONLY</h5>
            <h1 className="display-1 fw-bold gold-text-glow mb-4">JOIN THE ELITE</h1>
            <p className="text-white lead" style={{maxWidth: '600px', margin: '0 auto'}}>
                Unlock early access, exclusive drops, and premium benefits reserved for the inner circle.
            </p>
        </div>

        {/* 3D FLOATING GOLD CARD */}
        <div className="card-container">
            <div className="gold-card-3d">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="card-chip"></div>
                    <i className="bi bi-wifi fs-4 text-dark opacity-50"></i>
                </div>
                <div className="text-center">
                    <div className="card-number">9921 4402 ELITE 2026</div>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                    <div>
                        <small className="d-block text-dark opacity-75" style={{fontSize: '0.6rem'}}>MEMBER NAME</small>
                        <span className="card-name">COMMANDER CJ</span>
                    </div>
                    <i className="bi bi-gem fs-3 text-dark"></i>
                </div>
            </div>
        </div>

      </div>

      {/* PRICING SECTION */}
      <div className="container" style={{marginBottom: '100px', marginTop: '-50px', position: 'relative', zIndex: 2}}>
        <div className="row g-4 justify-content-center">
            
            {/* PLAN 1: OPERATIVE (Monthly) */}
            <div className="col-lg-4 col-md-6">
                <div className="pricing-card">
                    <h3 className="brand-font mb-2">OPERATIVE</h3>
                    <p className="text-white-50 mb-4">Entry Level Access</p>
                    
                    <div className="mb-4">
                        <span className="price-text">₹499</span>
                        <span className="price-sub"> / MONTH</span>
                    </div>

                    <ul className="feature-list">
                        <li><i className="bi bi-check-circle-fill check-gold"></i> Early Access to Drops (24h)</li>
                        <li><i className="bi bi-check-circle-fill check-gold"></i> 5% Off on All Orders</li>
                        <li><i className="bi bi-check-circle-fill check-gold"></i> Members-Only Discord</li>
                        <li className="text-muted"><i className="bi bi-x-circle"></i> No Free Shipping</li>
                        <li className="text-muted"><i className="bi bi-x-circle"></i> No Exclusive Merch</li>
                    </ul>

                    <button className="btn btn-outline-light w-100 rounded-0 py-3 fw-bold" style={{border: '1px solid rgba(255,255,255,0.3)'}}>
                        JOIN MONTHLY
                    </button>
                </div>
            </div>

            {/* PLAN 2: COMMANDER (Yearly - Best Value) */}
            <div className="col-lg-4 col-md-6">
                <div className="pricing-card" style={{border: '2px solid #FFD700', background: 'rgba(20, 20, 0, 0.8)'}}>
                    <div className="best-value">MOST POPULAR</div>
                    <h3 className="brand-font mb-2 text-warning">COMMANDER</h3>
                    <p className="text-white-50 mb-4">Full Access Protocol</p>
                    
                    <div className="mb-4">
                        <span className="price-text" style={{color: '#FFD700'}}>₹2,999</span>
                        <span className="price-sub"> / YEAR</span>
                    </div>

                    <ul className="feature-list">
                        <li><i className="bi bi-check-circle-fill check-gold"></i> <span className="text-white fw-bold">48h Early Access</span></li>
                        <li><i className="bi bi-check-circle-fill check-gold"></i> <span className="text-white fw-bold">15% Off on All Orders</span></li>
                        <li><i className="bi bi-check-circle-fill check-gold"></i> Free Express Shipping</li>
                        <li><i className="bi bi-check-circle-fill check-gold"></i> Exclusive "Locked" Merch</li>
                        <li><i className="bi bi-check-circle-fill check-gold"></i> Gold Profile Badge</li>
                    </ul>

                    <button className="btn-gold">
                        BECOME A LEGEND
                    </button>
                </div>
            </div>

        </div>
      </div>
      
      {/* FAQ SECTION */}
      <div className="container pb-5">
        <h2 className="text-center brand-font mb-5 text-white">ELITE PROTOCOLS (FAQ)</h2>
        <div className="row justify-content-center">
            <div className="col-lg-8">
                {[
                    {q: "How do I access early drops?", a: "Elite members get a secret code via email 24-48 hours before the public launch."},
                    {q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription from your profile settings. Access remains until the cycle ends."},
                    {q: "Is the Gold Card physical?", a: "Currently, it is a digital status symbol. Physical metal cards are sent to members who complete 1 year."}
                ].map((item, i) => (
                    <div className="mb-3 p-3 border border-secondary" key={i} style={{background: '#111'}}>
                        <h5 className="mb-2 text-white" style={{fontSize: '1rem'}}>{item.q}</h5>
                        <p className="mb-0 text-white-50 small">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default ElitePage;
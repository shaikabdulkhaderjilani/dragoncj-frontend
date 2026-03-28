import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer'; // 🔥 కొత్తగా ఫుటర్ ని ఇన్‌పోర్ట్ చేశాం
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Categories = () => {

  // 🔥 Categories Data: Nuvvu future lo eppudaina 'isLocked: true' pedithe adhi 'Coming Soon' aipothundi
  const categoryData = [
    { name: "Embroidery", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800", state: "Embroidery", isLocked: false },
    { name: "Essentials", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800", state: "Essentials", isLocked: false },
    { name: "T-Shirts", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800", state: "T-Shirts", isLocked: true },
    { name: "Jackets", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800", state: "Jackets", isLocked: true }, // 🔒 Idi lock chesa example kosam
    { name: "Hoodies", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", state: "Hoodies", isLocked: true }, // 🔒 Idi kuda lock chesa
    { name: "Accessories", img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800", state: "Accessories", isLocked: true }
  ];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');

    :root {
      --dragon-red: #D90429;
      --pure-black: #000000;
      --card-bg: #080808;
      --border-color: #333;
    }

    html, body { 
        background-color: var(--pure-black); 
        color: #fff; 
        font-family: 'Rajdhani', sans-serif; 
        overflow-x: hidden; 
    }

    h1, h2, h3, h5 { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; }

    .page-header {
      margin-top: 80px; 
      padding: 60px 0 40px 0;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }

    .cat-page-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 30px; 
      margin-top: 50px;
      margin-bottom: 80px;
    }

    .cat-page-item { 
      position: relative; 
      height: 400px; 
      border: 1px solid var(--border-color); 
      overflow: hidden; 
      background-color: var(--card-bg);
      display: block;
    }

    .cat-page-item img { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: all 0.7s ease; 
      filter: brightness(0.6) grayscale(30%); 
    }

    .cat-page-item:hover img { 
      transform: scale(1.1); 
      filter: brightness(0.9) grayscale(0%); 
    }

    .cat-page-item::after {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
      pointer-events: none;
    }

    .cat-page-label { 
      position: absolute; 
      bottom: 30px; 
      left: 0; 
      width: 100%;
      text-align: center;
      font-family: 'Oswald'; 
      font-size: 2rem; 
      font-weight: bold; 
      color: white;
      text-shadow: 2px 2px 10px rgba(0,0,0,0.8); 
      z-index: 2;
      transition: 0.3s;
      letter-spacing: 3px;
    }

    .cat-page-item:hover .cat-page-label {
      color: var(--dragon-red);
      transform: translateY(-10px);
    }
    
    .cat-page-item:hover {
      border-color: var(--dragon-red);
      box-shadow: 0 10px 30px rgba(217, 4, 41, 0.2);
    }

    /* 🔥 LOCKED CLASS STYLES 🔥 */
    .cat-locked {
      cursor: not-allowed !important;
      border-color: var(--border-color) !important;
      box-shadow: none !important;
    }
    
    .cat-locked img {
      filter: brightness(0.3) grayscale(80%) blur(2px) !important;
    }

    .cat-locked:hover img {
      transform: none !important; /* Zoom avvakunda aputhundi */
    }

    .cat-locked .cat-page-label {
      color: #555 !important;
      text-shadow: none;
    }

    .cat-locked:hover .cat-page-label {
      transform: none !important; /* Text paiki rakunda aputhundi */
    }

    .coming-soon-badge {
      position: absolute;
      top: 175px;
      right:75px;
      background: var(--dragon-red);
      color: white;
      padding: 5px 15px;
      font-family: 'Oswald';
      font-size: 0.9rem;
      letter-spacing: 2px;
      z-index: 3;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <Navbar cartCount={6} />

      <div className="page-header container">
        <h5 className="text-danger fw-bold mb-2">EXPLORE THE VAULT</h5>
        <h1 className="display-3 fw-bold text-white">BROWSE BY <span style={{WebkitTextStroke: '1px white', color: 'transparent'}}>CATEGORY</span></h1>
        <p className="text-white-50 mt-3 mx-auto" style={{maxWidth: '600px', fontSize: '1.1rem'}}>
          Select a category below to view our exclusive drops. Pure art, zero compromises.
        </p>
      </div>

      <div className="container">
        <div className="cat-page-grid">
          {categoryData.map((cat, index) => {
            // 🔥 Logic: Lock true unte just Div chupistham, false unte Link (clickable) chupistham
            if (cat.isLocked) {
              return (
                <div className="cat-page-item cat-locked" key={index}>
                  <div className="coming-soon-badge"><i className="bi bi-lock-fill me-2"></i> COMING SOON</div>
                  <img src={cat.img} alt={cat.name}/>
                  <div className="cat-page-label">{cat.name}</div>
                </div>
              );
            }

            return (
              <Link to="/shop" state={{ category: cat.state }} className="cat-page-item" key={index}>
                <img src={cat.img} alt={cat.name}/>
                <div className="cat-page-label">{cat.name}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 🔥 ఇక్కడ Footer కాంపోనెంట్ వస్తుంది */}
      <Footer />
      
    </div>
  );
};

export default Categories;
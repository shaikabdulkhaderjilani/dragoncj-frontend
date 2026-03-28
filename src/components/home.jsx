import { Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react'; // 🔥 useContext added
import Navbar from './Navbar'; 
import { CartContext } from './CartContext'; // 🔥 CartContext added
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import poster from '../images/poster.png';
import nab1 from '../images/NAB1.png';
import Footer from './Footer'; // 🔥 Footer component imported

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [latestDrops, setLatestDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 ADD TO CART LOGIC
  const { addToCart } = useContext(CartContext);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products'); 
        const data = await response.json();
        
        if (response.ok) {
          const hotProducts = data.filter(item => item.isHot === true || item.ishot === true); 
          setBestSellers(hotProducts);
          const newProducts = data.filter(item => item.isNew === true || item.isnew === true);
          setLatestDrops(newProducts); 
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Backend Error! Server run avthundo ledo chudu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddingId(product._id);
    setTimeout(() => setAddingId(null), 1000);
  };

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
        width: 100%;
        margin: 0;
        padding: 0;
    }

    h1, h2, h3, h5, .brand-font { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; }

    .ticker-wrap {
      background: var(--dragon-red); 
      height: 35px; 
      position: fixed; 
      top: 0; 
      width: 100%; 
      z-index: 2100;
      display: flex; 
      align-items: center; 
      justify-content: center;
      border-bottom: 1px solid #000;
      overflow: hidden; 
    }
    .ticker-move { display: inline-block; white-space: nowrap; padding-left: 100%; animation: ticker-slide 20s linear infinite; }
    .ticker-item { display: inline-block; padding: 0 2rem; font-size: 0.8rem; font-weight: bold; color: white; text-transform: uppercase; letter-spacing: 2px; }
    @keyframes ticker-slide { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
    
    .fixed-top { top: 35px !important; background: rgba(0,0,0,0.95) !important; border-bottom: 1px solid #1a1a1a; backdrop-filter: blur(10px); }
    
    .hero-poster {
      height: 100vh;
      background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1)), url(${poster}); 
      background-size: cover; background-position: center;
      display: flex; align-items: center; justify-content: center;
      margin-top: 35px;
    }

    .dragon-btn {
      background: linear-gradient(45deg, var(--dragon-red), #b30024);
      color: white; border: none; padding: 15px 40px;
      clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
      font-weight: bold; text-transform: uppercase; letter-spacing: 2px;
      font-family: 'Oswald'; margin-top: 20px; text-decoration: none;
      transition: all 0.3s ease-in-out; position: relative; z-index: 1;
      display: inline-block;
    }
    .dragon-btn:hover {
      background: linear-gradient(120deg, #D90429, #ffadbc, #D90429);
      background-size: 200% 200%; animation: reactor-flow 2s linear infinite;
      color: black; transform: scale(1.05) translateY(-3px);
      box-shadow: 0 0 20px var(--dragon-red), 0 0 40px var(--dragon-red); 
    }
    @keyframes reactor-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

    .section-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 25px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;
    }
    .section-title { font-size: 1.5rem; margin: 0; color: #fff; border-left: 4px solid var(--dragon-red); padding-left: 15px; }
    .view-all { font-size: 0.8rem; text-decoration: none; color: #888; transition: 0.3s; }

    .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .cat-item { position: relative; height: 250px; border: 1px solid var(--border-color); overflow: hidden; }
    .cat-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; filter: brightness(0.7); }
    .cat-item:hover img { transform: scale(1.05); filter: brightness(1); }
    .cat-label { position: absolute; bottom: 15px; left: 15px; font-family: 'Oswald'; font-size: 1.2rem; font-weight: bold; text-shadow: 2px 2px 5px black; }

    .scrolling-wrapper {
        display: flex; overflow-x: auto; gap: 20px; padding-bottom: 20px;
        scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none;
    }
    .scrolling-wrapper::-webkit-scrollbar { display: none; }

    .product-card {
        width: 180px;      
        max-width: 180px;  
        flex-shrink: 0;    
        background-color: #080808;
        border: 1px solid #333; 
        transition: all 0.4s ease;
        position: relative; 
        scroll-snap-align: start;
        display: flex; 
        flex-direction: column;
        height: 100%;
        margin-right: 5px;
    }
    .product-card:hover { border-color: #D90429; transform: translateY(-5px); box-shadow: 0 8px 25px rgba(217, 4, 41, 0.15); }
    
    .product-img-container { 
        width: 100%; 
        aspect-ratio: 3/4 !important; 
        overflow: hidden; 
        position: relative; 
        border-bottom: 1px solid #333; 
    }

    .product-img { 
        width: 100% !important; 
        height: 100% !important; 
        object-fit: cover !important; 
        object-position: top center;
    }
    .product-card:hover .product-img { transform: scale(1.08); }
    
    .product-info { padding: 10px; text-align: center; display: flex; flex-direction: column; flex-grow: 1; }
    .p-title { font-size: 0.85rem; margin-bottom: 5px; color: #fff; font-weight: 600; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .p-price { font-size: 1rem; font-weight: bold; color: #D90429; margin-bottom: 10px; }

    /* 🔥 ADD TO CART BUTTON CSS */
    .premium-add-btn {
        margin-top: auto; width: 100%; background: transparent; border: 1px solid #444; color: white;
        padding: 8px; font-family: 'Oswald', sans-serif; font-size: 0.8rem; letter-spacing: 1px;
        transition: 0.3s; text-transform: uppercase; cursor: pointer;
    }
    .premium-add-btn:hover { background: #D90429; border-color: #D90429; color: white; }

    @keyframes addedPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); color: #fff; }
      100% { transform: scale(1); }
    }
    .added-text { animation: addedPulse 0.3s ease-in-out; font-weight: bold; }

    .vault-section { margin: 60px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 40px 0; }
    .footer-link { color: #888; text-decoration: none; display: block; margin-bottom: 8px; font-size: 0.9rem; transition: 0.3s; }

    @keyframes glitch { 0% { text-shadow: 2px 2px 0px #D90429, -2px -2px 0px #000; } 100% { text-shadow: 2px 2px 0px #D90429, -2px -2px 0px #000; } }
    .glitch-text { animation: glitch 1s infinite alternate-reverse; }
    @keyframes flicker { 0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; } 20%, 24%, 55% { opacity: 0.1; } }
    .broken-blink { color: #D90429; animation: flicker 2s infinite; }
  `;

  return (
    <div style={{ overflowX: 'hidden' }}>
      <style>{styles}</style>

      <div className="ticker-wrap">
        <div className="ticker-move">
          <span className="ticker-item">•⚠️ WARNING: HIGH DEMAND DROPS•</span>
          <span className="ticker-item">• FREE SHIPPING ON ORDERS OVER ₹1999 •</span>
          <span className="ticker-item">• NEW DESIGNS •</span>
        </div>
      </div>

      <Navbar cartCount={6} />

      <div className="hero-poster">
        <div className="text-center px-3">
          <p className="fw-bold mb-3 broken-blink" style={{letterSpacing: '5px'}}>EST. 2026 // UNREVEAL</p>
          <h1 className="display-1 fw-bold text-white glitch-text mb-4">
            UNLEASH <br/> <span style={{WebkitTextStroke: '1px white', color: 'transparent'}}>THE DRAGON</span>
          </h1>
          <p className="text-white-50 lead mb-5 mx-auto" style={{maxWidth: '600px', fontSize: '1.2rem'}}>
            Premium embroidery. Aggressive cuts. <br/> Designed for those who dare to stand out.
          </p>
          <a className="dragon-btn" href="/shop">Shop Collection</a>
        </div>
      </div>

      <div className="container" style={{marginTop: '60px'}}>

        <section className="vault-section">
          <div className="container mb-4 text-center">
            <h5 className="text-white-50 m-0 fw-bold" style={{ letterSpacing: '5px', fontSize: '0.8rem' }}>THE VAULT</h5>
            <h2 className="display-5 fw-bold text-white mt-2">LEGACY <span className="text-danger">ARCHIVE</span></h2>
          </div>

          <div id="posterSlider" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1920" className="d-block w-100" style={{height: '60vh', objectFit: 'cover'}} alt="p1"/>
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1920" className="d-block w-100" style={{height: '60vh', objectFit: 'cover'}} alt="p2"/>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#posterSlider" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#posterSlider" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </section>

        <div className="mb-5">
          <div className="section-header">
            <h2 className="section-title">CATEGORIES</h2>
          </div>
          <div className="cat-grid">
            <div className="cat-item">
              <Link to="/shop" state={{ category: "Embroidery" }}>
                <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400" alt="Embroidery"/>
                <div className="cat-label text-white">EMBROIDERY</div>
              </Link>
            </div>
            <div className="cat-item">
              <Link to="/shop" state={{ category: "Essentials" }}>
                <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400" alt="Plain"/>
                <div className="cat-label text-white">ESSENTIALS</div>
              </Link>
            </div>
            <div className="cat-item">
              <Link to="/shop" state={{ category: "T-Shirts" }}>
                <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400" alt="T-Shirts"/>
                <div className="cat-label text-white">T-SHIRTS</div>
              </Link>
            </div>
            <div className="cat-item">
              <Link to="/shop" state={{ category: "Jackets" }}>
                <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400" alt="Jackets"/>
                <div className="cat-label text-white">JACKETS</div>
              </Link>
            </div>
          </div>
        </div>

        <div className="my-5">
          <div className="section-header">
            <h2 className="section-title">BEST SELLERS</h2>
          </div>
          <div className="scrolling-wrapper">
            {loading ? (
              <div className="text-white">Loading vault data... 🐉</div>
            ) : bestSellers.map((item, index) => (
              <div className="product-card" key={item._id || index}>
                <div className="product-img-container">
                  <img 
                    src={item.img && item.img.startsWith('http') ? item.img : `http://192.168.31.85:5000${item.img}`} 
                    className="product-img" 
                    alt={item.name}
                  />
                  <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 small fw-bold">HOT</div>
                </div>
                <div className="product-info">
                  <h6 className="p-title">{item.name}</h6>
                  <p className="p-price">₹{item.price}</p>
                  <button className="premium-add-btn" onClick={() => handleAddToCart(item)}>
                    {addingId === item._id ? <span className="added-text">ADDED</span> : "ADD TO CART"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="vault-section">
          <div className="container mb-4 text-center">
            <h2 className="display-5 fw-bold text-white mt-2">NEW ARRIVALS</h2>
          </div>
          <div id="newArrivalsSlider" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={nab1} className="d-block w-100" style={{height: '60vh', objectFit: 'cover'}} alt="p1"/>
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1920" className="d-block w-100" style={{height: '60vh', objectFit: 'cover'}} alt="p2"/>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#posterSlider" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#posterSlider" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </section>
        
        <div className="mb-5">
            <div className="section-header">
                <h2 className="section-title">LATEST DROPS</h2>
                <a href="/shop" className="view-all">VIEW ALL <i className="bi bi-arrow-right"></i></a>
            </div>
            <div className="scrolling-wrapper">
                {latestDrops.map((item, index) => (
                    <div className="product-card" key={item._id || index}>
                        <div className="product-img-container">
                            <img 
                              src={item.img && item.img.startsWith('http') ? item.img : `http://localhost:5000${item.img}`} 
                              className="product-img" 
                              alt={item.name}
                            />
                            <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 small fw-bold">NEW</div>
                        </div>
                        <div className="product-info">
                            <h6 className="p-title">{item.name}</h6>
                            <p className="p-price">₹{item.price}</p>
                            <button className="premium-add-btn" onClick={() => handleAddToCart(item)}>
                              {addingId === item._id ? <span className="added-text">ADDED</span> : "ADD TO CART"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* 🔥 ఇక్కడ Footer కాంపోనెంట్ వస్తుంది */}
      <Footer />
    </div>
  );
};

export default Home;
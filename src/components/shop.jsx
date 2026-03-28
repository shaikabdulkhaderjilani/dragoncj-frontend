import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar'; 
import { CartContext } from './CartContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useLocation } from 'react-router-dom'; 
import Footer from './Footer';

const Shop = () => {
  const location = useLocation(); 
  const initialCategory = location.state?.category || "All"; 
  
  // --- STATE ---
  const [allProducts, setAllProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Context Connection
  const { addToCart } = useContext(CartContext); 
  const [addingId, setAddingId] = useState(null); 
  
  // Filters & Sorting State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory); 
  const [selectedPrice, setSelectedPrice] = useState("All"); 
  const [sortOption, setSortOption] = useState("latest");
  const [showFilters, setShowFilters] = useState(false); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; 

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    // 🔥 MOBILE FIX: localhost badulu IP address pettam
    fetch('http://localhost:5000/api/products') 
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);      
        setFilteredProducts(data); 
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // --- 2. FILTER & SORT LOGIC ---
  useEffect(() => {
    let tempProducts = [...allProducts];

    // 1. Filter by Category
    if (selectedCategory !== "All") {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }

    // 2. Filter by Price Range
    if (selectedPrice === "under-999") {
      tempProducts = tempProducts.filter(p => p.price < 1000);
    } else if (selectedPrice === "1000-2499") {
      tempProducts = tempProducts.filter(p => p.price >= 1000 && p.price <= 2499);
    } else if (selectedPrice === "2500+") {
      tempProducts = tempProducts.filter(p => p.price >= 2500);
    }

    // 3. Sorting Logic
    if (sortOption === "price-low") {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      tempProducts.sort((a, b) => b.price - a.price);
    } 

    setFilteredProducts(tempProducts);
    setCurrentPage(1); 
  }, [selectedCategory, selectedPrice, sortOption, allProducts]);

  // --- 3. PAGINATION MATH ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- 4. ADD TO CART HANDLER ---
  const handleAddToCart = (product) => {
    addToCart(product); 
    setAddingId(product._id);
    setTimeout(() => setAddingId(null), 1000); 
  };

  const categories = ["All", "Embroidery", "Essentials", "T-Shirts", "Printed", "Jackets"];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');

    body { background-color: #050505; color: #fff; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }
    h1, h2, h3, h5, .brand-font { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; }

    .shop-container { padding-top: 100px; min-height: 100vh; }
    .shop-header { border-bottom: 1px solid #333; margin-bottom: 30px; padding-bottom: 20px; }
    .glitch-title { font-size: 2.5rem; font-weight: bold; color: white; text-transform: uppercase; letter-spacing: 2px; }

    .filter-section h5 { color: #D90429; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; font-size: 1.1rem; }
    .filter-btn { display: block; background: transparent; border: none; color: #888; text-align: left; padding: 8px 0; width: 100%; transition: 0.3s; font-family: 'Rajdhani', sans-serif; text-transform: uppercase; font-size: 0.95rem; cursor: pointer; }
    .filter-btn:hover { color: white; padding-left: 10px; }
    .filter-btn.active { color: white; font-weight: bold; border-left: 3px solid #D90429; padding-left: 15px; background: linear-gradient(90deg, #111, transparent); }

    /* 🔥 Card Padding Thaggincha 🔥 */
    .product-card { background: #080808; border: 1px solid #333; transition: 0.3s; position: relative; overflow: hidden; height: 100%; padding: 8px; }
    .product-card:hover { border-color: #D90429; transform: translateY(-5px); box-shadow: 0 5px 15px rgba(217, 4, 41, 0.15); }
    
    /* 🔥 Container & Image Fix (Magic Box) 🔥 */
    .card-img-container { width: 100%; aspect-ratio: 3/4; overflow: hidden; position: relative; border-radius: 4px; }
    .card-img-top { width: 100%; height: 100% !important; object-fit: cover !important; object-position: top center !important; transition: 0.6s; filter: grayscale(20%); }
    .product-card:hover .card-img-top { transform: scale(1.1); filter: grayscale(0%); }
    
    .badge-tag { position: absolute; top: 12px; right: 12px; background: #D90429; color: white; padding: 3px 8px; font-size: 0.7rem; font-weight: bold; letter-spacing: 1px; z-index: 2; border-bottom-left-radius: 5px; }

    /* 🔥 Button Text Fix 🔥 */
    .add-btn { 
        width: 100%; background: transparent; border: 1px solid #333; color: white; padding: 8px 2px; 
        font-size: 0.8rem !important; font-family: 'Oswald'; margin-top: auto; transition: 0.3s; letter-spacing: 1px;
        position: relative; overflow: hidden; cursor: pointer; white-space: nowrap !important;
    }
    
    .add-btn:hover { 
        background: linear-gradient(120deg, #D90429, #ffadbc, #D90429);
        background-size: 200% 200%; animation: reactor-flow 2s linear infinite;
        border-color: #D90429; color: black; font-weight: bold;
    }

    @keyframes reactor-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

    @keyframes moveTrolley {
        0% { transform: translateX(-40px); opacity: 0; }
        20% { transform: translateX(0); opacity: 1; }
        80% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(40px); opacity: 0; }
    }
    .trolley-anim { display: inline-block; animation: moveTrolley 1s ease-in-out forwards; }

    .mobile-filter-toggle { display: none; width: 100%; background: #111; color: white; border: 1px solid #333; padding: 10px; margin-bottom: 20px; font-family: 'Oswald'; }
    @media (max-width: 991px) {
        .mobile-filter-toggle { display: block; }
        .filter-sidebar { display: ${showFilters ? 'block' : 'none'}; background: #111; padding: 20px; border: 1px solid #333; margin-bottom: 20px; }
    }

    .dragon-input { background: transparent; border: 1px solid #333; color: white; padding: 10px; width: 100%; }
    .dragon-input:focus { outline: none; border-color: var(--dragon-red); }
    .footer-link { color: #888; text-decoration: none; display: block; margin-bottom: 8px; font-size: 0.9rem; transition: 0.3s; }
    .footer-link:hover { color: var(--dragon-red); padding-left: 5px; }
  `;

  return (
    <div className="min-vh-100">
      <style>{styles}</style>
      <Navbar cartCount={6} />

      <div className="container shop-container">
        <div className="shop-header">
            <p className="text-danger fw-bold mb-0" style={{letterSpacing: '3px'}}>ARMORY ACCESS</p>
            <h1 className="glitch-title">INVENTORY</h1>
        </div>

        <div className="row">
            
            <div className="col-lg-3">
                <button className="mobile-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                    <i className="bi bi-sliders me-2"></i> {showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
                </button>

                <div className="filter-sidebar">
                    <div className="mb-5">
                        <h5>CATEGORY</h5>
                        {categories.map((cat) => (
                            <button 
                                key={cat} 
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory(selectedCategory === cat ? "All" : cat);
                                    setShowFilters(false); 
                                }}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="mb-5">
                        <h5>PRICE RANGE</h5>
                        <button 
                            className={`filter-btn ${selectedPrice === "under-999" ? 'active' : ''}`}
                            onClick={() => setSelectedPrice(selectedPrice === "under-999" ? "All" : "under-999")}
                        >
                            UNDER ₹999
                        </button>
                        <button 
                            className={`filter-btn ${selectedPrice === "1000-2499" ? 'active' : ''}`}
                            onClick={() => setSelectedPrice(selectedPrice === "1000-2499" ? "All" : "1000-2499")}
                        >
                            ₹1000 - ₹2499
                        </button>
                        <button 
                            className={`filter-btn ${selectedPrice === "2500+" ? 'active' : ''}`}
                            onClick={() => setSelectedPrice(selectedPrice === "2500+" ? "All" : "2500+")}
                        >
                            ₹2500+
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-lg-9">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
                    <span className="text-white-50 small">{filteredProducts.length} ITEMS FOUND</span>
                    <select 
                        className="bg-black text-white border border-secondary p-1 small" 
                        style={{outline: 'none', cursor: 'pointer'}}
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="latest">SORT: LATEST</option>
                        <option value="price-low">PRICE: LOW TO HIGH</option>
                        <option value="price-high">PRICE: HIGH TO LOW</option>
                    </select>
                </div>

                <div className="row g-4">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <div className="col-6 col-md-6 col-lg-4" key={product._id}>
                                <div className="product-card d-flex flex-column">
                                    {product.isHot && <span className="badge-tag">HOT</span>}
                                    {product.isNew && <span className="badge-tag bg-primary">NEW</span>}
                                    
                                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                                        <div className="card-img-container">
                                            {/* 🔥 MOBILE FIX: IP address tho paatu image scaling fix chesam 🔥 */}
                                            <img src={product.img && product.img.startsWith('http') ? product.img : `http://192.168.31.85:5000${product.img}`} className="card-img-top" alt={product.name} />
                                        </div>
                                    </Link>
                                    
                                    {/* 🔥 p-3 nundi p-2 ki marcham ikkada 🔥 */}
                                    <div className="p-2 text-center mt-auto">
                                        <p className="text-white-50 small mb-1 text-uppercase" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>{product.category}</p>
                                        <h5 className="mb-1 fw-bold text-white" style={{fontSize: '1rem', fontFamily: 'Oswald', letterSpacing: '1px'}}>{product.name}</h5>
                                        <h5 className="text-danger fw-bold mb-3" style={{fontFamily: 'Oswald'}}>₹{product.price}</h5>
                                        
                                        <button 
                                            className="add-btn"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            {addingId === product._id ? (
                                                <span className="trolley-anim">
                                                    <i className="bi bi-cart-fill me-2"></i> ADDED
                                                </span>
                                            ) : "ADD TO CART"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5 text-white-50">
                            <h4>NO ITEMS FOUND</h4>
                            <p>Try clearing your filters.</p>
                            {allProducts.length === 0 && <p className="text-danger small">Connecting to Server...</p>}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-5 d-flex justify-content-center gap-2">
                        <button 
                            className="btn btn-outline-secondary rounded-0 text-white"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button 
                                key={i + 1} 
                                className={`btn rounded-0 text-white ${currentPage === i + 1 ? 'active border-danger' : 'btn-outline-secondary'}`}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            className="btn btn-outline-secondary rounded-0 text-white"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                )}

                <Footer /> {/* 🔥 Footer component added here for consistent layout 🔥 */}

            </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
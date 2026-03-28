import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { CartContext } from './CartContext';
import Navbar from './Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { addToCart } = useContext(CartContext);
  
  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState('M');
  const [addingId, setAddingId] = useState(null); 
  const [relatedProducts, setRelatedProducts] = useState([]);

  // --- 🔥 NEW REVIEW STATES 🔥 ---
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", name: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // --- 🔥 1. BACKEND FETCH LOGIC 🔥 ---
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load

    const fetchProductDetails = async () => {
        try {
            console.log("Fetching Product ID:", id); // Debug: Check if ID is correct

            // 1. Fetch current product by ID
            const res = await fetch(`http://localhost:5000/api/products/${id}`);
            
            if (!res.ok) {
                console.error(`Backend returned status: ${res.status}`);
                throw new Error("Product not found in Database");
            }
            
            const data = await res.json();
            console.log("Product Data Received:", data); // Debug: Check data structure
            
            const actualProduct = data.product ? data.product : data;
            setProduct(actualProduct);
            
            // 🔥 Image Logic Update: img, img1, img2... ni support chestundi 🔥
            let imagesArray = [];
            if (actualProduct.img) imagesArray.push(actualProduct.img);
            if (actualProduct.img1) imagesArray.push(actualProduct.img1);
            if (actualProduct.img2) imagesArray.push(actualProduct.img2);
            if (actualProduct.img3) imagesArray.push(actualProduct.img3);
            if (actualProduct.img4) imagesArray.push(actualProduct.img4);
            
            // Fallback (అసలు ఏమీ లేకపోతే)
            if (imagesArray.length === 0) {
                imagesArray = actualProduct.images && actualProduct.images.length > 0 
                    ? actualProduct.images 
                    : ["https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?q=80&w=600"];
            }
            
            setMainImage(imagesArray[0]);
            
            // Size Logic: Set default size if available
            if (actualProduct.sizes && actualProduct.sizes.length > 0) {
                setSelectedSize(actualProduct.sizes[0]);
            }

            // 🔥 Load Existing Reviews 🔥
            if (actualProduct.reviews) {
                setReviews(actualProduct.reviews);
            }

            // 2. Fetch Related Products
            try {
                const relatedRes = await fetch(`http://localhost:5000/api/products`);
                if (relatedRes.ok) {
                    const allProducts = await relatedRes.json();
                    const filteredRelated = allProducts
                        .filter(p => p._id !== id && p.category === actualProduct.category)
                        .slice(0, 4);
                        
                    setRelatedProducts(filteredRelated.length > 0 ? filteredRelated : allProducts.filter(p => p._id !== id).slice(0, 4));
                }
            } catch (relatedErr) {
                console.warn("Could not fetch related products:", relatedErr);
            }

            setLoading(false);
        } catch (error) {
            console.error("🔥 Error in fetchProductDetails:", error.message);
            setLoading(false);
        }
    };

    if (id) {
        fetchProductDetails();
    } else {
        setLoading(false);
    }
  }, [id]);

  // --- 2. ESTIMATED DELIVERY ---
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5); 
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // --- 3. CART LOGIC ---
  const handleAddToCart = () => {
    if(!product) return;
    const cartItem = { ...product, size: selectedSize };
    addToCart(cartItem);
    
    setAddingId(product._id);
    setTimeout(() => setAddingId(null), 1000); 
  };

  const handleBuyNow = () => {
    if(!product) return;
    addToCart({ ...product, size: selectedSize });
    navigate('/cart'); 
  };

  // --- 🔥 4. REVIEW SUBMIT LOGIC 🔥 ---
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return alert("Please fill all details!");
    
    const reviewData = {
        _id: Date.now().toString(), // Temporary ID for UI
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
    };

    setReviews([reviewData, ...reviews]);
    setNewReview({ rating: 5, comment: "", name: "" });
    setShowReviewForm(false);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');

    :root { --dragon-red: #D90429; --pure-black: #000000; --border-color: #333; }
    body { background-color: var(--pure-black); color: #fff; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; padding-bottom: 80px; }
    h1, h2, h3, h4, h5, .brand-font { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; }

    /* IMAGE STYLES */
    .main-img-container { border: 1px solid var(--border-color); overflow: hidden; height: 500px; background: #0a0a0a; display: flex; align-items: center; justify-content: center; }
    .main-img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .thumbnail-img { width: 100%; height: 80px; object-fit: cover; border: 1px solid var(--border-color); cursor: pointer; opacity: 0.5; transition: 0.3s; }
    .thumbnail-img:hover { opacity: 0.8; }
    .thumbnail-img.active { border: 2px solid var(--dragon-red); opacity: 1; }
    
    /* DETAILS STYLES */
    .rating-badge { background: #388e3c; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold; font-size: 0.8rem; display: inline-flex; align-items: center; }
    .price-tag { font-size: 2rem; color: white; margin-right: 15px; }
    .mrp-tag { text-decoration: line-through; color: #888; font-size: 1.2rem; }
    .discount-tag { color: #388e3c; font-weight: bold; font-size: 1.1rem; }

    .size-box { border: 1px solid var(--border-color); width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ccc; transition: 0.2s; font-weight: bold; }
    .size-box:hover { border-color: #fff; color: #fff; }
    .size-box.active { border-color: var(--dragon-red); background: var(--dragon-red); color: white; }
    
    /* POLICY BOXES */
    .policy-item { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 15px 10px; border: 1px solid #222; background: #0a0a0a; border-radius: 5px; }
    .policy-icon { font-size: 1.5rem; color: var(--dragon-red); margin-bottom: 5px; }
    
    /* RELATED PRODUCTS */
    .related-card { border: 1px solid #222; background: #050505; transition: 0.3s; text-decoration: none; display: block; }
    .related-card:hover { border-color: var(--dragon-red); transform: translateY(-5px); }
    .related-img { width: 100%; height: 180px; object-fit: cover; border-bottom: 1px solid #222; }

    /* REVIEWS STYLES */
    .review-card { background: #080808; border: 1px solid #222; padding: 15px; border-radius: 4px; margin-bottom: 15px; }
    .review-form-input { background: #000; border: 1px solid #333; color: white; padding: 10px; width: 100%; border-radius: 4px; margin-bottom: 15px; font-family: 'Rajdhani'; }
    .review-form-input:focus { outline: none; border-color: var(--dragon-red); }

    /* ACTION BUTTONS (Desktop) */
    .action-btn { height: 50px; font-family: 'Oswald'; font-weight: bold; transition: 0.3s; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; text-transform: uppercase; }
    .btn-add { background: #111; border: 1px solid #fff; color: white; width: 48%; }
    .btn-add:hover { background: #fff; color: #000; }
    .btn-buy { background: var(--dragon-red); border: 1px solid var(--dragon-red); color: white; width: 48%; }
    .btn-buy:hover { box-shadow: 0 0 20px rgba(217, 4, 41, 0.5); }

    /* 🔥 STICKY BOTTOM BAR (Mobile View Only) 🔥 */
    .sticky-bottom-bar { display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: #000; border-top: 1px solid #333; z-index: 1000; padding: 10px; box-shadow: 0 -5px 20px rgba(0,0,0,0.8); }
    @media (max-width: 991px) {
        .desktop-actions { display: none !important; }
        .sticky-bottom-bar { display: flex; gap: 10px; }
        body { padding-bottom: 70px; }
    }
  `;

  if (loading) return <div className="min-vh-100 d-flex justify-content-center align-items-center bg-black text-white"><h2 className="brand-font">LOADING ARMORY...</h2></div>;
  if (!product) return <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-black text-white">
      <h2 className="brand-font text-danger mb-3">MISSION INTEL NOT FOUND</h2>
      <p className="text-white-50 mb-4">The gear you are looking for has been classified or removed.</p>
      <Link to="/shop" className="btn btn-outline-danger font-oswald rounded-0 px-4">RETURN TO ARMORY</Link>
  </div>;

  // Render variables
  let productImages = [];
  if (product.img) productImages.push(product.img);
  if (product.img1) productImages.push(product.img1);
  if (product.img2) productImages.push(product.img2);
  if (product.img3) productImages.push(product.img3);
  if (product.img4) productImages.push(product.img4);
  if (productImages.length === 0) productImages = ["https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?q=80&w=600"];

  const productSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  
  // Dynamic Rating Calculation
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : (product.rating || 4.5);
  const totalReviews = reviews.length > 0 ? reviews.length : (product.reviewsCount || 86);
  
  const productFeatures = product.features || ["Premium Quality Material", "Highly Durable", "DragonCJ Official Merchandise"];

  return (
    <div className="min-vh-100">
      <style>{styles}</style>
      <Navbar cartCount={0} />
      
      <div className="container" style={{paddingTop: '100px', paddingBottom: '40px'}}>
        
        <div className="row g-4 g-lg-5">
            {/* LEFT: IMAGES */}
            <div className="col-12 col-lg-5">
                <div className="main-img-container mb-3 position-relative">
                    <img src={mainImage} className="main-img" alt={product.name}/>
                    <button className="position-absolute top-0 end-0 m-3 btn btn-dark rounded-circle" style={{width:'40px', height:'40px', opacity: 0.8}}>
                        <i className="bi bi-heart"></i>
                    </button>
                </div>
                {productImages.length > 1 && (
                    <div className="row g-2">
                        {productImages.map((img, index) => (
                            <div className="col-3" key={index}>
                                <img src={img} className={`thumbnail-img ${mainImage === img ? 'active' : ''}`} onClick={() => setMainImage(img)} alt={`thumb-${index}`} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: DETAILS */}
            <div className="col-12 col-lg-7">
                <p className="text-danger small fw-bold mb-1" style={{letterSpacing:'2px'}}>{product.category || 'DRAGONCJ ORIGINALS'}</p>
                <h1 className="fw-bold mb-2" style={{fontFamily: 'Oswald', fontSize: '2rem'}}>{product.name}</h1>
                
                {/* RATING */}
                <div className="d-flex align-items-center mb-3">
                    <span className="rating-badge me-2">{avgRating} <i className="bi bi-star-fill ms-1" style={{fontSize:'0.7rem'}}></i></span>
                    <span className="text-white-50 small">{totalReviews} Ratings & Reviews</span>
                </div>

                {/* PRICE */}
                <div className="d-flex align-items-baseline mb-4 border-bottom border-secondary pb-4">
                    <span className="price-tag fw-bold brand-font">₹{product.price}</span>
                    <span className="mrp-tag me-2">₹{Math.floor(product.price * 1.2)}</span>
                    <span className="discount-tag">20% off</span>
                </div>

                {/* SELECT SIZE */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-bold text-white-50">SELECT SIZE</span>
                        <span className="small text-danger cursor-pointer text-decoration-underline">Size Chart</span>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        {productSizes.map(size => (
                            <div key={size} className={`size-box ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>
                                {size}
                            </div>
                        ))}
                    </div>
                </div>

                {/* DESKTOP ACTION BUTTONS */}
                <div className="desktop-actions d-flex justify-content-between mb-4">
                    <button className="action-btn btn-add" onClick={handleAddToCart} disabled={addingId === product._id}>
                        {addingId === product._id ? <span><i className="bi bi-check2-circle me-2 text-success"></i> ADDED TO CART</span> : <span><i className="bi bi-cart-plus me-2"></i> ADD TO CART</span>}
                    </button>
                    <button className="action-btn btn-buy" onClick={handleBuyNow}>
                        <i className="bi bi-lightning-fill me-2"></i> BUY NOW
                    </button>
                </div>

                {/* DELIVERY & POLICIES */}
                <div className="mb-4 bg-dark p-3 border border-secondary rounded">
                    <h6 className="brand-font mb-3 text-white-50"><i className="bi bi-geo-alt me-2"></i>DELIVERY OPTIONS</h6>
                    <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-truck fs-5 text-success me-3"></i>
                        <div>
                            <p className="mb-0 small text-white">Delivery by <span className="fw-bold">{getDeliveryDate()}</span></p>
                            <p className="mb-0 x-small text-white-50">Free shipping on orders above ₹1999.</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <i className="bi bi-cash-coin fs-5 text-warning me-3"></i>
                        <p className="mb-0 small text-white">Cash on Delivery available</p>
                    </div>
                </div>

                {/* POLICIES ROW */}
                <div className="row g-2 mb-4">
                    <div className="col-4">
                        <div className="policy-item">
                            <i className="bi bi-arrow-return-left policy-icon"></i>
                            <span className="x-small text-white-50">7 Days Return</span>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="policy-item">
                            <i className="bi bi-shield-check policy-icon"></i>
                            <span className="x-small text-white-50">1 Year Warranty</span>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="policy-item">
                            <i className="bi bi-patch-check policy-icon"></i>
                            <span className="x-small text-white-50">Top Brand</span>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mb-4">
                    <h6 className="brand-font border-bottom border-secondary pb-2 mb-3">PRODUCT DETAILS</h6>
                    <p className="text-white-50 small lh-lg mb-3">{product.description || "No description available for this item."}</p>
                    <ul className="text-white-50 small lh-lg ps-3">
                        {productFeatures.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
            </div>
        </div>

        {/* --- 🔥 CUSTOMER REVIEWS SECTION 🔥 --- */}
        <div className="mt-5 pt-4 border-top border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="brand-font mb-0">CUSTOMER REVIEWS</h4>
                <button className="btn btn-outline-danger btn-sm font-oswald rounded-0" onClick={() => setShowReviewForm(!showReviewForm)}>
                    {showReviewForm ? "CANCEL" : "WRITE A REVIEW"}
                </button>
            </div>

            {/* REVIEW FORM */}
            {showReviewForm && (
                <div className="review-card border-danger mb-4">
                    <h6 className="brand-font text-danger mb-3">DROP YOUR INTEL</h6>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="x-small text-white-50 mb-1">YOUR NAME</label>
                                <input type="text" className="review-form-input" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} required />
                            </div>
                            <div className="col-md-6">
                                <label className="x-small text-white-50 mb-1">RATING</label>
                                <select className="review-form-input" value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}>
                                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                                    <option value="3">⭐⭐⭐ (3/5)</option>
                                    <option value="2">⭐⭐ (2/5)</option>
                                    <option value="1">⭐ (1/5)</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="x-small text-white-50 mb-1">YOUR EXPERIENCE</label>
                                <textarea rows="3" className="review-form-input" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required></textarea>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-danger font-oswald rounded-0 w-100 py-2" style={{letterSpacing: '1px'}}>SUBMIT REVIEW</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* REVIEWS LIST */}
            <div className="row">
                {reviews.length === 0 ? (
                    <p className="text-white-50 small">No intel dropped yet. Be the first to review this gear.</p>
                ) : (
                    reviews.map((rev, idx) => (
                        <div className="col-md-6 mb-3" key={idx}>
                            <div className="review-card h-100">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="mb-0 text-white fw-bold">{rev.name}</h6>
                                    <div className="text-warning small">
                                        {[...Array(5)].map((_, i) => <i key={i} className={`bi bi-star${i < rev.rating ? '-fill' : ''}`}></i>)}
                                    </div>
                                </div>
                                <p className="text-white-50 small mb-0 lh-lg">"{rev.comment}"</p>
                                <div className="text-secondary x-small mt-2">{new Date(rev.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* --- 🔥 SIMILAR PRODUCTS SECTION (ఇది కదా మిస్ అయ్యింది) 🔥 --- */}
        {relatedProducts.length > 0 && (
            <div className="mt-5 pt-4 border-top border-secondary">
                <h4 className="brand-font mb-4">SIMILAR PRODUCTS</h4>
                <div className="row g-3">
                    {relatedProducts.map(rp => (
                        <div className="col-6 col-md-4 col-lg-3" key={rp._id}>
                            <Link to={`/product/${rp._id}`} className="related-card">
                                <img src={rp.img || rp.img1} className="related-img" alt={rp.name} />
                                <div className="p-3">
                                    <h6 className="text-white small text-truncate mb-1">{rp.name}</h6>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-danger fw-bold brand-font">₹{rp.price}</span>
                                        <span className="rating-badge" style={{fontSize:'0.6rem'}}>4.5 <i className="bi bi-star-fill ms-1"></i></span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* 🔥 STICKY BOTTOM ACTION BAR (Mobile View Only) 🔥 */}
      <div className="sticky-bottom-bar">
        <button className="action-btn btn-add rounded-0 w-50" style={{height:'45px', fontSize:'0.9rem'}} onClick={handleAddToCart} disabled={addingId === product._id}>
            {addingId === product._id ? <span>ADDED</span> : <span>ADD TO CART</span>}
        </button>
        <button className="action-btn btn-buy rounded-0 w-50" style={{height:'45px', fontSize:'0.9rem'}} onClick={handleBuyNow}>
            BUY NOW
        </button>
      </div>

      

    </div>
  );
};

export default ProductDetails;
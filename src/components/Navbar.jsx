import React, { useState, useContext, useEffect } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CartContext } from './CartContext'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const location = useLocation(); 
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('dragonUser');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
    
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://dragoncj-clothing-brand.onrender.com/api/products');
        const data = await res.json();
        setAllProducts(data);
      } catch (err) { console.log("Fetch error"); }
    };
    fetchProducts();
  }, [location]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(allProducts.slice(0, 4)); 
    } else {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  const totalItemsCount = cart.reduce((total, item) => total + item.qty, 0);

  const navStyles = `
    .nav-link-dragon { color: rgba(255, 255, 255, 0.7) !important; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.9rem; transition: 0.3s; position: relative; text-decoration: none; }
    .nav-link-dragon:hover { color: #D90429 !important; }
    
    .btn-premium-gold { border: 1px solid #FFD700; color: #FFD700 !important; padding: 5px 15px; font-family: 'Oswald', sans-serif; text-transform: uppercase; font-size: 0.8rem; text-decoration: none; transition: 0.3s; background: transparent; }
    .btn-premium-gold:hover { background: #FFD700; color: black !important; }

    .search-drawer {
      position: fixed; top: 0; right: -100%; width: 400px; max-width: 100%; height: 100vh;
      background: rgba(15, 15, 15, 0.7);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 10000; transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
      padding: 40px 25px; display: flex; flex-direction: column;
    }
    .search-drawer.active { right: 0; }
    
    .search-input-glass {
      background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
      color: white; padding: 15px; width: 100%; outline: none; font-family: 'Rajdhani';
      transition: 0.3s; border-radius: 4px;
    }
    .search-input-glass:focus { border-color: #D90429; box-shadow: 0 0 15px rgba(217, 4, 41, 0.2); }

    .suggestion-item {
      display: flex; align-items: center; gap: 15px; padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: 0.3s; text-decoration: none;
    }
    .suggestion-item:hover { background: rgba(255, 255, 255, 0.05); }

    .overlay-mask {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.4); z-index: 9999; display: none;
    }
    .overlay-mask.active { display: block; }
    
    @media (max-width: 991px) {
      .navbar-collapse {
        background: rgba(5, 5, 5, 0.95);
        padding: 20px;
        border-radius: 8px;
        margin-top: 15px;
        border: 1px solid #333;
      }
    }
  `;

  return (
    <>
      <style>{navStyles}</style>

      <div className={`overlay-mask ${isSearchOpen ? 'active' : ''}`} onClick={() => setIsSearchOpen(false)}></div>

      <div className={`search-drawer ${isSearchOpen ? 'active' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-5">
            <h5 className="brand-font text-white mb-0" style={{letterSpacing: '3px'}}>SEARCH_ARMORY</h5>
            <i className="bi bi-x-lg text-white-50 cursor-pointer" style={{cursor: 'pointer'}} onClick={() => setIsSearchOpen(false)}></i>
        </div>

        <input 
          type="text" className="search-input-glass" placeholder="What are you looking for?"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus
        />

        <div className="mt-5 flex-grow-1 overflow-auto">
          <p className="text-danger x-small fw-bold mb-3" style={{letterSpacing: '2px'}}>
            {searchQuery === "" ? "RECOMMENDED_UNITS" : "SEARCH_RESULTS"}
          </p>
          
          {filteredProducts.map((p) => (
            <Link to={`/product/${p._id}`} key={p._id} className="suggestion-item" onClick={() => setIsSearchOpen(false)}>
              <img src={p.img} style={{width: '50px', height: '50px', objectFit: 'cover'}} alt="" />
              <div>
                <h6 className="text-white small mb-0 text-uppercase">{p.name}</h6>
                <span className="text-white-50 x-small">₹{p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <nav className="navbar navbar-expand-lg fixed-top" 
           style={{ background: 'rgba(5, 5, 5, 0.85)', borderBottom: '1px solid #333', backdropFilter: 'blur(15px)' }}>
        <div className="container">
          
          <button 
            className="navbar-toggler border-0 shadow-none px-0" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} text-white fs-2`}></i>
          </button>

          <Link className="navbar-brand fw-bold text-white fs-3 mx-auto mx-lg-0" to="/" style={{ letterSpacing: '2px', fontFamily: 'Oswald' }}>
            DRAGON<span className="text-danger">CJ</span>
          </Link>

          <div className="d-flex align-items-center gap-3 gap-lg-4 order-lg-last">
            {/* Desktop లో ELITE ఇక్కడే ఉంటుంది */}
            <Link to="/elite" className="btn-premium-gold d-none d-lg-block">
              <i className="bi bi-gem me-1"></i> ELITE
            </Link>

            <i className="bi bi-search fs-5 text-white cursor-pointer" style={{cursor: 'pointer'}} onClick={() => setIsSearchOpen(true)}></i>
            
            {user ? (
              <Link to="/profile">
                <img src="https://secure.gravatar.com/avatar/ade92c42d3856d9536d29994c9f13110?s=128&d=wavatar" 
                     className="rounded-circle border border-danger" style={{ width: '30px' }} alt="" />
              </Link>
            ) : (
              <Link to="/login" className="nav-link-dragon small fw-bold d-none d-md-block">LOGIN</Link>
            )}
            
            <Link to="/cart" className="position-relative text-white">
              <i className="bi bi-bag fs-5"></i>
              {totalItemsCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{fontSize: '0.6rem'}}>{totalItemsCount}</span>}
            </Link>
          </div>

          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
            <ul className="navbar-nav mx-auto text-center mt-3 mt-lg-0">
              <li className="nav-item px-2"><Link className="nav-link nav-link-dragon" to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li className="nav-item px-2"><Link className="nav-link nav-link-dragon" to="/shop" onClick={() => setIsOpen(false)}>Shop All</Link></li>
              <li className="nav-item px-2"><Link className="nav-link nav-link-dragon" to="/Categories" onClick={() => setIsOpen(false)}>Categories</Link></li>
              <li className="nav-item px-2"><Link className="nav-link nav-link-dragon" to="/contactus" onClick={() => setIsOpen(false)}>Contact Us</Link></li>
              
              {/* 🔥 మొబైల్ లో ELITE బటన్ ఇక్కడ వస్తుంది 🔥 */}
              <li className="nav-item px-2 d-lg-none mt-4 mb-2">
                <Link to="/elite" className="btn-premium-gold w-100 d-inline-block py-2" onClick={() => setIsOpen(false)}>
                  <i className="bi bi-gem me-1"></i> ELITE
                </Link>
              </li>

              {!user && <li className="nav-item px-2 d-md-none mt-2"><Link className="nav-link nav-link-dragon text-danger" to="/login" onClick={() => setIsOpen(false)}>LOGIN / SIGNUP</Link></li>}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
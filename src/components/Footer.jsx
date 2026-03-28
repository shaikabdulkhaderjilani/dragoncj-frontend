import React from 'react';
import { Link } from 'react-router-dom'; // 🔥 కొత్తగా Link ని ఇన్‌పోర్ట్ చేశాను
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer = () => {
  const styles = `
    .footer-link { color: #888; text-decoration: none; display: block; margin-bottom: 8px; font-size: 0.9rem; transition: 0.3s; }
    .footer-link:hover { color: var(--dragon-red, #D90429); padding-left: 5px; } /* 🔥 Hover కి చిన్న యానిమేషన్ యాడ్ చేసా */
    .hover-white { transition: 0.3s; }
    .hover-white:hover { color: #fff !important; }
    .dragon-input-footer { background: transparent; border: 1px solid #444; color: white; padding: 10px; width: 100%; transition: 0.3s; }
    .dragon-input-footer:focus { outline: none; border-color: #D90429; box-shadow: 0 0 5px rgba(217, 4, 41, 0.5); }
  `;

  return (
    <footer className="bg-black text-white pt-5 mt-5 border-top border-secondary" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      <style>{styles}</style>
      <div className="container">
        <div className="row g-5 pb-5">
          <div className="col-md-4">
            <h3 className="text-white mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '1.5px' }}>
              DRAGON<span className="text-danger">CJ</span>
            </h3>
            <p className="text-white-50 mb-4" style={{maxWidth: '300px'}}>
              Forged in fire. We create premium apparel that speaks louder than words. No prints, just pure art.
            </p>
            <div className="d-flex gap-3">
              <a href="https://www.instagram.com/dragoncj_official?igsh=NzMwY3ZzZjVucmFu&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-white"><i className="bi bi-instagram fs-4"></i></a>
              <a href="https://wa.me/919182455287" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-white"><i className="bi bi-whatsapp fs-4"></i></a>
            </div>
          </div>
          <div className="col-md-2 col-6">
            <h5 className="text-white mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '1.5px' }}>SHOP</h5>
            {/* 🔥 a ట్యాగ్స్ తీసేసి, Link ట్యాగ్స్ పెట్టాను */}
            <Link to="/shop" className="footer-link">All Products</Link>
            <Link to="/shop" className="footer-link">New Arrivals</Link>
            <Link to="/shop" className="footer-link">Best Sellers</Link>
          </div>
          <div className="col-md-2 col-6">
            <h5 className="text-white mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '1.5px' }}>SUPPORT</h5>
            {/* 🔥 వీటికి కూడా పక్కా రూట్స్ ఇచ్చేశాను */}
            <Link to="/profile" className="footer-link">Track Order</Link>
            <Link to="/contactus" className="footer-link">Contact Us</Link>
            <Link to="/contactus" className="footer-link">Returns</Link>
          </div>
          <div className="col-md-4">
            <h5 className="text-white mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '1.5px' }}>JOIN THE CLAN</h5>
            <div className="input-group mb-3">
              <input type="email" className="dragon-input-footer" placeholder="Enter your email" />
              <button className="btn btn-danger text-uppercase fw-bold rounded-0" style={{ fontFamily: "'Oswald', sans-serif" }} type="button">SUBSCRIBE</button>
            </div>
          </div>
        </div>
        <div className="border-top border-secondary py-4 text-center text-md-start d-md-flex justify-content-between align-items-center">
          <p className="text-white-50 small mb-0">&copy; {new Date().getFullYear()} THE DRAGON CLAN.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
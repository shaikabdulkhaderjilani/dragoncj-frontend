import React, { useState, useContext, useEffect } from 'react'; 
import Navbar from './Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext'; 

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 1999 ? 0 : 59; 
  const total = subtotal + shipping;

  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', state: 'Andhra Pradesh', pincode: '', phone: ''
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('dragonUser'));
    if (savedUser) {
        setFormData(prev => ({
            ...prev,
            email: savedUser.email,
            firstName: savedUser.name.split(' ')[0]
        }));
    } else {
        navigate('/login', { state: { from: '/checkout' } });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Pincode and Phone validations (Numbers Only)
    if (name === "pincode" || name === "phone") {
        const re = /^[0-9\b]+$/;
        if (value !== "" && !re.test(value)) return;
    }
    if (name === "phone" && value.length > 10) return;
    if (name === "pincode" && value.length > 6) return;

    setFormData({ ...formData, [name]: value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (formData.phone.length !== 10) {
        alert("Phone number 10 digits undali mama!");
        return;
    }
    if (formData.pincode.length !== 6) {
        alert("Pincode 6 digits undali mama!");
        return;
    }
    if (!formData.lastName || !formData.address || !formData.city) {
        alert("All fields fill chey mama!");
        return;
    }

    setLoading(true);

    const orderData = {
        email: formData.email,
        items: cart.map(item => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            size: item.size || 'M',
            img: item.img
        })),
        totalAmount: total,
        shippingAddress: formData,
        paymentMethod: paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online Payment'
    };

    try {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok) {
            clearCart(); 
            navigate('/order-success', { 
                state: { 
                    orderId: data.orderId, 
                    items: cart, 
                    totalAmount: total,
                    shipping: shipping,
                    address: formData,
                    method: paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online Payment'
                } 
            });
        } else {
            alert("Error: " + data.error);
        }
    } catch (err) {
        console.error(err);
        alert("Server Offline! Could not place order.");
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

    .form-label { font-size: 0.9rem; color: #aaa; margin-bottom: 5px; }
    .dragon-form-control {
        background: transparent; border: 1px solid var(--border-color); color: white;
        padding: 12px; width: 100%; font-family: 'Rajdhani', sans-serif; transition: 0.3s;
    }
    .dragon-form-control:focus { outline: none; border-color: var(--dragon-red); box-shadow: 0 0 5px rgba(217, 4, 41, 0.5); }
    .dragon-form-control::placeholder { color: #444; }

    .order-summary-box {
        background: #080808; border: 1px solid var(--border-color); padding: 30px;
        position: sticky; top: 100px;
    }
    .summary-item-img { width: 60px; height: 80px; object-fit: cover; border: 1px solid #333; }
    
    .payment-option {
        border: 1px solid var(--border-color); padding: 15px; margin-bottom: 10px;
        cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: space-between;
    }
    .payment-option:hover, .payment-option.active {
        border-color: var(--dragon-red); background: rgba(217, 4, 41, 0.1);
    }
    .radio-circle {
        width: 20px; height: 20px; border: 2px solid #555; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
    }
    .payment-option.active .radio-circle { border-color: var(--dragon-red); }
    .payment-option.active .radio-circle::after {
        content: ''; width: 10px; height: 10px; background: var(--dragon-red); border-radius: 50%;
    }

    .pay-btn {
        background: var(--dragon-red); color: white; width: 100%; height: 55px;
        border: none; font-weight: bold; font-family: 'Oswald'; font-size: 1.3rem; letter-spacing: 1px;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 100%, 0 80%);
        transition: 0.3s; margin-top: 20px;
    }
    .pay-btn:hover:not(:disabled) { background: #ff0033; box-shadow: 0 0 20px var(--dragon-red); }
    .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; } 
  `;

  if (cart.length === 0) {
    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
            <style>{styles}</style>
            <h3 className="mb-4 text-white-50">YOUR CART IS EMPTY</h3>
            <Link to="/shop" className="btn btn-outline-danger font-oswald px-4 py-2">RETURN TO SHOP</Link>
        </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5">
      <style>{styles}</style>
      
      <Navbar />

      <div className="container" style={{marginTop: '100px', marginBottom: '100px'}}>
        
        <div className="d-flex gap-3 text-white-50 mb-5 small align-items-center">
            <Link to="/cart" className="text-decoration-none text-danger fw-bold">CART</Link> 
            <i className="bi bi-chevron-right"></i>
            <span className="text-white fw-bold">INFORMATION</span> 
            <i className="bi bi-chevron-right"></i>
            <span>SHIPPING</span> 
            <i className="bi bi-chevron-right"></i>
            <span>PAYMENT</span>
        </div>

        <form onSubmit={handlePayment} className="row g-5">
            
            <div className="col-lg-7">
                <h3 className="mb-4 border-bottom border-secondary pb-2">CONTACT INFORMATION</h3>
                <div className="mb-4">
                    <label className="form-label">EMAIL ADDRESS</label>
                    <input type="email" name="email" value={formData.email} className="dragon-form-control" placeholder="Enter your email" required onChange={handleInputChange}/>
                </div>

                <h3 className="mb-4 mt-5 border-bottom border-secondary pb-2">SHIPPING ADDRESS</h3>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">FIRST NAME</label>
                        <input type="text" name="firstName" value={formData.firstName} className="dragon-form-control" placeholder="Dragon" required onChange={handleInputChange}/>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">LAST NAME</label>
                        <input type="text" name="lastName" value={formData.lastName} className="dragon-form-control" placeholder="Clan Member" required onChange={handleInputChange}/>
                    </div>
                    <div className="col-12">
                        <label className="form-label">ADDRESS</label>
                        <input type="text" name="address" value={formData.address} className="dragon-form-control" placeholder="Street, House No, Apartment" required onChange={handleInputChange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">CITY</label>
                        <input type="text" name="city" value={formData.city} className="dragon-form-control" placeholder="Rajahmundry" required onChange={handleInputChange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">STATE</label>
                        <select name="state" value={formData.state} className="dragon-form-control text-secondary" onChange={handleInputChange}>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Karnataka">Karnataka</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">PIN CODE</label>
                        <input type="text" name="pincode" value={formData.pincode} className="dragon-form-control" placeholder="533101" required onChange={handleInputChange}/>
                    </div>
                    <div className="col-12">
                        <label className="form-label">PHONE NUMBER</label>
                        <input type="text" name="phone" value={formData.phone} className="dragon-form-control" placeholder="10 Digit Number" required onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="mt-5 d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-white-50 text-decoration-none small">
                        <i className="bi bi-chevron-left"></i> RETURN TO CART
                    </Link>
                </div>
            </div>

            <div className="col-lg-5">
                <div className="order-summary-box">
                    
                    <div className="mb-4 pb-4 border-bottom border-secondary">
                        {cart.map(item => (
                            <div className="d-flex align-items-center mb-3" key={item._id}>
                                <div className="position-relative">
                                    <img src={item.img} className="summary-item-img" alt={item.name} />
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {item.qty}
                                    </span>
                                </div>
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="mb-0 small fw-bold">{item.name}</h6>
                                    <span className="text-white-50 x-small">SIZE: {item.size || 'M'}</span>
                                </div>
                                <div className="fw-bold small">₹{item.price * item.qty}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4 pb-4 border-bottom border-secondary">
                        <div className="d-flex justify-content-between mb-2 text-white-50 small">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 text-white-50 small">
                            <span>Shipping</span>
                            <span className={shipping === 0 ? "text-success fw-bold" : "text-white"}>
                                {shipping === 0 ? "FREE" : `₹${shipping}`}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between mt-3 fs-5 fw-bold">
                            <span>TOTAL</span>
                            <span className="text-danger">₹{total}</span>
                        </div>
                    </div>

                    <h5 className="mb-3 fs-6 text-white-50">PAYMENT METHOD</h5>
                    
                    <div 
                        className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-qr-code-scan text-danger"></i>
                            <span className="small fw-bold">UPI / CARDS / NETBANKING</span>
                        </div>
                        <div className="radio-circle"></div>
                    </div>

                    <div 
                        className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-cash-stack text-success"></i>
                            <span className="small fw-bold">CASH ON DELIVERY</span>
                        </div>
                        <div className="radio-circle"></div>
                    </div>

                    <button type="submit" className="pay-btn" disabled={loading}>
                        {loading ? 'PROCESSING...' : (paymentMethod === 'cod' ? 'PLACE ORDER (COD)' : 'PAY NOW')}
                    </button>

                </div>
            </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
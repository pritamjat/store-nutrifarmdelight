'use client';

import { useEffect, useMemo, useState } from 'react';
import LogoutButton from './logout-button';

const PRODUCTS = [
  {
    id: 'nf-101',
    name: 'Organic Almond Granola',
    category: 'Breakfast',
    price: 349,
    rating: 4.8,
    stock: 'In stock',
    description: 'Crunchy granola with roasted almonds, chia seeds, and jaggery.',
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'nf-102',
    name: 'Cold-Pressed Avocado Oil',
    category: 'Healthy Oils',
    price: 699,
    rating: 4.6,
    stock: 'Limited stock',
    description: 'Premium kitchen staple packed with heart-friendly fats.',
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'nf-103',
    name: 'Farm Fresh Vegetable Box',
    category: 'Groceries',
    price: 899,
    rating: 4.9,
    stock: 'In stock',
    description: 'Weekly box of pesticide-free seasonal vegetables from local farms.',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'nf-104',
    name: 'Protein Millet Cookies',
    category: 'Snacks',
    price: 249,
    rating: 4.4,
    stock: 'In stock',
    description: 'Guilt-free cookies made with ragi, millet flour, and dark chocolate.',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80'
  }
];

const ORDER_HISTORY = [
  { id: 'ORD-9307', date: '24 Feb 2026', items: 3, total: 1547, status: 'Delivered' },
  { id: 'ORD-9241', date: '19 Feb 2026', items: 2, total: 1048, status: 'Delivered' },
  { id: 'ORD-9112', date: '09 Feb 2026', items: 5, total: 3289, status: 'Shipped' }
];

const PAYMENT_HISTORY = [
  { id: 'PAY-78453', date: '24 Feb 2026', method: 'Razorpay UPI', amount: 1547, status: 'Success' },
  { id: 'PAY-77234', date: '19 Feb 2026', method: 'Card via Razorpay', amount: 1048, status: 'Success' },
  { id: 'PAY-75429', date: '09 Feb 2026', method: 'Netbanking', amount: 3289, status: 'Success' }
];

const TABS = ['Products', 'Cart', 'Checkout', 'Order History', 'Payments', 'Profile'];

export default function Storefront({ user }) {
  const [activeTab, setActiveTab] = useState('Products');
  const [cart, setCart] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    mobile: '9876543210'
  });

  useEffect(() => {
    if (typeof window === 'undefined' || window.Razorpay) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const cartSummary = useMemo(() => {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
    const delivery = subtotal > 0 ? 49 : 0;
    const discount = subtotal > 1500 ? 120 : 0;
    const total = subtotal + delivery - discount;

    return { totalItems, subtotal, delivery, discount, total };
  }, [cart]);

  function addToCart(product) {
    setCheckoutMessage('');
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...currentCart, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  }

  function updateQty(productId, delta) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, qty: Math.max(item.qty + delta, 0) } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function saveProfile(event) {
    event.preventDefault();
    setProfileMessage('Profile details updated successfully.');
  }

  function createCheckoutOptions() {
    return {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo123456789',
      amount: cartSummary.total * 100,
      currency: 'INR',
      name: 'NutriFarm Delight',
      description: `Checkout for ${cartSummary.totalItems} item(s)`,
      image: 'https://cdn-icons-png.flaticon.com/512/2153/2153788.png',
      theme: { color: '#22c55e' },
      prefill: {
        name: profile.name,
        email: profile.email,
        contact: profile.mobile
      },
      notes: {
        customer: profile.name,
        email: profile.email,
        mobile: profile.mobile
      },
      handler: (response) => {
        setCheckoutMessage(`Payment captured successfully. Transaction: ${response.razorpay_payment_id}`);
        setCart([]);
      }
    };
  }

  function handleCheckout() {
    setCheckoutMessage('');
    if (cartSummary.total === 0) {
      setCheckoutMessage('Your cart is empty. Add products before checkout.');
      return;
    }

    if (typeof window !== 'undefined' && window.Razorpay) {
      const paymentObject = new window.Razorpay(createCheckoutOptions());
      paymentObject.on('payment.failed', (error) => {
        setCheckoutMessage(error?.error?.description || 'Payment failed. Try another method.');
      });
      paymentObject.open();
      return;
    }

    setCheckoutMessage(
      'Razorpay SDK is not loaded in this environment. Simulated successful checkout for demo.'
    );
    setCart([]);
  }

  return (
    <main className="store-shell">
      <header className="store-header">
        <div>
          <p className="eyebrow">NutriFarm Delight Marketplace</p>
          <h1>Welcome back, {profile.name}</h1>
          <p className="subtle">Discover healthy products, manage your orders, and pay securely.</p>
        </div>
        <div className="header-actions">
          <span className="pill">{profile.email}</span>
          <div className="profile-menu-wrapper">
            <button
              type="button"
              className="profile-icon-btn"
              onClick={() => setProfileOpen((current) => !current)}
              aria-label="Open profile menu"
            >
              👤
            </button>
            {profileOpen && (
              <div className="profile-menu">
                <p className="profile-menu-title">My Profile</p>
                <label htmlFor="menu-name">
                  Name
                  <input
                    id="menu-name"
                    value={profile.name}
                    onChange={(event) => {
                      setProfileMessage('');
                      setProfile((current) => ({ ...current, name: event.target.value }));
                    }}
                  />
                </label>
                <label htmlFor="menu-mobile">
                  Mobile number
                  <input
                    id="menu-mobile"
                    value={profile.mobile}
                    onChange={(event) => {
                      setProfileMessage('');
                      setProfile((current) => ({ ...current, mobile: event.target.value }));
                    }}
                  />
                </label>
                <button type="button" onClick={saveProfile}>
                  Save
                </button>
                {profileMessage && <p className="success profile-msg">{profileMessage}</p>}
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="tab-bar" aria-label="Store sections">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'Products' && (
        <section className="panel products-grid">
          {PRODUCTS.map((product) => (
            <article key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="product-content">
                <p className="chip">{product.category}</p>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="row">
                  <strong>₹{product.price}</strong>
                  <span>⭐ {product.rating}</span>
                </div>
                <div className="row">
                  <small>{product.stock}</small>
                  <button type="button" onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'Cart' && (
        <section className="panel">
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p className="subtle">Your cart is empty. Add products from the Products tab.</p>
          ) : (
            <>
              <div className="list">
                {cart.map((item) => (
                  <div key={item.id} className="list-row">
                    <div>
                      <strong>{item.name}</strong>
                      <p>₹{item.price} each</p>
                    </div>
                    <div className="qty-controls">
                      <button type="button" onClick={() => updateQty(item.id, -1)}>
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Summary summary={cartSummary} />
            </>
          )}
        </section>
      )}

      {activeTab === 'Checkout' && (
        <section className="panel checkout-grid">
          <div>
            <h2>Checkout</h2>
            <p className="subtle">Shipping address</p>
            <div className="address-box">
              <strong>{profile.name}</strong>
              <p>221 Green Valley Road, Bengaluru, Karnataka - 560001</p>
              <p>Phone: +91 {profile.mobile}</p>
            </div>
            <p className="subtle">Payment gateway</p>
            <p>
              Razorpay is configured. Set <code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code> for your live/test key.
            </p>
            <button type="button" onClick={handleCheckout}>
              Pay ₹{cartSummary.total} with Razorpay
            </button>
            {checkoutMessage && <p className="success">{checkoutMessage}</p>}
          </div>
          <Summary summary={cartSummary} />
        </section>
      )}

      {activeTab === 'Order History' && (
        <section className="panel">
          <h2>Order history</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ORDER_HISTORY.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>₹{order.total}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'Payments' && (
        <section className="panel">
          <h2>Payment history</h2>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENT_HISTORY.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.date}</td>
                  <td>{payment.method}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'Profile' && (
        <section className="panel profile-grid">
          <form onSubmit={saveProfile}>
            <h2>Profile</h2>
            <p className="subtle">Update your details from here as well.</p>
            <label htmlFor="profile-name">
              Name
              <input
                id="profile-name"
                value={profile.name}
                onChange={(event) => {
                  setProfileMessage('');
                  setProfile((current) => ({ ...current, name: event.target.value }));
                }}
              />
            </label>
            <label htmlFor="profile-mobile">
              Mobile number
              <input
                id="profile-mobile"
                value={profile.mobile}
                onChange={(event) => {
                  setProfileMessage('');
                  setProfile((current) => ({ ...current, mobile: event.target.value }));
                }}
              />
            </label>
            <button type="submit">Save profile</button>
            {profileMessage && <p className="success">{profileMessage}</p>}
          </form>
          <div className="stats-box">
            <h3>Quick stats</h3>
            <p>Email: {profile.email}</p>
            <p>Orders this month: 4</p>
            <p>Total savings: ₹540</p>
            <p>Loyalty points: 1280</p>
          </div>
        </section>
      )}
    </main>
  );
}

function Summary({ summary }) {
  return (
    <aside className="summary-box">
      <h3>Bill summary</h3>
      <p>
        <span>Items</span>
        <strong>{summary.totalItems}</strong>
      </p>
      <p>
        <span>Subtotal</span>
        <strong>₹{summary.subtotal}</strong>
      </p>
      <p>
        <span>Delivery</span>
        <strong>₹{summary.delivery}</strong>
      </p>
      <p>
        <span>Discount</span>
        <strong>-₹{summary.discount}</strong>
      </p>
      <hr />
      <p>
        <span>Total</span>
        <strong>₹{summary.total}</strong>
      </p>
    </aside>
  );
}

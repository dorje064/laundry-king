import React, { useState } from 'react';
import './OrderPage.scss';
import { ClothItem, OrderState } from '../types';
import { useMutation } from '@tanstack/react-query';
import { submitOrder } from '../api/orders';

const CLOTH_ITEMS: ClothItem[] = [
  { id: 'shirt', name: 'Shirt', icon: '👔', price: 35 },
  { id: 'tshirt', name: 'T-Shirt', icon: '👕', price: 25 },
  { id: 'pants', name: 'Pants', icon: '👖', price: 45 },
  { id: 'dress', name: 'Dress', icon: '👗', price: 80 },
  { id: 'jacket', name: 'Jacket', icon: '🧥', price: 70 },
];

const OrderPage: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    CLOTH_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderState | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: submitOrder,
    onSuccess: (data: OrderState) => {
      console.log('Order Submitted:', data);
      setSubmittedOrder(data);
      // Reset form
      setQuantities(CLOTH_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}));
      setPhone('');
      setLocation('');
    },
    onError: (error: unknown) => {
      console.error('Failed to submit order:', error);
      alert('Failed to submit order. Please try again.');
    }
  });

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert('Unable to retrieve your location');
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData: OrderState = {
      items: Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => {
          const item = CLOTH_ITEMS.find(i => i.id === id)!;
          return {
            item: item.name,
            qty,
            price: item.price
          }
        }),
      phone,
      location,
      total: CLOTH_ITEMS.reduce((sum, item) => sum + (quantities[item.id] * item.price), 0)
    };

    mutate(orderData);
  };

  if (submittedOrder) {
    return (
      <div className="order-page container">
        <div className="success-message">
          <span className="success-icon">🎉</span>
          <h2>Order Received!</h2>
          <p>Thank you for choosing Laundry King.</p>
          <p>Your order for <strong>{submittedOrder.items.reduce((acc, i) => acc + i.qty, 0)} items</strong> has been placed.</p>
          <p>Total: <strong>₹{submittedOrder.total}</strong></p>
          <br />
          <button className="btn btn-primary" onClick={() => setSubmittedOrder(null)}>
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page container">
      <header className="page-header">
        <h2>Place Your Order</h2>
        <p>Select your items and we'll take care of the rest.</p>
      </header>

      <form onSubmit={handleSubmit} className="order-form">

        {/* Section 1: Cloth Picker */}
        <section className="card form-section">
          <h3>🧺 Select Cloths</h3>
          <div className="cloth-grid">
            {CLOTH_ITEMS.map(item => (
              <div key={item.id} className={`cloth-item ${quantities[item.id] > 0 ? 'active' : ''}`}>
                <div className="cloth-icon">{item.icon}</div>
                <div className="cloth-info">
                  <span className="cloth-name">{item.name}</span>
                  <span className="cloth-price">₹{item.price}</span>
                </div>
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={quantities[item.id] === 0}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantities[item.id]}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Contact Info */}
        <section className="card form-section">
          <h3>📱 Contact Details</h3>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </section>

        {/* Section 3: Location */}
        <section className="card form-section">
          <h3>📍 Pickup Location</h3>
          <div className="form-group location-group">
            <label htmlFor="location">Address</label>
            <div className="location-input-wrapper">
              <textarea
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter pickup address or use auto-detect"
                rows={3}
                required
              />
              <button
                type="button"
                className={`btn btn-outline location-btn ${isLocating ? 'loading' : ''}`}
                onClick={handleAutoLocation}
              >
                {isLocating ? 'Locating...' : '🎯 Auto Detect'}
              </button>
            </div>
          </div>
        </section>

        <button type="submit" className="btn btn-primary submit-btn" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Confirm Order Request'}
        </button>

      </form>
    </div>
  );
};

export default OrderPage;

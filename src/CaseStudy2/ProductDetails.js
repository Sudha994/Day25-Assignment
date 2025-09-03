import React, { useState, useEffect } from 'react';
import './ProductDetails.css';

const ProductDetails = ({ productId, onBack }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details. Please try again.');
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(10, prev + 1));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.title} to cart!`);
  };

  if (!productId) {
    return (
      <div className="error-container">
        <div className="error-icon">❓</div>
        <h2>No Product Selected</h2>
        <p>Please select a product to view details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <div className="error-icon">❓</div>
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <button onClick={onBack} className="back-link">
        ← Back to Products
      </button>
      
      <div className="product-details">
        <div className="product-image-section">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
        </div>
        
        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-rating">
            <div className="rating-stars">
              {"★".repeat(Math.round(product.rating.rate))}
              {"☆".repeat(5 - Math.round(product.rating.rate))}
            </div>
            <span className="rating-value">{product.rating.rate} / 5</span>
            <span className="rating-count">({product.rating.count} reviews)</span>
          </div>
          
          <div className="product-price">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-category">
            <span className="category-label">Category:</span>
            <span className="category-value">{product.category}</span>
          </div>
          
          <div className="purchase-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button onClick={decrementQuantity} className="quantity-btn">-</button>
                <input 
                  type="number" 
                  id="quantity"
                  min="1" 
                  max="10" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                />
                <button onClick={incrementQuantity} className="quantity-btn">+</button>
              </div>
            </div>
            
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
      
      <div className="product-features">
        <h2>Product Features</h2>
        <ul>
          <li>Free shipping on orders over $50</li>
          <li>30-day money-back guarantee</li>
          <li>Secure payment processing</li>
          <li>24/7 customer support</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
import React, { useState, useEffect } from 'react';
import './ProductListing.css';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories.');
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (category) => {
    if (category === 'all') {
      fetchProducts();
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductsByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleRetry = () => {
    setError(null);
    if (selectedCategory === 'all') {
      fetchProducts();
    } else {
      fetchProductsByCategory(selectedCategory);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="product-listing-container">
      <h1 className="page-title">Our Products</h1>
      
      <div className="category-filter">
        <button 
          className={selectedCategory === 'all' ? 'category-btn active' : 'category-btn'}
          onClick={() => setSelectedCategory('all')}
        >
          All Products
        </button>
        {categories.map(category => (
          <button 
            key={category}
            className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <div className="product-rating">
                  <span className="rating-stars">{"★".repeat(Math.round(product.rating.rate))}</span>
                  <span className="rating-count">({product.rating.count})</span>
                </div>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
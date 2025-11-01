import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />
        <div className="product-category">{product.category}</div>
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price}</div>
        
        <div className="product-actions">
          <Link 
            to={`/products/edit/${product._id}`} 
            className="btn btn-secondary"
          >
            Edit
          </Link>
          <button 
            onClick={() => onDelete(product._id)} 
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
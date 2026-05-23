import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct } from '../redux/productSlice';

const ProductItem = ({ product }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      dispatch(deleteProduct(product.id));
    }
  };

  const handleEdit = () => {
    navigate(`/edit-product/${product.id}`);
  };

  // Fallback for missing/failed images
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
  };

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card transition-all">
        <div className="position-relative product-img-container bg-light d-flex align-items-center justify-content-center">
          <img
            src={product.image}
            alt={product.title}
            className="product-img object-fit-contain"
            onError={handleImageError}
          />
          <span className="position-absolute top-0 end-0 badge bg-dark m-3 rounded-pill text-uppercase font-monospace px-3 py-2 fs-7">
            {product.category}
          </span>
        </div>
        <div className="card-body d-flex flex-column p-4">
          <h5 className="card-title text-dark fw-bold mb-2 text-truncate-2" title={product.title}>
            {product.title}
          </h5>
          <div className="d-flex align-items-baseline mb-3">
            <span className="fs-4 fw-black text-primary">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="mt-auto pt-3 border-top d-flex gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleEdit}
                  className="btn btn-outline-primary btn-sm w-100 rounded-3 d-flex align-items-center justify-content-center gap-1 py-2 fw-semibold"
                >
                  <i className="bi bi-pencil-square"></i> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-outline-danger btn-sm w-100 rounded-3 d-flex align-items-center justify-content-center gap-1 py-2 fw-semibold"
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </>
            ) : (
              <div className="text-muted small text-center w-100 py-1 font-monospace">
                <i className="bi bi-lock me-1"></i> Sign in to edit/delete
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

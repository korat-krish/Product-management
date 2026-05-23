import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import ProductItem from './ProductItem';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState(''); // 'priceLowHigh', 'priceHighLow' or ''

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = ['Electronics', 'Fashion', 'Home & Living', 'Fitness & Sports'];

  // Handle resets
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
  };

  // Filtered and Sorted list derivation
  const processedProducts = React.useMemo(() => {
    let result = [...items];

    // Search filter (by title, case-insensitive)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.title.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== '') {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort by price
    if (sortBy === 'priceLowHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighLow') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [items, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="container mt-4 mb-5">
      {/* Search, Filter, and Sort Controls Card */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 control-panel glass-panel">
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">Search Products</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 focus-ring-custom"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">Filter Category</label>
              <select
                className="form-select bg-light border-0 focus-ring-custom"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">Sort By</label>
              <select
                className="form-select bg-light border-0 focus-ring-custom"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Default (Order Added)</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="col-12 col-md-2 d-md-flex align-items-end h-100 mt-md-4 pt-1">
              <button
                onClick={handleResetFilters}
                className="btn btn-outline-secondary w-100 rounded-3"
                disabled={!searchTerm && !selectedCategory && !sortBy}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Reset
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main product view area */}
      {loading && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="mt-2 text-muted fw-semibold">Loading catalog items...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger rounded-4 p-4 shadow-sm" role="alert">
          <h4 className="alert-heading fw-bold">
            <i className="bi bi-exclamation-octagon-fill me-2"></i>Error fetching catalog
          </h4>
          <p className="mb-0">{error}</p>
          <hr />
          <button
            onClick={() => dispatch(fetchProducts())}
            className="btn btn-danger btn-sm rounded-3 mt-2"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="text-muted fw-semibold">
              Showing {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {processedProducts.length === 0 ? (
            <div className="card shadow-sm border-0 rounded-4 text-center py-5">
              <div className="card-body">
                <i className="bi bi-archive-fill text-muted display-1"></i>
                <h4 className="mt-3 fw-bold">No Products Found</h4>
                <p className="text-muted">Try adjusting your filters, search term, or add a new product.</p>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-primary rounded-pill px-4 bg-gradient-custom border-0 shadow-sm mt-2"
                >
                  Clear Search & Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {processedProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;

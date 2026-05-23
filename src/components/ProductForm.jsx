import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct, fetchProducts } from '../redux/productSlice';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEditMode = !!id;
  const products = useSelector((state) => state.products.items);
  const existingProduct = products.find((item) => String(item.id) === String(id));

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [validated, setValidated] = useState(false);

  // If products are not loaded, fetch them (helps if user Refreshes on edit page)
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setTitle(existingProduct.title);
      setPrice(existingProduct.price.toString());
      setCategory(existingProduct.category);
      setImage(existingProduct.image);
    }
  }, [isEditMode, existingProduct]);

  const categories = ['Electronics', 'Fashion', 'Home & Living', 'Fitness & Sports'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const productData = {
      title: title.trim(),
      price: parseFloat(price),
      category,
      image: image.trim() || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60',
    };

    if (isEditMode) {
      dispatch(updateProduct({ ...productData, id }))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((err) => {
          alert(`Error updating product: ${err}`);
        });
    } else {
      // Generate a unique ID (JSON server also auto-assigns, but good practice to construct it or let it handle)
      const newProduct = {
        ...productData,
        id: Date.now().toString()
      };
      dispatch(addProduct(newProduct))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((err) => {
          alert(`Error adding product: ${err}`);
        });
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4 glow-card">
            <div className="card-header bg-gradient-custom text-white text-center py-4">
              <h3 className="mb-0 fw-bold">{isEditMode ? 'Update Product' : 'Add New Product'}</h3>
              <p className="small mb-0 text-white-50">
                {isEditMode ? 'Modify catalog details' : 'List a new item in the storefront'}
              </p>
            </div>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit} noValidate className={validated ? 'was-validated' : ''}>
                
                {/* Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold">Product Title</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control bg-light border-0 focus-ring-custom py-2"
                    placeholder="Enter product title (e.g. Mechanical Keyboard)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    minLength="3"
                  />
                  <div className="invalid-feedback">Product title is required and must be at least 3 characters.</div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label htmlFor="price" className="form-label fw-semibold">Price ($)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">$</span>
                    <input
                      type="number"
                      id="price"
                      className="form-control bg-light border-0 focus-ring-custom py-2"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter a valid price greater than 0.</div>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="form-label fw-semibold">Category</label>
                  <select
                    id="category"
                    className="form-select bg-light border-0 focus-ring-custom py-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">Please select a product category.</div>
                </div>

                {/* Image URL */}
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">Product Image URL</label>
                  <input
                    type="url"
                    id="image"
                    className="form-control bg-light border-0 focus-ring-custom py-2"
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">Please enter a valid URL for the product image.</div>
                  <div className="form-text text-muted small">
                    You can use: <code>/images/headphones.png</code>, <code>/images/watch.png</code>, <code>/images/shoes.png</code>, or <code>/images/wallet.png</code>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn btn-outline-secondary w-50 py-2.5 rounded-3 fw-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-50 py-2.5 rounded-3 fw-bold bg-gradient-custom border-0 shadow"
                  >
                    {isEditMode ? 'Update Product' : 'Save Product'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

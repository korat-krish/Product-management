import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top mb-4 glass-nav">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-box-seam-fill text-primary me-2 fs-3"></i>
          <span className="fw-bold bg-gradient-custom-text">ApexStore</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                to="/"
              >
                <i className="bi bi-grid-fill me-1"></i> Products
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                  to="/add-product"
                >
                  <i className="bi bi-plus-circle-fill me-1"></i> Add Product
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-light-50 d-none d-sm-inline small">
                  <i className="bi bi-person-circle text-primary me-1"></i>
                  Logged in as <strong className="text-light">{user?.name || 'Admin'}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm px-3 rounded-pill"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm px-4 rounded-pill bg-gradient-custom border-0 shadow-sm">
                <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

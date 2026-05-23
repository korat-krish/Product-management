import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    
    // For demo purposes, allow any non-empty credentials
    const success = dispatch(loginUser({ email, password }));
    if (success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg('Invalid email or password.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden glow-card">
            <div className="card-header bg-gradient-custom text-white text-center py-4">
              <h3 className="mb-0 fw-bold">Sign In</h3>
              <p className="small mb-0 text-white-50">Manage products, modify inventory & more</p>
            </div>
            <div className="card-body p-4 p-md-5">
              {errorMsg && (
                <div className="alert alert-danger rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errorMsg}
                </div>
              )}
              
              <div className="alert alert-info py-2 rounded-3 small">
                <i className="bi bi-info-circle-fill me-2"></i>
                You can log in with any email and password combination.
              </div>

              <form onSubmit={handleSubmit} noValidate className={validated ? 'was-validated' : ''}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control bg-light border-start-0 focus-ring-custom"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Please enter a valid email address.</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control bg-light border-start-0 focus-ring-custom"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength="4"
                    />
                    <div className="invalid-feedback">Password must be at least 4 characters.</div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold bg-gradient-custom border-0 shadow">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

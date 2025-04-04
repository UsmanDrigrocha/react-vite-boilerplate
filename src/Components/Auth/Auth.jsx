import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../Navbar/NavBar';
import { backendURL, loginTokenKey } from '../../Utils/utils';
import { showErrToast, showSuccessToast } from '../../Utils/toastUtils';
import './Auth.css'

const Auth = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);
  let [showVerification, setShowVerification] = useState(false);
  const [verifyPageContent, setVerifyPageContent] = useState('');
  const [token, setToken] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '' });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { token: routeToken } = useParams();

  const isAuthenticated = () => {
    return !!localStorage.getItem(loginTokenKey);
  };

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLoginPage(true);
    } else {
      setIsLoginPage(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (routeToken) {
      setShowVerification(true)
      setToken(routeToken);
      setVerifyPageContent('Verifying...');
      verifyAccount(routeToken);
    }
  }, [routeToken]);

  useEffect(() => {
    if (isAuthenticated() && !routeToken) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, routeToken]);

  const handleFormChange = (event, formType) => {
    const { name, value } = event.target;
    if (formType === 'login') {
      setLoginForm({ ...loginForm, [name]: value });
    } else {
      setRegisterForm({ ...registerForm, [name]: value });
    }
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (validateLoginForm()) {
      setLoading(true);
      axios.post(`${backendURL}/api/user/login`, loginForm)
        .then(res => {
          saveToken(res.data.Token);
          navigate('/dashboard');
        })
        .catch(err => {
          showErrToast(err.status === 401 ? 'Unauthorized!' : 'Error during login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showErrToast('Invalid login form');
    }
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (validateRegisterForm()) {
      setLoading(true);
      axios.post(`${backendURL}/api/user/register`, registerForm)
        .then(() => {
          setShowVerification(true);
          setTimeout(() => {
            setShowVerification(false);
          }, 3500);
        })
        .catch(err => {
          showErrToast(err?.response?.status === 409 ? 'Already Registered!' : 'Error during registration');
          setShowVerification(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showErrToast('Invalid registration form');
      setShowVerification(false);
    }
  };

  const validateLoginForm = () => {
    return loginForm.email && loginForm.password.length >= 4;
  };

  const validateRegisterForm = () => {
    return registerForm.email && registerForm.password.length >= 4;
  };

  const verifyAccount = (token) => {
    axios.get(`${backendURL}/api/user/verify-account/${token}`)
      .then(() => {
        setVerifyPageContent('Account Verified! Navigating to login...');
        setTimeout(() => {
          setShowVerification(false)
          navigate('/login');
        }, 3500);
      })
      .catch(() => {
        setVerifyPageContent('Token Expired! Navigating to register...');
        setTimeout(() => {
          setShowVerification(false)
          navigate('/register');
        }, 3500);
      });
  };

  const saveToken = (token) => {
    localStorage.setItem(loginTokenKey, token);
  };

  return (
    <div>
      <NavBar></NavBar>
      {isLoginPage && !showVerification ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => handleFormChange(e, 'login')}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => handleFormChange(e, 'login')}
              />
            </div>
            <button type="submit" disabled={!validateLoginForm() || loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      ) : !isLoginPage && !showVerification ? (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => handleFormChange(e, 'register')}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) => handleFormChange(e, 'register')}
              />
            </div>
            <button type="submit" disabled={!validateRegisterForm() || loading}>
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>
        </div>
      ) : showVerification ? (
        <div>
          <h1>{verifyPageContent || "Verification Email Sent! Check your inbox/spam"}</h1>
        </div>
      ) : null}
    </div>
  );
};

export default Auth;

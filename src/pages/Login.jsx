import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          await supabase.from('riwayat').insert([
            {
              user_email: user.user.email,
              action: 'User logged in',
            },
          ]);
        }
        navigate('/admin');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forgotPasswordMode) {
      handlePasswordReset();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{forgotPasswordMode ? 'Reset Password' : 'Admin Login'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!forgotPasswordMode && (
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading
              ? 'Sending...'
              : forgotPasswordMode
              ? 'Send Reset Link'
              : 'Login'}
          </button>
        </form>
        <div className="login-links">
          {forgotPasswordMode ? (
            <a href="#" onClick={() => setForgotPasswordMode(false)}>
              Back to Login
            </a>
          ) : (
            <a href="#" onClick={() => setForgotPasswordMode(true)}>
              Forgot Password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

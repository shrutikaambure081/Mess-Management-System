import React, { useState, useEffect } from 'react';

export default function Login({ apiBase, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');

  // Check if backend server is running
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${apiBase}/api/health`);
        if (res.ok) {
          setServerStatus('connected');
        } else {
          setServerStatus('error');
        }
      } catch (err) {
        setServerStatus('error');
      }
    };
    checkServer();
    // Check every 5 seconds
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, [apiBase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister
        ? { name, email, password, role }
        : { email, password };

      const res = await fetch(apiBase + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // Check if response is ok before parsing JSON
      let data;
      try {
        const text = await res.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        if (!res.ok) {
          setError(`Server error (${res.status}): Unable to parse response. Is the backend server running?`);
        } else {
          setError('Invalid response from server');
        }
        return;
      }

      if (!res.ok) {
        setError(data.message || `Request failed (${res.status})`);
        return;
      }

      onLogin(data);
    } catch (err) {
      console.error('Login error:', err);
      // More specific error messages
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please ensure the backend server is running on http://localhost:5000');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Network error: ' + err.toString());
      }
    }
  };

  return (
    <div className="login-page">
      <div className="card auth-card login-panel">
        <div className="login-panel-left">
          <h2 className="login-title">Mess Booking</h2>

          <div className="login-role-toggle">
            <button
              type="button"
              className={role === 'student' ? 'role-btn active' : 'role-btn'}
              onClick={() => setRole('student')}
            >
              <span className="role-icon">🎓</span>
              <span>Login as Student</span>
            </button>
            <button
              type="button"
              className={role === 'manager' ? 'role-btn active' : 'role-btn'}
              onClick={() => setRole('manager')}
            >
              <span className="role-icon">🧑‍💼</span>
              <span>Login as Manager</span>
            </button>
          </div>
        </div>

        <div className="login-panel-right">
          <h3 className="login-mode-heading">{isRegister ? 'Create an account' : 'Sign in to continue'}</h3>
          <form onSubmit={handleSubmit} className="form login-form">
            {isRegister && (
              <div className="form-group floating-group">
                <input
                  type="text"
                  className="floating-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder=" "
                />
                <label className="floating-label">Name</label>
              </div>
            )}

            <div className="form-group floating-group">
              <input
                type="email"
                className="floating-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label className="floating-label">Email</label>
            </div>

            <div className="form-group floating-group">
              <input
                type="password"
                className="floating-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
              />
              <label className="floating-label">Password</label>
            </div>

            {isRegister && (
              <div className="form-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            )}

            {serverStatus === 'error' && (
              <div className="error-text" style={{ marginBottom: '12px' }}>
                ⚠️ Backend server not connected. Please ensure the server is running on {apiBase}
              </div>
            )}
            {serverStatus === 'checking' && (
              <div style={{ marginBottom: '12px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                🔄 Checking server connection...
              </div>
            )}

            {error && <div className="error-text">{error}</div>}

            <button 
              type="submit" 
              className="primary-btn"
              disabled={serverStatus === 'error'}
              style={{ opacity: serverStatus === 'error' ? 0.6 : 1, cursor: serverStatus === 'error' ? 'not-allowed' : 'pointer' }}
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
          </form>

          <button
            type="button"
            className="link-btn"
            onClick={() => setIsRegister((v) => !v)}
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

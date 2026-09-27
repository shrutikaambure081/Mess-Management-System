import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import Student from './pages/Student.jsx';
import Manager from './pages/Manager.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'manager') {
      setView('manager');
    } else {
      setView('student');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>College Mess Meal Booking</h1>
        {user && (
          <div className="header-right">
            <span>{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      <main className="app-main">
        {view === 'login' && <Login apiBase={API_BASE} onLogin={handleLogin} />}
        {view === 'student' && user && (
          <Student apiBase={API_BASE} user={user} />
        )}
        {view === 'manager' && user && (
          <Manager apiBase={API_BASE} />
        )}
      </main>
    </div>
  );
}

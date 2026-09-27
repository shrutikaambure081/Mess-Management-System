import React, { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard.jsx';

export default function Manager({ apiBase }) {
  const [selectedTab, setSelectedTab] = useState('overview');

  const [todaySummary, setTodaySummary] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const [complaints, setComplaints] = useState([]);

  const [skipSummaries, setSkipSummaries] = useState([]);

  const [fees, setFees] = useState([]);
  const [feeStatusChanges, setFeeStatusChanges] = useState({});

  const [menuDate, setMenuDate] = useState(() => {
    const d = new Date();
    return d.toISOString().substring(0, 10);
  });
  const [menu, setMenu] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: '',
  });

  const fetchOverview = async () => {
    try {
      const resToday = await fetch(`${apiBase}/api/manager/today-summary`);
      const dataToday = await resToday.json();
      if (resToday.ok) {
        setTodaySummary(dataToday);
      }

      const resPred = await fetch(`${apiBase}/api/manager/predict`);
      const dataPred = await resPred.json();
      if (resPred.ok) {
        setPrediction(dataPred);
      }
    } catch {
      // ignore
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${apiBase}/api/complaints`);
      const data = await res.json();
      if (res.ok) {
        setComplaints(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchSkipSummaries = async () => {
    try {
      const res = await fetch(`${apiBase}/api/skipdays`);
      const data = await res.json();
      if (res.ok) {
        setSkipSummaries(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchFees = async () => {
    try {
      const res = await fetch(`${apiBase}/api/fees/monthly/all`);
      const data = await res.json();
      if (res.ok) {
        setFees(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${apiBase}/api/menu?date=${menuDate}`);
      const data = await res.json();
      if (res.ok && data) {
        setMenu({
          breakfast: data.breakfast || '',
          lunch: data.lunch || '',
          dinner: data.dinner || '',
          snacks: data.snacks || '',
        });
      } else {
        setMenu({ breakfast: '', lunch: '', dinner: '', snacks: '' });
      }
    } catch {
      setMenu({ breakfast: '', lunch: '', dinner: '', snacks: '' });
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchComplaints();
    fetchSkipSummaries();
    fetchFees();
    fetchMenu();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFees();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [menuDate]);

  const resolveComplaint = async (id) => {
    try {
      const res = await fetch(`${apiBase}/api/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setComplaints((prev) => prev.map((c) => (c._id === id ? data : c)));
    } catch {
      // ignore
    }
  };

  const handleFeeStatusChange = (id, status) => {
    setFeeStatusChanges((prev) => ({ ...prev, [id]: status }));
  };

  const updateFee = async (id) => {
    const status = feeStatusChanges[id];
    if (!status) return;
    try {
      if (status === 'paid') {
        const fee = fees.find((f) => f._id === id);
        if (!fee) return;
        const res = await fetch(`${apiBase}/api/fees/markPaid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: fee.userId,
            month: fee.month,
            year: fee.year,
          }),
        });
        const data = await res.json();
        if (!res.ok) return;
        setFees((prev) => prev.map((f) => (f._id === id ? data : f)));
      }
    } catch {
      // ignore
    }
  };

  const saveMenu = async () => {
    try {
      await fetch(`${apiBase}/api/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: menuDate,
          ...menu,
        }),
      });
      fetchMenu();
    } catch {
      // ignore
    }
  };

  return (
    <div className="page manager-page">
      <div className="content-area">
        <div className="manager-tabs">
          <button
            type="button"
            className={selectedTab === 'overview' ? 'manager-tab active' : 'manager-tab'}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={selectedTab === 'complaints' ? 'manager-tab active' : 'manager-tab'}
            onClick={() => setSelectedTab('complaints')}
          >
            Complaints
          </button>
          <button
            type="button"
            className={selectedTab === 'skipdays' ? 'manager-tab active' : 'manager-tab'}
            onClick={() => setSelectedTab('skipdays')}
          >
            Skip Days
          </button>
          <button
            type="button"
            className={selectedTab === 'fees' ? 'manager-tab active' : 'manager-tab'}
            onClick={() => setSelectedTab('fees')}
          >
            Fees
          </button>
          <button
            type="button"
            className={selectedTab === 'menu' ? 'manager-tab active' : 'manager-tab'}
            onClick={() => setSelectedTab('menu')}
          >
            Menu
          </button>
        </div>

        {selectedTab === 'overview' && (
          <div>
            <h2>Manager Overview</h2>
            <div className="summary-row">
              <SummaryCard
                title="Total Students Today"
                value={todaySummary ? todaySummary.totalStudents : '-'}
                subtitle="Booked at least one meal"
                icon="👥"
              />
              <SummaryCard
                title="Monthly Revenue"
                value={prediction ? `₹${prediction.monthly.totalRevenue}` : '-'}
                subtitle="Current month"
                icon="💵"
              />
            </div>

            <div className="card">
              <h3>Today's Meal Counts</h3>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Meal</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((m) => (
                    <tr key={m}>
                      <td>{m.charAt(0).toUpperCase() + m.slice(1)}</td>
                      <td>{todaySummary ? todaySummary.counts[m] : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3>7-Day Average Prediction</h3>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Meal</th>
                    <th>Avg per day</th>
                  </tr>
                </thead>
                <tbody>
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((m) => (
                    <tr key={m}>
                      <td>{m.charAt(0).toUpperCase() + m.slice(1)}</td>
                      <td>{prediction ? prediction.averages[m].toFixed(1) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'complaints' && (
          <div>
            <h2>Complaints Management</h2>
            <div className="card">
              {complaints.length === 0 && <p>No complaints.</p>}
              {complaints.map((c) => (
                <div key={c._id} className="complaint-item">
                  <div className="complaint-header">
                    <strong>{c.title}</strong>
                    <span className={c.status === 'resolved' ? 'status-resolved' : 'status-pending'}>
                      {c.status}
                    </span>
                  </div>
                  <div className="complaint-body">{c.description}</div>
                  {c.status !== 'resolved' && (
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => resolveComplaint(c._id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'skipdays' && (
          <div>
            <h2>Skip-Days Monitor</h2>
            <div className="card">
              {skipSummaries.length === 0 && <p>No data yet.</p>}
              {skipSummaries.length > 0 && (
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Total Skipped</th>
                      <th>Current Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skipSummaries.map((s) => (
                      <tr key={s.userId} className={s.highlight ? 'highlight-row' : ''}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.totalSkippedDays}</td>
                        <td>{s.currentStreak}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'fees' && (
          <div>
            <h2>Fees Management</h2>
            <div className="card">
              {fees.length === 0 && <p>No fee records.</p>}
              {fees.length > 0 && (
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f) => (
                      <tr key={f._id}>
                        <td>{f.userId?.name || f.studentName || 'Unknown'}</td>
                        <td>{f.month}</td>
                        <td>{f.year}</td>
                        <td>₹{f.totalAmount}</td>
                        <td>{f.status}</td>
                        <td>
                          <select
                            value={feeStatusChanges[f._id] || f.status}
                            onChange={(e) => handleFeeStatusChange(f._id, e.target.value)}
                          >
                            <option value="pending">pending</option>
                            <option value="paid">paid</option>
                          </select>
                          <button
                            type="button"
                            className="primary-btn"
                            onClick={() => updateFee(f._id)}
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'menu' && (
          <div>
            <h2>Menu Management</h2>
            <div className="card form">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={menuDate}
                  onChange={(e) => setMenuDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Breakfast</label>
                <input
                  type="text"
                  value={menu.breakfast}
                  onChange={(e) => setMenu({ ...menu, breakfast: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Lunch</label>
                <input
                  type="text"
                  value={menu.lunch}
                  onChange={(e) => setMenu({ ...menu, lunch: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Dinner</label>
                <input
                  type="text"
                  value={menu.dinner}
                  onChange={(e) => setMenu({ ...menu, dinner: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Snacks</label>
                <input
                  type="text"
                  value={menu.snacks}
                  onChange={(e) => setMenu({ ...menu, snacks: e.target.value })}
                />
              </div>
              <button type="button" className="primary-btn" onClick={saveMenu}>
                Save Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import MealSelector from '../components/MealSelector.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

export default function Student({ apiBase, user }) {
  const todayString = () => {
    const d = new Date();
    return d.toISOString().substring(0, 10);
  };

  const [selectedTab, setSelectedTab] = useState('booking');

  const [date, setDate] = useState(todayString);
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
  });
  const [dailyCost, setDailyCost] = useState(0);
  const [monthlyCost, setMonthlyCost] = useState(0);
  const [status, setStatus] = useState('');

  const [skipStartDate, setSkipStartDate] = useState(todayString);
  const [skipEndDate, setSkipEndDate] = useState(todayString);
  const [skipInfo, setSkipInfo] = useState(null);

  const [menu, setMenu] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [fees, setFees] = useState([]);
  const [historyMonth, setHistoryMonth] = useState(() => new Date().getMonth() + 1);
  const [historyYear, setHistoryYear] = useState(() => new Date().getFullYear());
  const [historyDays, setHistoryDays] = useState([]);
  const [historyMonthlyTotal, setHistoryMonthlyTotal] = useState(0);

  const fetchMonthlyCost = async () => {
    try {
      const res = await fetch(`${apiBase}/api/meals/monthly-cost/${user._id}`);
      const data = await res.json();
      if (res.ok) {
        setMonthlyCost(data.monthlyCost || 0);
      }
    } catch (err) {
      // ignore
    }
  };

  const fetchSkipInfo = async () => {
    try {
      const res = await fetch(`${apiBase}/api/skipdays?userId=${user._id}`);
      const data = await res.json();
      if (res.ok) {
        setSkipInfo(data);
      }
    } catch (err) {
      // ignore
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${apiBase}/api/menu`);
      const data = await res.json();
      if (res.ok) {
        setMenu(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${apiBase}/api/complaints?userId=${user._id}`);
      const data = await res.json();
      if (res.ok) {
        setComplaints(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${apiBase}/api/reviews`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchFees = async () => {
    try {
      const res = await fetch(`${apiBase}/api/fees/monthly/user/${user._id}`);
      const data = await res.json();
      if (res.ok) {
        setFees(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchCostHistory = async (monthValue, yearValue) => {
    const m = monthValue || historyMonth;
    const y = yearValue || historyYear;
    try {
      const res = await fetch(`${apiBase}/api/bookings/summary/${user._id}/${m}/${y}`);
      const data = await res.json();
      if (res.ok) {
        setHistoryDays(data.days || []);
        setHistoryMonthlyTotal(data.monthlyTotal || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchMonthlyCost();
    fetchSkipInfo();
    fetchMenu();
    fetchComplaints();
    fetchReviews();
    fetchFees();
  }, []);

  useEffect(() => {
    fetchCostHistory(historyMonth, historyYear);
  }, [historyMonth, historyYear]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFees();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await fetch(`${apiBase}/api/meals/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          date,
          meals,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Failed to save meals');
        return;
      }
      setDailyCost(data.dailyCost || 0);
      setStatus('Meals saved for the day');
      fetchMonthlyCost();
      fetchSkipInfo();
      fetchCostHistory(historyMonth, historyYear);
    } catch (err) {
      setStatus('Network error');
    }
  };

  const handleSkipRange = async () => {
    if (!skipStartDate || !skipEndDate) return;
    setStatus('');
    try {
      let current = new Date(skipStartDate);
      const end = new Date(skipEndDate);
      while (current <= end) {
        const dStr = current.toISOString().substring(0, 10);
        await fetch(`${apiBase}/api/meals/select`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            date: dStr,
            meals: {
              breakfast: false,
              lunch: false,
              dinner: false,
              snacks: false,
            },
          }),
        });
        current.setDate(current.getDate() + 1);
      }
      setStatus('Selected days marked as skipped');
      fetchMonthlyCost();
      fetchSkipInfo();
    } catch (err) {
      setStatus('Failed to mark skipped days');
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          title: complaintTitle,
          description: complaintDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setComplaintTitle('');
      setComplaintDescription('');
      setComplaints((prev) => [data, ...prev]);
    } catch {
      // ignore
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setComment('');
      setRating(5);
      setReviews((prev) => [data, ...prev]);
    } catch {
      // ignore
    }
  };

  return (
    <div className="page dashboard-layout">
      <div className="sidebar">
        <button
          className={selectedTab === 'booking' ? 'sidebar-item active' : 'sidebar-item'}
          onClick={() => setSelectedTab('booking')}
        >
          Booking
        </button>
        <button
          className={selectedTab === 'menu' ? 'sidebar-item active' : 'sidebar-item'}
          onClick={() => setSelectedTab('menu')}
        >
          Menu
        </button>
        <button
          className={selectedTab === 'complaints' ? 'sidebar-item active' : 'sidebar-item'}
          onClick={() => setSelectedTab('complaints')}
        >
          Complaints
        </button>
        <button
          className={selectedTab === 'reviews' ? 'sidebar-item active' : 'sidebar-item'}
          onClick={() => setSelectedTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={selectedTab === 'fees' ? 'sidebar-item active' : 'sidebar-item'}
          onClick={() => setSelectedTab('fees')}
        >
          Fees
        </button>
      </div>

      <div className="content-area">
        {selectedTab === 'booking' && (
          <>
            <h2>Student Meal Booking</h2>

            <form onSubmit={handleSubmit} className="card form">
              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <MealSelector meals={meals} onChange={setMeals} />

              {status && <div className="status-text">{status}</div>}

              <button type="submit" className="primary-btn">Save Meals</button>
            </form>

            <div className="card">
              <h3>Skip Multiple Days</h3>
              <div className="form-group">
                <label>From</label>
                <input
                  type="date"
                  value={skipStartDate}
                  onChange={(e) => setSkipStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>To</label>
                <input
                  type="date"
                  value={skipEndDate}
                  onChange={(e) => setSkipEndDate(e.target.value)}
                />
              </div>
              <button type="button" className="primary-btn" onClick={handleSkipRange}>
                Mark Days as Skipped
              </button>
            </div>

            <div className="summary-row">
              <SummaryCard title="Today's Cost" value={`₹${dailyCost}`} subtitle="Based on selected meals" icon="💰" />
              <SummaryCard title="Monthly Cost" value={`₹${monthlyCost}`} subtitle="Current month total" icon="📊" />
            </div>

            {skipInfo && (
              <div className={skipInfo.highlight ? 'card warning-card' : 'card'}>
                <h3>Skip Days</h3>
                <p>Total skipped days: {skipInfo.totalSkippedDays}</p>
                <p>Current consecutive skipped days: {skipInfo.currentStreak}</p>
                {skipInfo.highlight && (
                  <div className="warning-text">
                    You have skipped meals for 3 or more consecutive days.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {selectedTab === 'menu' && (
          <div>
            <h2>Today's Menu</h2>
            <div className="card">
              {menu ? (
                <ul>
                  <li><strong>Breakfast:</strong> {menu.breakfast || '-'} </li>
                  <li><strong>Lunch:</strong> {menu.lunch || '-'} </li>
                  <li><strong>Dinner:</strong> {menu.dinner || '-'} </li>
                  <li><strong>Snacks:</strong> {menu.snacks || '-'} </li>
                </ul>
              ) : (
                <p>No menu set for today.</p>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'complaints' && (
          <div>
            <h2>Complaint Portal</h2>
            <form className="card form" onSubmit={handleComplaintSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <button type="submit" className="primary-btn">Submit Complaint</button>
            </form>

            <div className="card">
              <h3>Your Complaints</h3>
              {complaints.length === 0 && <p>No complaints yet.</p>}
              {complaints.map((c) => (
                <div key={c._id} className="complaint-item">
                  <div className="complaint-header">
                    <strong>{c.title}</strong>
                    <span className={c.status === 'resolved' ? 'status-resolved' : 'status-pending'}>
                      {c.status}
                    </span>
                  </div>
                  <div className="complaint-body">{c.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div>
            <h2>Reviews</h2>
            <form className="card form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                />
              </div>
              <button type="submit" className="primary-btn">Submit Review</button>
            </form>

            <div className="card">
              <h3>All Reviews</h3>
              {reviews.length === 0 && <p>No reviews yet.</p>}
              {reviews.map((r) => (
                <div key={r._id} className="review-item">
                  <div className="review-header">
                    <strong>{r.rating} / 5</strong>
                    <span>{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <div className="review-body">{r.comment}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'fees' && (
          <div>
            <h2>My Meal Cost History</h2>
            <div className="card">
              <div className="history-filters">
                <div className="form-group inline-group">
                  <label>Month</label>
                  <select
                    value={historyMonth}
                    onChange={(e) => setHistoryMonth(Number(e.target.value))}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group inline-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={historyYear}
                    onChange={(e) => setHistoryYear(Number(e.target.value))}
                  />
                </div>
              </div>

              {historyDays.length === 0 && <p>No bookings for this month.</p>}
              {historyDays.length > 0 && (
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Meals</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyDays.map((d) => (
                      <tr key={d._id}>
                        <td>{new Date(d.date).toLocaleDateString()}</td>
                        <td>
                          {['breakfast','lunch','snacks','dinner']
                            .filter((k) => d.meals && d.meals[k])
                            .join(', ') || 'Skipped'}
                        </td>
                        <td>₹{d.totalCostForDay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="history-total-row">
                <strong>Monthly total:</strong> <span>₹{historyMonthlyTotal}</span>
              </div>
            </div>

            <div className="card">
              <h3>Monthly Fee Status</h3>
              {fees.length === 0 && <p>No monthly fee records yet.</p>}
              {fees.length > 0 && (
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f) => (
                      <tr key={f._id}>
                        <td>{f.month}</td>
                        <td>{f.year}</td>
                        <td>₹{f.totalAmount}</td>
                        <td>{f.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

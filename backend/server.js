const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const managerRoutes = require('./routes/manager');
const menuRoutes = require('./routes/menu');
const complaintRoutes = require('./routes/complaints');
const reviewRoutes = require('./routes/reviews');
const feeRoutes = require('./routes/fees');
const skipdaysRoutes = require('./routes/skipdays');
const bookingsRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mess_booking';

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/skipdays', skipdaysRoutes);
app.use('/api/bookings', bookingsRoutes);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Make sure MongoDB is running on:', MONGO_URI);
    console.error('💡 Start MongoDB with: mongod (or check MongoDB service)');
    process.exit(1);
  });

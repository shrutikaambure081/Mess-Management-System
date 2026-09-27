# mess-management-system
College Mess Meal Booking System
A modern, full-stack web application for managing college mess meal bookings with an interactive UI.

🚀 Quick Start Guide
Prerequisites
Before running the application, make sure you have:

Node.js (v14 or higher) - Download here
MongoDB - Download here or use MongoDB Atlas (cloud)
📦 Installation
Install Backend Dependencies

cd backend
npm install
Install Frontend Dependencies

cd ../frontend
npm install
🗄️ MongoDB Setup
Option 1: Local MongoDB

Make sure MongoDB is installed and running on your system
Default connection: mongodb://127.0.0.1:27017/mess_booking
Option 2: MongoDB Atlas (Cloud)

Create a free account at MongoDB Atlas
Create a cluster and get your connection string
Set the MONGO_URI environment variable (see below)
▶️ Running the Application
You need to run both the backend and frontend servers. Open two separate terminal windows.

Terminal 1 - Backend Server
cd backend
npm run dev
The backend will start on http://localhost:5000

💡 Note: Use npm start for production mode, or npm run dev for development mode with auto-reload

Terminal 2 - Frontend Server
cd frontend
npm run dev
The frontend will start on http://localhost:5173

🌐 Access the Application
Open your browser and navigate to:

http://localhost:5173
🔐 Default Login
Since this is a fresh installation, you'll need to register a new account:

Click "Register" on the login page
Fill in your details:
Name
Email
Password
Role: Select "Student" or "Manager"
Click "Register"
You'll be automatically logged in
📝 Environment Variables (Optional)
You can customize the backend configuration by creating a .env file in the backend folder:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mess_booking
🛠️ Available Scripts
Backend (/backend)
npm start - Run the server in production mode
npm run dev - Run the server in development mode with auto-reload (nodemon)
Frontend (/frontend)
npm run dev - Start development server
npm run build - Build for production
npm run preview - Preview production build
📁 Project Structure
mess-booking/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── styles.css   # Global styles
│   └── public/          # Static assets
└── README.md
🎨 Features
Student Features:

Daily meal booking (Breakfast, Lunch, Dinner, Snacks)
View menu
Submit complaints
Write reviews
Track monthly costs
Skip days tracking
Manager Features:

Dashboard overview
Today's meal statistics
Revenue predictions
Manage complaints
Monitor skip days
Fee management
Menu management
🐛 Troubleshooting
Backend won't start:

Check if MongoDB is running: mongod or check MongoDB service
Verify MongoDB connection string in server.js or .env file
Check if port 5000 is available
Frontend won't start:

Check if port 5173 is available
Try deleting node_modules and running npm install again
Clear browser cache
Database connection error:

Ensure MongoDB is installed and running
Check MongoDB connection string
Verify MongoDB is accessible on the specified port (default: 27017)
📞 Support
If you encounter any issues, check:

Node.js version: node --version (should be v14+)
MongoDB status
Port availability (5000 for backend, 5173 for frontend)
Console for error messages
Happy Coding! 🎉


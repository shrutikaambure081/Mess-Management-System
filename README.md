# 🍽️  Mess Meal Booking System

A modern full-stack web application designed to simplify **Hostel mess meal booking and management**. Students can book meals, view menus, track expenses, skip meals, submit complaints, and provide reviews, while managers can monitor mess operations through a dedicated dashboard.

## 🚀 Features

### 👨‍🎓 Student Features
- 🍳 Book daily meals — Breakfast, Lunch, Dinner & Snacks
- 📋 View daily mess menu
- ⏭️ Skip meals and track skipped days
- 💰 Track monthly mess costs
- 📝 Submit complaints
- ⭐ Write reviews and feedback

### 👨‍💼 Manager Features
- 📊 Dashboard with mess statistics
- 🍽️ Monitor today's meal bookings
- 💵 Manage mess fees
- 📈 View revenue predictions
- 📝 Manage student complaints
- ⏭️ Monitor skipped meals
- 📋 Manage mess menu

## 🛠️ Tech Stack

**Frontend**
- React.js
- HTML
- CSS
- JavaScript
- Vite

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Development Tools**
- VS Code
- Git & GitHub
- Nodemon

## 📁 Project Structure

```text
mess-management-system/
│
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Application pages
│   │   └── styles.css   # Global styles
│   ├── public/          # Static assets
│   └── package.json
│
└── README.md
```

## ⚙️ Prerequisites

Before running the project, install:

- [Node.js](https://nodejs.org/) — v14 or higher
- [MongoDB](https://www.mongodb.com/) — Local MongoDB or MongoDB Atlas
- Git

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/mess-management-system.git
cd mess-management-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

Make sure MongoDB is installed and running.

The default database connection is:

```text
mongodb://127.0.0.1:27017/mess_booking
```

### Option 2: MongoDB Atlas

1. Create a free MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Allow your IP address.
5. Copy your MongoDB connection string.
6. Add it to the backend `.env` file.

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mess_booking
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

> ⚠️ Do not upload your `.env` file or database credentials to GitHub.

## ▶️ Running the Application

The backend and frontend need to run separately.

### Backend

```bash
cd backend
npm run dev
```

Backend server:

```text
http://localhost:5000
```

For production mode:

```bash
npm start
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🌐 Access the Application

Open your browser and visit:

**http://localhost:5173**

### 🔑 Registration

For a fresh installation:

1. Click **Register**.
2. Enter your name.
3. Enter your email.
4. Create a password.
5. Select your role:
   - Student
   - Manager
6. Click **Register**.

After registration, you can access the application according to your selected role.

## 📜 Available Scripts

### Backend

```bash
npm start
```

Runs the backend server in production mode.

```bash
npm run dev
```

Runs the backend server with Nodemon for automatic reloading during development.

### Frontend

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

## 🐛 Troubleshooting

### Backend won't start

Check:

- MongoDB is running.
- `MONGO_URI` is correct.
- Port `5000` is available.
- Node.js is installed correctly.

Check Node.js version:

```bash
node --version
```

### Frontend won't start

Try:

```bash
rm -rf node_modules
npm install
npm run dev
```

On Windows, you can delete the `node_modules` folder manually and then run:

```bash
npm install
npm run dev
```

### Database Connection Error

Make sure:

- MongoDB is running.
- The MongoDB connection string is correct.
- MongoDB is accessible on port `27017` for local installations.
- Your MongoDB Atlas IP address is allowed if using Atlas.

## 🔮 Future Improvements

- 📱 Mobile-responsive design improvements
- 💳 Online mess fee payment
- 📧 Email notifications
- 🔔 Meal booking reminders
- 📊 Advanced analytics and reports
- 📅 Calendar-based meal booking
- 🔐 Improved authentication and authorization

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push the branch.
6. Create a Pull Request.

## 📄 License

This project is developed for educational and academic purposes.

## 👩‍💻 Author

**Shrutika Ambure**

Computer Science Undergraduate  
KLE Technological University

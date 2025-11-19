# BusMate Frontend - React + Vite Setup Guide

## 📋 Project Overview

BusMate is an online bus ticketing system built with React + Vite with the following features:

### Features:
- ✅ User authentication (signup/login with JWT)
- ✅ Route search and filtering
- ✅ Real-time seat selection with visual bus layout
- ✅ Secure payment processing (GCash, PayMaya, Credit Card)
- ✅ Booking confirmation with QR codes
- ✅ User profile management
- ✅ Admin dashboard for managing buses, routes, schedules, and users
- ✅ OAuth2 integration (Google Sign-In)

## 🏗️ Project Structure

```
web/
├── src/
│   ├── api/
│   │   └── axios.js           # API client with JWT interceptors
│   ├── components/
│   │   ├── admin/             # Admin dashboard components
│   │   ├── auth/              # Authentication components
│   │   ├── booking/           # Booking flow components
│   │   └── layout/            # Navigation and layout components
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context provider
│   ├── pages/                 # Page components
│   ├── styles/                # Global and page-specific CSS
│   ├── App.jsx                # Main app with routing
│   └── main.jsx               # React entry point
├── index.html
├── package.json
├── vite.config.js
└── .env
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Backend running on http://localhost:8080
- MySQL database configured

### Installation Steps

1. **Navigate to the web folder:**
```bash
cd web
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
The `.env` file is already configured for local development:
```
VITE_API_URL=http://localhost:8080/api
```

## 🎯 Running the Application

### Start Frontend Only (Port 3000)
```bash
npm run frontend
```

### Start Backend Only (Port 8080)
```bash
npm run backend
```

### Start Both (Recommended for Development)
```bash
npm run dev
```

This will:
- Start the Vite dev server on http://localhost:3000
- Start the Spring Boot backend on http://localhost:8080
- Proxy API calls from `/api` to the backend

## 🔐 Authentication Flow

1. **Login/Signup**: User credentials sent to `/api/auth/login` or `/api/auth/signup`
2. **JWT Token**: Backend returns JWT token stored in localStorage
3. **API Requests**: JWT token automatically attached to all API requests via axios interceptor
4. **Protected Routes**: Routes check for user authentication before allowing access

## 📱 Pages & Features

### Public Pages
- **Home** (`/`) - Landing page with features showcase
- **Login** (`/login`) - User login and signup
- **Signup** (`/signup`) - New user registration

### Authenticated Pages
- **Booking** (`/booking`) - Multi-step booking process:
  1. Route search and schedule selection
  2. Seat selection with visual bus layout
  3. Payment confirmation
  4. Booking confirmation with QR code
  
- **Profile** (`/profile`) - User profile and booking history
- **Admin** (`/admin`) - Admin dashboard (ADMIN/SUPER_ADMIN roles only):
  - User management
  - Bus management
  - Route management
  - Schedule management

## 🔌 API Endpoints Used

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PATCH /api/auth/me` - Update profile
- `DELETE /api/auth/me` - Delete account

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create route (admin)

### Schedules
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create schedule (admin)
- `GET /api/schedules/{id}/seats` - Get seats for schedule

### Seats
- `GET /api/seats/schedule/{scheduleId}` - Get seats by schedule
- `POST /api/seats/generate/{scheduleId}` - Generate seats (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/{id}/confirm` - Confirm booking with payment
- `GET /api/bookings/user/{userId}` - Get user bookings

## 🎨 Styling

The application uses a custom CSS theme with:
- **Primary Color**: #2563eb (Blue)
- **Secondary Color**: #64748b (Gray)
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **CSS Variables**: Defined in `global.css` for easy customization

## 🛠️ Development Tips

### Debugging API Calls
Open browser DevTools → Network tab to see API requests and responses

### Testing Authentication
Demo account credentials available in the login form

### Hot Reload
Vite enables fast hot reload during development. Changes to JSX/CSS files reflect instantly.

### Troubleshooting

**Issue**: CORS errors when calling backend
- Solution: Ensure backend CORS config allows http://localhost:3000
- Backend has CorsConfig.java configured for this

**Issue**: JWT token expired
- Solution: Login again, tokens are stored in localStorage

**Issue**: Changes not reflected
- Solution: Clear browser cache (DevTools → Application → Clear storage)

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder

## 🚀 Deployment

The built application can be deployed to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Update the API endpoint in `.env` for production backend URL.

## 📚 Key Technologies

- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **CSS3** - Responsive styling

## 🤝 Contributing

When adding new features:
1. Create components in appropriate directories
2. Add CSS in `styles/` folder
3. Update API calls in `api/axios.js`
4. Test with both servers running

## 📄 License

This project is part of IT342 Group 6

---

**Last Updated**: November 19, 2025
**Status**: ✅ Frontend + Backend Connected and Ready for Testing

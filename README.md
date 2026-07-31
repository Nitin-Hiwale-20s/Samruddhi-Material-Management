# TIMS - Samruddhi Plaza Tracking & Inventory Management System

MERN Stack प्रोजेक्ट (MongoDB, Express, React, Node.js)

## Modules
- Dashboard (सर्व मॉड्युल्सचे summary counts)
- Lanes
- Equipment
- Inventory
- Installations
- Cable Tracking
- Daily Logs
- Work Status
- Reports (Excel + PDF export)
- Users (Admin only - user management)

## Features
- JWT आधारित Admin Login
- प्रत्येक module मध्ये Add / Edit / Delete / Search
- **Excel (.xlsx) आणि PDF मध्ये data download** करण्याची सुविधा प्रत्येक module मध्ये आणि Reports page वर
- Role-based access (admin / manager / staff)
- MongoDB Atlas सोबत connected

---

## Setup कसे करावे

### 1. Backend

```bash
cd backend
npm install
```

`.env` फाईल आधीच तयार आहे (तुमचा MongoDB URI त्यात टाकलेला आहे). गरज असल्यास बदलून घ्या:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@samruddhiplaza.com
ADMIN_PASSWORD=Admin@123
```

पहिला Admin user तयार करण्यासाठी (एकदाच run करा):

```bash
npm run seed
```

Backend सुरु करा:

```bash
npm run dev
```

Server: `http://localhost:5000`

### 2. Frontend

नवीन terminal उघडून:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### 3. Login

Seed script ने बनवलेला admin login वापरा:
- Email: `.env` मधील `ADMIN_EMAIL` (default: admin@samruddhiplaza.com)
- Password: `.env` मधील `ADMIN_PASSWORD` (default: Admin@123)

**Login केल्यावर लगेच Users page मधून password बदला / नवीन admin बनवा.**

---

## ⚠️ महत्वाचे - Security

तुम्ही दिलेला MongoDB connection string मध्ये खरा username/password आहे. हा प्रोजेक्ट code कुठेही (GitHub, कोणासोबत शेअर) पब्लिक करण्याआधी:
1. MongoDB Atlas → Database Access मध्ये जाऊन हा user delete करा आणि नवीन strong password सेट करा.
2. नवीन URI फक्त तुमच्या local `.env` फाईल मध्ये ठेवा — कधीही code मध्ये hardcode करू नका किंवा public repo मध्ये commit करू नका.
3. Deploy करताना (Render / Railway / Vercel) environment variables द्वारे MONGO_URI आणि JWT_SECRET सेट करा.

---

## नवीन Module कसा add करायचा

1. `backend/models/genericModel.js` मध्ये `ALLOWED_MODULES` array मध्ये नाव टाका.
2. `frontend/src/config/modulesConfig.js` मध्ये त्या module चे fields define करा.
3. `frontend/src/App.jsx` आणि `frontend/src/components/Layout.jsx` मध्ये route/menu item टाका.

एवढं केलं की Add/Edit/Delete/Search/Excel/PDF export सगळं आपोआप चालू होईल (generic component मुळे).

## Deployment Suggestions
- Backend: Render / Railway / Cyclic
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas (आधीच तुमच्याकडे आहे)

Frontend build करून deploy करण्यासाठी:
```bash
cd frontend
npm run build
```
`frontend/dist` folder deploy करा, आणि `VITE_API_URL` ला तुमच्या live backend URL वर सेट करा.
# Samruddhi-Material-Management

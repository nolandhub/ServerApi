# 🎫 PROBUS - Bus Ticket Management System

## 🚀 Quick Start Guide

### Prerequisites
```
✓ Node.js v18+
✓ npm or yarn
✓ MySQL database
✓ Firebase project
✓ Zalo developer account
```

### Installation & Setup

**1. Clone & Install**
```bash
git clone <repository-url>
cd my-next-app
npm install
```

**2. Configure Environment Variables**
```bash
# Create .env.local file
cp .env.example .env.local
```

Add these variables:
```env
# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_ticket_db

# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Zalo Integration
ZALO_SECRET_KEY=your_zalo_secret 
ZALO_OA_ID=your_oa_id

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**3. Start Development Server**
```bash
npm run dev
```
→ Open http://localhost:3000

**4. Build & Deploy**
```bash
npm run build
npm start
```

---

## 📊 Main Application Flow

### **Customer Journey (Booking)**
```
1. Customer opens Zalo Mini-App
   ↓
2. Browse available routes & dates
   ↓
3. Select departure time & fill some info at page booking
   ↓
4. Complete booking via Zalo Mini App
   ↓
5. Receive booking confirmation message on Zalo
   ↓
6. Ticket saved to Firebase Firestore (real-time sync)
```

### **Admin Dashboard Flow**
```
1. Login to Dashboard (/dashboard)
   ↓
2. View real-time analytics:
   - Total revenue
   - Bookings count
   - Seat occupancy rate
   ↓
3. Manage Operations:
   - View all tickets (filter by date/status)
   - Edit booking details (quick drawer)
   - Export to CSV/Excel
   ↓
4. Configure Pricing & Sales:
   - Set base prices by route
   - Create promotional sales campaigns
   - Apply discounts (%, fixed amount, time-based)
   ↓
5. Real-time Updates:
   - Instant sync with Firebase
   - Push notifications for new bookings
```

### **Data Processing Flow**
```
Frontend (Next.js) → API Routes (Node.js)
                     ├→ MySQL (prices, sales rules, routes)
                     ├→ Firebase (ticket bookings)
                     └→ Zalo API (send messages)
                     
Firebase Firestore ← Real-time listener updates
   (tickets db)        dashboard automatically
```


## 📱 Supported Platforms

- 🖥️ **Desktop**: Chrome, Firefox, Safari, Edge
- 📱 **Mobile**: iOS Safari, Chrome Mobile
- 💬 **Zalo Mini-App**: Native Zalo environment

---

## 📈 Database Overview

### **MySQL Tables** (Relational Data)
```
routes          → Bus routes (e.g., "Hanoi → Ho Chi Minh")
companies       → Bus operators
trips           → Scheduled trips with times
transfer_types  → Direct/Express/Sleeper bus types
price_types     → Economy/VIP/Premium classes
sale_configs    → Promotional discounts & rules
```

### **Firebase Firestore Collections** (Real-Time)
```
tickets         → Individual bookings (customer info, seat selection)
users           → Customer profiles (cached from Zalo)
```

---

## 🎓 Learning Outcomes (For Internship)

This project demonstrates:

✅ **Full-Stack Development**: Frontend + Backend in one codebase  
✅ **Database Design**: Multiple data sources (MySQL + Firestore)  
✅ **Real-Time Features**: Firebase listeners & live updates  
✅ **API Integration**: Zalo API, external service communication  
✅ **State Management**: Zustand for complex app state  
✅ **Data Visualization**: Charts & advanced tables  
✅ **Authentication & Security**: Firebase + environment variables  
✅ **Responsive Design**: Mobile-first approach  
✅ **Performance**: SSR, connection pooling, caching  

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts, add environment variables in Vercel dashboard
```

### Deploy to Other Platforms
- **AWS**: EC2 + RDS
- **DigitalOcean**: Droplet + Managed Database
- **Heroku**: (legacy, use alternatives)

---

##  Common Commands

```bash
# Development
npm run dev              # Start dev server on port 3000

# Building
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Check code with ESLint

# Database
# (Connect with MySQL client of your choice)
```

---

## ⚠️ Important Notes for HR

**Technology Highlights:**
- Uses modern React patterns (Server/Client components)
- Real-time data synchronization (Firebase)
- RESTful API design
- Type-safe development with TypeScript
- Professional UI/UX with Tailwind CSS

**Suitable for:**
- Internship projects
- Portfolio demonstration
- Learning full-stack development
- Production-ready template

---

**Version**: 1.0.0  
**Created**: December 2024  
**Framework**: Next.js 15 + React 19  
**License**: MIT
# Mini CRM UMKM Kuliner

A simple Customer Relationship Management (CRM) application tailored for culinary small and medium enterprises (UMKM Kuliner). This project is split into a backend API and a frontend React dashboard.

---

## Getting Started

To run the full application, you will need to start both the backend server and the frontend development server.

### 1. Run the Backend
```bash
cd backend
npm install
npm run dev
```
The backend server runs at **http://localhost:3001**.

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend application runs at **http://localhost:3000** (or another port if 3000 is occupied).

---

## Backend Services

Node.js + TypeScript + Express API for managing customer and order data.

### Setup & Commands
Inside the `/backend` folder:
- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to `dist/`
- `npm start` - Run the compiled build

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/customers` | Add new customer |
| GET | `/customers` | Get all customers |
| POST | `/orders` | Add new order |
| GET | `/orders?customer_id=` | Get orders by customer |
| GET | `/health` | Health check |

### Project Structure
```
backend/src/
├── index.ts              # App entry point
├── types/index.ts        # TypeScript interfaces
├── utils/db.ts           # JSON file database helper
├── middleware/
│   └── errorHandler.ts   # Error & 404 middleware
├── controllers/
│   ├── customerController.ts
│   └── orderController.ts
└── routes/
    ├── customers.ts
    └── orders.ts
backend/db.json           # Flat-file database
```

---

## Frontend Application

React + TypeScript + Tailwind CSS dashboard.

### Setup & Commands
Inside the `/frontend` folder:
- `npm install` - Install dependencies
- `npm run dev` - Start Vite dev server

### Features
- **Customer Management**: Add customer form with validation, searchable customer list.
- **Order Management**: Add order form (multi-item support, automatic totals calculation).
- **Stats Dashboard**: Overview cards for total customers, total orders, loyal customer count, and total revenue.
- **Loyalty Flagging**: Automated star badge (⭐ Loyal) for customers with more than 3 orders.
- **Visual Feedback**: Toast notifications for success/error feedback.
- **State Management**: Shared global state and API integration using React Context.

### Project Structure
```
frontend/src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component + tab navigation
├── index.css                   # Tailwind directives + global styles
├── types/
│   └── index.ts                # TypeScript interfaces
├── context/
│   └── CRMContext.tsx          # Context API — global state + API calls
└── components/
    ├── Toast.tsx               # Toast notification system
    ├── FormFields.tsx          # Shared input elements
    ├── StatsBar.tsx            # Key statistics display cards
    ├── CustomerForm.tsx        # Customer insertion form
    ├── CustomerList.tsx        # Listing, search, and filtering
    ├── OrderForm.tsx           # Order insertion (multi-item)
    └── OrderList.tsx           # Order details listing with filter
```

# 🪙 AI-Powered Personal Finance Tracker (FinTrack AI)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v18.2-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.3-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js-000000.svg)](https://expressjs.com/)
[![OpenAI API](https://img.shields.io/badge/AI-OpenAI%20GPT--4o--mini-74aa9c.svg)](https://openai.com/)

> **A modern, full-stack, AI-enhanced personal finance and wealth management web application.** Track income and expenses, monitor category budgets in real time, forecast cash flows, generate downloadable PDF monthly reports, and receive personalized financial recommendations powered by OpenAI and automated heuristic analytics.

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📂 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Configuration & Setup](#2-backend-configuration--setup)
  - [3. Frontend Configuration & Setup](#3-frontend-configuration--setup)
  - [4. Running the Application](#4-running-the-application)
- [📡 API Documentation](#-api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Transaction Endpoints](#transaction-endpoints)
  - [Budget Endpoints](#budget-endpoints)
  - [Dashboard Analytics Endpoints](#dashboard-analytics-endpoints)
  - [AI Insights Endpoints](#ai-insights-endpoints)
  - [Reports & PDF Endpoints](#reports--pdf-endpoints)
- [🗄️ Database Schemas](#️-database-schemas)
- [🛡️ Security & Resilience](#️-security--resilience)
- [🧪 Testing & Scripts](#-testing--scripts)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 1. 📊 Executive Analytics Dashboard
- **Dynamic Cash Flow Metrics**: Real-time cards for **Total Income**, **Total Expenses**, **Net Balance**, and **Savings Rate %**.
- **High-Contrast Data Visualizations**:
  - **Expense Category Breakdown**: Interactive multi-color Donut/Pie Chart with dark tooltips and clear monetary labels.
  - **Category Distribution Ledger**: Ranked category list with live spend amount, percentage of total expenses, and colored progress bars.
  - **Monthly Cash Flow Trend**: Dual-axis bar and line charts comparing monthly inflows vs outflows.
- **Recent Transaction Feed**: Instant view of the latest financial movements with category tags, payment badges, and quick delete/edit actions.

### 2. 💳 End-to-End Transaction Management
- **Full CRUD Operations**: Log income and expenses with amount, category, payment method, date, and custom notes.
- **Multi-Filter & Search Engine**:
  - Filter by transaction type (`All`, `Income`, `Expense`).
  - Filter by category (`Food & Dining`, `Salary`, `Shopping`, `Housing`, `Transportation`, `Utilities`, `Entertainment`, `Healthcare`, `Investment`, `Freelance`, `Other`).
  - Filter by payment method (`Cash`, `Credit Card`, `Debit Card`, `UPI`, `Bank Transfer`).
  - Date range filtering (`Start Date` to `End Date`) with instant keyword search across descriptions and notes.
- **Dynamic Ledger Statistics**: Header summary showing filtered record counts, total matched income, and total matched expenses.

### 3. 🎯 Intelligent Budgeting & Limit Tracking
- **Category-Level Budget Limits**: Define monthly spending ceilings for individual expense categories.
- **Visual Budget Progress**: Color-coded progress indicators:
  - 🟢 **Safe Zone (<75%)**: Healthy spending pace.
  - 🟡 **Caution Zone (75%–99%)**: Approaching monthly budget threshold.
  - 🔴 **Overbudget Alert (≥100%)**: Critical alert badge and remaining deficit indicator.
- **Overall Budget Summary**: Total allocated budget vs. actual month-to-date spending.

### 4. 🧠 AI Financial Advisor & Smart Insights
- **OpenAI GPT-4o-mini Integration**: Generates contextual financial advice, tailored savings recommendations, and spending analysis.
- **Heuristic Fallback Engine**: Built-in deterministic financial algorithms provide rich, instantaneous insights even if an OpenAI API key is omitted or offline.
- **Predictive Month-End Spend Forecast**: Extrapolates current daily burn rates to estimate final month-end spending.
- **Spending Anomaly Detection**: Highlights uncharacteristic spikes in discretionary categories (e.g., dining, shopping, entertainment).

### 5. 📑 Monthly Reports & Vector PDF Export
- **Comprehensive Monthly Breakdown**: Cash flow analysis, category-by-category expense breakdowns, and highest spending category detection.
- **Automated PDF Statement Generation**: Server-side vector PDF creation using `PDFKit`:
  - Formal company/user header with statement period and generated timestamp.
  - Formatted cash flow summary table.
  - Itemized transaction ledger with dates, categories, payment methods, and net totals.
  - Embedded AI spending analysis summary.

### 6. 👤 User Profile & Lifetime Statistics
- **Account Settings**: Update user display name and profile metadata.
- **Lifetime Financial Ledger**: View total all-time transactions recorded, cumulative lifetime income, and cumulative lifetime expenditures.
- **Security Info**: Account creation date and authentication session status.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT (React 18 + Vite)                             │
│  ┌───────────────────────┬─────────────────────────┬────────────────────────────────┐  │
│  │  React Router Pages   │  Redux Toolkit Slices   │  Recharts & Tailwind UI Engine │  │
│  │  (Dashboard, Ledger,  │  (authSlice, txnSlice,  │  (High-contrast Dark Tooltips, │  │
│  │   Budgets, Insights,  │   budgetSlice, aiSlice, │   Lucide Icons, Modals,        │  │
│  │   Reports, Profile)   │   reportSlice)          │   Responsive Layouts)          │  │
│  └───────────────────────┴─────────────────────────┴────────────────────────────────┘  │
└───────────────────────────────────────────▲────────────────────────────────────────────┘
                                            │ HTTP / REST / JSON + JWT Bearer Token
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                                  SERVER (Node.js + Express)                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Middleware: Helmet, Express Rate Limit, CORS, JWT Auth Verify, Global Error Handler│  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
│                                           │                                            │
│  ┌──────────────────────┬─────────────────┴──────┬──────────────────┬────────────────┐ │
│  │ Auth Controller      │ Transaction Controller │ Budget Controller│ AI & Insights  │ │
│  │ (Bcrypt / JWT / User)│ (CRUD / Aggregations)  │ (Limits / Status)│ (OpenAI / Algo)│ │
│  └──────────┬───────────┴─────────────┬──────────┴──────────┬───────┴────────┬───────┘ │
│             │                         │                     │                │         │
│  ┌──────────▼─────────────────────────▼─────────────────────▼────────┐ ┌─────▼───────┐ │
│  │                     MongoDB via Mongoose ODM                      │ │   PDFKit    │ │
│  │       (Collections: users, transactions, budgets)                 │ │ PDF Export  │ │
│  └───────────────────────────────────────────────────────────────────┘ └─────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^18.2.0` | Declarative component-based UI framework |
| **Vite** | `^5.0.2` | Ultra-fast build tool and local development server |
| **Redux Toolkit** | `^1.9.7` | Global state management for authentication, transactions, and budgets |
| **React Router DOM**| `^6.16.0` | Client-side routing and authenticated route protection |
| **Tailwind CSS** | `^3.3.5` | Modern utility-first styling and responsive design system |
| **Recharts** | `^2.10.3` | SVG-based responsive data visualization charts |
| **Axios** | `^1.5.0` | Promise-based HTTP client with global authorization interceptors |

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>=18.0.0`| Server runtime environment (ES Modules) |
| **Express.js** | `^4.18.2` | RESTful API framework |
| **MongoDB & Mongoose** | `^7.5.0` | NoSQL document database and schema-based object modeling |
| **JSONWebToken (JWT)**| `^9.0.2` | Stateless authentication and secure bearer token verification |
| **Bcrypt.js** | `^5.1.1` | Password hashing with 10 salt rounds |
| **OpenAI SDK** | `^4.12.4` | GPT-4o-mini engine for conversational finance recommendations |
| **PDFKit** | `0.18.0` | Dynamic vector PDF document and invoice generation |
| **Helmet & Rate Limit**| `8.1.0` / `8.4.1` | HTTP security headers and brute-force rate limiting |

---

## 📂 Repository Structure

```
Finance-Tracker/
├── README.md                          # Comprehensive project documentation
├── .gitignore                         # Git exclusion rules (.env, node_modules, build)
│
├── client/                            # Frontend Single Page Application (React + Vite)
│   ├── index.html                     # HTML5 entry template with Inter font
│   ├── package.json                   # Client dependencies and scripts
│   ├── vite.config.js                 # Vite bundler configuration
│   ├── tailwind.config.js             # Tailwind theme colors and responsive breakpoints
│   ├── postcss.config.js              # PostCSS plugins configuration
│   └── src/
│       ├── main.jsx                   # React root mounting with Redux Provider
│       ├── App.jsx                    # Root router with protected layout
│       ├── index.css                  # Tailwind base layers and custom utility styles
│       ├── components/                # Reusable UI component library
│       │   ├── Navbar.jsx             # Top navigation bar with active links & user badge
│       │   ├── ProtectedRoute.jsx     # Route guard redirecting unauthenticated users
│       │   ├── TransactionModal.jsx   # Create/Edit transaction modal form
│       │   └── BudgetModal.jsx        # Category budget limit configuration modal
│       ├── pages/                     # Application views
│       │   ├── Login.jsx              # User login screen with validation
│       │   ├── Signup.jsx             # User registration screen
│       │   ├── Dashboard.jsx          # KPI metrics, high-contrast charts & category ledger
│       │   ├── Transactions.jsx       # Filterable transaction table with full CRUD
│       │   ├── Budget.jsx             # Budget tracking, alert badges & limit bars
│       │   ├── Insights.jsx           # AI recommendations & predictive forecasting
│       │   ├── Reports.jsx            # Monthly breakdown view & vector PDF download
│       │   └── Profile.jsx            # User profile and lifetime statistics
│       ├── redux/                     # Redux state slices & store configuration
│       │   ├── store.js               # Central Redux store configuration
│       │   └── slices/
│       │       ├── authSlice.js       # Auth tokens, login, register, profile state
│       │       ├── transactionSlice.js# Transactions list, filters, pagination state
│       │       ├── budgetSlice.js     # Monthly category budget limits state
│       │       ├── aiSlice.js         # AI recommendations and forecast cache
│       │       └── reportSlice.js     # Monthly aggregated reports data
│       ├── services/                  # Axios HTTP client instances & API methods
│       │   ├── api.js                 # Base Axios instance with auth header interceptors
│       │   ├── authService.js         # Auth API calls
│       │   ├── transactionService.js  # Transaction API calls
│       │   ├── budgetService.js       # Budget API calls
│       │   ├── aiService.js           # AI insights API calls
│       │   └── reportService.js       # Monthly report and PDF streaming API calls
│       └── utils/                     # Formatting utilities
│           └── formatters.js          # Currency, date, and percentage formatters
│
└── server/                            # Backend REST API Server (Node.js + Express)
    ├── package.json                   # Server dependencies and scripts
    ├── server.js                      # HTTP server listener and MongoDB connection bootstrapper
    ├── app.js                         # Express application setup, routes and middleware
    ├── .env.example                   # Environment variable template
    ├── config/
    │   └── db.js                      # MongoDB Mongoose connection handler
    ├── models/                        # Mongoose schemas
    │   ├── User.js                    # User schema with bcrypt password hashing
    │   ├── Transaction.js             # Transaction schema with indexes on user and date
    │   └── Budget.js                  # Monthly category budget schema
    ├── middleware/                    # Express middleware
    │   ├── auth.js                    # JWT Bearer token authentication guard
    │   └── errorHandler.js            # Standardized JSON error response handler
    ├── controllers/                   # Route business logic handlers
    │   ├── authController.js          # Register, login, profile retrieval & updates
    │   ├── transactionController.js   # Transaction CRUD, filters, and aggregations
    │   ├── budgetController.js        # Budget CRUD and monthly utilization calculation
    │   ├── dashboardController.js     # Fast KPI aggregations and distribution data
    │   ├── aiController.js            # OpenAI GPT prompt builder and heuristic fallback
    │   └── reportController.js        # Monthly summary compilation & PDFKit streaming
    ├── routes/                        # Express API route declarations
    │   ├── authRoutes.js              # /api/v1/auth
    │   ├── transactionRoutes.js       # /api/v1/transactions
    │   ├── budgetRoutes.js            # /api/v1/budgets
    │   ├── dashboardRoutes.js         # /api/v1/dashboard
    │   ├── aiRoutes.js                # /api/v1/ai
    │   └── reportRoutes.js            # /api/v1/reports
    ├── services/                      # External & helper services
    │   ├── aiService.js               # OpenAI API communicator & heuristic algorithm
    │   └── pdfService.js              # PDFKit document builder for financial statements
    └── utils/
        └── logger.js                  # Standardized console logging utility
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)
- **MongoDB**: Local MongoDB Community Server running on `mongodb://localhost:27017` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud connection string.

---

### 1. Clone Repository

```bash
git clone https://github.com/devags3382/Ai-Based-Finance-.git
cd Ai-Based-Finance-
```

---

### 2. Backend Configuration & Setup

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with your preferences:
   ```env
   NODE_ENV=development
   PORT=5000

   # MongoDB Connection String (Local or Atlas)
   MONGODB_URI=mongodb://localhost:27017/ai-finance-tracker

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
   JWT_EXPIRE=7d

   # OpenAI API Configuration (Optional: built-in fallback will activate if omitted)
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini

   # Allowed CORS Origin for Client
   FRONTEND_URL=http://localhost:5173
   ```

---

### 3. Frontend Configuration & Setup

1. Open a second terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. (Optional) If running the backend on a port other than `5000`, configure `.env` in `client/`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

---

### 4. Running the Application

#### Start Backend Server:
```bash
# In the server/ directory:
npm run dev
```
*The backend server will start on `http://localhost:5000` and automatically connect to MongoDB.*

#### Start Frontend Client:
```bash
# In the client/ directory:
npm run dev
```
*The Vite development server will start on `http://localhost:5173`.*

Open your browser and navigate to **`http://localhost:5173`** to begin using FinTrack AI!

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api/v1`

All protected endpoints require the following HTTP Header:
```http
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/register` | No | Register a new user account |
| `POST` | `/auth/login` | No | Authenticate user & return JWT token |
| `GET` | `/auth/me` | **Yes** | Retrieve authenticated user profile & lifetime stats |
| `PUT` | `/auth/profile` | **Yes** | Update user display name and profile settings |

#### Register Request Example (`POST /api/v1/auth/register`):
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Password123!"
}
```

#### Register / Login Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "currency": "USD"
  }
}
```

---

### Transaction Endpoints
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/transactions` | **Yes** | Get paginated transactions with optional filters (`type`, `category`, `paymentMethod`, `startDate`, `endDate`, `search`, `page`, `limit`) |
| `POST` | `/transactions` | **Yes** | Create a new transaction |
| `GET` | `/transactions/:id`| **Yes** | Retrieve a single transaction by ID |
| `PUT` | `/transactions/:id`| **Yes** | Update an existing transaction |
| `DELETE`| `/transactions/:id`| **Yes** | Delete a transaction |

#### Create Transaction Request (`POST /api/v1/transactions`):
```json
{
  "title": "Grocery Shopping",
  "amount": 142.50,
  "type": "expense",
  "category": "Food & Dining",
  "paymentMethod": "Credit Card",
  "date": "2026-09-19",
  "notes": "Weekly supermarket essentials"
}
```

---

### Budget Endpoints
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/budgets` | **Yes** | Get monthly budgets and actual spent amounts (`?month=2026-09`) |
| `POST` | `/budgets` | **Yes** | Create or update category budgets for a specific month |
| `DELETE`| `/budgets/:id` | **Yes** | Delete a monthly budget configuration |

#### Create/Update Budget Request (`POST /api/v1/budgets`):
```json
{
  "month": "2026-09",
  "categoryBudgets": [
    { "category": "Food & Dining", "limitAmount": 600 },
    { "category": "Shopping", "limitAmount": 300 },
    { "category": "Utilities", "limitAmount": 250 },
    { "category": "Entertainment", "limitAmount": 150 }
  ]
}
```

---

### Dashboard Analytics Endpoints
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/dashboard/stats` | **Yes** | Returns KPI totals (income, expense, balance, savings rate), category distributions, monthly cash flow charts, and recent records |

---

### AI Insights Endpoints
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/ai/insights` | **Yes** | Returns personalized AI recommendations, risk assessments, and forecast analytics |

#### Sample AI Response:
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "recommendation",
        "category": "Food & Dining",
        "message": "Your dining out expenses increased by 18% compared to last week. Consider home meal prep to save ~$120 this month.",
        "impact": "high"
      },
      {
        "type": "savings_opportunity",
        "category": "Utilities",
        "message": "Utilities spending is stable. You are on track to save 22% of your total income this cycle.",
        "impact": "medium"
      }
    ],
    "forecast": {
      "projectedTotalExpense": 2150.00,
      "projectedSavings": 850.00,
      "dailyBurnRate": 71.66
    }
  }
}
```

---

### Reports & PDF Endpoints
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/reports/monthly` | **Yes** | Returns monthly aggregated financial statement data (`?month=2026-09`) |
| `GET` | `/reports/pdf` | **Yes** | Streams a formatted vector PDF financial statement document (`?month=2026-09`) |

---

## 🗄️ Database Schemas

### User Schema (`models/User.js`)
```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  currency: { type: String, default: 'USD' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Transaction Schema (`models/Transaction.js`)
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { 
    type: String, 
    enum: [
      'Food & Dining', 'Salary', 'Shopping', 'Housing', 
      'Transportation', 'Utilities', 'Entertainment', 
      'Healthcare', 'Investment', 'Freelance', 'Other'
    ], 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'], 
    default: 'Cash' 
  },
  date: { type: Date, default: Date.now, index: true },
  notes: { type: String, default: '' }
}
```

### Budget Schema (`models/Budget.js`)
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  month: { type: String, required: true }, // Format: "YYYY-MM"
  categoryBudgets: [
    {
      category: { type: String, required: true },
      limitAmount: { type: Number, required: true, min: 0 }
    }
  ],
  totalLimit: { type: Number, default: 0 }
}
```

---

## 🛡️ Security & Resilience

- **Password Hashing**: Salted password encryption via `bcrypt` with work factor 10. Passwords are never stored in plaintext.
- **JWT Authentication**: Protected API endpoints enforce cryptographically signed JSON Web Tokens with expiry validation.
- **Rate Limiting**: Integrated `express-rate-limit` prevents brute force login attacks and API abuse.
- **HTTP Header Hardening**: Secured with `helmet` for XSS protection, MIME sniffing prevention, and strict transport security.
- **Data Isolation**: All MongoDB queries are scoped strictly to the authenticated `req.user.id` to prevent cross-user data exposure.
- **CORS Restricted**: Server validates originating client origins and rejects unauthorized foreign domains.
- **AI Heuristic Fallback**: AI insights route guarantees zero downtime and valid analytical responses even when external third-party AI APIs are rate-limited or offline.

---

## 🧪 Testing & Scripts

### Backend (`server/`)
```bash
# Run server in production mode
npm start

# Run server with live nodemon reloading
npm run dev

# Run backend unit and integration test suites
npm test
```

### Frontend (`client/`)
```bash
# Run client Vite dev server
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Developed with ❤️ by <a href="https://github.com/devags3382">devags3382</a>
</p>

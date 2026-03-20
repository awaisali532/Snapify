# ⚡ Snapify - Premium Snapchat Accounts & Boosting Services

Welcome to the official repository of **Snapify**! This is a full-stack MERN web application designed for seamlessly browsing, purchasing, and managing premium Snapchat accounts and Score Boosting services.

## 🚀 Key Features

### 👨‍💻 User Experience (Frontend)

- **Dual Mode UI:** Premium Dark and Light mode themes with a distinct "Snap Yellow" aesthetic.
- **Dynamic Currency Converter:** Instantly switch and view prices in PKR, USD, GBP, EUR, and BDT.
- **Two Core Services:**
  - **Account Buy:** Browse and purchase high-score accounts.
  - **Score Boosting:** Securely submit credentials to purchase score boosts (with special offer badges).
- **Secure Checkout Flow:** Fetch dynamic payment methods (SadaPay, JazzCash, Binance, etc.) directly from the database and upload payment receipts securely.
- **My Orders Vault:** Track order status in real-time (`Pending` ⏳, `In Progress` ⚙️, `Completed` ✅, `Rejected` ❌) and securely view purchased account credentials.
- **Verified Reviews System:** Leave reviews with screenshots. Includes a unique **"Ask Me 💬"** feature allowing new users to contact past buyers via social links to verify authenticity.
- **Direct Contact:** 1-click WhatsApp "Contact Seller" integration with auto-filled account details.

### 👑 Admin Control Room (Backend)

- **Comprehensive Dashboard:** Track total revenue, pending orders, and sold accounts with visual charts.
- **Advanced Order Management:** Verify payments, view receipts, and seamlessly update statuses.
- **Smart Auto-Cleanup:** If an order fails during checkout or is deleted by the admin, orphaned payment screenshots are automatically destroyed from Cloudinary to prevent storage leaks.
- **Dynamic Payment Settings:** Full CRUD operations for payment methods. Add, edit, hide, or delete bank details straight from the admin panel without touching the codebase.
- **Discord Integration:** Instant webhook notifications to a private Discord channel the moment a new order is placed.

---

## 💻 Tech Stack

**Frontend:**

- React.js (Vite)
- Tailwind CSS (Custom dark/light configurations)
- React Router DOM
- Context API (State management for Auth, Currency, and Loaders)
- SweetAlert2 (Beautiful popups)
- Swiper.js (Review sliders)

**Backend:**

- Node.js & Express.js
- MongoDB & Mongoose (Schema validation & relationships)
- Cloudinary (Image and receipt storage)
- JSON Web Tokens (JWT) for secure authentication
- Axios (For Discord Webhook integration)

---

## 🛠️ Local Setup & Installation

Follow these steps to run the project on your local machine.

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
\`\`\`

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and setup environment variables.
\`\`\`bash
cd backend
npm install
\`\`\`

Create a `.env` file in the `backend` folder and add the following:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DISCORD_WEBHOOK_URL=your_discord_webhook_url
\`\`\`

Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies.
\`\`\`bash
cd frontend
npm install
\`\`\`

Create a `.env` file in the `frontend` folder and add your backend API URL:
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

---

## 📸 Screenshots

_(Add your project screenshots here. e.g., `![Dashboard View](/assets/dashboard.png)`)_

---

## 👤 Author

Developed with ❤️ by **[Awais Ali]**

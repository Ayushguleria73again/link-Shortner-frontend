# smol. — Tiny Links, Big Data 🚀✨

**smol.** is a premium, professional-grade link management and intelligence platform built for marketers, developers, and data-driven creators. It transforms standard URL shortening into an immersive "Command Center" experience.



---

## 🌪️ The "Elite" Visual Identity
**smol.** isn't just a tool; it's an aesthetic experience.
- **Immersive Hero**: Featuring a high-fidelity "Matrix Bit-Rain" and an interactive modular mouse follower.
- **Dynamic Island Navigation**: Modern, app-like navigation that responds to scroll behavior.
- **Fluid Motion**: Powered by `framer-motion` for spring-physics reveals and seamless transitions.
- **Ultra-Minimalist UI**: A "Pristine White" theme with subtle glassmorphism and technical accents.

---

## ⚡ Key Features

### 📡 Intelligence & Analytics
- **Bot & Ghost Filtering**: Real-time identification of crawlers and non-human traffic to ensure marketing fidelity.
- **UTM Campaign Tracking**: Automated extraction and aggregation of marketing signals (`utm_source`, `utm_medium`, `utm_campaign`).
- **High-Precision Heartbeat**: Automated uptime monitoring with intelligent batch processing, retry logic, and real-time latency telemetry.
- **Satellite Market Heatmap**: High-fidelity global density visualization for Scale-tier market saturation analysis.
- **City-Level Tracking**: Deep geo-intelligence to see exactly where your signal is landing.
- **Real-time Pulse Feed**: A live "Tick" stream of incoming click events across your collection.
- **Performance Ranking**: Identification of high-value "Power Links" via the Performer Intelligence table.

### 📧 Communication Protocols
- **Smart Email Service**: Centralized messaging system that respects user privacy. "Essential" signals (OTPs) bypass gates, while "Optional" insights (Milestones) are governed by user settings.
- **Signal Stream (Newsletter)**: A public-facing telemetry stream for non-users and power users alike, fully integrated with the global preference engine.
- **Link Hub Identity**: Custom public profiles (`/u/username`) with verified credentials, social integration, and real-time identity previews.

### 🛡️ Enterprise-Grade Security
- **Password Armor**: Lock sensitive links behind high-security gates.
- **Burn-on-Read**: One-time redirection protocols for secure token/password sharing.
- **Link Expiration**: Automated self-destruction after reaching hit thresholds or time limits.
- **Brute-Force Protection**: Global security filters for rate-limiting and access control.

### 💰 Professional SaaS Logic
- **Monetization Engine**: Pre-integrated with Razorpay (Spark, Growth, Elite tiers).
- **Campaign Grouping**: Organize links into logical business units for aggregated tracking.
- **Custom Domains**: Support for branded short links with CNAME verification logic.
- **God Mode**: A hidden administrative oversight dashboard for global ecosystem monitoring.

### 📝 Community Intelligence (Blog System)
- **High-Authority Content**: SEO-optimized articles focusing on link management, analytics, and digital security.
- **Visual Intelligence**: Custom-generated cover imagery for all technical entries.
- **Interactivity Protocol**: Persisted "Like" and comment interactions to foster community engagement.
- **Terminology Accuracy**: Direct, literal language optimized for clarity and SEO.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router), React, Framer Motion, Tailwind CSS.
- **Backend**: Node.js, Express, JWT, MongoDB (Mongoose).
- **Payment Gateway**: Razorpay Integration.
- **Deployment**: Optimized for Vercel/Render.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies for both layers:
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Environment Configuration
Create `.env` files in both directories based on these templates:

#### Backend (`/backend/.env`)
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_BASE_URL=http://localhost:5001
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Execution
```bash
# Start Backend
cd backend && npm run dev

# Start Frontend
cd frontend && npm run dev
```

---

## 🏷️ Tags
`saas` `link-shortener` `nextjs` `analytics` `matrix` `dashboard` `premium` `minimalist` `react` `nodejs` `mongodb` `razorpay` `redirection` `responsive` `pwa`

---

Built with ❤️ by **ayush** & **Antigravity AI**.

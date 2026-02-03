# 🎨 Shorty Elite Insight Interface

A cinematic, high-fidelity management console for **Shorty Elite**. Built with Next.js 14, this interface transforms raw click data into a pulsing "Matrix-style" visual experience.

## 🚀 Key Features

- **Matrix Aesthetics:** Cinematic "01" Binary Rain background, technical "Space Mono" typography, and scrambling text animations.
- **Elite Dashboard:** Real-time analytics polling every 5 seconds with pulsing "LIVE" indicators.
- **PWA Support:** Installable as a Progressive Web App on iOS, Android, and Desktop.
- **Link Hub:** Dynamic, public-facing creator profiles (`/u/username`) for consolidated link management.
- **Intelligence Engine:** Interactive charts for traffic timelines, source attribution, and hourly engagement.
- **Secure Gateways:** Custom branded "Password Gate" and "Link Suspended" cinematic error views.

## 🛡️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Vanilla CSS & TailwindCSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **PWA:** Manifest.json & Service Workers
- **Analytics:** Chart.js / Recharts

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

4. **Initialize Console:**
   ```bash
   npm run dev
   ```

## 🔌 Repository Structure

- `/app`: Next.js App Router (Pages & Layouts)
- `/components`: Reusable UI components (MatrixRain, ScrambleText, etc.)
- `/public`: Static assets, PWA manifest, and high-res Matrix backgrounds.
- `/lib`: API communication layer.

---
> *Less Link. More Data.* 🕶️📟🚀

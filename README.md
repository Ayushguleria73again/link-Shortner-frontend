# smol. — Frontend Architecture 🚀🎨

The user-facing intelligence portal for **smol.**, built with Next.js 14 and high-fidelity animations.

## 🎨 Key Visual Features
- **Dynamic Island Navbar**: Responsive, floating navigation with smart scroll detection.
- **Hero Bit-Rain**: Immersive Matrix-style binary animation background.
- **Modular Cursor**: Interactive following dot with spring-physics.
- **Scroll Reveals**: Section-based `whileInView` animations for an elite feel.

## 🏗️ Technical Implementation
- **Next.js 14**: Utilizing the App Router for fast, server-side optimized rendering.
- **Framer Motion**: Powering every interaction for high visual fidelity.
- **Tailwind CSS**: Utility-first styling for a clean, minimalist aesthetic.
- **Link-in-Bio Hub**: Public profile builder at `/u/username`.

## ⚙️ Environment Variables
Required in your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_BASE_URL=http://localhost:5001
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```
- `NEXT_PUBLIC_API_URL`: The endpoint for your Node.js backend.
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: For secure payment processing.

## ⚡ Execution
```bash
npm install
npm run dev
```

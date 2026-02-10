# Changelog

All notable changes to **smol - Premium Link Shortener SaaS** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-02-06

### 🎉 Initial Release

The first production-ready release of **smol** - a premium link management and intelligence platform.

### ✨ Added

#### Core Features
- **Link Shortening Engine**: Generate short codes with custom alias support
- **QR Code Generation**: Instant QR codes for all shortened links
- **Link Expiration**: Time-based and hit-based auto-destruction
- **Password Protection**: Secure links with password gates
- **Burn-on-Read**: One-time redirection for sensitive content
- **Custom Domains**: Support for 1-25 branded domains (plan-based)

#### Analytics & Intelligence
- **Real-time Analytics Dashboard**: Live click tracking and metrics
- **Bot Detection & Filtering**: Identify and filter non-human traffic
- **UTM Campaign Tracking**: Automated marketing signal extraction
- **City-Level Geo-Tracking**: Precise geographic intelligence
- **Unique Visitor Tracking**: Separate total clicks from unique visitors
- **Hourly Engagement Heatmaps**: Visualize peak traffic windows
- **Performance Ranking**: Identify top-performing links
- **Live Activity Feed**: Real-time click stream
- **Referrer Analytics**: Track traffic sources with mobile indicators
- **Device & Browser Stats**: Comprehensive user agent analysis

#### Campaign Management
- **Campaign Grouping**: Organize links into business units
- **Campaign Drill-down**: Filter link library by campaign
- **Aggregated Metrics**: Combined stats for campaign clusters
- **Visual Campaign Cards**: Color-coded campaign organization

#### Security & Monitoring
- **Destination Heartbeat**: Automated uptime monitoring with retry logic
- **Link Health Indicators**: Real-time status with latency tracking
- **Rate Limiting**: Global API protection
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt encryption for user credentials
- **CORS Protection**: Configured cross-origin security

#### User Management
- **Multi-Tier Pricing**: Spark (Free), Growth, Elite, Scale plans
- **Usage Tracking**: Monitor link and click quotas
- **Soft Limits**: Graceful degradation when limits reached
- **Email Verification**: OTP-based signup verification
- **Account Management**: Profile editing and account deletion
- **Admin Dashboard**: "God Mode" for platform oversight

#### Payment Integration
- **Razorpay Integration**: Secure payment processing
- **INR Support**: Localized pricing (₹399, ₹899, ₹2499)
- **Signature Verification**: Payment security validation
- **Payment Audit Trail**: Complete transaction history
- **Plan Upgrades**: Seamless tier transitions

#### Communication
- **Smart Email Service**: Preference-based email system
- **Newsletter System**: Public subscription with preferences
- **Milestone Notifications**: Optional achievement emails
- **OTP Delivery**: Essential verification emails
- **Email Templates**: Professional HTML email design

#### Content & Community
- **Blog System**: SEO-optimized article platform
- **Like & Comment System**: Interactive content engagement
- **Blog Admin Panel**: Full CRUD with image uploads
- **Link Hub Profiles**: Public user profiles (/u/username)
- **Social Integration**: Link to social media profiles
- **Bio & Avatar**: Customizable public identity

#### UI/UX
- **Matrix Background**: Animated bit-rain hero section
- **Dynamic Island Navigation**: Scroll-responsive navbar
- **Framer Motion Animations**: Smooth spring-physics transitions
- **Command Palette**: Cmd+K global search
- **Responsive Design**: Mobile, tablet, desktop optimization
- **Dark Mode Elements**: Strategic dark UI components
- **Glassmorphism**: Modern translucent effects
- **Interactive Mouse Follower**: Glowing metric dot
- **Custom 404 Page**: Branded error experience
- **Zero State UI**: Onboarding cards for empty states

#### Developer Features
- **REST API**: Complete backend API
- **API Documentation**: Endpoint reference guide
- **Environment Templates**: .env.example files
- **Database Models**: Comprehensive Mongoose schemas
- **Middleware System**: Reusable auth and validation
- **Error Handling**: Centralized error management
- **CORS Configuration**: Flexible origin control

#### SEO & Performance
- **SEO Optimization**: Meta tags, Open Graph, Twitter Cards
- **Sitemap Generation**: Dynamic XML sitemap
- **Robots.txt**: Search engine directives
- **PWA Support**: Progressive Web App manifest
- **Image Optimization**: Cloudinary integration
- **Code Splitting**: Next.js automatic optimization

#### Admin Features
- **User Management**: View and manage all users
- **Plan Override**: Manual tier adjustments
- **Account Suspension**: Ban/unban functionality
- **Newsletter Management**: Subscriber list and broadcast
- **Bug Reports**: User feedback system with images
- **Global Stats**: Platform-wide analytics

### 🛠️ Technical Stack

#### Frontend
- Next.js 16.1.6 (App Router)
- React 19.2.3
- Framer Motion 12.30.1
- Tailwind CSS 4
- Lucide React (icons)
- Recharts (charts)
- Sonner (toasts)

#### Backend
- Node.js 18+
- Express 4.21.2
- MongoDB (Mongoose 8.9.5)
- JWT (jsonwebtoken 9.0.3)
- Bcrypt (bcryptjs 2.4.3)
- Nodemailer 7.0.13
- Razorpay 2.9.6
- Cloudinary 2.9.0

### 📦 Files Included
- Complete Next.js frontend application
- Full Express.js backend API
- MongoDB database models
- Comprehensive documentation
- Environment configuration templates
- Deployment guides (Vercel + Render)
- License and changelog

### 🔒 Security
- Helmet.js security headers
- Rate limiting on all routes
- JWT token expiration
- Password strength validation
- SQL injection protection (MongoDB)
- XSS protection
- CSRF token support

### 📱 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- IE11 (limited support)

### 🌐 Deployment Ready
- Vercel-optimized frontend
- Render-compatible backend
- Environment-based configuration
- Production error handling
- Database connection pooling

---

## [Unreleased]

### 🔮 Planned Features
- A/B testing for links
- Slack/Discord webhook integrations
- Multi-language support (i18n)
- Team collaboration features
- White-label options
- Advanced retargeting pixel management
- Telegram bot integration
- Two-factor authentication (2FA)
- CSV bulk link import
- Link scheduling
- Custom redirect pages
- Advanced role-based access control

---

## Version History

- **1.0.0** (2026-02-06) - Initial ThemeForest release

---

## Support

For bug reports, feature requests, or technical support, please use the ThemeForest support system.

---

**Note**: This changelog will be updated with each new version release. Check your ThemeForest downloads for the latest version.

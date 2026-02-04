import { BarChart3, TrendingUp, PieChart, Network } from 'lucide-react';

export const PLANS = {
    free: {
        name: "Spark",
        price: 0,
        description: "Perfect for testing the waters.",
        longDescription: "Spark is designed for individuals who are just getting started with link management. It provides all the essentials to create short links and track basic performance without any cost.",
        idealFor: "Students, Hobbyists, & Personal Use",
        icon: <BarChart3 className="w-8 h-8 text-zinc-400" />,
        color: "zinc",
        includedFeatures: [
            { category: "Core", items: ["50 Active Signals", "Standard Support", "Discord Community Access"] },
            { category: "Analytics", items: ["1,000 Monthly Intel Pings", "Basic Click Counts", "7-Day Data Retention"] },
            { category: "Tools", items: ["QR Code Generator", "Matrix Aesthetics"] }
        ]
    },
    starter: {
        name: "Growth",
        price: 399,
        description: "Essential tools for growing creators.",
        longDescription: "The Growth plan unlocks the power of data. Understand where your audience is coming from and what devices they use. Perfect for content creators looking to optimize their reach.",
        idealFor: "Creators, Influencers, & Freelancers",
        icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
        color: "emerald",
        includedFeatures: [
            { category: "Core", items: ["500 Active Signals", "1 Custom Branded Domain", "CSV Data Export"] },
            { category: "Security", items: ["Signal Encryption (Password)", "Link Auto-Termination", "Smart Device Targeting"] },
            { category: "Analytics", items: ["15,000 Monthly Intel Pings", "Country-Level Geography", "30-Day Data Retention"] }
        ]
    },
    pro: {
        name: "Elite",
        price: 899,
        description: "Advanced power for serious brands.",
        longDescription: "Elite is our most popular plan for businesses. It offers granular city-level data, real-time analytics streams, and API access for developers. Dominate your market with precision.",
        idealFor: "Startups, Small Agencies, & Power Users",
        icon: <PieChart className="w-8 h-8 text-indigo-500" />,
        color: "indigo",
        includedFeatures: [
            { category: "Command", items: ["Global Overload Dashboard", "Operational Campaigns", "Bulk Link Creation"] },
            { category: "Branding", items: ["Custom Redirection Aesthetics", "5 Custom Branded Domains", "Deep Search Intelligence"] },
            { category: "Intelligence", items: ["150,000 Monthly Intel Pings", "City-Level Precision Data", "Burn-on-Read Protocol"] },
            { category: "Advanced", items: ["Retargeting Pixels", "Live Activity Stream (City Level)", "1-Year Data Retention"] }
        ]
    },
    business: {
        name: "Scale",
        price: 2499,
        description: "Enterprise-grade infrastructure.",
        longDescription: "Scale provides the infrastructure for high-volume teams. With SSO, a dedicated account manager, and white-label capabilities, it is built for organizations that demand the best.",
        idealFor: "Large Teams, Enterprises, & High-Volume Senders",
        icon: <Network className="w-8 h-8 text-amber-500" />,
        color: "amber",
        includedFeatures: [
            { category: "Core", items: ["50,000 Active Signals", "25 Custom Branded Domains", "SSO/SAML Integration"] },
            { category: "Volume", items: ["2,000,000 Monthly Intel Pings", "Unlimited Data Retention", "99.99% Uptime SLA"] },
            { category: "VIP", items: ["Dedicated Support", "Priority Matrix Bandwidth", "White-label Dashboard"] }
        ]
    }
};

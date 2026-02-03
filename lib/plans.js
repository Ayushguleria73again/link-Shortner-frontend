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
            { category: "Core", items: ["50 Active Short Links", "Standard Support"] },
            { category: "Analytics", items: ["1,000 Monthly Clicks", "Basic Click Counts"] },
            { category: "Tools", items: ["QR Code Generator"] }
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
            { category: "Core", items: ["500 Active Short Links", "Custom Aliases (e.g. /my-brand)"] },
            { category: "Analytics", items: ["15,000 Monthly Clicks", "Country-Level Geography", "Device & Browser Stats"] },
            { category: "Tools", items: ["CSV Data Export", "QR Code Customization"] }
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
            { category: "Core", items: ["Unlimited Active Links", "Priority Email Support"] },
            { category: "Analytics", items: ["150,000 Monthly Clicks", "City-Level Precision Data", "Real-Time Activity Stream"] },
            { category: "Advanced", items: ["Developer API Access", "Smart Retargeting Pixels"] }
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
            { category: "Core", items: ["Unlimited Active Links", "SSO & SAML Integration"] },
            { category: "Analytics", items: ["2,000,000 Monthly Clicks", "Unlimited Data Retention"] },
            { category: "vip", items: ["Dedicated Account Manager", "White-label Dashboard", "Custom Domain Support"] }
        ]
    }
};

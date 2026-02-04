export default function sitemap() {
    const baseUrl = 'https://smol-saas.com'; // Replace with actual domain

    // Static Routes
    const routes = [
        '',
        '/pricing',
        '/login',
        '/signup',
        '/faq',
        '/about',
        '/contact',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Plans
    const plans = ['free', 'starter', 'pro', 'business'].map((plan) => ({
        url: `${baseUrl}/pricing/${plan}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
    }));

    return [...routes, ...plans];
}

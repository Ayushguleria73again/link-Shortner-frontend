export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/settings/'], // Protect private routes
      },
      sitemap: 'https://smol-saas.com/sitemap.xml',
    }
  }

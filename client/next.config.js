/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	i18n: {
		locales: ['en-GB', 'es-ES'],
		defaultLocale: 'en-GB',
	},
	trailingSlash: true,
	images: {
		minimumCacheTTL: 3600,
		domains: ['images.ctfassets.net', 'downloads.ctfassets.net'],
		formats: ['image/avif', 'image/webp'],
	},
};

module.exports = nextConfig;

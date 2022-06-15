/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xs: '340px',
			sm: '400px',
			md: '480px',
			lg: '700px',
			xl: '860px',
			'2xl': '1200px',
			tablet: { min: '700px', max: '859px' },
			mobile: { max: '699px' },
		},
		extend: {},
	},
	plugins: [],
};

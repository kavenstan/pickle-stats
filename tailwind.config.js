/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,svelte}', './node_modules/svelte-ux/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#007bff', // Primary color
					light: '#66b2ff', // Light variant
					dark: '#0056b3' // Dark variant
				},
				accent: {
					DEFAULT: '#ff5722', // Accent color
					light: '#ff8a50', // Light variant
					dark: '#c41c00' // Dark variant
				}
				// You can add more custom colors or other properties as needed
			}
		}
	},
	plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	
	content: [
		// Indique las rutas de todos sus archivos de código que contienen clases de Tailwind
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [],
};

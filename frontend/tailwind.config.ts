/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // ✅ required for manual dark mode
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './pages/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
            },
        },
    },
    plugins: [],
}

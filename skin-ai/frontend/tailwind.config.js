/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#020617', // Very dark blue/slate
                primary: '#00F0FF', // Electric Neon Blue
                secondary: '#0a192f', // Mid-tone dark blue
                dark: '#ccd6f6', // Light text
            },
        },
    },
    plugins: [],
}

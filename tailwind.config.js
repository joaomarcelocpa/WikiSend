export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'max-data': '#155457',
                'high-data': '#268c90',
                'mid-data': '#3fbec5',
                'low-data': '#6ed3d8',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [require('daisyui')],
}
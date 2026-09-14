export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0d9488',
          dark: '#0f766e',
          // Hover do botão primário (bg-teal-dark) — precisa de um tom mais escuro ainda
          // pra dar feedback visual, já que bg-teal-dark virou o estado de repouso.
          darker: '#0b5c54',
          soft: '#f0fdfa',
          mid: '#99f6e4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

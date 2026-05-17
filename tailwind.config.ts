import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E6FD9',
          yellow: '#F4A62A',
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
          background: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#64748B',
        },
      },
      boxShadow: {
        card: '0 18px 45px -24px rgba(15, 23, 42, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

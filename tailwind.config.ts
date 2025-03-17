import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Mode sombre (Sung Jin-Woo)
        shadow: {
          primary: '#6A1B9A',    // Violet royal profond
          secondary: '#13111C',  // Fond très sombre avec une touche de violet
          accent: '#9C27B0',     // Violet vif pour les accents
          glow: '#4A148C',       // Violet sombre pour les effets de lueur
          text: '#E2E8F0',       // Texte clair
          // Nouvelles nuances
          dark: '#0A0812',       // Presque noir avec touche de violet
          purple: '#7B1FA2',     // Violet moyen
          red: '#C2185B',        // Rouge-violet
          crimson: '#D32F2F',    // Rouge sang
          surface: '#1A1625',    // Fond alternatif
          muted: '#4A4458',      // Violet grisé pour éléments désactivés
        },
        // Cha Hae-In theme (Light)
        light: {
          primary: '#FDB813',    // Or principal
          secondary: '#F5F0EB',  // Blanc cassé
          accent: '#9E2A2B',     // Rouge profond
          glow: '#FFE4B5',       // Lueur dorée
          text: '#1F1F1F',       // Texte sombre
          red: {
            light: '#CB4B4B',
            DEFAULT: '#9E2A2B',
            dark: '#7C1D1D',
          },
          gold: {
            light: '#FFD700',    // Or plus vif
            DEFAULT: '#FDB813',  // Or principal
            dark: '#DAA520',     // Or foncé
          },
          surface: '#FFF8E7',    // Fond légèrement doré
          muted: '#BFA67A',      // Or grisé
        },
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shadow-pattern': "url('/patterns/shadow.png')",
        'light-pattern': "url('/patterns/light.png')",
        'skill-gradient': 'linear-gradient(90deg, #6A1B9A 0%, #9C27B0 50%, #D32F2F 100%)',
        'hover-gradient': 'linear-gradient(90deg, #4A148C 0%, #7B1FA2 50%, #C2185B 100%)',
        'button-gradient': 'linear-gradient(45deg, #6A1B9A 0%, #D32F2F 100%)',
        'skill-gradient-light': 'linear-gradient(90deg, #C8A36C 0%, #B08B4F 50%, #9E2A2B 100%)',
        'hover-gradient-light': 'linear-gradient(90deg, #DFC393 0%, #C8A36C 50%, #CB4B4B 100%)',
        'button-gradient-light': 'linear-gradient(45deg, #C8A36C 0%, #9E2A2B 100%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shadow-pulse': 'shadow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shadow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px 0px rgba(107, 75, 177, 0.3)' },
          '50%': { boxShadow: '0 0 40px 10px rgba(107, 75, 177, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}

export default config 
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
          // Nouvelles couleurs pour Double-Éveil
          monarch: '#8E24AA',    // Violet du Shadow Monarch
          system: '#1A237E',     // Bleu foncé pour l'interface système
          alert: '#F44336',      // Rouge vif pour les alertes
          level: '#4CAF50',      // Vert pour les statistiques qui augmentent
          quest: '#FFD700',      // Or pour les quêtes
          blue: '#304FFE',       // Bleu électrique pour les compétences
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
          // Nouvelles couleurs pour le mode Cha Hae-In
          hunter: '#FFCC80',     // Or clair pour l'interface
          rank: '#D84315',       // Orange-rouge pour le rang
          stat: '#FFA000',       // Ambre pour les statistiques
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
        // Nouveaux gradients pour Double-Éveil
        'double-awakening': 'linear-gradient(135deg, #6A1B9A 0%, #304FFE 50%, #1A237E 100%)',
        'system-gradient': 'linear-gradient(180deg, #1A237E 0%, #0D47A1 100%)',
        'rank-up': 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
        'monarch-aura': 'radial-gradient(circle, #9C27B0 0%, #6A1B9A 50%, #13111C 100%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shadow-pulse': 'shadow-pulse 2s ease-in-out infinite',
        // Nouvelles animations
        'system-alert': 'system-alert 0.5s ease-in-out',
        'level-up': 'level-up 1s ease-out',
        'monarch-emerge': 'monarch-emerge 2s ease-in-out',
        'flicker': 'flicker 2s linear infinite',
        'vibrate': 'vibrate 0.15s linear infinite',
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
        // Nouveaux keyframes
        'system-alert': {
          '0%': { transform: 'scale(0.95)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'monarch-emerge': {
          '0%': { filter: 'brightness(0.5) blur(5px)', opacity: '0.3' },
          '100%': { filter: 'brightness(1) blur(0)', opacity: '1' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
          '25%, 75%': { opacity: '0.9' },
        },
        'vibrate': {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(-1px, 1px)' },
          '50%': { transform: 'translate(1px, -1px)' },
          '75%': { transform: 'translate(-1px, -1px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config 
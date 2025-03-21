import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Louis Rigaux | Data Scientist & IA Engineer',
  description: 'Portfolio professionnel de Louis Rigaux, Data Scientist et ingénieur en intelligence artificielle spécialisé dans le machine learning et l\'analyse de données.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className="bg-shadow-dark text-shadow-text">
        <ThemeProvider>
              {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 
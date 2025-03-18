import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';

// Utilisation d'une police plus moderne et professionnelle
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: 'Portfolio Data Science & AI | Solo Leveling',
  description: 'Portfolio de Data Scientist & Ingénieur IA inspiré par Solo Leveling. Spécialiste en Machine Learning, Deep Learning et NLP.',
  keywords: 'data science, machine learning, IA, intelligence artificielle, portfolio, solo leveling, deep learning, NLP',
  authors: [{ name: 'Data Scientist' }],
  creator: 'Data Scientist',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 
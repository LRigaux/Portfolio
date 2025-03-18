'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }
      
      // Rediriger vers le dashboard
      router.push('/admin');
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-shadow-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-shadow-system rounded-lg shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-shadow-text">
            Admin Login
          </h1>
          <p className="text-shadow-text/60 mt-2">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-shadow-monarch/20 border border-shadow-monarch/30 rounded-md text-shadow-monarch text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-shadow-text mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-shadow-dark border border-shadow-system text-shadow-text rounded-md focus:outline-none focus:ring-2 focus:ring-shadow-primary"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-shadow-text mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-shadow-dark border border-shadow-system text-shadow-text rounded-md focus:outline-none focus:ring-2 focus:ring-shadow-primary"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-shadow-primary hover:bg-shadow-accent text-white font-medium rounded-md transition-colors duration-300 flex justify-center items-center disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </>
            ) : 'Se connecter'}
          </button>
        </form>
      </motion.div>
    </div>
  );
} 
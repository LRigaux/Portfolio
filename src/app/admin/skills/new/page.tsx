'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSkillPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 50,
    category: '',
    icon: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Langages de Programmation',
    'Frameworks & Librairies',
    'Data Science',
    'Machine Learning',
    'Base de Données',
    'DevOps',
    'Design',
    'Soft Skills'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création de la compétence');
      }

      // Redirection vers la liste des compétences
      router.push('/admin/skills');
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-shadow-text flex items-center">
          <span className="w-2 h-8 bg-shadow-blue mr-3 rounded"></span>
          Nouvelle Compétence
        </h1>
      </div>

      <div className="relative">
        {/* Effet d'énergie lumineuse */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-double-awakening/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-shadow-blue/20 rounded-full blur-xl"></div>
        
        <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-6">
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-shadow-text font-medium mb-2 flex items-center"
              >
                <span className="w-1 h-4 bg-shadow-blue mr-2 rounded"></span>
                Nom de la compétence
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label 
                htmlFor="description" 
                className="block text-shadow-text font-medium mb-2 flex items-center"
              >
                <span className="w-1 h-4 bg-shadow-accent mr-2 rounded"></span>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
              ></textarea>
            </div>
            
            {/* Niveau et Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="level" 
                  className="block text-shadow-text font-medium mb-2 flex items-center"
                >
                  <span className="w-1 h-4 bg-shadow-monarch mr-2 rounded"></span>
                  Niveau ({formData.level}%)
                </label>
                <input
                  type="range"
                  id="level"
                  name="level"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full h-2 bg-shadow-surface rounded-lg appearance-none cursor-pointer accent-shadow-blue"
                />
                <div className="flex justify-between text-xs text-shadow-text/60 mt-1">
                  <span>Débutant</span>
                  <span>Intermédiaire</span>
                  <span>Expert</span>
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="category" 
                  className="block text-shadow-text font-medium mb-2 flex items-center"
                >
                  <span className="w-1 h-4 bg-shadow-monarch mr-2 rounded"></span>
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
                  required
                >
                  <option value="" disabled className="bg-shadow-dark">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-shadow-dark">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Icône */}
            <div>
              <label 
                htmlFor="icon" 
                className="block text-shadow-text font-medium mb-2 flex items-center"
              >
                <span className="w-1 h-4 bg-shadow-quest mr-2 rounded"></span>
                Icône (emoji ou code unicode)
              </label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
                placeholder="🚀, 💻, ⚙️, etc."
              />
              <p className="text-xs text-shadow-text/60 mt-1">
                Optionnel. Utilisez un emoji pour représenter visuellement cette compétence.
              </p>
            </div>
            
            {/* Bouttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-shadow-system">
              <Link
                href="/admin/skills"
                className="px-6 py-2 border border-shadow-system text-shadow-text hover:bg-shadow-system/20 rounded"
              >
                Annuler
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-double-awakening text-white rounded hover:opacity-90 
                  ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création...
                  </span>
                ) : (
                  <span>Créer la compétence</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex justify-center mt-12 opacity-60 hover:opacity-100 transition-opacity">
        <blockquote className="text-center text-shadow-text/80 max-w-lg border-l-4 border-shadow-blue pl-4 py-2 italic">
          "Le niveau ne définit pas le pouvoir, mais la façon dont on l'utilise."
          <footer className="text-right text-sm mt-2">— Sung Jin-Woo</footer>
        </blockquote>
      </div>
    </div>
  );
} 
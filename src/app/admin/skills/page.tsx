'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Types pour les compétences
interface Skill {
  id: string;
  name: string;
  description?: string;
  level: number;
  category: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  // Récupération des compétences
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/skills');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des compétences');
        }
        const data = await response.json();
        setSkills(data);
        
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(data.map((skill: Skill) => skill.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Filtrer les compétences par catégorie si une catégorie est sélectionnée
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  // Fonction pour obtenir la couleur de niveau
  const getLevelColor = (level: number) => {
    if (level >= 90) return 'bg-shadow-blue';
    if (level >= 70) return 'bg-shadow-monarch'; 
    if (level >= 50) return 'bg-shadow-accent';
    return 'bg-shadow-primary';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour la liste des compétences
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-shadow-text flex items-center">
          <span className="w-2 h-8 bg-shadow-monarch mr-3 rounded"></span>
          Gestion des Compétences
        </h1>
        <Link
          href="/admin/skills/new"
          className="flex items-center gap-1 bg-double-awakening hover:opacity-90 text-white px-4 py-2 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Nouvelle Compétence
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Filtres par catégorie */}
      {categories.length > 0 && (
        <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-4">
          <h2 className="text-xl font-bold text-shadow-text mb-4 flex items-center">
            <span className="w-1 h-6 bg-shadow-blue mr-2 rounded"></span>
            Catégories
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-md transition-all ${
                !selectedCategory
                  ? 'bg-shadow-blue text-white'
                  : 'bg-shadow-surface/80 text-shadow-text'
              }`}
            >
              Toutes
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedCategory === category
                    ? 'bg-shadow-blue text-white'
                    : 'bg-shadow-surface/80 text-shadow-text'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste des compétences */}
      <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-t-2 border-shadow-blue animate-spin rounded-full"></div>
              <div className="absolute inset-1 border-r-2 border-shadow-monarch animate-spin rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            {filteredSkills.length === 0 ? (
              <div className="text-center py-8 text-shadow-text/60">
                Aucune compétence trouvée.
                {selectedCategory && (
                  <span> Essayez de sélectionner une autre catégorie ou <button onClick={() => setSelectedCategory(null)} className="text-shadow-blue hover:underline">voir toutes les compétences</button>.</span>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-shadow-surface/20 rounded-lg p-4 hover:bg-shadow-surface/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-shadow-text flex items-center">
                          {skill.icon && (
                            <span className="mr-2">{skill.icon}</span>
                          )}
                          {skill.name}
                        </h3>
                        <p className="text-shadow-text/60 text-sm">{skill.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/skills/${skill.id}`}
                          className="p-1 text-shadow-text hover:text-shadow-blue transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1 text-shadow-text hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {skill.description && (
                      <p className="text-shadow-text/80 mt-2 text-sm">{skill.description}</p>
                    )}
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-shadow-text/60 mb-1">
                        <span>Niveau</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="w-full bg-shadow-dark rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className={`h-full ${getLevelColor(skill.level)}`}
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
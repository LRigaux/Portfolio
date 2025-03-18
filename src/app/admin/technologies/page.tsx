'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Technology } from '@/types';
import { useTheme } from '@/context/ThemeContext';

export default function TechnologiesPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await fetch('/api/technologies');
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des technologies');
        }
        const data = await res.json();
        setTechnologies(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les technologies. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/technologies/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setTechnologies(technologies.filter(tech => tech.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression de la technologie');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
          Gestion des Technologies
        </h1>
        <Link
          href="/admin/technologies/new"
          className={`
            px-4 py-2 rounded
            ${isDark 
              ? 'bg-shadow-primary text-white hover:bg-shadow-accent'
              : 'bg-light-primary text-white hover:bg-light-accent'}
            transition-colors
          `}
        >
          Nouvelle Technologie
        </Link>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isDark ? 'border-shadow-primary' : 'border-light-primary'
          }`}></div>
        </div>
      ) : (
        <div className={`
          rounded-lg overflow-hidden shadow-lg
          ${isDark ? 'bg-shadow-secondary border border-shadow-primary/20' : 'bg-light-secondary border border-light-primary/20'}
        `}>
          <table className="w-full">
            <thead className={`
              ${isDark ? 'bg-shadow-system text-shadow-text' : 'bg-light-gold-DEFAULT text-light-text'}
              border-b border-gray-700
            `}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Projets associés
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`
              divide-y
              ${isDark ? 'divide-shadow-primary/10 text-shadow-text/90' : 'divide-light-primary/10 text-light-text/90'}
            `}>
              {technologies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Aucune technologie disponible
                  </td>
                </tr>
              ) : (
                technologies.map((tech) => (
                  <tr key={tech.id} className={`
                    ${isDark ? 'hover:bg-shadow-surface' : 'hover:bg-light-surface'}
                  `}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">
                          {tech.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${tech.rank === 'S'
                          ? isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark'
                          : tech.rank === 'A'
                            ? isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white'
                            : isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white'
                        }
                      `}>
                        {tech.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tech.category || 'Non défini'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tech.relatedProjects?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/technologies/${tech.id}/edit`}
                        className={`
                          text-indigo-600 hover:text-indigo-900 mr-4
                          ${isDark ? 'text-shadow-blue hover:text-shadow-accent' : 'text-light-primary hover:text-light-accent'}
                        `}
                      >
                        Éditer
                      </Link>
                      <button
                        onClick={() => handleDelete(tech.id)}
                        className={`
                          ${confirmDelete === tech.id
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-gray-600 hover:text-gray-900'}
                          ${isDark ? 'hover:text-shadow-red' : 'hover:text-red-500'}
                        `}
                      >
                        {confirmDelete === tech.id ? 'Confirmer' : 'Supprimer'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
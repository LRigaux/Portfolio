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
  const [newTechnology, setNewTechnology] = useState<{ name: string; iconUrl: string }>({
    name: '',
    iconUrl: ''
  });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; iconUrl: string }>({
    name: '',
    iconUrl: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await fetch('/api/admin/technologies');
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
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      setTechnologies(technologies.filter(tech => tech.id !== id));
      setSuccessMessage('Technologie supprimée avec succès');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setError(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };
  
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTechnology.name,
          iconUrl: newTechnology.iconUrl
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la création de la technologie');
      }
      
      const data = await res.json();
      
      setTechnologies([...technologies, data]);
      setNewTechnology({ name: '', iconUrl: '' });
      setSuccessMessage('Technologie créée avec succès');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setCreateError(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const startEdit = (tech: Technology) => {
    setEditMode(tech.id);
    setEditData({
      name: tech.name,
      iconUrl: tech.iconUrl || ''
    });
  };
  
  const cancelEdit = () => {
    setEditMode(null);
    setEditData({ name: '', iconUrl: '' });
  };
  
  const handleEditSubmit = async (id: string) => {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/admin/technologies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          iconUrl: editData.iconUrl
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour de la technologie');
      }
      
      const updatedTech = await res.json();
      
      setTechnologies(
        technologies.map(tech => tech.id === id ? { ...tech, ...updatedTech } : tech)
      );
      
      setSuccessMessage('Technologie mise à jour avec succès');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      cancelEdit();
    } catch (error) {
      console.error('Erreur:', error);
      setError(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-shadow-text">Gestion des Technologies</h1>
      </div>
      
      {successMessage && (
        <div className="bg-green-500/10 border-l-4 border-green-500 text-green-700 p-4 rounded">
          <p>{successMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-shadow-surface border border-shadow-system rounded-lg p-4">
        <h2 className="text-xl font-semibold text-shadow-text mb-4">Nouvelle Technologie</h2>
        
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={newTechnology.name}
              onChange={(e) => setNewTechnology({ ...newTechnology, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="React, Node.js, etc."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">URL de l'icône (optionnel)</label>
            <input
              type="text"
              value={newTechnology.iconUrl}
              onChange={(e) => setNewTechnology({ ...newTechnology, iconUrl: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="https://exemple.com/icon.svg"
            />
          </div>
          
          {createError && (
            <div className="text-red-500 text-sm">{createError}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-shadow-blue text-white rounded hover:bg-shadow-blue/80 disabled:opacity-50"
          >
            {loading ? 'Traitement...' : 'Créer Technologie'}
          </button>
        </form>
      </div>

      <div className="bg-shadow-surface border border-shadow-system rounded-lg overflow-hidden">
        <div className="p-4 border-b border-shadow-system">
          <h2 className="text-xl font-semibold text-shadow-text">Liste des Technologies</h2>
        </div>
        
        {loading && technologies.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shadow-blue mx-auto"></div>
            <p className="mt-2 text-shadow-text">Chargement des technologies...</p>
          </div>
        ) : technologies.length === 0 ? (
          <div className="p-8 text-center text-shadow-text/70">
            <p>Aucune technologie trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-shadow-system">
              <thead className="bg-shadow-dark">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-shadow-text/70 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-shadow-text/70 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-shadow-text/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-shadow-surface divide-y divide-shadow-system">
                {technologies.map((tech) => (
                  <tr key={tech.id} className="hover:bg-shadow-dark/50">
                    {editMode === tech.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full p-2 rounded bg-shadow-dark border border-shadow-system text-shadow-text"
                            required
                          />
                        </td>
                        <td className="px-6 py-4 text-shadow-text/70">
                          {tech.slug}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditSubmit(tech.id)}
                            className="text-green-500 hover:text-green-400"
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-shadow-text/70 hover:text-shadow-text"
                          >
                            Annuler
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-shadow-text">
                          {tech.name}
                        </td>
                        <td className="px-6 py-4 text-shadow-text/70">
                          {tech.slug}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => startEdit(tech)}
                            className="text-shadow-blue hover:text-shadow-blue/80 mr-2"
                          >
                            Éditer
                          </button>
                          {confirmDelete === tech.id ? (
                            <>
                              <button
                                onClick={() => handleDelete(tech.id)}
                                className="text-shadow-monarch hover:text-shadow-monarch/80 mr-2"
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-shadow-text/70 hover:text-shadow-text"
                              >
                                Annuler
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDelete(tech.id)}
                              className="text-shadow-monarch hover:text-shadow-monarch/80"
                            >
                              Supprimer
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
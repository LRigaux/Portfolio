'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/admin/projects/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        setProject(data.project);
      } catch (error) {
        console.error('Error:', error);
        setError('Impossible de charger le projet');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProject();
  }, [params.id]);
  
  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      // Rediriger vers la liste des projets
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      setError('Impossible de supprimer le projet');
      setDeleting(false);
    }
  };
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Projet non trouvé
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Supprimer le projet</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-4 text-red-600 dark:text-red-400">
          <ExclamationTriangleIcon className="h-8 w-8 mr-3" />
          <h2 className="text-xl font-medium">Confirmation de suppression</h2>
        </div>
        
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Êtes-vous sûr de vouloir supprimer le projet <strong>{project.title}</strong> ?
          Cette action est irréversible.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Détails du projet :</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>Titre : {project.title}</li>
            <li>Rang : {project.rank}</li>
            <li>Statut : {project.status === 'published' ? 'Publié' : 'Brouillon'}</li>
            <li>Mis en avant : {project.featured ? 'Oui' : 'Non'}</li>
          </ul>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Annuler
          </button>
          
          <motion.button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              deleting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {deleting ? 'Suppression...' : 'Supprimer définitivement'}
          </motion.button>
        </div>
      </div>
    </div>
  );
} 
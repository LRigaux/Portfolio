'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Technology {
  id: string;
  name: string;
}

interface SkillFormProps {
  skill?: any;
  isEdit?: boolean;
}

export default function SkillForm({ skill, isEdit = false }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    level: 80,
    rank: 'A',
    category: '',
    technologyId: ''
  });
  
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  
  // Charger les technologies
  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const response = await fetch('/api/admin/technologies');
        if (!response.ok) throw new Error('Failed to fetch technologies');
        const data = await response.json();
        setTechnologies(data.technologies);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    fetchTechnologies();
  }, []);
  
  // Initialiser le formulaire avec les données de la compétence si en mode édition
  useEffect(() => {
    if (skill && isEdit) {
      setFormData({
        name: skill.name,
        level: skill.level,
        rank: skill.rank,
        category: skill.category,
        technologyId: skill.technology?.id || ''
      });
    }
  }, [skill, isEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const url = isEdit
        ? `/api/admin/skills/${skill?.id}`
        : '/api/admin/skills';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }
      
      setSuccess(true);
      
      // Rediriger après un court délai
      setTimeout(() => {
        router.push('/admin/skills');
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 text-red-700 rounded-md"
        >
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-100 text-green-700 rounded-md"
        >
          {isEdit ? 'Compétence mise à jour avec succès!' : 'Compétence créée avec succès!'}
        </motion.div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Informations de la compétence</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Frontend, Backend, Data Science, etc."
            />
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Niveau (0-100) *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="level"
                name="level"
                min="0"
                max="100"
                value={formData.level}
                onChange={handleNumberChange}
                className="flex-1"
              />
              <span className="w-12 text-center">{formData.level}</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="rank" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rang *
            </label>
            <select
              id="rank"
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="S">S</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="technologyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Technologie associée
            </label>
            <select
              id="technologyId"
              name="technologyId"
              value={formData.technologyId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Aucune</option>
              {technologies.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/skills')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Annuler
        </button>
        
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading
            ? (isEdit ? 'Mise à jour...' : 'Création...')
            : (isEdit ? 'Mettre à jour' : 'Créer')
          }
        </button>
      </div>
    </form>
  );
} 
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Technology } from '@/types';

interface SkillFormData {
  name: string;
  category: string;
  iconUrl?: string;
  technologyId?: string;
}

interface SkillFormProps {
  onSubmit: (data: SkillFormData) => void;
  initialData?: SkillFormData;
  submitText?: string;
  loading?: boolean;
}

export default function SkillForm({
  onSubmit,
  initialData = {
    name: '',
    category: '',
    iconUrl: '',
    technologyId: ''
  },
  submitText = 'Enregistrer',
  loading = false
}: SkillFormProps) {
  const [formData, setFormData] = useState<SkillFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [technologies, setTechnologies] = useState<Technology[]>([]);

  const router = useRouter();
  
  useEffect(() => {
    // Charger les technologies pour la sélection
    const fetchTechnologies = async () => {
      try {
        const res = await fetch('/api/admin/technologies');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des technologies');
        }
        const data = await res.json();
        setTechnologies(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchTechnologies();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-shadow-text font-medium mb-2">
          Nom
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
          placeholder="ex: Développement Web"
        />
        {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-shadow-text font-medium mb-2">
          Catégorie
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
        >
          <option value="" disabled>Sélectionner une catégorie</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="DevOps">DevOps</option>
          <option value="Database">Base de données</option>
          <option value="Mobile">Mobile</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Autres">Autres</option>
        </select>
        {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="iconUrl" className="block text-shadow-text font-medium mb-2">
          URL de l'icône (optionnel)
        </label>
        <input
          type="text"
          id="iconUrl"
          name="iconUrl"
          value={formData.iconUrl || ''}
          onChange={handleChange}
          className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
          placeholder="https://exemple.com/icon.svg"
        />
      </div>

      <div>
        <label htmlFor="technologyId" className="block text-shadow-text font-medium mb-2">
          Technologie associée (optionnel)
        </label>
        <select
          id="technologyId"
          name="technologyId"
          value={formData.technologyId || ''}
          onChange={handleChange}
          className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
        >
          <option value="">Aucune technologie</option>
          {technologies.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-shadow-primary hover:bg-shadow-accent text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Traitement...' : submitText}
        </button>
      </div>
    </form>
  );
} 
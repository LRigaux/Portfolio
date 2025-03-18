'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { normalizeImagePath } from '@/lib/utils';

// Fonction de slugification
const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

interface Project {
  id: string;
  title: string;
  description: string;
  content?: string | null;
  rank: 'S' | 'A' | 'B' | 'C';
  featured: boolean;
  status: 'draft' | 'published';
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  technologies: string[];
  categories: string[];
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Ce composant gère à la fois la création et la modification de projets
// Il utilise un état local pour gérer les données du formulaire et les soumet via API
// Les technologies et catégories sont gérées comme des tableaux de chaînes
// qui sont convertis en relations dans l'API

interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean; // Détermine si le formulaire est en mode édition ou création
}

// Interface pour les erreurs de validation
interface ValidationErrors {
  title?: string;
  description?: string;
  rank?: string;
  status?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  general?: string;
}

export default function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  // État local pour les champs du formulaire
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
    content: string;
    rank: string;
    featured: boolean;
    status: string;
    imageUrl: string;
    githubUrl: string;
    liveUrl: string;
    technologies: string[];
    categories: string[];
  }>({
    title: '',
    slug: '',
    description: '',
    content: '',
    rank: 'C',
    featured: false,
    status: 'draft',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    technologies: [],
    categories: []
  });
  
  // États pour la gestion des technologies et catégories
  const [techInput, setTechInput] = useState('');
  const [catInput, setCatInput] = useState('');
  const [suggestedTechs, setSuggestedTechs] = useState<string[]>([]);
  const [suggestedCats, setSuggestedCats] = useState<string[]>([]);
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
  const [showCatSuggestions, setShowCatSuggestions] = useState(false);
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState(false);
  
  // Charger les technologies et catégories existantes
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const techResponse = await fetch('/api/admin/technologies');
        const catResponse = await fetch('/api/admin/categories');

        if (techResponse.ok && catResponse.ok) {
          const techData = await techResponse.json();
          const catData = await catResponse.json();
          
          setAllTechnologies(techData.map((t: any) => t.name));
          setAllCategories(catData.map((c: any) => c.name));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des technologies et catégories:', error);
      }
    };

    fetchTaxonomies();
  }, []);

  // Charger les données du projet en cas de modification
  useEffect(() => {
    if (isEdit && project) {
      setFormData({
        title: project.title,
        description: project.description,
        content: project.content || '',
        rank: project.rank,
        featured: project.featured,
        status: project.status,
        imageUrl: project.imageUrl || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        technologies: project.technologies || [],
        categories: project.categories || [],
        slug: project.slug || slugify(project.title)
      });
    }
  }, [isEdit, project]);
  
  // Gérer les changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Pour les champs d'URL, traiter une chaîne vide comme null
    if ((name === 'imageUrl' || name === 'githubUrl' || name === 'liveUrl') && value.trim() === '') {
      setFormData({
        ...formData,
        [name]: null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Mettre à jour le slug si le titre change
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: slugify(value)
      }));
    }
    
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Gérer les changements pour les cases à cocher
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Gérer les suggestions de technologies
  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechInput(value);
    
    if (value.trim()) {
      const filtered = allTechnologies.filter(
        tech => tech.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedTechs(filtered.slice(0, 5));
      setShowTechSuggestions(true);
    } else {
      setSuggestedTechs([]);
      setShowTechSuggestions(false);
    }
  };

  // Gérer les suggestions de catégories
  const handleCatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCatInput(value);
    
    if (value.trim()) {
      const filtered = allCategories.filter(
        cat => cat.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedCats(filtered.slice(0, 5));
      setShowCatSuggestions(true);
    } else {
      setSuggestedCats([]);
      setShowCatSuggestions(false);
    }
  };

  // Ajouter une technologie
  const addTechnology = (tech: string = techInput.trim()) => {
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
      setTechInput('');
      setSuggestedTechs([]);
      setShowTechSuggestions(false);
    }
  };

  // Ajouter une catégorie
  const addCategory = (cat: string = catInput.trim()) => {
    if (cat && !formData.categories.includes(cat)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, cat]
      }));
      setCatInput('');
      setSuggestedCats([]);
      setShowCatSuggestions(false);
    }
  };

  // Supprimer une technologie
  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };
  
  // Supprimer une catégorie
  const removeCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== cat)
    }));
  };
  
  // Valider le formulaire
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.title || formData.title.length < 3) {
      errors.title = "Le titre doit contenir au moins 3 caractères";
    }
    
    if (!formData.description || formData.description.length < 10) {
      errors.description = "La description doit contenir au moins 10 caractères";
    }
    
    // Permettre les URLs externes (http://, https://) OU les chemins locaux
    if (formData.imageUrl && 
        !(formData.imageUrl.trim() === '' || 
          formData.imageUrl.startsWith('http://') || 
          formData.imageUrl.startsWith('https://') || 
          !formData.imageUrl.startsWith('http'))) {
      errors.imageUrl = "L'URL de l'image doit être une URL valide ou un chemin local";
    }
    
    if (formData.githubUrl && !formData.githubUrl.match(/^(https?:\/\/|$)/)) {
      errors.githubUrl = "L'URL GitHub doit être valide ou vide";
    }
    
    if (formData.liveUrl && !formData.liveUrl.match(/^(https?:\/\/|$)/)) {
      errors.liveUrl = "L'URL du site doit être valide ou vide";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const endpoint = isEdit 
        ? `/api/admin/projects/${project?.id}`
        : '/api/admin/projects';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error) {
          setError(data.error);
        } else if (data.errors) {
          // Traitement des erreurs de validation du serveur
          const serverErrors: ValidationErrors = {};
          data.errors.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              serverErrors[err.path[0] as keyof ValidationErrors] = err.message;
            }
          });
          setValidationErrors(serverErrors);
          throw new Error('Veuillez corriger les erreurs de validation');
        } else {
          throw new Error('Une erreur est survenue');
        }
      }
      
      setSuccess(true);
      
      // Redirection après un court délai
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-6">
      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <p>{isEdit ? 'Projet mis à jour avec succès!' : 'Projet créé avec succès!'}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre et Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label 
              htmlFor="title" 
              className="block text-shadow-text font-medium mb-2 flex items-center"
            >
              <span className="w-1 h-4 bg-shadow-blue mr-2 rounded"></span>
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-shadow-surface border ${validationErrors.title ? 'border-red-500' : 'border-shadow-system'} focus:border-shadow-blue outline-none text-shadow-text`}
              required
            />
            {validationErrors.title && (
              <p className="mt-1 text-red-500 text-sm">{validationErrors.title}</p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="slug" 
              className="block text-shadow-text font-medium mb-2 flex items-center opacity-60"
            >
              <span className="w-1 h-4 bg-shadow-blue mr-2 rounded"></span>
              Slug (généré automatiquement)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug || slugify(formData.title)}
              readOnly
              className="w-full p-2 rounded bg-shadow-surface/50 border border-shadow-system text-shadow-text/60 cursor-not-allowed"
            />
          </div>
        </div>
        
        {/* Rank et Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label 
              htmlFor="rank" 
              className="block text-shadow-text font-medium mb-2 flex items-center"
            >
              <span className="w-1 h-4 bg-shadow-monarch mr-2 rounded"></span>
              Rang
            </label>
            <select
              id="rank"
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
              required
            >
              <option value="S" className="bg-shadow-dark">S (Exceptionnel)</option>
              <option value="A" className="bg-shadow-dark">A (Excellent)</option>
              <option value="B" className="bg-shadow-dark">B (Bon)</option>
              <option value="C" className="bg-shadow-dark">C (Débutant)</option>
            </select>
            {validationErrors.rank && (
              <p className="mt-1 text-red-500 text-sm">{validationErrors.rank}</p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="status" 
              className="block text-shadow-text font-medium mb-2 flex items-center"
            >
              <span className="w-1 h-4 bg-shadow-monarch mr-2 rounded"></span>
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
              required
            >
              <option value="draft" className="bg-shadow-dark">Brouillon</option>
              <option value="published" className="bg-shadow-dark">Publié</option>
            </select>
            {validationErrors.status && (
              <p className="mt-1 text-red-500 text-sm">{validationErrors.status}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <label className="inline-flex items-center text-shadow-text font-medium cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${formData.featured ? 'bg-shadow-blue' : 'bg-gray-600'} mr-2 relative`}>
                <div 
                  className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform ${formData.featured ? 'translate-x-5' : 'translate-x-0.5'}`}
                ></div>
              </div>
              Projet en vedette
            </label>
          </div>
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
            className={`w-full p-2 rounded bg-shadow-surface border ${validationErrors.description ? 'border-red-500' : 'border-shadow-system'} focus:border-shadow-blue outline-none text-shadow-text`}
            required
          ></textarea>
          {validationErrors.description && (
            <p className="mt-1 text-red-500 text-sm">{validationErrors.description}</p>
          )}
          <p className="text-xs text-shadow-text/60 mt-1">
            La description doit contenir au moins 10 caractères.
          </p>
      </div>
      
        {/* Contenu */}
        <div>
          <label 
            htmlFor="content" 
            className="block text-shadow-text font-medium mb-2 flex items-center"
          >
            <span className="w-1 h-4 bg-shadow-accent mr-2 rounded"></span>
            Contenu
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content || ''}
            onChange={handleChange}
            rows={8}
            className="w-full p-2 rounded bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text font-mono"
          ></textarea>
          <p className="text-xs text-shadow-text/60 mt-1">
            Vous pouvez utiliser le format Markdown pour le contenu (titres, listes, liens, etc.).
          </p>
        </div>
        
        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label 
              htmlFor="imageUrl" 
              className="block text-shadow-text font-medium mb-2 flex items-center"
            >
              <span className="w-1 h-4 bg-shadow-quest mr-2 rounded"></span>
              URL de l'image
            </label>
            <div className="space-y-2">
            <input
                type="text"
              id="imageUrl"
              name="imageUrl"
                value={formData.imageUrl || ''}
              onChange={handleChange}
                className={`w-full p-2 rounded bg-shadow-surface border ${validationErrors.imageUrl ? 'border-red-500' : 'border-shadow-system'} focus:border-shadow-blue outline-none text-shadow-text`}
                placeholder="https://example.com/image.jpg ou images/projects/monimage.jpg"
              />
              {validationErrors.imageUrl && (
                <p className="mt-1 text-red-500 text-sm">{validationErrors.imageUrl}</p>
              )}
              <p className="text-xs text-shadow-text/60">
                Vous pouvez saisir une URL externe (https://...) ou un chemin local (images/projects/monimage.jpg)
              </p>
              
              {formData.imageUrl && (
                <div className="mt-2 rounded overflow-hidden w-full max-w-xs mx-auto border border-shadow-system">
                  <div className="relative h-40 w-full">
                    <img 
                      src={normalizeImagePath(formData.imageUrl)} 
                      alt="Aperçu"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback to default image if loading fails
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = '/projects/fallback.jpg';
                      }}
                    />
                  </div>
                  <div className="p-2 bg-shadow-surface flex justify-between items-center">
                    <span className="text-xs text-shadow-text/60 truncate">
                      {formData.imageUrl.substring(0, 30)}
                      {formData.imageUrl.length > 30 ? '...' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, imageUrl: ''})}
                      className="text-shadow-monarch hover:text-shadow-monarch/80 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="githubUrl" 
              className="block text-shadow-text font-medium mb-2 flex items-center"
            >
              <span className="w-1 h-4 bg-shadow-quest mr-2 rounded"></span>
              URL GitHub
            </label>
            <input
              type="text"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl || ''}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-shadow-surface border ${validationErrors.githubUrl ? 'border-red-500' : 'border-shadow-system'} focus:border-shadow-blue outline-none text-shadow-text`}
              placeholder="https://github.com/username/repo"
            />
            {validationErrors.githubUrl && (
              <p className="mt-1 text-red-500 text-sm">{validationErrors.githubUrl}</p>
            )}
            <p className="text-xs text-shadow-text/60 mt-1">
              Optionnel. Pour GitHub, utilisez une URL complète (exemple: https://github.com/username/repo)
            </p>
          </div>
          
          <div>
            <label 
              htmlFor="liveUrl" 
              className="block text-shadow-text font-medium mb-2 flex items-center"
            >
              <span className="w-1 h-4 bg-shadow-quest mr-2 rounded"></span>
              URL du site
            </label>
            <input
              type="text"
              id="liveUrl"
              name="liveUrl"
              value={formData.liveUrl || ''}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-shadow-surface border ${validationErrors.liveUrl ? 'border-red-500' : 'border-shadow-system'} focus:border-shadow-blue outline-none text-shadow-text`}
              placeholder="https://example.com"
            />
            {validationErrors.liveUrl && (
              <p className="mt-1 text-red-500 text-sm">{validationErrors.liveUrl}</p>
            )}
            <p className="text-xs text-shadow-text/60 mt-1">
              Optionnel. Pour les liens vers votre site, utilisez une URL complète (exemple: https://monsite.com)
            </p>
          </div>
        </div>
        
        {/* Technologies */}
          <div>
          <label 
            className="block text-shadow-text font-medium mb-2 flex items-center"
          >
            <span className="w-1 h-4 bg-shadow-blue mr-2 rounded"></span>
              Technologies
            </label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.technologies.map((tech) => (
              <div 
                key={tech}
                className="flex items-center bg-shadow-blue/20 text-shadow-text px-2 py-1 rounded"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 text-shadow-text hover:text-shadow-blue"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex relative">
              <input
                type="text"
                value={techInput}
              onChange={handleTechInputChange}
              className="flex-1 p-2 rounded-l bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
              placeholder="Ajouter une technologie"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTechnology();
                }
              }}
              onFocus={() => techInput.trim() && setShowTechSuggestions(true)}
              onBlur={() => setTimeout(() => setShowTechSuggestions(false), 100)}
              />
              <button
                type="button"
              onClick={() => addTechnology()}
              className="px-4 py-2 bg-shadow-blue text-white rounded-r hover:bg-opacity-90"
              >
                Ajouter
              </button>
            
            {showTechSuggestions && suggestedTechs.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-shadow-surface border border-shadow-system rounded-md z-10">
                {suggestedTechs.map(tech => (
                  <div 
                  key={tech}
                    className="p-2 hover:bg-shadow-system/30 cursor-pointer text-shadow-text"
                    onClick={() => addTechnology(tech)}
                >
                  {tech}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Catégories */}
        <div>
          <label 
            className="block text-shadow-text font-medium mb-2 flex items-center"
          >
            <span className="w-1 h-4 bg-shadow-monarch mr-2 rounded"></span>
            Catégories
          </label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.categories.map((cat) => (
              <div 
                key={cat}
                className="flex items-center bg-shadow-monarch/20 text-shadow-text px-2 py-1 rounded"
              >
                <span>{cat}</span>
                  <button
                    type="button"
                  onClick={() => removeCategory(cat)}
                  className="ml-2 text-shadow-text hover:text-shadow-monarch"
                  >
                    &times;
                  </button>
              </div>
              ))}
          </div>
          
          <div className="flex relative">
              <input
                type="text"
                value={catInput}
              onChange={handleCatInputChange}
              className="flex-1 p-2 rounded-l bg-shadow-surface border border-shadow-system focus:border-shadow-blue outline-none text-shadow-text"
              placeholder="Ajouter une catégorie"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCategory();
                }
              }}
              onFocus={() => catInput.trim() && setShowCatSuggestions(true)}
              onBlur={() => setTimeout(() => setShowCatSuggestions(false), 100)}
              />
              <button
                type="button"
              onClick={() => addCategory()}
              className="px-4 py-2 bg-shadow-monarch text-white rounded-r hover:bg-opacity-90"
              >
                Ajouter
              </button>
            
            {showCatSuggestions && suggestedCats.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-shadow-surface border border-shadow-system rounded-md z-10">
                {suggestedCats.map(cat => (
                  <div 
                  key={cat}
                    className="p-2 hover:bg-shadow-system/30 cursor-pointer text-shadow-text"
                    onClick={() => addCategory(cat)}
                  >
                    {cat}
                  </div>
              ))}
            </div>
            )}
        </div>
      </div>
      
        {/* Boutons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-shadow-system">
          <Link
            href="/admin/projects"
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
                {isEdit ? 'Mise à jour...' : 'Création...'}
              </span>
            ) : (
              <span>{isEdit ? 'Mettre à jour' : 'Créer le projet'}</span>
            )}
        </button>
      </div>
    </form>
    </div>
  );
}
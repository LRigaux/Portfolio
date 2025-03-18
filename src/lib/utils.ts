export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Détermine si un chemin d'image est une URL externe ou un chemin local 
 * et retourne le chemin normalisé pour utilisation dans le composant Image
 */
export function normalizeImagePath(imagePath: string | null | undefined): string {
  if (!imagePath || imagePath.trim() === '') {
    return '/projects/fallback.jpg';
  }

  // Si le chemin commence déjà par "http://" ou "https://", c'est une URL externe
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si le chemin commence déjà par "/", c'est un chemin relatif à la racine
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Sinon, on considère qu'il s'agit d'un chemin relatif et on ajoute "/"
  return `/${imagePath}`;
}

/**
 * Vérifie si un chemin d'image est valide en vérifiant son extension
 */
export function isValidImagePath(imagePath: string | null | undefined): boolean {
  if (!imagePath || imagePath.trim() === '') {
    return false;
  }
  
  // Liste des extensions d'images valides
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  
  // Vérifier si le chemin se termine par une extension valide (insensible à la casse)
  return validExtensions.some(ext => 
    imagePath.toLowerCase().endsWith(ext)
  );
} 
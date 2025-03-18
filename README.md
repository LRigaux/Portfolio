# Portfolio Personnel - Inspiré de Solo Leveling

## 📖 Vue d'ensemble

Portfolio moderne développé avec Next.js 14, inspiré visuellement par l'univers de Solo Leveling. Le site présente deux thèmes distincts :
- Mode Sombre : Inspiré par Sung Jin-Woo (Shadow Monarch)
- Mode Clair : Inspiré par Cha Hae-In

### 🎨 Design et Inspiration
Le design s'appuie sur les éléments visuels caractéristiques de Solo Leveling :
- Particules animées dynamiques
- Effets de lueur et gradients
- Système de rang (S, A, B, C) pour les compétences
- Animations fluides et réactives
- Interface système interactive avec statistiques, compétences et projets
- Défilement horizontal des projets avec navigation intuitive

## 🛠 Stack Technique

### Technologies Principales
- **Next.js** (v14.0.0) - Framework React avec rendu côté serveur
- **React** (v18.2.0) - Bibliothèque UI
- **TypeScript** (v5.0.0) - Typage statique
- **Tailwind CSS** (v3.3.0) - Styling utilitaire
- **Framer Motion** (v11.0.0) - Animations

### Dépendances Principales
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "framer-motion": "11.0.0",
    "@heroicons/react": "2.1.1",
    "react-intersection-observer": "9.5.3"
  },
  "devDependencies": {
    "typescript": "5.0.0",
    "tailwindcss": "3.3.0",
    "postcss": "8.4.31",
    "autoprefixer": "10.4.16",
    "@types/react": "18.2.0",
    "@types/node": "20.8.0",
    "eslint": "8.52.0"
  }
}
```

## 🗂 Structure du Projet

portfolio/
├── src/
│ ├── app/
│ │ ├── layout.tsx # Layout principal
│ │ ├── page.tsx # Page d'accueil
│ │ ├── admin/ # Interface d'administration
│ │ └── globals.css # Styles globaux
│ ├── components/
│ │ ├── Header.tsx # Navigation
│ │ ├── Hero.tsx # Section d'accueil
│ │ ├── ProjectsSection.tsx # Liste des projets avec défilement horizontal
│ │ ├── ProjectCard.tsx # Carte de projet individuelle
│ │ ├── SkillsSection.tsx # Section des compétences
│ │ ├── SkillBar.tsx # Barre de progression des compétences
│ │ ├── ContactSection.tsx # Section de contact
│ │ ├── Footer.tsx # Pied de page
│ │ ├── ParticlesBackground.tsx # Arrière-plan animé
│ │ ├── SystemInterface.tsx # Interface système inspirée de Solo Leveling
│ │ └── ThemeToggle.tsx # Bascule de thème
│ ├── context/
│ │ └── ThemeContext.tsx # Gestion du thème global
│ ├── lib/
│ │ └── utils.ts # Utilitaires
│ └── types/
│ └── index.ts # Définitions TypeScript

## 🛠 Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer le serveur de développement
```bash
npm run dev
```

## 🔄 Gestion des Versions

- Utilisation de versions fixes pour les dépendances principales
- Compatibilité vérifiée entre React 18.2.0 et Next.js 14
- Support TypeScript intégré

## Interface d'administration

Le portfolio dispose d'une interface d'administration sécurisée pour gérer facilement le contenu.

### Accès à l'administration

1. Accédez à `/admin/login` dans votre navigateur
2. Entrez le mot de passe administrateur configuré dans les variables d'environnement

### Fonctionnalités

- **Tableau de bord amélioré** avec statistiques visuelles dans le style Solo Leveling
- Gestion complète des projets (création, édition, suppression)
- Formulaires intelligents avec validation côté client et suggestions
- Gestion des compétences et niveaux
- Gestion des expériences professionnelles
- Gestion du parcours académique

### Configuration

Pour configurer l'accès administrateur, définissez les variables d'environnement suivantes :

```env
JWT_SECRET="votre_secret_jwt_tres_long_et_complexe"
ADMIN_PASSWORD="votre_mot_de_passe_admin_securise"
```

## Fonctionnalités immersives

### SystemInterface

Interface interactive inspirée du "système" de Solo Leveling :
- Affichage des statistiques avec rangs (S, A, B, C)
- Liste des compétences avec niveau et description
- Technologies maîtrisées avec projets associés
- Projets en cours sous forme de quêtes avec progression
- Animation de niveau supérieur

### Navigation horizontale des projets

- Défilement horizontal fluide avec boutons de navigation
- Filtrage par rang de projet
- Cartes de projet avec effet de survol
- Indication visuelle du rang et technologies utilisées

## Résumé des meilleures pratiques implémentées

1. **Sécurité**
   - Authentification par JWT
   - Protection des routes admin par middleware
   - Validation des données avec Zod
   - Cookies HTTP-only pour les tokens

2. **Expérience utilisateur**
   - Interface réactive avec Framer Motion
   - Formulaires avec validation
   - Messages de feedback
   - Thème clair/sombre
   - Navigation horizontale intuitive

3. **Architecture**
   - Séparation claire des préoccupations
   - API RESTful pour les opérations CRUD
   - Transactions Prisma pour la cohérence des données
   - Composants réutilisables

4. **Performance**
   - Chargement optimisé des données
   - Pagination pour les listes longues
   - Requêtes optimisées avec Prisma

5. **Maintenabilité**
   - Code TypeScript fortement typé
   - Structure de dossiers organisée
   - Composants modulaires
   - Gestion d'erreurs robuste

## 📝 TODO

- [ ] Implémentation des traductions automatiques
- [ ] Optimisation des performances
- [ ] Tests unitaires et d'intégration
- [ ] Documentation des composants
- [ ] SEO et métadonnées
- [ ] Analytics
- [ ] Blog technique

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir `CONTRIBUTING.md` pour les détails.

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
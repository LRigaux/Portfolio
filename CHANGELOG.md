# Portfolio Solo Leveling - Changelog

Ce document retrace les modifications et améliorations apportées au projet, ainsi que les raisonnements derrière chaque décision de conception.

## Table des matières

- [Introduction](#introduction)
- [Développement initial](#développement-initial)
- [Corrections et améliorations](#corrections-et-améliorations)
- [Fonctionnalités avancées](#fonctionnalités-avancées)

## Introduction

Ce portfolio est basé sur le thème "Solo Leveling", adoptant l'esthétique visuelle et le système de rangs de l'œuvre. Le projet est développé avec Next.js, React, TypeScript et Tailwind CSS, avec des animations via Framer Motion.

## Développement initial

### Structure de base et setup

- **Mise en place du projet Next.js** avec TypeScript et Tailwind CSS
- **Configuration du thème dual** : Mode sombre (Shadow Monarch) et mode clair (Chasseur de Rang S)
- **Création des composants principaux** : Header, Hero, ProjectsSection, SkillsSection, ContactSection, Footer
- **Mise en place du context pour le thème** : ThemeContext pour basculer entre les thèmes

### Composants immersifs

- **ParticlesBackground** : Arrière-plan avec des particules animées évoquant les ombres de Sung Jin-Woo
- **SystemInterface** : Interface inspirée du "système" de Solo Leveling avec statistiques, compétences et projets
- **Hero** : Animation d'écriture (typing effect) pour les titres de poste

## Corrections et améliorations

### Correction du bug dans ProjectCard

**Problème identifié** : Erreur dans le composant `ProjectCard.tsx` concernant la fonction `tags.map`

**Analyse** : 
- Le composant `ProjectCard` attendait un tableau de chaînes pour la prop `tags`
- Dans `ProjectsSection.tsx`, les technologies étaient passées incorrectement
- Incohérence entre les propriétés attendues du projet et les données réelles

**Solution** :
```typescript
// Dans ProjectsSection.tsx
tags={Array.isArray(project.technologies) 
  ? project.technologies.map((tech: any) => 
      typeof tech === 'string' ? tech : tech.name || '') 
  : []}
```

**Raisonnement** :
- Ajout d'une vérification que `project.technologies` est bien un tableau
- Prise en compte des deux formats possibles (chaîne ou objet avec propriété name)
- Fallback vers un tableau vide si aucune technologie n'est présente

### Amélioration de l'interface d'administration

**Objectif** : Renforcer l'expérience d'administration tout en maintenant le thème Solo Leveling

**Modifications** :
1. **Dashboard admin** : Ajout de statistiques visuelles similaires au système du jeu
   - Nombre de projets (publiés/brouillons)
   - Nombre de visites
   - Nombre de contacts
   - Niveau admin fictif basé sur les statistiques

2. **ProjectForm** : Amélioration de la validation côté client
   - Ajout de messages d'erreur spécifiques
   - Gestion des technologies et catégories existantes
   - Interface plus intuitive pour l'ajout de technologies

**Raisonnement** :
- Maintenir la cohérence du thème dans toutes les parties de l'application
- Améliorer l'UX pour l'administrateur
- Réduire les erreurs lors de la création/édition de projets

## Fonctionnalités avancées

### Améliorations de la SystemInterface

**Objectif** : Enrichir l'interaction avec les compétences et technologies

**Modifications** :
- Affichage des projets liés au survol d'une compétence ou technologie
- Ajout d'un système de défilement horizontal pour les projets
- Implémentation de boutons de navigation pour faciliter le défilement

**Raisonnement** :
- Renforcer l'immersion dans le thème Solo Leveling
- Améliorer l'UX en établissant des liens visuels entre compétences et projets
- Faciliter la navigation sur les appareils à écran tactile

### Transformation de ProjectsSection

**Objectif** : Améliorer l'engagement visuel avec les projets

**Modifications** :
- Remplacement de la grille par un défilement horizontal
- Ajout de boutons de navigation pour le défilement
- Conservation des filtres par rang de projet

**Raisonnement** :
- Créer une expérience plus dynamique et immersive
- S'aligner avec le style de la `SystemInterface`
- Maintenir la fonctionnalité de filtrage tout en améliorant la présentation

---

*Ce document sera mis à jour à chaque amélioration significative du projet.* 
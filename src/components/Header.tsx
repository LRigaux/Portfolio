'use client'; // Indique que ce composant utilise des fonctionnalités côté client
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'; // Importation des outils d'animation
import { useEffect, useState, useRef } from 'react'; // Importation des hooks React


const Header = () => {
  const [scrollPosition, setScrollPosition] = useState(0); // État pour suivre la position de défilement
  const [activeSection, setActiveSection] = useState('About'); // État pour suivre la section active
  const headerRef = useRef<HTMLElement>(null); // Référence pour l'élément d'en-tête
  
  const { scrollY } = useScroll(); // Récupération de la position de défilement
  const opacity = useTransform(scrollY, [0, 100], [0, 1]); // Transformation de la position de défilement en opacité
  const translateY = useTransform(scrollY, [0, 100], [0, -10]); // Transformation de la position de défilement en translation Y
  
  // Pour le suivi des sections actives
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY; // Récupération de la position de défilement
      setScrollPosition(position); // Mise à jour de l'état de la position de défilement
      
      // Déterminer la section active basée sur la position de défilement
      const sections = ['About', 'projects', 'contact']; // Liste des sections à suivre
      
      for (const section of sections) {
        const element = document.getElementById(section); // Récupération de l'élément de la section
        if (element) {
          const rect = element.getBoundingClientRect(); // Récupération des dimensions de l'élément
          if (rect.top <= 200 && rect.bottom >= 200) { // Vérification si la section est visible
            setActiveSection(section); // Mise à jour de la section active
            break; // Sortir de la boucle une fois la section active trouvée
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll); // Ajout de l'écouteur d'événements de défilement
    return () => window.removeEventListener('scroll', handleScroll); // Nettoyage de l'écouteur à la désactivation du composant
  }, []);
  
  // Variantes d'animation pour les éléments de navigation
  const itemVariants = {
    hidden: { opacity: 0, y: -10 }, // État caché
    visible: (i: number) => ({
      opacity: 1, // État visible
      y: 0,
      transition: {
        delay: i * 0.1, // Délai d'animation basé sur l'index
        type: "spring", // Type d'animation
        stiffness: 100, // Rigidité de l'animation
        damping: 10 // Amortissement de l'animation
      }
    })
  };
  
  // Variantes d'animation pour le logo
  const logoVariants = {
    normal: { scale: 1 }, // État normal
    hover: { 
      scale: 1.05, // État au survol
      transition: { type: "spring", stiffness: 400, damping: 10 } // Animation au survol
    },
    tap: { scale: 0.95 } // État au clic
  };
  
  // Fermer le menu mobile après sélection d'une section
  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId); // Récupération de la section par ID
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' }); // Défilement en douceur vers la section
    }
  };
  
  // Effet de particules magiques
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i, // ID unique pour chaque particule
    x: Math.random() * 100, // Position X aléatoire
    y: Math.random() * 100, // Position Y aléatoire
    size: Math.random() * 2 + 1, // Taille aléatoire de la particule
    delay: Math.random() * 2 // Délai aléatoire pour l'animation
  }));
  
  return (
    <header 
      ref={headerRef} // Référence à l'élément d'en-tête
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrollPosition > 50 
          ? 'bg-shadow-dark/95 backdrop-blur-sm shadow-lg shadow-shadow-blue/10' // Styles si défilé
          : 'bg-transparent'} // Styles si non défilé
      `}
    >
      {/* Particules magiques */}
      {particles.map(particle => (
        <motion.div
          key={particle.id} // Clé unique pour chaque particule
          className={`
            absolute rounded-full z-10 
            ${particle.id % 3 === 0 
              ? 'bg-shadow-blue' 
              : particle.id % 3 === 1 
                ? 'bg-shadow-monarch' 
                : 'bg-shadow-primary'} // Couleur de la particule
          `}
          style={{
            left: `${particle.x}%`, // Position X
            top: `${particle.y}%`, // Position Y
            width: `${particle.size}px`, // Taille
            height: `${particle.size}px`, // Taille
            opacity: scrollPosition > 50 ? 0.7 : 0.3 // Opacité basée sur la position de défilement
          }}
          animate={{
            y: [0, -20, 0], // Animation de la position Y
            opacity: [0, 0.7, 0], // Animation de l'opacité
          }}
          transition={{
            duration: 3, // Durée de l'animation
            delay: particle.delay, // Délai d'animation
            repeat: Infinity, // Répéter indéfiniment
            ease: "easeInOut" // Type d'animation
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2"
          variants={logoVariants} // Variantes d'animation pour le logo
          initial="normal" // État initial
          whileHover="hover" // État au survol
          whileTap="tap" // État au clic
        >
          <a 
            href="#About" // Lien vers la section About
            className="text-2xl font-bold text-shadow-blue tracking-wider flex items-center"
            onClick={(e) => {
              e.preventDefault(); // Empêcher le comportement par défaut
              handleNavClick('About'); // Appel de la fonction pour faire défiler vers la section
            }}
          >
              <span className="mr-1">Louis</span><span className="text-shadow-white">Rigaux</span>
          </a>
        </motion.div>
        
        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {['About', 'projects', 'contact'].map((item, i) => (
            <motion.div
              key={item} // Clé unique pour chaque élément de navigation
              custom={i} // Passer l'index pour l'animation
              variants={itemVariants} // Variantes d'animation pour les éléments
              initial="hidden" // État initial
              animate="visible" // État visible
            >
              <a
                href={`#${item}`} // Lien vers la section correspondante
                className={`
                  relative text-sm font-medium px-1 py-2 transition-colors group
                  ${activeSection === item 
                    ? 'text-shadow-blue' // Couleur si la section est active
                    : 'text-shadow-text hover:text-shadow-blue'} // Couleur par défaut
                `}
                onClick={(e) => {
                  e.preventDefault(); // Empêcher le comportement par défaut
                  handleNavClick(item); // Appel de la fonction pour faire défiler vers la section
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)} 
                <span 
                  className={`
                    absolute -bottom-0.5 left-0 w-full h-0.5 transform origin-left transition-transform
                    ${activeSection === item 
                      ? 'bg-shadow-blue scale-x-100' // État actif
                      : 'bg-shadow-blue scale-x-0 group-hover:scale-x-100'} // État inactif
                  `}
                />
              </a>
            </motion.div>
          ))}
        </nav>
      </div>
    
    </header>
  );
};

export default Header; // Exportation du composant Header
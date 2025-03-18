'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  liveLink?: string | null;
  index: number;
  rank?: string;
  featured?: boolean;
}

const ProjectCard = ({ id, title, description, image, tags, link, liveLink, index, rank, featured }: ProjectCardProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 w-full">
        <Image
          src={image || '/projects/default.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {rank && (
          <div className={`absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded ${
            rank === 'S' ? 'bg-purple-600' : 
            rank === 'A' ? 'bg-red-600' : 
            rank === 'B' ? 'bg-blue-600' : 'bg-green-600'
          }`}>
            Rank {rank}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span 
              key={i} 
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between">
          {link && (
            <Link 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center"
            >
              Code <span className="ml-1">→</span>
            </Link>
          )}
          
          {liveLink && (
            <Link 
              href={liveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium flex items-center"
            >
              Demo <span className="ml-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 
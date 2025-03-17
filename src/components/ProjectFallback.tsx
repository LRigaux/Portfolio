import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ProjectFallback() {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-lg overflow-hidden shadow-lg ${
        theme === 'light' ? 'bg-light-surface/50' : 'bg-shadow-surface/50'
      }`}
    >
      <div className={`w-full h-48 ${
        theme === 'light' ? 'bg-light-muted/20' : 'bg-shadow-muted/20'
      } animate-pulse`}></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div className={`h-6 w-2/3 ${
            theme === 'light' ? 'bg-light-muted/20' : 'bg-shadow-muted/20'
          } animate-pulse rounded`}></div>
          <div className={`h-6 w-8 ${
            theme === 'light' ? 'bg-light-muted/20' : 'bg-shadow-muted/20'
          } animate-pulse rounded`}></div>
        </div>
        <div className={`h-16 w-full ${
          theme === 'light' ? 'bg-light-muted/20' : 'bg-shadow-muted/20'
        } animate-pulse rounded mb-4`}></div>
        <div className="flex justify-end">
          <div className={`h-10 w-24 ${
            theme === 'light' ? 'bg-light-muted/20' : 'bg-shadow-muted/20'
          } animate-pulse rounded`}></div>
        </div>
      </div>
    </motion.div>
  );
} 
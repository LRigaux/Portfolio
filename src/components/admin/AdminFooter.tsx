'use client';
import { motion } from 'framer-motion';

export default function AdminFooter() {
  return (
    <footer className="bg-shadow-dark border-t border-shadow-system p-4 text-center text-shadow-text/60">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="mb-2 md:mb-0"
          >
            <p className="text-sm">
              Interface <span className="text-shadow-blue">Admin System</span> • Rang S
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm">
              © {new Date().getFullYear()} Solo <span className="text-shadow-blue">Leveling</span> Portfolio
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
} 
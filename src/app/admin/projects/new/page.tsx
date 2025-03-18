import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-shadow-text flex items-center">
          <span className="w-2 h-8 bg-shadow-monarch mr-3 rounded"></span>
          Créer un nouveau projet
        </h1>
      </div>
      
      <div className="relative">
        {/* Effet d'énergie lumineuse */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-double-awakening/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-shadow-monarch/20 rounded-full blur-xl"></div>
        
        <ProjectForm isEdit={false} />
      </div>
      
      <div className="flex justify-center mt-12 opacity-60 hover:opacity-100 transition-opacity">
        <blockquote className="text-center text-shadow-text/80 max-w-lg border-l-4 border-shadow-blue pl-4 py-2 italic">
          "Pour utiliser mon pouvoir, je dois me tenir aussi près que possible du danger."
          <footer className="text-right text-sm mt-2">— Sung Jin-Woo</footer>
        </blockquote>
      </div>
    </div>
  );
} 
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Modifiez l'interface Project pour accepter une string pour rank
interface Project {
  id: string;
  title: string;
  status: string;
  rank: string; // Changé de 'S' | 'A' | 'B' | 'C' à string
  createdAt: Date;
  updatedAt: Date;
  // Ajoutez d'autres propriétés si nécessaires
  slug?: string;
  description?: string;
  content?: string | null;
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  viewCount?: number;
}

export default async function AdminDashboard() {
  // Récupérer les statistiques
  const [
    projectCount,
    skillCount,
    experienceCount,
    educationCount
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.education.count()
  ]);
  
  // Récupérer les projets récents
  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' }
  });
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Projets" count={projectCount} href="/admin/projects" />
        <StatCard title="Compétences" count={skillCount} href="/admin/skills" />
        <StatCard title="Expériences" count={experienceCount} href="/admin/experiences" />
        <StatCard title="Formations" count={educationCount} href="/admin/education" />
      </div>
      
      {/* Projets récents */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Projets récents</h2>
          <Link 
            href="/admin/projects" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Voir tous
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dernière mise à jour
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentProjects.map((project: Project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/admin/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                      {project.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              
              {recentProjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                    Aucun projet trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <Link href={href}>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-3xl font-bold text-gray-700 dark:text-gray-200">{count}</p>
      </div>
    </Link>
  );
} 
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/projects', label: 'Projets', icon: '💼' },
    { path: '/admin/skills', label: 'Compétences', icon: '🎯' },
    { path: '/admin/experience', label: 'Expérience', icon: '👔' },
    { path: '/admin/education', label: 'Formation', icon: '🎓' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          Administration
        </h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
} 
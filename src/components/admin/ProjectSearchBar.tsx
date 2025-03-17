'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ProjectSearchBar({ initialSearch = '' }) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (search.trim()) {
      router.push(`/admin/projects?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/admin/projects');
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="max-w-lg">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Rechercher un projet..."
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                router.push('/admin/projects');
              }}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    </form>
  );
} 
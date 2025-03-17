import { ReactNode } from 'react';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import Sidebar from '@/components/admin/Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children
}: AdminLayoutProps) {
  // Vérifier l'authentification côté serveur
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/admin/login');
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader />
      
      <div className="flex">
        <Sidebar />
        
        <main className="ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Sidebar from '@/components/admin/Sidebar';
import { verifyToken } from '@/lib/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Vérifier l'authentification côté serveur
  const token = cookies().get('admin_token')?.value;
  const authenticated = token ? await verifyToken(token) : false;
  
  if (!authenticated) {
    redirect('/auth/admin-login');
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
} 
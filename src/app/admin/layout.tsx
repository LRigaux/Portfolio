import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';
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
    <div className="min-h-screen bg-shadow-dark">
      <AdminSidebar />
      <div className="ml-0 md:ml-64 pt-20 min-h-screen p-4">
        {children}
      </div>
    </div>
  );
} 
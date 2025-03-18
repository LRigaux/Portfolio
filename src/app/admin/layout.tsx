import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';
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
      <div className="ml-0 md:ml-64 min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-grow p-4 pt-20">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
} 
'use client';

import './styles/admin.css';
import AdminHeader from './components/Header';
import AdminFooter from './components/Footer';
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AdminLayoutContent({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session.user?.tipo !== 1) {
      router.push('/login'); // redireciona se não for admin
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Carregando...</div>; // ou spinner bonito
  }

  if (!session || session.user?.tipo !== 1) {
    return null; // bloqueia conteúdo até redirecionar
  }
  return (
    <>
      <AdminHeader />
      <main className="admin-main">{children}</main>
      <AdminFooter />
    </>
  );
}

export default function AdminLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body id="admin-body" className="admin-body">
        <SessionProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}

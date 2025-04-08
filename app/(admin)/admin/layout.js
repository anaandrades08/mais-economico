'use client';

import './styles/admin.css';
import AdminHeader from './components/Header';
import AdminFooter from './components/Footer';


export default function AdminLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body id="admin-body" className="admin-body">
        <AdminHeader />
        <main className="admin-main">{children}</main>
        <AdminFooter />
      </body>
    </html>
  );
}

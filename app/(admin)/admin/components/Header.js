'use client';
import '../styles/AdminHeader.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Users } from "../data/UserData.js";
import { FiUser, FiLogOut, FiSettings  } from 'react-icons/fi';
import { MdBook } from 'react-icons/md';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState(null)

  const router = useRouter();
  const { data: session, status } = useSession(); // inclui 'status'

  useEffect(() => {
    // Espera a sessão carregar completamente antes de verificar
    if (status === 'authenticated' && session.user?.tipo !== 1) {
      router.push('/login');
    }
  }, [session, status, router]);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  if (status === 'loading') {
    return null; // ou um loader se quiser
  }

  if (!session || session.user?.tipo !== 1) {
    return null; // evita que o header renderize antes do redirect
  }

  const user = Users.find((user) => user.id === session.user.id);
  let userNome = session.user.nome;
  let userId = session.user.id;

      return (
        <header className="admin-header">
          <div className="admin-header-content">
            <Link href="/admin/"><h1 className="admin-logo">+ER | Admin</h1></Link>
            <nav className="admin-nav">
              <Link href="/admin/usuarios" className="admin-nav-link-btn">Usuários</Link>
              <Link href="/admin/receitas" className="admin-nav-link-btn">Receitas</Link>
              <Link href="/admin/ingredientes" className="admin-nav-link-btn">Ingredientes</Link>
              <Link href="/admin/substituicoes" className="admin-nav-link-btn">Substituições</Link>
              <Link href="/admin/feedbacks" className="admin-nav-link-btn">Feedbacks</Link>
            </nav>
          </div>

          {/* Botões do usuário */}
          <div className="admin-user-info flex items-center gap-4">
            <Link href="/" passHref>
              <button title="Configurações" className="admin-info-button text-white hover:text-pink-400">
                <MdBook size={22} />
              </button>
            </Link>
            <Link href="/dashboard/perfil-usuario/" passHref>
              <button title="Minha Conta" className="admin-info-button text-white hover:text-pink-400">
                <FiUser size={22} />
              </button>
            </Link>
            <Link href="/dashboard/logout/" passHref>
              <button title="Sair" className="admin-info-button text-white hover:text-yellow-400">
                <FiLogOut size={22} />
              </button>
            </Link>
          </div>
        </header>
      );
    
}

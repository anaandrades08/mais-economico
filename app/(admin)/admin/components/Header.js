'use client';
import '../styles/AdminHeader.css';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Users } from "../data/UserData.js";
import { FiUser, FiLogOut, FiSettings  } from 'react-icons/fi';
const userId = Users[0].id; 
const userName = Users[0].name; 


export default function AdminHeader() {
  
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState(null)

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu)
  }
  
 

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
          <Link href="/admin/relatorios" className="admin-nav-link-btn">Relatórios</Link>
          <Link href="/admin/ajuda" className="admin-nav-link-btn">Ajuda</Link>
          <Link href="/admin/faq" className="admin-nav-link-btn">FAQ</Link>
        </nav>
      </div>

      {/* Botões do usuário */}
      <div className="admin-user-info flex items-center gap-4">
        <button title="Configurações" className="admin-info-button text-white hover:text-pink-400">
          <FiSettings size={22} />
        </button>
        <button title="Minha Conta" className="admin-info-button text-white hover:text-pink-400">
          <FiUser size={22} />
        </button>
        <button title="Sair" className="admin-info-button text-white hover:text-yellow-400">
          <FiLogOut size={22} />
        </button>
      </div>
    </header>
  );
}

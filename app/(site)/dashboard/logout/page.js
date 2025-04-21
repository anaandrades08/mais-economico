'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import '../../styles/Logout.css'; // importa o CSS

export default function Sair() {
  useEffect(() => {
    // Faz o logout com NextAuth
    signOut({ callbackUrl: '/' }); // redireciona para a home após logout
  }, []);

  return (
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-loader"></div>
        <p className="logout-text">Saindo...</p>
      </div>
    </div>
  );
}

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../../styles/logout.css'; // importa o CSS

export default function Sair() {
  const router = useRouter();

   useEffect(() => {
    //remova token se usar token*/
    localStorage.removeItem('usuarioId'); 
    localStorage.clear();

    const timeout = setTimeout(() => {
      window.location.href = '/';
    }, 1000);

    return () => clearTimeout(timeout);
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
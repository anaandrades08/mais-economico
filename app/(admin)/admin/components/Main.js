"use client";
import React from 'react';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/AdminMain.css';
import { FiLoader } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminMain() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [errors, setErrors] = useState({
    receitas: null,
    usuarios: null,
    substituicoes: null,
    feedbacks: null,
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    usuarios: [],
    receitas: [],
    substituicoes: [],
    feedbacks: [],
  });

  useEffect(() => {
    if (status === 'authenticated' && session.user?.tipo !== 1) {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [receitasRes, usuariosRes, substituicoesRes, feedbacksRes] = await Promise.all([
        fetch('/api/receitas/receitas-novas/'),
        fetch('/api/usuarios/usuarios-novos/'),
        fetch('/api/ingredientesSubstituicao/substituicao-nova/'),
        fetch('/api/feedbacks/feedbacks-novos/')
      ]);

      const [receitasData, usuariosData, substituicoesData, feedbacksData] = await Promise.all([
        receitasRes.json(),
        usuariosRes.json(),
        substituicoesRes.json(),
        feedbacksRes.json()
      ]);

      setData({
        usuarios: usuariosRes.ok ? usuariosData : [],
        receitas: receitasRes.ok ? receitasData : [],
        substituicoes: substituicoesRes.ok ? substituicoesData : [],
        feedbacks: feedbacksRes.ok ? feedbacksData : [],
      });

      setErrors({
        receitas: receitasRes.ok ? null : 'Erro ao carregar receitas novas',
        usuarios: usuariosRes.ok ? null : 'Erro ao carregar usuários novos',
        substituicoes: substituicoesRes.ok ? null : 'Erro ao carregar substituições novas',
        feedbacks: feedbacksRes.ok ? null : 'Erro ao carregar feedbacks novos'
      });

    } catch (error) {
      console.error('Fetch error:', error);
      setErrors({
        receitas: 'Erro ao tentar carregar receitas novas',
        usuarios: 'Erro ao tentar carregar usuários novos',
        substituicoes: 'Erro ao tentar carregar substituições novas',
        feedbacks: 'Erro ao tentar carregar feedbacks novos'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session || session.user?.tipo !== 1) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <FiLoader className="loading-spinner" size={24} />
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="admin-main container">
      <h1 className="admin-title">Bem vindo(a) {session.user?.nome || 'Administrador(a)'}!</h1>
      <div className="admin-content">
        {/* Usuários Section */}
        <div className="admin-section">
          <h2>Usuários Novos</h2>
          {errors.usuarios ? (
            <p className="error-message">{errors.usuarios}</p>
          ) : data.usuarios.length > 0 ? (
            <Link href="/admin/usuarios/novos" className="admin-link">
              <span className="count-badge">{data.usuarios.length}</span> Usuários Novos
            </Link>
          ) : (
            <p>Nenhum usuário novo encontrado.</p>
          )}
        </div>

        {/* Receitas Section */}
        <div className="admin-section">
          <h2>Receitas Novas</h2>
          {errors.receitas ? (
            <p className="error-message">{errors.receitas}</p>
          ) : data.receitas.length > 0 ? (
            <Link href="/admin/receitas/novas" className="admin-link">
              <span className="count-badge">{data.receitas.length}</span> Receitas Novas
            </Link>
          ) : (
            <p>Nenhuma receita nova encontrada.</p>
          )}
        </div>

       
        {/* Substituições Section */}
        <div className="admin-section">
          <h2>Substituições Novas</h2>
          {errors.substituicoes ? (
            <p className="error-message">{errors.substituicoes}</p>
          ) : data.substituicoes.length > 0 ? (
            <Link href="/admin/substituicoes" className="admin-link">
              <span className="count-badge">{data.substituicoes.length}</span> Substituições Novas
            </Link>
          ) : (
            <p>Nenhuma substituição nova encontrada.</p>
          )}
        </div>

        {/* Feedbacks Section */}
        <div className="admin-section">
          <h2>Feedbacks Novos</h2>
          {errors.feedbacks ? (
            <p className="error-message">{errors.feedbacks}</p>
          ) : data.feedbacks.length > 0 ? (
            <Link href="/admin/feedbacks" className="admin-link">
              <span className="count-badge">{data.feedbacks.length}</span> Feedbacks Novos
            </Link>
          ) : (
            <p>Nenhum feedback novo encontrado.</p>
          )}
          </div>
      </div>
    </div>
  );
}
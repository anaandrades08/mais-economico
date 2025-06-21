'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../../styles/UsuariosPage.css';
import Link from 'next/link';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function AlterarCategoriaAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [categoria, setCategoria] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        const fetchCategoria = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/categorias/${params.id}`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar categoria: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados da categoria');
                }

                setCategoria(data);
                setFormData({
                    nome: data.nome || '',
                    link_categoria: data.link_categoria || '',
                });
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar categoria:', err);
                setError(err.message);
                setCategoria(null);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchCategoria();
        }
    }, [session, status, router, params.id]);

    const id_usuario = session?.user?.id || 0;
    const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        nome: '',
        link_categoria: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const limparFormulario = () => {
    setFormData({ ...categoria });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      // Criar payload seguro
      const payload = {
        nome: formData.nome,
        link_categoria: formData.link_categoria,
      };

      // Chamada correta para a API
      const res = await fetch(`/api/admin/categorias/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro na requisição');
      }

      const data = await res.json();
      setSuccess('Categoria atualizada com sucesso!');
      setTimeout(() => router.push('/admin/categorias'), 2000);
    } catch (error) {
      console.error('Erro na submissão:', error);
      setError(error.message || 'Erro ao atualizar categoria');
    } finally {
      setLoading(false);
    }
  };


    if (loading && !formData) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Atualização de Categoria</h1>

                {/* Mensagens de feedback */}
                {error && (
                    <div className="status-message error">
                        <FiAlertCircle className="icon" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="close-btn">
                            &times;
                        </button>
                    </div>
                )}

                {success && (
                    <div className="status-message success">
                        <FiCheckCircle className="icon" />
                        <span>{success}</span>
                        <button onClick={() => setSuccess(null)} className="close-btn">
                            &times;
                        </button>
                    </div>
                )}

                <form className="usuario-cadastro-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="usuario-cadastro-inputs">

                        <label>Nome da Categoria:</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            
                        />
                        <label>Link da Categoria:</label>
                        <input
                            type="text"
                            name="link_categoria"
                            value={formData.link_categoria}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />

                        <label>Usuário:</label>
                        <input
                            type="text"
                            value={nome_usuario}
                            readOnly
                            disabled
                        />
                        <input
                            type="hidden"
                            name="id_usuario"
                            value={id_usuario}
                        />
                    </div>

                    <div className="usuario-cadastro-botoes">
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spin" /> Alterando...
                                </>
                            ) : (
                                'Alterar Categoria'
                            )}
                        </button>
                       <Link href={'/admin/categorias/'} passHref><button type="button">Cancelar</button></Link>
                    </div>
                </form>
            </section>
        </div>
    );
}
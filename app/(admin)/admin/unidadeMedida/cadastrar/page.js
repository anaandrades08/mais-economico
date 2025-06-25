'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2, FiEdit, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function CadastrarTipoIngredienteAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
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
    }, [session, status, router]);

    const id_usuario = session?.user?.id || 0;
    const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        unidade_medida: '',
        sigla: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const limparFormulario = () => {
        setFormData({
            unidade_medida: '',
            sigla: '',
        });
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Validação básica
            if (!formData.unidade_medida) {
                throw new Error('Descrição da unidade de medida é obrigatória');
            }
            if (!formData.sigla) {
                throw new Error('Sigla da unidade de medida é obrigatória');    
            }

            // Cria FormData para enviar arquivo
            const formDataToSend = new FormData();
            formDataToSend.append('unidade_medida', formData.unidade_medida);
            formDataToSend.append('sigla', formData.sigla);

            const response = await fetch('/api/admin/unidadeMedida', {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao cadastrar unidade de medida');
            }

            setSuccess('Unidade de medida cadastrada com sucesso!');
            setTimeout(() => {
                setSuccess(null);
                router.push('/admin/unidadeMedida');
            }, 2000);
            limparFormulario();
        } catch (err) {
            console.error('Erro ao cadastrar unidade de medida:', err);
            setError(err.message || 'Erro ao cadastrar unidade de medida');
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
                <h1>Cadastro de Unidade de Medida</h1>

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

                        <label>Descrição:</label>
                        <input
                            type="text"
                            name="unidade_medida"
                            value={formData.unidade_medida}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />

                        <label>Sigla:</label>
                        <input
                            type="text"
                            name="sigla"
                            value={formData.sigla}
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
                                    <FiLoader className="spin" /> Cadastrando...
                                </>
                            ) : (
                                <>
                                    <FiEdit size={18} /> Cadastrar Unidade de Medida
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={limparFormulario}
                            disabled={loading}
                            className="secondary"
                        >
                           <FiRefreshCw size={18} />  Limpar
                        </button>
                        <Link href="/admin/unidadeMedida" className="back-button">
                            <button
                                type="button"
                                disabled={loading}
                                className="secondary"
                            >
                                <FiArrowLeft size={20} /> Voltar
                            </button>
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
}
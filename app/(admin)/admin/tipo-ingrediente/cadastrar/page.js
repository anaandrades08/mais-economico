'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
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
        tipo_ingrediente: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const limparFormulario = () => {
        setFormData({
            tipo_ingrediente: '',
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
            if (!formData.tipo_ingrediente) {
                throw new Error('Descrição do tipo de ingrediente é obrigatória');
            }

            // Cria FormData para enviar arquivo
            const formDataToSend = new FormData();
            formDataToSend.append('tipo_ingrediente', formData.tipo_ingrediente);

            const response = await fetch('/api/admin/tipos-ingredientes', {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao cadastrar ingrediente');
            }

            setSuccess('Ingrediente cadastrada com sucesso!');
            limparFormulario();
        } catch (err) {
            console.error('Erro ao cadastrar ingrediente:', err);
            setError(err.message || 'Erro ao cadastrar ingrediente');
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
                <h1>Cadastro de Ingredientes</h1>

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

                        <label>Descrição do Tipo de Ingrediente:</label>
                        <input
                            type="text"
                            name="tipo_ingrediente"
                            value={formData.tipo_ingrediente}
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
                                'Cadastrar Tipo de Ingrediente'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={limparFormulario}
                            disabled={loading}
                            className="secondary"
                        >
                            Limpar
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
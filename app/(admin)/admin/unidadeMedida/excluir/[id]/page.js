'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2, FiEdit, FiArrowLeft } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function GerenciarUnidadeMedidaAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const id_uni_medida = params?.id;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        // Se houver um ID na URL, carregamos os dados para edição
        if (id_uni_medida) {
            carregarUnidadeMedida();
            setIsEditing(true);
        }
    }, [session, status, router, id_uni_medida]);

    const id_usuario = session?.user?.id || 0;
    const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        unidade_medida: '',
        sigla: '',
        total_ingredientes: 0,
        total_ingredientesReceita: 0,
        total_substituicoes: 0

    });

    const carregarUnidadeMedida = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/unidadeMedida/${id_uni_medida}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao carregar unidade de medida');
            }

            setFormData({
                unidade_medida: result.data.unidade_medida,
                sigla: result.data.sigla || '',
                total_ingredientes: result.data.total_ingredientes || 0,
                total_ingredientesReceita: result.data.total_ingredientesReceita || 0,
                total_substituicoes: result.data.total_substituicoes || 0

            });
        } catch (err) {
            console.error('Erro ao carregar unidade de medida:', err);
            setError(err.message || 'Erro ao carregar unidade de medida');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleDelete = async () => {
        if (formData.total_ingredientes > 0 || formData.total_ingredientesReceita > 0 || formData.total_substituicoes > 0) {
            setError('Não é possível excluir um unidade de medida com ingredientes vinculados.');
            return;
        }

        if (!window.confirm('Tem certeza que deseja excluir este unidade de medida? Esta ação não pode ser desfeita.')) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/admin/unidadeMedida/${id_uni_medida}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao excluir unidade de medida');
            }

            setSuccess('Unidade de medida excluída com sucesso!');
            setTimeout(() => {
                router.push('/admin/unidadeMedida');
            }, 1500);
        } catch (err) {
            console.error('Erro ao excluir unidade de medida:', err);
            setError(err.message || 'Erro ao excluir unidade de medida');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados de unidade de medida...</p>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <div className="header-actions">
                    <h1>Excluir Unidade de Medida #{id_uni_medida}</h1>

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
                      <div>{isEditing && (
                                            <button
                                                onClick={handleDelete}
                                                disabled={loading}
                                                className="button-delete"
                                            >
                                                <FiTrash2 size={18} /> Excluir unidade de Medida
                                            </button>
                                        )}</div>             
                </div>
                    <div className="usuario-cadastro-inputs">
                        <p></p>
                        <label>Descrição:</label>
                        <input
                            type="text"
                            name="unidade_medida"
                            value={formData.unidade_medida}
                            onChange={handleChange}
                            required
                            disabled
                        />
                        <label>Sigla:</label>
                        <input
                            type="text"
                            name="sigla"
                            value={formData.sigla}
                            onChange={handleChange}
                            required
                            disabled
                        />

                        {(formData.total_ingredientes > 0 || formData.total_ingredientesReceita > 0 || formData.total_substituicoes > 0) && (
                            <>
                                <label>Ingredientes Vinculados:</label>
                                <input
                                    type="text"
                                    value={`${formData.total_ingredientes} unidade(s) em ingredientes, ${formData.total_ingredientesReceita} unidade(s) em ingredientes de receitas, ${formData.total_substituicoes} em substituição(ões)`}
                                    readOnly
                                    disabled
                                    className={(formData.total_ingredientes > 0 || formData.total_ingredientesReceita > 0 || formData.total_substituicoes > 0)? 'has-ingredients' : ''}
                                />
                                {(formData.total_ingredientes > 0 || formData.total_ingredientesReceita > 0 || formData.total_substituicoes > 0)&& (
                                    <p className="warning-message">
                                        Esta unidade de medida possui ingredientes vinculados. A exclusão não será permitida.
                                    </p>
                                )}
                            </>
                        )}


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
                       
                        <Link href={`/admin/unidadeMedida/alterar/${id_uni_medida}`} className="back-button">
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="secondary"
                                >
                                    <FiEdit size={18} /> Atualizar Unidade de Medida
                                </button>
                            </Link>                        
                            <Link href="/admin/unidadeMedida/" className="back-button">
                                <button
                                    type="button"
                                    disabled={loading}
                                    className="secondary"
                                >
                                    <FiArrowLeft size={20} /> Voltar
                                </button>
                            </Link>                     
                    </div>
            </section>
        </div>
    );
}
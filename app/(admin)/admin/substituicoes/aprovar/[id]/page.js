'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { formatarDataeHora, formatarData } from '../../../funcoes/Usuarios';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function FeedbackAprovarAdmin() {
    const { id } = useParams(); // Mudança: usar desestruturação direta
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [substituicao, setFeedback] = useState(null); // Estado separado para os dados originais

    const [formData, setFormData] = useState({
        ativo: '',
    });

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/substituicoes/${id}`);

                if (!res.ok) {
                    throw new Error(`Erro ao carregar substituicao: ${res.statusText}`);
                }

                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados do substituicao');
                }

                setFeedback(data); // Armazena os dados completos
                setFormData({
                    ativo: data.ativo?.toString() || '',
                });

                setError(null);
            } catch (err) {
                console.error('Erro ao carregar substituicao:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFeedback();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const limparFormulario = () => {
        setFormData({ ...usuario });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);

            if (!formData.ativo) {
                throw new Error('Selecione um status para o substituicao');
            }

            const res = await fetch(`/api/admin/substituicoes/aprovar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ativo: parseInt(formData.ativo)
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Falha ao atualizar substituicao');
            }

            setSuccess('Status do substituicao atualizado com sucesso!');
            setTimeout(() => router.push('/admin/substituicoes'), 2000);
        } catch (error) {
            console.error('Erro na submissão:', error);
            setError(error.message || 'Erro ao atualizar status do substituicao');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !substituicao) {
        return (
            <div className="admin-loading">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dados do substituição para aprovar...</p>
            </div>
        );
    }

    if (error && !substituicao) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <Link href="/admin/substituicoes" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    if (!substituicao) {
        return (
            <div className="error-container">
                <p>Feedback não encontrado</p>
                <Link href="/admin/substituicoes" className="back-button">
                    Voltar para lista
                </Link>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-lista-admin">
                <h1>Aprovar/Reprovar Substituição #{substituicao.id_substituicao}</h1>
                {/* Mensagens de substituicao */}
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
                    </div>
                )}
                <form className="usuario-cadastro-form" onSubmit={handleSubmit}>
                    <div className="usuario-cadastro-inputs">
                        <Image
                            src={substituicao.receita?.img_receita || '/images/usuario/fotodoperfil.png'}
                            alt={substituicao.receita?.titulo_receita || 'Foto da Receita'}
                            width={200}
                            height={200}
                            className="usuario-foto-perfil"
                        />
                        <h2>Receita: {substituicao.receita?.titulo_receita}</h2>             
                        <p>Descrição: {substituicao.descricao_preparo || 'Nenhuma mensagem fornecida'}</p>                                   
                        <p>Data da substituicao: {formatarDataeHora(substituicao.data_cadastro)}</p>
                        <p>Enviado por: {substituicao.usuario?.nome || 'Usuário Desconhecido'}</p>
                        <p>Email: {substituicao.usuario?.email || 'Email Desconhecido'}</p>

                        <p>Para aprovar a substituição mude o status para ativo:</p>
                        <select name="ativo" value={formData.ativo} onChange={handleChange}>
                            <option value=''>Selecione</option>
                            <option value='1'>Aprovar</option>
                            <option value='2'>Reprovar</option>
                            <option value='0'>Inativo</option>
                        </select>
                    </div>

                    <div className="usuario-cadastro-botoes">
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spin" /> Aprovando...
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle /> Aprovar Substituição
                                </>
                            )}
                        </button>

                        <Link href={'/admin/substituicoes/'} passHref><button type="button">Cancelar</button></Link>
                    </div>
                </form>
            </section>
        </div>
    )
}


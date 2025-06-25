'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiTrash2, FiEdit, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function EditarIngredienteAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const id_ingrediente = params?.id;
    const [loading, setLoading] = useState(true); // Inicia como true para mostrar loading
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [tipoIngredientes, setTipoIngredientes] = useState([]);
    const [uniMedida, setUniMedida] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
            return;
        }
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        const loadAllData = async () => {
            try {
                setLoading(true);

                // Carrega dados básicos em paralelo
                const [tiposResponse, unidadesResponse, ingredienteResponse] = await Promise.all([
                    fetch('/api/ingredientes/'),
                    fetch('/api/unidadeMedida/'),
                    id_ingrediente ? fetch(`/api/admin/ingredientes/${id_ingrediente}`) : Promise.resolve(null)
                ]);

                // Verifica erros nas respostas
                if (!tiposResponse.ok) throw new Error('Erro ao carregar tipos de ingredientes');
                if (!unidadesResponse.ok) throw new Error('Erro ao carregar unidades de medida');

                const [tiposData, unidadesData] = await Promise.all([
                    tiposResponse.json(),
                    unidadesResponse.json()
                ]);

                setTipoIngredientes(tiposData);
                setUniMedida(unidadesData);

                // Se estiver editando, processa os dados do ingrediente
                if (id_ingrediente && ingredienteResponse) {
                    if (!ingredienteResponse.ok) {
                        throw new Error('Erro ao carregar dados do ingrediente');
                    }

                    const ingredienteData = await ingredienteResponse.json();

                    if (!ingredienteData || !ingredienteData.success) {
                        throw new Error(ingredienteData.error || 'Dados do ingrediente inválidos');
                    }

                    setFormData({
                        id_tipo_ingrediente: ingredienteData.data?.id_tipo_ingrediente?.toString() || '',
                        descricao_ingrediente: ingredienteData.data?.descricao_ingrediente || '',
                        valor: ingredienteData.data?.valor?.toString() || '0.00',
                        quantidade: ingredienteData.data?.quantidade?.toString() || '0',
                        id_uni_medida: ingredienteData.data?.id_uni_medida?.toString() || '',
                        total_ingredientesReceita: ingredienteData.data?.total_ingredientesReceita || 0
                    });
                    setIsEditing(true);
                }
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError(err.message || 'Erro ao carregar dados');
                if (err.message.includes('não encontrado')) {
                    router.push('/admin/ingredientes');
                }
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            loadAllData();
        }
    }, [session, status, router, id_ingrediente]);

    const id_usuario = session?.user?.id || 0;
    const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        id_tipo_ingrediente: '',
        descricao_ingrediente: '',
        valor: '0.00',
        quantidade: '0',
        id_uni_medida: '',
        total_ingredientesReceita: 0,
    });


    const carregarIngrediente = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/ingredientes/${id_ingrediente}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao carregar ingrediente');
            }

            setFormData({
                id_tipo_ingrediente: result.data.id_tipo_ingrediente || '',
                descricao_ingrediente: result.data.descricao_ingrediente || '',
                valor: result.data.valor || '0.00',
                quantidade: result.data.quantidade || '0',
                id_uni_medida: result.data.id_uni_medida || '',
                total_ingredientesReceita: result.data.total_ingredientesReceita || 0
            });
        } catch (err) {
            console.error('Erro ao carregar ingrediente:', err);
            setError(err.message || 'Erro ao carregar ingrediente');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'quantidade') {
            if (!/^[0-9]*$/.test(value)) return; // Aceita apenas números inteiros (0-9)
        }
        if (name === 'valor') {
            if (!/^[0-9]*\.?[0-9]*$/.test(value)) return; // Aceita apenas números e .
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const limparFormulario = () => {
        setFormData({
            id_tipo_ingrediente: '',
            descricao_ingrediente: '',
            valor: '0.00',
            quantidade: '0',
            id_uni_medida: '',
            total_ingredientesReceita: 0,
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
            const formDataToSend = new FormData();
            formDataToSend.append('descricao_ingrediente', formData.descricao_ingrediente);
            formDataToSend.append('id_tipo_ingrediente', formData.id_tipo_ingrediente);
            formDataToSend.append('valor', formData.valor);
            formDataToSend.append('id_uni_medida', formData.id_uni_medida);
            formDataToSend.append('quantidade', formData.quantidade);
            formDataToSend.append('id_usuario', id_usuario);

            const url = isEditing
                ? `/api/admin/ingredientes/${id_ingrediente}`
                : '/api/admin/ingredientes';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} ingrediente`);
            }

            setSuccess('Ingrediente atualizado com sucesso!');
            setTimeout(() => {
                if (isEditing) {
                    router.push('/admin/ingredientes');
                }
            }, 2000);

            if (!isEditing) {
                limparFormulario();
            }
        } catch (err) {
            console.error('Erro ao atualizar ingrediente:', err);
            setError(err.message || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} ingrediente`);
        } finally {
            setLoading(false);
        }
    };
       const handleDelete = async () => {
         if (formData.total_ingredientesReceita > 0) {
            setError('Não é possível excluir um ingrediente com ingredientes vinculados em receitas.');
            return;
        }
        if (!window.confirm('Tem certeza que deseja excluir este ingrediente?\nEsta ação não pode ser desfeita.')) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Verifica se há receitas vinculadas
            if (ingrediente?.total_ingredientesReceita > 0) {
                throw new Error('Não é possível excluir: existem receitas vinculadas a este ingrediente');
            }

            const response = await fetch(`/api/admin/ingredientes/${id_ingrediente}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao excluir ingrediente');
            }

            setSuccess('Ingrediente excluído com sucesso!');
            setTimeout(() => {
                router.push('/admin/ingredientes');
            }, 2000);
        } catch (err) {
            console.error('Erro ao excluir ingrediente:', err);
            setError(err.message || 'Erro ao excluir ingrediente');
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
                <h1>Editar Ingrediente #{id_ingrediente}</h1>

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
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="button-delete"
                    title={formData.total_ingredientesReceita > 0 ?
                        'Existem receitas vinculadas a este ingrediente' : ''}
                >
                    {loading ? (
                        <>
                            <FiLoader className="spin" /> Excluindo...
                        </>
                    ) : (
                        <>
                            <FiTrash2 size={18} /> Confirmar Exclusão
                        </>
                    )}
                </button>
                <form className="usuario-cadastro-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="usuario-cadastro-inputs">
                        <label>Tipo de Ingrediente:</label>
                        <select
                            name="id_tipo_ingrediente"
                            value={formData.id_tipo_ingrediente}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Selecione</option>
                            {tipoIngredientes.map((tipoIngrediente) => (
                                <option
                                    key={tipoIngrediente.id_tipo_ingrediente}
                                    value={tipoIngrediente.id_tipo_ingrediente}
                                >
                                    {tipoIngrediente.tipo_ingrediente}
                                </option>
                            ))}
                        </select>

                        <label>Descrição do Ingrediente:</label>
                        <input
                            type="text"
                            name="descricao_ingrediente"
                            value={formData.descricao_ingrediente}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />

                        <label>Valor (R$):</label>
                        <input
                            type="text"
                            name="valor"
                            value={formData.valor}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="0.00"
                        />

                        <label>Quantidade:</label>
                        <input
                            type="number"
                            name="quantidade"
                            value={formData.quantidade}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="0"
                        />

                        <label>Unidade de Medida:</label>
                        <select
                            name="id_uni_medida"
                            value={formData.id_uni_medida}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Selecione</option>
                            {uniMedida.map((uniMedida) => (
                                <option
                                    key={uniMedida.id_uni_medida}
                                    value={uniMedida.id_uni_medida}
                                >
                                    {uniMedida.unidade_medida} - {uniMedida.sigla}
                                </option>
                            ))}
                        </select>

                        {formData.total_ingredientesReceita > 0 && (
                            <>
                                <label>Ingredientes Vinculados em Receitas:</label>
                                <input
                                    type="text"
                                    value={`${formData.total_ingredientesReceita} ingrediente(s)`}
                                    readOnly
                                    disabled
                                    className={formData.total_ingredientesReceita > 0 ? 'has-ingredients' : ''}
                                />
                                {formData.total_ingredientesReceita > 0 && (
                                    <p className="warning-message">
                                        Este Ingrediente possui ingredientes vinculados em receitas. A exclusão não será permitida.
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
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spin" /> Atualizando...
                                </>
                            ) : (
                                <>
                                    <FiEdit size={18} /> Atualizar Ingrediente
                                </>
                            )}
                        </button>
                        <Link href="/admin/ingredientes" className="back-button">
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
'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function CadastrarIngredienteAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [tipoIngredientes, setTipoIngredientes] = useState([]);
    const [uniMedida, setUniMedida] = useState([]);


    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }

        const loadData = async () => {
            try {
                setLoading(true);
                const resTiposIngredientes = await fetch('/api/ingredientes/');
                if (!resTiposIngredientes.ok) throw new Error('Erro ao carregar tipos de ingredientes');
                const resTiposIngredientesData = await resTiposIngredientes.json();
                setTipoIngredientes(resTiposIngredientesData);

                const resUniMedida = await fetch('/api/unidadeMedida/');
                if (!resUniMedida.ok) throw new Error('Erro ao carregar unidades de medida');
                const resUniMedidaData = await resUniMedida.json();
                setUniMedida(resUniMedidaData);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            loadData();
        }
    }, [session, status, router]);

    const id_usuario = session?.user?.id || 0;
    const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        id_tipo_ingrediente: '',
        descricao_ingrediente: '',
        valor: '',
        quantidade: '',
        id_uni_medida: '',
    });

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
            if (!formData.id_tipo_ingrediente) {
                throw new Error('Selecione um tipo de ingrediente');
            }
            if (!formData.descricao_ingrediente) {
                throw new Error('Descrição do ingrediente é obrigatória');
            }
            if (!formData.valor || isNaN(formData.valor)) {
                throw new Error('Valor deve ser um número válido');
            }
            if (!formData.quantidade || isNaN(formData.quantidade)) {
                throw new Error('Quantidade deve ser um número válido');
            }
            if (!formData.id_uni_medida) {
                throw new Error('Unidade de medida é obrigatória');
            }

            // Cria FormData para enviar arquivo
            const formDataToSend = new FormData();
            formDataToSend.append('id_tipo_ingrediente', formData.id_tipo_ingrediente);
            formDataToSend.append('descricao_ingrediente', formData.descricao_ingrediente);
            formDataToSend.append('valor', formData.valor);
            formDataToSend.append('quantidade', formData.quantidade);
            formDataToSend.append('id_uni_medida', formData.id_uni_medida);

            const response = await fetch('/api/admin/ingredientes', {
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
                                'Cadastrar Ingrediente'
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
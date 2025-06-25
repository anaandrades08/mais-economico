// app/admin/ingredientes-receita/receita/[id]/page.js
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import '../../../styles/FeedbackPage.css';
import '../../../styles/ReceitaPage.css';
import { formatTime} from '../../../funcoes/Usuarios';
import { MenuLateral } from '../../menu_lateral.js';
import { FiArrowLeft, FiClock, FiUsers, FiDollarSign, FiStar } from 'react-icons/fi';
import { GiCookingPot, GiMeal } from 'react-icons/gi';
import { FaListOl } from 'react-icons/fa';

export default function ReceitaComIngredientesAdmin() {
    const { id } = useParams();
    const router = useRouter();
    const [receita, setReceita] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('ingredientes');

    useEffect(() => {
        const fetchReceita = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/admin/receitas/${id}`);

                if (!response.ok) {
                    throw new Error('Erro ao carregar receita');
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || 'Erro ao carregar receita');
                }

                setReceita(result.data);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar receita:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReceita();
    }, [id]);

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando receita...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => router.back()} className="back-button">
                    <FiArrowLeft /> Voltar
                </button>
            </div>
        );
    }

    if (!receita) {
        return (
            <div className="empty-message">
                <p>Receita não encontrada</p>
                <button onClick={() => router.back()} className="back-button">
                    <FiArrowLeft /> Voltar
                </button>
            </div>
        );
    }

    const renderDifficultyStars = (difficulty) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FiStar
                    key={i}
                    className={i <= difficulty ? 'star-filled' : 'star-empty'}
                />
            );
        }
        return stars;
    };

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <div className="receita-detalhes-container">
                <div className="header-with-back">
                    <button onClick={() => router.back()} className="back-button">
                        <FiArrowLeft /> Voltar
                    </button>
                    <h1>{receita.titulo_receita}</h1>
                </div>

                <div className="receita-header">
                    <div className="receita-image-container">
                        <Image
                            src={receita.img_receita || '/images/default-recipe.jpg'}
                            alt={receita.titulo_receita}
                            width={400}
                            height={300}
                            className="receita-image"
                        />
                    </div>

                    <div className="receita-meta">
                        <div className="meta-item">
                            <FiClock />
                            <span>Preparo: {formatTime(receita.tempo_preparo)}</span>
                        </div>
                        <div className="meta-item">
                            <FiClock />
                            <span>Total: {formatTime(receita.tempo_total)}</span>
                        </div>
                        <div className="meta-item">
                            <FiUsers />
                            <span>Rendimento: {receita.rendimento}</span>
                        </div>
                        <div className="meta-item">
                            <FiDollarSign />
                            <span>Custo: {formatarMoeda(receita.custo)}</span>
                        </div>
                        <div className="meta-item">
                            <span>Dificuldade: </span>
                            {renderDifficultyStars(receita.dificuldade)}
                        </div>
                        <div className="meta-item">
                            <GiMeal />
                            <span>Ingredientes: {receita.total_titulosIngrediente}</span>
                        </div>
                        <div className="meta-item">
                            <GiCookingPot />
                            <span>Passos: {receita.total_titulosPreparo}</span>
                        </div>
                        <div className="meta-item">
                            <span>Categoria: {receita.categoria?.nome || 'Sem categoria'}</span>
                        </div>
                        <div className="meta-item">
                            <span>Autor: {receita.usuario?.nome || 'Anônimo'}</span>
                        </div>
                    </div>
                </div>

                <div className="receita-description">
                    <h3>Descrição</h3>
                    <p>{receita.descricao_receita || 'Esta receita não possui descrição.'}</p>
                </div>

                <div className="receita-tabs">
                    <button
                        className={activeTab === 'ingredientes' ? 'active' : ''}
                        onClick={() => setActiveTab('ingredientes')}
                    >
                        <GiMeal /> Ingredientes ({receita.total_titulosIngrediente})
                    </button>
                    <button
                        className={activeTab === 'preparo' ? 'active' : ''}
                        onClick={() => setActiveTab('preparo')}
                    >
                        <GiCookingPot /> Modo de Preparo ({receita.total_titulosPreparo})
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'ingredientes' && (
                        <div className="ingredientes-content">
                            <h3>
                                <GiMeal /> Lista de Ingredientes
                            </h3>
                            {/* Aqui você precisaria fazer outra chamada à API para buscar os ingredientes específicos */}
                            <p>Lista de ingredientes será exibida aqui...</p>
                        </div>
                    )}

                    {activeTab === 'preparo' && (
                        <div className="preparo-content">
                            <h3>
                                <FaListOl /> Modo de Preparo
                            </h3>
                            {/* Aqui você precisaria fazer outra chamada à API para buscar os passos de preparo */}
                            <p>Passo a passo do modo de preparo será exibido aqui...</p>
                        </div>
                    )}
                </div>

                <div className="receita-stats">
                    <div className="stat-item">
                        <span>Substituições: {receita.total_substituicoes || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span>Favoritada: {receita.total_favoritos || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span>Feedbacks: {receita.total_feedbacks || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span>Cadastrada em: {new Date(receita.data_cadastro).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
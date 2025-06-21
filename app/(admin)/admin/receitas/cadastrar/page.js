'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useSession } from "next-auth/react";
import { MdCheckBox } from 'react-icons/md';

export default function CadastrarReceitaAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();  
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [categorias, setCategorias] = useState([]); // Estado para armazenar categorias
    const [imagePreview, setImagePreview] = useState(null); 

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }

        const loadData = async () => {
            try {
                setLoading(true);
                // Carrega categorias
                const resCategorias = await fetch('/api/categorias/');
                if (!resCategorias.ok) throw new Error('Erro ao carregar categorias');
                setCategorias(await resCategorias.json());
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
    const id_usuario = session?.user?.id || 0; // Pega o ID do usuário da sessão ou define como 0 se não estiver autenticado
    const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        titulo_receita: '',
        img_receita: '',
        descricao_receita: '',
        id_categoria: '',
        rendimento: '',
        custo: 0,
        tempo_total: 0,
        tempo_preparo: 0,
        dificuldade: '',
        aceito_termos: 0,
        id_usuario: id_usuario,
        ativo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const limparFormulario = () => {
        setFormData({
            titulo_receita: '',
            img_receita: '',
            descricao_receita: '',
            id_categoria: '',
            rendimento: '',
            custo: 0,
            tempo_total: 0,
            tempo_preparo: 0,
            dificuldade: '',
            aceito_termos: 0,
            id_usuario: id_usuario, // mantém usuário correto
            ativo: '',
        });
        setImagePreview('/images/layout/recipe/image-not-found.png');
        setError(null);
        setSuccess(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (!formData.titulo_receita || !formData.descricao_receita || !formData.id_categoria || !formData.img_receita) {
                throw new Error('Todos os campos obrigatórios devem ser preenchidos');
            }

            const formDataToSend = new FormData();
            const imageFile = document.getElementById('img_receita').files[0];

            // Append all form data
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // Append the image file if it exists
            if (imageFile) {
                formDataToSend.append('img_receita', imageFile);
            }

            // Append additional fields
            formDataToSend.append('custo', parseFloat(formData.custo).toFixed(2));
            formDataToSend.append('id_usuario', id_usuario);
            formDataToSend.append('aceito_termos', formData.aceito_termos ? 1 : 0);

            const response = await fetch('/api/receitas/receitas-admin/', {
                method: 'POST',
                body: formDataToSend, // No Content-Type header needed for FormData
            });



            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao cadastrar receita');
            }

            setSuccess('Receita cadastrada com sucesso!');
            limparFormulario();

            // Redireciona após 2 segundos
            setTimeout(() => {
                router.push('/admin/receitas');
            }, 2000);

        } catch (err) {
            console.error('Erro no cadastro:', err);
            setError(err.message || 'Erro ao cadastrar receita');
        } finally {
            setLoading(false);
        }
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview('/images/layout/recipe/image-not-found.png');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Cadastro de Receita</h1>
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
                    </div>
                )}

                <form className="usuario-cadastro-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="usuario-cadastro-inputs">
                        <label>Categoria:</label>
                        <select
                            name="id_categoria"
                            value={formData.id_categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione</option>
                            {categorias.map((categoria) => (
                                <option
                                    key={categoria.id_categoria}
                                    value={categoria.id_categoria}
                                >
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>
                        <div className="image-upload">
                            <label htmlFor="recipeImage">
                                <div className="image-placeholder">
                                    <img
                                        id="preview"
                                        src={imagePreview}
                                        alt="Pré-visualização da imagem"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </label>
                            <input
                                type="file"
                                name="img_receita"
                                id="img_receita"
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                required
                            />
                            <button
                                className="btn-img"
                                type="button"
                                onClick={() => document.getElementById('img_receita').click()}
                            >
                                Escolher uma imagem
                            </button>
                            <small>
                                Formato aceito: JPEG ou PNG<br />Tamanho menor que 10MB
                            </small>
                        </div>
                        <label>Titulo da Receita:</label>
                        <input
                            type="text"
                            name="titulo_receita"
                            value={formData.titulo_receita}
                            onChange={handleChange}
                            required
                        />

                        <label>Descrição da Receita:</label>
                        <textarea
                            name="descricao_receita"
                            value={formData.descricao_receita}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <label>Dificuldade:</label>
                        <select name="dificuldade" value={formData.dificuldade} onChange={handleChange} required>
                            <option value="">Selecione</option>
                            <option value="Fácil">Fácil</option>
                            <option value="Médio">Médio</option>
                            <option value="Difícil">Difícil</option>
                        </select>
                        <label>Rendimento:</label>
                        <input
                            type="text"
                            name="rendimento"
                            value={formData.rendimento}
                            onChange={handleChange}
                            required
                        />
                        <label>Custo:</label>
                        <input
                            type="text"
                            name="custo"
                            value={formData.custo}
                            onChange={handleChange}
                            required
                        />
                        <label>Tempo total:</label>
                        <input
                            type="number"
                            name="tempo_total"
                            value={formData.tempo_total}
                            onChange={handleChange}
                            required
                        />
                        <label>Tempo de preparo:</label>
                        <input
                            type="number"
                            name="tempo_preparo"
                            value={formData.tempo_preparo}
                            onChange={handleChange}
                            required
                        />
                        <label>Status:</label>
                        <select
                            name="ativo"
                            value={formData.ativo || ''} // Converte null/undefined para string vazia
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="1">Ativo</option>
                            <option value="0">Inativo</option>
                            <option value="2">Pendente</option>
                        </select>
                        <label>Termos:</label>
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                name="aceito_termos"
                                checked={formData.aceito_termos}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        aceito_termos: e.target.checked,
                                    }))
                                }
                                required
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-label">Aceitar termos e condições para cadastro da receita.</span>
                        </label>
                        <label>Usuário:</label>
                        <label>{nome_usuario}</label>
                        <input
                            type="hidden"
                            name="id_usuario"
                            value={id_usuario}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="usuario-cadastro-botoes">
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spin" /> Cadastrando...
                                </>
                            ) : (
                                'Cadastrar Receita'
                            )}
                        </button>
                        <button type="button" onClick={limparFormulario} disabled={loading}>
                            Limpar
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
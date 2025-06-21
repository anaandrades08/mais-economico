'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/UsuariosPage.css';
import { MenuLateral } from '../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function CadastrarDicaAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [imagePreview, setImagePreview] = useState('/images/layout/recipe/image-not-found.png');
    const [imageFile, setImageFile] = useState(null);

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
                const categoriasData = await resCategorias.json();
                setCategorias(categoriasData);
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
        titulo: '',
        descricao: '',
        id_categoria: '',
        cta_text: '',
        ativo: '1',
        id_usuario: id_usuario
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const limparFormulario = () => {
        setFormData({
            titulo: '',
            descricao: '',
            id_categoria: '',
            cta_text: '',
            ativo: '1',
            id_usuario: id_usuario
        });
        setImagePreview('/images/layout/recipe/image-not-found.png');
        setImageFile(null);
        setError(null);
        setSuccess(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Verifica o tamanho do arquivo (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('O tamanho da imagem deve ser menor que 10MB');
                return;
            }

            // Verifica o tipo do arquivo
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Formato de imagem inválido. Use JPEG ou PNG');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageFile(file);
            };
            reader.readAsDataURL(file);
            setError(null);
        } else {
            setImagePreview('/images/layout/recipe/image-not-found.png');
            setImageFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Validação básica
            if (!formData.id_categoria) {
                throw new Error('Selecione uma categoria');
            }
            if (!imageFile) {
                throw new Error('Selecione uma imagem para a dica');
            }

            // Cria FormData para enviar arquivo
            const formDataToSend = new FormData();
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('descricao', formData.descricao);
            formDataToSend.append('id_categoria', formData.id_categoria);
            formDataToSend.append('cta_text', formData.cta_text);
            formDataToSend.append('ativo', formData.ativo);
            formDataToSend.append('id_usuario', formData.id_usuario);
            formDataToSend.append('img_dica', imageFile);

            const response = await fetch('/api/admin/dicas', {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao cadastrar dica');
            }

            setSuccess('Dica cadastrada com sucesso!');
            setTimeout(() => router.push('/admin/dicas'), 2000);
            limparFormulario();
        } catch (err) {
            console.error('Erro ao cadastrar dica:', err);
            setError(err.message || 'Erro ao cadastrar dica');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Cadastro de Dica</h1>
                
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
                        <label>Categoria:</label>
                        <select
                            name="id_categoria"
                            value={formData.id_categoria}
                            onChange={handleChange}
                            required
                            disabled={loading}
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
                            <label htmlFor="img_dica">
                                <div className={`image-placeholder ${imageFile ? 'has-image' : ''}`}>
                                    <img
                                        id="preview"
                                        src={imagePreview}
                                        alt="Pré-visualização da imagem"
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            display: imageFile ? 'block' : 'none'
                                        }}
                                    />
                                </div>
                            </label>
                            <input
                                type="file"
                                name="img_dica"
                                id="img_dica"
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                disabled={loading}
                            />
                            <button
                                className="btn-img"
                                type="button"
                                onClick={() => document.getElementById('img_dica').click()}
                                disabled={loading}
                            >
                                Escolher uma imagem
                            </button>
                            <small>
                                Formato aceito: JPEG ou PNG<br />Tamanho menor que 10MB
                            </small>
                        </div>

                        <label>Título da Dica:</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />

                        <label>Descrição da Dica:</label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        ></textarea>

                        <label>Texto do Botão (CTA):</label>
                        <input
                            type="text"
                            name="cta_text"
                            value={formData.cta_text}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Ex: Saiba mais"
                        />

                        <label>Status:</label>
                        <select
                            name="ativo"
                            value={formData.ativo}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="1">Ativo</option>
                            <option value="0">Inativo</option>
                            <option value="2">Pendente</option>
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
                                'Cadastrar Dica'
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
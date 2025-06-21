'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/UsuariosPage.css';
import { MenuLateral } from '../../menu_lateral.js';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { useSession } from "next-auth/react";

export default function AlterarDicaAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [dica, setDica] = useState(null);
    const [imagePreview, setImagePreview] = useState('/images/layout/recipe/image-not-found.png');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (status === 'authenticated' && session.user?.tipo !== 1) {
            router.push('/login');
        }
        if (status === 'unauthenticated') {
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

                // Carrega dados da dica existente
                const res = await fetch(`/api/admin/dicas/${params.id}`);
                if (!res.ok) {
                    throw new Error(`Erro ao carregar dica: ${res.statusText}`);
                }
                const { success, data, error: apiError } = await res.json();

                if (!success) {
                    throw new Error(apiError || 'Erro ao carregar dados da dica');
                }

                setDica(data);
                setFormData({
                    titulo: data.titulo,
                    descricao: data.descricao,
                    id_categoria: data.id_categoria,
                    cta_text: data.cta_text,
                    ativo: data.ativo,
                    id_usuario: data.id_usuario,
                    nome_usuario: data.usuario?.nome,
                });

                if (data.img_dica) {
                    setImagePreview(data.img_dica);
                }

            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated' && params.id) {
            loadData();
        }
    }, [session, status, router, params.id]);

    const id_usuario = session?.user?.id || 0;
    //const nome_usuario = session?.user?.nome || 'Desconhecido';

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        id_categoria: '',
        cta_text: '',
        ativo: '1',
        id_usuario: id_usuario,
        nome_usuario: session?.user?.nome || 'Desconhecido',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('O tamanho da imagem deve ser menor que 10MB');
                return;
            }

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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (!formData.id_categoria) {
                throw new Error('Selecione uma categoria');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('descricao', formData.descricao);

            formDataToSend.append('id_categoria', formData.id_categoria);
            formDataToSend.append('cta_text', formData.cta_text);
            formDataToSend.append('ativo', formData.ativo);
            formDataToSend.append('id_usuario', formData.id_usuario);

            // Apenas envia a imagem se foi alterada
            if (imageFile) {
                formDataToSend.append('img_dica', imageFile);
            }

            const response = await fetch(`/api/admin/dicas/${params.id}`, {
                method: 'PUT',
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao atualizar dica');
            }

            setSuccess('Dica atualizada com sucesso!');
            setTimeout(() => router.push('/admin/dicas'), 2000);
        } catch (err) {
            console.error('Erro ao atualizar dica:', err);
            setError(err.message || 'Erro ao atualizar dica');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.titulo) {
        return (
            <div className="loading-container">
                <FiLoader className="loading-spinner" size={24} />
                <p>Carregando dica...</p>
            </div>
        );
    }

    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Alteração de Dica</h1>

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
                                <div className={`image-placeholder ${imagePreview !== '/images/layout/recipe/image-not-found.png' ? 'has-image' : ''}`}>
                                    <img
                                        id="preview"
                                        src={imagePreview}
                                        alt="Pré-visualização da imagem"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: imagePreview !== '/images/layout/recipe/image-not-found.png' ? 'block' : 'none'
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
                                Alterar imagem
                            </button>
                            <small>
                                Deixe em branco para manter a imagem atual<br />
                                Formatos aceitos: JPEG ou PNG (até 10MB)
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
                            name='nome_usuario'
                            value={formData.nome_usuario}
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
                                'Atualizar Dica'
                            )}
                        </button>
                        <Link href="/admin/dicas" className="secondary">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
}
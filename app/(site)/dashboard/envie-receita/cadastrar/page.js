"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../../../styles/dashboard.css";
import "../../../styles/EnvieReceita.css";
//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";

export default function CreateRecipe() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const [receita, setReceita] = useState({
    titulo_receita: '',
    descricao: '',
    custo: '',
    rendimento: '',
    dificuldade: '',
    tempo_preparo: '',
    tempo_total: '',
    aceito_termo: 0,
    id_categoria: ''
  });
  const [unidades, setUnidades] = useState([]);
  const [todosIngredientes, setTodosIngredientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ingredientesReceita, setIngredientesReceita] = useState([]);
  const [modopreparoReceita, setModopreparoReceita] = useState([]);
  const userId = session?.user?.id;
  const userNome = session?.user?.nome;

  // Carrega dados iniciais
  useEffect(() => {
    if (session?.user) {
      const loadData = async () => {
        try {
          setLoading(true);
          
          // Carrega categorias
          const resCategorias = await fetch('/api/categorias/');
          if (!resCategorias.ok) throw new Error('Erro ao carregar categorias');
          setCategorias(await resCategorias.json());
          
          // Carrega ingredientes
          const resIngredientes = await fetch('/api/ingredientes/');
          if (!resIngredientes.ok) throw new Error('Erro ao carregar ingredientes');
          setTodosIngredientes(await resIngredientes.json());
          
          // Carrega unidades de medida
          const resUnidades = await fetch('/api/unidadeMedida/');
          if (!resUnidades.ok) throw new Error('Erro ao carregar unidades');
          setUnidades(await resUnidades.json());
          
        } catch (error) {
          console.error(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [session]);

  // Redireciona se não estiver autenticado
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (!userId) {
    return (
      <div className="notFound">
        <h2>Usuário não encontrado</h2>
        <Link href="/login" className="backLink">
          Voltar para login
        </Link>
      </div>
    );
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = '/icons/upload.svg';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceita(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  };

  // Funções para manipular ingredientes
  const addNovoTituloIngrediente = () => {
    setIngredientesReceita(prev => [
      ...prev,
      {
        id_titulo_ingrediente_receita: Date.now(),
        titulo_ingrediente_receita: '',
        ingredientes: [{
          id_ingrediente_receita: Date.now(),
          quantidade: '',
          ingrediente: { id_ingrediente: '' },
          unidadeMedida: { id_uni_medida: '' }
        }]
      }
    ]);
  };

  const addIngrediente = (tituloIndex) => {
    setIngredientesReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].ingredientes.push({
        id_ingrediente_receita: Date.now(),
        quantidade: '',
        ingrediente: { id_ingrediente: '' },
        unidadeMedida: { id_uni_medida: '' }
      });
      return updated;
    });
  };

  const removeIngrediente = (tituloIndex, ingredienteIndex) => {
    setIngredientesReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].ingredientes.splice(ingredienteIndex, 1);
      
      // Remove o título se não houver mais ingredientes
      if (updated[tituloIndex].ingredientes.length === 0) {
        updated.splice(tituloIndex, 1);
      }
      
      return updated;
    });
  };

  // Funções para manipular modo de preparo
  const addNovoTituloPreparo = () => {
    setModopreparoReceita(prev => [
      ...prev,
      {
        id_titulo_preparo: Date.now(),
        titulo_preparo: '',
        modosPreparo: [{
          id_modo_preparo: Date.now(),
          descricao_preparo: ''
        }]
      }
    ]);
  };

  const addPassoPreparo = (tituloIndex) => {
    setModopreparoReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].modosPreparo.push({
        id_modo_preparo: Date.now(),
        descricao_preparo: ''
      });
      return updated;
    });
  };

  const removePassoPreparo = (tituloIndex, passoIndex) => {
    setModopreparoReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].modosPreparo.splice(passoIndex, 1);
      
      // Remove o título se não houver mais passos
      if (updated[tituloIndex].modosPreparo.length === 0) {
        updated.splice(tituloIndex, 1);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!receita.aceito_termo) {
      setError('Você deve aceitar os termos e condições');
      return;
    }
    
    if (ingredientesReceita.length === 0) {
      setError('Adicione pelo menos um ingrediente');
      return;
    }
    
    if (modopreparoReceita.length === 0) {
      setError('Adicione pelo menos um passo de preparo');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // 1. Envia os dados básicos da receita
      const formData = new FormData();
      formData.append('titulo_receita', receita.titulo_receita);
      formData.append('descricao', receita.descricao);
      formData.append('custo', receita.custo);
      formData.append('rendimento', receita.rendimento);
      formData.append('dificuldade', receita.dificuldade);
      formData.append('tempo_preparo', receita.tempo_preparo);
      formData.append('tempo_total', receita.tempo_total);
      formData.append('id_categoria', receita.id_categoria);
      formData.append('aceito_termo', receita.aceito_termo);
      
      const imageFile = document.getElementById('recipeImage').files[0];
      if (imageFile) {
        formData.append('img_receita', imageFile);
      }

      const response = await fetch('/api/receitas', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar receita');
      }

      const { id_receita } = await response.json();

      // 2. Envia os ingredientes
      if (ingredientesReceita.length > 0) {
        const ingredientesResponse = await fetch(`/api/ingredientesReceita/receita/${id_receita}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ingredientesReceita),
        });

        if (!ingredientesResponse.ok) {
          throw new Error('Erro ao cadastrar ingredientes');
        }
      }

      // 3. Envia os modos de preparo
      if (modopreparoReceita.length > 0) {
        const preparoResponse = await fetch(`/api/modoPreparo/receita/${id_receita}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(modopreparoReceita),
        });

        if (!preparoResponse.ok) {
          throw new Error('Erro ao cadastrar modos de preparo');
        }
      }

      // Redireciona para a lista de receitas após sucesso
      router.push('/dashboard/envie-receita');
      
    } catch (error) {
      console.error('Erro ao cadastrar receita:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Cabeçalho e navegação (mantido igual) */}
      <div className="container-title">
        <h2 className="title">Painel de Controle do Usuário</h2>
      </div>

      <div className="name-page">
        <div className="name-title">
          <h2 className="nomeação">Bem vindo (ª) {userNome}</h2>
        </div>
        <div className="descrição">
          Nessa área você poderá mudar suas informações pessoais,
          <br />
          enviar uma receita e visualizar seus favoritos.
          <br />
          <Image
            className="área-do-usuario-img"
            alt="Área do usuário"
            src="/images/layout/user/user-area.png"
            width={353}
            height={222}
          />
        </div>
      </div>
      
      {/* menu de links */}
      < div className="container-abas" >
        <div className="abas">
          <Link href={`/dashboard/envie-receita/`} passHref><button className="aba ativa"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
          <Link href={`/dashboard/favoritos/`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
          <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
          <Link href={`/dashboard/feedback/`} passHref><button className="aba"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <section className="container-send-recipe">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="receita-container">
          <h2 className='receita-container-title'>Cadastre sua nova receita</h2>
          <div className="receita-container-cinza">
            <div className="form-container">
              <form id="form_receita-cadastrar" method="POST" onSubmit={handleSubmit}>
                <div className="form-top">
                  <div className="form-left">
                    <h3>Sua receita</h3>
                    <div className="image-upload">
                      <label htmlFor="recipeImage">
                        <div className="image-placeholder">
                          <img
                            id="preview"
                            src="/icons/upload.svg"
                            alt="Pré-visualização da imagem"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </label>
                      <input
                        type="file"
                        id="recipeImage"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        required
                      />
                      <button
                        className="btn-img"
                        type="button"
                        onClick={() => document.getElementById('recipeImage').click()}
                      >
                        Escolher uma imagem
                      </button>
                      <small>
                        Formato aceito: JPEG ou PNG<br />Tamanho menor que 10MB
                      </small>
                    </div>
                    
                    <label>Custo da Receita: <span className='erro-msg'>*</span></label>
                    <input 
                      type="text" 
                      name="custo"
                      value={receita.custo} 
                      onChange={handleInputChange} 
                      required 
                    />

                    <label>Rendimento da Receita: <span className='erro-msg'>*</span></label>
                    <input 
                      type="text" 
                      name="rendimento"
                      value={receita.rendimento} 
                      onChange={handleInputChange} 
                      required 
                    />

                    <label>Dificuldade da Receita: <span className='erro-msg'>*</span></label>
                    <input 
                      type="text" 
                      name="dificuldade"
                      value={receita.dificuldade} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="form-right">
                    <label>Categoria da Receita: <span className='erro-msg'>*</span></label>
                    <select
                      name="id_categoria"
                      value={receita.id_categoria}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      {categorias.map(categoria => (
                        <option key={categoria.id_categoria} value={categoria.id_categoria}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>

                    <label>Título da Receita: <span className='erro-msg'>*</span></label>
                    <input 
                      type="text" 
                      name="titulo_receita"
                      value={receita.titulo_receita} 
                      onChange={handleInputChange} 
                      required
                    />

                    <label>Descrição: <span className='erro-msg'>*</span></label>
                    <textarea 
                      name="descricao"
                      value={receita.descricao} 
                      onChange={handleInputChange} 
                      required
                    ></textarea>

                    <label>Tempo de Preparo (minutos): <span className='erro-msg'>*</span></label>
                    <input
                      type="number"
                      name="tempo_preparo"
                      value={receita.tempo_preparo}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1"
                      placeholder="Digite o tempo em minutos"
                    />

                    <label>Tempo Total de Preparo: <span className='erro-msg'>*</span></label>
                    <input 
                      type="text" 
                      name="tempo_total"
                      value={receita.tempo_total} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                {/* Seções de Ingredientes e Modo de Preparo (mantidas iguais) */}
                <div className="form-ingrediente-preparo">
                  <div className="form-left">
                    <div className="ingredientes-section">
                      <h3>Ingredientes <span className='erro-msg'>*</span></h3>
                      <button
                        type="button"
                        onClick={addNovoTituloIngrediente}
                        className="btn-add-section"
                      >
                        Adicionar Seção de Ingredientes
                      </button>

                      {ingredientesReceita.map((tituloIngrediente, tituloIndex) => (
                        <div key={tituloIngrediente.id_titulo_ingrediente_receita} className="ingredient-group">
                          <div className="ingredient-title-container">
                            <input
                              type="text"
                              placeholder="Título dos Ingredientes (ex: 'Para a massa')"
                              value={tituloIngrediente.titulo_ingrediente_receita}
                              onChange={(e) => {
                                const updated = [...ingredientesReceita];
                                updated[tituloIndex].titulo_ingrediente_receita = e.target.value;
                                setIngredientesReceita(updated);
                              }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => addIngrediente(tituloIndex)}
                              className="btn-add-item"
                            >
                              + Ingrediente
                            </button>
                          </div>

                          {tituloIngrediente.ingredientes.map((ingrediente, index) => (
                            <div key={index} className="ingredient-step">
                              <div className="ingredient-step-itens">
                                <select
                                  value={ingrediente.ingrediente?.id_ingrediente || ''}
                                  onChange={(e) => {
                                    const updated = [...ingredientesReceita];
                                    updated[tituloIndex].ingredientes[index].ingrediente.id_ingrediente = e.target.value;
                                    setIngredientesReceita(updated);
                                  }}
                                  required
                                >
                                  <option value="" disabled>Selecione um ingrediente</option>
                                  {todosIngredientes.flatMap(tipo =>
                                    tipo.ingredientes.map(ing => (
                                      <option key={ing.id_ingrediente} value={ing.id_ingrediente}>
                                        {ing.descricao_ingrediente}
                                      </option>
                                    ))
                                  )}
                                </select>

                                <input
                                  type="number"
                                  placeholder="Quantidade"
                                  value={ingrediente.quantidade}
                                  onChange={(e) => {
                                    const updated = [...ingredientesReceita];
                                    updated[tituloIndex].ingredientes[index].quantidade = e.target.value;
                                    setIngredientesReceita(updated);
                                  }}
                                  required
                                />

                                <select
                                  value={ingrediente.unidadeMedida?.id_uni_medida || ''}
                                  onChange={(e) => {
                                    const updated = [...ingredientesReceita];
                                    updated[tituloIndex].ingredientes[index].unidadeMedida.id_uni_medida = e.target.value;
                                    setIngredientesReceita(updated);
                                  }}
                                  required
                                >
                                  <option value="" disabled>Unidade</option>
                                  {unidades.map(uni => (
                                    <option key={uni.id_uni_medida} value={uni.id_uni_medida}>
                                      {uni.unidade_medida}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() => removeIngrediente(tituloIndex, index)}
                                  className="btn-remove-item"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-right">
                    <div className="prepare-section">
                      <h3>Preparo <span className='erro-msg'>*</span></h3>
                      <button
                        type="button"
                        onClick={addNovoTituloPreparo}
                        className="btn-add-section"
                      >
                        Adicionar Seção de Preparo
                      </button>

                      {modopreparoReceita.map((tituloPreparo, tituloIndex) => (
                        <div key={tituloPreparo.id_titulo_preparo} className="prepare-group">
                          <div className="prepare-title-container">
                            <input
                              type="text"
                              placeholder="Título do Preparo (ex: 'Preparo da massa')"
                              value={tituloPreparo.titulo_preparo}
                              onChange={(e) => {
                                const updated = [...modopreparoReceita];
                                updated[tituloIndex].titulo_preparo = e.target.value;
                                setModopreparoReceita(updated);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => addPassoPreparo(tituloIndex)}
                              className="btn-add-item"
                            >
                              + Passo
                            </button>
                          </div>

                          {tituloPreparo.modosPreparo.map((modo, index) => (
                            <div key={index} className="prepare-step">
                              <div className="step">
                                <label>{`PASSO ${index + 1}`}:</label>
                                <div className="step-content">
                                  <input
                                    type="text"
                                    placeholder="Descreva o passo"
                                    value={modo.descricao_preparo}
                                    onChange={(e) => {
                                      const updated = [...modopreparoReceita];
                                      updated[tituloIndex].modosPreparo[index].descricao_preparo = e.target.value;
                                      setModopreparoReceita(updated);
                                    }}
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePassoPreparo(tituloIndex, index)}
                                    className="btn-remove-item"
                                  >
                                    Remover
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="checkbox-section">
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="checkbox-aceito"
                    checked={receita.aceito_termo === 1}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: 'aceito_termo',
                        value: e.target.checked ? 1 : 0,
                      },
                    })}
                    required
                  />
                  <label htmlFor="checkbox">
                    Declaro que as informações fornecidas sobre a receita são verdadeiras e estou de acordo com os termos e condições do site.
                  </label>
                </div>

                <div className='group-btn'>
                  <button type="submit" className="btn-button" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </button>
                  <button type="reset" className="btn-button">
                    Limpar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
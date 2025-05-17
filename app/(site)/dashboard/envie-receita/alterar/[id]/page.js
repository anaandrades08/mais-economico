"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../../../../styles/dashboard.css";
import "../../../../styles/EnvieReceita.css";
//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function UpdateRecipe() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const [receita, setReceita] = useState([]); //carrega receitas
  const [unidades, setUnidades] = useState([]); //carrega unidades de medida
  const [todosIngredientes, setTodosIngredientes] = useState([]); //carrega ingredientes
  const [categorias, setCategorias] = useState([]); //carrega categorias da receita
  const [ingredientesReceita, setIngredientesReceita] = useState([]); //carrega ingredientes da receita
  const [modopreparoReceita, setModopreparoReceita] = useState([]); //carrega modo de preparo da receita  
  const userId = session?.user?.id;
  const userNome = session?.user?.nome;
  const recipeId = params.id;
  //chamando as funções
  useEffect(() => {
    if (session?.user) {
      const { id, nome, email } = session.user;
      console.log('Usuário logado:', id, nome, email);
      const loadData = async () => {
        fetchReceitas(recipeId);
        fetchCategorias();
        fetchIngredientes();
        fetchUnidades();
        fetchIngredientesReceita(recipeId);
        fetchMododePreparoReceita(recipeId);

      };
      loadData();
    }
  }, [session, recipeId]);

  //se sessao caiu, volta ao login
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }


  //carrega o api de receitas
  const fetchReceitas = async (recipeId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/receitas/usuario/${userId}/${recipeId}/`);

      if (!response.ok) {
        throw new Error('Erro ao carregar a receita');
      }

      const data = await response.json();
      setReceita(data.receita);
    } catch (error) {
      console.error('Erro ao buscar a receita:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //api de ingredientes da receita
  const fetchIngredientesReceita = async (recipeId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ingredientesReceita/receita/${recipeId}/`);

      if (!response.ok) {
        throw new Error('Erro ao carregar os ingredientes da receita');
      }

      const data = await response.json();
      setIngredientesReceita(data);
    } catch (error) {
      console.error('Erro ao buscar os ingredientes da receita:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //api de modo de preparo da receita
  const fetchMododePreparoReceita = async (recipeId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/modoPreparo/receita/${recipeId}/`);

      if (!response.ok) {
        throw new Error('Erro ao carregar os modos de preparo da receita');
      }

      const data = await response.json();
      setModopreparoReceita(data);
    } catch (error) {
      console.error('Erro ao buscar os modos de preparo da receita:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //api de categoria da receita
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categorias/`);

      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //api de ingredientes
  const fetchIngredientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ingredientes/`);

      if (!response.ok) {
        throw new Error('Erro ao carregar ingredientes');
      }

      const data = await response.json();
      setTodosIngredientes(data);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //api de unidade de media
  const fetchUnidades = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/unidadeMedida/`);

      if (!response.ok) {
        throw new Error('Erro ao carregar unidade de medida');
      }

      const data = await response.json();
      setUnidades(data);
    } catch (error) {
      console.error('Erro ao buscar unidade de medida:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  if (!recipeId) {
    return (
      <div className="notFound">
        <h2>Receita não encontrada</h2>
        <Link href="/dashboard/envie-receita" className="backLink">
          Voltar para receitas
        </Link>
      </div>
    );
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
      preview.src = '/icons/upload.svg'; // volta ao ícone padrão
    }
  };
  if (status === 'loading' || loading) {
    return <div className="loading">Carregando a receita...</div>;
  }

  // Função para atualizar o estado da receita
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceita((prevReceita) => ({
      ...prevReceita,
      [name]: isNaN(value) ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Primeiro atualiza os dados básicos da receita
      const formData = new FormData();
      formData.append('titulo_receita', receita.titulo_receita);
      formData.append('descricao', receita.descricao);
      // ... outros campos da receita
      
      const imageFile = document.getElementById('recipeImage').files[0];
      if (imageFile) {
        formData.append('img_receita', imageFile);
      }
  
      const responseReceita = await fetch(`/api/receitas/${recipeId}/`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!responseReceita.ok) throw new Error('Erro ao atualizar receita');
  
      // Depois atualiza os ingredientes
      const responseIngredientes = await fetch(`/api/ingredientesReceita/receita/${recipeId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredientesReceita),
      });
  
      if (!responseIngredientes.ok) throw new Error('Erro ao atualizar ingredientes');
  
      // Finalmente atualiza os modos de preparo
      const responsePreparo = await fetch(`/api/modoPreparo/receita/${recipeId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modopreparoReceita),
      });
  
      if (!responsePreparo.ok) throw new Error('Erro ao atualizar modos de preparo');
  
      router.push('/dashboard/envie-receita');
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // Função para adicionar novo título de ingrediente
  const addNovoTituloIngrediente = () => {
    setIngredientesReceita(prev => [
      ...prev,
      {
        id_titulo_ingrediente_receita: Date.now(), // ID temporário
        titulo_ingrediente_receita: '',
        ingredientes: []
      }
    ]);
  };

  // Função para adicionar ingrediente a um título específico
  const addIngrediente = (tituloIndex) => {
    setIngredientesReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].ingredientes.push({
        id_ingrediente_receita: Date.now(), // ID temporário
        quantidade: '',
        ingrediente: { id_ingrediente: '' },
        unidadeMedida: { id_uni_medida: '' }
      });
      return updated;
    });
  };

  // Função para remover ingrediente
  const removeIngrediente = (tituloIndex, ingredienteIndex) => {
    setIngredientesReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].ingredientes.splice(ingredienteIndex, 1);
      return updated;
    });
  };

  // Função para adicionar novo título de modo de preparo
  const addNovoTituloPreparo = () => {
    setModopreparoReceita(prev => [
      ...prev,
      {
        id_titulo_preparo: Date.now(), // ID temporário
        titulo_preparo: '',
        modosPreparo: []
      }
    ]);
  };

  // Função para adicionar passo de preparo
  const addPassoPreparo = (tituloIndex) => {
    setModopreparoReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].modosPreparo.push({
        id_modo_preparo: Date.now(), // ID temporário
        descricao_preparo: ''
      });
      return updated;
    });
  };

  // Função para remover passo de preparo
  const removePassoPreparo = (tituloIndex, passoIndex) => {
    setModopreparoReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].modosPreparo.splice(passoIndex, 1);
      return updated;
    });
  };

  return (
    <div className="dashboard-container">
      {/* titulo */}
      < div className="container-title" >
        <h2 className="title">Painel de Controle do Usuário</h2>
      </div >

      {/* informações básicas */}
      < div className="name-page" >
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
      </div >
      {/* menu de links */}
      < div className="container-abas" >
        <div className="abas">
          <Link href={`/dashboard/envie-receita/`} passHref><button className="aba ativa"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
          <Link href={`/dashboard/favoritos/`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
          <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
          <Link href={`/dashboard/feedback/`} passHref><button className="aba"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
        </div>
      </div>

      {/* seção do que abre receita na pagina */}
      <section className="container-send-recipe">
        <>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="receita-container">
            <h2 className='receita-container-title'>Edite sua receita</h2>
            <div className="receita-container-cinza">
              <div className="form-container">
                <form id="form_receita-alterar" method="POST" onSubmit={handleSubmit}>
                  <div className="form-top">
                    <div className="form-left">
                      <h3>Sua receita</h3>
                      <div className="image-upload">
                        <label htmlFor="recipeImage">
                          <div className="image-placeholder">
                            {receita.img_receita ? (
                              <Image
                                id="preview"
                                src={receita.img_receita}
                                alt={receita.titulo_receita}
                                width={150}
                                height={100}
                              />
                            ) : (
                              <p>Imagem não disponível</p>
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          id="recipeImage"
                          accept="image/png, image/jpeg"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
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
                      <input type="text" value={receita.custo || ''} onChange={handleInputChange} required />

                      <label>Rendimento da Receita: <span className='erro-msg'>*</span></label>
                      <input type="text" value={receita.rendimento || ''} onChange={handleInputChange} required />

                      <label>Dificuldade da Receita: <span className='erro-msg'>*</span></label>
                      <input type="text" value={receita.dificuldade || ''} onChange={handleInputChange} required />
                    </div>

                    <div className="form-right">
                      <label>Categoria da Receita: <span className='erro-msg'>*</span></label>
                      <select
                        id="categoria"
                        name="categoria"
                        value={receita.titulo_categoria || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Selecione uma categoria</option>
                        {categorias.length > 0 ? (
                          categorias.map((categoria) => (
                            <option key={categoria.id_categoria} value={categoria.nome}>
                              {categoria.nome}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>Carregando categorias...</option>
                        )}
                      </select>

                      <label>Título da Receita: <span className='erro-msg'>*</span></label>
                      <input type="text" value={receita.titulo_receita || ''} onChange={handleInputChange} />

                      <label>Descrição: <span className='erro-msg'>*</span></label>
                      <textarea value={receita.descricao_receita || ''} onChange={handleInputChange} required></textarea>

                      <label>Tempo de Preparo: <span className='erro-msg'>*</span></label>
                      <input type="text" value={receita.tempo_preparo} onChange={handleInputChange} required />
                      <label>Tempo de Preparo (minutos): <span className='erro-msg'>*</span></label>
                      <input
                        type="number"
                        value={60}
                        onChange={handleInputChange}
                        required
                        min="0"  // Impede valores negativos
                        step="1" // Garante que o tempo será incrementado/decrementado em 1 minuto
                        placeholder="Digite o tempo em minutos"
                      />

                      <label>Tempo Total de Preparo: <span className='erro-msg'>*</span></label>
                      <input type="text" value={receita.tempo_total || ''} onChange={handleInputChange} required />
                    </div>
                  </div>
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
                                Ingrediente
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
                                  />

                                  <select
                                    value={ingrediente.unidadeMedida?.id_uni_medida || ''}
                                    onChange={(e) => {
                                      const updated = [...ingredientesReceita];
                                      updated[tituloIndex].ingredientes[index].unidadeMedida.id_uni_medida = e.target.value;
                                      setIngredientesReceita(updated);
                                    }}
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
                                Passo
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
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: 'aceito_termo',
                            value: e.target.checked ? 1 : 0,
                          },
                        })
                      }
                    />
                    <label htmlFor="checkbox">
                      Declaro que as informações fornecidas sobre a receita são verdadeiras e estou de acordo com os termos e condições do site.
                    </label>
                  </div>

                  <div className='group-btn'>
                    <button type="submit" className="btn-button">Alterar</button>
                    <button type="reset" className="btn-button">Limpar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      </section>
    </div>
  );
}

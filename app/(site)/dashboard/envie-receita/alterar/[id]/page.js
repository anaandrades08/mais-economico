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

export default function UpdateRecipe() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const [receita, setReceita] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [todosIngredientes, setTodosIngredientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ingredientesReceita, setIngredientesReceita] = useState([]);
  const [modopreparoReceita, setModopreparoReceita] = useState([]);
  const userId = session?.user?.id;
  const userNome = session?.user?.nome;
  const recipeId = params.id;

  // Estado do formulário
  const [formData, setFormData] = useState({
    titulo_receita: '',
    descricao_receita: '',
    img_receita: '',
    id_categoria: '',
    tempo_total: 0,
    tempo_preparo: 0,
    rendimento: '',
    custo: 0,
    dificuldade: '',
    ativo: null,
    aceito_termo: false
  });

  // Carrega os dados iniciais
  useEffect(() => {
    if (session?.user && recipeId) {
      const loadData = async () => {
        try {
          setLoading(true);
          await Promise.all([
            fetchReceita(),
            fetchCategorias(),
            fetchIngredientes(),
            fetchUnidades(),
            fetchIngredientesReceita(),
            fetchMododePreparoReceita()
          ]);
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
          setError('Erro ao carregar dados da receita');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [session, recipeId]);

  // Se sessão caiu, volta ao login
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Carrega os dados da receita
  const fetchReceita = async () => {
    const response = await fetch(`/api/receitas/usuario/${userId}/${recipeId}/`);
    if (!response.ok) throw new Error('Erro ao carregar a receita');

    const data = await response.json();
    setReceita(data.receita);
    setFormData({
      titulo_receita: data.receita.titulo_receita,
      descricao_receita: data.receita.descricao_receita,
      img_receita: data.receita.img_receita,
      id_categoria: data.receita.id_categoria,
      tempo_total: data.receita.tempo_total,
      tempo_preparo: data.receita.tempo_preparo,
      rendimento: data.receita.rendimento,
      custo: data.receita.custo,
      dificuldade: data.receita.dificuldade,
      aceito_termo: data.receita.aceito_termo === 1,
      ativo: data.receita.aceito_termo === 1,
    });
  };

  // Carrega ingredientes da receita
  const fetchIngredientesReceita = async () => {
    const response = await fetch(`/api/ingredientesReceita/receita/${recipeId}/`);
    if (!response.ok) throw new Error('Erro ao carregar ingredientes');

    const data = await response.json();
    setIngredientesReceita(data.map(titulo => ({
      id_titulo_ingrediente_receita: titulo.id_titulo,
      titulo_ingrediente_receita: titulo.titulo,
      ingredientes: titulo.itens.map(item => ({
        id_ingrediente_receita: item.id_ingrediente_receita,
        quantidade: item.quantidade,
        ingrediente: {
          id_ingrediente: item.id_ingrediente,
          descricao_ingrediente: item.descricao_ingrediente
        },
        unidadeMedida: {
          id_uni_medida: item.id_unidade_medida,
          sigla: item.sigla
        }
      }))
    })));
  };

  // Carrega modo de preparo
  const fetchMododePreparoReceita = async () => {
    const response = await fetch(`/api/modoPreparo/receita/${recipeId}/`);
    if (!response.ok) throw new Error('Erro ao carregar modo de preparo');

    const data = await response.json();
    setModopreparoReceita(data.map(titulo => ({
      id_titulo_preparo: titulo.id_titulo_preparo,
      titulo_preparo: titulo.titulo_preparo,
      modosPreparo: titulo.modosPreparo.map(modo => ({
        id_modo_preparo: modo.id_preparo,
        descricao_preparo: modo.descricao_preparo
      }))
    })));
  };

  // Carrega categorias
  const fetchCategorias = async () => {
    const response = await fetch('/api/categorias/');
    if (!response.ok) throw new Error('Erro ao carregar categorias');
    setCategorias(await response.json());
  };

  // Carrega ingredientes
  const fetchIngredientes = async () => {
    const response = await fetch('/api/ingredientes/');
    if (!response.ok) throw new Error('Erro ao carregar ingredientes');
    setTodosIngredientes(await response.json());
  };

  // Carrega unidades de medida
  const fetchUnidades = async () => {
    const response = await fetch('/api/unidadeMedida/');
    if (!response.ok) throw new Error('Erro ao carregar unidades');
    setUnidades(await response.json());
  };

  // Manipulador de mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manipulador de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Atualiza os dados básicos da receita
      const formDataToSend = new FormData();
      formDataToSend.append('titulo_receita', formData.titulo_receita);
      formDataToSend.append('descricao_receita', formData.descricao_receita);
      formDataToSend.append('id_categoria', formData.id_categoria);
      formDataToSend.append('tempo_total', formData.tempo_total.toString());
      formDataToSend.append('tempo_preparo', formData.tempo_preparo.toString());
      formDataToSend.append('rendimento', formData.rendimento);
      formDataToSend.append('custo', formData.custo.toString());
      formDataToSend.append('dificuldade', formData.dificuldade);
      formDataToSend.append('aceito_termo', formData.aceito_termo ? '1' : '0');
      formDataToSend.append('ativo', formData.ativo ? '1' : null);

      const imageFile = document.getElementById('recipeImage').files[0];
      if (imageFile) {
        formDataToSend.append('img_receita', imageFile);
      } else if (formData.img_receita) {
        formDataToSend.append('img_receita_existente', formData.img_receita);
      }

      // Atualiza receita
      const responseReceita = await fetch(`/api/receitas/usuario/${userId}/${recipeId}/`, {
        method: 'PUT',
        body: formDataToSend
      });
      if (!responseReceita.ok) throw new Error('Erro ao atualizar receita');

      // Atualiza ingredientes
      const ingredientesData = ingredientesReceita.map(titulo => ({
        id_titulo: titulo.id_titulo_ingrediente_receita,
        titulo: titulo.titulo_ingrediente_receita,
        itens: titulo.ingredientes.map(ing => ({
          id_ingrediente_receita: ing.id_ingrediente_receita,
          id_ingrediente: ing.ingrediente.id_ingrediente,
          quantidade: ing.quantidade,
          id_unidade_medida: ing.unidadeMedida.id_uni_medida
        }))
      }));

      const responseIngredientes = await fetch(`/api/ingredientesReceita/receita/${recipeId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredientesData)
      });
      if (!responseIngredientes.ok) throw new Error('Erro ao atualizar ingredientes');

      // Atualiza modo de preparo
      const preparoData = modopreparoReceita.map(titulo => ({
        id_titulo: titulo.id_titulo_preparo,
        titulo: titulo.titulo_preparo,
        passos: titulo.modosPreparo.map(passo => ({
          id_preparo: passo.id_modo_preparo,
          descricao: passo.descricao_preparo
        }))
      }));

      const responsePreparo = await fetch(`/api/modoPreparo/receita/${recipeId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparoData)
      });
      if (!responsePreparo.ok) throw new Error('Erro ao atualizar modo de preparo');

      router.push('/dashboard/envie-receita');
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funções para manipular ingredientes
  const addNovoTituloIngrediente = () => {
    setIngredientesReceita(prev => [
      ...prev,
      {
        id_titulo_ingrediente_receita: Date.now(),
        titulo_ingrediente_receita: '',
        ingredientes: []
      }
    ]);
  };

  const addIngrediente = (tituloIndex) => {
    setIngredientesReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].ingredientes.push({
        id_ingrediente_receita: Date.now(),
        quantidade: '',
        ingrediente: { id_ingrediente: '', descricao_ingrediente: '' },
        unidadeMedida: { id_uni_medida: '', sigla: '' }
      });
      return updated;
    });
  };

  const removeIngrediente = (tituloIndex, ingredienteIndex) => {
    setIngredientesReceita(prev => {
      const updated = [...prev];
      updated[tituloIndex].ingredientes.splice(ingredienteIndex, 1);
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
        modosPreparo: []
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
      return updated;
    });
  };

  // Manipulador de mudança de imagem
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else if (formData.img_receita) {
      preview.src = formData.img_receita;
    } else {
      preview.src = '/icons/upload.svg';
    }
  };

  // Estados de carregamento
  if (status === 'loading' || loading) {
    return <div className="loading">Carregando a receita...</div>;
  }

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

  if (!receita) {
    return <div className="loading">Carregando dados da receita...</div>;
  }

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

      {/* Formulário de edição */}
      <section className="container-send-recipe">
        {error && <div className="error-message">{error}</div>}

        <div className="receita-container">
          <h2 className='receita-container-title'>Edite sua receita</h2>
          <div className="receita-container-cinza">
            <div className="form-container">
              <form id="form_receita-alterar" onSubmit={handleSubmit}>
                <div className="form-top">
                  <div className="form-left">
                    <h3>Sua receita</h3>
                    <div className="image-upload">
                      <label htmlFor="recipeImage">
                        <div className="image-placeholder">
                          <Image
                            id="preview"
                            src={formData.img_receita || '/icons/upload.svg'}
                            alt={formData.titulo_receita}
                            width={150}
                            height={100}
                          />
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
                    <input
                      type="text"
                      name="custo"
                      value={formData.custo}
                      onChange={handleInputChange}
                      required
                    />

                    <label>Rendimento da Receita: <span className='erro-msg'>*</span></label>
                    <input
                      type="text"
                      name="rendimento"
                      value={formData.rendimento}
                      onChange={handleInputChange}
                      required
                    />

                    <label>Dificuldade da Receita: <span className='erro-msg'>*</span></label>
                    <select
                      name="dificuldade"
                      value={formData.dificuldade}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione a dificuldade</option>
                      <option value="Fácil">Fácil</option>
                      <option value="Média">Média</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>

                  <div className="form-right">
                    <label>Categoria da Receita: <span className='erro-msg'>*</span></label>
                    <select
                      name="id_categoria"
                      value={formData.id_categoria}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id_categoria} value={categoria.id_categoria}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>

                    <label>Título da Receita: <span className='erro-msg'>*</span></label>
                    <input
                      type="text"
                      name="titulo_receita"
                      value={formData.titulo_receita}
                      onChange={handleInputChange}
                      required
                    />

                    <label>Descrição: <span className='erro-msg'>*</span></label>
                    <textarea
                      name="descricao_receita"
                      value={formData.descricao_receita}
                      onChange={handleInputChange}
                      required
                    ></textarea>

                    <label>Tempo de Preparo (minutos): <span className='erro-msg'>*</span></label>
                    <input
                      type="number"
                      name="tempo_preparo"
                      value={formData.tempo_preparo}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1"
                      placeholder="Digite o tempo em minutos"
                    />

                    <label>Tempo Total de Preparo (minutos): <span className='erro-msg'>*</span></label>
                    <input
                      type="number"
                      name="tempo_total"
                      value={formData.tempo_total}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1"
                      placeholder="Digite o tempo em minutos"
                    />
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
                                  value={ingrediente.ingrediente.id_ingrediente}
                                  onChange={(e) => {
                                    const updated = [...ingredientesReceita];
                                    const selectedIngrediente = todosIngredientes
                                      .flatMap(tipo => tipo.ingredientes)
                                      .find(ing => ing.id_ingrediente.toString() === e.target.value);

                                    updated[tituloIndex].ingredientes[index].ingrediente = {
                                      id_ingrediente: e.target.value,
                                      descricao_ingrediente: selectedIngrediente?.descricao_ingrediente || ''
                                    };
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
                                  value={ingrediente.unidadeMedida.id_uni_medida}
                                  onChange={(e) => {
                                    const updated = [...ingredientesReceita];
                                    const selectedUnidade = unidades.find(u => u.id_uni_medida.toString() === e.target.value);

                                    updated[tituloIndex].ingredientes[index].unidadeMedida = {
                                      id_uni_medida: e.target.value,
                                      sigla: selectedUnidade?.sigla || ''
                                    };
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
                    checked={formData.aceito_termo}
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
                  <button type="submit" className="btn-button" disabled={loading}>
                    {loading ? 'Salvando...' : 'Alterar'}
                  </button>
                  <button type="reset" className="btn-button">Limpar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

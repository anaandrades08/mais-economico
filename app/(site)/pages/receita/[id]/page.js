"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "../../../styles/RecipeDetail.css";
import MaisReceitasComponente from "../../../components/MaisReceita";
import RecipeBanner from "../../../components/RecipeBanner";
import StarRating from "../../../components/StarRating";
import { PiUserCircleFill } from "react-icons/pi";
import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { TbReplaceFilled } from "react-icons/tb";
import { FaEquals } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { FaUtensils } from "react-icons/fa";
export default function RecipeDetail() {
  const params = useParams();
  const { data: session, status } = useSession();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [original, setOriginal] = useState("");
  const [substituto, setSubstituto] = useState("");
  const [valorOriginal, setValorOriginal] = useState(0);
  const [valorSubstituto, setValorSubstituto] = useState(0);
  const [diferenca, setDiferenca] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const recipeId = parseInt(params.id);
  const userId = session?.user?.id;
  //substitutos
  const [ingredientesReceita, setIngredientesReceita] = useState([]);
  const [tiposIngredientes, setTiposIngredientes] = useState(null);
  const [tipoIngredienteOriginal, setTipoIngredienteOriginal] = useState(null);
  const [ingredienteOriginalSelecionado, setIngredienteOriginalSelecionado] =
    useState(null);
  const [
    ingredienteSubstitutoSelecionado,
    setIngredienteSubstitutoSelecionado,
  ] = useState(null);
  //enviar feedback
  const [comentario, setComentario] = useState("");
  const [estrelas, setEstrelas] = useState(0);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const handleSalvarSubstituicao = async () => {
    try {
      if (!session) {
        throw new Error("Você precisa estar logado para salvar substituições");
      }

      if (
        !ingredienteOriginalSelecionado ||
        !ingredienteSubstitutoSelecionado ||
        diferenca === null
      ) {
        throw new Error("Complete a comparação antes de salvar");
      }

      // Verifica se o ingrediente substituto tem unidade de medida
      if (!ingredienteSubstitutoSelecionado.id_uni_medida) {
        throw new Error(
          "Ingrediente substituto não possui unidade de medida definida"
        );
      }

      const response = await fetch(
        `/api/ingredientesSubstituicao/receita/${recipeId}/${session.user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_ingrediente: ingredienteSubstitutoSelecionado.id_ingrediente,
            id_usuario: userId,
            quantidade: ingredienteSubstitutoSelecionado.quantidadeEquivalente,
            id_uni_medida: ingredienteSubstitutoSelecionado.id_uni_medida,
            ativo: null,
            descricao_preparo: `Substituição de ${ingredienteOriginalSelecionado.descricao_ingrediente} (${ingredienteOriginalSelecionado.quantidade}${ingredienteOriginalSelecionado.unidade}) por ${ingredienteSubstitutoSelecionado.descricao_ingrediente} (${ingredienteSubstitutoSelecionado.quantidadeEquivalente.toFixed(2)}${ingredienteSubstitutoSelecionado.unidade}) - Diferença: R$${Math.abs(diferenca).toFixed(2)}`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Erro ao salvar substituição"
        );
      }

      const data = await response.json();

      // Atualiza a lista de substituições da receita
      /*setRecipe((prev) => ({
        ...prev,
        substituicoes: [
          ...prev.substituicoes,
          {
            id_substituicao: data.id_substituicao,
            descricao_preparo: data.descricao_preparo,
            quantidade: data.quantidade,
            ativo: 1,
            id_ingrediente: ingredienteSubstitutoSelecionado.id_ingrediente,
            id_tipo_ingrediente:
              ingredienteSubstitutoSelecionado.id_tipo_ingrediente,
            descricao_ingrediente:
              ingredienteSubstitutoSelecionado.descricao_ingrediente,
            id_uni_medida: ingredienteSubstitutoSelecionado.id_uni_medida,
            unidade_medida:
              ingredienteSubstitutoSelecionado.unidadeMedida?.unidade_medida,
            sigla: ingredienteSubstitutoSelecionado.unidadeMedida?.sigla,
            usuario: session.user.name,
          },
        ],
      }));*/

      alert("Substituição salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar substituição:", error);
      alert(error.message);
    }
  };
  const handleCalcular = () => {
    try {
      // 1. Validação inicial
      if (!original || !substituto) {
        throw new Error("Selecione ambos os ingredientes para comparação");
      }

      // 2. Função auxiliar para extrair números de forma segura
      const parseSafe = (value) => {
        if (value === null || value === undefined) return NaN;
        const str = String(value)
          .replace(/[^\d,.-]/g, "")
          .replace(",", ".");
        return parseFloat(str) || NaN;
      };

      // 3. Encontrar os ingredientes selecionados
      const ingredienteOriginal = ingredientesReceita
        .flatMap((grupo) => grupo.itens)
        .find((ing) => ing.id_ingrediente?.toString() === original.toString());

      const ingredienteSubstituto = tiposIngredientes
        .flatMap((tipo) => tipo.ingredientes)
        .find(
          (ing) => ing.id_ingrediente?.toString() === substituto.toString()
        );

      if (!ingredienteOriginal || !ingredienteSubstituto) {
        throw new Error("Ingrediente não encontrado");
      }

      // 4. Verificar compatibilidade de tipos
      if (
        ingredienteOriginal.id_tipo_ingrediente !==
        ingredienteSubstituto.id_tipo_ingrediente
      ) {
        const tipoOriginal =
          tiposIngredientes.find(
            (t) =>
              t.id_tipo_ingrediente === ingredienteOriginal.id_tipo_ingrediente
          )?.tipo_ingrediente || "Desconhecido";
        const tipoSubstituto =
          tiposIngredientes.find(
            (t) =>
              t.id_tipo_ingrediente ===
              ingredienteSubstituto.id_tipo_ingrediente
          )?.tipo_ingrediente || "Desconhecido";
        throw new Error(
          `Tipos incompatíveis: "${tipoOriginal}" não pode ser substituído por "${tipoSubstituto}"`
        );
      }

      // 5. Extrair valores com tratamento seguro
      const qtdOriginal = parseSafe(ingredienteOriginal.quantidade);
      const unidadeOriginal =
        ingredienteOriginal.unidade?.toLowerCase() || "un";
      const valorUnitarioOriginal = parseSafe(ingredienteOriginal.valor);

      const qtdSubstituto = parseSafe(ingredienteSubstituto.quantidade) || 1;
      const unidadeSubstituto =
        ingredienteSubstituto.unidadeMedida?.sigla?.toLowerCase() || "un";
      const valorUnitarioSubstituto = parseSafe(ingredienteSubstituto.valor);

      // 6. Tabela de conversão de unidades
      const conversoes = {
        // Massa
        "g-kg": 0.001,
        "kg-g": 1000,
        "mg-g": 0.001,
        "g-mg": 1000,
        "kg-mg": 1000000,
        "mg-kg": 0.000001,

        // Volume
        "ml-l": 0.001,
        "l-ml": 1000,

        // Colheres
        "cs-ml": 15,
        "ml-cs": 1 / 15,
        "l-cs": 1000 / 15,
        "cs-l": 15 / 1000,
        "cc-ml": 5,
        "ml-cc": 1 / 5,
        "l-cc": 1000 / 5,
        "cc-l": 5 / 1000,

        // Xícara
        "xícara-ml": 240,
        "ml-xícara": 1 / 240,
        "xícara-l": 0.24,
        "l-xícara": 1000 / 240,

        // Copo
        "copo-ml": 200,
        "ml-copo": 1 / 200,
        "copo-l": 0.2,
        "l-copo": 5,

        // Outros
        "pitada-g": 0.5,
        "g-pitada": 2,
        "un-g": 50,
        "g-un": 1 / 50,
        "dente-g": 5,
        "g-dente": 1 / 5,
        "tablete-g": 100,
        "g-tablete": 1 / 100,
        "lata-ml": 395,
        "ml-lata": 1 / 395,
        "pct-g": 500,
        "g-pct": 1 / 500,
        "folha-g": 1,
        "g-folha": 1,
        "ramo-g": 5,
        "g-ramo": 1 / 5,
        "fatia-g": 25,
        "g-fatia": 1 / 25,
        "punhado-g": 20,
        "g-punhado": 1 / 20,
      };

      // 7. Calcular fator de conversão
      const chaveConversao = `${unidadeOriginal}-${unidadeSubstituto}`;
      let fatorConversao = conversoes[chaveConversao] ?? 1;

      if (fatorConversao === undefined) {
        console.warn(
          `Conversão não definida de ${unidadeOriginal} para ${unidadeSubstituto}`
        );
        fatorConversao = 1;
      }

      // 8. Cálculos finais
      const valorTotalOriginal = qtdOriginal * valorUnitarioOriginal;
      const qtdEquivalente = (qtdOriginal * fatorConversao) / qtdSubstituto;
      const valorTotalSubstituto = qtdEquivalente * valorUnitarioSubstituto;
      const diferenca = parseFloat(
        (valorTotalOriginal - valorTotalSubstituto).toFixed(2)
      );

      // 9. Atualizar estados
      setValorOriginal(valorTotalOriginal);
      setValorSubstituto(valorTotalSubstituto);
      setDiferenca(diferenca);
      setIngredienteOriginalSelecionado({
        ...ingredienteOriginal,
        quantidade: qtdOriginal,
        unidade: unidadeOriginal,
      });
      setIngredienteSubstitutoSelecionado({
        ...ingredienteSubstituto,
        // Campos obrigatórios com fallback
        id_ingrediente: ingredienteSubstituto.id_ingrediente || 0,
        id_tipo_ingrediente: ingredienteSubstituto.id_tipo_ingrediente || 0,
        descricao_ingrediente: ingredienteSubstituto.descricao_ingrediente || 'Ingrediente Desconhecido',

        // Campos calculados
        quantidadeEquivalente: qtdEquivalente,
        quantidadeOriginal: qtdSubstituto,

        // Unidades de medida (garantindo que existam)
        unidade: unidadeSubstituto || 'un',
        id_uni_medida: ingredienteSubstituto.id_uni_medida || 1, // 1 = unidade padrão no banco
        unidadeMedida: {
          ...(ingredienteSubstituto.unidadeMedida || {
            id_uni_medida: 1,
            unidade_medida: 'Unidade',
            sigla: 'un'
          }),
          sigla: unidadeSubstituto || (ingredienteSubstituto.unidadeMedida?.sigla || 'un')
        },

        // Valor unitário (importante para cálculos)
        valor: ingredienteSubstituto.valor || 0
      });
      setError(null);

      // 10. Retornar resultado (opcional)
      return {
        original: {
          ...ingredienteOriginal,
          valorTotal: valorTotalOriginal,
          quantidade: qtdOriginal,
          unidade: unidadeOriginal,
        },
        substituto: {
          ...ingredienteSubstituto,
          valorTotal: valorTotalSubstituto,
          quantidadeEquivalente: qtdEquivalente,
          unidade: unidadeSubstituto,
          quantidadeOriginal: qtdSubstituto,
        },
        diferenca,
        proporcao: {
          fatorConversao,
          unidadeOriginal,
          unidadeSubstituto,
        },
      };
    } catch (error) {
      console.error("Erro no cálculo:", error);
      setError(error.message);
      setDiferenca(null);
      return null;
    }
  };
  useEffect(() => {
    const rId = parseInt(recipeId);

    if (isNaN(rId) || rId <= 0) {
      setError("ID de receita inválido");
      setLoading(false);
      return;
    }
    const fetchRecipe = async () => {
      try {
        if (!recipeId || recipeId <= 0) {
          throw new Error("ID de receita inválido");
        }

        const response = await fetch(
          `/api/receitas/receitas-ativas/${recipeId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao buscar receita");
        }
        const data = await response.json();
        // Verificação dos dados
        if (!data || !data.receita) {
          throw new Error("Receita não encontrada");
        }
        const recipeData = data.receita;
        // Formata os dados
        const formattedRecipe = {
          idReceita: recipeData.id_receita,
          titulo: recipeData.titulo_receita,
          descricao: recipeData.descricao_receita,
          rendimento: recipeData.rendimento,
          custo: recipeData.custo,
          preparo: recipeData.tempo_preparo,
          tempo: recipeData.tempo_total,
          img_receita: recipeData.img_receita,
          dificuldade: recipeData.dificuldade,
          categoria: recipeData.titulo_categoria,
          usuario: recipeData.usuario,
          media_avaliacoes: recipeData.media_avaliacoes,
          total_avaliacoes: recipeData.total_avaliacoes,

          ingredientes: recipeData.titulos_ingredientes.map((ti) => ({
            titulo: ti.titulo_ingrediente_receita,
            itens: ti.ingredientes.map((ing) => ({
              id: ing.id_ingrediente_receita,
              id_ingrediente: ing.id_ingrediente,
              id_uni_medida: ing.id_uni_medida,              
              id_tipo_ingrediente: ing.id_tipo_ingrediente,
              quantidade: ing.quantidade,
              qtdeTotal: ing.qtdeTotal,
              uniTotal: ing.iduniTotal,
              ingrediente: ing.descricao_ingrediente,
              valor: ing.valor,
              unidade: ing.sigla,
            })),
          })),

          mododepreparo: recipeData.titulos_preparo.map((tp) => ({
            titulo: tp.titulo_preparo,
            passos: tp.modos_preparo.map((mp) => ({
              id: mp.id_preparo,
              descricao: mp.descricao_preparo,
            })),
          })),

          feedbacks: recipeData.feedbacks.map((fb) => ({
            id: fb.id_feedback,
            id_usuario: fb.id_usuario,
            estrelas: fb.total_estrela,
            ativo: fb.ativo,
            usuario: fb.usuario,
            comentario: fb.feedback,
            data_cadastro: fb.data_cadastro,
          })),

          substituicoes: recipeData.substituicoes.map((sub) => ({
            id_substituicao: sub.id_substituicao,
            descricao_preparo: sub.descricao_preparo,
            quantidade: sub.quantidade,
            ativo: sub.ativo,
            data_cadastro: sub.data_cadastro,
            id_ingrediente: sub.id_ingrediente,
            id_usuario: sub.id_usuario,
            id_uni_medida: sub.id_uni_medida,
            id_tipo_ingrediente: sub.id_tipo_ingrediente,
            descricao_ingrediente: sub.descricao_ingrediente,
            unidade_medida: sub.unidade_medida,
            sigla: sub.sigla,
            usuario: sub.usuario,
          })),
          // Favoritos
          favoritos: recipeData.favoritos.map((fr) => ({
            id_favorito: fr.id_favorito,
            id_usuario: fr.id_usuario,
            data_cadastro: fr.data_cadastro,
          })),
        };
        setRecipe(formattedRecipe);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar receita:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    const fetchIngredientesReceita = async () => {
      try {
        const response = await fetch(
          `/api/ingredientesReceita/receita/${recipeId}`
        );
        const data = await response.json();
        if (response.ok) {
          if (data.length === 0) {
            setError("Nenhum ingredientee da receita encontrado");
            setIngredientesReceita([]);
          } else {
            setIngredientesReceita(data);
            setError(null);
          }
        } else {
          const errorData = await response.json();
          setError(
            errorData.error || "Erro ao carregar ingredientes da receita"
          );
          setIngredientesReceita([]);
        }
      } catch (error) {
        setError("Erro ao tentar carregar ingredientes da receita");
        console.error("Erro na requisição:", error);
        setIngredientesReceita([]);
      }
    };
    const fetchTiposIngredientes = async () => {
      try {
        const response = await fetch("/api/ingredientes");
        const data = await response.json();

        if (response.ok) {
          if (data.length === 0) {
            setError("Nenhum tipo de ingrediente encontrado");
            setTiposIngredientes([]);
          } else {
            setTiposIngredientes(data);
            setError(null);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Erro ao carregar tipos de ingredientes");
          setTiposIngredientes([]);
        }
      } catch (error) {
        setError("Erro ao tentar carregar tipos de ingredientes");
        console.error("Erro na requisição:", error);
        setTiposIngredientes([]);
      }
    };
    if (recipeId) {
      fetchIngredientesReceita();
      fetchTiposIngredientes();
      fetchRecipe();
    }
  }, [recipeId]);

  const handleEnviarFeedback = async () => {
    console.log("====== INÍCIO DO ENVIO DE FEEDBACK ======");

    if (!session) {
      console.log("[BLOQUEADO] Usuário não logado:", {
        session,
        timestamp: new Date().toISOString(),
      });
      setMensagemErro("Você precisa estar logado para enviar feedback.");
      return;
    }

    console.log("[DADOS DO FEEDBACK]", {
      estrelas,
      comentario: comentario.trim(),
      recipeId,
      userId,
      timestamp: new Date().toISOString(),
      session: session.user, // (opcional) dados relevantes da sessão
    });

    if (estrelas <= 0 || !estrelas) {
      setMensagemErro("Avalie a receita.");
      return;
    }
    if (comentario.trim() === "" || !comentario) {
      setMensagemErro("Preencha o comentário do feedback");
      return;
    }

    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_receita: recipeId,
          id_usuario: userId,
          feedback: comentario,
          total_estrela: estrelas,
        }),
      });

      console.log("Resposta recebida:", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Erro detalhado:", errorData);
        throw new Error(errorData?.message || "Erro ao enviar feedback.");
      }

      const novoFeedback = await response.json();
      setFeedbacks((prev) => [...prev, novoFeedback]);
      setComentario("");
      setEstrelas(0);
      setMensagemSucesso("Feedback enviado com sucesso!");
      setMensagemErro("");
    } catch (err) {
      console.error("Erro capturado:", err);
      setMensagemErro(err.message);
      setMensagemSucesso("");
    }
  };

  if (loading) {
    return <div className="loading">Carregando dados da receita...</div>;
  }
  function hasUserCommented(userId, feedbacks) {
    if (!feedbacks || !Array.isArray(feedbacks)) return false;
    return feedbacks.some((fb) => fb.id_usuario === Number(userId));
  }
  function formataData(data) {
    if (!data) return "Data não informada";

    const dataObj = new Date(data);

    if (isNaN(dataObj.getTime())) return "Data inválida";

    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  function formatMinutesToHours(minutes) {
    if (!minutes && minutes !== 0) return "Não informado";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  }

  if (error) {
    return (
      <div className="notFound">
        <h2>{error}</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="notFound">
        <h2>Receita não encontrada!</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  // Ordena feedbacks (simulação - pode ser substituído por dados reais da API)
  const ultimosFeedbacks = [...feedbacks]
    .sort((a, b) => new Date(b.datacadastro) - new Date(a.datacadastro))
    .slice(0, 3);

  return (
    <>
      <RecipeBanner recipe={recipe} />
      <div className="recipeContainer">
        <div className="recipeContentTwoColumns">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              {error.includes("Tipos incompatíveis") && (
                <p className="error-detail">
                  Dica: Selecione um substituto do mesmo tipo que o ingrediente
                  original
                </p>
              )}
            </div>
          )}
          {/* Primeira Coluna */}
          <div className="column">
            {/* Descrição */}
            <div className="descricaoContainer">
              {recipe.descricao ? (
                <>
                  <h2 className="sectionTitle">DESCRIÇÃO</h2>
                  <div className="recipeDescription">
                    <p>{recipe.descricao}</p>
                  </div>
                </>
              ) : (
                <p className="semDescricao">
                  Essa receita ainda não tem descrição 😕
                </p>
              )}
            </div>

            {/* Rendimento */}
            <div className="rendimentoContainer">
              <h2 className="sectionTitle">RENDIMENTO</h2>
              {recipe.rendimento ? (
                <>
                  <div className="detailInline">
                    <p className="detailIcon">
                      <FaUtensils size={19} className="IconContainer" />
                    </p>
                    <p className="custoLabel">Rende:</p>
                    <p>{recipe.rendimento}</p>
                  </div>
                </>
              ) : (
                <p className="semDescricao">Não especificado</p>
              )}
            </div>

            {/* Ingredientes */}
            <div className="ingredientesContainer">
              <h2 className="sectionTitle">INGREDIENTES</h2>
              {recipe.ingredientes?.length > 0 ? (
                recipe.ingredientes.map((grupo, grupoIndex) => (
                  <div key={grupoIndex}>
                    {grupo.titulo && <h3>{grupo.titulo}</h3>}
                    <ul>
                      {grupo.itens?.length > 0 ? (
                        grupo.itens.map((ingrediente, index) => (
                          <li key={index}>
                            • {ingrediente.quantidade} {ingrediente.unidade} de{" "}
                            {ingrediente.ingrediente}
                          </li>
                        ))
                      ) : (
                        <p className="semDescricao">
                          Nenhum ingrediente nesta seção
                        </p>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="semDescricao">
                  Essa receita ainda não tem ingredientes 😕
                </p>
              )}
            </div>

            {/* Substituições Realizadas*/}
            <div className="substituicoesContainer">
              <h2 className="sectionTitle">SUBSTITUIÇÕES REALIZADAS</h2>
              {recipe.substituicoes?.filter(sub => sub.ativo)?.length > 0 ? (
                <ul>
                  {recipe.substituicoes
                    .filter(sub => sub.ativo === 1)
                    .map((sub, index) => (
                      <li key={index}>
                        <p>
                          <span>
                            {index + 1}.{" "}
                          </span>
                          {sub.descricao_preparo} - (sugerido por {sub.usuario})
                        </p>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="semDescricao">
                  Essa receita ainda não tem substituições 😕
                </p>
              )}
            </div>
          </div>

          {/* Segunda Coluna */}
          <div className="column">
            {/* Custo */}
            <div className="custoContainer">
              <h2 className="sectionTitle">CUSTO DA RECEITA</h2>
              {recipe.custo ? (
                <>
                  <div className="detailInline">
                    <p className="detailIcon">
                      <TbCoin size={23} className="IconContainer" alt="Custo" />
                    </p>
                    <p className="custoLabel">Custo:</p>
                    <p className="custoValor">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(recipe.custo)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="semDescricao">
                  Essa receita ainda não tem custo 😕
                </p>
              )}
            </div>
            {/* Modo de Preparo */}
            <div className="preparoContainer">
              <h2 className="sectionTitle">MODO DE PREPARO</h2>
              <div className="detailInline">
                <p className="detailIcon">
                  <TbCalendarTime size={20} className="IconContainer" />
                </p>
                <p className="custoLabel">Tempo de Preparo:</p>
                <p className="custoValor">
                  {formatMinutesToHours(recipe.tempo)}
                </p>
              </div>
              <div className="detailInline">
                <p className="detailIcon">
                  <FaRegClock size={20} className="IconContainer" />
                </p>
                <p className="custoLabel">Tempo de cozimento:</p>
                <p className="custoValor">
                  {formatMinutesToHours(recipe.preparo)}
                </p>
              </div>

              {recipe.mododepreparo?.length > 0 ? (
                recipe.mododepreparo.map((grupo, grupoIndex) => (
                  <div key={grupoIndex}>
                    {grupo.titulo && (
                      <h3>{grupo.titulo || `Etapa ${grupoIndex + 1}`}</h3>
                    )}
                    <ul>
                      {grupo.passos?.length > 0 ? (
                        grupo.passos.map((passo, passoIndex) => (
                          <li key={passoIndex}>
                            <span>
                              {passoIndex + 1 < 10
                                ? `0${passoIndex + 1}`
                                : passoIndex + 1}
                              .{" "}
                            </span>
                            {passo.descricao}
                          </li>
                        ))
                      ) : (
                        <p className="semDescricao">Nenhum passo nesta seção</p>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="semDescricao">
                  Essa receita ainda não tem modo de preparo 😕
                </p>
              )}
            </div>

            {/* Substituições */}
            <div className="substituicoesContainer">
              <h2 className="sectionTitle">SUBSTITUIÇÃO DE INGREDIENTES</h2>

              {recipe.ingredientes?.length > 0 ? (
                <>
                  {/* Formulário de substituição */}
                  <div>
                    {/* Select para ingrediente original */}
                    <div>
                      <select
                        id="ingrediente-original"
                        className="SelectAlimento"
                        value={original}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedIngredient = ingredientesReceita
                            .flatMap((grupo) => grupo.itens)
                            .find(
                              (ing) =>
                                ing.id_ingrediente.toString() === selectedId
                            );

                          setOriginal(selectedId);
                          setIngredienteOriginalSelecionado(selectedIngredient);
                          setValorOriginal(
                            parseFloat(selectedIngredient?.valor) || 0
                          );
                          setTipoIngredienteOriginal(
                            selectedIngredient?.id_tipo_ingrediente || null
                          );
                        }}
                        aria-label="Selecione o ingrediente original"
                      >
                        <option value="">🍴 Ingrediente original</option>
                        {ingredientesReceita?.map((grupo) => (
                          <optgroup key={grupo.titulo} label={grupo.titulo}>
                            {grupo?.itens?.map((ingrediente) => (
                              <option
                                key={`ing-${ingrediente.id_ingrediente || null}`}
                                value={ingrediente.id_ingrediente || null}
                                data-valor={ingrediente.valor || 0}
                              >
                                🍴{" "}
                                {ingrediente.descricao_ingrediente ||
                                  "Desconhecido"}{" "}
                                ({ingrediente.quantidade || 0}
                                {ingrediente.sigla || "un"})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Botão de substituição */}
                    <div>
                      <button
                        className="btnRplace"
                        onClick={handleCalcular}
                        aria-label="Calcular substituição"
                        disabled={!original || !substituto}
                      >
                        <TbReplaceFilled size={24} aria-hidden="true" />
                      </button>
                    </div>
                    {/* Select para ingrediente substituto */}
                    <div>
                      <select
                        id="ingrediente-substituto"
                        className="SelectSubtistuicao"
                        value={substituto}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedIngredient = tiposIngredientes
                            .flatMap((tipo) => tipo.ingredientes)
                            .find(
                              (ing) =>
                                ing.id_ingrediente.toString() === selectedId
                            );

                          if (selectedIngredient) {
                            setSubstituto(selectedId);
                            setIngredienteSubstitutoSelecionado({
                              ...selectedIngredient,
                              unidadeMedida:
                                selectedIngredient.unidadeMedida || {
                                  id_uni_medida: 0,
                                  unidade_medida: "Não definida",
                                  sigla: "un",
                                },
                              quantidadeOriginal:
                                selectedIngredient.quantidade || 1,
                              quantidadeEquivalente: 0, // Será calculado no handleCalcular
                            });
                          }
                        }}
                        aria-label="Selecione o ingrediente substituto"
                      >
                        <option value="">🍴 Ingrediente Substituto</option>
                        {original &&
                          tiposIngredientes?.map((tipo) =>
                            tipo.id_tipo_ingrediente ===
                              tipoIngredienteOriginal ? (
                              <optgroup
                                key={tipo.id_tipo_ingrediente}
                                label={tipo.tipo_ingrediente}
                              >
                                {tipo.ingredientes.map((ingrediente) => (
                                  <option
                                    key={`sub-${ingrediente.id_ingrediente}`}
                                    value={ingrediente.id_ingrediente}
                                    data-valor={
                                      parseFloat(ingrediente.valor) || 0
                                    }
                                  >
                                    🍴{" "}
                                    {ingrediente.descricao_ingrediente ||
                                      "Desconhecido"}
                                  </option>
                                ))}
                              </optgroup>
                            ) : (
                              []
                            )
                          )}
                      </select>
                      <span className="Icon">
                        <FaEquals size={18} alt="retorna resultado " />
                      </span>
                    </div>
                  </div>
                  {/* Resultado da comparação */}
                  <div className="comparison-result">
                    {ingredienteOriginalSelecionado && (
                      <div className="ingredient-card original">
                        <h4>Original</h4>
                        <p>
                          {ingredienteOriginalSelecionado.quantidade}{" "}
                          {ingredienteOriginalSelecionado.sigla} de{" "}
                          {ingredienteOriginalSelecionado.descricao_ingrediente}
                        </p>
                        <p>Valor: R${valorOriginal.toFixed(2)}</p>
                      </div>
                    )}

                    {ingredienteSubstitutoSelecionado && (
                      <div className="ingredient-card substitute">
                        <h4>Substituto</h4>
                        <p>
                          {diferenca !== null &&
                            `Equivalente a ${(ingredienteSubstitutoSelecionado.quantidadeEquivalente * ingredienteSubstitutoSelecionado.quantidadeOriginal).toFixed(2)} ${ingredienteSubstitutoSelecionado.unidade}`}
                        </p>
                        <p>Valor: R${valorSubstituto.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="valor">
                      {diferenca !== null && (
                        <div
                          className={`difference ${diferenca > 0 ? "saving" : "loss"}`}
                        >
                          {diferenca > 0 ? (
                            <p className="economy-message">
                              <span className="iconGreen">✔</span>
                              Economia de R$ {Math.abs(diferenca).toFixed(2)}
                            </p>
                          ) : diferenca === 0 ? (
                            <p className="equal-message">
                              <span className="iconYellow">=</span>
                              Não há diferença no custo
                            </p>
                          ) : (
                            <p className="loss-message">
                              <span className="iconRed">✖</span>
                              Custo adicional de R$
                              {Math.abs(diferenca).toFixed(2)}
                            </p>
                          )}
                          {diferenca > 0 &&
                            ingredienteOriginalSelecionado &&
                            ingredienteSubstitutoSelecionado && (
                              <button
                                onClick={handleSalvarSubstituicao}
                                className="btn-salvar-substituicao"
                                disabled={!diferenca}
                              >
                                Salvar Substituição
                              </button>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p>
                  Essa receita ainda não tem ingredientes para substituir 😕
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="reciperecommendations">
          <h3>Feedbacks dos Usuários</h3>
          {!userId && (
            <p>
              Você possui algum feedback de receita?{" "}
              <Link href="/login" className="reciperecommendationsLink">
                Faça login
              </Link>{" "}
              e escreva para gente.
            </p>
          )}
          <div className="recommendations-itens">
            <div className="recommendations-columns">
              {userId && !hasUserCommented(userId, recipe.feedbacks) && (
                <div className="recommendation-form">
                  <form id="recomendacoes-form">
                    <div className="rating-label">
                      <span>
                        <StarRating
                          totalStars={5}
                          value={estrelas}
                          onChange={(newRating) => setEstrelas(newRating)}
                          readonly={false} // Adicione explicitamente a prop readonly
                          showText={true} //exibe texto
                        />
                      </span>
                    </div>
                    <div className="recommendation-form-text">
                      <textarea
                        placeholder="Escreva aqui seu feedback..."
                        id="comentario"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                      />
                      <p>
                        Por gentileza, avalie essa receita e deixe seu
                        comentário.
                      </p>
                    </div>
                    <div className="recommendation-form-button">
                      <button onClick={handleEnviarFeedback}>
                        Enviar Feddback
                      </button>
                    </div>
                    {mensagemSucesso && (
                      <p className="mensagemSucesso">{mensagemSucesso}</p>
                    )}
                    {mensagemErro && (
                      <p className="mensagemErro">{mensagemErro}</p>
                    )}
                  </form>
                </div>
              )}

              <div className="recommendation-feedbacks">
                <div className="rating-label">
                  <span>
                    <StarRating
                      totalStars={5}
                      value={recipe.media_avaliacoes} // Use 'value' em vez de 'initialRating'
                      readonly={true} // Adicione explicitamente a prop readonly
                      showText={true} //exibe texto
                    />
                    {recipe.total_avaliacoes > 0 ? "Avaliações recebidas" : ""}
                  </span>
                </div>
                {recipe.feedbacks?.length > 0 ? (
                  recipe.feedbacks
                    .filter((fb) => fb.ativo === 1)
                    .slice(0, 3)
                    .map((feedback, index) => (
                      <div
                        key={index}
                        className="recommendation-feedbacks-users"
                      >
                        <p className="recommendation-feedbacks-usuario">
                          <PiUserCircleFill
                            size={20}
                            className="iconUserfeedback"
                          />
                          {feedback.usuario}{" "}
                          <span className="recommendation-feedbacks-data">
                            {" "}
                            - {formataData(feedback.data_cadastro)}
                          </span>
                        </p>
                        <div className="feedback-rating">
                          <StarRating
                            totalStars={5}
                            value={feedback.estrelas}
                            readonly={true}
                            showText={true}
                          />
                        </div>
                        <p className="recommendation-feedbacks-text">
                          {feedback.comentario}
                        </p>
                      </div>
                    ))
                ) : (
                  <div key={0} className="recommendation-feedbacks-users">
                    <p className="recommendation-feedbacks-text">
                      Nenhum feedback ativo para essa receita.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mais Receitas */}
        <div>
          <MaisReceitasComponente limit={4} />
        </div>
      </div>
    </>
  );
}

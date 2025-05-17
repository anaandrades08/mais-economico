"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState  } from 'react';
import Link from "next/link";
import Image from "next/image";
import "../../styles/dashboard.css";
import "../../styles/Feedbacks.css";
import StarRating from '../../components/StarRating';
//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Feedback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = session?.user?.id || session?.user?.id;
  const userNome = session?.user?.nome || session?.user?.name;

  useEffect(() => {
    if (session?.user) {
      const { id, nome, email } = session.user;
      console.log('Usuário logado:', id, nome, email);
      fetchFeedbacks();
    }
  }, [session]);
  
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const fetchFeedbacks = async () => {
      try {
          setLoading(true);
          const response = await fetch(`/api/feedbacks/usuario/${session.user.id}`);
          
          if (!response.ok) {
              throw new Error('Erro ao carregar feedbacks do usuário');
          }

          const data = await response.json();
          setFeedbacks(data);
      } catch (error) {
          console.error('Erro ao buscar feedbacks do usuário:', error);
          setError(error.message);
      } finally {
          setLoading(false);
      }
  };


  const handleDeleteFeedback = async (FeedbackID) => {
      if (!session?.user?.id) {
        toast.error('Você precisa estar logado para remover feedback');
        return;
      }
      try {
        toast.loading('Removendo feedback...', { 
          toastId: 'delete-feedback',
          autoClose: false
        });
  
        const response = await fetch(`/api/feedbacks/${FeedbackID}/`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setFeedbacks(prev => prev.filter(feedback => feedback.id_feedback !== FeedbackID));
          toast.update('delete-feedback', {
            render: 'Feedback removido da receita!',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          });
        } else {
          const errorData = await response.json();
          toast.update('delete-feedback', {
            render: errorData.message || 'Erro ao remover feedback',
            type: 'error',
            isLoading: false,
            autoClose: 3000
          });
        }
      } catch (error) {
        console.error("Erro ao deletar feedback:", error);
        toast.update('delete-feedback', {
          render: 'Falha na conexão. Tente novamente.',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
  };

  if (status === 'loading' || loading) {
      return <div className="loading">Carregando feedbacks do usuário...</div>;
  }


  const getFeedbackStatus = (ativo) => {
    if (ativo === null) {
        return { text: 'Aguardando aprovação', className: 'pending' };
    } else if (ativo === 1) {
        return { text: 'Aprovado', className: 'approved' };
    } else if (ativo === 2) {
        return { text: 'Reprovado', className: 'rejected' };
    } else if (ativo === 0) {
        return { text: 'Inativo', className: 'inactive' };
    } else {
        return { text: 'Indefinido', className: 'undefined' };
    }
};

  return (
    <>
      <div className="dashboard-container">
      {/* titulo */ }
      < div className = "container-title" >
            <h2 className="title">Painel de Controle do Usuário</h2>
       </div >

        {/* informações básicas */ }
        < div className = "name-page" >
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
       {/* menu de links */ }
       < div className = "container-abas" >
            <div className="abas">
              <Link href={`/dashboard/envie-receita/`} passHref><button className="aba"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
              <Link href={`/dashboard/favoritos/`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
              <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>                
              <Link href={`/dashboard/feedback/`} passHref><button className="aba ativa"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
            </div>
       </div>
        
         {/* seção de feedbacks */}
         <section className="container-feedbacks">
        <h3>Meus Feddbacks</h3>       
              
        <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            /> 
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {feedbacks.length === 0 ? (
                    <div className="feedbacks-content">
                        <p>Você ainda não enviou nenhum feedback.</p>
                        <p>Para enviar feedback você deve avaliar e comentar em uma receita.</p>
                    </div>
                ) : (
                <>
                    <div className="feedbacks-content">
                        <p>Para remover um feedback de receita, clique no X no canto superior direito.</p>
                        <p>Para enviar feedback você deve avaliar e comentar em uma receita.</p>
                    </div>
                    <div className="feedback-list">
                        {feedbacks.map((feedback) => (
                            <div key={feedback.id_feedback} className="feedback-card">
                            <Link href={`/pages/receita/${feedback.id_receita}`}>
                              <Image
                                src={feedback.receita.img_receita || "/images/layout/recipe/image-not-found.png"}
                                alt={feedback.receita.titulo_receita || "Titulo da receita"}
                                width={250}
                                height={200}
                                className="recipeImg"
                                priority
                              />
                            </Link>
                            <div className="feedback-header">
                              <h4>{feedback.receita.titulo_receita}</h4>
                            </div>
                            <div className="feedback-rating">
                              <StarRating totalStars={5} initialRating={feedback.total_estrela || 0} readOnly={true} />
                            </div>
                            <div className="feedback-content">
                              <p>{feedback.feedback}</p>
                            </div>
                            <div className="feedback-footer">
                              <span className="feedback-date">
                                {new Date(feedback.data_cadastro).toLocaleDateString('pt-BR')}
                              </span>
                              <span className={`feedback-status ${getFeedbackStatus(feedback.ativo).className}`}>
                                {getFeedbackStatus(feedback.ativo).text}
                              </span>
                            </div>
                            <button
                              className="remove-btn"
                              onClick={() => handleDeleteFeedback(feedback.id_feedback)}
                            >
                              X
                            </button>
                          </div>
                            
                        ))}
                    </div>
                  </>
                )}
          <p className="recipe-count">
            {feedbacks.length === 0
              ? "Nenhuma feedback"
              : feedbacks.length === 1
                ? "1 feedback encontrado"
                : `${feedbacks.length} feedbacks encontrados`}
          </p>
            </section>
      </div>
    </>
  );
}

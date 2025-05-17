"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import "../../styles/PerfilUser.css";
import "../../styles/dashboard.css";
import { formatCEP, buscarEnderecoPorCEP } from '../../utils/masks';
import { validarEdicaoUser } from '../../utils/validarCadastroUsuario';
import axios from 'axios';

//icone aba
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle, BiMessageDetail } from "react-icons/bi";
//import { MdSwapHoriz } from "react-icons/md";

export default function UserDetail() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState([]);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const userId = session?.user?.id;
  const userNome = session?.user?.nome;
  const [errosCampo, setErrosCampo] = useState({});
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    numero: '',
    cep: '',
    cidade: '',
    estado: '',
    senha: '',
    confirmarSenha: '',
  });

  useEffect(() => {
    if (session?.user) {
      const { id, nome, email } = session.user;
      console.log('Usuário logado:', id, nome, email);
      fetchUsuario(userId);
    }
  }, [session]);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }


  const fetchUsuario = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/usuarios/${userId}/`);
      const dados = response.data;
      setUsuario(dados);
      setFormData({
        nome: dados.nome || '',
        email: dados.email || '',
        endereco: dados.endereco || '',
        numero: dados.numero || '',
        cep: dados.cep || '',
        cidade: dados.cidade || '',
        estado: dados.estado || '',
        senha: '',
        confirmarSenha: '',
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevUsuario) => ({
      ...prevUsuario,
      [id]: value,
    }));
  };

  const handleCepChange = async (e) => {
    const cepFormatado = formatCEP(e.target.value);

    setFormData(prev => ({ ...prev, cep: cepFormatado }));
    setErrosCampo(prev => ({ ...prev, cep: '', endereco: '' }));

    if (cepFormatado.replace(/\D/g, '').length === 8) {
      try {
        setIsLoadingCEP(true);
        const { endereco, cidade, estado, bairro } = await buscarEnderecoPorCEP(cepFormatado);

        setFormData(prev => ({
          ...prev,
          endereco: endereco || prev.endereco,
          cidade: cidade || prev.cidade,
          estado: estado || prev.estado,
          ...(bairro && { bairro })
        }));

        setErrosCampo(prev => ({ ...prev, cep: '' }));
      } catch (error) {
        console.error('Erro ao buscar CEP:', error.message);
        setErrosCampo(prev => ({
          ...prev,
          cep: error.message,
          endereco: 'Por favor, preencha manualmente'
        }));

        // Mantém os valores existentes se já estiverem preenchidos
        setFormData(prev => ({
          ...prev,
          endereco: prev.endereco || '',
          cidade: prev.cidade || '',
          estado: prev.estado || ''
        }));
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    setErrosCampo({});

    // Validação dos campos
    const { isValid, errors } = validarEdicaoUser(formData, alterarSenha);

    if (!isValid) {
      setErrosCampo(errors);
      setSubmitError('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      // Preparar dados para envio
      const dadosParaEnvio = {
        nome: formData.nome,
        email: formData.email,
        endereco: formData.endereco,
        numero: formData.numero,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep.replace(/\D/g, '') // Remove formatação do CEP
      };

      // Adicionar senha apenas se o usuário optou por alterar
      if (alterarSenha) {
        dadosParaEnvio.senha = formData.senha;
      }

      const response = await axios.put(`/api/usuarios/${userId}/`, dadosParaEnvio);

      // Atualizar os dados locais e mostrar mensagem de sucesso
      setUsuario(response.data);
      setSubmitSuccess(true);

      // Resetar senhas após sucesso
      setFormData(prev => ({
        ...prev,
        senha: '',
        confirmarSenha: ''
      }));
      setAlterarSenha(false);

       // Atualiza a sessão se necessário
       if (session?.user) {
        session.user.nome = response.data.nome;
      }

      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setSubmitSuccess(false), 3000);

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setSubmitError(
        error.response?.data?.error ||
        'Erro ao atualizar perfil. Por favor, tente novamente.'
      );
    }
  };

  const handleClearForm = () => {
    setFormData({
      nome: formData.nome,
      email: formData.email,
      endereco: formData.endereco,
      numero: formData.numero,
      cep: formData.cep,
      cidade: formData.cidade,
      estado: formData.estado,
      senha: '',
      confirmarSenha: '',
    });
    setAlterarSenha(false);
    setErrosCampo({});
  };


  const handleImageUpload = async (e) => {  
    const file = e.target.files[0];
    if (!file) return;

    console.log('ID do usuário:', userId); // Adicione este log
  
    // Verifica o tipo do arquivo
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setUploadError('Formato inválido. Use apenas JPEG ou PNG.');
      return;
    }
  
    // Verifica o tamanho do arquivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('A imagem deve ter no máximo 2MB.');
      return;
    }
  
    try {
      setIsUploading(true);
      setUploadError('');
  
      // Cria um preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
  
      // Prepara o FormData para o upload
      const formData = new FormData();
      formData.append('image', file);
  
      // Faz o upload da imagem usando PUT
      const response = await axios.put(`/api/usuarios/${userId}/imagem/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Atualiza a imagem do usuário no estado local
      setUsuario(prev => ({
        ...prev,
        img_usuario: response.data.imageUrl
      }));
  
      // Atualiza a sessão se necessário
      if (session?.user) {
        session.user.img_usuario = response.data.imageUrl;
      }
  
      // Mostra mensagem de sucesso
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
  
    } catch (error) {
        console.error('Detalhe do erro:', error);
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          code: error.code
        });
      setUploadError(error.response?.data?.error || 'Erro ao enviar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

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


  if (status === 'loading' || loading) {
    return <div className="loading">Carregando dados do usuário...</div>;
  }


  return (
    <>
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
            <Link href={`/dashboard/envie-receita/`} passHref><button className="aba"> <BsSendPlus size={20} className="Icon" />Envie uma Receita</button></Link>
            <Link href={`/dashboard/favoritos/`} passHref><button className="aba"><MdFavoriteBorder size={20} className="Icon" />Receitas Favoritas</button></Link>
            <Link href={`/dashboard/perfil-usuario/`} passHref><button className="aba ativa"><BiUserCircle size={20} className="Icon" />Dados Pessoais</button></Link>
            <Link href={`/dashboard/feedback/`} passHref><button className="aba"><BiMessageDetail size={20} className="Icon" />Feedbacks</button></Link>
          </div>
        </div>

        {/* seção do que abre na pagina */}

        <section className="container-perfil-user">
          <div className="perfil-container">
            <div className="info-pessoais">
              <div className="foto-perfil">
                <div className="foto-container">
                  <Image
                    src={previewImage || usuario.img_usuario || '/images/usuario/default-avatar.png'}
                    alt={usuario.nome || 'Imagem do usuário'}
                    width={100}
                    height={100}
                    className="foto"
                  />
                  {isUploading && <div className="upload-overlay">Enviando...</div>}
                </div>
                <div className="info-upload">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/jpeg, image/png"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload" className="btn-upload">
                    {isUploading ? 'Enviando...' : 'Upload nova foto'}
                  </label>
                  {uploadError && <p className="upload-error">{uploadError}</p>}
                  <p className="info-foto">
                    Tamanho recomendado: 800x800 px<br />
                    Formatos permitidos: JPEG ou PNG<br />
                    Tamanho máximo: 2MB
                  </p>
                </div>
              </div>

              <div className="dados-pessoais">
                <h3>Informações Pessoais</h3>
                <div className="info-container">
                  <div className="info-left">
                    <p className="font-bold">Nome de Usuário:</p>
                    <p>{usuario.nome || 'Não informado'}</p>
                    <p className="font-bold">Endereço:</p>
                    <p>{usuario.endereco}  n° {usuario.numero || 'Não informado'}</p>
                    <p className="font-bold">Cidade/UF:</p>
                    <p>{usuario.cidade || 'Não informado'}/{usuario.estado || 'Não informado'}</p>
                    <p className="font-bold">CEP:</p>
                    <p>{usuario.cep ? formatCEP(usuario.cep) : 'Não informado'}</p>
                  </div>
                  <div className="info-rigth">
                    <p className="font-bold">E-mail:</p>
                    <p>{usuario.email || 'Não informado'}</p>
                    <p className="font-bold">Usuário:</p>
                    <p>
                      {usuario.tipo === 1
                        ? 'Administrador'
                        : usuario.tipo === 2
                          ? 'Básico'
                          : usuario.tipo === 3
                            ? 'Premium'
                            : 'Desconhecido'}
                    </p>
                    <p className="font-bold">Status:</p>
                    <p>
                      {usuario.ativo === 1
                        ? 'Ativo'
                        : usuario.ativo === 2
                          ? 'Reprovado'
                          : usuario.ativo === null
                            ? 'Novo'
                            : usuario.ativo === 0
                              ? 'Inativo'
                              : 'Desconhecido'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="excluir-conta">
                <h4>Excluir conta:</h4>
                <p>Caso deseje encerrar sua conta conosco,</p>
                <p>basta clicar no botão abaixo.</p>
                  <button className="btn-excluir" onClick={() => router.push('/dashboard/perfil-usuario/deletar')}>Excluir Conta</button>
              </div>
            </div>
            <div className="edicao-informacoes">
              <h2>Edição das Informações</h2>
              <form id="form-info-user" >
                <div className="form-colunas">
                  <div className="form-info-left">
                    <div className="form-group">
                      <label htmlFor="nome">Nome:</label>
                      <input type="text" id="nome" placeholder="Digite novo nome de usuário" maxLength={255} value={formData.nome} onChange={handleChange} required className={errosCampo.nome ? 'input-error' : ''} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">E-mail:</label>
                      <input type="email" id="email" placeholder="Digite novo e-mail" maxLength={100} value={formData.email} onChange={handleChange} required className={errosCampo.email ? 'input-error' : ''} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cidade">CEP</label>
                      <input type="text" id="cep" placeholder="00000-000" maxLength={9} value={formData.cep} onChange={handleCepChange} required className={errosCampo.cep ? 'input-error' : ''}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="endereco">Endereço:</label>
                      <input type="text" id="endereco" placeholder="Digite novo endereço" maxLength={100} value={formData.endereco} onChange={handleChange} required className={errosCampo.endereço ? 'input-error' : ''}
                      />
                      <label htmlFor="numero">Número:</label>
                      <input type="text" id="numero" placeholder="Digite novo numero" maxLength={10} value={formData.numero} onChange={handleChange} required className={errosCampo.numero ? 'input-error' : ''}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cidade">Cidade</label>
                      <input type="text" id="cidade" placeholder="Digite nova cidade" value={formData.cidade} maxLength={100} onChange={handleChange} required className={errosCampo.cidade ? 'input-error' : ''}
                      />
                      <label htmlFor="estado">UF</label>
                      <input type="text" id="estado" placeholder="UF" value={formData.estado} maxLength={2} onChange={handleChange} required className={errosCampo.estado ? 'input-error' : ''}
                      />
                    </div>


                  </div>
                  <div className="form-info-rigth">
                    <div className="form-group">
                      <label htmlFor="alterarSenha">Deseja alterar a senha?</label>
                      <input
                        type="checkbox"
                        id="alterarSenha"
                        checked={alterarSenha}
                        onChange={() => setAlterarSenha(!alterarSenha)}
                      />
                    </div>

                    {alterarSenha && (
                      <div className="senha-section">
                        <div className="form-group">
                          <label htmlFor="senha">Nova Senha:</label>
                          <input
                            type="password"
                            id="senha"
                            placeholder="Digite uma nova senha"
                            value={formData.senha}
                            onChange={handleChange}
                            className={errosCampo.senha ? 'input-error' : ''}
                            maxLength={20}
                            minLength={8}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirmarSenha">Confirme sua nova senha:</label>
                          <input
                            type="password"
                            id="confirmarSenha"
                            placeholder="Confirme sua senha"
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            className={errosCampo.confirmarSenha ? 'input-error' : ''}
                            maxLength={20}
                            minLength={8}
                          />
                        </div>

                        <ul className="senha-requisitos">
                          <li><span className="ok">✔</span> Mínimo de 8 caracteres</li>
                          <li><span className="ok">✔</span> 1 letra maiúscula (A-Z)</li>
                          <li><span className="ok">✔</span> 1 letra minúscula (a-z)</li>
                          <li><span className="ok">✔</span> 1 número (0-9)</li>
                          <li><span className="ok">✔</span> 1 caractere especial (ex: ! @ # $ % ^)</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="group-btn">
                  <button type="submit" className="btn-salvar" onClick={handleSubmit}>Salvar</button>
                  <button type="submit" className="btn-reset" onClick={handleClearForm}>Limpar</button>
                </div>
              </form>
              {isLoadingCEP && <span>Carregando endereço...</span>}
              {errosCampo.nome && <span className="erro-campo">{errosCampo.nome}</span>}
              {errosCampo.email && <span className="erro-campo">{errosCampo.email}</span>}
              {errosCampo.cep && <span className="erro-campo">{errosCampo.cep}</span>}
              {errosCampo.endereco && <span className="erro-campo">{errosCampo.endereco}</span>}
              {errosCampo.numero && <span className="erro-campo">{errosCampo.numero}</span>}
              {errosCampo.cidade && <span className="erro-campo">{errosCampo.cidade}</span>}
              {errosCampo.estado && <span className="erro-campo">{errosCampo.estado}</span>}
              {errosCampo.senha && <span className="erro-campo">{errosCampo.senha}</span>}
              {errosCampo.confirmarSenha && <span className="erro-campo">{errosCampo.confirmarSenha}</span>}

              {submitError && (
                <div className="erro-mensagem">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="sucesso-mensagem">
                  Perfil atualizado com sucesso!
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

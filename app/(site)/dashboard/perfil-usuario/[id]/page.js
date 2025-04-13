"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../../../styles/PerfilUser.css";
import "../../../styles/dashboard.css";
import { Users } from "../../data/UserData.js"; // Importando os dados dos usuários
import { FiMail, FiPhone, FiCalendar, FiMapPin } from "react-icons/fi";

export default function UserDetail() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Encontra o usuário pelo ID
    const foundUser = Users.find((u) => u.id.toString() === params.id);
    setUser(foundUser);
    setLoading(false);
  }, [params.id]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (!user) return <div className="notFound">Usuário não encontrado</div>;

  if (!user) {
    return (
      <div className="notFound">
        <h2>Usuário não encontrado</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="userContainer">
        <div className="container-title">
          <h2 className="title">Perfil do usuário</h2>
        </div>

        {/* informações básicas */}
        <div className="name-page">
          <div className="name-title">
            <h2 className="nomeação">Bem vindo (ª) {user.name}</h2>
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

        <div className="container-abas">
          <div className="abas">
            <button className="aba ativa">Dados Pessoais</button>
            <button className="aba">Envie uma Receita</button>
            <button className="aba">Receitas Favoritas</button>
          </div>

          <section className="container-dashboard">
            <div className="container-cinza">

              <div className="perfil-container">
                <div className="info-pessoais">
                  <div className="foto-perfil">
                    <Image
                      src={user.image}
                      alt="Foto de perfil"
                      width={100}
                      height={100}
                      className="foto"
                    />
                    <div className="info-upload">
                      <button className="btn-upload">Upload nova foto</button>
                      <p className="info-foto">
                        Tamanho recomendado: 800x800 px<br />
                        Formatos permitidos: JPEG ou PNG
                      </p>
                    </div>
                  </div>

                  <div className="dados-pessoais">
                    <h3>Informações Pessoais</h3>
                    <div className="info-container">
                      <div className="info-left">
                        <p><strong>Nome de Usuário:</strong></p>
                        <p>{user.name}</p>
                        <p><strong>Endereço:</strong></p>
                        <p>{user.endereco}  n° {user.numero}</p>
                        <p><strong>Cidade/UF:</strong></p>
                        <p>{user.cidade}/{user.uf}</p>
                        <p><strong>CEP:</strong></p>
                        <p>{user.cep}</p>
                      </div>
                      <div className="info-rigth">
                        <p><strong>E-mail:</strong></p>
                        <p>{user.email}</p>
                        <p><strong>Telefone:</strong></p>
                        <p>{user.telefone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="excluir-conta">
                    <h4>Excluir conta:</h4>
                    <p>Caso deseje encerrar sua conta conosco,<br /> basta clicar no botão abaixo.</p>
                    <button className="btn-excluir">Excluir Conta</button>
                  </div>
                </div>
              </div>
              <div className="form-container">
                <div className="edicao-informacoes">
                  <h2>Edição das Informações</h2>
                  <form id="form-info-user">
                  <div className="form-colunas">
                  <div className="form-info-left">
                    <div className="form-group">
                      <label htmlFor="nome">Nome:</label>
                      <input type="text" id="nome" placeholder="Digite novo nome de usuário" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone:</label>
                      <input type="text" id="telefone" placeholder="Digite seu telefone" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">E-mail:</label>
                      <input type="email" id="email" placeholder="Digite novo e-mail" />
                    </div>


                    <div className="form-group">
                      <label htmlFor="cidade">Cidade</label>
                      <input type="text" id="cidade" placeholder="Digite nome da sua cidade" />
                      <label htmlFor="uf">UF</label>
                      <input type="text" id="uf" placeholder="UF" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="endereco">Endereço:</label>
                      <input type="text" id="endereco" placeholder="Digite seu endereço" />
                    </div>
                   
                  </div>
                  <div className="form-info-rigth">
                    <div className="senha-section">
                      <div className="form-group">
                        <label htmlFor="senha">Nova Senha:</label>
                        <input type="password" id="senha" placeholder="Digite uma nova senha" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmar">Confirme sua nova senha:</label>
                        <input type="password" id="confirmar" placeholder="Confirme sua senha" />
                      </div>

                      <ul className="senha-requisitos">
                        <li><span className="ok">✔</span> Mínimo de 8 caracteres</li>
                        <li><span className="ok">✔</span> 1 letra maiúscula (A-Z)</li>
                        <li><span className="ok">✔</span> 1 letra minúscula (a-z)</li>
                        <li><span className="ok">✔</span> 1 número (0-9)</li>
                        <li><span className="ok">✔</span> 1 caractere especial (ex: ! @ # $ % ^)</li>
                      </ul>
                    </div>
                  </div>
                  </div>
                  <div className="group-btn">
                    <button type="submit" className="btn-salvar">Salvar</button>
                    <button type="reset" className="btn-reset">Limpar</button>
                  </div>
                  </form>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </>
  );
}

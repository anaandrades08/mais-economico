// app/login/page.js
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import '../styles/Login.css'
import { validarEmail, validarSenha, validarLogin } from '../utils/validarLogin';
import { signIn } from "next-auth/react";


export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');  
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const erroValidacao = validarLogin(email, senha);
    if (erroValidacao) {
      setErro(erroValidacao);
      setTimeout(() => {
        setEmail('');
        setSenha('');
        setErro('');
      }, 1500);
      return; // Sai da função se houver erro
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      senha: senha
    });

    if (res.ok) {
      router.push("/dashboard/");
    } else {
      setErro("E-mail ou senha inválidos.");
      setTimeout(() => {
        setEmail('');
        setSenha('');
        setErro('');
      }, 1500);
      return;
    }
  };


  return (
    <div className="login-container">
      <div className="login-container-form">
        <div className="content-login-title">
          <h2 className="login-title">Seja bem vindo (a):</h2>
          <div className="login-description">
            Faça login no nosso site para descobrir receitas que vão encantar seu
            paladar e transformar sua cozinha !
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="email">
            <label htmlFor="email">E-mail:</label>
            <input
              id="email"
              type="email"
              className="input-email"
              placeholder="Digite o E-mail cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                const erroEmail = validarEmail(email);
                setErro(erroEmail);
              }}
              required
            />
          </div>
          <div className="password">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              className="input-senha"
              placeholder="Digite sua senha cadastrada"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onBlur={() => {
                const erroSenha = validarSenha(senha);
                setErro(erroSenha);
              }}
              required
            />
          </div>
          {erro && <div className="erro-msg">{erro}</div>}
          <div className="group-btn">
            <button type="submit" className="btn-entrar">Entrar</button>
          </div>
        </form>


        <div className="recuperar-senha">
          <p className="p-senha">Esqueceu a senha?</p>
          <Link href={'/esqueceu-senha/'} alt="esqueceu senha" className="recuperar-link">Clique aqui!</Link>
        </div>

        <div className="cadastro">
          <div className="cadastro-container">
            <div className="linha"></div>
            <div className="texto">
              Ainda não possui cadastro?<br />
              Crie agora mesmo!
            </div>
            <div className="linha"></div>
          </div>
          <Link href={'/cadastro/'} alt="botao-cadastro"><button className="btn-novo-cadastro">Criar um novo cadastro</button></Link>
        </div>
      </div>
      <div className='login-second-img'>
        <Image
          src="/images/layout/login/login-img.png"
          alt="Login do Site +Economico Receitas"
          width={636}
          height={581}
          className="login-img"
          priority
        />
      </div>
    </div>
  );
}
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import '../styles/EsqueceuSenha.css'

export default function RecuperarSenha() {
    
  const [email, setEmail] = useState('');

  const handleRecuperar = (e) => {
    e.preventDefault();

      // Após 2 segundos, limpa o formulário
      setTimeout(() => {
        setEmail('');
      }, 2000);
  };

    return (
        <div className="recuperar-container">
            <div className='recuperar-second-img'>
                <Image
                    src="/images/layout/login/esqueceu-senha-img.png"
                    alt="Login do Site +Economico Receitas"
                    width={635}
                    height={473}
                    className="recuperar-img"
                    priority
                />
            </div>
            <div className="recuperar-container-form">
                <div className="content-recuperar-title">
                    <h2 className="recuperar-title">Esqueceu a senha?</h2>
                    <div className="recuperar-description">
                        Informe seu endereço de e-mail e enviaremos um link para redefinir sua senha
                    </div>
                </div>

                <form id="recuperar" method="post">
                    <div className="recuperar-input">
                        <label htmlFor="e-mail">E-mail:</label>
                        <input
                            type="email"
                            className="input-email"
                            placeholder="Digite o E-mail cadastrado"
                            required
                        />
                    </div>
                    <div className='group-btn-enviar'>
                        <Link href={'/recuperar-senha/'} passHref>
                        <button type="submit" className="btn-enviar">Enviar Link</button>
                        </Link>
                    </div>
                </form>
                <div className='group-ou-voltar'>
                    <p>OU</p>
                    <div className='group-btn-voltar'>
                        <Link href={'/login'}><button type="button" className="btn-voltar">Retorna para Login</button></Link>        
                    </div>
                </div>
            </div>
        </div>
    )
}
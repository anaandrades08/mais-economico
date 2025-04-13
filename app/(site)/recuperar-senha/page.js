'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import '../styles/EsqueceuSenha.css'

export default function RecuperarSenha() {
    
  const [novaSenha, SetNovaSenha] = useState('');
  const [confirmeSenha, setSetConfirmeSenha] = useState('');

  const handleRecuperar = (e) => {
    e.preventDefault();

      // Após 2 segundos, limpa o formulário
      setTimeout(() => {
        SetNovaSenha('');
        setSetConfirmeSenha('');
      }, 2000);
  };

    return (
        <div className="recuperar-container">
            <div className="recuperar-container-form">
                <div className="content-recuperar-title">
                    <h2 className="recuperar-title">Redefina sua senha</h2>
                    <div className="recuperar-description">Redefina sua nova senha para ter acesso ao nosso site de receitas econômicas
                    </div>
                </div>

                <form id="recuperar" method="post">
                    <div className="recuperar-input">
                        <label htmlFor="nova-senha">Crie uma nova senha:</label>
                        <input
                            type="password"
                            className="input-email"
                            placeholder="Nova Senha"
                            required
                        />
                    </div>
                    <div className="recuperar-input">
                        <label htmlFor="confirme-nova-senha">Confirme sua Nova senha:</label>
                        <input
                            type="password"
                            className="input-email"
                            placeholder="Digite sua senha cadastrada"
                            required
                        />
                    </div>
                    <div className='group-btn-enviar'>
                        <button type="submit" className="btn-enviar">Redefinir</button>
                    </div>
                </form>
            </div>
            <div className='recuperar-second-img'>
                <Image
                    src="/images/layout/login/esqueceu-senha-img.png"
                    alt="Recuperar Senha do Site +Economico Receitas"
                    width={635}
                    height={473}
                    className="recuperar-img"
                    priority
                />
            </div>
        </div>
    )
}
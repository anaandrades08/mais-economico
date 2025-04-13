'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from "next/link"
import '../styles/Cadastro.css'
import { FaRegThumbsUp } from 'react-icons/fa'

export default function CadastroUser() {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [cep, setCep] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [termosAceitos, setTermosAceitos] = useState(false)

  const handleCadastro = (e) => {
    e.preventDefault()

    // Aqui pode ser feita a validação do formulário

    // Após 2 segundos, limpa o formulário
    setTimeout(() => {
      setEmail('')
      setNome('')
      setEndereco('')
      setNumero('')
      setCep('')
      setCidade('')
      setUf('')
      setSenha('')
      setConfirmarSenha('')
      setTermosAceitos(false)
    }, 2000)
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-second-img">
        <Image
          src="/images/layout/user/cadastro-img.png"
          alt="Cadastro do Site +Economico Receitas"
          width={635}
          height={474}
          className="cadastro-img"
          priority
        />
      </div>
      <div className="cadastro-container-form">
        <div className="content-cadastro-title">
          <h2 className="cadastro-title">Crie sua conta:</h2>
        </div>

        <form id="cadastro" onSubmit={handleCadastro}>
          <div className="cadastro-input">
            <label htmlFor="nome">Nome:<span className="text-required">*</span></label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={150}
              minLength={3}
              className="input-text"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className="cadastro-input">
            <label htmlFor="e-mail">E-mail:<span className="text-required">*</span></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
              className="input-text"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="cadastro-input-endereco">
            <div className="input-group-endereco endereco">
              <label htmlFor="endereco">Endereço:<span className="text-required">*</span></label>
              <input
                id="endereco"
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                maxLength={150}
                minLength={3}
                className="input-text-endereco"
                placeholder="Digite seu endereço"
                required
              />
            </div>
            <div className="input-group-endereco numero">
              <label htmlFor="numero">Número:<span className="text-required">*</span></label>
              <input
                id="numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                maxLength={10}
                className="input-text-endereco"
                placeholder="Nº"
                required
              />
            </div>
          </div>

          <div className="cadastro-input">
            <label htmlFor="cep">CEP:<span className="text-required">*</span></label>
            <input
              id="cep"
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              maxLength={14}
              className="input-text"
              placeholder="Digite seu cep"
              required
            />
          </div>

          <div className="cadastro-input-cidade">
            <div className="input-group-cidade cidade">
              <label htmlFor="cidade">Cidade:</label>
              <input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                maxLength={100}
                className="input-text-cidade"
              />
            </div>
            <div className="input-group-cidade uf">
              <label htmlFor="uf">UF:</label>
              <input
                id="uf"
                type="text"
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                maxLength={2}
                className="input-text-cidade"
              />
            </div>
          </div>

          <div className="cadastro-input-senha">
            <div className="input-group-senha">
              <label htmlFor="senha">Senha:</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                maxLength={20}
                minLength={8}
                className="input-text-senha"
                placeholder="Digite uma senha"
              />
            </div>
            <div className="input-group-senha">
              <label htmlFor="confirmarsenha">Confirmar Senha:</label>
              <input
                id="confirmarsenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                maxLength={20}
                minLength={8}
                className="input-text-senha"
                placeholder="Confirme senha"
              />
            </div>
          </div>

          <div className="group-text-senha">
            <p><FaRegThumbsUp size={20} className="icoSenha" />Mínimo de 8 caracteres</p>
            <p><FaRegThumbsUp size={20} className="icoSenha" />1 letra maiúscula (A–Z)</p>
            <p><FaRegThumbsUp size={20} className="icoSenha" />1 letra minúscula (A–Z)</p>
            <p><FaRegThumbsUp size={20} className="icoSenha" />1 número (0-9)</p>
            <p><FaRegThumbsUp size={20} className="icoSenha" />1 caractere especial (ex: ! @ # $ % & *)</p>
            <div className="aceito-termos">
              <label className="aceito-check">
                <input
                  type="checkbox"
                  id="checkbox-termo"
                  className="checkbox-termo"
                  required
                />
                <span className="checkmark"></span>
                Ao se cadastrar, você concorda com os nossos:
                </label>
                <p>
                <Link href="/termos?q=termosecondicoes" className="link-termo" passHref>Termos e Condições. </Link>
                E a nossa <Link href="/termos?q=politicadeprivacidade" className="link-termo" passHref>
                  Política de Privacidade.
                </Link></p>
            </div>
          </div>


          <div className='group-btn'>
            <button type="submit" className="btn-enviar">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
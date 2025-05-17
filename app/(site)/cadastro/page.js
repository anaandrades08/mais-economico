'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from "next/link"
import '../styles/Cadastro.css'
import { formatCEP, buscarEnderecoPorCEP } from '../utils/masks';
import { validarCadastroUser } from '../utils/validarCadastroUsuario';
import { FaRegThumbsUp } from 'react-icons/fa'

export default function CadastroUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [errosCampo, setErrosCampo] = useState({});
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    numero: '',
    cep: '',
    cidade: '',
    estado: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    termosAceito: false
  });

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};

  const handleCepChange = async (e) => {
    const cepFormatado = formatCEP(e.target.value);
    setFormData(prev => ({ ...prev, cep: cepFormatado }));
    setErrosCampo(prev => ({ ...prev, cep: '' }));
  
    if (cepFormatado.replace(/\D/g, '').length === 8) {
      try {
        setIsLoading(true);
        const { endereco, cidade, estado, bairro } = await buscarEnderecoPorCEP(cepFormatado);
        
        setFormData(prev => ({
          ...prev,
          endereco,
          cidade,
          estado,
          ...(bairro && { bairro }) // Adiciona bairro se existir
        }));
        
      } catch (error) {
        console.error('Erro ao buscar CEP:', error.message);
        setErrosCampo(prev => ({ 
          ...prev, 
          cep: error.message,
          endereco: 'Por favor, preencha manualmente'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Submit do formulário
  const handleCadastro = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMensagemErro('')
    setErrosCampo({})

    try {
      // Validação
      const { isValid, errors } = validarCadastroUser(formData)

      if (!isValid) {
        // Transforma array de erros em objeto por campo
        const errosPorCampo = errors.reduce((acc, erro) => {
          const campo = erro.toLowerCase().includes('nome') ? 'nome' :
                      erro.toLowerCase().includes('email') ? 'email' :
                      erro.toLowerCase().includes('endereco') ? 'endereco' :
                      erro.toLowerCase().includes('numero') ? 'numero' :
                      erro.toLowerCase().includes('cidade') ? 'cidade' :
                      erro.toLowerCase().includes('estado') ? 'estado' :
                      erro.toLowerCase().includes('cep') ? 'cep' :
                      erro.toLowerCase().includes('senha') ? 'senha' :
                      erro.toLowerCase().includes('confirmarsenha') ? 'confirmarSenha' :
                      erro.toLowerCase().includes('termosaceito') ? 'termosAceito' : 
                      'geral';
          return { ...acc, [campo]: erro };
        }, {});

        setErrosCampo(errosPorCampo)
        //throw new Error('Por favor, corrija os erros no formulário')
        return; // Apenas retorna, não lança erro
      }

      // Preparar payload para a API
      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cep: formData.cep.replace(/\D/g, ''),
        endereco: formData.endereco,
        numero: formData.numero,
        cidade: formData.cidade,
        estado: formData.estado,
        aceito_termo: formData.termosAceito ? 1 : 0,
        tipo: 2,
        ativo: null,
      };

      console.log('Payload sendo enviado:', payload); // Adicione esta linha
      //chama API
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao cadastrar usuário')
      }

      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        email: '',
        endereco: '',
        numero: '',
        cep: '',
        cidade: '',
        estado: '',
        telefone: '',
        senha: '',
        confirmarSenha: '',
        termosAceito: false
      })

      setMensagemErro('Cadastro realizado com sucesso!')

    } catch (error) {
      console.error('Erro:', error)
      setMensagemErro(error.message)
    } finally {
      setIsLoading(false)
    }
  };

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
          {/* Campo Nome */}
          <div className="cadastro-input">
            <label htmlFor="nome">Nome:<span className="text-required">*</span></label>
            <input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`input-text ${errosCampo.nome ? 'input-error' : 'input-text-endereco'}`}
              placeholder="Digite seu nome"
            />
          </div>

          {/* Campo Email */}
          <div className="cadastro-input">
            <label htmlFor="email">Email:<span className="text-required">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-text ${errosCampo.email ? 'input-error' : 'input-text-endereco'}`}
              placeholder="Digite seu email"
            />
          </div>

          {/* campos de endereço */}
          <div className="cadastro-input">
            <label htmlFor="cep">CEP:<span className="text-required">*</span></label>
            <input
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleCepChange}
              className={`input-text ${errosCampo.cep ? 'input-error' : 'input-text-endereco'}`}
              maxLength={11}
              placeholder="00000-000"
            />
          </div>

          <div className="cadastro-input-endereco">
            <div className="input-group-endereco endereco">
              <label htmlFor="endereco">Endereço:<span className="text-required">*</span></label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                maxLength={150}
                minLength={3}
                value={formData.endereco}
                onChange={handleChange}
                className={`input-text ${errosCampo.nome ? 'input-error' : 'input-text-endereco'}`}
                placeholder="Digite seu endereço"
              />
            </div>
            <div className="input-group-endereco numero">
              <label htmlFor="numero">Número:<span className="text-required">*</span></label>
              <input
                id="numero"
                name="numero"
                type="text"                
                maxLength={10}
                value={formData.numero}
                onChange={handleChange}
                className={`input-text ${errosCampo.numero ? 'input-error' : 'input-text-endereco'}`}
                placeholder="Nº"
              />
            </div>
          </div>

          <div className="cadastro-input-cidade">
            <div className="input-group-cidade cidade">
              <label htmlFor="cidade">Cidade:<span className="text-required">*</span></label>
              <input
                id="cidade"
                name="cidade"
                type="text"
                maxLength={100}             
                value={formData.cidade}
                onChange={handleChange}
                className={`input-text ${errosCampo.cidade ? 'input-error' : 'input-text-cidade'}`}
                placeholder="Cidade"
              />
            </div>
            <div className="input-group-cidade estado">
              <label htmlFor="estado">UF:<span className="text-required">*</span></label>
              <input
                id="estado"
                name="estado"
                type="text"
                maxLength={2}
                value={formData.estado}
                onChange={handleChange}
                className={`input-text ${errosCampo.estado ? 'input-error' : 'input-text-cidade'}`}
                placeholder="UF"
              />
            </div>
          </div>

          <div className="cadastro-input-senha">
            <div className="input-group-senha">
              <label htmlFor="senha">Senha:<span className="text-required">*</span></label>
              <input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                className={`input-text ${errosCampo.senha ? 'input-error' : 'input-text-senha'}`}
                maxLength={20}
                minLength={8}
                placeholder="Digite uma  senha"
              />
            </div>
            <div className="input-group-senha">
              <label htmlFor="confirmarsenha">Confirmar Senha:<span className="text-required">*</span></label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={`input-text ${errosCampo.confirmarSenha ? 'input-error' : 'input-text-senha'}`}
                maxLength={20}
                minLength={8}
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
                  id="termosAceito"
                  name="termosAceito"
                  checked={formData.termosAceito}
                  onChange={handleChange}
                  className="checkbox-termo"
                />
                <span className="checkmark"></span>
                Ao se cadastrar, você concorda com os nossos:
              </label>
              <p>
                <Link href="termos?#termosecondicoes" className="link-termo" passHref>Termos e Condições. </Link>
                {" "}e a nossa{" "} <Link href="/termos?#politicadeprivacidade" className="link-termo" passHref>
                  Política de Privacidade.
                </Link></p>
            </div>              
            {errosCampo.termosAceito && (
                <span className="erro-campo">* {errosCampo.termosAceito}</span>
              )}         
            {errosCampo.nome && <span className="erro-campo">* {errosCampo.nome}</span>}                   
            {errosCampo.email && <span className="erro-campo">* {errosCampo.email}</span>}     
            {errosCampo.cep && <span className="erro-campo">* {errosCampo.cep}</span>}
            {errosCampo.endereco && <span className="erro-campo">* {errosCampo.endereco}</span>}
            {errosCampo.numero && <span className="erro-campo">* {errosCampo.numero}</span>}            
            {errosCampo.cidade && <span className="erro-campo">* {errosCampo.cidade}</span>}
            {errosCampo.estado && <span className="erro-campo">* {errosCampo.estado}</span>}
            {errosCampo.senha && <span className="erro-campo">* {errosCampo.senha}</span>}
            {errosCampo.confirmarSenha && <span className="erro-campo">* {errosCampo.confirmarSenha}</span>}
          </div>
          <div className='group-btn'>
            <button
              type="submit"
              className="btn-enviar"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Registrar'}
            </button>
          </div>
          {mensagemErro && (
            <div className={mensagemErro.includes('sucesso') ? 'sucesso-mensagem' : 'erro-mensagem'}>
              {mensagemErro}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
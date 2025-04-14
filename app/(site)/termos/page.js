"use client";

import Link from "next/link"
import '../styles/Termos.css'


export default function TermosCadastro() {

  return (

    <>
      <div className='politica-container'>
        <section id="termosecondicoes">
        <div className='politica-content'>
          <h1>Política de Privacidade</h1>
          <p>Em nosso site, respeitamos a sua privacidade e estamos comprometidos em proteger as informações pessoais que você nos fornece. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos os seus dados pessoais.</p>

          <h2>1. Coleta de Informações</h2>
          <p>Quando você se cadastra em nosso site ou interage conosco, podemos coletar as seguintes informações:</p>
          <ul>
            <li>Nome</li>
            <li>E-mail</li>
            <li>Endereço</li>
          </ul>

          <h2>2. Uso das Informações</h2>
          <p>As informações que coletamos podem ser usadas para:</p>
          <ul>
            <li>Processar seu cadastro e fornecer acesso a funcionalidades exclusivas do site.</li>
            <li>Enviar newsletters e atualizações sobre nossos serviços.</li>
            <li>Melhorar a experiência do usuário em nosso site.</li>
          </ul>

          <h2>3. Armazenamento de Dados</h2>
          <p>Os dados que coletamos são armazenados de forma segura em nossos servidores. Tomamos medidas razoáveis para proteger suas informações pessoais contra perda, uso indevido e acesso não autorizado.</p>

          <h2>4. Compartilhamento de Dados</h2>
          <p>Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para cumprir a legislação ou para prestar os serviços que você solicitou.</p>

          <h2>5. Cookies</h2>
          <p>Utilizamos cookies para melhorar a sua experiência no site. Os cookies são pequenos arquivos armazenados no seu dispositivo para nos ajudar a lembrar de preferências e a personalizar o conteúdo.</p>

          <h2>6. Seus Direitos</h2>
          <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Caso deseje exercer algum desses direitos, entre em contato conosco.</p>

          <h2>7. Alterações na Política de Privacidade</h2>
          <p>Reservamo-nos o direito de alterar esta Política de Privacidade a qualquer momento. As mudanças serão publicadas nesta página, e a data da última atualização será sempre indicada no final.</p>

          <h2>8. Contato</h2>
          <p>Se você tiver dúvidas sobre nossa Política de Privacidade, entre em contato conosco através do e-mail <Link href={'mailto:contato@maiseconomico.com'} className='link-email' passHref>contato@maiseconomico.com</Link>.</p>
        </div>
        <div className='politica-content'>
          <p>Data da última atualização: <span className='color-data'>10 de abril de 2025</span></p>
        </div>
        </section>
        <section id="politicadeprivacidade">
        <div className='politica-content'>
          <h1>Termos e Condições</h1>
          <p>Ao acessar e utilizar este site, você concorda com os seguintes termos e condições. Por favor, leia com atenção antes de utilizar nossos serviços.</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>O uso deste site implica na aceitação total dos termos e condições descritos nesta página.</p>

          <h2>2. Modificações dos Termos</h2>
          <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor assim que publicadas no site.</p>

          <h2>3. Uso Permitido</h2>
          <p>Você concorda em utilizar o site apenas para fins lícitos e de forma que não infrinja os direitos de terceiros.</p>

          <h2>4. Propriedade Intelectual</h2>
          <p>Todo o conteúdo presente neste site, incluindo textos, imagens, logotipos e marcas, é de nossa propriedade ou licenciado. É proibida a reprodução sem autorização prévia.</p>

          <h2>5. Limitação de Responsabilidade</h2>
          <p>Não nos responsabilizamos por eventuais danos decorrentes da utilização do site ou de seus conteúdos.</p>

          <h2>6. Contato</h2>
          <p>Se você tiver dúvidas sobre estes Termos e Condições, entre em contato conosco pelo e-mail <Link href={'mailto:contato@maiseconomico.com'} className='link-email' passHref>contato@maiseconomico.com</Link>.</p>
        </div>

        <div className='politica-content'>
          <p>Data da última atualização: <span className='color-data'>10 de abril de 2025</span></p>
        </div>
        </section>
        
        <div className='politica-link'>
          <p className='politica-link'><Link href={'/cadastro/'}>Voltar para o cadastro</Link></p>
        </div>
      </div>
    </>
  );
}

// components/ModalAgradecimento.js
import React from 'react';
import Image from 'next/image'; 
import Link from 'next/link';   
import '../styles/ModalAgradecimento.css'; 

export default function ModalAgradecimentoReceita({ show, onClose }) {
  if (!show) return null;

    return (
        <div className="modal-agradecimento-container">
            <div className="modal-agradecimento-content">
                <h2 className="modal-tittle">Agradecemos pelo envio da sua receita!</h2>
                <div className="modal-descricao">
                    <p> Ela foi recebida com sucesso e será encaminhada para <span>análise e
                        aprovação.</span>  Assim que for avaliada, entraremos em contato ou ela
                        poderá ser visualizada em nossa plataforma. Muito obrigado por
                        contribuir com a nossa comunidade!</p>
                </div>
                <div className='group-btn'>
                    <Link href="/dashboard/" className="btn-back-link">
                    <button className="btn-back">Voltar</button>
                    </Link>
                </div>
                <div className='group-image'>
                    <Image
                        className="imagem-agradecimento"
                        alt="agradecimento de envio da receita"
                        src="/images/layout/recipe/send-recipe-thanks2.png"
                        width={316}
                        height={315} />
                </div>
            </div>
        </div>
    );
}
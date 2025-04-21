import React from 'react';
import Image from 'next/image'; 
import Link from 'next/link';   
import '../styles/ModalExcluirConta.css'; 

export default function ModalAviso({ show, onClose }) {
    if (!show) return null;

    return (
        <div class="modal-aviso-container">
            <Image class="fechar-icon" alt="" src="/images/layout/icons/fechar.png" width={24} height={24} />
            <div class="modal-aviso-content">
                <Image class="icon-aviso" alt="" src="/images/layout/icons/iconeaviso.png" width={50} height={50} />
                <h2 class="modal-aviso-tittle">Tem certeza de que deseja excluir sua conta?</h2>
                <p class="modal-aviso-descricao">Esta ação é irreversível e todos os seus dados serão </p>
            </div>
            <div class="modal-aviso-buttons">
                <Link href="/dashboard/" className="btn-sucesso-link">
                <button class="btn-cancelar">Cancelar</button>
                </Link>
                <button class="btn-excluir">Excluir</button>
            </div>
        </div>
    );
}   

export function ModalSucesso({ show, onClose }) {
    if (!show) return null;

    return (
        <div class="modal-sucesso-container">
            <Image class="fechar-icon" alt="" src="/images/layout/icons/fechar.png" width={24} height={24} />
            <div class="modal-sucesso-content">
                <Image class="icon-sucesso" alt="" src="/images/layout/icons/iconesucesso.png" width={50} height={50} />
                <h2 class="modal-sucesso-tittle">Sua conta foi excluída com sucesso!</h2>
                <p class="modal-sucesso-descricao">Sentiremos sua falta e esperamos vê-lo novamente no futuro!</p>
            </div>
            <div class="modal-sucesso-buttons">
                <Link href="/dashboard/" className="btn-sucesso-link">
                    <button class="btn-sucesso-voltar">Voltar para o inicio</button>
                </Link>
            </div>
        </div>
    );
}
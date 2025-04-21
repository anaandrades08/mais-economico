'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/UsuariosPage.css';
import { Users } from '../../../data/UserData';
import { formatarDataeHora, formatarData } from '../../../funcoes/Usuarios';
import { MenuLateral } from '../../menu_lateral.js';

export default function UsuarioAlterarAdmin() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);

    const [formData, setFormData] = useState({
        nome: '',
        datanascimento: '',
        endereco: '',
        numero: '',
        bairro: '',
        cep: '',
        cidade: '',
        uf: '',
        telefone: '',
        email: '',
        senha: '',
        tipo: '1',
        ativo: '1',
        image: '/images/usuario/fotodoperfil.png',
    });

    useEffect(() => {
        const foundUser = Users.find((r) => r.id === params.id || r.id.toString() === params.id);
        if (foundUser) {
            setUsuario(foundUser);
            setFormData({ ...foundUser });
        }
        setLoading(false);
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const limparFormulario = () => {
        setFormData({ ...usuario });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados alterados:', formData);
        // Aqui você envia os dados atualizados para o backend com fetch/axios
    };

    if (loading) {
        return <div className="admin-loading">Carregando...</div>;
    }

    if (!usuario) {
        return (
            <div className="usuario-admin-container">
                <MenuLateral />
                <div className="usuario-details-admin">
                    <h2>Usuário não encontrado</h2>
                </div>
            </div>
        );
    }
    return (
        <div className="usuario-admin-container">
            <MenuLateral />
            <section className="usuario-cadastro-admin">
                <h1>Aprovar Usuário - {formData.nome}</h1>
                <form className="usuario-cadastro-form" onSubmit={handleSubmit}>
                    <div className="usuario-cadastro-inputs">
                        <Image
                            src={formData.image}                            
                            alt={formData.nome}
                            width={100}
                            height={100}
                            className="usuario-foto-perfil"
                        />

                        <p>Para aprovar o usuário mude o status para ativo:</p>
                        <select name="ativo" value={formData.ativo} onChange={handleChange}>
                            <option value="1">Aprovar</option>
                            <option value="2">Reprovar</option>
                            <option value="0">Inativo</option>
                        </select>
                    </div>

                    <div className="usuario-cadastro-botoes">
                        <button type="submit">Aprovar Usuário</button>
                        <Link href={'/admin/usuarios/alterar/'} passHref><button type="button">Cancelar</button></Link>
                    </div>
                </form>
            </section>
        </div>
    )
}


import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/usuarios">Todos os Usuários</Link>
                    <Link href="/admin/usuarios/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/usuarios/alterar/">Atualizar</Link>
                    <Link href="/admin/usuarios/deletar/">Deletar</Link>
                    <Link href="/admin/usuarios/admins/">Usuários admins</Link>
                    <Link href="/admin/usuarios/novos/">Usuários novos</Link>
                    <Link href="/admin/usuarios/inativos/">Usuários inativos</Link>
                </nav>
            </div>
    )

}
import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/usuarios">Usuários</Link>
                    <Link href="/admin/usuarios/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/usuarios/alterar/">Atualizar</Link>
                    <Link href="/admin/usuarios/deletar/">Deletar</Link>
                    <Link href="/admin/usuarios?novo">Usuários novos</Link>
                    <Link href="/admin/usuarios?inativo">Usuários inativos</Link>
                </nav>
            </div>
    )

}
import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/usuarios/cadastrar/">Cadastrar novo usuário</Link>                   
                    <Link href="/admin/usuarios">Todos os Usuários</Link>
                    <Link href="/admin/usuarios/admins/">Usuários Admins</Link>
                    <Link href="/admin/usuarios/basicos/">Usuários Básicos</Link>
                    <Link href="/admin/usuarios/novos/">Usuários Novos</Link>
                    <Link href="/admin/usuarios/inativos/">Usuários Inativos</Link>
                    <Link href="/admin/usuarios/reprovados/">Usuários Reprovados</Link>
                </nav>
            </div>
    )

}
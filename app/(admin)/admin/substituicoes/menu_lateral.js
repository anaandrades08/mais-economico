import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/substituicoes">Substituições</Link>
                    <Link href="/admin/substituicoes/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/substituicoes/alterar/">Atualizar</Link>
                    <Link href="/admin/substituicoes/deletar/">Deletar</Link>
                    <Link href="/admin/substituicoes?novo">Substituições novos</Link>
                    <Link href="/admin/substituicoes?inativo">Substituições inativos</Link>
                </nav>
            </div>
    )

}
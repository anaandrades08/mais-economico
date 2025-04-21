import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/receitas">Receitas</Link>
                    <Link href="/admin/receitas/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/receitas/alterar/">Atualizar</Link>
                    <Link href="/admin/receitas/deletar/">Deletar</Link>
                    <Link href="/admin/receitas?novo">Receitas novas</Link>
                    <Link href="/admin/receitas?inativo">Receitas inativas</Link>
                </nav>
            </div>
    )

}
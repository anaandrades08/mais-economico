import Link from 'next/link';
export function MenuLateral() {


    return (
        <div className="usuario-admin-nav">
            <nav className="usuario-admin-nav-bar">
                <Link href="/admin/ingredientes-receita">Todos os Ingredientes Receita</Link>
                <Link href="/admin/ingredientes-receita/cadastrar/">Cadastrar Ingredientes Receita</Link>
                <Link href="/admin/modo-preparo-receita">Modo de preparo Receita</Link>
                <Link href="/admin/modo-preparo-receita/cadastrar/">Cadastrar Modo de preparo</Link>
                <Link href="/admin/receitas">Todas as Receitas</Link>
            </nav>
        </div>
    )

}
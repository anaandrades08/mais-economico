import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">                    
                    <Link href="/admin/receitas/cadastrar/">Cadastrar Receita</Link>
                    <Link href="/admin/receitas">Todas as Receitas</Link>
                    <Link href="/admin/receitas/novas">Receitas Novas</Link>
                    <Link href="/admin/receitas/inativas">Receitas Inativas</Link>
                    <Link href="/admin/receitas/aprovadas">Receitas Aprovadas</Link>
                    <Link href="/admin/receitas/reprovadas">Receitas Reprovadas</Link>
                </nav>
            </div>
    )

}
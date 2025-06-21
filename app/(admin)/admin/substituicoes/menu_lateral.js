import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/substituicoes">Todas as Substituições</Link>
                    <Link href="/admin/substituicoes/cadastrar/">Cadastrar Substituições</Link>
                </nav>
            </div>
    )

}
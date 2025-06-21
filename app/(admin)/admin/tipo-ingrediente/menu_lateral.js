import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">                    
                    <Link href="/admin/ingredientes">Todos os Ingredientes</Link>                    
                    <Link href="/admin/ingredientes/cadastrar/">Cadastrar Ingredientes</Link>
                    <Link href="/admin/tipo-ingrediente">Tipos de Ingredientes</Link>
                    <Link href="/admin/tipo-ingrediente/cadastrar">Cadastrar Tipos de Ing.</Link>
                </nav>
            </div>
    )

}
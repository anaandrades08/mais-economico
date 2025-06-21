import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">                    
                    <Link href="/admin/categorias/cadastrar/">Cadastrar Categoria</Link>
                    <Link href="/admin/categorias">Todas as Categorias</Link>
                </nav>
            </div>
    )

}
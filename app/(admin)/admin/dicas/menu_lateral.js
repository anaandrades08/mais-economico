import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">  
                    <Link href="/admin/dicas">Todas as Dicas</Link>                
                    <Link href="/admin/dicas/cadastrar/">Cadastrar Dica</Link>
                </nav>
            </div>
    )

}
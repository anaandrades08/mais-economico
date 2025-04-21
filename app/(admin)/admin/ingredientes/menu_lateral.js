import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/ingredientes">Ingredientes</Link>
                    <Link href="/admin/ingredientes/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/ingredientes/alterar/">Atualizar</Link>
                    <Link href="/admin/ingredientes/deletar/">Deletar</Link>
                    <Link href="/admin/ingredientes">Tipos de Ingredientes</Link>
                    <Link href="/admin/ingredientes/tipos/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/ingredientes/tipos/alterar/">Atualizar</Link>
                    <Link href="/admin/ingredientes/tipos/deletar/">Deletar</Link>
                    <Link href="/admin/ingredientes">Unidades de Medidas</Link>
                    <Link href="/admin/ingredientes/unidades/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/ingredientes/unidades/alterar/">Atualizar</Link>
                    <Link href="/admin/ingredientes/unidades/deletar/">Deletar</Link>
                </nav>
            </div>
    )

}
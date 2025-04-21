import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/feedbacks">Feedbacks</Link>
                    <Link href="/admin/feedbacks/cadastrar/">Cadastrar</Link>
                    <Link href="/admin/feedbacks/alterar/">Atualizar</Link>
                    <Link href="/admin/feedbacks/deletar/">Deletar</Link>
                    <Link href="/admin/feedbacks?novo">Feedbacks novos</Link>
                    <Link href="/admin/feedbacks?inativo">Feedbacks inativos</Link>
                </nav>
            </div>
    )

}
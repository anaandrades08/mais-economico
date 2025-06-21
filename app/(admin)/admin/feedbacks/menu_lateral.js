import Link from 'next/link';
export function MenuLateral() {


    return(
            <div className="usuario-admin-nav">
                <nav className="usuario-admin-nav-bar">
                    <Link href="/admin/feedbacks">Todos os Feedbacks</Link>
                    <Link href="/admin/feedbacks/cadastrar/">Cadastrar Feedback</Link>
                </nav>
            </div>
    )

}
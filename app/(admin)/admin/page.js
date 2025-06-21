
import AdminMain from './components/Main';

export const metadata = {
  title: {
    default: 'Painel Administrativo | +EconômicoReceitas ',
    template: '%s | ADM +EconômicoReceitas'
  },
  description: 'Admin do Site de receitas culinárias com as melhores receitas caseiras',
  keywords: ['receitas', 'culinária', 'comida', 'bolos', 'tortas'],
  authors: [{ name: 'Ana A.' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://seusite.com',
    siteName: 'Admin +Economico Receitas',
  },
};

export default function AdminPage() {


  return <AdminMain />;
}

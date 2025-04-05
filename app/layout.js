import './styles/globals.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

export const metadata = {
  title: {
    default: '+Econômico Receitas | Página Principal', // Para a home
    template: '%s | +Econômico Receitas' // Para páginas filhas
  },
  description: 'Site de receitas culinárias com as melhores receitas caseiras',
  keywords: ['receitas', 'culinária', 'comida', 'bolos', 'tortas'],
  authors: [{ name: 'Seu Nome' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://seusite.com',
    siteName: 'Receitas Deliciosas',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
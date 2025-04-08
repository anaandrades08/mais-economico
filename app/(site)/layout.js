import './styles/globals.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})


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
    siteName: '+Economico Receitas',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.variable}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
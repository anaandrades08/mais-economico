import styles from '../styles/Footer.module.css';
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiPhone, FiBookOpen, FiGlobe } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <Link href="/" passHref legacyBehavior>
            <a>
              <Image
                src="/images/layout/logo/logo-footer.png"
                alt="Logo do Site +Economico Receitas"
                width={85}
                height={91}
                className={styles.logo}
                priority
              />
            </a>
          </Link>
          <p className={styles.footerText}>
            O melhor site de receitas para todos os gostos e ocasiões.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Links Rápidos</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/" className={styles.footerLink}>Inicio</Link></li>
            <li><Link href="/pages/sobrenos" className={styles.footerLink}>Sobre Nós</Link></li>
            <li><Link href="/auth/envie-receita" className={styles.footerLink}>Envie sua Receita</Link></li>
            <li><Link href="/pages/mais-receita" className={styles.footerLink}>Mais Receitas</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contato</h3>
          <ul className={styles.footerContacts}>
            <li>
              <FiMail /> <a href="mailto:contato@maiseconomico.com" className={styles.footerLink} >contato@maiseconomico.com</a>
            </li>
            <li>
              <FiPhone /> <a href="tel:+55999999999" className={styles.footerLink} >(99) 99999-9999</a>
            </li>
            <li>
              <FiBookOpen /> <a href="https://sites.google.com/ufms.br/portfoliotin" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                TI - UFMS (AGEAD)
              </a>
            </li>
            <li>
              <FiGlobe /> <a href="https://www.ufms.br" target="_blank" className={styles.footerLink} rel="noopener noreferrer">
                Universidade Federal de MS
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className={styles.footerBottom}>
        <p>Todos os direitos Reservados &copy;  +EconômicoReceitas {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
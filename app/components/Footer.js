import styles from '../styles/Footer.module.css';
import Image from "next/image";
import Link from "next/link";
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
          <h3 className={styles.footerTitle}>Contato</h3>
          <ul className={styles.footerContacts}>
            <li>Email: contato@receitasdeliciosas.com</li>
            <li>Telefone: (11) 1234-5678</li>
            <li>Endereço: Rua das Receitas, 123</li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
        <h3 className={styles.footerTitle}>Links Rápidos</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/" className={styles.footerLink}>Inicio</Link></li>            
            <li><Link href="/pages/about-us" className={styles.footerLink}>Sobre Nós</Link></li>
            <li><Link href="/auth/send-recipe" className={styles.footerLink}>Envie sua Receita</Link></li>
            <li><Link href="/pages/more-recipe" className={styles.footerLink}>Mais Receitas</Link></li>
          </ul>
        </div>       
      </div>
      
      <div className={styles.footerBottom}>
        <p>Todos os direitos Reservados &copy;  +EconômicoReceitas {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
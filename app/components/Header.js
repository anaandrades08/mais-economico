"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { banners } from "../data/DicasEspeciaisData.js";  // Importando os dados de banners
import { categorias } from "../data/CategoriaData.js";  // Importando os dados de categorias


// Importando os dados de usuários
import { Users } from "../auth/data/UserData";
const userId = Users[0].id; 
const userName = Users[0].name; 

export default function Header() {

  //função Busca
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/pages/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    },
    [searchQuery, router]
  );

  // Submete ao pressionar Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  //menu de categorias visivel ou invisivel

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Navegação do banner
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Rotação automática
  useEffect(() => {
    const interval = setInterval(() => {
      nextBanner();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/" passHref legacyBehavior>
            <a>
              <Image
                src="/images/layout/logo/logo-header.png"
                alt="Logo do Site +Economico Receitas"
                width={250}
                height={75}
                className={styles.logo}
                priority
              />
            </a>
          </Link>
        </div>
        {/* Menu de Categorias Esconder ou Mostrar */}
        <div className={styles.categoryContainer}>
          <button
            className={`${styles.toggleButton} ${isMenuOpen ? styles.active : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu de categorias"
            aria-expanded={isMenuOpen}
          >
            <div className={styles.hamburger}>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </div>

            <span className={styles.toggleText}>Categorias</span>
          </button>
        </div>
        {/* Buscar receitas */}
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Buscar receitas..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Buscar receitas"
            >
              <Image
                src="/images/layout/icons/search-icon.png"
                alt="Buscar"
                width={20}
                height={20}
                priority
              />
            </button>
          </form>
        </div>
        {/* Menu de navegação do usuário */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href={`/auth/send-recipe/${userId}`} passHref legacyBehavior>
                <a className={styles.navLink}>
                  <div className={styles.iconContainer}>
                    <Image
                      src="/images/layout/icons/send_recipe.png"
                      alt="Enviar uma Receita"
                      width={24}
                      height={24}
                      className={styles.navIcon}
                    />
                  </div>
                  <span>Envie uma Receita</span>
                </a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={`/auth/my-favorit/${userId}`} passHref legacyBehavior>
                <a className={styles.navLink}>
                  <div className={styles.iconContainer}>
                    <Image
                      src="/images/layout/icons/favorit_recipe.png"
                      alt="Receitas Favoritas"
                      width={24}
                      height={24}
                      className={styles.navIcon}
                    />
                  </div>
                  <span>Favoritos</span>
                </a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={`/auth/user-profile/${userId}`} passHref legacyBehavior>
                <a className={styles.navLink}>
                  <div className={styles.iconContainer}>
                    <Image
                      src="/images/layout/icons/profile_user.png"
                      alt={`${userName}`} 
                      width={24}
                      height={24}
                      className={styles.navIcon}
                    />
                  </div>
                  <span>Perfil do Usuário</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Menu de Categorias Visivel */}
      <div
        className={`${styles.categoryMenu} ${isMenuOpen ? styles.show : ""}`}
      >
        <div className={styles.menuContent}>
          <ul className={styles.categoryList}>
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <Link href={`/pages/categoria/${categoria.id}`} >{categoria.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Carrossel de Banners Atualizado */}
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <Image
            src={banners[currentBanner].image}
            alt="Banner de Dicas Especiais"
            fill
            className={styles.bannerImage}
            priority
          />

          {/* Texto sobreposto no banner*/}
          <div className={styles.bannerText}>
            <h2 className={styles.bannerTitle}>
              {banners[currentBanner].title}
            </h2>
            <p className={styles.bannerDescription}>
              {banners[currentBanner].description}
            </p>
            <Link
              href={banners[currentBanner].ctaLink}
              className={styles.bannerCta}
            >
              {banners[currentBanner].ctaText}
            </Link>
          </div>

          {/* Botões de navegação */}
          <button className={`${styles.bannerNavButton} ${styles.prev}`} />
          <button className={`${styles.bannerNavButton} ${styles.next}`} />

          {/* Indicadores de banner */}
          <div className={styles.bannerIndicators}>
            {banners.map((_, index) => (
              <button
                key={index}
                className={`${styles.bannerIndicator} ${
                  index === currentBanner ? styles.active : ""
                }`}
                onClick={() => setCurrentBanner(index)}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

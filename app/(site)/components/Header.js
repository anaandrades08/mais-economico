"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { categorias } from "../data/CategoriaData.js"; 

//Importando os icones do react-icon
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";


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
            <CiSearch size={20} className={styles.shearchIcon} alt="Buscar" />
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
                  <BsSendPlus size={24} className={styles.navIcon} alt="Envie uma Receita" />
                  </div>
                  <span>Envie uma Receita</span>
                </a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={`/auth/my-favorit/${userId}`} passHref legacyBehavior>
                <a className={styles.navLink}>
                  <div className={styles.iconContainer}>
                  <MdFavoriteBorder size={24} className={styles.navIcon} alt="Favoritos" />
                    
                  </div>
                  <span>Favoritos</span>
                </a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href={`/auth/user-profile/${userId}`} passHref legacyBehavior>
                <a className={styles.navLink}>
                  <div className={styles.iconContainer}>
                  <BiUserCircle size={24} className={styles.navIcon} alt="Perfil do Usuário" />
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
    </>
  );
}

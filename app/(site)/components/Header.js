"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import { categorias } from "../data/CategoriaData.js";

//Importando os icones do react-icon
import { CiSearch } from "react-icons/ci";
//usuario logado
import { BsSendPlus } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { FiLogOut } from 'react-icons/fi';
//usuario publico
import { BiUserPlus, BiLogIn } from "react-icons/bi"
import { AiFillStar } from "react-icons/ai";


export default function Header() {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

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


  useEffect(() => {
    const storedUserId = localStorage.getItem('usuarioId');
    const storedEmail = localStorage.getItem('usuarioEmail');
    if (storedUserId) {
      setUserId(storedUserId);
      setUserEmail(storedEmail);
      console.log('Usuário logado com ID:', storedUserId, 'E-mail:', storedEmail);
    }
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer} id="topo">
          <Link href="/" passHref>
            <Image
              src="/images/layout/logo/logo-header.png"
              alt="Logo do Site +Economico Receitas"
              width={196}
              height={55}
              className={styles.logo}
              priority
            />
          </Link>
        </div>
        {/* Menu de Categorias Esconder ou Mostrar */}
        <div className={styles.categoryContainer} id="categorias">
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
        <div className={styles.searchContainer} id="busca">
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
        {/* Menu de navegação do usuário logado */}
        {userId ? (

          <nav className={styles.nav}>
            <ul className={styles.navList}>              
            <li className={`${styles.navItem} ${styles.navLink}`}>
                <Link href={`/dashboard/envie-receita/${userId}`} passHref>
                  <div className={styles.iconContainer}>
                    <BsSendPlus size={24} className={styles.navIcon} />
                  </div>
                  <span>Envie uma Receita</span>
                </Link>
              </li>              
              <li className={`${styles.navItem} ${styles.navLink}`}>
                <Link href={`/dashboard/favoritos/${userId}`}  passHref>
                  <div className={styles.iconContainer}>
                    <MdFavoriteBorder size={24} className={styles.navIcon} />
                  </div>
                  <span>Favoritos</span>
                </Link>
              </li>
              <li className={`${styles.navItem} ${styles.navLink}`}>
                <Link href={`/dashboard/perfil-usuario/${userId}`}  passHref>
                  <div className={styles.iconContainer}>
                    <BiUserCircle size={24} className={styles.navIcon} />
                  </div>
                  <span>Perfil do Usuário</span>
                </Link>
              </li>              
              <li className={`${styles.navItem} ${styles.navLink}`}>
                <Link href={`/dashboard/logout/${userId}`} passHref>
                  <div className={styles.iconContainer} >
                    <FiLogOut size={24} className={styles.navIcon} />
                  </div>
                  <span>Sair</span>
                </Link>
              </li>
            </ul>
          </nav>


        ) : (

          <nav className={styles.nav}>
            <ul className={styles.navList}>              
              <li className={`${styles.navItem} ${styles.navLink}`}>
                <Link href="/pages/dicas/" passHref >
                    <div className={styles.iconContainer}>
                      <AiFillStar size={24} className={styles.navIcon} />
                    </div>
                    <span>Dicas Especiais</span>
                </Link>
              </li>              
              <li className={`${styles.navItem} ${styles.navLink}`}>
                <Link href="/cadastro/" passHref >
                    <div className={styles.iconContainer}>
                      <BiUserPlus size={24} className={styles.navIcon} />
                    </div>
                    <span>Cadastre-se</span>
                </Link>
              </li>              
              <li className={`${styles.navItem} ${styles.navLink}`}>
                <Link href="/login/" passHref >
                    <div className={styles.iconContainer}>
                      <BiLogIn size={24} className={styles.navIcon} />
                    </div>
                    <span>Login</span>
                </Link>
              </li>
            </ul>
          </nav>

        )}


        {/* Menu de navegação do usuário logado */}

      </header>

      {/* Menu de Categorias Visivel */}
      <div
        className={`${styles.categoryMenu} ${isMenuOpen ? styles.show : ""}`}
      >
        <div className={styles.menuContent}>
          <ul className={styles.categoryList}>
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <Link href={`/pages/categoria/${categoria.id}`} passHref>{categoria.name}</Link>
              </li>
            ))}
            <li key="0">
              <Link href={`/pages/categoria/0`} passHref>Todas as Receitas</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

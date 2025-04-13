// components/RecipeBanner.js
"use client";
import styles from "../styles/RecipeBanner.module.css";
import Image from "next/image";
//react-icon
import { TbCoin } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { PiUserCircleFill } from "react-icons/pi";
import { MdFavoriteBorder } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";


export default function RecipeBanner({ recipe }) {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerContent}>
        <Image
          src={recipe.bannerImage || recipe.image} // Usa bannerImage se existir, senão usa a imagem normal
          alt={`Banner da receita ${recipe.nome}`}
          fill
          className={styles.bannerImage}
          priority
        />

        {/* Texto sobreposto no banner */}
        <div className={styles.bannerText}>
          <h2 className={styles.bannerTitle}>{recipe.nome}</h2>
          <div className={styles.bannerInfo}>
          <span>
            <TbCoin size={20} className={styles.icon}  />Custo:
            {recipe.custo || "Custo não especificado"}
          </span>
          <span>
            <FaRegClock size={20} className={styles.icon}  />Tempo de Preparo:
            {recipe.preparo || "Preparo não especificado"}
          </span>
          <span>
            <PiUserCircleFill size={20} className={styles.icon}  />
            {recipe.usuario || "Usuário não especificado"}
          </span>
          <span>
            <TbCalendarTime size={20} className={styles.icon}  />
            {recipe.tempo || "Tempo não especificado"}
          </span>
        </div>
        <div className={styles.bannerbtngroup}>
          <button className={styles.bannerbtnsalvar}><MdFavoriteBorder size={20} className={styles.iconBtn}  />Salvar Receita</button>
          <button className={styles.bannerbtncompartilhar}><FiShare2 size={20} className={styles.iconBtn}  />Compartilhar Receita</button>

        </div>
      </div>
    </div>
    </div >
  );
}
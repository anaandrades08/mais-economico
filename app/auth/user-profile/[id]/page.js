"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "../../../styles/UserDetail.module.css";
import { Users } from "../../data/UserData.js"; // Importando os dados dos usuários
import { FiMail, FiPhone, FiCalendar, FiMapPin } from "react-icons/fi";

export default function UserDetail() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Encontra o usuário pelo ID
    const foundUser = Users.find((u) => u.id.toString() === params.id);
    setUser(foundUser);
    setLoading(false);
  }, [params.id]);

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!user)
    return <div className={styles.notFound}>Usuário não encontrado</div>;

  if (!user) {
    return (
      <div className={styles.notFound}>
        <h2>Usuário não encontrado</h2>
        <Link href="/" className={styles.backLink}>
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.userContainer}>
      {/* Cabeçalho com foto e informações básicas */}
      <div className={styles.userHeader}>
        <div className={styles.userImageContainer}>
          <Image
            src={user.image || "/images/default-user.png"}
            alt={`Foto de ${user.name}`}
            width={150}
            height={150}
            className={styles.userImage}
          />
        </div>

        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{user.name}</h1>
          <p className={styles.userType}>{user.tipo}</p>

          <div className={styles.userMeta}>
            <span>
              <FiMail size={20} className={styles.icon} />
              {user.email}
            </span>
            <span>
              <FiPhone size={20} className={styles.icon} />
              {user.telefone}
            </span>
            <span>
              <FiCalendar size={20} className={styles.icon} />
              {user.datanascimento}
            </span>
          </div>
        </div>
      </div>

      {/* Informações de endereço */}
      <div className={styles.userSection}>
        <h2>Informações de Contato</h2>
        <p>
          <FiMapPin size={20} className={styles.icon} />
          <strong>Endereço:</strong> {user.endereco}
        </p>
        <p>
          <FiCalendar size={20} className={styles.icon} />
          <strong>Data de Cadastro:</strong> {user.datacadastro}
        </p>
      </div>

      {/* Receitas do usuário */}
      <div className={styles.userSection}>
        <h2>Receitas Publicadas ({user.receitas?.length || 0})</h2>

        {user.receitas?.length > 0 ? (
          <div className={styles.recipesGrid}>
            {user.receitas.map((recipe) => (
              <div key={recipe.id} className={styles.recipeCard}>
                <Link href={`../../pages/receita/${recipe.id}`}>
                  <div className={styles.recipeImageContainer}>
                    <Image
                      src={recipe.img}
                      alt={recipe.titulo}
                      width={200}
                      height={150}
                      className={styles.recipeImage}
                    />
                  </div>
                  <h3>{recipe.titulo}</h3>
                  <div className={styles.recipeMeta}>
                    <span>{recipe.tempoPreparo} min</span>
                    <span>{recipe.porcoes} porções</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Este usuário ainda não publicou receitas.</p>
        )}
      </div>

      {/* Botão de voltar */}
      <div className={styles.backButtonContainer}>
        <Link href="/" className={styles.backButton}>
          Voltar para lista de usuários
        </Link>
      </div>
    </div>
  );
}

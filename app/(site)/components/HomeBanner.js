"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/HomeBanner.module.css";  

export default function HomeBanner() {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [dicas, setDicas] = useState([]); 
    const [errorDica, setErrorDica] = useState(null);     
    const [loadingDicas, setLoadingDicas] = useState(true);

    useEffect(() => {
        const fetchDicasAtivas = async () => {
            try {
                const response = await fetch('/api/dicas/dicas-ativas/'); 
                const data = await response.json();

                if (response.ok) {
                    setDicas(data || []); // Garante que seja array mesmo se data for null/undefined
                } else {
                    setErrorDica('Erro ao carregar as dicas de banner');   
                }
            } catch (error) {
                setErrorDica('Erro ao tentar carregar as dicas de banner');
                console.error(error);
            }            
            setLoadingDicas(false);
        };

        fetchDicasAtivas();
    }, []);

    const nextBanner = () => {
        if (dicas.length > 0) {
            setCurrentBanner((prev) => (prev + 1) % dicas.length);
        }
    };

    const prevBanner = () => {
        if (dicas.length > 0) {
            setCurrentBanner((prev) => (prev - 1 + dicas.length) % dicas.length);
        }
    };

    // Rotação automática
   
    useEffect(() => {
        const interval = setInterval(() => {
            if (dicas.length > 0) {
                nextBanner();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [dicas]);

    if (loadingDicas) {
        return <div className="loading">Carregando dicas...</div>;
    }

    const currentDica = dicas[currentBanner] || {};

    return (
        <div className={styles.bannerContainer}>
            {errorDica && <p style={{ color: 'red' }}>{errorDica}</p>} {/* Exibe erro caso haja */}

            {/* Exibe o carrossel de dicas somente se houver dados */}
            {dicas.length > 0 ? (
                <div className={styles.bannerContent}>
                    {currentDica.img_dica && (
                        <Image
                            src={currentDica.img_dica}
                            alt={currentDica.titulo ? `Imagem da dica ${currentDica.titulo}` : 'Imagem de dica culinária'}
                            fill
                            className={styles.bannerImage}
                            priority
                        />
                    )}

                    <div className={styles.bannerText}>
                        <h2 className={styles.bannerTitle}>
                            {currentDica.titulo} {/* Título da dica */}
                        </h2>
                        <p className={styles.bannerDescription}>
                            {currentDica.descricao} {/* Descrição da dica */}
                        </p>
                        <Link
                            href={`pages/categoria/${currentDica.id_categoria}`} // Link para categoria
                            className={styles.bannerCta}
                        >
                            {currentDica.cta_text} {/* Texto do CTA */}
                        </Link>
                    </div>

                    <button className={`${styles.bannerNavButton} ${styles.prev}`} onClick={prevBanner} />
                    <button className={`${styles.bannerNavButton} ${styles.next}`} onClick={nextBanner} />

                    {/* Indicadores de banner */}
                    <div className={styles.bannerIndicators}>
                        {dicas.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.bannerIndicator} ${index === currentBanner ? styles.active : ""}`}
                                onClick={() => setCurrentBanner(index)}
                                aria-label={`Ir para banner ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <p>Nenhuma dica disponível no momento</p>
            )}
        </div>
    );
}

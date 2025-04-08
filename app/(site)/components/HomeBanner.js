"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/HomeBanner.module.css";
import { banners } from "../data/DicasEspeciaisData.js";  


export default function HomeBanner() {



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

    return (
        <>
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
                                className={`${styles.bannerIndicator} ${index === currentBanner ? styles.active : ""
                                    }`}
                                onClick={() => setCurrentBanner(index)}
                                aria-label={`Ir para banner ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
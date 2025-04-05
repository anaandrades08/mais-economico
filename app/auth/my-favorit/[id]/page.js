'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../styles/UserDetail.module.css'


export default function MyFavorit() {
 
  return (
    <div className={styles.notFound}>
      <h2>Favoritos não encontrados</h2>
      <Link href="/" className={styles.backLink}>
        Voltar para a página inicial
      </Link>
    </div>
  )
}

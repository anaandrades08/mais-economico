'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../styles/UserDetail.module.css'

export default function SendFeedback() {
 
  return (
    <div className={styles.notFound}>
      <h2>Envie seu Feedback</h2>
      <Link href="/" className={styles.backLink}>
        Voltar para a página inicial
      </Link>
    </div>
  )
}

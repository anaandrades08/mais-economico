'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/Cadastro.css'

export default function DicasEspeciais() {
 
  return (
    <div className="notFound">
      <h2>Dicas Especiais</h2>
      <Link href="/" className="backLink">
        Voltar para a página inicial
      </Link>
    </div>
  )
}
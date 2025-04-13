'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function MinhasReceitas() {
 
  return (
    <div className="">
      <h2>Minhas Receitas</h2>
      <Link href="/" className="">
        Voltar para a página inicial
      </Link>
    </div>
  )
}
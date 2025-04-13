'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Feedback() {
 
  return (
    <div className="">
      <h2>Feedback</h2>
      <Link href="/" className="">
        Voltar para a página inicial
      </Link>
    </div>
  )
}
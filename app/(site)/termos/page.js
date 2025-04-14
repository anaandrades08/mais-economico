"use client";

import { Suspense } from "react";
import TermosCadastro from './termos-content';

export default function TermosPage() {
  return (
    <Suspense fallback={<div>Carregando termos...</div>}>
      <TermosCadastro />
    </Suspense>
  );
}
'use client'
import { useState } from 'react'
import { TbReplaceFilled, TbCoin } from 'react-icons/tb'
import { FaEquals } from 'react-icons/fa6'
import { listaIngredientesaSubstituicoes } from '../data/IngredientesData'

export default function SubstituiComponent() {
  const [original, setOriginal] = useState('')
  const [substituto, setSubstituto] = useState('')
  const [valorOriginal, setValorOriginal] = useState(0)
  const [valorSubstituto, setValorSubstituto] = useState(0)
  const [diferenca, setDiferenca] = useState(null)

  const handleCalcular = () => {
    const itemOriginal = listaIngredientesaSubstituicoes.find(item => item.titulo === original)
    const itemSubstituto = listaIngredientesaSubstituicoes.find(item => item.titulo === substituto)

    if (itemOriginal && itemSubstituto) {
      setValorOriginal(itemOriginal.valor)
      setValorSubstituto(itemSubstituto.valor)
      setDiferenca(itemOriginal.valor - itemSubstituto.valor)
    }
  }

  useEffect(() => {
    setDiferenca(null)
  }, [original, substituto])

  return (
    <div className="substituicoesContainer">
      <h2 className="sectionTitle">SUBSTITUIÇÃO</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <select className="SelectAlimento" onChange={e => setOriginal(e.target.value)}>
          <option value="">🍴 Alimento 1</option>
          {listaIngredientesaSubstituicoes.map((item) => (
            <option key={item.id} value={item.titulo}>🍴 {item.titulo}</option>
          ))}
        </select>

        <button className='btnRplace' onClick={handleCalcular}>
          <TbReplaceFilled size={24} alt="Substitui ingrediente" />
        </button>

        <select className="SelectSubtistuicao" onChange={e => setSubstituto(e.target.value)}>
          <option value="">🍴 Substituto</option>
          {listaIngredientesaSubstituicoes.map((item) => (
            <option key={item.id} value={item.titulo}>🍴 {item.titulo}</option>
          ))}
        </select>

        <span className='Icon'>
          <FaEquals size={18} alt="retorna resultado " />
        </span>

        <div className="valor">
          <p className="icon">
            <TbCoin size={23} className="IconContainer" alt="Custo" />
          </p>
          <p className='ValorText'>Valor:</p>
          <p>R${valorSubstituto.toFixed(2)}</p>
        </div>
      </div>

      {diferenca !== null && (
        <p>
          {diferenca > 0
            ? `Produto R$${diferenca.toFixed(2)} mais barato que o original da receita.`
            : diferenca < 0
              ? `Produto R$${Math.abs(diferenca).toFixed(2)} mais caro que o original da receita.`
              : 'Produto com mesmo valor do original.'}
        </p>
      )}
    </div>
  )
}

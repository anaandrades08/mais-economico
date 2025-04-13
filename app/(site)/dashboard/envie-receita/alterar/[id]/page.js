'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../../../styles/EnvieReceita.css'
import { Users } from '../../../data/UserData'

export default function SendRecipe() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Encontra o usuário pelo ID
    const foundUser = Users.find((u) => u.id.toString() === params.id);
    setUser(foundUser);
    setLoading(false);
  }, [params.id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
  
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = '/icons/upload.svg'; // volta ao ícone padrão
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!user) return <div className="notFound">Usuário não encontrado</div>;

  if (!user) {
    return (
      <div className="notFound">
        <h2>Usuário não encontrado</h2>
        <Link href="/" className="backLink">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <>
      {/*Container*/}
      <div className="receita-container">
        <h2 className='receita-container-title'>Envie sua receita</h2>
        {/* div com a cor cinza */}
        <div className="receita-container-cinza">
          {/* div do form */}
          <div className="form-container">
            <form>
              <div className="form-top">
                <div className="form-left">
                  <h3>Sua receita</h3>
                  <div className="image-upload">
                    <label htmlFor="recipeImage">
                      <div className="image-placeholder">
                        <img id="preview" src="/icons/upload.svg" alt="" />
                      </div>
                    </label>

                    <input
                      type="file"
                      id="recipeImage"
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />

                    <button
                      className="btn-img"
                      type="button"
                      onClick={() => document.getElementById('recipeImage').click()}
                    >
                      Escolher uma imagem
                    </button>

                    <small>
                      Formato aceito: JPEG ou PNG<br />Tamanho menor que 10MB
                    </small>
                  </div>

                  <label className='custo'>Custo da Receita: <span className='erro-msg'>*</span></label>
                  <input type="text" placeholder="R$00,00" required />

                  <label className='custo'>Rendimento da Receita: <span className='erro-msg'>*</span></label>
                  <input type="text" placeholder="Quantidade..." required />
                </div>

                <div className="form-right">
                  <label>Título da Receita: <span className='erro-msg'>*</span></label>
                  <input type="text" placeholder="Qual título da receita?" required />

                  <label>Descrição: <span className='erro-msg'>*</span></label>
                  <textarea placeholder="Adicione uma descrição sobre a receita" required></textarea>

                  <label>Tempo de Preparo: <span className='erro-msg'>*</span></label>
                  <input type="text" placeholder="00:00h" required />

                  <label>Ingredientes: <span className='erro-msg'>*</span></label>
                  <textarea placeholder="Adicione um ingrediente por linha" required></textarea>
                </div>
              </div>

              <div className="prepare-section">
                <h3>Preparo</h3>
                <p>Se a receita precisar ir ao forno, por favor, indique a temperatura de cozimento.</p>

                <div className="steps">
                  <div className="step">
                    <h4>PASSO 1: <span className='erro-msg'>*</span></h4>
                    <input type="text" placeholder="Título opcional para etapa" />
                    <textarea placeholder="Digite o primeiro passo da receita" required></textarea>
                  </div>

                  <div className="step">
                    <h4>PASSO 2: <span className='erro-msg'>*</span></h4>
                    <input type="text" placeholder="Título opcional para etapa" />
                    <textarea placeholder="Digite o segundo passo da receita" required></textarea>
                  </div>
                </div>
              </div>

              <div className="checkbox-section">
                <input type="checkbox" id="checkbox" className='checkbox-aceito' />
                <label for="checkbox">Lorem ipsum dolor sit amet consectetur. Mattis ultricies nisi convallis magna. Lobortis nisi ac nulla sed mi condimentum cursus.</label>
              </div>
              <div className='group-btn'>
                <button type="submit" className="btn-button">Enviar</button>
                <button type="reset" className="btn-button">Limpar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

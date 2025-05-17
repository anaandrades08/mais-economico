import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/StarRating.css'; // Estilo opcional

const StarRating = ({ 
  totalStars = 5, 
  value = 0, 
  onChange, 
  readonly = false,
  showText = false // Nova prop para controlar se mostra o texto
}) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <label key={index}>
            {!readonly && (
              <input
                type="radio"
                name="rating"
                value={starValue}
                onChange={() => onChange && onChange(starValue)}
                style={{ display: 'none' }}
              />
            )}
            <FaStar
              className="star"
              size={26}
              aria-hidden="true"
              color={starValue <= (hover || value) ? '#FFD700 ' : '#ccc'}
              onMouseEnter={!readonly ? () => setHover(starValue) : undefined}
              onMouseLeave={!readonly ? () => setHover(null) : undefined}
            />
          </label>
        );
      })}
      
      {/* Adiciona o texto da avaliação */}
      {showText && (
        <div className="rating-text">
          {value > 0 ? (
            <span>
              Avaliação: {value} de {totalStars} {totalStars === 1 ? 'estrela' : 'estrelas'}
            </span>
          ) : (
            <span>Avaliação: 0 estrelas</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
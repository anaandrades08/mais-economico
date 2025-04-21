import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/StarRating.css'; // Estilo opcional
const StarRating = ({ totalStars = 5, initialRating = 0, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating); // Usa o valor do banco (countStar)
  const [hover, setHover] = useState(null);

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <label key={index}>
            {!readOnly && (
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => setRating(starValue)}
              />
            )}
            <FaStar
              className="star"
              size={28}
              color={starValue <= (hover || rating) ? '#FFD700' : '#ccc'}
              onMouseEnter={!readOnly ? () => setHover(starValue) : undefined}
              onMouseLeave={!readOnly ? () => setHover(null) : undefined}
            />
          </label>
        );
      })}
      {/* Opcional: Exibir texto com a avaliação */}
      {!readOnly && <p>Avaliação: {rating} de {totalStars} estrelas</p>}
    </div>
  );
};

export default StarRating;


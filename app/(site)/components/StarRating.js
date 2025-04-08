import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/StarRating.css'; // Estilo opcional

const StarRating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={starValue}
              onClick={() => setRating(starValue)}
            />
            <FaStar
              className="star"
              size={28}
              color={starValue <= (hover || rating) ? '#FFD700' : '#ccc'}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;

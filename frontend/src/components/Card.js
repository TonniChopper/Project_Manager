import React from 'react';
import './Card.css';

function Card({ children, className = '', hover = false, onClick, ...props }) {
  const cardClass = `card ${hover ? 'card-hover' : ''} ${className}`;

  return (
    <div className={cardClass} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

export default Card;

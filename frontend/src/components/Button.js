import React from 'react';
import './Button.css';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  icon = null,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button type={type} className={buttonClass} onClick={onClick} disabled={disabled} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export default Button;

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.body};
    background: ${props => props.theme.background?.primary || props.theme.colors?.gray50 || '#f9fafb'};
    color: ${props => props.theme.text?.primary || props.theme.colors?.gray900 || '#111827'};
    line-height: 1.6;
    transition: background 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
    color: ${props => props.theme.text?.primary || props.theme.colors?.gray900 || '#111827'};
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${props => props.theme.colors.primaryDark};
  }

  button {
    font-family: ${props => props.theme.fonts.body};
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea, select {
    font-family: ${props => props.theme.fonts.body};
    outline: none;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.background?.secondary || props.theme.colors?.gray100 || '#f3f4f6'};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 10px;
    transition: background 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  /* Selection styling */
  ::selection {
    background: ${props => props.theme.colors.primary};
    color: white;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Utility classes */
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  /* Loading states */
  .loading {
    pointer-events: none;
    opacity: 0.6;
  }

  /* Disabled states */
  .disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Focus visible for accessibility */
  :focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Print styles */
  @media print {
    body {
      background: white;
      color: black;
    }
  }
`;

export default GlobalStyles;

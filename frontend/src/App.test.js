import { render, screen } from '@testing-library/react';
import App from './App';

test('renders project manager', () => {
  render(<App />);
  const linkElement = screen.getByText(/project manager/i);
  expect(linkElement).toBeInTheDocument();
});

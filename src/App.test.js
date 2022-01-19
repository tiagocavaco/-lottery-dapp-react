import { render, screen } from '@testing-library/react';
import App from './App';

window.ethereum = {
  request() {}
}

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Lottery Contract/i);
  expect(linkElement).toBeInTheDocument();
});

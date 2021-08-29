import { render, screen } from '@testing-library/react';
import App from '../App';
import * as React from 'react';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Profile/i);

  expect(linkElement).toBeInTheDocument();
});
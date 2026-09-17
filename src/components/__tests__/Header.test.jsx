/**
 * Unit test for the Header component.
 * Kept minimal by design - this component has no logic of its own,
 * only rendering the title (read from the store) and a static icon.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', function HeaderTests() {
  it('renders the app title as a heading', function testTitleRendered() {
    render(<Header />);
    expect(screen.getByRole('heading', { name: "Tarik's Game of Life" })).toBeInTheDocument();
  });

  it('renders the glider icon', function testIconRendered() {
    render(<Header />);
    expect(document.querySelector('.app-icon')).toBeInTheDocument();
  });
});
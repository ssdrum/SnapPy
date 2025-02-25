import React from 'react';
import { render, screen, userEvent, waitFor } from '../test-utils';
import Header from '@/app/projects/header';

describe('Header', () => {
  it('renders Header correctly', () => {
    render(<Header userName='John Snow' userEmail='john@snow.ie' />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/john snow/i);
  });

  it('displays correct email when menu is opened', async () => {
    render(<Header userName='John Snow' userEmail='John@snow.ie' />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    // Wait for menu to appear
    await waitFor(() => {
      const email = screen.getByText(/john@snow\.ie/i);

      expect(email).toBeInTheDocument();
    });
  });
});

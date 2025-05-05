import React from 'react';
import { render, screen, userEvent, waitFor } from '../test-utils';
import Header from '@/app/projects/header';
import { Session } from '@/app/lib/session';

describe('Header', () => {
  const session: Session = {
    name: 'John Snow',
    email: 'john@snow.ie',
    image: 'someurl',
    id: 1,
  };

  it('renders Header correctly', () => {
    render(<Header session={session} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/john snow/i);
  });

  it('displays correct email when menu is opened', async () => {
    render(<Header session={session} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    // Wait for menu to appear
    await waitFor(() => {
      const email = screen.getByText(/john@snow\.ie/i);

      expect(email).toBeInTheDocument();
    });
  });

  it('displays avatar placeholder if user image fails to load', async () => {
    render(<Header session={{ ...session, image: undefined }} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    // Wait for menu to appear
    await waitFor(() => {
      const avatarPlaceholder = document.querySelector(
        '.mantine-Avatar-placeholder'
      );

      expect(avatarPlaceholder).toBeInTheDocument();
    });
  });
});

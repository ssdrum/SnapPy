'use client';

import { Button } from '@mantine/core';
import { signIn } from 'next-auth/react';

export default function SignInButton() {
  return (
    <Button size='lg' onClick={() => signIn('google')}>
      Start Coding
    </Button>
  );
}

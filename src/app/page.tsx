import { getUserSession } from './lib/session';
import SignInButton from './sign-in-button';
import { redirect } from 'next/navigation';
import { Session } from '@/app/lib/types';
import classes from './page.module.css';
import { Container, Text, Title } from '@mantine/core';

export default async function Home() {
  const session: Session = await getUserSession();
  if (session) {
    redirect('/projects');
  }

  return (
    <div className={classes.wrapper}>
      <Container size={1200} className={classes.inner}>
        <Title mb={15} className={classes.title}>
          Welcome to <span className={classes.logo}>Snap-Py</span>
        </Title>
        <Text className={classes.description} mb={30} c='dimmed'>
          Sign in to get started
        </Text>
        <SignInButton />
      </Container>
    </div>
  );
}

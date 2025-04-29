import { getUserSession } from './lib/session';
import SignInButton from './sign-in-button';
import { redirect } from 'next/navigation';
import { Session } from '@/app/lib/session';
import classes from './page.module.css';
import { Container, Text, Title, Flex } from '@mantine/core';

export default async function Home() {
  const session: Session = await getUserSession();
  if (session) {
    redirect('/projects');
  }

  return (
    <div className={classes.wrapper}>
      <Container size={800} className={classes.inner}>
        <Flex direction='column' align='center'>
          <Title mb={15} ta='center' className={classes.title}>
            Welcome to <span className={classes.logo}>SnapPy</span>
          </Title>
          <Text size='xl' mb={30} ta='center'>
            Build Python programs visually using blocks. Learn coding without
            worrying about syntax.
          </Text>
          <SignInButton />
        </Flex>
      </Container>
    </div>
  );
}

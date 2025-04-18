import { AppShellMain, Loader, Center, Stack, Text } from '@mantine/core';
import classes from '../editor.module.css';

interface LoadingScreenProps {
  message: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <AppShellMain className={classes.editorPageWrapper}>
      <Center style={{ height: '100%' }}>
        <Stack align='center'>
          <Loader color='blue' size='xl' />
          <Text size='lg' fw={500}>
            {message}
          </Text>
        </Stack>
      </Center>
    </AppShellMain>
  );
}

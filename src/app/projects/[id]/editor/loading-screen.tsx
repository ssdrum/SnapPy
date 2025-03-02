import { Center, Loader, Stack, Text, Title } from '@mantine/core';

export default function LoadingScreen() {
  return (
    <Center mt='200px'>
      <Stack align='center'>
        <Loader size='lg' />
        <Title order={2}>Loading...</Title>
        <Text c='dimmed'>Please wait while we set things up.</Text>
      </Stack>
    </Center>
  );
}

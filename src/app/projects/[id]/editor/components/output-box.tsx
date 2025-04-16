import React from 'react';
import { Text, ScrollArea, Title, Divider, Box } from '@mantine/core';
import classes from '../editor.module.css';

interface OutputBoxProps {
  output: string[];
}

export default function OutputBox({ output }: OutputBoxProps) {
  return (
    <Box className={classes.codeOutput}>
      <Title order={6} mb={5} fw={600} c='dimmed'>
        Output
      </Title>
      <Divider mb='xs' />
      <ScrollArea scrollbarSize={6} offsetScrollbars type='auto'>
        {output.length > 0 ? (
          output.map((line, i) => (
            <Text key={i} size='sm' ff='monospace' my={4}>
              {line}
            </Text>
          ))
        ) : (
          <Text size='sm' c='dimmed' fs='italic'>
            Run your code to see output here
          </Text>
        )}
      </ScrollArea>
    </Box>
  );
}

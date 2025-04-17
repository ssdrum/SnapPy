import React from 'react';
import { Text, ScrollArea, Title, Divider, Box } from '@mantine/core';
import classes from '../editor.module.css';
import { Output } from '../hooks/use-code-editor';

interface OutputBoxProps {
  output: Output;
  isRunning: boolean;
}

export default function OutputBox({ output, isRunning }: OutputBoxProps) {
  const shouldShowMessage = !isRunning && output.message.length > 0;
  const shouldShowPlaceholder = !isRunning && output.message.length === 0;

  return (
    <Box className={classes.codeOutput}>
      <Title order={6} mb={5} fw={600} c='dimmed'>
        Output
      </Title>
      <Divider mb='xs' />
      <ScrollArea scrollbarSize={6} offsetScrollbars type='auto'>
        {shouldShowMessage &&
          output.message.map((line, i) => (
            <Text
              key={i}
              size='sm'
              ff='monospace'
              my={4}
              c={output.error ? 'red' : undefined}
            >
              {line}
            </Text>
          ))}

        {shouldShowPlaceholder && (
          <Text size='sm' c='dimmed' fs='italic'>
            Run your code to see the output here
          </Text>
        )}
      </ScrollArea>
    </Box>
  );
}

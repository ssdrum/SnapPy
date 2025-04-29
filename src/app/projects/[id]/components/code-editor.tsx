import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import 'prismjs/components/prism-python';
import { Box } from '@mantine/core';
import classes from '../editor.module.css';

interface CodeEditorProps {
  code: string;
  handleCodeChange: (newCode: string) => void;
}

export default function CodeEditor({
  code,
  handleCodeChange,
}: CodeEditorProps) {
  // Adds line numbers
  // Source: https://codesandbox.io/p/sandbox/react-simple-editor-linenumbers-wy240?file=%2Fsrc%2Findex.js%3A17%2C1
  const highgligtWithLineNumbers = (code: string) => {
    return highlight(code, languages.python, 'python')
      .split('\n')
      .map(
        (line, i) =>
          `<span class="${classes.editorLineNumber}">${i}</span>${line}`
      )
      .join('\n');
  };

  return (
    <Box className={classes.codeEditorWrapper}>
      <Editor
        className={classes.codeEditor}
        value={code}
        onValueChange={(newCode) => handleCodeChange(newCode)}
        highlight={() => highgligtWithLineNumbers(code)}
        tabSize={4}
        padding={10}
      />
    </Box>
  );
}

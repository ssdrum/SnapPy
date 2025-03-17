import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import 'prismjs/components/prism-python';
import { Paper, rem } from '@mantine/core';
import classes from '../editor.module.css';

interface CodeEditorProps {
  code: string;
  handleCodeChange: (newCode: string) => void;
}

export default function CodeEditor({
  code,
  handleCodeChange,
}: CodeEditorProps) {
  return (
    <Paper className={classes.codeEditor}>
      <Editor
        value={code}
        onValueChange={(newCode) => handleCodeChange(newCode)}
        highlight={(code) => highlight(code, languages.python, 'python')}
        tabSize={4}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: rem(14),
          height: '100%',
          overflowY: 'auto',
        }}
      />
    </Paper>
  );
}

import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import 'prismjs/components/prism-python';

interface CodeEditorProps {
  code: string;
  handleCodeChange: (newCode: string) => void;
}

export default function CodeEditor({
  code,
  handleCodeChange,
}: CodeEditorProps) {
  // The editor component doesn't seem to handle server-side rendering well.
  // This is a workaround to ensure it always renders on the client.
  // More info at: https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Editor
      value={code}
      onValueChange={(newCode) => handleCodeChange(newCode)}
      highlight={(code) => highlight(code, languages.python, 'python')}
      tabSize={4}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  );
}

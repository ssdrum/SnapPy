import { useEffect, useState } from 'react';
import { PyodideInterface } from 'pyodide';
import { Block } from '../blocks/types';
import { generateCode } from '../code-generation/code-generation';
import { findBlockById, getBlocksSequence } from '../utils/utils';

const PYODIDE_CND = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full';

export interface Output {
  error: boolean;
  message: string[];
}

export default function useCodeEditor(
  canvas: Block[],
  entrypointBlockId: string | null
) {
  const initialMessage = '# Snap a block to the start block to generate code!';

  const [pyodide, setPyodide] = useState<PyodideInterface>();
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [code, setCode] = useState<string>(initialMessage);
  const [output, setOutput] = useState<Output>({ error: false, message: [] });
  const [isRunning, setIsRunning] = useState(false);

  // Effect for handling the entrypointBlockId change and setting code
  useEffect(() => {
    if (entrypointBlockId) {
      const startBlock = findBlockById(entrypointBlockId, canvas);
      if (!startBlock) {
        console.error(
          `Error in useCodeEditor: startBlock with id: ${entrypointBlockId} not found`
        );
        return;
      }

      setCode(generateCode(getBlocksSequence(startBlock, canvas)));
    } else {
      setCode(initialMessage);
    }
  }, [entrypointBlockId, canvas]);

  // Load pyodide on first render
  useEffect(() => {
    async function loadPyodide() {
      try {
        setIsPyodideLoading(true);
        // Dynamically import to avoid SSR issues
        const { loadPyodide } = await import('pyodide');

        const pyodideInstance = await loadPyodide({
          indexURL: PYODIDE_CND,
          // Redirect outputs (default is console)
          stdout: (line: string) => {
            setOutput((prev) => ({
              ...prev,
              error: false,
              message: [...prev.message, line],
            }));
          },
          stderr: (line: string) => {
            setOutput((prev) => ({
              ...prev,
              error: true,
              message: [...prev.message, line],
            }));
          },
        });

        setPyodide(pyodideInstance);
        setIsPyodideLoading(false);
      } catch (err) {
        console.error('Error loading Pyodide:', err);
        alert(
          `Failed to load Pyodide: ${err instanceof Error ? err.message : String(err)}`
        );
        setIsPyodideLoading(false);
      }
    }

    loadPyodide();
    loadPyodide.toString(); // Avoids no unused variables error
  }, []);

  const handleCodeChange = (newCode: string): void => {
    setCode(newCode);
  };

  const runPython = async () => {
    if (!pyodide) {
      alert('Pyodide is not loaded yet');
      return;
    }

    setIsRunning(true);

    try {
      // Clear previous outputs
      setOutput({ error: false, message: [] });

      // Run the code
      const result = await pyodide.runPythonAsync(code);

      // Add output to output message
      if (result && String(result)) {
        setOutput((prev) => ({ ...prev, message: [...prev.message, result] }));
      }

      return result;
    } catch (err) {
      setOutput({ error: true, message: formatError(String(err)) });
      return;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    code,
    handleCodeChange,
    pyodide,
    isPyodideLoading,
    runPython,
    isRunning,
    output,
  };
}

/**
 * Formats pyodide's error meessages to make them more user-friendly.
 */
function formatError(error: string) {
  const lines = error.split('\n');
  let startLineIndex = 0;
  // Find the first line of the error message that's useful for the user
  for (let i = 0; i < lines.length; i++) {
    // The first line of the error message that matters starts with File "<exec>"
    if (lines[i].trim().startsWith(`File "<exec>"`)) {
      startLineIndex = i;
      break;
    }
  }

  const formattedError = lines.slice(startLineIndex);
  formattedError[0] = formattedError[0].split(',')[1].trim(); // Remove the initial part of the message
  return formattedError;
}

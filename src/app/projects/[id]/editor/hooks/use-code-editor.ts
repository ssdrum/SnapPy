import { useEffect, useState } from 'react';
import { PyodideInterface } from 'pyodide';
import { Block } from '../blocks/types';
import { generateCode } from '../code-generation/code-generation';
import { findBlockById, getBlocksSequence } from '../utils/utils';

const PYODIDE_CND = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full';

export default function useCodeEditor(
  canvas: Block[],
  entrypointBlockId: string | null
) {
  const initialMessage = '// Snap a block to the start block to generate code!';
  const [code, setCode] = useState<string>(initialMessage);
  const [pyodide, setPyodide] = useState<PyodideInterface>();
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [error, setError] = useState('');
  const [output, setOutput] = useState<string[]>([]);

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
          stdout: (text: string) => {
            setOutput((prev) => [...prev, text]);
          },
          stderr: (text: string) => {
            setError((prev) => prev + text);
          },
        });

        setPyodide(pyodideInstance);
        setIsPyodideLoading(false);
      } catch (err) {
        console.error('Error loading Pyodide:', err);
        setError(
          `Failed to load Pyodide: ${err instanceof Error ? err.message : String(err)}`
        );
        setIsPyodideLoading(false);
      }
    }

    //loadPyodide();
    loadPyodide.toString(); // Avoids no unused variables error
  }, []);

  const handleCodeChange = (newCode: string): void => {
    setCode(newCode);
  };

  const runPython = async () => {
    if (!pyodide) {
      setError('Pyodide is not loaded yet');
      return;
    }

    try {
      // Clear previous outputs
      setOutput([]);
      setError('');

      // Run the code
      const result = await pyodide.runPythonAsync(code);

      // If the code returns a value (not just prints), add it to the output
      if (result && String(result)) {
        setOutput((prev) => [...prev, result]);
      }

      return result;
    } catch (err) {
      setError(`Execution Error: ${err}`);

      return;
    }
  };

  return {
    code,
    handleCodeChange,
    pyodide,
    isPyodideLoading,
    runPython,
    output,
    error,
  };
}

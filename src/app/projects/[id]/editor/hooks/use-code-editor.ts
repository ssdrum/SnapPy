import { useEffect, useState } from 'react';
import { PyodideInterface } from 'pyodide';

const PYODIDE_CND = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full';

export default function useCodeEditor() {
  const [code, setCode] = useState<string>(`print("Hello World!")`);
  const [pyodide, setPyodide] = useState<PyodideInterface>();
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [error, setError] = useState('');
  const [output, setOutput] = useState<string[]>([]);

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

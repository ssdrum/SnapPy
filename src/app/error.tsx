// source: nextjs.org/learn/dashboard-app/error-handling#handling-all-errors-with-errortsx

'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}

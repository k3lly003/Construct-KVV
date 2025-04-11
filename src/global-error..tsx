'use client'

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong with the entire application!</h2>
        <p>There was a critical error that prevented the app from loading.</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
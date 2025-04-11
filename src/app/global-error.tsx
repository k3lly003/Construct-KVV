'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
//   error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // ERROR-GLOBAL MUST INCLUDE HTML & BODY TAGS
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
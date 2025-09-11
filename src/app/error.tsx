"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800">
        <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
        <pre className="bg-red-100 rounded p-4 mb-4 border border-red-200 max-w-xl overflow-x-auto">{error.message}</pre>
        <button onClick={() => reset()} className="px-6 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition">Try again</button>
      </body>
    </html>
  );
}

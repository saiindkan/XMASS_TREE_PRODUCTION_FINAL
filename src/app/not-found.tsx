export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-yellow-900">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="px-6 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 transition">Go Home</a>
    </main>
  );
}

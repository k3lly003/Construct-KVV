
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        This page could not be found.
      </p>
      <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
        Go to home screen!
      </Link>
    </div>
  );
}
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8 items-center">
            <Link href="/" className="text-purple-600 font-bold text-xl">
              GiftlyAI
            </Link>
            <Link href="/" className="text-gray-800 hover:text-gray-600">
              Home
            </Link>
            <Link href="/profile-management" className="text-gray-800 hover:text-gray-600">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

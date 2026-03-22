import Link from "next/link";

export default function PublicNav() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-xl text-gray-900 hover:text-blue-600">
            🐾 PetTrack
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Adoptable Pets
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { SessionPayload } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/pets", label: "Pets" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/tags", label: "Tags" },
];

export default function AdminNav({ session }: { session: SessionPayload }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg text-gray-900">
              🐾 PetTrack Admin
            </Link>
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {session.name} ({session.role})
            </span>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Public site
            </Link>
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

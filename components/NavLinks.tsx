// components/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

type NavLink = {
  href: string extends `${"/"}/${string}` ? string : `/${string}`;
  label: string;
};

const sideNavLinks: NavLink[] = [
  { href: "/", label: "🏠 Home" },
  { href: "/secret-page-1", label: "🔒 Secret Page 1" },
  { href: "/secret-page-2", label: "✍️ Secret Page 2" },
  { href: "/secret-page-3", label: "👥 Secret Page 3" },
];

const NavLinks = memo(() => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 bg-white dark:bg-gray-900 py-2 border-b border-gray-300 dark:border-gray-700 rounded-full px-4">
      <ul className="flex justify-center gap-6 sm:text-sm md:text-md text-xs">
        {sideNavLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              prefetch={true}
              className={`${
                pathname === link.href
                  ? "text-blue-500 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-blue-500 transition-colors duration-200`}
            >
              <p className="flex items-center">{link.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

NavLinks.displayName = "NavLinks";
export default NavLinks;
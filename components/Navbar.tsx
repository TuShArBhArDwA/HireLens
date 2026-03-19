'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        🔍 <span>HireLens</span>
      </Link>
      <div className="navbar-links">
        <Link href="/screen" className={`nav-link ${pathname === '/screen' ? 'active' : ''}`}>
          Screen
        </Link>
        <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}

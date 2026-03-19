'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <Search size={18} strokeWidth={2.5} />
        <span>HireLens</span>
      </Link>
      <div className="navbar-links">
        <ThemeToggle />
        <div className="nav-divider" />
        <Link href="/screen" className={`nav-link ${pathname === '/screen' ? 'active' : ''}`}>
          Screen
        </Link>
        <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <div className="nav-divider" />
        <div style={{ marginLeft: 6, display: 'flex', alignItems: 'center' }}>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: { width: 30, height: 30 } } }} />
        </div>
      </div>
    </nav>
  );
}

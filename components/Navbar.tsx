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
        <Search size={20} />
        <span>HireLens</span>
      </Link>
      <div className="navbar-links">
        <ThemeToggle />
        <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
        <Link href="/screen" className={`nav-link ${pathname === '/screen' ? 'active' : ''}`}>
          Screen
        </Link>
        <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}

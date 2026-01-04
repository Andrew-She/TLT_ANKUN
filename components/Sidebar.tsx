'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Package,
  AlertCircle,
  LayoutDashboard,
  MapPin,
  Receipt,
  TrendingUp,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/quotes', label: 'Quotes', icon: FileText },
    { href: '/shipments', label: 'Shipments', icon: Package },
    { href: '/claims', label: 'Claims', icon: AlertCircle },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/addresses', label: 'Addresses', icon: MapPin },
    { href: '/invoices', label: 'Invoices', icon: Receipt },
    { href: '/variances', label: 'Variances', icon: TrendingUp },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <aside className="w-16 lg:w-64 bg-zinc-900 dark:bg-black min-h-screen flex flex-col border-r border-zinc-800">
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-yellow-400 p-2 rounded">
            <Package className="w-6 h-6 text-zinc-900" />
          </div>
          <span className="hidden lg:block text-xl font-bold text-white">
            ANKUN
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="hidden lg:block p-4 border-b border-zinc-800">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-yellow-400 text-zinc-900'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden lg:block font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-zinc-800 p-2 space-y-1">
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:block">Settings</span>
        </Link>

        <Link
          href="/help"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:block">Help</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-zinc-900">AL</span>
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Allen Long</p>
            <p className="text-xs text-zinc-500 truncate">CUSTOMER</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

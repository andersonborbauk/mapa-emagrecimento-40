'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard', label: 'Início', icon: '⌂' },
  { href: '/hoje', label: 'Hoje', icon: '☑' },
  { href: '/kit', label: 'Kit', icon: '▤' },
  { href: '/evolucao', label: 'Evolução', icon: '↗' },
  { href: '/perfil', label: 'Perfil', icon: '◐' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-border flex px-1.5 pt-2 pb-4">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center gap-0.5 py-1.5"
          >
            <span className={`text-lg ${active ? 'text-primary' : 'text-locked'}`}>{tab.icon}</span>
            <span className={`text-[10px] ${active ? 'text-primary font-bold' : 'text-inkSoft font-medium'}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

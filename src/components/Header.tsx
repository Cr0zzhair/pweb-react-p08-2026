import { useState } from 'react';
import {
  Briefcase,
  Compass,
  Menu,
  Plus,
  Scale,
  Sparkles,
  X,
} from 'lucide-react';
import type { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  applicationCount: number;
  offerCount: number;
  onOpenManualForm: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  applicationCount,
  offerCount,
  onOpenManualForm,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    badge?: number;
    icon: React.ReactNode;
  }> = [
    {
      id: 'explore',
      label: 'Eksplorasi Lowongan',
      icon: <Compass className="h-4 w-4" />,
    },
    {
      id: 'pipeline',
      label: 'War Room Pipeline',
      badge: applicationCount,
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      id: 'comparator',
      label: 'Offer Comparator',
      badge: offerCount,
      icon: <Scale className="h-4 w-4" />,
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-20 pt-4 text-[#003471] md:pt-6">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-16">
        <div className="relative flex items-center justify-between gap-3 rounded-[12px] border border-[#0a4fb9]/20 bg-white px-4 py-3.5 shadow-[0_12px_30px_#00347138] md:px-6">
          {/* Brand Identity — CIF style */}
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#003471] text-[#00f6ff] shadow-[0_3px_0_#0a4fb9]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 border-l border-[#0a4fb9]/20 pl-3 md:pl-4">
              <p className="truncate text-xs font-extrabold tracking-[0.14em] text-[#003471] uppercase">
                AKU MW MAGANG
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-[#0a4fb9]">
                Internship Command Center · Kapten
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-2 text-sm">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`cif-nav-link cursor-pointer ${
                        isActive ? 'cif-nav-link-active' : 'text-[#003471]'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {typeof item.badge === 'number' && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                            isActive
                              ? 'bg-[#00f6ff] text-[#003471]'
                              : 'bg-[#0a4fb9]/10 text-[#0a4fb9]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}

              <li className="ml-2">
                <button
                  type="button"
                  onClick={onOpenManualForm}
                  className="button border-[#0a4fb9] bg-[#0a4fb9] px-4 py-2.5 text-sm text-white shadow-[0_3px_0_#003471] hover:bg-[#003471]"
                >
                  <Plus className="h-4 w-4" />
                  Catat Lamaran
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenManualForm}
              className="button min-h-10 bg-[#0a4fb9] px-3 py-2 text-xs text-white shadow-[0_3px_0_#003471]"
            >
              <Plus className="h-4 w-4" />
              Catat
            </button>
            <button
              type="button"
              aria-label="Toggle menu navigasi"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[8px] border border-[#0a4fb9]/20 text-[#003471] hover:bg-[#0a4fb9]/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <nav
              aria-label="Navigasi mobile"
              className="animate-arrive absolute inset-x-0 top-[calc(100%+8px)] rounded-[12px] border border-[#0a4fb9]/20 bg-white p-3 shadow-[0_12px_30px_#00347138] lg:hidden"
            >
              <ul className="flex flex-col gap-1.5 text-sm">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectTab(item.id)}
                        className={`cif-nav-link w-full justify-between ${
                          isActive ? 'cif-nav-link-active' : 'text-[#003471]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </span>
                        {typeof item.badge === 'number' && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                              isActive
                                ? 'bg-[#00f6ff] text-[#003471]'
                                : 'bg-[#0a4fb9]/10 text-[#0a4fb9]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

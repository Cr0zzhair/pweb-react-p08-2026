import { useState } from 'react';
import { Menu, Plus, X } from 'lucide-react';
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

  const navItems: Array<{ id: ActiveTab; label: string; badge?: number }> = [
    { id: 'explore', label: 'Eksplorasi lowongan' },
    { id: 'pipeline', label: 'Pipeline lamaran', badge: applicationCount },
    { id: 'comparator', label: 'Perbandingan offer', badge: offerCount },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const navigation = (mobile = false) => (
    <nav aria-label={mobile ? 'Navigasi mobile' : 'Navigasi utama'}>
      <ul className={mobile ? 'flex flex-col' : 'flex flex-col gap-1'}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              >
                <span>{item.label}</span>
                {typeof item.badge === 'number' && (
                  <span className="tabular-nums">{item.badge}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <aside className="app-sidebar">
        <div>
          <p className="brand-name">AKU MW MAGANG</p>
          <p className="mt-1 text-sm text-muted">Ruang kerja pencarian magang</p>
        </div>

        <div className="mt-12">
          <p className="eyebrow mb-3 text-muted">Menu</p>
          {navigation()}
        </div>

        <div className="mt-auto">
          <button
            type="button"
            onClick={onOpenManualForm}
            className="button button-primary w-full justify-start"
          >
            <Plus className="h-4 w-4" />
            Catat lamaran
          </button>
          <p className="mt-5 text-xs text-muted">Internship Command Center</p>
        </div>
      </aside>

      <header className="mobile-header">
        <p className="brand-name">AKU MW MAGANG</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenManualForm}
            className="button button-primary min-h-10 px-3 py-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            Catat
          </button>
          <button
            type="button"
            aria-label="Toggle menu navigasi"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && <div className="mobile-navigation">{navigation(true)}</div>}
      </header>
    </>
  );
}

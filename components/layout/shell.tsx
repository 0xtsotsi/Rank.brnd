'use client';

/**
 * Layout Shell Component
 *
 * The main layout wrapper that combines the sidebar navigation,
 * top header bar, and main content area with responsive behavior.
 *
 * Uses Zustand store for state management of sidebar collapse and theme.
 */

import { useEffect } from 'react';
import { SidebarNavigation } from '@/components/navigation/sidebar-navigation';
import { TopHeaderBar } from '@/components/navigation/top-header-bar';
import { cn } from '@/lib/utils';
import {
  useSidebarCollapsed,
  useMobileSidebarOpen,
  useSetMobileSidebarOpen,
  initializeTheme,
} from '@/lib/ui-store';

interface ShellProps {
  children: React.ReactNode;
  /** Optional title for the header bar */
  title?: string;
  /** Breadcrumb items */
  breadcrumbs?: { label: string; href?: string }[];
}

export function Shell({ children, title, breadcrumbs }: ShellProps) {
  const sidebarCollapsed = useSidebarCollapsed();
  const mobileSidebarOpen = useMobileSidebarOpen();
  const setMobileSidebarOpen = useSetMobileSidebarOpen();

  // Initialize theme on mount
  useEffect(() => {
    const cleanup = initializeTheme();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <SidebarNavigation />

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300',
          'lg:ml-64',
          sidebarCollapsed && 'lg:ml-16'
        )}
      >
        {/* Top Header Bar */}
        <TopHeaderBar title={title} breadcrumbs={breadcrumbs} />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

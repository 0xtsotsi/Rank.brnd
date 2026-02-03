'use client';

/**
 * Layout Shell Component
 *
 * The main layout wrapper that combines the sidebar navigation,
 * top header bar, and main content area with responsive behavior.
 */

import { useState } from 'react';
import { SidebarNavigation } from '@/components/navigation/sidebar-navigation';
import { TopHeaderBar } from '@/components/navigation/top-header-bar';
import { cn } from '@/lib/utils';

interface ShellProps {
  children: React.ReactNode;
  /** Optional title for the header bar */
  title?: string;
  /** Breadcrumb items */
  breadcrumbs?: { label: string; href?: string }[];
}

export function Shell({ children, title, breadcrumbs }: ShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <SidebarNavigation
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300',
          'lg:ml-64',
          sidebarCollapsed && 'lg:ml-16'
        )}
      >
        {/* Top Header Bar */}
        <TopHeaderBar
          title={title}
          breadcrumbs={breadcrumbs}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

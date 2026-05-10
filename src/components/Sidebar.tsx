'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  MessageSquare,
  LayoutDashboard,
  History,
  ChevronLeft,
  ChevronRight,
  Bot,
  Settings,
  Wifi,
  WifiOff,
  Activity,
  Zap,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const navItems = [
  {
    key: 'nav-chat',
    href: '/',
    icon: MessageSquare,
    label: 'Task Chat',
    badge: null,
  },
  {
    key: 'nav-dashboard',
    href: '/bot-control-dashboard',
    icon: LayoutDashboard,
    label: 'Bot Dashboard',
    badge: null,
  },
  {
    key: 'nav-history',
    href: '/task-history',
    icon: History,
    label: 'Task History',
    badge: '247',
  },
];

const bottomItems = [
  {
    key: 'nav-settings',
    href: '#',
    icon: Settings,
    label: 'Settings',
  },
];

interface SidebarProps {
  botOnline?: boolean;
  activeTaskCount?: number;
}

export default function Sidebar({ botOnline = true, activeTaskCount = 0 }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-card border-r border-border
        sidebar-transition shrink-0 overflow-hidden
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-border shrink-0 ${collapsed ? 'justify-center px-0 py-4' : 'px-4 py-4 gap-3'}`}>
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-semibold text-sm text-foreground truncate tracking-tight">
              ManusBot
            </span>
          )}
        </div>
      </div>

      {/* Bot Status */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-lg bg-muted/50 border border-border flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full shrink-0 ${botOnline ? 'bg-primary pulse-dot' : 'bg-danger'}`} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate">
              {botOnline ? 'Bot Online' : 'Bot Offline'}
            </p>
            <p className="text-2xs text-muted-foreground truncate">
              {botOnline ? `${activeTaskCount} task${activeTaskCount !== 1 ? 's' : ''} active` : 'Container stopped'}
            </p>
          </div>
          {botOnline ? (
            <Wifi className="w-3.5 h-3.5 text-primary shrink-0" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-danger shrink-0" />
          )}
        </div>
      )}

      {collapsed && (
        <div className="flex justify-center mt-3 mb-1">
          <div className={`w-2 h-2 rounded-full ${botOnline ? 'bg-primary pulse-dot' : 'bg-danger'}`} />
        </div>
      )}

      {/* Nav Section Label */}
      {!collapsed && (
        <p className="px-4 pt-4 pb-1 text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
          Navigation
        </p>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-1 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-150
                ${isActive
                  ? 'bg-primary/10 text-primary font-medium' :'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {!collapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-2xs font-mono font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-secondary text-foreground rounded border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats — collapsed shows nothing, expanded shows mini stats */}
      {!collapsed && (
        <div className="mx-3 mb-2 px-3 py-2.5 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Container</span>
            <Activity className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xs text-muted-foreground">RAM</span>
            <span className="text-2xs font-mono text-foreground">1.2 GB / 4 GB</span>
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[30%] rounded-full bg-primary" />
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="px-2 pb-2 border-t border-border pt-2 flex flex-col gap-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                text-muted-foreground hover:bg-muted/60 hover:text-foreground
                transition-all duration-150
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-secondary text-foreground rounded border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* User / collapse toggle */}
        <div className={`flex items-center mt-1 pt-2 border-t border-border ${collapsed ? 'justify-center' : 'gap-2 px-1'}`}>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Admin</p>
              <p className="text-2xs text-muted-foreground truncate flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-primary" />
                NVIDIA API Active
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150 shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
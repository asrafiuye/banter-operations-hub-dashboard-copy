'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useI18n } from '@/lib/i18n/provider'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { NAV_GROUPS, type NavItem } from './nav-config'

export function isActivePath(pathname: string, href: string) {
  if (href === '/finance') return pathname === '/finance'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function BrandMark({ collapsed }: { collapsed?: boolean }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-mono text-sm font-bold text-sidebar-primary-foreground">
        B
      </span>
      {!collapsed && (
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-semibold tracking-wide text-sidebar-accent-foreground">BANTER</span>
          <span className="truncate text-[11px] text-sidebar-muted">{t('app.subtitle')}</span>
        </div>
      )}
    </div>
  )
}

function NavLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const { t } = useI18n()
  const { data } = useStore()
  const active = isActivePath(pathname, item.href)
  const count = item.badge?.(data) ?? 0
  const label = t(`nav.${item.key}`)
  const Icon = item.icon

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring',
        active && 'bg-sidebar-accent text-sidebar-accent-foreground',
        collapsed && 'justify-center px-0',
      )}
    >
      {active && <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary" />}
      <Icon className={cn('size-4 shrink-0', active ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground')} aria-hidden />
      {!collapsed && <span className="truncate">{label}</span>}
      {count > 0 && !collapsed && (
        <span className="ml-auto rounded-full bg-sidebar-primary/20 px-1.5 py-px font-mono text-[10px] font-semibold text-sidebar-primary tabular">
          {count}
        </span>
      )}
      {count > 0 && collapsed && <span aria-hidden className="absolute top-1 right-2 size-1.5 rounded-full bg-sidebar-primary" />}
      {count > 0 && <span className="sr-only">{t('nav.pendingCount', { count })}</span>}
    </Link>
  )

  if (!collapsed) return link
  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">
        {label}
        {count > 0 ? ` (${count})` : ''}
      </TooltipContent>
    </Tooltip>
  )
}

export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { t } = useI18n()
  const { can } = useStore()
  return (
    <nav aria-label={t('nav.main')} className="flex flex-col gap-4">
      {NAV_GROUPS.map((group) => {
        const items = group.items.filter((i) => can(i.perm))
        if (items.length === 0) return null
        return (
          <div key={group.key} className="flex flex-col gap-0.5">
            {!collapsed && (
              <span className="px-2.5 pb-1 text-[10px] font-semibold tracking-[0.08em] text-sidebar-muted uppercase">
                {t(`nav.groups.${group.key}`)}
              </span>
            )}
            {items.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
            ))}
          </div>
        )
      })}
    </nav>
  )
}

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { t } = useI18n()
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className={cn('flex h-14 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center px-0')}>
        <BrandMark collapsed={collapsed} />
      </div>
      <div className={cn('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')}>
        <SidebarNav collapsed={collapsed} />
      </div>
      <div className={cn('border-t border-sidebar-border p-3', collapsed && 'flex justify-center px-2')}>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-xs text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring"
          aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
        >
          {collapsed ? <PanelLeftOpen className="mx-auto size-4" aria-hidden /> : <PanelLeftClose className="size-4" aria-hidden />}
          {!collapsed && t('nav.collapse')}
        </button>
      </div>
    </aside>
  )
}

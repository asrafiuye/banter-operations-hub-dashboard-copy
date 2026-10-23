import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CalendarDays,
  CalendarCheck,
  ClipboardList,
  FileText,
  Handshake,
  History,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  Settings,
  TrendingUp,
  Users,
  Wallet,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import { invoiceRemaining, invoiceStatus } from '@/lib/calc'
import type { Permission } from '@/lib/permissions'
import type { AppData } from '@/lib/store'

export interface NavItem {
  key: string
  href: string
  icon: LucideIcon
  perm: Permission
  badge?: (d: AppData) => number
}

export interface NavGroup {
  key: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'overview',
    items: [{ key: 'dashboard', href: '/dashboard', icon: LayoutDashboard, perm: 'dashboard.view' }],
  },
  {
    key: 'operations',
    items: [
      {
        key: 'orders',
        href: '/orders',
        icon: ClipboardList,
        perm: 'orders.view',
        badge: (d) => d.orders.filter((o) => o.status === 'awaiting_approval').length,
      },
      {
        key: 'procurement',
        href: '/procurement',
        icon: Boxes,
        perm: 'procurement.view',
        badge: (d) =>
          d.orders.filter(
            (o) => ['approved', 'procurement'].includes(o.status) && (!o.supplierTerm || o.supplierTerm.approvalStatus === 'pending'),
          ).length,
      },
      { key: 'fulfillment', href: '/fulfillment', icon: CalendarDays, perm: 'fulfillment.view' },
      { key: 'partners', href: '/partners', icon: Handshake, perm: 'partners.view' },
      {
        key: 'issues',
        href: '/issues',
        icon: AlertTriangle,
        perm: 'issues.view',
        badge: (d) => d.issues.filter((i) => i.status !== 'resolved' && (i.severity === 'high' || i.severity === 'critical')).length,
      },
    ],
  },
  {
    key: 'finance',
    items: [
      { key: 'financeOverview', href: '/finance', icon: Landmark, perm: 'finance.view' },
      {
        key: 'receivables',
        href: '/finance/receivables',
        icon: TrendingUp,
        perm: 'finance.view',
        badge: (d) =>
          d.invoices.filter((i) => i.kind === 'client' && invoiceStatus(i, d.payments) === 'overdue').length,
      },
      {
        key: 'payables',
        href: '/finance/payables',
        icon: WalletCards,
        perm: 'finance.view',
        badge: (d) =>
          d.invoices.filter(
            (i) => i.kind === 'supplier' && invoiceRemaining(i, d.payments) > 0 && ['overdue', 'due_soon'].includes(invoiceStatus(i, d.payments)),
          ).length,
      },
      { key: 'cashFlow', href: '/finance/cash-flow', icon: BarChart3, perm: 'finance.view' },
      { key: 'invoices', href: '/finance/invoices', icon: ReceiptText, perm: 'finance.view' },
    ],
  },
  {
    key: 'people',
    items: [
      { key: 'employees', href: '/employees', icon: Users, perm: 'employees.view' },
      {
        key: 'attendance',
        href: '/attendance',
        icon: CalendarCheck,
        perm: 'attendance.view',
        badge: (d) => d.leaveRequests.filter((l) => l.status === 'pending').length,
      },
      {
        key: 'payroll',
        href: '/payroll',
        icon: Wallet,
        perm: 'payroll.view',
        badge: (d) => d.payrollRuns.filter((r) => r.status === 'submitted').length,
      },
    ],
  },
  {
    key: 'insights',
    items: [
      { key: 'reports', href: '/reports', icon: FileText, perm: 'reports.view' },
      { key: 'auditLog', href: '/audit-log', icon: History, perm: 'audit.view' },
    ],
  },
  {
    key: 'system',
    items: [{ key: 'settings', href: '/settings', icon: Settings, perm: 'dashboard.view' }],
  },
]

/** Secondary routes that are not top-level nav items but need a breadcrumb label. */
export const ROUTE_LABELS: Record<string, string> = {
  '/orders/new': 'nav.newOrder',
  '/services': 'nav.services',
  '/finance/payments': 'nav.payments',
  '/finance/accounts': 'nav.accounts',
}

import type { Role } from '@/lib/types'

export type Permission =
  | 'dashboard.view'
  | 'orders.view'
  | 'orders.edit'
  | 'procurement.view'
  | 'procurement.edit'
  | 'fulfillment.view'
  | 'fulfillment.edit'
  | 'partners.view'
  | 'partners.edit'
  | 'issues.view'
  | 'finance.view'
  | 'finance.edit'
  | 'finance.approve'
  | 'employees.view'
  | 'employees.edit'
  | 'attendance.view'
  | 'attendance.edit'
  | 'payroll.view'
  | 'payroll.edit'
  | 'payroll.approve'
  | 'salary.view'
  | 'bank.supplier.view'
  | 'bank.employee.view'
  | 'reports.view'
  | 'audit.view'
  | 'settings.manage'
  | 'orders.close_exception'

const ALL: Permission[] = [
  'dashboard.view',
  'orders.view',
  'orders.edit',
  'procurement.view',
  'procurement.edit',
  'fulfillment.view',
  'fulfillment.edit',
  'partners.view',
  'partners.edit',
  'issues.view',
  'finance.view',
  'finance.edit',
  'finance.approve',
  'employees.view',
  'employees.edit',
  'attendance.view',
  'attendance.edit',
  'payroll.view',
  'payroll.edit',
  'payroll.approve',
  'salary.view',
  'bank.supplier.view',
  'bank.employee.view',
  'reports.view',
  'audit.view',
  'settings.manage',
  'orders.close_exception',
]

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL,
  operations: [
    'dashboard.view',
    'orders.view',
    'orders.edit',
    'fulfillment.view',
    'fulfillment.edit',
    'partners.view',
    'issues.view',
    'procurement.view',
  ],
  procurement: [
    'dashboard.view',
    'orders.view',
    'procurement.view',
    'procurement.edit',
    'partners.view',
    'partners.edit',
    'issues.view',
    'bank.supplier.view',
  ],
  finance: [
    'dashboard.view',
    'orders.view',
    'procurement.view',
    'finance.view',
    'finance.edit',
    'issues.view',
    'reports.view',
    'audit.view',
    'payroll.view',
    'bank.supplier.view',
  ],
  hr: [
    'dashboard.view',
    'employees.view',
    'employees.edit',
    'attendance.view',
    'attendance.edit',
    'payroll.view',
    'payroll.edit',
    'salary.view',
    'bank.employee.view',
    'issues.view',
  ],
}

export function permissionsFor(roles: Role[]) {
  const set = new Set<Permission>()
  roles.forEach((r) => ROLE_PERMISSIONS[r].forEach((p) => set.add(p)))
  return set
}

export function maskAccount(value: string) {
  if (!value) return '—'
  return `•••• ${value.slice(-4)}`
}

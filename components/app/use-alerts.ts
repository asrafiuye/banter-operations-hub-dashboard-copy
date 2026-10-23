'use client'

import { useMemo } from 'react'
import { diffDays, invoiceRemaining, invoiceStatus, orderWorkingCapital } from '@/lib/calc'
import { TODAY } from '@/lib/data/seed'
import type { Permission } from '@/lib/permissions'
import { useStore } from '@/lib/store'
import type { Tone } from './primitives'

export interface AppAlert {
  id: string
  tone: Tone
  key: string
  vars: Record<string, string | number>
  href: string
  perm: Permission
  amount?: number
  date?: string
}

export function useAlerts() {
  const { data, can } = useStore()
  return useMemo(() => {
    const list: AppAlert[] = []
    for (const inv of data.invoices) {
      const st = invoiceStatus(inv, data.payments)
      const remaining = invoiceRemaining(inv, data.payments)
      if (remaining <= 0) continue
      if (inv.kind === 'client' && st === 'overdue') {
        list.push({ id: `ar-${inv.id}`, tone: 'danger', key: 'alerts.arOverdue', vars: { number: inv.number, days: diffDays(TODAY, inv.dueDate) }, href: '/finance/receivables', perm: 'finance.view', amount: remaining, date: inv.dueDate })
      }
      if (inv.kind === 'supplier' && (st === 'overdue' || st === 'due_soon')) {
        list.push({ id: `ap-${inv.id}`, tone: st === 'overdue' ? 'danger' : 'warning', key: st === 'overdue' ? 'alerts.apOverdue' : 'alerts.apDueSoon', vars: { number: inv.number }, href: '/finance/payables', perm: 'finance.view', amount: remaining, date: inv.dueDate })
      }
    }
    for (const o of data.orders) {
      if (o.status === 'awaiting_approval') {
        list.push({ id: `ap-o-${o.id}`, tone: 'warning', key: 'alerts.awaitingApproval', vars: { id: o.id }, href: `/orders/${o.id}`, perm: 'orders.view' })
      }
      if (o.status === 'approved' && !o.supplierTerm) {
        list.push({ id: `sup-${o.id}`, tone: 'warning', key: 'alerts.noSupplier', vars: { id: o.id }, href: `/procurement?order=${o.id}`, perm: 'procurement.view' })
      }
      if (o.supplierTerm?.approvalStatus === 'pending' && ['approved', 'procurement'].includes(o.status)) {
        const wc = orderWorkingCapital(o, data)
        list.push({ id: `wc-${o.id}`, tone: wc.risk === 'shortfall' ? 'danger' : wc.risk === 'attention' ? 'warning' : 'info', key: 'alerts.financeDecision', vars: { id: o.id }, href: `/orders/${o.id}?tab=finance`, perm: 'finance.view', amount: wc.maxDeficit })
      }
      if (o.status === 'fulfilled' && !o.fulfillment?.bastRef) {
        list.push({ id: `bast-${o.id}`, tone: 'warning', key: 'alerts.missingBast', vars: { id: o.id }, href: `/orders/${o.id}?tab=fulfillment`, perm: 'orders.view' })
      }
    }
    for (const i of data.issues) {
      if (i.status !== 'resolved' && i.severity === 'critical') {
        list.push({ id: `iss-${i.id}`, tone: 'danger', key: 'alerts.criticalIssue', vars: { title: i.title }, href: '/issues', perm: 'issues.view' })
      }
    }
    for (const r of data.payrollRuns) {
      if (r.status === 'submitted') list.push({ id: `pr-${r.period}`, tone: 'warning', key: 'alerts.payrollApproval', vars: { period: r.period }, href: '/payroll', perm: 'payroll.view' })
    }
    const pendingLeave = data.leaveRequests.filter((l) => l.status === 'pending').length
    if (pendingLeave > 0) list.push({ id: 'leave', tone: 'info', key: 'alerts.pendingLeave', vars: { count: pendingLeave }, href: '/attendance?tab=leave', perm: 'attendance.view' })

    const rank: Record<Tone, number> = { danger: 0, warning: 1, info: 2, neutral: 3, success: 4, muted: 5 }
    return list.filter((a) => can(a.perm)).sort((a, b) => rank[a.tone] - rank[b.tone])
  }, [data, can])
}

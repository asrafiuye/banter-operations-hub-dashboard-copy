'use client'

import type { InvoiceStatus, RiskLevel } from '@/lib/calc'
import { useI18n } from '@/lib/i18n/provider'
import type {
  ApprovalStatus,
  IssueStatus,
  OrderStatus,
  PayrollStatus,
  Priority,
  ScheduleStatus,
  Severity,
} from '@/lib/types'
import { StatusBadge, type Tone } from './primitives'

export const orderStatusTone: Record<OrderStatus, Tone> = {
  draft: 'muted',
  quotation: 'neutral',
  awaiting_approval: 'warning',
  approved: 'info',
  procurement: 'info',
  scheduled: 'info',
  in_progress: 'info',
  fulfilled: 'success',
  reconciliation: 'warning',
  closed: 'success',
  on_hold: 'muted',
  cancelled: 'danger',
}

export const invoiceStatusTone: Record<InvoiceStatus, Tone> = {
  paid: 'success',
  partial: 'info',
  overdue: 'danger',
  due_soon: 'warning',
  unpaid: 'neutral',
}

export const severityTone: Record<Severity, Tone> = {
  low: 'muted',
  medium: 'neutral',
  high: 'warning',
  critical: 'danger',
}

export const priorityTone: Record<Priority, Tone> = {
  low: 'muted',
  medium: 'neutral',
  high: 'warning',
  urgent: 'danger',
}

export const riskTone: Record<RiskLevel, Tone> = {
  safe: 'success',
  attention: 'warning',
  shortfall: 'danger',
}

export const scheduleTone: Record<ScheduleStatus, Tone> = {
  planned: 'neutral',
  confirmed: 'info',
  in_progress: 'info',
  done: 'success',
  delayed: 'danger',
}

const approvalTone: Record<ApprovalStatus, Tone> = {
  not_requested: 'muted',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

const issueTone: Record<IssueStatus, Tone> = { open: 'warning', in_progress: 'info', resolved: 'success' }
const payrollTone: Record<PayrollStatus, Tone> = { draft: 'muted', submitted: 'warning', approved: 'info', paid: 'success' }

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useI18n()
  return <StatusBadge tone={orderStatusTone[status]}>{t(`status.order.${status}`)}</StatusBadge>
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { t } = useI18n()
  return <StatusBadge tone={invoiceStatusTone[status]}>{t(`status.invoice.${status}`)}</StatusBadge>
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { t } = useI18n()
  return <StatusBadge tone={severityTone[severity]}>{t(`status.severity.${severity}`)}</StatusBadge>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { t } = useI18n()
  return (
    <StatusBadge tone={priorityTone[priority]} dot={false}>
      {t(`status.priority.${priority}`)}
    </StatusBadge>
  )
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const { t } = useI18n()
  return <StatusBadge tone={riskTone[risk]}>{t(`status.risk.${risk}`)}</StatusBadge>
}

export function ScheduleStatusBadge({ status }: { status: ScheduleStatus }) {
  const { t } = useI18n()
  return <StatusBadge tone={scheduleTone[status]}>{t(`status.schedule.${status}`)}</StatusBadge>
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const { t } = useI18n()
  return <StatusBadge tone={approvalTone[status]}>{t(`status.approval.${status}`)}</StatusBadge>
}

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const { t } = useI18n()
  return <StatusBadge tone={issueTone[status]}>{t(`status.issue.${status}`)}</StatusBadge>
}

export function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const { t } = useI18n()
  return <StatusBadge tone={payrollTone[status]}>{t(`status.payroll.${status}`)}</StatusBadge>
}

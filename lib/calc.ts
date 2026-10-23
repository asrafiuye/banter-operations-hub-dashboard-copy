import { TODAY } from '@/lib/data/seed'
import type {
  CashAccount,
  Client,
  Employee,
  Invoice,
  Order,
  OrderStatus,
  Payment,
  PayrollLine,
  PayrollRun,
  ScheduleEvent,
  Settings,
  SkerAgreement,
} from '@/lib/types'
import type { AppData } from '@/lib/store'

const DAY = 86_400_000

export function toDate(iso: string) {
  return new Date(iso.length === 10 ? `${iso}T00:00:00+07:00` : iso)
}

export function addDays(iso: string, days: number) {
  const d = toDate(iso.slice(0, 10))
  return jakartaDate(new Date(d.getTime() + days * DAY))
}

export function jakartaDate(d: Date) {
  return new Date(d.getTime() + 7 * 3_600_000).toISOString().slice(0, 10)
}

export function diffDays(a: string, b: string) {
  return Math.round((toDate(a.slice(0, 10)).getTime() - toDate(b.slice(0, 10)).getTime()) / DAY)
}

export function endOfMonth(iso: string) {
  const [y, m] = iso.split('-').map(Number)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(last).padStart(2, '0')}`
}

export const ACTIVE_STATUSES: OrderStatus[] = [
  'quotation',
  'awaiting_approval',
  'approved',
  'procurement',
  'scheduled',
  'in_progress',
  'fulfilled',
  'reconciliation',
]

const COMMITTED_STATUSES: OrderStatus[] = [
  'approved',
  'procurement',
  'scheduled',
  'in_progress',
  'fulfilled',
  'reconciliation',
]

export function orderTotals(o: Pick<Order, 'items' | 'otherCosts'>) {
  const sales = o.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const supplierCost = o.items.reduce((s, i) => s + i.qty * i.unitCost, 0)
  const otherCost = o.otherCosts
  const totalCost = supplierCost + otherCost
  const gross = sales - totalCost
  const margin = sales > 0 ? (gross / sales) * 100 : 0
  return { sales, supplierCost, otherCost, totalCost, gross, margin }
}

export function orderActuals(o: Order) {
  const est = orderTotals(o)
  const supplierCost = o.actualSupplierCost ?? null
  const otherCost = o.actualOtherCost ?? null
  const hasActual = supplierCost !== null || otherCost !== null
  const totalCost = (supplierCost ?? 0) + (otherCost ?? 0)
  const gross = hasActual ? est.sales - totalCost : null
  return { supplierCost, otherCost, totalCost, gross, hasActual, variance: hasActual ? totalCost - est.totalCost : 0 }
}

export function invoicePaid(inv: Invoice, payments: Payment[]) {
  return payments.reduce(
    (sum, p) => sum + p.allocations.filter((a) => a.invoiceId === inv.id).reduce((s, a) => s + a.amount, 0),
    0,
  )
}

export function invoiceRemaining(inv: Invoice, payments: Payment[]) {
  return Math.max(0, inv.amount - invoicePaid(inv, payments))
}

export type InvoiceStatus = 'paid' | 'partial' | 'overdue' | 'due_soon' | 'unpaid'

export function invoiceStatus(inv: Invoice, payments: Payment[], today = TODAY): InvoiceStatus {
  const paid = invoicePaid(inv, payments)
  if (paid >= inv.amount) return 'paid'
  if (inv.dueDate < today) return 'overdue'
  if (paid > 0) return 'partial'
  if (diffDays(inv.dueDate, today) <= 7) return 'due_soon'
  return 'unpaid'
}

export type AgingBucket = 'current' | 'd1_30' | 'd31_60' | 'd61_90' | 'd90_plus'
export const AGING_BUCKETS: AgingBucket[] = ['current', 'd1_30', 'd31_60', 'd61_90', 'd90_plus']

export function agingBucket(dueDate: string, today = TODAY): AgingBucket {
  const late = diffDays(today, dueDate)
  if (late <= 0) return 'current'
  if (late <= 30) return 'd1_30'
  if (late <= 60) return 'd31_60'
  if (late <= 90) return 'd61_90'
  return 'd90_plus'
}

export function accountBalance(acc: CashAccount, payments: Payment[]) {
  return payments
    .filter((p) => p.accountId === acc.id)
    .reduce((bal, p) => bal + (p.direction === 'in' ? p.amount : -p.amount), acc.openingBalance)
}

export function totalCash(data: Pick<AppData, 'cashAccounts' | 'payments'>) {
  return data.cashAccounts.filter((a) => a.active).reduce((s, a) => s + accountBalance(a, data.payments), 0)
}

export function computeDueDate(baseDate: string, sker: SkerAgreement) {
  if (sker.basis === 'month_end') return addDays(endOfMonth(baseDate), sker.termDays)
  const lag = sker.basis === 'invoice_received' ? sker.receiptLagDays : 0
  return addDays(baseDate, lag + sker.termDays)
}

export function expectedClientReceiptDate(order: Order, client: Client) {
  const completion = order.fulfillment?.actualEnd?.slice(0, 10) || order.requestedDate
  return computeDueDate(completion, client.sker)
}

export function payrollLineCalc(line: PayrollLine, employee: Employee | undefined, settings: Settings) {
  const gross = line.baseSalary + line.allowances + line.overtime + line.bonus
  const enrolled = employee?.bpjsEnrolled ?? false
  const bpjsKes = enrolled ? Math.round((line.baseSalary * settings.payroll.bpjsKesehatanPct) / 100) : 0
  const bpjsJht = enrolled ? Math.round((line.baseSalary * settings.payroll.bpjsJhtPct) / 100) : 0
  const bpjsJp = enrolled ? Math.round((line.baseSalary * settings.payroll.bpjsJpPct) / 100) : 0
  const pph21 = Math.round((gross * (employee?.taxRatePct ?? 0)) / 100)
  const deductions = bpjsKes + bpjsJht + bpjsJp + pph21 + line.otherDeductions
  return { gross, bpjsKes, bpjsJht, bpjsJp, pph21, deductions, net: gross - deductions }
}

export function payrollTotals(run: PayrollRun, employees: Employee[], settings: Settings) {
  return run.lines.reduce(
    (acc, l) => {
      const c = payrollLineCalc(l, employees.find((e) => e.id === l.employeeId), settings)
      acc.gross += c.gross
      acc.deductions += c.deductions
      acc.net += c.net
      if (l.paid) acc.paid += c.net
      else acc.unpaid += c.net
      acc.directLabor += Math.round((c.gross * l.directLaborPct) / 100)
      return acc
    },
    { gross: 0, deductions: 0, net: 0, paid: 0, unpaid: 0, directLabor: 0 },
  )
}

export type ForecastCategory = 'client_receipt' | 'supplier_payment' | 'opex' | 'payroll' | 'other_in' | 'other_out'
export type ForecastKind = 'planned' | 'estimate'

export interface ForecastItem {
  id: string
  date: string
  originalDate: string
  direction: 'in' | 'out'
  category: ForecastCategory
  kind: ForecastKind
  amount: number
  label: string
  orderId?: string
}

/**
 * Future cash movements only. Actual payments are never included here; remaining balances
 * (invoice amount minus allocated payments) are used so nothing is double-counted.
 */
export function forecastItems(data: AppData, today = TODAY): ForecastItem[] {
  const items: ForecastItem[] = []
  const push = (i: Omit<ForecastItem, 'date' | 'originalDate'> & { date: string }) =>
    items.push({ ...i, originalDate: i.date, date: i.date < today ? today : i.date })

  for (const inv of data.invoices) {
    const remaining = invoiceRemaining(inv, data.payments)
    if (remaining <= 0) continue
    push({
      id: `inv-${inv.id}`,
      date: inv.dueDate,
      direction: inv.kind === 'client' ? 'in' : 'out',
      category: inv.kind === 'client' ? 'client_receipt' : 'supplier_payment',
      kind: 'planned',
      amount: remaining,
      label: inv.number,
      orderId: inv.orderId,
    })
  }

  for (const o of data.orders) {
    if (!COMMITTED_STATUSES.includes(o.status)) continue
    const client = data.clients.find((c) => c.id === o.clientId)
    const t = orderTotals(o)
    const invoiced = data.invoices
      .filter((i) => i.kind === 'client' && i.orderId === o.id)
      .reduce((s, i) => s + i.amount, 0)
    if (client && t.sales - invoiced > 0) {
      push({
        id: `rcv-${o.id}`,
        date: expectedClientReceiptDate(o, client),
        direction: 'in',
        category: 'client_receipt',
        kind: 'estimate',
        amount: t.sales - invoiced,
        label: o.id,
        orderId: o.id,
      })
    }
    for (const st of o.supplierTerm?.stages ?? []) {
      if (st.invoiceId) continue
      push({
        id: `stg-${o.id}-${st.id}`,
        date: st.dueDate,
        direction: 'out',
        category: 'supplier_payment',
        kind: o.supplierTerm?.approvalStatus === 'approved' ? 'planned' : 'estimate',
        amount: st.amount,
        label: `${o.id} · ${st.label}`,
        orderId: o.id,
      })
    }
    if (!o.supplierTerm && t.supplierCost > 0) {
      push({
        id: `sup-${o.id}`,
        date: o.requestedDate,
        direction: 'out',
        category: 'supplier_payment',
        kind: 'estimate',
        amount: t.supplierCost,
        label: o.id,
        orderId: o.id,
      })
    }
    if (['approved', 'procurement', 'scheduled'].includes(o.status) && o.otherCosts > 0) {
      push({
        id: `oth-${o.id}`,
        date: o.requestedDate,
        direction: 'out',
        category: 'other_out',
        kind: 'estimate',
        amount: o.otherCosts,
        label: o.id,
        orderId: o.id,
      })
    }
  }

  for (const run of data.payrollRuns) {
    if (run.status === 'paid') continue
    const totals = payrollTotals(run, data.employees, data.settings)
    if (totals.unpaid <= 0) continue
    push({
      id: `pr-${run.period}`,
      date: run.payDate,
      direction: 'out',
      category: 'payroll',
      kind: 'planned',
      amount: totals.unpaid,
      label: run.period,
    })
  }

  for (const pe of data.plannedExpenses) {
    push({
      id: `pe-${pe.id}`,
      date: pe.date,
      direction: pe.direction,
      category: pe.category,
      kind: 'planned',
      amount: pe.amount,
      label: pe.description,
    })
  }

  return items.sort((a, b) => a.date.localeCompare(b.date))
}

export interface ForecastRow {
  date: string
  opening: number
  receipts: number
  supplierPayments: number
  opex: number
  payroll: number
  otherIn: number
  otherOut: number
  closing: number
}

export function forecastSeries(
  data: AppData,
  days: number,
  bucketDays = 1,
  filter?: (i: ForecastItem) => boolean,
  opening = totalCash(data),
  today = TODAY,
): ForecastRow[] {
  const items = forecastItems(data, today).filter((i) => (filter ? filter(i) : true))
  const rows: ForecastRow[] = []
  let balance = opening
  for (let d = 0; d < days; d += bucketDays) {
    const start = addDays(today, d)
    const end = addDays(today, Math.min(d + bucketDays, days))
    const inBucket = items.filter((i) => i.date >= start && i.date < end)
    const sum = (pred: (i: ForecastItem) => boolean) => inBucket.filter(pred).reduce((s, i) => s + i.amount, 0)
    const row: ForecastRow = {
      date: start,
      opening: balance,
      receipts: sum((i) => i.category === 'client_receipt'),
      supplierPayments: sum((i) => i.category === 'supplier_payment'),
      opex: sum((i) => i.category === 'opex'),
      payroll: sum((i) => i.category === 'payroll'),
      otherIn: sum((i) => i.category === 'other_in'),
      otherOut: sum((i) => i.category === 'other_out'),
      closing: 0,
    }
    row.closing = row.opening + row.receipts + row.otherIn - row.supplierPayments - row.opex - row.payroll - row.otherOut
    balance = row.closing
    rows.push(row)
  }
  return rows
}

export function flowsWithin(data: AppData, days: number, today = TODAY) {
  const end = addDays(today, days)
  const items = forecastItems(data, today).filter((i) => i.date < end)
  return {
    inflow: items.filter((i) => i.direction === 'in').reduce((s, i) => s + i.amount, 0),
    outflow: items.filter((i) => i.direction === 'out').reduce((s, i) => s + i.amount, 0),
  }
}

export type RiskLevel = 'safe' | 'attention' | 'shortfall'

export function orderWorkingCapital(order: Order, data: AppData, today = TODAY) {
  const t = orderTotals(order)
  const client = data.clients.find((c) => c.id === order.clientId)
  const receiptDate = client ? expectedClientReceiptDate(order, client) : order.requestedDate
  const stages = order.supplierTerm?.stages ?? []
  const stagePaid = (invoiceId?: string) => {
    if (!invoiceId) return false
    const inv = data.invoices.find((i) => i.id === invoiceId)
    return inv ? invoiceRemaining(inv, data.payments) === 0 : false
  }
  const openStages = stages.filter((s) => !stagePaid(s.invoiceId))
  const isAdvance = (s: (typeof stages)[number]) => s.trigger === 'on_order' || s.trigger === 'before_start'
  const advances = openStages.filter(isAdvance).reduce((s, st) => s + st.amount, 0)
  const subsequent = openStages
    .filter((s) => !isAdvance(s) && s.dueDate <= receiptDate)
    .reduce((s, st) => s + st.amount, 0)
  const preStart = ['draft', 'quotation', 'awaiting_approval', 'approved', 'procurement', 'scheduled'].includes(order.status)
  const otherInitial = preStart ? t.otherCost : 0
  const supplierFallback = !order.supplierTerm && preStart ? t.supplierCost : 0
  const initialRequirement = advances + otherInitial
  const laterRequirement = subsequent + supplierFallback
  const maxDeficit = initialRequirement + laterRequirement

  const availableCash = totalCash(data)
  const horizon = Math.max(1, diffDays(receiptDate, today) + 1)
  const all = forecastItems(data, today).filter((i) => i.date <= receiptDate && i.orderId !== order.id)
  const otherObligations = all.filter((i) => i.direction === 'out').reduce((s, i) => s + i.amount, 0)
  const expectedReceipts = all
    .filter((i) => i.direction === 'in' && i.kind === 'planned')
    .reduce((s, i) => s + i.amount, 0)

  const isCommitted = COMMITTED_STATUSES.includes(order.status)
  const extra = isCommitted
    ? undefined
    : (i: ForecastItem) => i.orderId !== order.id
  const series = forecastSeries(data, horizon, 1, extra)
  let minBalance = Math.min(availableCash, ...series.map((r) => r.closing))
  if (!isCommitted) {
    const outflowBeforeReceipt = maxDeficit
    minBalance -= outflowBeforeReceipt
  }
  const minCash = data.settings.minOperatingCash
  const cashGap = minBalance - minCash
  const buffer = (maxDeficit * data.settings.attentionBufferPct) / 100
  const risk: RiskLevel = cashGap < 0 ? 'shortfall' : cashGap < buffer ? 'attention' : 'safe'
  const nextAdvance = openStages.filter(isAdvance).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]

  return {
    ...t,
    advances,
    subsequent,
    receiptDate,
    initialRequirement,
    laterRequirement,
    maxDeficit,
    availableCash,
    otherObligations,
    expectedReceipts,
    minBalance,
    minCash,
    cashGap,
    risk,
    nextAdvanceDate: nextAdvance?.dueDate,
    needsFinanceApproval:
      advances >= data.settings.advanceApprovalThreshold ||
      maxDeficit >= data.settings.financeApprovalThreshold ||
      risk !== 'safe',
  }
}

export function scheduleConflicts(events: ScheduleEvent[]) {
  const conflicts = new Set<string>()
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i]
      const b = events[j]
      if (a.assigneeId !== b.assigneeId || a.status === 'done' || b.status === 'done') continue
      if (a.start < b.end && b.start < a.end && a.location !== b.location) {
        conflicts.add(a.id)
        conflicts.add(b.id)
      }
    }
  }
  return conflicts
}

export function closureChecklist(order: Order, data: AppData) {
  const s = data.settings.closure
  const clientInvoices = data.invoices.filter((i) => i.kind === 'client' && i.orderId === order.id)
  const supplierInvoices = data.invoices.filter((i) => i.kind === 'supplier' && i.orderId === order.id)
  const openIssues = data.issues.filter((i) => i.orderId === order.id && i.status !== 'resolved')
  const items = [
    { key: 'fulfillment', ok: (order.fulfillment?.completionPct ?? 0) >= 100, required: true },
    { key: 'proof', ok: !!order.fulfillment?.proofUploaded, required: s.requireProof },
    { key: 'bast', ok: !!order.fulfillment?.bastRef, required: s.requireBast },
    { key: 'supplierCosts', ok: order.closure.supplierCostsReconciled, required: true },
    { key: 'otherExpenses', ok: order.closure.otherExpensesRecorded, required: true },
    { key: 'clientInvoice', ok: clientInvoices.length > 0, required: s.requireInvoice },
    {
      key: 'supplierInvoices',
      ok: order.closure.supplierInvoicesReconciled && supplierInvoices.length > 0,
      required: true,
    },
    { key: 'payments', ok: order.closure.paymentsReviewed, required: true },
    { key: 'issues', ok: openIssues.length === 0 && order.closure.issuesReviewed, required: s.requireNoOpenIssues },
  ] as const
  const blocking = items.filter((i) => i.required && !i.ok)
  return { items, blocking, canClose: blocking.length === 0 }
}

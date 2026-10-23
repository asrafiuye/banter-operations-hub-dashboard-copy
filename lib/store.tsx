'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import * as seed from '@/lib/data/seed'
import { permissionsFor, type Permission } from '@/lib/permissions'
import type {
  AttendanceRecord,
  AuditEvent,
  AuditModule,
  CashAccount,
  Client,
  ClientApproval,
  Employee,
  FinancialDecision,
  FulfillmentRecord,
  Invoice,
  Issue,
  LeaveRequest,
  Order,
  OrderDocument,
  OrderStatus,
  OrderSupplierTerm,
  Payment,
  PayrollLine,
  PayrollRun,
  PayrollStatus,
  PlannedExpense,
  Role,
  ScheduleEvent,
  Service,
  Settings,
  SkerAgreement,
  Supplier,
} from '@/lib/types'

export interface AppData {
  clients: Client[]
  suppliers: Supplier[]
  services: Service[]
  employees: Employee[]
  orders: Order[]
  schedules: ScheduleEvent[]
  invoices: Invoice[]
  payments: Payment[]
  cashAccounts: CashAccount[]
  plannedExpenses: PlannedExpense[]
  payrollRuns: PayrollRun[]
  attendance: AttendanceRecord[]
  leaveRequests: LeaveRequest[]
  issues: Issue[]
  auditEvents: AuditEvent[]
  decisions: FinancialDecision[]
  settings: Settings
}

export interface CurrentUser {
  name: string
  email: string
  employeeId: string
  roles: Role[]
}

function initialData(): AppData {
  return {
    clients: seed.clients,
    suppliers: seed.suppliers,
    services: seed.services,
    employees: seed.employees,
    orders: seed.orders,
    schedules: seed.schedules,
    invoices: seed.invoices,
    payments: seed.payments,
    cashAccounts: seed.cashAccounts,
    plannedExpenses: seed.plannedExpenses,
    payrollRuns: seed.payrollRuns,
    attendance: seed.attendance,
    leaveRequests: seed.leaveRequests,
    issues: seed.issues,
    auditEvents: seed.auditEvents,
    decisions: [],
    settings: seed.defaultSettings,
  }
}

type AuditInput = Omit<AuditEvent, 'id' | 'timestamp' | 'user'>

function nowIso() {
  const d = new Date()
  const jkt = new Date(d.getTime() + 7 * 3_600_000).toISOString().slice(0, 19)
  return `${jkt}+07:00`
}

function nextSeq(ids: string[], prefix: string, pad = 4) {
  const max = ids.reduce((m, id) => {
    const n = Number(id.replace(prefix, ''))
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `${prefix}${String(max + 1).padStart(pad, '0')}`
}

function useStoreValue() {
  const [data, setData] = useState<AppData>(initialData)
  const [user, setUser] = useState<CurrentUser>({
    name: 'Rina Wijaya',
    email: 'rina@banter-demo.example',
    employeeId: 'E01',
    roles: ['owner'],
  })

  const actions = useMemo(() => {
    const commit = (mutate: (d: AppData) => AppData, audit?: AuditInput | AuditInput[]) => {
      setData((prev) => {
        const next = mutate(prev)
        if (!audit) return next
        const list = Array.isArray(audit) ? audit : [audit]
        let seq = prev.auditEvents.length
        const events = list.map((a) => ({
          ...a,
          id: `AU-${String(++seq).padStart(4, '0')}`,
          timestamp: nowIso(),
          user: user.name,
        }))
        return { ...next, auditEvents: [...events, ...next.auditEvents] }
      })
    }

    const patchOrder = (d: AppData, id: string, patch: (o: Order) => Order): AppData => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? patch(o) : o)),
    })

    return {
      nextOrderId: (d: AppData) => nextSeq(d.orders.map((o) => o.id), 'BTR-2026-'),

      createOrder(order: Order) {
        commit((d) => ({ ...d, orders: [order, ...d.orders] }), {
          action: 'order_created',
          module: 'orders',
          record: order.id,
          newValue: order.status,
        })
      },

      updateOrder(id: string, patch: Partial<Order>, audit?: Omit<AuditInput, 'record' | 'module'> & { module?: AuditModule }) {
        commit(
          (d) => patchOrder(d, id, (o) => ({ ...o, ...patch })),
          audit ? { module: 'orders', ...audit, record: id } : undefined,
        )
      },

      setOrderStatus(id: string, from: OrderStatus, to: OrderStatus, reason?: string) {
        commit((d) => patchOrder(d, id, (o) => ({ ...o, status: to })), {
          action: to === 'closed' ? 'order_closed' : 'order_status_changed',
          module: 'orders',
          record: id,
          previousValue: from,
          newValue: to,
          reason,
        })
      },

      recordApproval(id: string, approval: ClientApproval) {
        commit((d) => patchOrder(d, id, (o) => ({ ...o, approval })), {
          action: 'approval_recorded',
          module: 'orders',
          record: id,
          newValue: `${approval.status} · ${approval.reference || approval.approverName}`,
        })
      },

      setSupplierTerm(id: string, term: OrderSupplierTerm, reason?: string) {
        commit((d) => patchOrder(d, id, (o) => ({ ...o, supplierTerm: term })), {
          action: 'supplier_term_edited',
          module: 'procurement',
          record: id,
          newValue: `${term.supplierId} · ${term.type} · ${term.stages.length}`,
          reason,
        })
      },

      recordFulfillment(id: string, fulfillment: FulfillmentRecord) {
        commit((d) => patchOrder(d, id, (o) => ({ ...o, fulfillment })), {
          action: 'fulfillment_updated',
          module: 'fulfillment',
          record: id,
          newValue: `${fulfillment.completionPct}%`,
        })
      },

      addOrderDocument(id: string, doc: OrderDocument) {
        commit((d) => patchOrder(d, id, (o) => ({ ...o, documents: [...o.documents, doc] })), {
          action: 'document_uploaded',
          module: 'orders',
          record: id,
          newValue: doc.name,
        })
      },

      recordDecision(decision: Omit<FinancialDecision, 'id' | 'at' | 'by'>) {
        commit(
          (d) => ({
            ...d,
            decisions: [{ ...decision, id: `FD-${d.decisions.length + 1}`, at: nowIso(), by: user.name }, ...d.decisions],
            orders: d.orders.map((o) =>
              o.id === decision.orderId && o.supplierTerm
                ? {
                    ...o,
                    supplierTerm: {
                      ...o.supplierTerm,
                      approvalStatus:
                        decision.decision === 'approved' ? 'approved' : decision.decision === 'rejected' ? 'rejected' : 'pending',
                    },
                  }
                : o,
            ),
          }),
          { action: 'financial_decision', module: 'finance', record: decision.orderId, newValue: decision.decision, reason: decision.note },
        )
      },

      upsertSupplier(s: Supplier, isNew: boolean) {
        commit(
          (d) => ({ ...d, suppliers: isNew ? [...d.suppliers, s] : d.suppliers.map((x) => (x.id === s.id ? s : x)) }),
          { action: isNew ? 'supplier_created' : 'supplier_updated', module: 'partners', record: s.name },
        )
      },

      upsertService(s: Service, isNew: boolean) {
        commit(
          (d) => ({ ...d, services: isNew ? [...d.services, s] : d.services.map((x) => (x.id === s.id ? s : x)) }),
          { action: isNew ? 'service_created' : 'service_updated', module: 'partners', record: s.name },
        )
      },

      upsertEmployee(e: Employee, isNew: boolean, prevSalary?: number) {
        const audits: AuditInput[] = [
          { action: isNew ? 'employee_created' : 'employee_updated', module: 'employees', record: e.code },
        ]
        if (!isNew && prevSalary !== undefined && prevSalary !== e.baseSalary) {
          audits.push({
            action: 'employee_salary_updated',
            module: 'employees',
            record: e.code,
            previousValue: String(prevSalary),
            newValue: String(e.baseSalary),
          })
        }
        commit(
          (d) => ({ ...d, employees: isNew ? [...d.employees, e] : d.employees.map((x) => (x.id === e.id ? e : x)) }),
          audits,
        )
      },

      createInvoice(inv: Omit<Invoice, 'id'>) {
        commit(
          (d) => {
            const prefix = inv.kind === 'client' ? 'CI-' : 'SI-'
            const id = nextSeq(d.invoices.filter((i) => i.kind === inv.kind).map((i) => i.id), prefix, 2)
            return { ...d, invoices: [...d.invoices, { ...inv, id }] }
          },
          { action: 'invoice_created', module: 'finance', record: inv.number, newValue: String(inv.amount) },
        )
      },

      recordPayment(p: Omit<Payment, 'id'>) {
        commit(
          (d) => ({ ...d, payments: [...d.payments, { ...p, id: nextSeq(d.payments.map((x) => x.id), 'PAY-', 3) }] }),
          { action: 'payment_recorded', module: 'finance', record: p.reference, newValue: String(p.amount) },
        )
      },

      toggleReconciled(id: string) {
        commit(
          (d) => ({ ...d, payments: d.payments.map((p) => (p.id === id ? { ...p, reconciled: !p.reconciled } : p)) }),
          { action: 'payment_reconciled', module: 'finance', record: id },
        )
      },

      upsertCashAccount(acc: CashAccount, isNew: boolean) {
        commit(
          (d) => ({
            ...d,
            cashAccounts: isNew ? [...d.cashAccounts, acc] : d.cashAccounts.map((a) => (a.id === acc.id ? acc : a)),
          }),
          { action: isNew ? 'account_created' : 'account_updated', module: 'finance', record: acc.name },
        )
      },

      addAttendance(rec: Omit<AttendanceRecord, 'id'>) {
        commit(
          (d) => ({
            ...d,
            attendance: [
              ...d.attendance.filter((a) => !(a.employeeId === rec.employeeId && a.date === rec.date)),
              { ...rec, id: `AT-${rec.date}-${rec.employeeId}` },
            ],
          }),
          { action: 'attendance_recorded', module: 'attendance', record: `${rec.employeeId} · ${rec.date}`, newValue: rec.status },
        )
      },

      addLeave(req: Omit<LeaveRequest, 'id' | 'status'>) {
        commit(
          (d) => ({
            ...d,
            leaveRequests: [{ ...req, status: 'pending', id: `LV-${String(d.leaveRequests.length + 1).padStart(2, '0')}` }, ...d.leaveRequests],
          }),
          { action: 'leave_requested', module: 'attendance', record: req.employeeId },
        )
      },

      setLeaveStatus(id: string, status: LeaveRequest['status']) {
        commit(
          (d) => ({ ...d, leaveRequests: d.leaveRequests.map((l) => (l.id === id ? { ...l, status } : l)) }),
          { action: 'leave_decided', module: 'attendance', record: id, newValue: status },
        )
      },

      updatePayrollLine(period: string, employeeId: string, patch: Partial<PayrollLine>) {
        commit((d) => ({
          ...d,
          payrollRuns: d.payrollRuns.map((r) =>
            r.period === period
              ? { ...r, lines: r.lines.map((l) => (l.employeeId === employeeId ? { ...l, ...patch } : l)) }
              : r,
          ),
        }))
      },

      setPayrollStatus(period: string, from: PayrollStatus, to: PayrollStatus, payDate?: string) {
        commit(
          (d) => ({
            ...d,
            payrollRuns: d.payrollRuns.map((r) =>
              r.period === period
                ? {
                    ...r,
                    status: to,
                    approvedBy: to === 'approved' ? user.name : r.approvedBy,
                    lines:
                      to === 'paid'
                        ? r.lines.map((l, i) => ({
                            ...l,
                            paid: true,
                            paymentDate: payDate ?? r.payDate,
                            paymentRef: l.paymentRef || `PR${period.replace('-', '').slice(2)}-${String(i + 1).padStart(3, '0')}`,
                          }))
                        : r.lines,
                  }
                : r,
            ),
          }),
          { action: `payroll_${to}`, module: 'payroll', record: period, previousValue: from, newValue: to },
        )
      },

      createPayrollRun(period: string, payDate: string) {
        commit(
          (d) => ({
            ...d,
            payrollRuns: [
              ...d.payrollRuns,
              {
                period,
                status: 'draft',
                payDate,
                lines: d.employees
                  .filter((e) => e.status !== 'inactive')
                  .map((e) => ({
                    employeeId: e.id,
                    baseSalary: e.baseSalary,
                    allowances: e.allowances,
                    overtime: 0,
                    bonus: 0,
                    otherDeductions: 0,
                    directLaborPct: 0,
                    paid: false,
                    paymentDate: '',
                    paymentRef: '',
                  })),
              },
            ],
          }),
          { action: 'payroll_draft', module: 'payroll', record: period, newValue: 'draft' },
        )
      },

      createIssue(issue: Omit<Issue, 'id'>) {
        commit(
          (d) => ({ ...d, issues: [{ ...issue, id: nextSeq(d.issues.map((i) => i.id), 'ISS-') }, ...d.issues] }),
          { action: 'issue_created', module: 'issues', record: issue.orderId ?? issue.title, newValue: issue.category },
        )
      },

      updateIssue(id: string, patch: Partial<Issue>, action = 'issue_updated') {
        commit(
          (d) => ({ ...d, issues: d.issues.map((i) => (i.id === id ? { ...i, ...patch } : i)) }),
          { action, module: 'issues', record: id, newValue: patch.status },
        )
      },

      upsertSchedule(ev: Omit<ScheduleEvent, 'id'> & { id?: string }) {
        commit(
          (d) => {
            if (ev.id) return { ...d, schedules: d.schedules.map((s) => (s.id === ev.id ? (ev as ScheduleEvent) : s)) }
            const id = nextSeq(d.schedules.map((s) => s.id), 'SCH-', 2)
            return { ...d, schedules: [...d.schedules, { ...ev, id }] }
          },
          { action: 'schedule_updated', module: 'fulfillment', record: ev.orderId, newValue: ev.start.slice(0, 16) },
        )
      },

      updateSettings(patch: Partial<Settings>) {
        commit((d) => ({ ...d, settings: { ...d.settings, ...patch } }), {
          action: 'settings_updated',
          module: 'settings',
          record: Object.keys(patch).join(', '),
        })
      },

      updateClientSker(clientId: string, sker: SkerAgreement) {
        commit(
          (d) => ({ ...d, clients: d.clients.map((c) => (c.id === clientId ? { ...c, sker } : c)) }),
          { action: 'sker_updated', module: 'settings', record: clientId, newValue: `${sker.termDays} · ${sker.basis}` },
        )
      },

      setRoles(roles: Role[]) {
        setUser((u) => ({ ...u, roles }))
      },
    }
  }, [user.name])

  const permissions = useMemo(() => permissionsFor(user.roles), [user.roles])
  const can = useCallback((p: Permission) => permissions.has(p), [permissions])

  return { data, user, actions, can }
}

type StoreValue = ReturnType<typeof useStoreValue>

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue()
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function useLookup() {
  const { data } = useStore()
  return useMemo(
    () => ({
      client: (id?: string) => data.clients.find((c) => c.id === id),
      supplier: (id?: string) => data.suppliers.find((s) => s.id === id),
      employee: (id?: string) => data.employees.find((e) => e.id === id),
      order: (id?: string) => data.orders.find((o) => o.id === id),
      account: (id?: string) => data.cashAccounts.find((a) => a.id === id),
      invoice: (id?: string) => data.invoices.find((i) => i.id === id),
    }),
    [data],
  )
}

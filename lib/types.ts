export type ServiceCategory =
  | 'logistics'
  | 'manpower'
  | 'maintenance'
  | 'cleaning'
  | 'catering'
  | 'equipment_rental'

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'logistics',
  'manpower',
  'maintenance',
  'cleaning',
  'catering',
  'equipment_rental',
]

export type OrderStatus =
  | 'draft'
  | 'quotation'
  | 'awaiting_approval'
  | 'approved'
  | 'procurement'
  | 'scheduled'
  | 'in_progress'
  | 'fulfilled'
  | 'reconciliation'
  | 'closed'
  | 'on_hold'
  | 'cancelled'

export const ORDER_FLOW: OrderStatus[] = [
  'draft',
  'quotation',
  'awaiting_approval',
  'approved',
  'procurement',
  'scheduled',
  'in_progress',
  'fulfilled',
  'reconciliation',
  'closed',
]

export const ORDER_STATUSES: OrderStatus[] = [...ORDER_FLOW, 'on_hold', 'cancelled']

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent']

export type PaymentTermType = 'advance' | 'after_fulfillment' | 'milestone' | 'custom'
export const PAYMENT_TERM_TYPES: PaymentTermType[] = ['advance', 'after_fulfillment', 'milestone', 'custom']

export type Role = 'owner' | 'operations' | 'procurement' | 'finance' | 'hr'
export const ROLES: Role[] = ['owner', 'operations', 'procurement', 'finance', 'hr']

export type DueBasis = 'invoice_date' | 'invoice_received' | 'bast_date' | 'month_end'
export const DUE_BASES: DueBasis[] = ['invoice_date', 'invoice_received', 'bast_date', 'month_end']

export interface SkerAgreement {
  reference: string
  termDays: number
  basis: DueBasis
  receiptLagDays: number
}

export interface Client {
  id: string
  name: string
  shortName: string
  contactName: string
  email: string
  address: string
  sker: SkerAgreement
}

export interface BankDetail {
  bank: string
  accountNo: string
  holder: string
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  categories: ServiceCategory[]
  bank: BankDetail
  defaultTerm: PaymentTermType
  defaultAdvancePct: number
  leadTimeDays: number
  active: boolean
  notes: string
}

export interface Service {
  id: string
  category: ServiceCategory
  name: string
  description: string
  unit: string
  defaultPrice: number
  estCost: number
  supplierIds: string[]
  active: boolean
}

export type EmploymentType = 'permanent' | 'contract' | 'intern' | 'freelance'
export const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'contract', 'intern', 'freelance']
export type EmploymentStatus = 'active' | 'on_leave' | 'inactive'
export type Department = 'management' | 'operations' | 'procurement' | 'finance' | 'hr'
export const DEPARTMENTS: Department[] = ['management', 'operations', 'procurement', 'finance', 'hr']

export interface Employee {
  id: string
  code: string
  name: string
  position: string
  department: Department
  employmentType: EmploymentType
  joinDate: string
  status: EmploymentStatus
  phone: string
  email: string
  emergencyContact: string
  baseSalary: number
  allowances: number
  taxRatePct: number
  bpjsEnrolled: boolean
  bank: BankDetail
  documents: string[]
  notes: string
}

export interface OrderItem {
  id: string
  name: string
  qty: number
  unit: string
  unitPrice: number
  unitCost: number
}

export type ApprovalStatus = 'not_requested' | 'pending' | 'approved' | 'rejected'
export type ApprovalMethod = 'email' | 'purchase_order' | 'whatsapp' | 'meeting' | 'letter'
export const APPROVAL_METHODS: ApprovalMethod[] = ['email', 'purchase_order', 'whatsapp', 'meeting', 'letter']

export interface ClientApproval {
  status: ApprovalStatus
  approverName: string
  date: string
  method: ApprovalMethod
  reference: string
  documentName: string
  notes: string
}

export type StageTrigger = 'on_order' | 'before_start' | 'on_completion' | 'after_client_payment' | 'custom_date'
export const STAGE_TRIGGERS: StageTrigger[] = [
  'on_order',
  'before_start',
  'on_completion',
  'after_client_payment',
  'custom_date',
]

export interface PaymentStage {
  id: string
  label: string
  pct: number
  amount: number
  trigger: StageTrigger
  dueDate: string
  invoiceId?: string
}

export interface OrderSupplierTerm {
  supplierId: string
  type: PaymentTermType
  stages: PaymentStage[]
  agreementDoc: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
  notes: string
}

export interface FulfillmentRecord {
  actualStart: string
  actualEnd: string
  completionPct: number
  notes: string
  proofUploaded: boolean
  proofName: string
  bastRef: string
  responsibleId: string
}

export interface OrderDocument {
  id: string
  name: string
  type: 'quotation' | 'approval' | 'agreement' | 'proof' | 'bast' | 'invoice' | 'other'
  uploadedAt: string
  uploadedBy: string
}

export interface ClosureChecks {
  supplierCostsReconciled: boolean
  otherExpensesRecorded: boolean
  supplierInvoicesReconciled: boolean
  paymentsReviewed: boolean
  issuesReviewed: boolean
}

export interface Order {
  id: string
  clientId: string
  requestRef: string
  requestDate: string
  category: ServiceCategory
  description: string
  location: string
  items: OrderItem[]
  otherCosts: number
  requestedDate: string
  priority: Priority
  status: OrderStatus
  assigneeId: string
  supplierTerm?: OrderSupplierTerm
  approval: ClientApproval
  fulfillment?: FulfillmentRecord
  documents: OrderDocument[]
  actualSupplierCost?: number
  actualOtherCost?: number
  closure: ClosureChecks
  closureException?: string
  notes: string
}

export type ScheduleStatus = 'planned' | 'confirmed' | 'in_progress' | 'done' | 'delayed'

export interface ScheduleEvent {
  id: string
  orderId: string
  start: string
  end: string
  assigneeId: string
  supplierId?: string
  location: string
  status: ScheduleStatus
}

export interface Invoice {
  id: string
  number: string
  kind: 'client' | 'supplier'
  partyId: string
  orderId: string
  date: string
  dueDate: string
  dueBasis: DueBasis | 'supplier_term'
  amount: number
  notes: string
}

export type PaymentCategory = 'client_receipt' | 'supplier_payment' | 'payroll' | 'opex' | 'other_in' | 'other_out'
export type PaymentMethod = 'transfer' | 'cash' | 'giro' | 'virtual_account'
export const PAYMENT_METHODS: PaymentMethod[] = ['transfer', 'cash', 'giro', 'virtual_account']

export interface PaymentAllocation {
  invoiceId: string
  amount: number
}

export interface Payment {
  id: string
  reference: string
  direction: 'in' | 'out'
  category: PaymentCategory
  partyName: string
  date: string
  method: PaymentMethod
  accountId: string
  amount: number
  allocations: PaymentAllocation[]
  proofName: string
  reconciled: boolean
  notes: string
}

export interface CashAccount {
  id: string
  name: string
  type: 'bank' | 'cash'
  bankName: string
  accountNo: string
  openingBalance: number
  openingDate: string
  active: boolean
}

export interface PlannedExpense {
  id: string
  date: string
  direction: 'in' | 'out'
  category: 'opex' | 'other_in' | 'other_out'
  description: string
  amount: number
}

export interface PayrollLine {
  employeeId: string
  baseSalary: number
  allowances: number
  overtime: number
  bonus: number
  otherDeductions: number
  directOrderId?: string
  directLaborPct: number
  paid: boolean
  paymentDate: string
  paymentRef: string
}

export type PayrollStatus = 'draft' | 'submitted' | 'approved' | 'paid'

export interface PayrollRun {
  period: string
  status: PayrollStatus
  payDate: string
  lines: PayrollLine[]
  approvedBy?: string
}

export type AttendanceStatus = 'present' | 'late' | 'sick' | 'leave' | 'absent' | 'remote'

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn: string
  checkOut: string
  status: AttendanceStatus
  overtimeHours: number
  notes: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  type: 'annual' | 'sick' | 'personal' | 'unpaid'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
}

export type IssueCategory =
  | 'supplier_delay'
  | 'schedule_conflict'
  | 'missing_documents'
  | 'cost_overrun'
  | 'payment_delay'
  | 'client_approval_delay'
  | 'fulfillment_problem'
  | 'cash_flow_risk'
  | 'payroll_issue'
  | 'other'

export const ISSUE_CATEGORIES: IssueCategory[] = [
  'supplier_delay',
  'schedule_conflict',
  'missing_documents',
  'cost_overrun',
  'payment_delay',
  'client_approval_delay',
  'fulfillment_problem',
  'cash_flow_risk',
  'payroll_issue',
  'other',
]

export type Severity = 'low' | 'medium' | 'high' | 'critical'
export const SEVERITIES: Severity[] = ['low', 'medium', 'high', 'critical']
export type IssueStatus = 'open' | 'in_progress' | 'resolved'
export const ISSUE_STATUSES: IssueStatus[] = ['open', 'in_progress', 'resolved']

export interface Issue {
  id: string
  orderId?: string
  category: IssueCategory
  title: string
  description: string
  severity: Severity
  assigneeId: string
  createdAt: string
  dueDate: string
  status: IssueStatus
  resolution: string
}

export type AuditModule =
  | 'orders'
  | 'procurement'
  | 'fulfillment'
  | 'finance'
  | 'payroll'
  | 'employees'
  | 'attendance'
  | 'issues'
  | 'partners'
  | 'settings'

export interface AuditEvent {
  id: string
  timestamp: string
  user: string
  action: string
  module: AuditModule
  record: string
  previousValue?: string
  newValue?: string
  reason?: string
}

export interface FinancialDecision {
  id: string
  orderId: string
  decision: 'approved' | 'rejected' | 'on_hold'
  by: string
  at: string
  note: string
}

export interface Settings {
  companyName: string
  minOperatingCash: number
  financeApprovalThreshold: number
  advanceApprovalThreshold: number
  attentionBufferPct: number
  payroll: {
    bpjsKesehatanPct: number
    bpjsJhtPct: number
    bpjsJpPct: number
    overtimeHourlyDivisor: number
  }
  closure: {
    requireProof: boolean
    requireBast: boolean
    requireInvoice: boolean
    requireNoOpenIssues: boolean
  }
}

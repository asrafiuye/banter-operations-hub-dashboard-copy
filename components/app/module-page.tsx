'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Boxes, CalendarDays, FileText, Handshake, ReceiptText, Settings, Users, Wallet } from 'lucide-react'
import { AppSidebar } from '@/components/app/app-sidebar'
import { DemoNotice, PageHeader, StatCard } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/lib/store'

const MODULES: Record<string, { title: string; description: string; icon: typeof Boxes; permission: string }> = {
  orders: { title: 'Order & Penjualan', description: 'Kelola permintaan, penawaran, persetujuan, dan status order klien.', icon: FileText, permission: 'orders.view' },
  procurement: { title: 'Pengadaan', description: 'Pantau kebutuhan pengadaan dan termin supplier yang menunggu keputusan.', icon: Boxes, permission: 'procurement.view' },
  fulfillment: { title: 'Fulfillment', description: 'Atur jadwal pengerjaan, pelaksanaan layanan, dan penyelesaian order.', icon: CalendarDays, permission: 'fulfillment.view' },
  partners: { title: 'Partner', description: 'Kelola data partner dan hubungan kerja sama operasional.', icon: Handshake, permission: 'partners.view' },
  issues: { title: 'Issues', description: 'Pantau isu operasional terbuka dan tindak lanjut penyelesaiannya.', icon: Settings, permission: 'issues.view' },
  employees: { title: 'Karyawan', description: 'Lihat data karyawan dan struktur tim operasional.', icon: Users, permission: 'employees.view' },
  attendance: { title: 'Absensi & Cuti', description: 'Review kehadiran dan permohonan cuti yang masuk.', icon: CalendarDays, permission: 'attendance.view' },
  payroll: { title: 'Payroll', description: 'Pantau siklus payroll dan status pemrosesan gaji.', icon: Wallet, permission: 'payroll.view' },
  reports: { title: 'Reports', description: 'Akses ringkasan laporan operasional berbasis data demo.', icon: FileText, permission: 'reports.view' },
  'audit-log': { title: 'Audit Log', description: 'Telusuri aktivitas penting yang tercatat di dalam sistem.', icon: ReceiptText, permission: 'audit.view' },
  settings: { title: 'Settings', description: 'Kelola preferensi workspace dan aturan operasional.', icon: Settings, permission: 'dashboard.view' },
}

function getModule(slug: string[]) {
  if (slug[0] === 'finance') return { title: 'Finance & Cash Flow', description: 'Pantau piutang, hutang, invoice, dan arus kas operasional.', icon: Wallet, permission: 'finance.view' }
  return MODULES[slug[0]] ?? { title: 'Operations Hub', description: 'Modul operasional Banter.', icon: Settings, permission: 'dashboard.view' }
}

export default function ModulePage({ slug }: { slug: string[] }) {
  const { data, can } = useStore()
  const [collapsed, setCollapsed] = React.useState(false)
  const module = getModule(slug)
  const Icon = module.icon
  const visible = can(module.permission as never)
  const openOrders = data.orders.filter((order) => !['closed', 'cancelled'].includes(order.status)).length
  const openIssues = data.issues.filter((issue) => issue.status !== 'resolved').length
  const outstanding = data.invoices.filter((invoice) => invoice.status !== 'paid').length

  return <div className="flex min-h-svh bg-background"><AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} /><main className="min-w-0 flex-1"><header className="flex h-14 items-center border-b px-4 md:px-8"><span className="font-mono text-xs text-muted-foreground">OPERATIONS / {module.title.toUpperCase()}</span></header><div className="mx-auto max-w-[1440px] p-4 md:p-8"><PageHeader title={module.title} description={module.description} meta={<DemoNotice className="mt-2" />} actions={<Button render={<Link href="/dashboard" />} variant="outline" size="sm"><ArrowLeft data-icon="inline-start" />Dashboard</Button>} />{visible ? <><section className="grid gap-3 sm:grid-cols-3"><StatCard label="Order aktif" value={openOrders} icon={FileText} tone="info" /><StatCard label="Issue terbuka" value={openIssues} icon={Settings} tone={openIssues ? 'warning' : 'success'} /><StatCard label="Invoice outstanding" value={outstanding} icon={ReceiptText} tone={outstanding ? 'warning' : 'success'} /></section><Card className="mt-6"><CardHeader><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg border bg-primary/8 text-primary"><Icon className="size-4" aria-hidden /></span><div><CardTitle>Workspace {module.title}</CardTitle><CardDescription>Struktur halaman siap digunakan untuk pengembangan modul berikutnya.</CardDescription></div></div></CardHeader><CardContent><p className="text-sm text-muted-foreground">Data terhubung ke store terpusat Banter. KPI di atas menggunakan seed data yang sama dengan Dashboard.</p></CardContent></Card></> : <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Anda tidak memiliki izin untuk membuka modul ini.</p></CardContent></Card>}</div></main></div>
}

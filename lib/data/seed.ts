import type {
  AttendanceRecord,
  AttendanceStatus,
  AuditEvent,
  CashAccount,
  Client,
  ClosureChecks,
  Employee,
  Invoice,
  Issue,
  LeaveRequest,
  Order,
  Payment,
  PayrollLine,
  PayrollRun,
  PlannedExpense,
  ScheduleEvent,
  Service,
  Settings,
  Supplier,
} from '@/lib/types'

/** Demo reference date. All mock data is positioned relative to this day (Asia/Jakarta). */
export const TODAY = '2026-10-24'
export const NOW = '2026-10-24T09:30:00+07:00'

export const clients: Client[] = [
  {
    id: 'CL-01',
    name: 'PT Omya Indonesia',
    shortName: 'Omya',
    contactName: 'Hendra Kusuma',
    email: 'procurement@omya-demo.example',
    address: 'Kawasan Industri Gresik, Jawa Timur',
    sker: { reference: 'SKER/OMYA-BTR/2026/01', termDays: 30, basis: 'invoice_received', receiptLagDays: 2 },
  },
  {
    id: 'CL-02',
    name: 'PT Sinar Kimia Nusantara',
    shortName: 'Sinar Kimia',
    contactName: 'Lukas Hartono',
    email: 'finance@sinarkimia-demo.example',
    address: 'Jl. Raya Mojokerto KM 12, Jawa Timur',
    sker: { reference: 'PKS/SKN-BTR/2026/03', termDays: 45, basis: 'invoice_date', receiptLagDays: 0 },
  },
  {
    id: 'CL-03',
    name: 'PT Cahaya Logistik Utama',
    shortName: 'Cahaya Logistik',
    contactName: 'Nadia Paramitha',
    email: 'ops@cahayalog-demo.example',
    address: 'Jl. Industri Cikarang Blok F-7, Bekasi',
    sker: { reference: 'KONTRAK/CLU/2026/11', termDays: 14, basis: 'bast_date', receiptLagDays: 0 },
  },
]

export const suppliers: Supplier[] = [
  {
    id: 'SUP-01',
    name: 'CV Sarana Angkut Jaya',
    contactPerson: 'Agus Salim',
    phone: '+62 812-0000-1101',
    email: 'agus@saranaangkut-demo.example',
    address: 'Jl. Kalianak No. 45, Surabaya',
    categories: ['logistics'],
    bank: { bank: 'BCA', accountNo: '0881234521', holder: 'CV Sarana Angkut Jaya' },
    defaultTerm: 'advance',
    defaultAdvancePct: 50,
    leadTimeDays: 3,
    active: true,
    notes: 'Armada truk engkel & fuso. Responsif untuk rute Gresik–Surabaya.',
  },
  {
    id: 'SUP-02',
    name: 'PT Tenaga Prima Mandiri',
    contactPerson: 'Ratna Sari',
    phone: '+62 812-0000-1102',
    email: 'ratna@tenagaprima-demo.example',
    address: 'Jl. Veteran No. 12, Gresik',
    categories: ['manpower', 'cleaning'],
    bank: { bank: 'Mandiri', accountNo: '1420099887766', holder: 'PT Tenaga Prima Mandiri' },
    defaultTerm: 'after_fulfillment',
    defaultAdvancePct: 0,
    leadTimeDays: 5,
    active: true,
    notes: 'Penyedia tenaga kerja outsourcing bersertifikat K3.',
  },
  {
    id: 'SUP-03',
    name: 'CV Teknik Mandiri Sejahtera',
    contactPerson: 'Wahyu Hidayat',
    phone: '+62 812-0000-1103',
    email: 'wahyu@teknikmandiri-demo.example',
    address: 'Jl. Margomulyo No. 88, Surabaya',
    categories: ['maintenance'],
    bank: { bank: 'BRI', accountNo: '003401009988305', holder: 'CV Teknik Mandiri Sejahtera' },
    defaultTerm: 'milestone',
    defaultAdvancePct: 30,
    leadTimeDays: 7,
    active: true,
    notes: 'Spesialis perawatan conveyor dan pompa industri.',
  },
  {
    id: 'SUP-04',
    name: 'PT Bersih Cemerlang',
    contactPerson: 'Yuliana',
    phone: '+62 812-0000-1104',
    email: 'yuliana@bersihcemerlang-demo.example',
    address: 'Jl. Raya Driyorejo No. 3, Gresik',
    categories: ['cleaning'],
    bank: { bank: 'BNI', accountNo: '0712345678', holder: 'PT Bersih Cemerlang' },
    defaultTerm: 'after_fulfillment',
    defaultAdvancePct: 0,
    leadTimeDays: 4,
    active: true,
    notes: 'Industrial cleaning, tangki, dan silo.',
  },
  {
    id: 'SUP-05',
    name: 'UD Katering Berkah',
    contactPerson: 'Ibu Sumarni',
    phone: '+62 812-0000-1105',
    email: 'order@kateringberkah-demo.example',
    address: 'Jl. Panglima Sudirman No. 21, Gresik',
    categories: ['catering'],
    bank: { bank: 'BCA', accountNo: '0189876543', holder: 'Sumarni' },
    defaultTerm: 'advance',
    defaultAdvancePct: 30,
    leadTimeDays: 2,
    active: true,
    notes: 'Kapasitas hingga 500 pax per hari.',
  },
  {
    id: 'SUP-06',
    name: 'PT Alat Berat Nusantara',
    contactPerson: 'Rudi Hermawan',
    phone: '+62 812-0000-1106',
    email: 'rental@alatberat-demo.example',
    address: 'Jl. Tambak Osowilangun No. 9, Surabaya',
    categories: ['equipment_rental', 'logistics'],
    bank: { bank: 'Mandiri', accountNo: '1410077665544', holder: 'PT Alat Berat Nusantara' },
    defaultTerm: 'advance',
    defaultAdvancePct: 50,
    leadTimeDays: 5,
    active: true,
    notes: 'Forklift, crane, dan genset. Wajib DP sebelum mobilisasi.',
  },
  {
    id: 'SUP-07',
    name: 'CV Lancar Abadi',
    contactPerson: 'Joko Susilo',
    phone: '+62 812-0000-1107',
    email: 'joko@lancarabadi-demo.example',
    address: 'Jl. Kenjeran No. 210, Surabaya',
    categories: ['logistics'],
    bank: { bank: 'BRI', accountNo: '009801000123307', holder: 'CV Lancar Abadi' },
    defaultTerm: 'custom',
    defaultAdvancePct: 20,
    leadTimeDays: 4,
    active: false,
    notes: 'Dinonaktifkan sementara karena keterlambatan berulang (Q2 2026).',
  },
]

export const services: Service[] = [
  { id: 'SRV-01', category: 'logistics', name: 'Pengiriman truk fuso (per rit)', description: 'Angkutan muatan curah/big bag hingga 8 ton.', unit: 'rit', defaultPrice: 5_000_000, estCost: 4_000_000, supplierIds: ['SUP-01', 'SUP-06'], active: true },
  { id: 'SRV-02', category: 'logistics', name: 'Distribusi palet (per rit)', description: 'Pengiriman palet dalam kota / antar kawasan industri.', unit: 'rit', defaultPrice: 3_200_000, estCost: 2_600_000, supplierIds: ['SUP-01'], active: true },
  { id: 'SRV-03', category: 'manpower', name: 'Tenaga bongkar muat (per orang/bulan)', description: 'Tenaga kerja harian bersertifikat K3, termasuk APD.', unit: 'orang', defaultPrice: 6_500_000, estCost: 5_400_000, supplierIds: ['SUP-02'], active: true },
  { id: 'SRV-04', category: 'maintenance', name: 'Perawatan conveyor (per paket)', description: 'Inspeksi, penggantian roller, dan penyetelan belt.', unit: 'paket', defaultPrice: 45_000_000, estCost: 36_000_000, supplierIds: ['SUP-03'], active: true },
  { id: 'SRV-05', category: 'cleaning', name: 'Industrial cleaning (per area)', description: 'Pembersihan gudang, tangki, dan silo.', unit: 'area', defaultPrice: 28_000_000, estCost: 21_000_000, supplierIds: ['SUP-04', 'SUP-02'], active: true },
  { id: 'SRV-06', category: 'catering', name: 'Katering acara (per pax)', description: 'Nasi kotak/prasmanan untuk acara perusahaan.', unit: 'pax', defaultPrice: 85_000, estCost: 65_000, supplierIds: ['SUP-05'], active: true },
  { id: 'SRV-07', category: 'equipment_rental', name: 'Sewa forklift 3 ton (per unit/hari)', description: 'Termasuk operator dan BBM.', unit: 'unit-hari', defaultPrice: 1_600_000, estCost: 1_250_000, supplierIds: ['SUP-06'], active: true },
  { id: 'SRV-08', category: 'equipment_rental', name: 'Sewa genset 100 kVA (per hari)', description: 'Belum termasuk solar.', unit: 'hari', defaultPrice: 2_400_000, estCost: 1_900_000, supplierIds: ['SUP-06'], active: false },
]

export const employees: Employee[] = [
  { id: 'E01', code: 'BTR-EMP-001', name: 'Rina Wijaya', position: 'Direktur Operasional', department: 'management', employmentType: 'permanent', joinDate: '2021-03-01', status: 'active', phone: '+62 811-0000-2001', email: 'rina@banter-demo.example', emergencyContact: 'Arif Wijaya (suami) · +62 811-0000-3001', baseSalary: 18_000_000, allowances: 3_000_000, taxRatePct: 7, bpjsEnrolled: true, bank: { bank: 'BCA', accountNo: '0123456001', holder: 'Rina Wijaya' }, documents: ['Kontrak Kerja.pdf', 'NPWP.pdf'], notes: '' },
  { id: 'E02', code: 'BTR-EMP-002', name: 'Budi Santoso', position: 'Koordinator Operasional', department: 'operations', employmentType: 'permanent', joinDate: '2022-01-10', status: 'active', phone: '+62 811-0000-2002', email: 'budi@banter-demo.example', emergencyContact: 'Sri Santoso (istri) · +62 811-0000-3002', baseSalary: 10_000_000, allowances: 1_500_000, taxRatePct: 3, bpjsEnrolled: true, bank: { bank: 'Mandiri', accountNo: '1420000002', holder: 'Budi Santoso' }, documents: ['Kontrak Kerja.pdf'], notes: 'PIC utama akun Omya.' },
  { id: 'E03', code: 'BTR-EMP-003', name: 'Dewi Lestari', position: 'Staf Pengadaan', department: 'procurement', employmentType: 'permanent', joinDate: '2022-06-01', status: 'active', phone: '+62 811-0000-2003', email: 'dewi@banter-demo.example', emergencyContact: 'Lestari (ibu) · +62 811-0000-3003', baseSalary: 8_000_000, allowances: 1_200_000, taxRatePct: 2, bpjsEnrolled: true, bank: { bank: 'BCA', accountNo: '0123456003', holder: 'Dewi Lestari' }, documents: ['Kontrak Kerja.pdf'], notes: '' },
  { id: 'E04', code: 'BTR-EMP-004', name: 'Andi Pratama', position: 'Staf Keuangan', department: 'finance', employmentType: 'permanent', joinDate: '2023-02-15', status: 'active', phone: '+62 811-0000-2004', email: 'andi@banter-demo.example', emergencyContact: 'Pratama (ayah) · +62 811-0000-3004', baseSalary: 8_500_000, allowances: 1_200_000, taxRatePct: 2, bpjsEnrolled: true, bank: { bank: 'BNI', accountNo: '0712000004', holder: 'Andi Pratama' }, documents: ['Kontrak Kerja.pdf', 'Sertifikat Brevet.pdf'], notes: '' },
  { id: 'E05', code: 'BTR-EMP-005', name: 'Siti Rahmawati', position: 'HR & Admin', department: 'hr', employmentType: 'permanent', joinDate: '2023-05-02', status: 'active', phone: '+62 811-0000-2005', email: 'siti@banter-demo.example', emergencyContact: 'Rahmat (suami) · +62 811-0000-3005', baseSalary: 7_500_000, allowances: 1_000_000, taxRatePct: 1.5, bpjsEnrolled: true, bank: { bank: 'BCA', accountNo: '0123456005', holder: 'Siti Rahmawati' }, documents: ['Kontrak Kerja.pdf'], notes: '' },
  { id: 'E06', code: 'BTR-EMP-006', name: 'Fajar Nugroho', position: 'Pengawas Lapangan', department: 'operations', employmentType: 'contract', joinDate: '2024-04-01', status: 'active', phone: '+62 811-0000-2006', email: 'fajar@banter-demo.example', emergencyContact: 'Nugroho (ayah) · +62 811-0000-3006', baseSalary: 6_000_000, allowances: 1_000_000, taxRatePct: 1, bpjsEnrolled: true, bank: { bank: 'BRI', accountNo: '0034000006', holder: 'Fajar Nugroho' }, documents: ['PKWT 2026.pdf'], notes: 'Kontrak berakhir 31 Mar 2027.' },
  { id: 'E07', code: 'BTR-EMP-007', name: 'Maya Putri', position: 'Admin Operasional', department: 'operations', employmentType: 'contract', joinDate: '2025-01-06', status: 'on_leave', phone: '+62 811-0000-2007', email: 'maya@banter-demo.example', emergencyContact: 'Putri (ibu) · +62 811-0000-3007', baseSalary: 5_500_000, allowances: 800_000, taxRatePct: 0.75, bpjsEnrolled: true, bank: { bank: 'BCA', accountNo: '0123456007', holder: 'Maya Putri' }, documents: ['PKWT 2026.pdf'], notes: '' },
  { id: 'E08', code: 'BTR-EMP-008', name: 'Yoga Saputra', position: 'Teknisi Lapangan', department: 'operations', employmentType: 'freelance', joinDate: '2025-07-14', status: 'active', phone: '+62 811-0000-2008', email: 'yoga@banter-demo.example', emergencyContact: 'Saputra (ayah) · +62 811-0000-3008', baseSalary: 4_500_000, allowances: 500_000, taxRatePct: 0, bpjsEnrolled: false, bank: { bank: 'Mandiri', accountNo: '1420000008', holder: 'Yoga Saputra' }, documents: [], notes: 'Freelance — tidak terdaftar BPJS melalui BANTER.' },
]

const noChecks: ClosureChecks = {
  supplierCostsReconciled: false,
  otherExpensesRecorded: false,
  supplierInvoicesReconciled: false,
  paymentsReviewed: false,
  issuesReviewed: false,
}

const noApproval = {
  status: 'not_requested' as const,
  approverName: '',
  date: '',
  method: 'email' as const,
  reference: '',
  documentName: '',
  notes: '',
}

export const orders: Order[] = [
  {
    id: 'BTR-2026-0001', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0712', requestDate: '2026-08-04', category: 'logistics',
    description: 'Pengiriman kalsium karbonat Gresik–Surabaya (8 rit)', location: 'Pabrik Omya Gresik → Gudang Tanjung Perak',
    items: [{ id: 'i1', name: 'Pengiriman truk fuso', qty: 8, unit: 'rit', unitPrice: 4_500_000, unitCost: 3_600_000 }],
    otherCosts: 1_200_000, requestedDate: '2026-08-18', priority: 'medium', status: 'closed', assigneeId: 'E02',
    supplierTerm: { supplierId: 'SUP-01', type: 'advance', agreementDoc: 'Kesepakatan SAJ-0812.pdf', approvalStatus: 'approved', notes: '',
      stages: [{ id: 's1', label: 'Pembayaran penuh', pct: 100, amount: 28_800_000, trigger: 'before_start', dueDate: '2026-08-15', invoiceId: 'SI-01' }] },
    approval: { status: 'approved', approverName: 'Hendra Kusuma', date: '2026-08-06', method: 'purchase_order', reference: 'PO-OMY-4500012871', documentName: 'PO-4500012871.pdf', notes: '' },
    fulfillment: { actualStart: '2026-08-18T07:00:00+07:00', actualEnd: '2026-08-20T16:00:00+07:00', completionPct: 100, notes: '8 rit selesai tanpa kendala.', proofUploaded: true, proofName: 'Surat Jalan 8 rit.pdf', bastRef: 'BAST/OMY/2026/08/031', responsibleId: 'E06' },
    documents: [
      { id: 'd1', name: 'PO-4500012871.pdf', type: 'approval', uploadedAt: '2026-08-06T10:12:00+07:00', uploadedBy: 'Budi Santoso' },
      { id: 'd2', name: 'Surat Jalan 8 rit.pdf', type: 'proof', uploadedAt: '2026-08-20T17:30:00+07:00', uploadedBy: 'Fajar Nugroho' },
      { id: 'd3', name: 'BAST-2026-08-031.pdf', type: 'bast', uploadedAt: '2026-08-21T09:00:00+07:00', uploadedBy: 'Budi Santoso' },
    ],
    actualSupplierCost: 28_800_000, actualOtherCost: 1_350_000,
    closure: { supplierCostsReconciled: true, otherExpensesRecorded: true, supplierInvoicesReconciled: true, paymentsReviewed: true, issuesReviewed: true },
    notes: '',
  },
  {
    id: 'BTR-2026-0002', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0788', requestDate: '2026-08-25', category: 'maintenance',
    description: 'Perawatan conveyor belt jalur produksi 2', location: 'Pabrik Omya Gresik — Line 2',
    items: [{ id: 'i1', name: 'Paket perawatan conveyor', qty: 1, unit: 'paket', unitPrice: 45_000_000, unitCost: 36_000_000 }],
    otherCosts: 2_000_000, requestedDate: '2026-09-20', priority: 'high', status: 'reconciliation', assigneeId: 'E02',
    supplierTerm: { supplierId: 'SUP-03', type: 'milestone', agreementDoc: 'SPK-TMS-0931.pdf', approvalStatus: 'approved', notes: '60% saat mobilisasi, 40% setelah BAST.',
      stages: [
        { id: 's1', label: 'Termin 1 (mobilisasi)', pct: 60, amount: 21_600_000, trigger: 'before_start', dueDate: '2026-09-12', invoiceId: 'SI-02' },
        { id: 's2', label: 'Termin 2 (setelah BAST)', pct: 40, amount: 14_400_000, trigger: 'on_completion', dueDate: '2026-10-26', invoiceId: 'SI-02' },
      ] },
    approval: { status: 'approved', approverName: 'Hendra Kusuma', date: '2026-08-29', method: 'email', reference: 'Email 29/08 "Approval Maintenance Line 2"', documentName: 'Approval-email.pdf', notes: '' },
    fulfillment: { actualStart: '2026-09-15T08:00:00+07:00', actualEnd: '2026-09-22T15:00:00+07:00', completionPct: 100, notes: 'Penggantian 14 roller dan 1 pulley.', proofUploaded: true, proofName: 'Laporan Teknis Line 2.pdf', bastRef: 'BAST/OMY/2026/09/044', responsibleId: 'E08' },
    documents: [
      { id: 'd1', name: 'Approval-email.pdf', type: 'approval', uploadedAt: '2026-08-29T13:40:00+07:00', uploadedBy: 'Budi Santoso' },
      { id: 'd2', name: 'SPK-TMS-0931.pdf', type: 'agreement', uploadedAt: '2026-09-01T09:00:00+07:00', uploadedBy: 'Dewi Lestari' },
      { id: 'd3', name: 'Laporan Teknis Line 2.pdf', type: 'proof', uploadedAt: '2026-09-23T10:00:00+07:00', uploadedBy: 'Yoga Saputra' },
    ],
    actualSupplierCost: 36_000_000, actualOtherCost: 2_450_000,
    closure: { supplierCostsReconciled: true, otherExpensesRecorded: true, supplierInvoicesReconciled: false, paymentsReviewed: false, issuesReviewed: true },
    notes: '',
  },
  {
    id: 'BTR-2026-0003', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0841', requestDate: '2026-09-10', category: 'manpower',
    description: 'Tenaga bongkar muat 12 orang (periode Oktober)', location: 'Gudang Omya Gresik',
    items: [{ id: 'i1', name: 'Tenaga bongkar muat', qty: 12, unit: 'orang', unitPrice: 6_500_000, unitCost: 5_400_000 }],
    otherCosts: 1_500_000, requestedDate: '2026-10-01', priority: 'high', status: 'in_progress', assigneeId: 'E06',
    supplierTerm: { supplierId: 'SUP-02', type: 'milestone', agreementDoc: 'PKS-TPM-2026-10.pdf', approvalStatus: 'approved', notes: 'Ditagih 2x per bulan.',
      stages: [
        { id: 's1', label: 'Periode 1–15 Okt', pct: 50, amount: 32_400_000, trigger: 'custom_date', dueDate: '2026-10-22', invoiceId: 'SI-03' },
        { id: 's2', label: 'Periode 16–31 Okt', pct: 50, amount: 32_400_000, trigger: 'on_completion', dueDate: '2026-11-07' },
      ] },
    approval: { status: 'approved', approverName: 'Hendra Kusuma', date: '2026-09-15', method: 'purchase_order', reference: 'PO-OMY-4500013102', documentName: 'PO-4500013102.pdf', notes: '' },
    documents: [{ id: 'd1', name: 'PO-4500013102.pdf', type: 'approval', uploadedAt: '2026-09-15T11:00:00+07:00', uploadedBy: 'Budi Santoso' }],
    closure: noChecks, notes: 'Tagihan termin 1 ke Omya sudah terbit (INV-2026-0004).',
  },
  {
    id: 'BTR-2026-0004', clientId: 'CL-02', requestRef: 'SKN/REQ/1093', requestDate: '2026-09-22', category: 'cleaning',
    description: 'Pembersihan area gudang bahan baku & tangki T-03', location: 'Plant Sinar Kimia Mojokerto',
    items: [{ id: 'i1', name: 'Industrial cleaning', qty: 1, unit: 'area', unitPrice: 28_000_000, unitCost: 21_000_000 }],
    otherCosts: 800_000, requestedDate: '2026-10-08', priority: 'medium', status: 'fulfilled', assigneeId: 'E06',
    supplierTerm: { supplierId: 'SUP-04', type: 'after_fulfillment', agreementDoc: '', approvalStatus: 'approved', notes: '',
      stages: [{ id: 's1', label: 'Pelunasan setelah pekerjaan', pct: 100, amount: 21_000_000, trigger: 'on_completion', dueDate: '2026-10-31', invoiceId: 'SI-04' }] },
    approval: { status: 'approved', approverName: 'Lukas Hartono', date: '2026-09-25', method: 'letter', reference: 'SKN/SPK/2026/221', documentName: 'SPK-221.pdf', notes: '' },
    fulfillment: { actualStart: '2026-10-08T07:30:00+07:00', actualEnd: '2026-10-09T17:00:00+07:00', completionPct: 100, notes: 'Selesai sesuai jadwal.', proofUploaded: true, proofName: 'Foto Before-After.zip', bastRef: '', responsibleId: 'E06' },
    documents: [{ id: 'd1', name: 'SPK-221.pdf', type: 'approval', uploadedAt: '2026-09-25T14:00:00+07:00', uploadedBy: 'Budi Santoso' }],
    closure: noChecks, notes: 'BAST belum ditandatangani klien.',
  },
  {
    id: 'BTR-2026-0005', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0902', requestDate: '2026-10-05', category: 'catering',
    description: 'Katering acara K3 tahunan (350 pax)', location: 'Aula Omya Gresik',
    items: [{ id: 'i1', name: 'Nasi kotak premium', qty: 350, unit: 'pax', unitPrice: 85_000, unitCost: 65_000 }],
    otherCosts: 1_000_000, requestedDate: '2026-10-28', priority: 'medium', status: 'scheduled', assigneeId: 'E07',
    supplierTerm: { supplierId: 'SUP-05', type: 'advance', agreementDoc: 'Order UKB-0055.pdf', approvalStatus: 'approved', notes: '',
      stages: [
        { id: 's1', label: 'DP 30%', pct: 30, amount: 6_825_000, trigger: 'before_start', dueDate: '2026-10-25', invoiceId: 'SI-05' },
        { id: 's2', label: 'Pelunasan 70%', pct: 70, amount: 15_925_000, trigger: 'on_completion', dueDate: '2026-10-30' },
      ] },
    approval: { status: 'approved', approverName: 'Dian Puspita (HSE Omya)', date: '2026-10-09', method: 'email', reference: 'Email 09/10 "Konfirmasi katering K3"', documentName: 'Konfirmasi-email.pdf', notes: '' },
    documents: [], closure: noChecks, notes: '',
  },
  {
    id: 'BTR-2026-0006', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0915', requestDate: '2026-10-08', category: 'equipment_rental',
    description: 'Sewa forklift 3 ton (2 unit × 14 hari)', location: 'Gudang Omya Gresik',
    items: [{ id: 'i1', name: 'Sewa forklift 3 ton', qty: 28, unit: 'unit-hari', unitPrice: 1_600_000, unitCost: 1_250_000 }],
    otherCosts: 1_800_000, requestedDate: '2026-10-26', priority: 'high', status: 'procurement', assigneeId: 'E03',
    supplierTerm: { supplierId: 'SUP-06', type: 'advance', agreementDoc: '', approvalStatus: 'pending', notes: 'Supplier meminta DP 50% sebelum mobilisasi.',
      stages: [
        { id: 's1', label: 'DP 50% sebelum mobilisasi', pct: 50, amount: 17_500_000, trigger: 'before_start', dueDate: '2026-10-25' },
        { id: 's2', label: 'Pelunasan 50%', pct: 50, amount: 17_500_000, trigger: 'on_completion', dueDate: '2026-11-10' },
      ] },
    approval: { status: 'approved', approverName: 'Hendra Kusuma', date: '2026-10-12', method: 'purchase_order', reference: 'PO-OMY-4500013377', documentName: 'PO-4500013377.pdf', notes: '' },
    documents: [], closure: noChecks, notes: '',
  },
  {
    id: 'BTR-2026-0007', clientId: 'CL-03', requestRef: 'CLU/RFQ/0442', requestDate: '2026-10-14', category: 'logistics',
    description: 'Distribusi palet Jakarta–Cikarang (10 rit)', location: 'DC Cahaya Logistik, Cikarang',
    items: [{ id: 'i1', name: 'Distribusi palet', qty: 10, unit: 'rit', unitPrice: 3_200_000, unitCost: 2_600_000 }],
    otherCosts: 900_000, requestedDate: '2026-11-03', priority: 'medium', status: 'approved', assigneeId: 'E02',
    approval: { status: 'approved', approverName: 'Nadia Paramitha', date: '2026-10-20', method: 'whatsapp', reference: 'WA 20/10 10:14', documentName: 'Screenshot-WA.png', notes: 'PO resmi menyusul.' },
    documents: [], closure: noChecks, notes: 'Belum ada supplier yang ditetapkan.',
  },
  {
    id: 'BTR-2026-0008', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0951', requestDate: '2026-10-16', category: 'maintenance',
    description: 'Overhaul pompa slurry & penggantian mechanical seal', location: 'Pabrik Omya Gresik — Slurry Plant',
    items: [
      { id: 'i1', name: 'Jasa overhaul pompa', qty: 2, unit: 'unit', unitPrice: 24_000_000, unitCost: 19_000_000 },
      { id: 'i2', name: 'Mechanical seal', qty: 4, unit: 'pcs', unitPrice: 3_500_000, unitCost: 2_750_000 },
    ],
    otherCosts: 3_500_000, requestedDate: '2026-11-12', priority: 'urgent', status: 'awaiting_approval', assigneeId: 'E02',
    approval: { ...noApproval, status: 'pending', notes: 'Penawaran dikirim 18/10, menunggu konfirmasi Hendra.' },
    documents: [{ id: 'd1', name: 'Penawaran BTR-Q-2026-118.pdf', type: 'quotation', uploadedAt: '2026-10-18T15:20:00+07:00', uploadedBy: 'Budi Santoso' }],
    closure: noChecks, notes: '',
  },
  {
    id: 'BTR-2026-0009', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0963', requestDate: '2026-10-19', category: 'logistics',
    description: 'Pengangkutan big bag 1 ton — Proyek Q4 (10 rit)', location: 'Pabrik Omya Gresik → Pelabuhan Gresik',
    items: [{ id: 'i1', name: 'Pengiriman truk fuso', qty: 10, unit: 'rit', unitPrice: 5_000_000, unitCost: 4_000_000 }],
    otherCosts: 3_000_000, requestedDate: '2026-11-08', priority: 'high', status: 'approved', assigneeId: 'E02',
    supplierTerm: { supplierId: 'SUP-01', type: 'milestone', agreementDoc: '', approvalStatus: 'pending', notes: 'Menunggu persetujuan finansial (DP besar).',
      stages: [
        { id: 's1', label: 'DP sebelum mobilisasi', pct: 62.5, amount: 25_000_000, trigger: 'before_start', dueDate: '2026-10-28' },
        { id: 's2', label: 'Pelunasan setelah rit ke-10', pct: 37.5, amount: 15_000_000, trigger: 'on_completion', dueDate: '2026-11-10' },
      ] },
    approval: { status: 'approved', approverName: 'Hendra Kusuma', date: '2026-10-22', method: 'purchase_order', reference: 'PO-OMY-4500013520', documentName: 'PO-4500013520.pdf', notes: '' },
    documents: [{ id: 'd1', name: 'PO-4500013520.pdf', type: 'approval', uploadedAt: '2026-10-22T09:45:00+07:00', uploadedBy: 'Budi Santoso' }],
    closure: noChecks, notes: 'Contoh ilustratif perhitungan modal kerja.',
  },
  {
    id: 'BTR-2026-0010', clientId: 'CL-01', requestRef: 'OMY/RFQ/2026/0977', requestDate: '2026-10-21', category: 'manpower',
    description: 'Tenaga kebersihan tambahan 6 orang (November)', location: 'Kantor & Gudang Omya Gresik',
    items: [{ id: 'i1', name: 'Tenaga kebersihan', qty: 6, unit: 'orang', unitPrice: 5_200_000, unitCost: 4_300_000 }],
    otherCosts: 600_000, requestedDate: '2026-11-01', priority: 'medium', status: 'quotation', assigneeId: 'E07',
    approval: noApproval, documents: [], closure: noChecks, notes: '',
  },
  {
    id: 'BTR-2026-0011', clientId: 'CL-02', requestRef: 'SKN/REQ/1121', requestDate: '2026-10-23', category: 'catering',
    description: 'Katering harian tim proyek (November, 40 pax/hari)', location: 'Plant Sinar Kimia Mojokerto',
    items: [{ id: 'i1', name: 'Makan siang harian', qty: 800, unit: 'pax', unitPrice: 38_000, unitCost: 30_000 }],
    otherCosts: 500_000, requestedDate: '2026-11-02', priority: 'low', status: 'draft', assigneeId: 'E07',
    approval: noApproval, documents: [], closure: noChecks, notes: '',
  },
  {
    id: 'BTR-2026-0012', clientId: 'CL-01', requestRef: 'OMY/PR/2026/0930', requestDate: '2026-10-10', category: 'cleaning',
    description: 'Pembersihan silo #3', location: 'Pabrik Omya Gresik — Silo #3',
    items: [{ id: 'i1', name: 'Industrial cleaning silo', qty: 1, unit: 'area', unitPrice: 32_000_000, unitCost: 25_500_000 }],
    otherCosts: 1_200_000, requestedDate: '2026-11-15', priority: 'low', status: 'on_hold', assigneeId: 'E06',
    approval: { ...noApproval, status: 'pending' }, documents: [], closure: noChecks, notes: 'Ditunda oleh Omya menunggu shutdown plant.',
  },
]

export const schedules: ScheduleEvent[] = [
  { id: 'SCH-01', orderId: 'BTR-2026-0003', start: '2026-10-24T07:00:00+07:00', end: '2026-10-24T15:00:00+07:00', assigneeId: 'E06', supplierId: 'SUP-02', location: 'Gudang Omya Gresik', status: 'in_progress' },
  { id: 'SCH-02', orderId: 'BTR-2026-0006', start: '2026-10-24T10:00:00+07:00', end: '2026-10-24T12:00:00+07:00', assigneeId: 'E03', supplierId: 'SUP-06', location: 'Gudang Omya Gresik (survei lokasi)', status: 'confirmed' },
  { id: 'SCH-03', orderId: 'BTR-2026-0002', start: '2026-10-24T13:00:00+07:00', end: '2026-10-24T15:00:00+07:00', assigneeId: 'E06', supplierId: 'SUP-03', location: 'Pabrik Omya Gresik — Line 2 (inspeksi garansi)', status: 'planned' },
  { id: 'SCH-04', orderId: 'BTR-2026-0005', start: '2026-10-28T07:00:00+07:00', end: '2026-10-28T14:00:00+07:00', assigneeId: 'E07', supplierId: 'SUP-05', location: 'Aula Omya Gresik', status: 'confirmed' },
  { id: 'SCH-05', orderId: 'BTR-2026-0006', start: '2026-10-26T08:00:00+07:00', end: '2026-11-08T17:00:00+07:00', assigneeId: 'E03', supplierId: 'SUP-06', location: 'Gudang Omya Gresik', status: 'planned' },
  { id: 'SCH-06', orderId: 'BTR-2026-0009', start: '2026-10-29T06:00:00+07:00', end: '2026-11-08T18:00:00+07:00', assigneeId: 'E02', supplierId: 'SUP-01', location: 'Pabrik Omya Gresik → Pelabuhan Gresik', status: 'planned' },
  { id: 'SCH-07', orderId: 'BTR-2026-0004', start: '2026-10-08T07:30:00+07:00', end: '2026-10-09T17:00:00+07:00', assigneeId: 'E06', supplierId: 'SUP-04', location: 'Plant Sinar Kimia Mojokerto', status: 'done' },
  { id: 'SCH-08', orderId: 'BTR-2026-0003', start: '2026-10-22T07:00:00+07:00', end: '2026-10-22T15:00:00+07:00', assigneeId: 'E06', supplierId: 'SUP-02', location: 'Gudang Omya Gresik', status: 'delayed' },
]

export const invoices: Invoice[] = [
  { id: 'CI-01', number: 'INV/BTR/2026/0001', kind: 'client', partyId: 'CL-01', orderId: 'BTR-2026-0001', date: '2026-08-25', dueDate: '2026-09-26', dueBasis: 'invoice_received', amount: 36_000_000, notes: '' },
  { id: 'CI-02', number: 'INV/BTR/2026/0002', kind: 'client', partyId: 'CL-01', orderId: 'BTR-2026-0002', date: '2026-09-30', dueDate: '2026-11-01', dueBasis: 'invoice_received', amount: 45_000_000, notes: 'Pembayaran sebagian diterima 15/10.' },
  { id: 'CI-03', number: 'INV/BTR/2026/0003', kind: 'client', partyId: 'CL-02', orderId: 'BTR-2026-0004', date: '2026-10-10', dueDate: '2026-11-24', dueBasis: 'invoice_date', amount: 28_000_000, notes: '' },
  { id: 'CI-04', number: 'INV/BTR/2026/0004', kind: 'client', partyId: 'CL-01', orderId: 'BTR-2026-0003', date: '2026-09-18', dueDate: '2026-10-20', dueBasis: 'invoice_received', amount: 39_000_000, notes: 'Termin 1 tenaga bongkar muat.' },
  { id: 'SI-01', number: 'SAJ/INV/0812', kind: 'supplier', partyId: 'SUP-01', orderId: 'BTR-2026-0001', date: '2026-08-14', dueDate: '2026-08-15', dueBasis: 'supplier_term', amount: 28_800_000, notes: '' },
  { id: 'SI-02', number: 'TMS-INV-0931', kind: 'supplier', partyId: 'SUP-03', orderId: 'BTR-2026-0002', date: '2026-09-10', dueDate: '2026-10-26', dueBasis: 'supplier_term', amount: 36_000_000, notes: 'Termin 2 jatuh tempo setelah BAST.' },
  { id: 'SI-03', number: 'TPM/2026/10/044', kind: 'supplier', partyId: 'SUP-02', orderId: 'BTR-2026-0003', date: '2026-10-16', dueDate: '2026-10-22', dueBasis: 'supplier_term', amount: 32_400_000, notes: '' },
  { id: 'SI-04', number: 'BC/INV/1009', kind: 'supplier', partyId: 'SUP-04', orderId: 'BTR-2026-0004', date: '2026-10-10', dueDate: '2026-10-31', dueBasis: 'supplier_term', amount: 21_000_000, notes: '' },
  { id: 'SI-05', number: 'UKB-0055', kind: 'supplier', partyId: 'SUP-05', orderId: 'BTR-2026-0005', date: '2026-10-20', dueDate: '2026-10-25', dueBasis: 'supplier_term', amount: 6_825_000, notes: 'DP 30%.' },
]

export const cashAccounts: CashAccount[] = [
  { id: 'ACC-01', name: 'BCA Operasional', type: 'bank', bankName: 'BCA', accountNo: '0881990012', openingBalance: 165_000_000, openingDate: '2026-08-01', active: true },
  { id: 'ACC-02', name: 'Mandiri Payroll', type: 'bank', bankName: 'Mandiri', accountNo: '1420077001122', openingBalance: 150_000_000, openingDate: '2026-08-01', active: true },
  { id: 'ACC-03', name: 'Kas Kecil Kantor', type: 'cash', bankName: '', accountNo: '', openingBalance: 5_000_000, openingDate: '2026-08-01', active: true },
]

export const payments: Payment[] = [
  { id: 'PAY-001', reference: 'TRF-SAJ-150826', direction: 'out', category: 'supplier_payment', partyName: 'CV Sarana Angkut Jaya', date: '2026-08-15', method: 'transfer', accountId: 'ACC-01', amount: 28_800_000, allocations: [{ invoiceId: 'SI-01', amount: 28_800_000 }], proofName: 'Bukti-TRF-SAJ.pdf', reconciled: true, notes: '' },
  { id: 'PAY-002', reference: 'PAYROLL-2026-08', direction: 'out', category: 'payroll', partyName: 'Gaji Agustus 2026', date: '2026-08-28', method: 'transfer', accountId: 'ACC-02', amount: 62_850_000, allocations: [], proofName: 'Rekap-Payroll-Agu.pdf', reconciled: true, notes: '' },
  { id: 'PAY-003', reference: 'TRF-TMS-120926', direction: 'out', category: 'supplier_payment', partyName: 'CV Teknik Mandiri Sejahtera', date: '2026-09-12', method: 'transfer', accountId: 'ACC-01', amount: 21_600_000, allocations: [{ invoiceId: 'SI-02', amount: 21_600_000 }], proofName: 'Bukti-TRF-TMS.pdf', reconciled: true, notes: 'Termin 1 (60%).' },
  { id: 'PAY-004', reference: 'OMY-RCV-230926', direction: 'in', category: 'client_receipt', partyName: 'PT Omya Indonesia', date: '2026-09-24', method: 'transfer', accountId: 'ACC-01', amount: 36_000_000, allocations: [{ invoiceId: 'CI-01', amount: 36_000_000 }], proofName: 'Mutasi-BCA-2409.pdf', reconciled: true, notes: '' },
  { id: 'PAY-005', reference: 'PAYROLL-2026-09', direction: 'out', category: 'payroll', partyName: 'Gaji September 2026', date: '2026-09-28', method: 'transfer', accountId: 'ACC-02', amount: 62_850_000, allocations: [], proofName: 'Rekap-Payroll-Sep.pdf', reconciled: true, notes: '' },
  { id: 'PAY-006', reference: 'OPEX-SEWA-OKT', direction: 'out', category: 'opex', partyName: 'Sewa kantor Oktober', date: '2026-10-01', method: 'transfer', accountId: 'ACC-01', amount: 8_500_000, allocations: [], proofName: '', reconciled: true, notes: '' },
  { id: 'PAY-007', reference: 'OMY-RCV-151026', direction: 'in', category: 'client_receipt', partyName: 'PT Omya Indonesia', date: '2026-10-15', method: 'transfer', accountId: 'ACC-01', amount: 20_000_000, allocations: [{ invoiceId: 'CI-02', amount: 20_000_000 }], proofName: 'Mutasi-BCA-1510.pdf', reconciled: false, notes: 'Pembayaran sebagian.' },
  { id: 'PAY-008', reference: 'KAS-BBM-1810', direction: 'out', category: 'opex', partyName: 'BBM & operasional lapangan', date: '2026-10-18', method: 'cash', accountId: 'ACC-03', amount: 1_750_000, allocations: [], proofName: 'Nota-BBM.jpg', reconciled: false, notes: '' },
]

export const plannedExpenses: PlannedExpense[] = [
  { id: 'PE-01', date: '2026-11-01', direction: 'out', category: 'opex', description: 'Sewa kantor November', amount: 8_500_000 },
  { id: 'PE-02', date: '2026-10-30', direction: 'out', category: 'opex', description: 'Listrik, internet & utilitas', amount: 2_300_000 },
  { id: 'PE-03', date: '2026-11-10', direction: 'out', category: 'other_out', description: 'Angsuran kendaraan operasional', amount: 4_200_000 },
  { id: 'PE-04', date: '2026-11-15', direction: 'out', category: 'opex', description: 'Pembayaran BPJS (porsi perusahaan)', amount: 4_900_000 },
  { id: 'PE-05', date: '2026-11-20', direction: 'in', category: 'other_in', description: 'Pengembalian deposit sewa alat', amount: 3_000_000 },
]

function payrollLines(paidDate: string, refPrefix: string, paid: boolean): PayrollLine[] {
  return employees.map((e) => ({
    employeeId: e.id,
    baseSalary: e.baseSalary,
    allowances: e.allowances,
    overtime: e.department === 'operations' && e.status === 'active' ? 450_000 : 0,
    bonus: 0,
    otherDeductions: 0,
    directOrderId: e.id === 'E06' ? 'BTR-2026-0003' : e.id === 'E08' ? 'BTR-2026-0002' : undefined,
    directLaborPct: e.id === 'E06' ? 60 : e.id === 'E08' ? 40 : 0,
    paid,
    paymentDate: paid ? paidDate : '',
    paymentRef: paid ? `${refPrefix}-${e.code.slice(-3)}` : '',
  }))
}

export const payrollRuns: PayrollRun[] = [
  { period: '2026-08', status: 'paid', payDate: '2026-08-28', lines: payrollLines('2026-08-28', 'PR0826', true), approvedBy: 'Rina Wijaya' },
  { period: '2026-09', status: 'paid', payDate: '2026-09-28', lines: payrollLines('2026-09-28', 'PR0926', true), approvedBy: 'Rina Wijaya' },
  {
    period: '2026-10',
    status: 'submitted',
    payDate: '2026-10-28',
    lines: payrollLines('', '', false).map((l) => (l.employeeId === 'E02' ? { ...l, bonus: 1_000_000 } : l)),
  },
]

function buildAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const start = new Date('2026-10-01T00:00:00Z')
  for (let d = 0; d < 24; d++) {
    const date = new Date(start.getTime() + d * 86_400_000)
    const iso = date.toISOString().slice(0, 10)
    const dow = date.getUTCDay()
    if (dow === 0) continue
    employees.forEach((e, idx) => {
      if (dow === 6 && e.department !== 'operations') return
      if (e.id === 'E07' && iso >= '2026-10-20') {
        records.push({ id: `AT-${iso}-${e.id}`, employeeId: e.id, date: iso, checkIn: '', checkOut: '', status: 'leave', overtimeHours: 0, notes: 'Cuti tahunan' })
        return
      }
      const seed = (d * 7 + idx * 13) % 23
      let status: AttendanceStatus = 'present'
      if (seed === 3) status = 'late'
      else if (seed === 11) status = 'sick'
      else if (seed === 17 && e.department !== 'operations') status = 'remote'
      else if (seed === 19 && e.employmentType === 'freelance') status = 'absent'
      const isLate = status === 'late'
      const hasTimes = status === 'present' || status === 'late' || status === 'remote'
      const overtime = e.department === 'operations' && seed % 5 === 0 && hasTimes ? 2 : 0
      records.push({
        id: `AT-${iso}-${e.id}`,
        employeeId: e.id,
        date: iso,
        checkIn: hasTimes ? (isLate ? '08:42' : `07:${String(45 + (seed % 14)).padStart(2, '0')}`) : '',
        checkOut: hasTimes ? (overtime ? '19:05' : dow === 6 ? '13:00' : `17:${String(seed % 30).padStart(2, '0')}`) : '',
        status,
        overtimeHours: overtime,
        notes: status === 'sick' ? 'Surat dokter' : '',
      })
    })
  }
  return records
}

export const attendance: AttendanceRecord[] = buildAttendance()

export const leaveRequests: LeaveRequest[] = [
  { id: 'LV-01', employeeId: 'E07', type: 'annual', startDate: '2026-10-20', endDate: '2026-10-27', days: 6, reason: 'Acara keluarga di Malang', status: 'approved' },
  { id: 'LV-02', employeeId: 'E03', type: 'annual', startDate: '2026-11-04', endDate: '2026-11-05', days: 2, reason: 'Keperluan pribadi', status: 'pending' },
  { id: 'LV-03', employeeId: 'E08', type: 'unpaid', startDate: '2026-11-11', endDate: '2026-11-13', days: 3, reason: 'Pulang kampung', status: 'pending' },
  { id: 'LV-04', employeeId: 'E04', type: 'sick', startDate: '2026-10-06', endDate: '2026-10-06', days: 1, reason: 'Demam', status: 'approved' },
  { id: 'LV-05', employeeId: 'E06', type: 'personal', startDate: '2026-10-29', endDate: '2026-10-29', days: 1, reason: 'Urusan administrasi', status: 'rejected' },
]

export const issues: Issue[] = [
  { id: 'ISS-0001', orderId: 'BTR-2026-0003', category: 'payment_delay', title: 'Pembayaran INV/BTR/2026/0004 terlambat', description: 'Omya belum membayar termin 1 yang jatuh tempo 20 Okt. Perlu konfirmasi status penerimaan invoice di AP Omya.', severity: 'high', assigneeId: 'E04', createdAt: '2026-10-21T09:00:00+07:00', dueDate: '2026-10-27', status: 'in_progress', resolution: '' },
  { id: 'ISS-0002', orderId: 'BTR-2026-0004', category: 'missing_documents', title: 'BAST Sinar Kimia belum ditandatangani', description: 'Pekerjaan sudah selesai 9 Okt, namun BAST belum kembali dari klien.', severity: 'medium', assigneeId: 'E06', createdAt: '2026-10-12T14:00:00+07:00', dueDate: '2026-10-26', status: 'open', resolution: '' },
  { id: 'ISS-0003', orderId: 'BTR-2026-0009', category: 'cash_flow_risk', title: 'DP Rp 25 jt untuk BTR-2026-0009 berisiko', description: 'DP supplier jatuh tempo sebelum pembayaran Omya. Perlu persetujuan manajemen.', severity: 'critical', assigneeId: 'E01', createdAt: '2026-10-22T16:00:00+07:00', dueDate: '2026-10-26', status: 'open', resolution: '' },
  { id: 'ISS-0004', orderId: 'BTR-2026-0003', category: 'supplier_delay', title: 'Shift 22 Okt kekurangan 2 tenaga', description: 'TPM hanya mengirim 10 dari 12 orang pada shift 22 Okt.', severity: 'medium', assigneeId: 'E06', createdAt: '2026-10-22T08:30:00+07:00', dueDate: '2026-10-25', status: 'in_progress', resolution: '' },
  { id: 'ISS-0005', orderId: 'BTR-2026-0008', category: 'client_approval_delay', title: 'Approval overhaul pompa belum diterima', description: 'Penawaran dikirim 18 Okt. Follow-up via telepon dijadwalkan.', severity: 'high', assigneeId: 'E02', createdAt: '2026-10-21T10:00:00+07:00', dueDate: '2026-10-25', status: 'open', resolution: '' },
  { id: 'ISS-0006', orderId: 'BTR-2026-0002', category: 'cost_overrun', title: 'Biaya lain Line 2 melebihi estimasi', description: 'Biaya akomodasi teknisi Rp 450 rb di atas estimasi.', severity: 'low', assigneeId: 'E04', createdAt: '2026-09-25T11:00:00+07:00', dueDate: '2026-10-05', status: 'resolved', resolution: 'Dicatat sebagai biaya aktual; margin tetap di atas 15%.' },
  { id: 'ISS-0007', category: 'payroll_issue', title: 'Validasi tarif PPh 21 karyawan kontrak', description: 'Perlu verifikasi tarif TER untuk 2 karyawan kontrak sebelum payroll Oktober.', severity: 'medium', assigneeId: 'E05', createdAt: '2026-10-19T13:00:00+07:00', dueDate: '2026-10-26', status: 'open', resolution: '' },
  { id: 'ISS-0008', orderId: 'BTR-2026-0006', category: 'schedule_conflict', title: 'Survei forklift bentrok dengan inspeksi Line 2', description: 'Dewi dan Fajar dijadwalkan di dua lokasi berbeda di jam berdekatan.', severity: 'low', assigneeId: 'E02', createdAt: '2026-10-23T17:00:00+07:00', dueDate: '2026-10-24', status: 'open', resolution: '' },
]

export const auditEvents: AuditEvent[] = [
  { id: 'AU-0001', timestamp: '2026-10-24T08:55:00+07:00', user: 'Andi Pratama', action: 'payment_recorded', module: 'finance', record: 'PAY-008', newValue: 'Rp 1.750.000', reason: 'Input nota BBM' },
  { id: 'AU-0002', timestamp: '2026-10-23T17:10:00+07:00', user: 'Budi Santoso', action: 'issue_created', module: 'issues', record: 'ISS-0008', newValue: 'schedule_conflict' },
  { id: 'AU-0003', timestamp: '2026-10-22T16:05:00+07:00', user: 'Dewi Lestari', action: 'supplier_term_edited', module: 'procurement', record: 'BTR-2026-0009', previousValue: 'DP 50%', newValue: 'DP Rp 25.000.000 + pelunasan', reason: 'Negosiasi ulang dengan CV Sarana Angkut Jaya' },
  { id: 'AU-0004', timestamp: '2026-10-22T09:45:00+07:00', user: 'Budi Santoso', action: 'approval_recorded', module: 'orders', record: 'BTR-2026-0009', newValue: 'PO-OMY-4500013520' },
  { id: 'AU-0005', timestamp: '2026-10-22T09:46:00+07:00', user: 'Budi Santoso', action: 'order_status_changed', module: 'orders', record: 'BTR-2026-0009', previousValue: 'awaiting_approval', newValue: 'approved' },
  { id: 'AU-0006', timestamp: '2026-10-20T11:00:00+07:00', user: 'Budi Santoso', action: 'order_status_changed', module: 'orders', record: 'BTR-2026-0007', previousValue: 'awaiting_approval', newValue: 'approved', reason: 'Konfirmasi WhatsApp klien' },
  { id: 'AU-0007', timestamp: '2026-10-19T14:20:00+07:00', user: 'Siti Rahmawati', action: 'payroll_submitted', module: 'payroll', record: '2026-10', previousValue: 'draft', newValue: 'submitted' },
  { id: 'AU-0008', timestamp: '2026-10-16T10:30:00+07:00', user: 'Dewi Lestari', action: 'invoice_created', module: 'finance', record: 'TPM/2026/10/044', newValue: 'Rp 32.400.000' },
  { id: 'AU-0009', timestamp: '2026-10-15T15:00:00+07:00', user: 'Andi Pratama', action: 'payment_recorded', module: 'finance', record: 'PAY-007', newValue: 'Rp 20.000.000', reason: 'Pembayaran sebagian INV/BTR/2026/0002' },
  { id: 'AU-0010', timestamp: '2026-10-09T17:20:00+07:00', user: 'Fajar Nugroho', action: 'fulfillment_completed', module: 'fulfillment', record: 'BTR-2026-0004', previousValue: 'in_progress', newValue: 'fulfilled' },
  { id: 'AU-0011', timestamp: '2026-10-01T09:00:00+07:00', user: 'Siti Rahmawati', action: 'employee_salary_updated', module: 'employees', record: 'BTR-EMP-006', previousValue: 'Rp 5.500.000', newValue: 'Rp 6.000.000', reason: 'Penyesuaian kontrak PKWT 2026' },
  { id: 'AU-0012', timestamp: '2026-09-28T08:00:00+07:00', user: 'Rina Wijaya', action: 'payroll_approved', module: 'payroll', record: '2026-09', previousValue: 'submitted', newValue: 'approved' },
  { id: 'AU-0013', timestamp: '2026-09-30T10:00:00+07:00', user: 'Andi Pratama', action: 'invoice_created', module: 'finance', record: 'INV/BTR/2026/0002', newValue: 'Rp 45.000.000' },
  { id: 'AU-0014', timestamp: '2026-09-25T09:30:00+07:00', user: 'Rina Wijaya', action: 'order_closed', module: 'orders', record: 'BTR-2026-0001', previousValue: 'reconciliation', newValue: 'closed' },
  { id: 'AU-0015', timestamp: '2026-10-23T09:10:00+07:00', user: 'Maya Putri', action: 'order_created', module: 'orders', record: 'BTR-2026-0011', newValue: 'draft' },
]

export const defaultSettings: Settings = {
  companyName: 'BANTER',
  minOperatingCash: 50_000_000,
  financeApprovalThreshold: 20_000_000,
  advanceApprovalThreshold: 15_000_000,
  attentionBufferPct: 25,
  payroll: { bpjsKesehatanPct: 1, bpjsJhtPct: 2, bpjsJpPct: 1, overtimeHourlyDivisor: 173 },
  closure: { requireProof: true, requireBast: true, requireInvoice: true, requireNoOpenIssues: true },
}

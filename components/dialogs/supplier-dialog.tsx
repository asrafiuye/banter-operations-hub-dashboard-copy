'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { SimpleSelect } from '@/components/app/form-controls'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/lib/i18n/provider'
import { useStore } from '@/lib/store'
import { PAYMENT_TERM_TYPES, SERVICE_CATEGORIES, type Supplier } from '@/lib/types'

const empty: Supplier = {
  id: '',
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  categories: [],
  bank: { bank: '', accountNo: '', holder: '' },
  defaultTerm: 'after_fulfillment',
  defaultAdvancePct: 0,
  leadTimeDays: 3,
  active: true,
  notes: '',
}

export function SupplierDialog({
  open,
  onOpenChange,
  supplier,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  supplier?: Supplier
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        {open && <SupplierForm supplier={supplier} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function SupplierForm({ supplier, onDone }: { supplier?: Supplier; onDone: () => void }) {
  const { t } = useI18n()
  const { data, actions, can } = useStore()
  const [form, setForm] = useState<Supplier>(supplier ?? empty)
  const [submitted, setSubmitted] = useState(false)
  const isNew = !supplier
  const showBank = can('bank.supplier.view')

  const errors = {
    name: !form.name.trim() ? t('validation.required') : '',
    email: form.email && !/^\S+@\S+\.\S+$/.test(form.email) ? t('validation.email') : '',
    categories: form.categories.length === 0 ? t('validation.selectOne') : '',
    accountNo: form.bank.accountNo && !/^\d{6,20}$/.test(form.bank.accountNo) ? t('validation.accountNo') : '',
    advance: form.defaultAdvancePct < 0 || form.defaultAdvancePct > 100 ? t('validation.percent') : '',
  }
  const hasErrors = Object.values(errors).some(Boolean)
  const set = <K extends keyof Supplier>(k: K, v: Supplier[K]) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    setSubmitted(true)
    if (hasErrors) return
    const id = form.id || `SUP-${String(data.suppliers.length + 1).padStart(2, '0')}`
    actions.upsertSupplier({ ...form, id }, isNew)
    toast.success(isNew ? t('partners.toast.created', { name: form.name }) : t('partners.toast.updated', { name: form.name }))
    onDone()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex flex-col gap-5"
      noValidate
    >
      <DialogHeader>
        <DialogTitle>{isNew ? t('partners.form.addTitle') : t('partners.form.editTitle')}</DialogTitle>
        <DialogDescription>{t('partners.form.description')}</DialogDescription>
      </DialogHeader>
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={submitted && !!errors.name} className="sm:col-span-2">
          <FieldLabel htmlFor="sup-name">{t('partners.fields.name')}</FieldLabel>
          <Input id="sup-name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={submitted && !!errors.name} />
          {submitted && errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="sup-contact">{t('partners.fields.contactPerson')}</FieldLabel>
          <Input id="sup-contact" value={form.contactPerson} onChange={(e) => set('contactPerson', e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="sup-phone">{t('partners.fields.phone')}</FieldLabel>
          <Input id="sup-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field data-invalid={submitted && !!errors.email}>
          <FieldLabel htmlFor="sup-email">{t('partners.fields.email')}</FieldLabel>
          <Input id="sup-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={submitted && !!errors.email} />
          {submitted && errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="sup-address">{t('partners.fields.address')}</FieldLabel>
          <Input id="sup-address" value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
        <FieldSet data-invalid={submitted && !!errors.categories} className="sm:col-span-2">
          <FieldLegend variant="label">{t('partners.fields.categories')}</FieldLegend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SERVICE_CATEGORIES.map((c) => (
              <Label key={c} className="flex items-center gap-2 font-normal">
                <Checkbox
                  checked={form.categories.includes(c)}
                  onCheckedChange={(v) =>
                    set('categories', v ? [...form.categories, c] : form.categories.filter((x) => x !== c))
                  }
                />
                {t(`category.${c}`)}
              </Label>
            ))}
          </div>
          {submitted && errors.categories && <FieldError>{errors.categories}</FieldError>}
        </FieldSet>
        <Field>
          <FieldLabel htmlFor="sup-term">{t('partners.fields.defaultTerm')}</FieldLabel>
          <SimpleSelect
            id="sup-term"
            value={form.defaultTerm}
            onValueChange={(v) => set('defaultTerm', v as Supplier['defaultTerm'])}
            options={PAYMENT_TERM_TYPES.map((p) => ({ value: p, label: t(`terms.${p}`) }))}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={submitted && !!errors.advance}>
            <FieldLabel htmlFor="sup-adv">{t('partners.fields.advancePct')}</FieldLabel>
            <Input id="sup-adv" type="number" min={0} max={100} value={form.defaultAdvancePct} onChange={(e) => set('defaultAdvancePct', Number(e.target.value))} />
            {submitted && errors.advance && <FieldError>{errors.advance}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="sup-lead">{t('partners.fields.leadTime')}</FieldLabel>
            <Input id="sup-lead" type="number" min={0} value={form.leadTimeDays} onChange={(e) => set('leadTimeDays', Number(e.target.value))} />
          </Field>
        </div>
        {showBank && (
          <>
            <Field>
              <FieldLabel htmlFor="sup-bank">{t('partners.fields.bank')}</FieldLabel>
              <Input id="sup-bank" value={form.bank.bank} onChange={(e) => set('bank', { ...form.bank, bank: e.target.value })} />
            </Field>
            <Field data-invalid={submitted && !!errors.accountNo}>
              <FieldLabel htmlFor="sup-acc">{t('partners.fields.accountNo')}</FieldLabel>
              <Input id="sup-acc" inputMode="numeric" value={form.bank.accountNo} onChange={(e) => set('bank', { ...form.bank, accountNo: e.target.value.trim() })} />
              {submitted && errors.accountNo && <FieldError>{errors.accountNo}</FieldError>}
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="sup-holder">{t('partners.fields.accountHolder')}</FieldLabel>
              <Input id="sup-holder" value={form.bank.holder} onChange={(e) => set('bank', { ...form.bank, holder: e.target.value })} />
            </Field>
          </>
        )}
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="sup-notes">{t('common.notes')}</FieldLabel>
          <Textarea id="sup-notes" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </Field>
        <Field orientation="horizontal" className="sm:col-span-2">
          <Switch id="sup-active" checked={form.active} onCheckedChange={(v) => set('active', v)} />
          <FieldLabel htmlFor="sup-active">{t('partners.fields.active')}</FieldLabel>
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">{t('common.save')}</Button>
      </DialogFooter>
    </form>
  )
}

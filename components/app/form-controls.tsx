'use client'

import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export interface Option {
  value: string
  label: string
}

export function SimpleSelect({
  value,
  onValueChange,
  options,
  placeholder,
  id,
  className,
  size,
  ariaLabel,
  disabled,
  invalid,
}: {
  value: string
  onValueChange: (v: string) => void
  options: Option[]
  placeholder?: string
  id?: string
  className?: string
  size?: 'sm' | 'default'
  ariaLabel?: string
  disabled?: boolean
  invalid?: boolean
}) {
  return (
    <Select
      items={options}
      value={value || null}
      onValueChange={(v) => onValueChange((v as string | null) ?? '')}
      disabled={disabled}
    >
      <SelectTrigger id={id} size={size} className={cn('w-full', className)} aria-label={ariaLabel} aria-invalid={invalid || undefined}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function MoneyInput({
  value,
  onChange,
  id,
  invalid,
  disabled,
}: {
  value: number | ''
  onChange: (v: number | '') => void
  id?: string
  invalid?: boolean
  disabled?: boolean
}) {
  const { locale } = useI18n()
  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>{locale === 'id' ? 'Rp' : 'IDR'}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        inputMode="numeric"
        type="number"
        min={0}
        step={1000}
        className="tabular"
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      />
    </InputGroup>
  )
}

export function DateInput({
  value,
  onChange,
  id,
  type = 'date',
  invalid,
}: {
  value: string
  onChange: (v: string) => void
  id?: string
  type?: 'date' | 'datetime-local' | 'time' | 'month'
  invalid?: boolean
}) {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      aria-invalid={invalid || undefined}
      onChange={(e) => onChange(e.target.value)}
      className="tabular"
    />
  )
}

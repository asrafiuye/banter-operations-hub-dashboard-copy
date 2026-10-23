'use client'

import type { ReactNode } from 'react'
import { Lock, ShieldAlert, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useI18n } from '@/lib/i18n/provider'
import type { Permission } from '@/lib/permissions'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'muted'

const toneClass: Record<Tone, string> = {
  success: 'border-success/25 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/12 text-warning-foreground',
  danger: 'border-destructive/25 bg-destructive/10 text-destructive',
  info: 'border-primary/25 bg-primary/8 text-primary',
  neutral: 'border-border bg-secondary text-secondary-foreground',
  muted: 'border-border bg-muted text-muted-foreground',
}

const dotClass: Record<Tone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-primary',
  neutral: 'bg-muted-foreground',
  muted: 'bg-muted-foreground/60',
}

export function StatusBadge({ tone, children, dot = true, className }: { tone: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', toneClass[tone], className)}>
      {dot && <span aria-hidden className={cn('size-1.5 rounded-full', dotClass[tone])} />}
      {children}
    </Badge>
  )
}

export function ToneDot({ tone }: { tone: Tone }) {
  return <span aria-hidden className={cn('inline-block size-2 shrink-0 rounded-full', dotClass[tone])} />
}

export function PageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: string
  description?: string
  actions?: ReactNode
  meta?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-pretty text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
        {description && <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>}
        {meta}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'neutral',
  footer,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: LucideIcon
  tone?: Tone
  footer?: ReactNode
}) {
  return (
    <Card size="sm" className="gap-0">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {Icon && (
            <span className={cn('flex size-7 items-center justify-center rounded-md border', toneClass[tone])}>
              <Icon className="size-3.5" aria-hidden />
            </span>
          )}
        </div>
        <div className="tabular text-lg font-semibold tracking-tight md:text-xl">{value}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        {footer}
      </CardContent>
    </Card>
  )
}

export function AccessDenied({ permission }: { permission?: Permission }) {
  const { t } = useI18n()
  return (
    <Empty className="min-h-[60vh] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlert />
        </EmptyMedia>
        <EmptyTitle>{t('common.accessDenied.title')}</EmptyTitle>
        <EmptyDescription>
          {t('common.accessDenied.description')}
          {permission && <span className="mt-2 block font-mono text-xs">{permission}</span>}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function Guard({ permission, children }: { permission: Permission; children: ReactNode }) {
  const { can } = useStore()
  if (!can(permission)) return <AccessDenied permission={permission} />
  return <>{children}</>
}

export function Restricted({ permission, children, masked }: { permission: Permission; children: ReactNode; masked?: ReactNode }) {
  const { can } = useStore()
  const { t } = useI18n()
  if (can(permission)) return <>{children}</>
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span />}
        className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
      >
        <Lock className="size-3" aria-hidden />
        {masked ?? '••••••'}
        <span className="sr-only">{t('common.restricted')}</span>
      </TooltipTrigger>
      <TooltipContent>{t('common.restricted')}</TooltipContent>
    </Tooltip>
  )
}

export function Money({ value, className, signed }: { value: number; className?: string; signed?: boolean }) {
  const { fmt } = useI18n()
  return (
    <span className={cn('tabular whitespace-nowrap', className)}>
      {signed && value > 0 ? '+' : ''}
      {fmt.money(value)}
    </span>
  )
}

export function DemoNotice({ className }: { className?: string }) {
  const { t } = useI18n()
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      <span className="font-medium text-foreground">{t('common.demoLabel')}</span> {t('common.demoNotice')}
    </p>
  )
}

export function KeyValue({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  )
}

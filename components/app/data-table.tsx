'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export interface Column<T> {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  align?: 'left' | 'right' | 'center'
  className?: string
  footer?: ReactNode
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  onRowClick,
  pageSize = 10,
  initialSort,
  emptyTitle,
  emptyDescription,
  rowClassName,
  dense,
  caption,
}: {
  rows: T[]
  columns: Column<T>[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  pageSize?: number
  initialSort?: { id: string; desc?: boolean }
  emptyTitle?: string
  emptyDescription?: string
  rowClassName?: (row: T) => string | undefined
  dense?: boolean
  caption?: string
}) {
  const { t } = useI18n()
  const [sort, setSort] = useState(initialSort)
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.id === sort.id)
    if (!col?.sortValue) return rows
    const get = col.sortValue
    return [...rows].sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return sort.desc ? -cmp : cmp
    })
  }, [rows, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const visible = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize)
  const hasFooter = columns.some((c) => c.footer !== undefined)

  if (rows.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle ?? t('common.empty.title')}</EmptyTitle>
          <EmptyDescription>{emptyDescription ?? t('common.empty.description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((c) => {
                const active = sort?.id === c.id
                return (
                  <TableHead
                    key={c.id}
                    className={cn(
                      'h-9 text-xs font-medium text-muted-foreground',
                      c.align === 'right' && 'text-right',
                      c.align === 'center' && 'text-center',
                      c.className,
                    )}
                    aria-sort={active ? (sort?.desc ? 'descending' : 'ascending') : undefined}
                  >
                    {c.sortValue ? (
                      <button
                        type="button"
                        className={cn(
                          'inline-flex items-center gap-1 rounded hover:text-foreground focus-visible:outline-2',
                          c.align === 'right' && 'flex-row-reverse',
                        )}
                        onClick={() => {
                          setSort(active ? { id: c.id, desc: !sort?.desc } : { id: c.id })
                          setPage(0)
                        }}
                      >
                        {c.header}
                        {active ? (
                          sort?.desc ? (
                            <ArrowDown className="size-3" aria-hidden />
                          ) : (
                            <ArrowUp className="size-3" aria-hidden />
                          )
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" aria-hidden />
                        )}
                      </button>
                    ) : (
                      c.header
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow
                key={getRowId(row)}
                className={cn(onRowClick && 'cursor-pointer', rowClassName?.(row))}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter') onRowClick(row)
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((c) => (
                  <TableCell
                    key={c.id}
                    className={cn(
                      dense ? 'py-1.5' : 'py-2.5',
                      c.align === 'right' && 'text-right',
                      c.align === 'center' && 'text-center',
                      c.className,
                    )}
                  >
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {hasFooter && (
            <TableFooter>
              <TableRow>
                {columns.map((c) => (
                  <TableCell key={c.id} className={cn('py-2.5', c.align === 'right' && 'text-right', c.className)}>
                    {c.footer}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      {sorted.length > pageSize && (
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="tabular">
            {t('common.pagination', {
              from: safePage * pageSize + 1,
              to: Math.min(sorted.length, (safePage + 1) * pageSize),
              total: sorted.length,
            })}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 0}
              aria-label={t('common.previous')}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage >= pageCount - 1}
              aria-label={t('common.next')}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

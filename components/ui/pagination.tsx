"use client"

import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

type PageItem = number | 'ellipsis'

type PaginationSummaryProps = {
  totalItems: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
  itemLabel?: string
  jumpLabel?: string
  hideIfSinglePage?: boolean
  className?: string
  preserveScroll?: boolean
  visibleCount?: number
}

const clampPage = (page: number, totalPages: number) =>
  Math.min(totalPages, Math.max(1, page))

const buildPageItems = (current: number, total: number): PageItem[] => {
  const items: PageItem[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) items.push(i)
    return items
  }
  items.push(1)
  if (current > 3) items.push('ellipsis')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i += 1) items.push(i)
  if (current < total - 2) items.push('ellipsis')
  items.push(total)
  return items
}

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className,
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  clampPage,
  buildPageItems,
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

export const paginate = (totalItems: number, pageSize: number, page: number) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = clampPage(page, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  return { totalPages, safePage, startIndex, endIndex }
}

export function PaginationControls({
  totalItems,
  pageSize,
  page,
  onPageChange,
  itemLabel = 'items',
  jumpLabel,
  hideIfSinglePage = true,
  className,
  preserveScroll = false,
  visibleCount,
}: PaginationSummaryProps) {
  const { totalPages, safePage, startIndex, endIndex } = paginate(totalItems, pageSize, page)
  const pagerRef = React.useRef<HTMLDivElement | null>(null)
  const pendingAnchorTopRef = React.useRef<number | null>(null)
  const currentVisibleCount = visibleCount ?? Math.max(0, endIndex - startIndex)

  React.useEffect(() => {
    if (page !== safePage) onPageChange(safePage)
  }, [page, safePage, onPageChange])

  const maybeCaptureAnchor = () => {
    if (!preserveScroll) return
    pendingAnchorTopRef.current = pagerRef.current?.getBoundingClientRect().top ?? null
  }

  React.useLayoutEffect(() => {
    if (!preserveScroll) return
    const prevTop = pendingAnchorTopRef.current
    if (prevTop == null) return
    const nextTop = pagerRef.current?.getBoundingClientRect().top
    if (typeof nextTop === 'number') window.scrollBy(0, nextTop - prevTop)
    pendingAnchorTopRef.current = null
  }, [preserveScroll, safePage, totalItems, currentVisibleCount])

  const handleChange = (next: number) => {
    maybeCaptureAnchor()
    const clamped = clampPage(next, totalPages)
    if (clamped !== page) onPageChange(clamped)
  }

  if (hideIfSinglePage && totalItems <= pageSize) return null

  const pageItems = buildPageItems(safePage, totalPages)

  const summaryText =
    totalItems === 0
      ? `Showing 0 of 0 ${itemLabel}`
      : `Showing ${startIndex + 1}-${endIndex} of ${totalItems} ${itemLabel}`

  return (
    <div ref={pagerRef} className={cn('flex flex-col items-end gap-2 text-sm text-muted-foreground', className)}>
      <span>{summaryText}</span>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => handleChange(1)}
          className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-accent"
          aria-label="First page"
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleChange(Math.max(1, safePage - 1))}
          className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-accent"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`${item}-${index}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={`${item}-${index}`}
              type="button"
              onClick={() => handleChange(item)}
              className={cn(
                'h-8 w-8 grid place-items-center rounded-full border',
                item === safePage
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-accent',
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => handleChange(Math.min(totalPages, safePage + 1))}
          className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-accent"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleChange(totalPages)}
          className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-accent"
          aria-label="Last page"
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </button>

        <form
          className="flex items-center gap-2 text-xs text-muted-foreground"
          onSubmit={(e) => {
            e.preventDefault()
            const value = (e.currentTarget.elements.namedItem('jump') as HTMLInputElement | null)?.value ?? ''
            const target = Number.parseInt(value, 10)
            if (Number.isNaN(target)) return
            handleChange(target)
          }}
        >
          <input
            name="jump"
            type="number"
            min={1}
            max={totalPages}
            className="w-16 rounded-md border border-slate-300 px-2 py-1 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            defaultValue={safePage}
          />
          <span>{jumpLabel ?? `of ${totalItems} items`}</span>
          <button
            type="submit"
            className="rounded-md border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-accent"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  )
}

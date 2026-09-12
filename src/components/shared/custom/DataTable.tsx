// components/ui/data-table/DataTable.tsx
import { useMemo, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronRight, ChevronLeft, MoreHorizontal, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/formatter';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/shared/states';

export interface Column<T = any> {
  key: string;
  header: string;
  headerIcon?: React.ComponentType<{ className?: string }>;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  width?: string;
  align?: 'start' | 'end';
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    total: number;
    page: number;
    lastPage: number;
    perPage?: number;
  };
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  getRowId: (item: T) => string | number;
  rowActions?: boolean;
  mobileCardComponent?: React.ComponentType<{
    item: T;
    onViewDetails: () => void;
    t: (key: string, options?: any) => string;
    isAr: boolean;
  }>;
  emptyMessage?: string;
  emptyState?: {
    icon?: LucideIcon;
    imageUrl?: string;
    imageAlt?: string;
    title?: string;
    description?: string;
    primaryAction?: {
      label: string;
      icon?: LucideIcon;
      onClick: () => void;
    };
    secondaryAction?: {
      label: string;
      onClick: () => void;
    };
  };
  className?: string;
}

// Helper function for pagination
const getPageNumbers = (current: number, last: number) => {
  const pages: (number | 'ellipsis')[] = [];
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < last - 2) pages.push('ellipsis');
  pages.push(last);
  return pages;
};

// Skeleton loading component
function DataTableSkeleton({ columns }: { columns: Column[] }) {
  const barWidth = (colIndex: number, rowIndex: number) => {
    const widths = [88, 72, 60, 78, 66, 84];
    return widths[(colIndex * 3 + rowIndex) % widths.length];
  };

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="h-0.5 w-full bg-primary/15 skeleton-shimmer" />

      <div className="min-w-[40rem]">
        <Table>
          <TableHeader>
            <TableRow className="bg-background-secondary/40">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 rounded bg-primary/20 skeleton-shimmer" />
                    <span className="h-3.5 w-16 rounded bg-primary/20 skeleton-shimmer" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={column.key}>
                    {colIndex === 0 && column.headerIcon ? (
                      <div className="flex items-center gap-3">
                        <span className="h-9 w-9 shrink-0 rounded-full bg-primary/10 skeleton-shimmer" />
                        <span
                          className="h-4 rounded bg-primary/15 skeleton-shimmer"
                          style={{
                            width: `${barWidth(
                              colIndex,
                              rowIndex,
                            )}%`,
                          }}
                        />
                      </div>
                    ) : (
                      <span
                        className={`block h-4 rounded bg-primary/15 skeleton-shimmer`}
                        style={{
                          width: `${barWidth(
                            colIndex,
                            rowIndex,
                          )}%`,
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="h-4 w-32 rounded bg-primary/15 skeleton-shimmer" />

        <div className="flex items-center gap-1">
          <span className="h-8 w-20 rounded-md bg-primary/10 skeleton-shimmer" />
          <span className="h-8 w-8 rounded-md bg-primary/20 skeleton-shimmer" />
          <span className="h-8 w-8 rounded-md bg-primary/20 skeleton-shimmer" />
          <span className="h-8 w-20 rounded-md bg-primary/10 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

// Pagination component
interface DataTablePaginationProps {
  page: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  t: (key: string, options?: any) => string;
}

function DataTablePagination({
  page,
  lastPage,
  total,
  perPage,
  onPageChange,
  t,
}: DataTablePaginationProps) {
  const pageNumbers = useMemo(
    () => getPageNumbers(page, lastPage),
    [page, lastPage]
  );

  if (lastPage <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const baseButton =
    'inline-flex h-8 items-center rounded-md border border-border transition-colors';

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-muted">
        {t('table.showing', {
          defaultValue: `Showing {{from}} to {{to}} of {{total}} results`,
          from,
          to,
          total: formatNumber(total),
        })}
      </p>

      <nav aria-label={t('table.pagination', { defaultValue: 'Pagination' })}>
        <ul className="flex items-center gap-1">
          <li>
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={cn(
                baseButton,
                'gap-1 px-2 text-text-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-40'
              )}
              aria-label={t('previous')}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              <span className="hidden sm:inline">{t('previous')}</span>
            </button>
          </li>

          {pageNumbers.map((pageNum, idx) => (
            <li key={idx}>
              {pageNum === 'ellipsis' ? (
                <span className="flex h-8 w-8 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-text-muted" />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  aria-current={page === pageNum ? 'page' : undefined}
                  className={cn(
                    baseButton,
                    'min-w-8 justify-center px-2 text-sm',
                    page === pageNum
                      ? 'border-primary/40 bg-primary/10 font-semibold text-primary'
                      : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                  )}
                >
                  {pageNum}
                </button>
              )}
            </li>
          ))}

          <li>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page === lastPage}
              className={cn(
                baseButton,
                'gap-1 px-2 text-text-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-40'
              )}
              aria-label={t('next')}
            >
              <span className="hidden sm:inline">{t('next')}</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

// Main DataTable component
export function DataTable<T = any>({
  data,
  columns,
  loading = false,
  pagination,
  onPageChange,
  onRowClick,
  getRowId,
  rowActions = false,
  mobileCardComponent: MobileCard,
  emptyMessage,
  emptyState,
  className = '',
}: DataTableProps<T>) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return <DataTableSkeleton columns={columns} />;
  }

  const includingActions = rowActions && onRowClick ? columns.length + 1 : columns.length;
  const showActions = rowActions && !!onRowClick;

  // Mobile view with custom card component
  if (isMobile && MobileCard) {
    return (
      <div className={`space-y-3 bg-background ${className}`}>
        {data.map((item) => (
          <MobileCard
            key={getRowId(item)}
            item={item}
            onViewDetails={() => onRowClick?.(item)}
            t={t}
            isAr={isAr}
          />
        ))}
        {data.length === 0 && (
          emptyState ? (
            <EmptyState
              icon={emptyState.icon}
              imageUrl={emptyState.imageUrl}
              imageAlt={emptyState.imageAlt}
              title={emptyState.title ?? emptyMessage ?? t('table.noData')}
              description={emptyState.description ?? ''}
              primaryAction={emptyState.primaryAction}
              secondaryAction={emptyState.secondaryAction}
            />
          ) : (
            <div className="py-8 text-center text-sm text-text-muted">
              {emptyMessage || t('table.noData')}
            </div>
          )
        )}
        {pagination && onPageChange && (
          <DataTablePagination
            page={pagination.page}
            lastPage={pagination.lastPage}
            total={pagination.total}
            perPage={pagination.perPage ?? 10}
            onPageChange={onPageChange}
            t={t}
          />
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className={`overflow-x-auto rounded-md border border-border ${className}`}>
      <div className="min-w-[40rem]">
        <Table>
          <TableHeader>
            <TableRow className="bg-background-secondary/40 hover:bg-background-secondary/40">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width }}
                >
                  <span
                    className={cn(
                      'flex items-center gap-1.5 whitespace-nowrap text-xs font-medium uppercase tracking-wide',
                      column.align === 'end' && 'justify-end'
                    )}
                  >
                    {column.headerIcon && (
                      <column.headerIcon className="h-3.5 w-3.5 text-primary" />
                    )}
                    {column.header}
                  </span>
                </TableHead>
              ))}
              {showActions && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={getRowId(item)}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-background-secondary/60'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      'text-text-secondary',
                      column.align === 'end' && 'text-end'
                    )}
                  >
                    {column.cell
                      ? column.cell(item)
                      : (item as any)[column.key] || '—'}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell className="text-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick?.(item);
                      }}
                      aria-label={t('table.view', { defaultValue: 'View details' })}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-background-card hover:text-primary"
                    >
                      <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={includingActions}
                  className="p-0"
                >
                  {emptyState ? (
                    <EmptyState
                      icon={emptyState.icon}
                      imageUrl={emptyState.imageUrl}
                      imageAlt={emptyState.imageAlt}
                      title={emptyState.title ?? emptyMessage ?? t('table.noData')}
                      description={emptyState.description ?? ''}
                      primaryAction={emptyState.primaryAction}
                      secondaryAction={emptyState.secondaryAction}
                    />
                  ) : (
                    <div className="py-8 text-center text-text-muted">
                      {emptyMessage || t('table.noData')}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && (
        <DataTablePagination
          page={pagination.page}
          lastPage={pagination.lastPage}
          total={pagination.total}
          perPage={pagination.perPage ?? 10}
          onPageChange={onPageChange}
          t={t}
        />
      )}
    </div>
  );
}

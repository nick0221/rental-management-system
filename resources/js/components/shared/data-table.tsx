import { Link, router } from '@inertiajs/react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, SearchX } from 'lucide-react';
import { type ReactNode, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';

export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: any) => any;
    className?: string;
    hideOnMobile?: boolean;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    meta?: {
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    search?: string;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    createRoute?: string;
    createLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    loading?: boolean;
}

export function DataTable({
    columns,
    data,
    meta,
    search,
    searchPlaceholder = 'Search...',
    onSearch,
    createRoute,
    createLabel = 'Create',
    emptyTitle = 'No records found',
    emptyDescription = 'Get started by creating a new entry.',
    loading = false,
}: DataTableProps) {
    const [searchValue, setSearchValue] = useState(search || '');
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSearch = useCallback(
        (value: string) => {
            setSearchValue(value);
            if (onSearch) {
                onSearch(value);
            }
        },
        [onSearch],
    );

    const handleSort = (key: string) => {
        if (sortField === key) {
            setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(key);
            setSortDir('asc');
        }
    };

    const navigateToPage = (page: number) => {
        router.visit(window.location.pathname + `?page=${page}${search ? `&search=${search}` : ''}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                    {searchValue && (
                        <button
                            onClick={() => handleSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <SearchX className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {createRoute && (
                    <Button asChild>
                        <Link href={createRoute}>{createLabel}</Link>
                    </Button>
                )}
            </div>

            {data.length === 0 ? (
                <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={createRoute ? { label: createLabel, href: createRoute } : undefined}
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableHead
                                        key={col.key}
                                        className={cn(col.hideOnMobile && 'hidden md:table-cell', col.className)}
                                    >
                                        {col.sortable ? (
                                            <button
                                                onClick={() => handleSort(col.key)}
                                                className="flex items-center gap-1 font-medium hover:text-foreground"
                                            >
                                                {col.label}
                                                <ArrowUpDown className="h-3 w-3" />
                                            </button>
                                        ) : (
                                            col.label
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item: any, index: number) => (
                                <TableRow key={(item.id as number) || index}>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={cn(col.hideOnMobile && 'hidden md:table-cell', col.className)}
                                        >
                                            {col.render ? col.render(item) : String(item[col.key] ?? '')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {meta.from} to {meta.to} of {meta.total} results
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateToPage(meta.current_page - 1)}
                            disabled={meta.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {meta.current_page} of {meta.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateToPage(meta.current_page + 1)}
                            disabled={meta.current_page === meta.last_page}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

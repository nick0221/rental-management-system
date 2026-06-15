import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import type { Column } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import type { User } from '@/types/auth';
import { index, create } from '@/routes/admin/users';

interface PaginatedUsers {
    data: User[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export default function UsersIndex({ users, filters }: { users: PaginatedUsers; filters: { search?: string; role?: string } }) {
    const columns: Column[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (user: User) => (
                <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (user: User) => <StatusBadge status={user.role ?? ''} />,
        },
        {
            key: 'phone',
            label: 'Phone',
            hideOnMobile: true,
            render: (user: User) => user.phone || '—',
        },
        {
            key: 'created_at',
            label: 'Joined',
            hideOnMobile: true,
            render: (user: User) => new Date(user.created_at).toLocaleDateString(),
        },
        {
            key: 'actions',
            label: '',
            className: 'w-12',
            render: (user: User) => (
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Users" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Users</h1>
                <DataTable
                    columns={columns}
                    data={users.data}
                    meta={users.meta}
                    search={filters.search}
                    searchPlaceholder="Search users..."
                    createRoute={create().url}
                    createLabel="Create User"
                />
            </div>
        </>
    );
}

import { Link } from '@inertiajs/react';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    title?: string;
    description?: string;
    action?: {
        label: string;
        href: string;
    };
    icon?: ReactNode;
}

export function EmptyState({
    title = 'No data found',
    description = 'Get started by creating a new entry.',
    action,
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-muted-foreground">
                {icon || <Inbox className="h-12 w-12" />}
            </div>
            <h3 className="mb-1 text-lg font-semibold">{title}</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
            {action && (
                <Button asChild>
                    <Link href={action.href}>{action.label}</Link>
                </Button>
            )}
        </div>
    );
}

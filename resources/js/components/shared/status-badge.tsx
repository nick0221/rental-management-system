import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    label?: string;
    className?: string;
}

const statusColorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    // Property
    active: 'default',
    inactive: 'secondary',
    under_maintenance: 'destructive',
    // Unit
    available: 'default',
    occupied: 'secondary',
    maintenance: 'destructive',
    reserved: 'outline',
    // Lease
    expired: 'secondary',
    terminated: 'destructive',
    renewed: 'default',
    // Payment
    paid: 'default',
    pending: 'outline',
    overdue: 'destructive',
    refunded: 'secondary',
    partially_paid: 'outline',
    // Maintenance
    reported: 'outline',
    approved: 'default',
    in_progress: 'secondary',
    completed: 'default',
    cancelled: 'secondary',
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    const variant = statusColorMap[status] || 'outline';

    return (
        <Badge variant={variant} className={cn('capitalize', className)}>
            {label || status.replace(/_/g, ' ')}
        </Badge>
    );
}

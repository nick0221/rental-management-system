import { Card, CardContent } from '@/components/ui/card';

interface CardSummaryProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    trend?: {
        direction: 'up' | 'down';
        value: string;
    };
}

export function CardSummary({ title, value, description, icon, trend }: CardSummaryProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                        {trend && (
                            <p className={`text-xs ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
                            </p>
                        )}
                    </div>
                    {icon && (
                        <div className="text-muted-foreground">{icon}</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

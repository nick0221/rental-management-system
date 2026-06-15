export enum MaintenancePriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
    Emergency = 'emergency',
}

export enum MaintenanceStatus {
    Reported = 'reported',
    Approved = 'approved',
    InProgress = 'in_progress',
    Completed = 'completed',
    Cancelled = 'cancelled',
}

export interface MaintenanceRequest {
    id: number;
    property_id: number;
    unit_id: number;
    reporter_id: number;
    assignee_id: number | null;
    title: string;
    description: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    scheduled_at: string | null;
    completed_at: string | null;
    cost: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    property?: { id: number; name: string; address?: string; city?: string; state?: string };
    unit?: { id: number; name: string; unit_number?: string | null };
    reporter?: { id: number; name: string; email?: string; phone?: string | null };
    assignee?: { id: number; name: string } | null;
}

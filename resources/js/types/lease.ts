export enum LeaseStatus {
    Active = 'active',
    Expired = 'expired',
    Terminated = 'terminated',
    Renewed = 'renewed',
}

export interface Lease {
    id: number;
    property_id: number;
    unit_id: number;
    renter_id: number;
    start_date: string;
    end_date: string;
    monthly_rent: number;
    security_deposit: number | null;
    status: LeaseStatus;
    terms: string | null;
    signed_at: string | null;
    terminated_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    property?: { id: number; name: string; address?: string; city?: string; state?: string; description?: string };
    unit?: import('./unit').Unit | { id: number; name: string; unit_number?: string; bedrooms?: number; bathrooms?: number };
    renter?: { id: number; name: string; email: string; phone?: string | null };
    payments?: import('./payment').Payment[];
}

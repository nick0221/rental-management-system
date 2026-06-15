export enum UnitStatus {
    Available = 'available',
    Occupied = 'occupied',
    Maintenance = 'maintenance',
    Reserved = 'reserved',
}

export interface Unit {
    id: number;
    property_id: number;
    name: string;
    unit_number: string | null;
    floor: number | null;
    bedrooms: number;
    bathrooms: number;
    square_feet: number | null;
    rent_amount: number;
    security_deposit: number | null;
    status: UnitStatus;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    property?: import('./property').Property;
    leases_count?: number;
}

export interface UnitFormData {
    name: string;
    unit_number?: string;
    floor?: number | null;
    bedrooms: number;
    bathrooms: number;
    square_feet?: number | null;
    rent_amount: number;
    security_deposit?: number | null;
    status?: string;
}

export enum PropertyType {
    ApartmentBuilding = 'apartment_building',
    House = 'house',
    Commercial = 'commercial',
    MixedUse = 'mixed_use',
}

export enum PropertyStatus {
    Active = 'active',
    Inactive = 'inactive',
    UnderMaintenance = 'under_maintenance',
}

export interface Property {
    id: number;
    owner_id: number;
    name: string;
    slug: string;
    description: string | null;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    type: PropertyType;
    status: PropertyStatus;
    total_units: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    owner?: { id: number; name: string; email: string };
    units_count?: number;
    leases_count?: number;
    units?: import('./unit').Unit[];
}

export interface PropertyFormData {
    name: string;
    description?: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    type: string;
    status?: string;
}

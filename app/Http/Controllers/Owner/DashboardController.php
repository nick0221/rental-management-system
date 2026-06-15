<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the owner dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $properties = Property::where('owner_id', $user->id)->withCount('units')->get();
        $propertyIds = $properties->pluck('id');

        $totalUnits = Unit::whereIn('property_id', $propertyIds)->count();
        $occupiedUnits = Unit::whereIn('property_id', $propertyIds)->where('status', 'occupied')->count();
        $activeLeases = Lease::whereIn('property_id', $propertyIds)->where('status', 'active')->count();
        $monthlyRevenue = Payment::whereIn('lease_id', Lease::whereIn('property_id', $propertyIds)->pluck('id'))
            ->where('status', 'paid')
            ->whereMonth('paid_at', now()->month)
            ->whereYear('paid_at', now()->year)
            ->sum('amount');

        $pendingMaintenance = MaintenanceRequest::whereIn('property_id', $propertyIds)
            ->whereIn('status', ['reported', 'approved'])
            ->count();

        $expiringLeases = Lease::whereIn('property_id', $propertyIds)
            ->where('status', 'active')
            ->whereDate('end_date', '>=', now())
            ->whereDate('end_date', '<=', now()->addDays(30))
            ->with('unit:id,name', 'renter:id,name')
            ->get();

        $stats = [
            'totalProperties' => $properties->count(),
            'totalUnits' => $totalUnits,
            'occupiedUnits' => $occupiedUnits,
            'vacantUnits' => $totalUnits - $occupiedUnits,
            'activeLeases' => $activeLeases,
            'monthlyRevenue' => $monthlyRevenue,
            'pendingMaintenance' => $pendingMaintenance,
        ];

        $revenuePerProperty = Property::where('owner_id', $user->id)
            ->withCount(['units', 'leases' => fn ($q) => $q->where('status', 'active')])
            ->get()
            ->map(fn ($property) => [
                'id' => $property->id,
                'name' => $property->name,
                'units_count' => $property->units_count,
                'active_leases' => $property->leases_count,
            ]);

        return Inertia::render('owner/dashboard', [
            'stats' => $stats,
            'properties' => $properties->loadCount('units'),
            'expiringLeases' => $expiringLeases,
            'revenuePerProperty' => $revenuePerProperty,
        ]);
    }
}

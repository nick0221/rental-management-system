<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $stats = [
            'totalUsers' => User::count(),
            'totalOwners' => User::where('role', 'owner')->count(),
            'totalRenters' => User::where('role', 'renter')->count(),
            'totalProperties' => Property::count(),
            'totalUnits' => Unit::count(),
            'totalActiveLeases' => Lease::where('status', 'active')->count(),
            'monthlyRevenue' => Payment::where('status', 'paid')
                ->whereMonth('paid_at', now()->month)
                ->whereYear('paid_at', now()->year)
                ->sum('amount'),
            'pendingMaintenance' => MaintenanceRequest::whereIn('status', ['reported', 'approved'])->count(),
        ];

        $recentUsers = User::latest()->take(10)->get()->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role?->value,
            'created_at' => $user->created_at->format('Y-m-d'),
        ]);

        $monthlyRevenue = collect(range(11, 0))->map(function ($i) {
            $date = now()->subMonths($i);

            return [
                'month' => $date->format('M Y'),
                'revenue' => Payment::where('status', 'paid')
                    ->whereMonth('paid_at', $date->month)
                    ->whereYear('paid_at', $date->year)
                    ->sum('amount'),
            ];
        });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'monthlyRevenue' => $monthlyRevenue,
        ]);
    }
}

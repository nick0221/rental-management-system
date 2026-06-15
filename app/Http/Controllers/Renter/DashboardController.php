<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the renter dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $activeLease = Lease::where('renter_id', $user->id)
            ->where('status', 'active')
            ->with('property:id,name,address,city,state', 'unit:id,name,unit_number,bedrooms,bathrooms,rent_amount')
            ->first();

        $currentMonthPayment = null;
        if ($activeLease) {
            $currentMonthPayment = Payment::where('lease_id', $activeLease->id)
                ->whereMonth('due_date', now()->month)
                ->whereYear('due_date', now()->year)
                ->first();
        }

        $recentPayments = Payment::whereIn('lease_id', Lease::where('renter_id', $user->id)->pluck('id'))
            ->latest()
            ->take(5)
            ->get();

        $recentMaintenance = MaintenanceRequest::where('reporter_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $stats = [
            'hasActiveLease' => $activeLease !== null,
            'leaseEndDate' => $activeLease?->end_date?->format('Y-m-d'),
            'daysUntilLeaseEnd' => $activeLease ? now()->diffInDays($activeLease->end_date, false) : 0,
            'currentMonthPaymentStatus' => $currentMonthPayment?->status?->value ?? 'no_lease',
            'currentMonthAmount' => $currentMonthPayment?->amount ?? $activeLease?->monthly_rent ?? 0,
            'totalPaid' => Payment::whereIn('lease_id', Lease::where('renter_id', $user->id)->pluck('id'))
                ->where('status', 'paid')
                ->sum('amount'),
        ];

        return Inertia::render('renter/dashboard', [
            'activeLease' => $activeLease,
            'stats' => $stats,
            'recentPayments' => $recentPayments,
            'recentMaintenance' => $recentMaintenance,
        ]);
    }
}

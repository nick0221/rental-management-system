<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;
use App\Models\Lease;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaseController extends Controller
{
    /**
     * Display the renter's current lease.
     */
    public function show(Request $request): Response
    {
        $lease = Lease::where('renter_id', $request->user()->id)
            ->where('status', 'active')
            ->with([
                'property:id,name,address,city,state,description',
                'unit:id,name,unit_number,bedrooms,bathrooms,square_feet,rent_amount',
                'payments' => fn ($q) => $q->latest()->take(12),
            ])
            ->first();

        if (! $lease) {
            return Inertia::render('renter/lease', [
                'lease' => null,
                'message' => __('You do not have an active lease.'),
            ]);
        }

        $paymentStatus = $lease->payments->sortByDesc('due_date')->first();

        return Inertia::render('renter/lease', [
            'lease' => $lease,
            'paymentStatus' => $paymentStatus,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Lease;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display a listing of the renter's payments.
     */
    public function index(Request $request): Response
    {
        $leaseIds = Lease::where('renter_id', $request->user()->id)->pluck('id');

        $payments = Payment::whereIn('lease_id', $leaseIds)
            ->with('lease:id,property_id,unit_id', 'lease.property:id,name', 'lease.unit:id,name')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('renter/payments/index', [
            'payments' => $payments,
        ]);
    }

    /**
     * Show the form for creating a new payment.
     */
    public function create(Request $request): Response
    {
        $activeLease = Lease::where('renter_id', $request->user()->id)
            ->where('status', 'active')
            ->with('property:id,name', 'unit:id,name')
            ->first();

        if (! $activeLease) {
            return to_route('renter.payments.index')
                ->with('error', __('You need an active lease to make a payment.'));
        }

        return Inertia::render('renter/payments/create', [
            'lease' => $activeLease,
            'suggestedAmount' => $activeLease->monthly_rent,
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(PaymentRequest $request): RedirectResponse
    {
        $payment = Payment::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'paid_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment recorded successfully.')]);

        return to_route('renter.payments.show', $payment);
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment): Response
    {
        $this->authorize('view', $payment);

        $payment->load([
            'lease:id,property_id,unit_id,start_date,end_date,monthly_rent',
            'lease.property:id,name,address',
            'lease.unit:id,name,unit_number',
        ]);

        return Inertia::render('renter/payments/show', [
            'payment' => $payment,
        ]);
    }
}

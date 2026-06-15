<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\LeaseRequest;
use App\Models\Lease;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaseController extends Controller
{
    /**
     * Display a listing of leases for the owner's properties.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Lease::class);

        $propertyIds = Property::where('owner_id', $request->user()->id)->pluck('id');

        $leases = Lease::whereIn('property_id', $propertyIds)
            ->with('property:id,name', 'unit:id,name', 'renter:id,name,email')
            ->when($request->search, fn ($q, $search) => $q->whereHas('renter', fn ($r) => $r->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('owner/leases/index', [
            'leases' => $leases,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new lease.
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', Lease::class);

        $properties = Property::where('owner_id', $request->user()->id)
            ->with(['units' => fn ($q) => $q->where('status', 'available')])
            ->get();

        $renters = User::renters()->where('email_verified_at', '!=', null)->get(['id', 'name', 'email']);

        return Inertia::render('owner/leases/create', [
            'properties' => $properties,
            'renters' => $renters,
        ]);
    }

    /**
     * Store a newly created lease in storage.
     */
    public function store(LeaseRequest $request): RedirectResponse
    {
        $lease = Lease::create($request->validated());

        // Mark unit as occupied
        Unit::where('id', $request->unit_id)->update(['status' => 'occupied']);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Lease created successfully.')]);

        return to_route('owner.leases.show', $lease);
    }

    /**
     * Display the specified lease.
     */
    public function show(Lease $lease): Response
    {
        $this->authorize('view', $lease);

        $lease->load([
            'property:id,name,address,city,state',
            'unit:id,name,unit_number,bedrooms,bathrooms',
            'renter:id,name,email,phone',
            'payments' => fn ($q) => $q->latest()->take(12),
        ]);

        return Inertia::render('owner/leases/show', [
            'lease' => $lease,
        ]);
    }

    /**
     * Show the form for editing the specified lease.
     */
    public function edit(Lease $lease, Request $request): Response
    {
        $this->authorize('update', $lease);

        $properties = Property::where('owner_id', $request->user()->id)
            ->with(['units' => fn ($q) => $q->where('status', 'available')->orWhere('id', $lease->unit_id)])
            ->get();

        $renters = User::renters()->get(['id', 'name', 'email']);

        return Inertia::render('owner/leases/edit', [
            'lease' => $lease->load('property:id,name', 'unit:id,name', 'renter:id,name,email'),
            'properties' => $properties,
            'renters' => $renters,
        ]);
    }

    /**
     * Update the specified lease in storage.
     */
    public function update(LeaseRequest $request, Lease $lease): RedirectResponse
    {
        $lease->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Lease updated successfully.')]);

        return to_route('owner.leases.show', $lease);
    }

    /**
     * Remove the specified lease from storage.
     */
    public function destroy(Lease $lease): RedirectResponse
    {
        $this->authorize('delete', $lease);

        // Mark unit as available
        Unit::where('id', $lease->unit_id)->update(['status' => 'available']);

        $lease->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Lease deleted successfully.')]);

        return to_route('owner.leases.index');
    }
}

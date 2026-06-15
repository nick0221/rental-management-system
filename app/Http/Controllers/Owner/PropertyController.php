<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyRequest;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Display a listing of the owner's properties.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Property::class);

        $properties = Property::query()
            ->forOwner($request->user())
            ->withCount(['units', 'leases' => fn ($q) => $q->where('status', 'active')])
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('owner/properties/index', [
            'properties' => $properties,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new property.
     */
    public function create(): Response
    {
        $this->authorize('create', Property::class);

        return Inertia::render('owner/properties/create');
    }

    /**
     * Store a newly created property in storage.
     */
    public function store(PropertyRequest $request): RedirectResponse
    {
        $property = Property::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'slug' => Str::slug($request->name),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Property created successfully.')]);

        return to_route('owner.properties.show', $property);
    }

    /**
     * Display the specified property.
     */
    public function show(Property $property): Response
    {
        $this->authorize('view', $property);

        $property->load(['units' => fn ($q) => $q->withCount(['leases' => fn ($lq) => $lq->where('status', 'active')])]);

        $activeLeases = Lease::where('property_id', $property->id)
            ->where('status', 'active')
            ->with('unit:id,name', 'renter:id,name,email,phone')
            ->get();

        $pendingMaintenance = MaintenanceRequest::where('property_id', $property->id)
            ->whereIn('status', ['reported', 'approved', 'in_progress'])
            ->with('unit:id,name', 'reporter:id,name')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('owner/properties/show', [
            'property' => $property,
            'activeLeases' => $activeLeases,
            'pendingMaintenance' => $pendingMaintenance,
        ]);
    }

    /**
     * Show the form for editing the specified property.
     */
    public function edit(Property $property): Response
    {
        $this->authorize('update', $property);

        return Inertia::render('owner/properties/edit', [
            'property' => $property,
        ]);
    }

    /**
     * Update the specified property in storage.
     */
    public function update(PropertyRequest $request, Property $property): RedirectResponse
    {
        $property->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Property updated successfully.')]);

        return to_route('owner.properties.show', $property);
    }

    /**
     * Remove the specified property from storage.
     */
    public function destroy(Property $property): RedirectResponse
    {
        $this->authorize('delete', $property);

        $property->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Property deleted successfully.')]);

        return to_route('owner.properties.index');
    }
}

<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\UnitRequest;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    /**
     * Display a listing of units for a property.
     */
    public function index(Property $property): Response
    {
        $this->authorize('view', $property);

        $units = $property->units()
            ->withCount(['leases' => fn ($q) => $q->where('status', 'active')])
            ->latest()
            ->paginate(15);

        return Inertia::render('owner/units/index', [
            'property' => $property->loadCount('units'),
            'units' => $units,
        ]);
    }

    /**
     * Show the form for creating a new unit.
     */
    public function create(Property $property): Response
    {
        $this->authorize('update', $property);

        return Inertia::render('owner/units/create', [
            'property' => $property,
        ]);
    }

    /**
     * Store a newly created unit in storage.
     */
    public function store(UnitRequest $request, Property $property): RedirectResponse
    {
        $unit = $property->units()->create($request->validated());

        // Update property total_units count
        $property->increment('total_units');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Unit created successfully.')]);

        return to_route('owner.properties.show', $property);
    }

    /**
     * Show the form for editing the specified unit.
     */
    public function edit(Unit $unit): Response
    {
        $this->authorize('update', $unit);

        $unit->load('property:id,name');

        return Inertia::render('owner/units/edit', [
            'unit' => $unit,
        ]);
    }

    /**
     * Update the specified unit in storage.
     */
    public function update(UnitRequest $request, Unit $unit): RedirectResponse
    {
        $unit->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Unit updated successfully.')]);

        return to_route('owner.properties.show', $unit->property);
    }

    /**
     * Remove the specified unit from storage.
     */
    public function destroy(Unit $unit): RedirectResponse
    {
        $this->authorize('delete', $unit);

        $property = $unit->property;
        $unit->delete();

        // Update property total_units count
        $property->decrement('total_units');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Unit deleted successfully.')]);

        return to_route('owner.properties.show', $property);
    }
}

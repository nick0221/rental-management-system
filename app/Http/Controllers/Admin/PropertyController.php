<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Display a listing of properties.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Property::class);

        $properties = Property::query()
            ->with('owner:id,name,email')
            ->withCount('units', 'leases')
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/properties/index', [
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

        return Inertia::render('admin/properties/create');
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

        return to_route('admin.properties.edit', $property);
    }

    /**
     * Show the form for editing the specified property.
     */
    public function edit(Property $property): Response
    {
        $this->authorize('update', $property);

        $property->load('units');

        return Inertia::render('admin/properties/edit', [
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

        return to_route('admin.properties.edit', $property);
    }

    /**
     * Remove the specified property from storage.
     */
    public function destroy(Property $property): RedirectResponse
    {
        $this->authorize('delete', $property);

        $property->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Property deleted successfully.')]);

        return to_route('admin.properties.index');
    }
}

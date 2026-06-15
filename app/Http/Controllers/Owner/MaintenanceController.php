<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of maintenance requests for the owner's properties.
     */
    public function index(Request $request): Response
    {
        $propertyIds = Property::where('owner_id', $request->user()->id)->pluck('id');

        $requests = MaintenanceRequest::whereIn('property_id', $propertyIds)
            ->with('property:id,name', 'unit:id,name', 'reporter:id,name', 'assignee:id,name')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->priority, fn ($q, $priority) => $q->where('priority', $priority))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('owner/maintenance/index', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'priority']),
        ]);
    }

    /**
     * Display the specified maintenance request.
     */
    public function show(MaintenanceRequest $maintenanceRequest): Response
    {
        $this->authorize('view', $maintenanceRequest);

        $maintenanceRequest->load([
            'property:id,name,address,city,state',
            'unit:id,name,unit_number',
            'reporter:id,name,email,phone',
            'assignee:id,name',
        ]);

        return Inertia::render('owner/maintenance/show', [
            'request' => $maintenanceRequest,
        ]);
    }

    /**
     * Update the specified maintenance request.
     */
    public function update(Request $request, MaintenanceRequest $maintenanceRequest): RedirectResponse
    {
        $this->authorize('update', $maintenanceRequest);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:approved,in_progress,completed,cancelled'],
            'assignee_id' => ['nullable', 'exists:users,id'],
            'scheduled_at' => ['nullable', 'date'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'completed_at' => ['nullable', 'date'],
        ]);

        if ($validated['status'] === 'completed' && ! isset($validated['completed_at'])) {
            $validated['completed_at'] = now();
        }

        $maintenanceRequest->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Maintenance request updated.')]);

        return to_route('owner.maintenance.show', $maintenanceRequest);
    }
}

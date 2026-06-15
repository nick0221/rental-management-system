<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;
use App\Http\Requests\MaintenanceRequestForm;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    /**
     * Display a listing of the renter's maintenance requests.
     */
    public function index(Request $request): Response
    {
        $requests = MaintenanceRequest::where('reporter_id', $request->user()->id)
            ->with('property:id,name', 'unit:id,name', 'assignee:id,name')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('renter/maintenance/index', [
            'requests' => $requests,
        ]);
    }

    /**
     * Show the form for creating a new maintenance request.
     */
    public function create(Request $request): Response
    {
        $activeLease = Lease::where('renter_id', $request->user()->id)
            ->where('status', 'active')
            ->with('property:id,name', 'unit:id,name,unit_number')
            ->first();

        if (! $activeLease) {
            return to_route('renter.maintenance.index')
                ->with('error', __('You need an active lease to submit a maintenance request.'));
        }

        return Inertia::render('renter/maintenance/create', [
            'lease' => $activeLease,
        ]);
    }

    /**
     * Store a newly created maintenance request.
     */
    public function store(MaintenanceRequestForm $request): RedirectResponse
    {
        $maintenanceRequest = MaintenanceRequest::create([
            ...$request->validated(),
            'reporter_id' => $request->user()->id,
            'status' => 'reported',
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Maintenance request submitted successfully.')]);

        return to_route('renter.maintenance.show', $maintenanceRequest);
    }

    /**
     * Display the specified maintenance request.
     */
    public function show(MaintenanceRequest $maintenanceRequest): Response
    {
        $this->authorize('view', $maintenanceRequest);

        $maintenanceRequest->load([
            'property:id,name,address',
            'unit:id,name,unit_number',
            'assignee:id,name',
        ]);

        return Inertia::render('renter/maintenance/show', [
            'request' => $maintenanceRequest,
        ]);
    }
}

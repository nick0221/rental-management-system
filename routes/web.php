<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PropertyController as AdminPropertyController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Owner\DashboardController as OwnerDashboardController;
use App\Http\Controllers\Owner\LeaseController as OwnerLeaseController;
use App\Http\Controllers\Owner\MaintenanceController as OwnerMaintenanceController;
use App\Http\Controllers\Owner\PropertyController as OwnerPropertyController;
use App\Http\Controllers\Owner\UnitController as OwnerUnitController;
use App\Http\Controllers\Renter\DashboardController as RenterDashboardController;
use App\Http\Controllers\Renter\LeaseController as RenterLeaseController;
use App\Http\Controllers\Renter\MaintenanceController as RenterMaintenanceController;
use App\Http\Controllers\Renter\PaymentController as RenterPaymentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Authenticated + Verified routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Renter dashboard (default role dashboard)
    Route::get('dashboard', [RenterDashboardController::class, 'index'])->name('dashboard');

    // ===== RENTER ROUTES =====
    Route::name('renter.')->group(function () {
        Route::prefix('my-lease')->name('lease.')->group(function () {
            Route::get('/', [RenterLeaseController::class, 'show'])->name('show');
        });

        Route::prefix('payments')->name('payments.')->group(function () {
            Route::get('/', [RenterPaymentController::class, 'index'])->name('index');
            Route::get('create', [RenterPaymentController::class, 'create'])->name('create');
            Route::post('/', [RenterPaymentController::class, 'store'])->name('store');
            Route::get('{payment}', [RenterPaymentController::class, 'show'])->name('show');
        });

        Route::prefix('maintenance')->name('maintenance.')->group(function () {
            Route::get('/', [RenterMaintenanceController::class, 'index'])->name('index');
            Route::get('create', [RenterMaintenanceController::class, 'create'])->name('create');
            Route::post('/', [RenterMaintenanceController::class, 'store'])->name('store');
            Route::get('{maintenanceRequest}', [RenterMaintenanceController::class, 'show'])->name('show');
        });
    });

    // ===== OWNER ROUTES =====
    Route::middleware('role:owner,super_admin')->prefix('owner')->name('owner.')->group(function () {
        Route::get('dashboard', [OwnerDashboardController::class, 'index'])->name('dashboard');

        Route::prefix('properties')->name('properties.')->group(function () {
            Route::get('/', [OwnerPropertyController::class, 'index'])->name('index');
            Route::get('create', [OwnerPropertyController::class, 'create'])->name('create');
            Route::post('/', [OwnerPropertyController::class, 'store'])->name('store');
            Route::get('{property}', [OwnerPropertyController::class, 'show'])->name('show');
            Route::get('{property}/edit', [OwnerPropertyController::class, 'edit'])->name('edit');
            Route::patch('{property}', [OwnerPropertyController::class, 'update'])->name('update');
            Route::delete('{property}', [OwnerPropertyController::class, 'destroy'])->name('destroy');

            // Nested units under property
            Route::prefix('{property}/units')->name('units.')->group(function () {
                Route::get('/', [OwnerUnitController::class, 'index'])->name('index');
                Route::get('create', [OwnerUnitController::class, 'create'])->name('create');
                Route::post('/', [OwnerUnitController::class, 'store'])->name('store');
            });
        });

        // Standalone unit routes (for edit/delete)
        Route::prefix('units')->name('units.')->group(function () {
            Route::get('{unit}/edit', [OwnerUnitController::class, 'edit'])->name('edit');
            Route::patch('{unit}', [OwnerUnitController::class, 'update'])->name('update');
            Route::delete('{unit}', [OwnerUnitController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('leases')->name('leases.')->group(function () {
            Route::get('/', [OwnerLeaseController::class, 'index'])->name('index');
            Route::get('create', [OwnerLeaseController::class, 'create'])->name('create');
            Route::post('/', [OwnerLeaseController::class, 'store'])->name('store');
            Route::get('{lease}', [OwnerLeaseController::class, 'show'])->name('show');
            Route::get('{lease}/edit', [OwnerLeaseController::class, 'edit'])->name('edit');
            Route::patch('{lease}', [OwnerLeaseController::class, 'update'])->name('update');
            Route::delete('{lease}', [OwnerLeaseController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('maintenance')->name('maintenance.')->group(function () {
            Route::get('/', [OwnerMaintenanceController::class, 'index'])->name('index');
            Route::get('{maintenanceRequest}', [OwnerMaintenanceController::class, 'show'])->name('show');
            Route::patch('{maintenanceRequest}', [OwnerMaintenanceController::class, 'update'])->name('update');
        });
    });

    // ===== ADMIN ROUTES =====
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [AdminUserController::class, 'index'])->name('index');
            Route::get('create', [AdminUserController::class, 'create'])->name('create');
            Route::post('/', [AdminUserController::class, 'store'])->name('store');
            Route::get('{user}/edit', [AdminUserController::class, 'edit'])->name('edit');
            Route::patch('{user}', [AdminUserController::class, 'update'])->name('update');
            Route::delete('{user}', [AdminUserController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('properties')->name('properties.')->group(function () {
            Route::get('/', [AdminPropertyController::class, 'index'])->name('index');
            Route::get('create', [AdminPropertyController::class, 'create'])->name('create');
            Route::post('/', [AdminPropertyController::class, 'store'])->name('store');
            Route::get('{property}/edit', [AdminPropertyController::class, 'edit'])->name('edit');
            Route::patch('{property}', [AdminPropertyController::class, 'update'])->name('update');
            Route::delete('{property}', [AdminPropertyController::class, 'destroy'])->name('destroy');
        });
    });
});

require __DIR__.'/settings.php';

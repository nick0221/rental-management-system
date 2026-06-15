<?php

namespace Database\Seeders;

use App\Enums\LeaseStatus;
use App\Enums\MaintenancePriority;
use App\Enums\MaintenanceStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\PropertyStatus;
use App\Enums\PropertyType;
use App\Enums\UnitStatus;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ===== SUPER ADMIN =====
        $admin = User::factory()->superAdmin()->create([
            'name' => 'Super Admin',
            'email' => 'admin@rental.com',
            'phone' => '+1 (555) 000-0001',
        ]);

        // ===== OWNERS =====
        $owner1 = User::factory()->owner()->create([
            'name' => 'John Properties',
            'email' => 'john@example.com',
            'phone' => '+1 (555) 100-0001',
        ]);

        $owner2 = User::factory()->owner()->create([
            'name' => 'Jane Estates',
            'email' => 'jane@example.com',
            'phone' => '+1 (555) 100-0002',
        ]);

        $owner3 = User::factory()->owner()->create([
            'name' => 'Mike Realty Group',
            'email' => 'mike@example.com',
            'phone' => '+1 (555) 100-0003',
        ]);

        $owners = [$owner1, $owner2, $owner3];

        // ===== RENTERS =====
        $renters = User::factory(10)->renter()->sequence(
            ['name' => 'Alice Johnson', 'email' => 'alice@example.com', 'phone' => '+1 (555) 200-0001'],
            ['name' => 'Bob Smith', 'email' => 'bob@example.com', 'phone' => '+1 (555) 200-0002'],
            ['name' => 'Carol Williams', 'email' => 'carol@example.com', 'phone' => '+1 (555) 200-0003'],
            ['name' => 'David Brown', 'email' => 'david@example.com', 'phone' => '+1 (555) 200-0004'],
            ['name' => 'Eve Davis', 'email' => 'eve@example.com', 'phone' => '+1 (555) 200-0005'],
            ['name' => 'Frank Miller', 'email' => 'frank@example.com', 'phone' => '+1 (555) 200-0006'],
            ['name' => 'Grace Wilson', 'email' => 'grace@example.com', 'phone' => '+1 (555) 200-0007'],
            ['name' => 'Henry Moore', 'email' => 'henry@example.com', 'phone' => '+1 (555) 200-0008'],
            ['name' => 'Ivy Taylor', 'email' => 'ivy@example.com', 'phone' => '+1 (555) 200-0009'],
            ['name' => 'Jack Anderson', 'email' => 'jack@example.com', 'phone' => '+1 (555) 200-0010'],
        )->create();

        // ===== PROPERTIES & UNITS =====
        $allProperties = [];

        foreach ($owners as $owner) {
            $propertyCount = fake()->numberBetween(2, 3);

            for ($p = 0; $p < $propertyCount; $p++) {
                $type = fake()->randomElement([PropertyType::ApartmentBuilding, PropertyType::House, PropertyType::MixedUse]);
                $unitCount = $type === PropertyType::House ? fake()->numberBetween(1, 4) : fake()->numberBetween(6, 15);

                $property = Property::factory()->create([
                    'owner_id' => $owner->id,
                    'type' => $type->value,
                    'status' => PropertyStatus::Active->value,
                    'total_units' => $unitCount,
                ]);

                // Create units for this property
                for ($u = 0; $u < $unitCount; $u++) {
                    $floor = $type === PropertyType::House ? null : fake()->numberBetween(1, 5);
                    $unitNumber = str_pad((string) ($u + 1), 3, '0', STR_PAD_LEFT);

                    Unit::factory()->create([
                        'property_id' => $property->id,
                        'name' => $type === PropertyType::House ? 'Main Unit' : "Unit {$unitNumber}",
                        'unit_number' => $unitNumber,
                        'floor' => $floor,
                        'status' => UnitStatus::Available->value,
                        'bedrooms' => fake()->numberBetween(0, 4),
                        'bathrooms' => fake()->numberBetween(1, 3),
                        'square_feet' => fake()->numberBetween(400, 2000),
                        'rent_amount' => fake()->randomFloat(2, 800, 4000),
                        'security_deposit' => fake()->randomFloat(2, 800, 4000),
                    ]);
                }

                $allProperties[] = $property;
            }
        }

        // ===== LEASES (assign some units to renters) =====
        $allLeases = [];
        $renterIndex = 0;

        foreach ($allProperties as $property) {
            $units = $property->units()->orderBy('id')->get();
            // Occupy roughly 70% of units
            $unitsToOccupy = $units->take((int) ceil($units->count() * 0.7));

            foreach ($unitsToOccupy as $unit) {
                $renter = $renters[$renterIndex % $renters->count()];
                $renterIndex++;

                $startDate = fake()->dateTimeBetween('-2 years', '-1 month');
                $endDate = fake()->dateTimeBetween('+3 months', '+2 years');

                $lease = Lease::factory()->create([
                    'property_id' => $property->id,
                    'unit_id' => $unit->id,
                    'renter_id' => $renter->id,
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d'),
                    'monthly_rent' => $unit->rent_amount,
                    'security_deposit' => $unit->security_deposit,
                    'status' => LeaseStatus::Active->value,
                    'signed_at' => $startDate,
                ]);

                // Mark unit as occupied
                $unit->update(['status' => UnitStatus::Occupied->value]);

                $allLeases[] = $lease;
            }
        }

        // ===== PAYMENTS (6 months of payments for each active lease) =====
        foreach ($allLeases as $lease) {
            $monthsBack = 6;

            for ($m = $monthsBack; $m >= 1; $m--) {
                $dueDate = now()->subMonths($m)->startOfMonth()->addDays(fake()->numberBetween(1, 5));
                $isPaid = fake()->boolean(90); // 90% paid on time

                $payment = Payment::factory()->create([
                    'lease_id' => $lease->id,
                    'user_id' => $lease->renter_id,
                    'amount' => $lease->monthly_rent,
                    'due_date' => $dueDate->format('Y-m-d'),
                    'status' => $isPaid ? PaymentStatus::Paid->value : PaymentStatus::Overdue->value,
                    'payment_method' => $isPaid ? fake()->randomElement([PaymentMethod::BankTransfer, PaymentMethod::CreditCard, PaymentMethod::Online])->value : null,
                    'reference_number' => $isPaid ? 'PAY-'.strtoupper(fake()->bothify('####-????')) : null,
                    'paid_at' => $isPaid ? $dueDate->copy()->addDays(fake()->numberBetween(0, 7)) : null,
                ]);
            }

            // Create current month payment as pending
            $currentDueDate = now()->startOfMonth()->addDays(fake()->numberBetween(1, 5));

            // Check if current month is already past due
            if (now()->day > 5) {
                Payment::factory()->create([
                    'lease_id' => $lease->id,
                    'user_id' => $lease->renter_id,
                    'amount' => $lease->monthly_rent,
                    'due_date' => $currentDueDate->format('Y-m-d'),
                    'status' => fake()->boolean(60) ? PaymentStatus::Pending->value : PaymentStatus::Paid->value,
                    'payment_method' => null,
                    'reference_number' => null,
                    'paid_at' => null,
                ]);
            }
        }

        // ===== MAINTENANCE REQUESTS =====
        $maintenanceTitles = [
            'Leaking faucet in kitchen',
            'Broken thermostat',
            'Water heater not working',
            'Clogged toilet',
            'Electrical outlet not working',
            'Broken window lock',
            'HVAC system making noise',
            'Garbage disposal jammed',
            'Ceiling leak from upstairs',
            'Door handle broken',
            'Mold in bathroom',
            'Pest infestation in kitchen',
            'Broken dishwasher',
            'Smoke detector battery low',
            'Crack in bathroom tile',
        ];

        foreach (collect($allLeases)->take(12) as $lease) {
            $status = fake()->randomElement(MaintenanceStatus::cases());
            $title = fake()->randomElement($maintenanceTitles);
            $priority = fake()->randomElement(MaintenancePriority::cases());

            $request = MaintenanceRequest::factory()->create([
                'property_id' => $lease->property_id,
                'unit_id' => $lease->unit_id,
                'reporter_id' => $lease->renter_id,
                'assignee_id' => $status === MaintenanceStatus::Completed || $status === MaintenanceStatus::InProgress
                    ? $lease->property->owner_id
                    : null,
                'title' => $title,
                'priority' => $priority->value,
                'status' => $status->value,
                'scheduled_at' => $status === MaintenanceStatus::InProgress || $status === MaintenanceStatus::Approved
                    ? fake()->dateTimeBetween('now', '+1 month')
                    : null,
                'completed_at' => $status === MaintenanceStatus::Completed
                    ? fake()->dateTimeBetween('-2 weeks', 'now')
                    : null,
                'cost' => $status === MaintenanceStatus::Completed
                    ? fake()->randomFloat(2, 50, 1500)
                    : null,
            ]);
        }

        // ===== ADDITIONAL MAINTENANCE REQUESTS (emergency and open) =====
        foreach (collect($allLeases)->take(5) as $lease) {
            MaintenanceRequest::factory()->emergency()->create([
                'property_id' => $lease->property_id,
                'unit_id' => $lease->unit_id,
                'reporter_id' => $lease->renter_id,
                'title' => 'Emergency: Water pipe burst',
                'description' => 'Water pipe burst in the bathroom, flooding the floor. Immediate attention needed.',
                'priority' => MaintenancePriority::Emergency->value,
                'status' => MaintenanceStatus::Reported->value,
                'assignee_id' => null,
            ]);
        }

        // ===== SOME EXPIRING LEASES =====
        foreach (collect($allLeases)->take(3) as $lease) {
            $lease->update([
                'end_date' => now()->addDays(fake()->numberBetween(7, 25))->format('Y-m-d'),
            ]);
        }
    }
}

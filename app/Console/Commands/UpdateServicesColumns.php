<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Service;

class UpdateServicesColumns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-services-columns';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing services to set status, is_active, sort_order, and serial_number';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $services = Service::all();
        
        foreach ($services as $service) {
            $service->status = $service->status ?? 1;
            $service->is_active = $service->is_active ?? ($service->status == 1);
            $service->sort_order = $service->sort_order ?? $service->serial_number ?? 0;
            $service->serial_number = $service->serial_number ?? $service->sort_order ?? 0;
            $service->save();
            $this->info("Updated service: {$service->title}");
        }
        
        $this->info("All services updated successfully!");
    }
}

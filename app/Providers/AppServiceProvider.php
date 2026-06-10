<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share site settings with all blade views
        View::composer('*', function ($view) {
            try {
                $view->with('setting', Setting::first());
            } catch (\Exception $e) {
                $view->with('setting', null);
            }
        });
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    /**
     * Show admin login page.
     */
    public function showLogin()
    {
        // Only redirect to dashboard if user is authenticated AND is an admin
        if (Auth::check() && Auth::user() && Auth::user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // If logged in but not admin, log them out first
        if (Auth::check()) {
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();
        }

        return Inertia::render('Admin/Login/index');
    }

    /**
     * Handle admin login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $adminEmail = 'info@thenikhilsharma.in';
        $adminPassword = '12345678';

        if ($request->email === $adminEmail && $request->password === $adminPassword) {
            $admin = \App\Models\User::where('email', $adminEmail)->first();
            if ($admin) {
                Auth::login($admin, $request->boolean('remember'));
                $request->session()->regenerate();
                return redirect()->route('admin.dashboard');
            }
        }

        return back()->withErrors([
            'email' => 'Invalid email or password.',
        ]);
    }

    /**
     * Logout admin.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}

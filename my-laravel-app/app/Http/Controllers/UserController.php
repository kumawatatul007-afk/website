<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Show all users
     */
    public function index()
    {
        $users = User::latest()->get(['id', 'name', 'email', 'created_at']);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Store a new user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt('password123'), // default password
        ]);

        return redirect()->route('users.index');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMessageController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_check', $request->status === 'read' ? 1 : 0);
        }

        $messages = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Messages/index', [
            'messages' => $messages,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function show(ContactMessage $message)
    {
        // Mark as read when opened
        if (!$message->is_read) {
            $message->update(['is_check' => 1]);
        }

        return Inertia::render('Admin/Messages/show', [
            'message' => $message,
        ]);
    }

    public function markRead(ContactMessage $message)
    {
        $message->update(['is_check' => 1]);

        return back()->with('success', 'Message marked as read.');
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();

        return redirect()->route('admin.messages.index')
            ->with('success', 'Message deleted successfully.');
    }

    public function notifications()
    {
        $unreadCount = ContactMessage::where('is_check', 0)->count();
        $recent = ContactMessage::latest()->take(5)->get(['id', 'name', 'email', 'description as message', 'is_check as is_read', 'created_at']);

        return response()->json([
            'unread_count' => $unreadCount,
            'notifications' => $recent,
        ]);
    }
}

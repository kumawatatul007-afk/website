<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\ContactMessage;
use App\Models\PortfolioItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users'       => User::count(),
            'total_portfolio'   => PortfolioItem::count(),
            'total_blogs'       => BlogPost::count(),
            'unread_messages'   => ContactMessage::where('is_read', false)->count(),
            'total_messages'    => ContactMessage::count(),
            'featured_projects' => PortfolioItem::where('is_publish', 1)->count(),
        ];

        $recent_users = User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        $recent_messages = ContactMessage::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'subject', 'is_read', 'created_at']);

        $recent_blogs = BlogPost::latest()
            ->take(5)
            ->get(['id', 'title', 'created_at']);

        // Monthly blog posts for last 6 months
        $monthly_blogs = BlogPost::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Monthly messages for last 6 months
        $monthly_messages = ContactMessage::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Build last 6 months labels + data
        $months = [];
        $blog_data = [];
        $msg_data = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $m = (int)$date->format('n');
            $y = (int)$date->format('Y');
            $months[] = $date->format('M');

            $b = $monthly_blogs->first(fn($r) => (int)$r->month === $m && (int)$r->year === $y);
            $blog_data[] = $b ? (int)$b->count : 0;

            $msg = $monthly_messages->first(fn($r) => (int)$r->month === $m && (int)$r->year === $y);
            $msg_data[] = $msg ? (int)$msg->count : 0;
        }

        return Inertia::render('Admin/Dashboard/index', [
            'stats'            => $stats,
            'recent_users'     => $recent_users,
            'recent_messages'  => $recent_messages,
            'recent_blogs'     => $recent_blogs,
            'chart'            => [
                'labels'    => $months,
                'blogs'     => $blog_data,
                'messages'  => $msg_data,
            ],
        ]);
    }
}

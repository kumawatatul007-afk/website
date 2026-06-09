<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogComment;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBlogCommentController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogComment::with('blog:id,title');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('blog_id')) {
            $query->where('blog_id', $request->blog_id);
        }

        $perPage = in_array((int) $request->per_page, [10, 25, 50, 100]) ? (int) $request->per_page : 15;
        $comments = $query->latest()->paginate($perPage)->withQueryString();

        // For filter dropdown - get blogs that have comments
        $blogs = BlogPost::whereIn('id', BlogComment::distinct()->pluck('blog_id'))
            ->select('id', 'title')
            ->get();

        return Inertia::render('Admin/Comments/index', [
            'comments' => $comments,
            'blogs'    => $blogs,
            'filters'  => $request->only(['search', 'blog_id', 'per_page']),
        ]);
    }

    public function update(Request $request, BlogComment $comment)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'email'       => 'required|email|max:150',
            'mobile_no'   => 'nullable|string|max:20',
            'website'     => 'nullable|url|max:255',
            'description' => 'required|string|max:2000',
            'is_publish'  => 'nullable|boolean',
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment updated successfully.');
    }

    public function destroy(BlogComment $comment)
    {
        $comment->delete();

        return redirect()->route('admin.comments.index')
            ->with('success', 'Comment deleted successfully.');
    }
}

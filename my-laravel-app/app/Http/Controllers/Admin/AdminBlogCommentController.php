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
            'name'        => 'required|string|max:255',
            'email'       => 'nullable|email|max:255',
            'website'     => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_publish'  => 'nullable|integer',
        ]);

        $comment->update($validated);

        return redirect()->route('admin.comments.index')
            ->with('success', 'Comment updated successfully.');
    }

    public function destroy(BlogComment $comment)
    {
        $comment->delete();

        return redirect()->route('admin.comments.index')
            ->with('success', 'Comment deleted successfully.');
    }
}

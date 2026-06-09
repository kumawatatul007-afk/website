<?php

namespace App\Http\Controllers;

use App\Models\BlogComment;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogCommentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'blog_id'     => 'required|integer|exists:blogs,id',
            'name'        => 'required|string|max:100',
            'email'       => 'required|email|max:150',
            'mobile_no'   => 'nullable|string|max:20',
            'website'     => 'nullable|url|max:255',
            'description' => 'required|string|max:2000',
        ]);

        BlogComment::create($validated);

        return back()->with('comment_success', 'Your comment has been submitted successfully!');
    }
}

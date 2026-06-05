<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AdminAiController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'history' => 'array|max:20',
        ]);

        $apiKey = config('services.gemini.key');
        if (!$apiKey) {
            return response()->json([
                'error' => 'AI not configured. Please add GEMINI_API_KEY to your .env file.'
            ], 503);
        }

        $message = $request->input('message');
        $history = $request->input('history', []);

        $contents = [];

        foreach ($history as $h) {
            $role = ($h['role'] === 'user') ? 'user' : 'model';
            $contents[] = ['role' => $role, 'parts' => [['text' => $h['text']]]];
        }
        $contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->timeout(30)
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'contents' => $contents,
                'systemInstruction' => [
                    'parts' => [[
                        'text' => 'You are a smart and helpful AI assistant built into Nikhil Sharma\'s admin dashboard. Help with: blog post writing, SEO optimization, portfolio descriptions, service content, social media captions, and general productivity tasks. Keep responses concise, professional, and actionable. Use markdown formatting where helpful.'
                    ]]
                ],
                'generationConfig' => [
                    'temperature'     => 0.7,
                    'maxOutputTokens' => 1024,
                    'topK'            => 40,
                    'topP'            => 0.95,
                ],
            ]);

        if ($response->failed()) {
            $errorBody = $response->json();
            $errorMsg  = $errorBody['error']['message'] ?? 'AI service error. Please try again.';
            return response()->json(['error' => $errorMsg], 500);
        }

        $data  = $response->json();
        $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'No response received.';

        return response()->json(['reply' => $reply]);
    }
}

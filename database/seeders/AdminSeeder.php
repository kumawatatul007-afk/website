<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\Script;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create/update main admin user (Nikhil)
        User::updateOrCreate(
            ['email' => 'info@thenikhilsharma.in'],
            [
                'name'      => 'Nikhil Sharma',
                'password'  => bcrypt('12345678'),
                'role'      => 'admin',
                'is_active' => true,
                'phone'     => '9876543210',
            ]
        );

        // Fallback admin user
        User::updateOrCreate(
            ['email' => 'admin@mora.com'],
            [
                'name'      => 'Admin',
                'password'  => bcrypt('admin123'),
                'role'      => 'admin',
                'is_active' => true,
                'phone'     => '0000000000',
            ]
        );

        // Sample portfolio items
        $portfolioItems = [
            ['title' => 'Landing Page', 'category' => 'Web Development', 'type' => 'image', 'is_featured' => true, 'sort_order' => 1, 'image_url' => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg'],
            ['title' => 'Project Title', 'category' => 'UI/UX Design', 'type' => 'video', 'is_featured' => true, 'sort_order' => 2, 'image_url' => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-7.jpg', 'project_url' => 'https://www.youtube.com/watch?v=xgk5N4rCJIw'],
            ['title' => 'Ecommerce Site', 'category' => 'Web Development', 'type' => 'image', 'is_featured' => false, 'sort_order' => 3, 'image_url' => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-8.jpg'],
            ['title' => 'Landing Page v2', 'category' => 'App Development', 'type' => 'image', 'is_featured' => true, 'sort_order' => 4, 'image_url' => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-4.jpg'],
            ['title' => 'Logo Redesign', 'category' => 'UI/UX Design', 'type' => 'image', 'is_featured' => false, 'sort_order' => 5, 'image_url' => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-3.jpg'],
            ['title' => 'Custom App', 'category' => 'App Development', 'type' => 'image', 'is_featured' => false, 'sort_order' => 6, 'image_url' => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-2.jpg'],
        ];

        foreach ($portfolioItems as $item) {
            PortfolioItem::updateOrCreate(
                ['title' => $item['title']],
                $item
            );
        }

        // Sample blog posts
        $blogPosts = [
            [
                'title'        => 'Getting Started with React and Laravel',
                'slug'         => 'getting-started-react-laravel',
                'excerpt'      => 'Learn how to build modern web apps with React and Laravel using Inertia.js.',
                'content'      => '<p>This is a comprehensive guide to building full-stack applications with React and Laravel...</p>',
                'author'       => 'Admin',
                'category'     => 'Web Development',
                'status'       => 'published',
                'published_at' => now()->subDays(5),
                'image_url'    => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-1.jpg',
            ],
            [
                'title'        => 'UI/UX Design Principles for 2024',
                'slug'         => 'ui-ux-design-principles-2024',
                'excerpt'      => 'Explore the latest design trends and principles that will shape user experiences.',
                'content'      => '<p>Design is constantly evolving. Here are the key principles to follow in 2024...</p>',
                'author'       => 'Admin',
                'category'     => 'Design',
                'status'       => 'published',
                'published_at' => now()->subDays(10),
                'image_url'    => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-2.jpg',
            ],
            [
                'title'        => 'Building Mobile Apps with React Native',
                'slug'         => 'building-mobile-apps-react-native',
                'excerpt'      => 'A step-by-step guide to creating cross-platform mobile applications.',
                'content'      => '<p>React Native allows you to build mobile apps using JavaScript and React...</p>',
                'author'       => 'Admin',
                'category'     => 'App Development',
                'status'       => 'draft',
                'published_at' => null,
                'image_url'    => 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-3.jpg',
            ],
        ];

        foreach ($blogPosts as $post) {
            BlogPost::updateOrCreate(
                ['slug' => $post['slug']],
                $post
            );
        }
    }
}

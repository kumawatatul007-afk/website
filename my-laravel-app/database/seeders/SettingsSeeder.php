<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialLinks = [
            'facebook' => 'https://www.facebook.com/nikhilsharma7developer',
            'twitter' => 'https://x.com/NikhilSharma881',
            'linkedin' => 'https://www.linkedin.com/in/nikhil-sharma-jaipur',
            'github' => 'https://github.com/technikhilsharma7',
            'whatsapp' => 'https://wa.me/919529921038',
            'upwork' => 'https://www.upwork.com/freelancers/nikhilsharma',
            'fiverr' => 'https://www.fiverr.com/technikhil7/',
            'instagram' => 'https://www.instagram.com/nikhil_sharma__7',
            'pinterest' => 'https://in.pinterest.com/nikhilsharma881/'
        ];

        Setting::updateOrCreate(
            ['id' => 1],
            [
                'title' => 'Nikhil Sharma',
                'website_title' => 'Nikhil Sharma - Full Stack Developer',
                'email' => 'technikhilsharma7@gmail.com',
                'phonenumber' => '+91 9529921038',
                'phone' => '+91 9529921038',
                'logo' => 'logo.png',
                'social_links' => json_encode($socialLinks),
                'address' => 'Jaipur, Rajasthan, India',
            ]
        );

        $this->command->info('Settings seeded successfully!');
    }
}

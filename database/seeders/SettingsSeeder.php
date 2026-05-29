<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\BlogPost;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Site Settings ────────────────────────────────────────────────────
        Setting::updateOrCreate(
            ['id' => 1],
            [
                'title'           => 'Nikhil Sharma | Best Web & eCommerce Development Company in Jaipur',
                'website_title'   => 'Nikhil Sharma',
                'email'           => 'nikhilsharma@thenikhilsharma.in',
                'phonenumber'     => '7665544470',
                'address'         => 'Nikhil Sharma, Jaipur, Rajasthan, India',
                'social_links'    => json_encode([
                    'facebook'  => 'https://www.facebook.com/profile.php?id=61557453876608',
                    'youtube'   => 'https://www.youtube.com/@nikhilsharma_in',
                    'linkedin'  => 'https://www.linkedin.com/in/nikhilsharma',
                    'instagram' => 'https://www.instagram.com/nikhilsharma_in',
                    'pinterest' => '',
                    'twitter'   => 'https://x.com/nikhilsharma_in',
                ]),
                'strating_keyword' => 'Best Software Developer in Jaipur,Best Software Developer in Malviya Nagar,Best Software Developer in Vaishali Nagar,Best Software Developer in C-Scheme,Best Software Developer in Mansarovar,Best Software Developer in Ajmer Road,Best Software Developer in Jagatpura,Best Software Developer in Civil Lines,Best Software Developer in Kalwar Road,Best Software Developer in Jhotwara,Best Software Developer in Rajasthan,Best Software Developer in Ajmer,Best Software Developer in Jodhpur,Best Software Developer in Udaipur,Best Software Developer in Kota,Best Software Developer in Bikaner,Best Software Developer in Alwar,Best Software Developer in Sikar,Best Software Developer in Tonk,Best Software Developer in Pali,Best Software Developer in Nagaur,Best Software Developer in Bhilwara,Best Software Developer in Bangalore,Best Software Developer in Pune,Best Software Developer in Kolkata,Best IT Freelancer in Jaipur,Best IT Freelancer in Malviya Nagar,Best IT Freelancer in Vaishali Nagar,Best IT Freelancer in C-Scheme,Best IT Freelancer in Mansarovar,Best IT Freelancer in Ajmer Road,Best IT Freelancer in Rajasthan,Best IT Freelancer in Ajmer,Best IT Freelancer in Jodhpur,Best IT Freelancer in Udaipur,Best IT Freelancer in Kota,Best IT Freelancer in Bikaner,Best IT Freelancer in Bangalore,Best IT Freelancer in Pune,Best Website Developer in Jaipur,Best Website Developer in Malviya Nagar,Best Website Developer in Vaishali Nagar,Best Website Developer in C-Scheme,Best Website Developer in Mansarovar,Best Website Developer in Ajmer Road,Best Website Developer in Rajasthan,Best Website Developer in Ajmer,Best Website Developer in Jodhpur,Best Website Developer in Udaipur,Best Website Developer in Kota,Best Website Developer in Bikaner,Best Website Developer in Bangalore,Best Website Developer in Pune,Best Mobile Application Development in Jaipur,Best Mobile Application Development in Malviya Nagar,Best Mobile Application Development in Vaishali Nagar,Best Mobile Application Development in C-Scheme,Best Mobile Application Development in Mansarovar,Best Mobile Application Development in Ajmer Road,Best Mobile Application Development in Rajasthan,Best Mobile Application Development in Ajmer,Best Mobile Application Development in Jodhpur,Best Mobile Application Development in Udaipur,Best Mobile Application Development in Kota,Best Mobile Application Development in Bikaner,Best Mobile Application Development in Bangalore,Best Mobile Application Development in Pune',
                'service_keyword' => 'Best Website Design Near Me,Best WEBSITE DEVELOPER FOR HIRE,Top Website Design Near Me,Top WEBSITE DEVELOPER FOR HIRE,Top 10 Website Design Near Me,Top 10 WEBSITE DEVELOPER FOR HIRE,Top 5 Website Design Near Me,Top 5 WEBSITE DEVELOPER FOR HIRE,Top 20 Website Design Near Me,Top 20 WEBSITE DEVELOPER FOR HIRE,Find Website Design Near Me,Find WEBSITE DEVELOPER FOR HIRE,No1 Website Design Near Me,No1 WEBSITE DEVELOPER FOR HIRE,The Best Website Design Near Me,The Best WEBSITE DEVELOPER FOR HIRE,Hire Website Design Near Me,Hire WEBSITE DEVELOPER FOR HIRE',
                'location'        => 'Jaipur,Malviya Nagar,Vaishali Nagar,C-Scheme,Mansarovar,Ajmer Road,Jagatpura,Civil Lines,Kalwar Road,Jhotwara,Ajmer,Jodhpur,Udaipur,Kota,Bikaner,Alwar,Sikar,Tonk,Pali,Nagaur,Bhilwara,Bangalore,Pune,Kolkata,Delhi,Mumbai,Hyderabad,Chennai',
                'preloader'       => false,
            ]
        );

        // ─── Services (BlogPost type=1) ───────────────────────────────────────
        $services = [
            [
                'title'            => 'Website Development',
                'slug'             => 'website-development',
                'meta_description' => 'Professional website development services in Jaipur. Custom, responsive, SEO-friendly websites for businesses.',
                'content'          => '<p>We build fast, modern, and SEO-optimized websites tailored to your business needs. From landing pages to full e-commerce platforms.</p>',
                'tags'             => 'Website-Development,Web-Design,Responsive-Website,SEO-Friendly,Custom-Website,PHP-Development,Laravel,React',
                'type'             => 1,
                'status'           => 1,
            ],
            [
                'title'            => 'Mobile App Development',
                'slug'             => 'mobile-app-development',
                'meta_description' => 'Custom Android & iOS mobile app development in Jaipur. Flutter, React Native, and native app solutions.',
                'content'          => '<p>We develop high-performance mobile applications for Android and iOS using Flutter, React Native, and native technologies.</p>',
                'tags'             => 'Mobile-App-Development,Android-App,iOS-App,Flutter,React-Native,Cross-Platform,App-Development-Jaipur',
                'type'             => 1,
                'status'           => 1,
            ],
            [
                'title'            => 'E-Commerce Solutions',
                'slug'             => 'e-commerce-solutions',
                'meta_description' => 'Complete e-commerce website development with payment gateway, admin panel, and marketing support.',
                'content'          => '<p>Launch your online store with a complete e-commerce solution including product management, secure payments, and digital marketing support.</p>',
                'tags'             => 'E-Commerce,Online-Store,Payment-Gateway,WooCommerce,Shopify,Custom-E-Commerce,Online-Business',
                'type'             => 1,
                'status'           => 1,
            ],
            [
                'title'            => 'Custom Software Development',
                'slug'             => 'custom-software-development',
                'meta_description' => 'Custom software development for businesses. CRM, ERP, SaaS, and business automation solutions.',
                'content'          => '<p>We build custom software solutions including CRM systems, ERP platforms, SaaS applications, and business automation tools.</p>',
                'tags'             => 'Custom-Software,CRM,ERP,SaaS,Business-Automation,Software-Development,IT-Solutions',
                'type'             => 1,
                'status'           => 1,
            ],
            [
                'title'            => 'Digital Marketing',
                'slug'             => 'digital-marketing',
                'meta_description' => 'SEO, social media marketing, Google Ads, and complete digital marketing services in Jaipur.',
                'content'          => '<p>Grow your business online with our complete digital marketing services including SEO, Google Ads, social media marketing, and content strategy.</p>',
                'tags'             => 'Digital-Marketing,SEO,Google-Ads,Social-Media-Marketing,Content-Marketing,Online-Marketing,PPC',
                'type'             => 1,
                'status'           => 1,
            ],
            [
                'title'            => 'UI UX Design',
                'slug'             => 'ui-ux-design',
                'meta_description' => 'Professional UI/UX design services for websites and mobile apps. User-centered design that converts.',
                'content'          => '<p>We create beautiful, intuitive user interfaces and experiences that keep users engaged and drive conversions.</p>',
                'tags'             => 'UI-Design,UX-Design,User-Interface,User-Experience,Web-Design,App-Design,Figma,Adobe-XD',
                'type'             => 1,
                'status'           => 1,
            ],
        ];

        foreach ($services as $service) {
            BlogPost::updateOrCreate(
                ['slug' => $service['slug'], 'type' => 1],
                $service
            );
        }
    }
}

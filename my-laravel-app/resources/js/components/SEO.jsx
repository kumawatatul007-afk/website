import React from 'react';
import { Helmet } from 'react-helmet-async';
import { usePage } from '@inertiajs/react';

/**
 * Professional SEO Component using react-helmet-async
 * Provides full meta data, Open Graph, Twitter Cards, and JSON-LD structured data.
 */
const SEO = ({
    title: propTitle,
    description: propDescription,
    keywords: propKeywords,
    author: propAuthor,
    canonical: propCanonical,
    ogType = 'website',
    ogImage: propOgImage,
    twitterHandle = '@nikhilsharma_in',
    robots: propRobots,
    structuredData: propStructuredData = [],
    locale = 'en_IN',
    noindex = false
}) => {
    const { props } = usePage();
    const seoData = props.seo || {};

    const siteName      = 'Nikhil Sharma';
    const siteUrl       = typeof window !== 'undefined' ? window.location.origin : 'https://thenikhilsharma.in';
    const defaultAuthor = 'Nikhil Sharma';

    // Dynamic Title Formatting
    const title     = propTitle || seoData.title || siteName;
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

    const defaultDescription = 'Freelance Full Stack Developer & UI/UX Designer based in Jaipur, Rajasthan. Offering high-quality web and mobile app development at affordable prices.';
    const description = propDescription || seoData.description || defaultDescription;

    const keywords   = propKeywords || seoData.keywords || 'Nikhil Sharma, Software Developer Jaipur, PHP Developer, React Developer, Website Developer Jaipur, Full Stack Developer India';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : siteUrl;
    const canonical  = propCanonical || seoData.canonical || currentUrl;
    // Use a proper 1200x630 social card — NOT the logo PNG
    const ogImage    = propOgImage || seoData.og_image || `${siteUrl}/images/og-social-card.jpg`;
    const author     = propAuthor || seoData.author || defaultAuthor;
    const robots     = noindex ? 'noindex, nofollow' : (propRobots || seoData.robots || 'index, follow');

    // ── JSON-LD Schemas ──────────────────────────────────────────────────────

    // Person schema
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Nikhil Sharma",
        "url": "https://thenikhilsharma.in",
        "image": "https://www.thenikhilsharma.in/public/profile/images/n2.png",
        "jobTitle": "Full Stack Developer & UI/UX Designer",
        "description": "Jaipur-based Full Stack Developer with 8+ years of experience in web and mobile application development.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302001",
            "addressCountry": "IN"
        },
        "email": "nikhilsharma@thenikhilsharma.in",
        "telephone": "+91-98765-43210",
        "sameAs": [
            "https://www.linkedin.com/in/nikhil-sharma-jaipur",
            "https://twitter.com/nikhilsharma_in",
            "https://github.com/nikhilsharma",
            "https://dribbble.com/nikhilsharma",
            "https://www.upwork.com/freelancers/nikhilsharma",
            "https://clutch.co/profile/nikhil-sharma-developer"
        ]
    };

    // LocalBusiness schema — with GBP-ready fields, hasMap, aggregateRating, directory sameAs
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Nikhil Sharma - Web Developer",
        "url": "https://thenikhilsharma.in",
        "logo": "https://www.thenikhilsharma.in/public/admin/images/logo/GUJKF-100621-yYB.png",
        "image": "https://www.thenikhilsharma.in/public/profile/images/n2.png",
        "description": "Professional web development and UI/UX design services in Jaipur, Rajasthan. Specialising in React, Laravel, and mobile app development.",
        "telephone": "+91-98765-43210",
        "email": "nikhilsharma@thenikhilsharma.in",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jaipur",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302001",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "26.9124",
            "longitude": "75.7873"
        },
        "hasMap": "https://maps.google.com/?q=Jaipur,Rajasthan,India",
        "openingHours": "Mo-Fr 09:00-18:00",
        "priceRange": "$$",
        "currenciesAccepted": "INR, USD",
        "paymentAccepted": "Bank Transfer, UPI, PayPal",
        "areaServed": [
            { "@type": "City",    "name": "Jaipur" },
            { "@type": "State",   "name": "Rajasthan" },
            { "@type": "Country", "name": "India" }
        ],
        "serviceType": ["Web Development", "App Development", "UI/UX Design", "Full Stack Development"],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "47",
            "bestRating": "5",
            "worstRating": "1"
        },
        "sameAs": [
            "https://www.linkedin.com/in/nikhil-sharma-jaipur",
            "https://twitter.com/nikhilsharma_in",
            "https://github.com/nikhilsharma",
            "https://www.upwork.com/freelancers/nikhilsharma",
            "https://clutch.co/profile/nikhil-sharma-developer",
            "https://www.goodfirms.co/company/nikhil-sharma",
            "https://www.sulekha.com/nikhilsharma",
            "https://www.justdial.com/nikhilsharma"
        ]
    };

    // WebPage schema
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": fullTitle,
        "description": description,
        "url": currentUrl,
        "author": {
            "@type": "Person",
            "name": author
        },
        "publisher": {
            "@type": "Person",
            "name": "Nikhil Sharma",
            "url": "https://thenikhilsharma.in"
        }
    };

    // ProfessionalService schema — lists services for rich results
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Nikhil Sharma - Web & App Development",
        "url": "https://thenikhilsharma.in",
        "telephone": "+91-98765-43210",
        "email": "nikhilsharma@thenikhilsharma.in",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302001",
            "addressCountry": "IN"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Web Development Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Web Development",
                        "description": "Custom website design and development using React, Laravel, and modern web technologies."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Mobile App Development",
                        "description": "Cross-platform mobile application development for iOS and Android."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "UI/UX Design",
                        "description": "User interface and experience design using Figma and modern design principles."
                    }
                }
            ]
        }
    };

    // Merge: base schemas + any from Inertia props + any passed as prop
    const inertiaSchemas = seoData.structured_data
        ? (Array.isArray(seoData.structured_data) ? seoData.structured_data : [seoData.structured_data])
        : [];

    const allSchemas = [webPageSchema, personSchema, localBusinessSchema, serviceSchema, ...inertiaSchemas, ...propStructuredData];

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Performance — preconnect to external origins */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://www.thenikhilsharma.in" />
            <link rel="dns-prefetch" href="https://wpdemo.ajufbox.com" />

            {/* Geo / local SEO */}
            <meta name="geo.region" content="IN-RJ" />
            <meta name="geo.placename" content="Jaipur" />
            <meta name="geo.position" content="26.9124;75.7873" />
            <meta name="ICBM" content="26.9124, 75.7873" />

            {/* Favicon */}
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />

            {/* Open Graph / Facebook — explicit 1200x630 */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={locale} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD Structured Data */}
            {allSchemas.map((schema, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;

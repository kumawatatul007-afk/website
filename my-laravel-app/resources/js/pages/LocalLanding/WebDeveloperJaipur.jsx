import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../../components/SEO';

const FAQS = [
  {
    q: 'How much does a website cost in Jaipur?',
    a: 'A basic business website in Jaipur typically costs between ₹15,000 and ₹50,000 depending on the number of pages, features, and design complexity. Custom web applications with a database backend start from ₹60,000. I provide transparent, itemised quotes with no hidden charges.'
  },
  {
    q: 'How long does it take to build a website?',
    a: 'A standard 5–8 page business website takes 2–3 weeks. A full e-commerce site or custom web application typically takes 4–8 weeks. I provide a detailed timeline before starting any project.'
  },
  {
    q: 'Do you work with clients outside Jaipur?',
    a: 'Yes. While I am based in Jaipur, I work with clients across India and internationally — including the Middle East, UK, and USA. All communication is handled via video call, email, and project management tools.'
  },
  {
    q: 'What technologies do you use?',
    a: 'I primarily use React, Laravel (PHP), Flutter, and MySQL. For UI/UX design I use Figma. I choose the right technology stack based on your project requirements, budget, and long-term maintenance needs.'
  },
  {
    q: 'Do you provide SEO with the website?',
    a: 'Yes. Every website I build includes on-page SEO fundamentals: proper H1/H2 structure, meta tags, canonical URLs, sitemap.xml, robots.txt, and JSON-LD structured data. I also offer ongoing SEO services separately.'
  },
];

export default function WebDeveloperJaipurPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60 });
  }, []);

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <main className="ll-page">
      <SEO
        title="Web Developer in Jaipur | Nikhil Sharma — PHP, React & Flutter"
        description="Looking for a web developer in Jaipur? Nikhil Sharma builds fast, SEO-optimised websites and apps for businesses in Jaipur, Rajasthan. Free quote available."
        keywords="Web Developer Jaipur, Website Designer Jaipur, PHP Developer Jaipur, React Developer Jaipur, Freelance Web Developer Jaipur, Best Web Developer Jaipur, Software Developer Jaipur Rajasthan"
        canonical="https://thenikhilsharma.in/web-developer-jaipur"
        structuredData={[localSchema]}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');

        .ll-page {
          background: #f8fafb;
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
          color: #1e293b;
        }

        .ll-container {
          max-width: 900px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem);
        }

        /* Hero */
        .ll-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          padding: clamp(4rem, 8vw, 7rem) 2rem clamp(3rem, 6vw, 5rem);
          text-align: center;
        }
        .ll-hero-label {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #93c5fd;
          margin-bottom: 1rem;
        }
        .ll-hero h1 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #f8fafc;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 1.25rem;
        }
        .ll-hero p {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: #94a3b8;
          max-width: 640px;
          margin: 0 auto 2rem;
          line-height: 1.75;
        }
        .ll-hero-btns {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .ll-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 2.2rem;
          background: #fff;
          color: #0f172a;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .ll-btn-primary:hover { background: #e2e8f0; transform: translateY(-2px); }
        .ll-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 2.2rem;
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.35);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, transform 0.2s;
        }
        .ll-btn-secondary:hover { border-color: #fff; transform: translateY(-2px); }

        /* Breadcrumb */
        .ll-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: #9ca3af;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .ll-breadcrumb a { color: #1e3a8a; text-decoration: none; }
        .ll-breadcrumb a:hover { text-decoration: underline; }
        .ll-breadcrumb span { color: #d1d5db; }

        /* Prose sections */
        .ll-section { margin-bottom: 3.5rem; }
        .ll-section h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
        }
        .ll-section h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e3a8a;
          margin: 1.75rem 0 0.5rem;
        }
        .ll-section p {
          font-size: 0.97rem;
          color: #4b5563;
          line-height: 1.85;
          margin-bottom: 1rem;
        }
        .ll-section ul {
          padding-left: 1.25rem;
          margin-bottom: 1rem;
        }
        .ll-section li {
          font-size: 0.95rem;
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 0.4rem;
        }

        /* Stats row */
        .ll-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin: 2rem 0 3rem;
        }
        .ll-stat-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 1.5rem 1.25rem;
          text-align: center;
        }
        .ll-stat-num {
          font-size: 2rem;
          font-weight: 900;
          color: #1e3a8a;
          line-height: 1;
          margin-bottom: 0.35rem;
        }
        .ll-stat-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Services grid */
        .ll-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .ll-service-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 1.5rem;
        }
        .ll-service-card h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem;
        }
        .ll-service-card p {
          font-size: 0.88rem;
          color: #6b7280;
          line-height: 1.65;
          margin: 0;
        }

        /* Map */
        .ll-map-wrap {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          margin-top: 1.5rem;
          height: 320px;
        }
        .ll-map-wrap iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* FAQ */
        .ll-faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .ll-faq-item {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
        }
        .ll-faq-q {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .ll-faq-a {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.75;
          margin: 0;
        }

        /* Directories */
        .ll-directories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }
        .ll-dir-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1.1rem;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .ll-dir-link:hover { border-color: #1e3a8a; color: #1e3a8a; transform: translateY(-1px); }

        /* CTA bottom */
        .ll-cta-bottom {
          background: #0f172a;
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          margin-top: 3rem;
        }
        .ll-cta-bottom h2 {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          color: #f8fafc;
          margin-bottom: 0.75rem;
        }
        .ll-cta-bottom p { color: #94a3b8; margin-bottom: 1.75rem; }
      `}</style>

      {/* Hero */}
      <section className="ll-hero">
        <span className="ll-hero-label">Jaipur, Rajasthan</span>
        <h1>Web Developer in Jaipur<br />PHP, React & Flutter</h1>
        <p>
          Nikhil Sharma is a Jaipur-based freelance web developer with 8+ years of experience
          building fast, SEO-optimised websites and apps for businesses across India and the Middle East.
        </p>
        <div className="ll-hero-btns">
          <Link href="/contact" className="ll-btn-primary">Get a Free Quote →</Link>
          <Link href="/portfolio" className="ll-btn-secondary">View My Work</Link>
        </div>
      </section>

      <div className="ll-container">

        {/* Breadcrumb */}
        <nav className="ll-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Web Developer in Jaipur</span>
        </nav>

        {/* Stats */}
        <div className="ll-stats" data-aos="fade-up">
          {[
            { num: '8+',   label: 'Years Experience' },
            { num: '200+', label: 'Projects Delivered' },
            { num: '50+',  label: 'Happy Clients' },
            { num: '4.9★', label: 'Average Rating' },
          ].map(s => (
            <div key={s.label} className="ll-stat-card">
              <div className="ll-stat-num">{s.num}</div>
              <div className="ll-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* About section */}
        <section className="ll-section" data-aos="fade-up">
          <h2>Freelance Web Developer Based in Jaipur</h2>
          <p>
            If you are searching for a reliable <strong>web developer in Jaipur</strong>, you have come to the right place.
            I am Nikhil Sharma, a full stack developer and UI/UX designer with over 8 years of professional experience
            building digital products for startups, small businesses, and enterprise clients.
          </p>
          <p>
            I specialise in <strong>PHP (Laravel)</strong>, <strong>React.js</strong>, and <strong>Flutter</strong> — a combination
            that lets me build everything from a simple business website to a complex multi-platform application from a single team.
            Every project I deliver is mobile-first, SEO-optimised, and built to perform well on Google's Core Web Vitals.
          </p>
          <p>
            Based in Jaipur, Rajasthan, I work with clients locally and remotely across India, the Middle East, the UK, and the USA.
            Whether you need a new website from scratch, a redesign of an existing site, or a custom web application with a database
            backend, I deliver on time and within budget — with transparent communication throughout.
          </p>
        </section>

        {/* Services */}
        <section className="ll-section" data-aos="fade-up">
          <h2>Web Development Services in Jaipur</h2>
          <p>
            I offer a full range of digital services to businesses in Jaipur and across Rajasthan.
            Each service is delivered with clean code, proper documentation, and post-launch support.
          </p>
          <div className="ll-services-grid">
            {[
              {
                title: 'Website Design & Development',
                desc: 'Custom, responsive websites built with React and Laravel. SEO-ready from day one with proper heading structure, meta tags, and sitemap.'
              },
              {
                title: 'Mobile App Development',
                desc: 'Cross-platform iOS and Android apps using Flutter. One codebase, native performance, deployed to App Store and Google Play.'
              },
              {
                title: 'UI/UX Design',
                desc: 'User-centred interface design in Figma. Wireframes, prototypes, and design systems that make development faster and products more consistent.'
              },
              {
                title: 'E-Commerce Development',
                desc: 'Custom online stores with secure payment gateways, inventory management, and admin panels. Built for speed and conversion.'
              },
              {
                title: 'SEO & Performance Optimisation',
                desc: 'Technical SEO audits, Core Web Vitals improvements, structured data (JSON-LD), and on-page optimisation to improve Google rankings.'
              },
              {
                title: 'Website Maintenance & Support',
                desc: 'Ongoing maintenance, security updates, content changes, and performance monitoring. Monthly retainer plans available.'
              },
            ].map(s => (
              <div key={s.title} className="ll-service-card">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Jaipur section */}
        <section className="ll-section" data-aos="fade-up">
          <h2>Why Hire a Web Developer in Jaipur?</h2>
          <p>
            Jaipur has emerged as one of India's fastest-growing tech hubs, with a thriving startup ecosystem and a growing
            demand for digital services. Hiring a local web developer in Jaipur gives you several advantages:
          </p>
          <ul>
            <li><strong>Cost-effective rates</strong> compared to developers in Delhi, Mumbai, or Bangalore — without compromising on quality.</li>
            <li><strong>Same time zone</strong> for real-time communication and faster turnaround on revisions.</li>
            <li><strong>Local market understanding</strong> — I know what works for Jaipur businesses, from tourism and handicrafts to IT and manufacturing.</li>
            <li><strong>Face-to-face meetings</strong> available for clients in Jaipur, Ajmer, Kota, and nearby cities.</li>
            <li><strong>Hindi and English</strong> communication — no language barriers.</li>
          </ul>
          <p>
            I have worked with businesses in Jaipur's Pink City area, Malviya Nagar, Vaishali Nagar, Mansarovar, and Jagatpura,
            as well as clients across Rajasthan in Jodhpur, Udaipur, Kota, and Ajmer.
          </p>
        </section>

        {/* Map */}
        <section className="ll-section" data-aos="fade-up">
          <h2>Find Me in Jaipur, Rajasthan</h2>
          <p>
            I am based in Jaipur, Rajasthan (302001), India. Available for in-person meetings in Jaipur
            and remote collaboration with clients anywhere in the world.
          </p>
          <div className="ll-map-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65047083281249!3d26.88514167956319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin"
              title="Nikhil Sharma - Web Developer location in Jaipur, Rajasthan"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="ll-section" data-aos="fade-up">
          <h2>Frequently Asked Questions</h2>
          <div className="ll-faq-list">
            {FAQS.map(f => (
              <div key={f.q} className="ll-faq-item">
                <p className="ll-faq-q">{f.q}</p>
                <p className="ll-faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Directory listings */}
        <section className="ll-section" data-aos="fade-up">
          <h2>Find Me on Freelancer Directories</h2>
          <p>
            You can also find and review my work on these trusted platforms and directories:
          </p>
          <div className="ll-directories">
            {[
              { label: 'Upwork',     href: 'https://www.upwork.com/freelancers/nikhilsharma' },
              { label: 'Clutch',     href: 'https://clutch.co/profile/nikhil-sharma-developer' },
              { label: 'GoodFirms', href: 'https://www.goodfirms.co/company/nikhil-sharma' },
              { label: 'Sulekha',   href: 'https://www.sulekha.com/nikhilsharma' },
              { label: 'Justdial',  href: 'https://www.justdial.com/nikhilsharma' },
              { label: 'Toptal',    href: 'https://www.toptal.com/resume/nikhil-sharma' },
              { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/nikhil-sharma-jaipur' },
              { label: 'GitHub',    href: 'https://github.com/nikhilsharma' },
            ].map(d => (
              <a
                key={d.label}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ll-dir-link"
              >
                {d.label} ↗
              </a>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="ll-cta-bottom" data-aos="fade-up">
          <h2>Ready to Build Your Website?</h2>
          <p>Get a free, no-obligation quote within 24 hours.</p>
          <div className="ll-hero-btns">
            <Link href="/contact" className="ll-btn-primary">Contact Me →</Link>
            <Link href="/services" className="ll-btn-secondary">View Services</Link>
          </div>
        </div>

      </div>
    </main>
  );
}

import { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';
import SEO from '../../components/SEO';
import OptimizedImage from '../../components/OptimizedImage';
import { ShimmerBlogCard, ShimmerPortfolioCard } from '../../components/ShimmerLoader';

export default function DashboardPage({ blogPosts: dbBlogPosts, portfolios: dbPortfolios, services: dbServices = [], setting }) {
  const [totalPosts] = useState(0);

  function stripHtml(html) {
    if (!html) return '';
    const plain = html.replace(/<[^>]*>/g, '').trim();
    return plain.length > 130 ? plain.slice(0, 130) + '...' : plain;
  }

  function getBlogImage(image) {
    if (!image) return 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg';
    if (image.startsWith('http')) return image;
    return `/images/blogs/${image}`;
  }

  const [blogPosts] = useState(
    (dbBlogPosts && dbBlogPosts.length > 0) ? dbBlogPosts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      // DB field is 'content' (not 'description'), and image is 'main_image' (not 'image')
      excerpt: p.meta_description
        ? (p.meta_description.length > 130 ? p.meta_description.slice(0, 130) + '...' : p.meta_description)
        : stripHtml(p.content),
      image_url: getBlogImage(p.main_image),
      author: p.created_by || 'Nikhil Sharma',
      date: p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent',
    })) : []);

  // Portfolio items from database (Inertia props se)
  const mapPortfolio = (p) => ({
    id: p.id,
    title: p.title,
    category: p.short_description || '',
    image: p.image
      ? (p.image.startsWith('http') ? p.image : `/images/portfolio/${p.image}`)
      : (p.image_url || 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg'),
    url: p.website_link || null,
  });

  const [portfolios, setPortfolios] = useState(
    (dbPortfolios && dbPortfolios.length > 0) ? dbPortfolios.map(mapPortfolio) : []
  );

  // Agar Inertia se data nahi aaya toh API fallback
  useEffect(() => {
    if (!dbPortfolios || dbPortfolios.length === 0) {
      fetch('/api/portfolio')
        .then(res => res.json())
        .then(data => setPortfolios(data.slice(0, 6).map(mapPortfolio)))
        .catch(() => { });
    }
  }, []);

  // Testimonials from database
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Rajesh Agarwal', position: 'Founder & CEO', company: 'TechRetail India', text: "Nikhil redesigned our e-commerce platform from scratch using React and Laravel. Page load time dropped from 8s to under 2s, and our conversion rate improved by 34% in the first month. Highly professional, delivered on time.", image: 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-1.jpg', rating: 5 },
    { id: 2, name: 'Priya Mehta', position: 'Marketing Director', company: 'Jaipur Handicrafts Co.', text: "We needed a website that could rank for local search terms in Jaipur. Nikhil built us a fully SEO-optimised site with proper schema markup. We now appear on page 1 for 'handicrafts Jaipur' — something we struggled with for years.", image: 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-2.jpg', rating: 5 },
    { id: 3, name: 'Ahmed Al-Rashid', position: 'Operations Manager', company: 'Gulf Logistics LLC', text: "Nikhil built our courier management app in Flutter. It runs perfectly on both iOS and Android, integrates with our existing backend, and our drivers love the interface. He was responsive across time zones throughout the project.", image: 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-3.jpg', rating: 5 },
  ]);
  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
      .catch(() => { });
  }, []);

  // Video modal state
  const [videoOpen, setVideoOpen] = useState(false);

  // Preloader state
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Typing animation state
  const typingTexts = ['Web Developer', 'UI/UX Designer', 'App Developer'];
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    const currentText = typingTexts[textIndex];
    let timeout;

    if (!isDeleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setTypedText(currentText.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 100);
    } else if (!isDeleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setTypedText(currentText.slice(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 55);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex(prev => (prev + 1) % typingTexts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  // AOS initialization — preloader hatne ke baad
  useEffect(() => {
    if (!isLoading) {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
      });
    }
  }, [isLoading]);

  // Preloader and Lenis smooth scroll initialization
  useEffect(() => {
    // Exit animation pehle, phir unmount
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1800);
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      import('lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      });
    }
  }, [isLoading]);

  // SVG icons for service cards (mapped by index)
  const SERVICE_ICONS_SVG = [
    // Web Development
    <svg key="web" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <polyline points="8 9 10 11 8 13" />
      <line x1="12" y1="13" x2="15" y2="13" />
    </svg>,
    // App Development
    <svg key="app" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
    </svg>,
    // UI/UX Design
    <svg key="design" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>,
    // SEO / Digital Marketing
    <svg key="seo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>,
    // Cloud / Other
    <svg key="cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>,
  ];

  // Services from DB (passed via Inertia), fallback to static if empty
  const services = (dbServices && dbServices.length > 0) ? dbServices : [
    { id: 1, title: 'Web Development', slug: 'web-development', description: 'I build fast, secure, and scalable websites tailored to your business goals using React, Laravel, and PHP.' },
    { id: 2, title: 'App Development', slug: 'app-development', description: 'Cross-platform mobile apps using Flutter and React Native for iOS and Android.' },
    { id: 3, title: 'UI/UX Design', slug: 'ui-ux-design', description: 'Visually compelling, brand-consistent designs in Figma grounded in user research.' },
  ];

  // Keywords from Setting.strating_keyword (comma-separated) — no dummy fallback
  const keywordHighlights = (() => {
    if (setting && setting.strating_keyword) {
      return setting.strating_keyword.split(',').map(k => k.trim()).filter(Boolean);
    }
    return [];
  })();

  // Service highlights from DB setting.service_keyword — format: "title|slug,title|slug"
  // Each entry is clickable and links to /services/{slug}
  const serviceHighlights = (() => {
    if (setting && setting.service_keyword) {
      return setting.service_keyword.split(',').map(entry => {
        const parts = entry.trim().split('|');
        return { title: parts[0] ? parts[0].trim() : '', slug: parts[1] ? parts[1].trim() : '', isFallback: false };
      }).filter(s => s.title);
    }
    // Fallback: use DB service titles with their slugs
    if (dbServices && dbServices.length > 0) {
      return dbServices.map(s => ({ title: s.title, slug: s.slug, isFallback: true }));
    }
    return [];
  })();

  const experiences = [
    { id: 1, company: 'Apple', title: 'UX / UI Designer', duration: 'Jan 2023 – May 2024', description: 'Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus', logo: 'M19.665 16.811a10.316 10.316 0 0 1-1.021 1.837c-.537.767-.978 1.297-1.316 1.592-.525.482-1.089.73-1.692.744-.432 0-.954-.123-1.562-.373-.61-.249-1.17-.371-1.683-.371-.537 0-1.113.122-1.73.371-.616.25-1.114.381-1.495.393-.577.025-1.154-.229-1.729-.764-.367-.32-.826-.87-1.377-1.648-.59-.829-1.075-1.794-1.455-2.891-.407-1.187-.611-2.335-.611-3.447 0-1.273.275-2.372.826-3.292a4.857 4.857 0 0 1 1.73-1.751 4.65 4.65 0 0 1 2.34-.662c.46 0 1.063.142 1.81.422s1.227.422 1.436.422c.158 0 .689-.167 1.593-.498.853-.307 1.573-.434 2.163-.384 1.6.129 2.801.759 3.6 1.895-1.43.867-2.137 2.08-2.123 3.637.012 1.213.453 2.222 1.317 3.023a4.33 4.33 0 0 0 1.315.863c-.106.307-.218.6-.336.882zM15.998 2.38c0 .95-.348 1.838-1.039 2.659-.836.976-1.846 1.541-2.941 1.452a2.955 2.955 0 0 1-.021-.36c0-.913.396-1.889 1.103-2.688.352-.404.8-.741 1.343-1.009.542-.264 1.054-.41 1.536-.435.013.128.019.255.019.381z' },
    { id: 2, company: 'Facebook', title: 'UX / UI Designer', duration: 'June 2020 – Jan 2023', description: 'Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus', logo: 'M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z' },
    { id: 3, company: 'Airbnb', title: 'Web Developer', duration: 'March 2019 – May 2020', description: 'Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus', logo: 'M12.001 16.709c-1.013-1.271-1.609-2.386-1.808-3.34-.197-.769-.12-1.385.218-1.848.357-.532.89-.791 1.589-.791s1.231.259 1.589.796c.335.458.419 1.075.215 1.848-.218.974-.813 2.087-1.808 3.341l.005-.006zm7.196.855c-.14.934-.775 1.708-1.65 2.085-1.687.734-3.359-.437-4.789-2.026 2.365-2.961 2.803-5.268 1.787-6.758-.596-.855-1.449-1.271-2.544-1.271-2.206 0-3.419 1.867-2.942 4.034.276 1.173 1.013 2.506 2.186 3.996-.735.813-1.432 1.391-2.047 1.748-.478.258-.934.418-1.37.456-2.008.299-3.582-1.647-2.867-3.656.1-.259.297-.734.634-1.471l.019-.039c1.097-2.382 2.43-5.088 3.961-8.09l.039-.1.435-.836c.338-.616.477-.892 1.014-1.231.258-.157.576-.235.934-.235.715 0 1.271.418 1.511.753.118.18.259.419.436.716l.419.815.06.119c1.53 3.001 2.863 5.702 3.955 8.089l.02.019.401.915.237.573c.183.459.221.915.16 1.393z' }
  ];

  // Testimonials slider state
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = testimonials.length;

  const prevSlide = () => setActiveSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  const nextSlide = () => setActiveSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));

  // Auto-scroll: har 3 seconds mein next slide
  const autoScrollRef = useRef(null);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      setActiveSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [totalSlides]);


  const skills = [
    { name: 'HTML', percent: 85 },
    { name: 'CSS', percent: 90 },
    { name: 'JAVASCRIPT', percent: 85 },
    { name: 'FIGMA', percent: 80 }
  ];

  // Skills animation - animate bars when section comes into view
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);

  useEffect(() => {
    if (isLoading) return; // wait for preloader to finish

    const checkAndObserve = () => {
      if (!skillsRef.current) return;

      // If already in viewport, trigger immediately
      const rect = skillsRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setSkillsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setSkillsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
      );
      observer.observe(skillsRef.current);
      return () => observer.disconnect();
    };

    // Small delay to let Lenis initialise
    const t = setTimeout(checkAndObserve, 100);
    return () => clearTimeout(t);
  }, [isLoading]);

  // Services section animation
  const [svcVisible, setSvcVisible] = useState(false);
  const svcRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSvcVisible(true); },
      { threshold: 0.15 }
    );
    if (svcRef.current) observer.observe(svcRef.current);
    return () => observer.disconnect();
  }, []);

  // Contact items slide-in animation
  const [contactVisible, setContactVisible] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setContactVisible(true); },
      { threshold: 0.2 }
    );
    if (contactRef.current) observer.observe(contactRef.current);
    return () => observer.disconnect();
  }, []);

  // Blog section animation
  const [blogVisible, setBlogVisible] = useState(false);
  const blogRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBlogVisible(true); },
      { threshold: 0.15 }
    );
    if (blogRef.current) observer.observe(blogRef.current);
    return () => observer.disconnect();
  }, []);

  // Back to top button and scroll progress
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / height) * 100;
      setScrollProgress(progress);
      setShowBackToTop(scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    // Keywords for preloader ticker — use DB data if available, else static fallback
    const preloaderKeywords = keywordHighlights.length > 0
      ? keywordHighlights
      : [
        'Best Software Developer in Jaipur',
        'Best IT Freelancer in Jaipur',
        'Best Website Developer in Jaipur',
        'Best PHP Developer in Jaipur',
        'Best Mobile Application Development in Jaipur',
        'Best Front-End Developer in Jaipur',
        'Best SQL Database Developer in Jaipur',
        'Best Freelancers Hire in Jaipur',
        'Best Software Developer in Rajasthan',
        'Best Website Developer in Rajasthan',
        'Best IT Freelancer in Rajasthan',
        'Best PHP Developer in Rajasthan',
      ];
    // Duplicate for seamless infinite scroll
    const tickerItems = [...preloaderKeywords, ...preloaderKeywords];

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

          .mora-preloader {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            overflow: hidden;
            pointer-events: all;
          }
          .mora-preloader__panel {
            flex: 1;
            background: #0f172a;
            transition: transform 0.75s cubic-bezier(0.76, 0, 0.24, 1);
          }
          .mora-preloader__panel:first-child { transform-origin: left center; }
          .mora-preloader__panel:last-child  { transform-origin: right center; }
          .mora-preloader.exiting .mora-preloader__panel:first-child { transform: translateX(-100%); }
          .mora-preloader.exiting .mora-preloader__panel:last-child  { transform: translateX(100%); }
          .mora-preloader__center {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            transition: opacity 0.4s ease;
          }
          .mora-preloader.exiting .mora-preloader__center { opacity: 0; }
          .mora-preloader__brand {
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            font-size: clamp(2rem, 8vw, 5rem);
            letter-spacing: 0.1em;
            text-transform: none;
            color: #f8fafc;
            display: flex;
            gap: 0.1em;
            font-style: italic;
          }
          .mora-preloader__brand span {
            display: inline-block;
            opacity: 0;
            transform: translateY(60px);
            animation: pl-letter-in 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards;
          }
          .mora-preloader__brand span:nth-child(1) { animation-delay: 0.1s; }
          .mora-preloader__brand span:nth-child(2) { animation-delay: 0.15s; }
          .mora-preloader__brand span:nth-child(3) { animation-delay: 0.2s; }
          .mora-preloader__brand span:nth-child(4) { animation-delay: 0.25s; }
          .mora-preloader__brand span:nth-child(5) { animation-delay: 0.3s; }
          .mora-preloader__brand span:nth-child(6) { animation-delay: 0.35s; }
          .mora-preloader__brand span:nth-child(7) { animation-delay: 0.4s; }
          .mora-preloader__brand span:nth-child(8) { animation-delay: 0.45s; }
          .mora-preloader__brand span:nth-child(9) { animation-delay: 0.5s; }
          .mora-preloader__brand span:nth-child(10) { animation-delay: 0.55s; }
          .mora-preloader__brand span:nth-child(11) { animation-delay: 0.6s; }
          .mora-preloader__brand span:nth-child(12) { animation-delay: 0.65s; }
          .mora-preloader__brand span:nth-child(13) { animation-delay: 0.7s; }
          @keyframes pl-letter-in {
            to { opacity: 1; transform: translateY(0); }
          }
          .mora-preloader__bar-wrap {
            width: clamp(120px, 20vw, 220px);
            height: 2px;
            background: rgba(255,255,255,0.12);
            border-radius: 2px;
            overflow: hidden;
          }
          .mora-preloader__bar {
            height: 100%;
            background: linear-gradient(90deg, #1e3a8a, #60a5fa);
            border-radius: 2px;
            animation: pl-bar 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes pl-bar {
            0%   { width: 0%; }
            60%  { width: 75%; }
            100% { width: 100%; }
          }
          .mora-preloader__tagline {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.72rem;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: rgba(248,250,252,0.45);
            opacity: 0;
            animation: pl-fade 0.5s ease 0.7s forwards;
          }
          .mora-preloader__dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #3b82f6;
            opacity: 0;
            animation: pl-fade 0.4s ease 0.5s forwards;
          }
          @keyframes pl-fade { to { opacity: 1; } }

          /* Keywords ticker */
          .mora-preloader__ticker-wrap {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: hidden;
            padding: 0.6rem 0;
            background: rgba(255,255,255,0.04);
            border-top: 1px solid rgba(255,255,255,0.07);
            opacity: 0;
            animation: pl-fade 0.5s ease 0.9s forwards;
          }
          .mora-preloader__ticker {
            display: flex;
            gap: 0;
            white-space: nowrap;
            animation: pl-ticker 60s linear infinite;
            will-change: transform;
          }
          .mora-preloader.exiting .mora-preloader__ticker {
            animation-play-state: paused;
          }
          @keyframes pl-ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .mora-preloader__ticker-item {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0 1.5rem;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.7rem;
            letter-spacing: 0.06em;
            color: rgba(248,250,252,0.5);
            text-transform: uppercase;
            flex-shrink: 0;
          }
          .mora-preloader__ticker-item::after {
            content: '✦';
            color: #3b82f6;
            font-size: 0.5rem;
            opacity: 0.7;
          }
        `}</style>

        <div className={`mora-preloader${isExiting ? ' exiting' : ''}`}>
          <div className="mora-preloader__panel" />
          <div className="mora-preloader__panel" />
          <div className="mora-preloader__center">
            <div className="mora-preloader__dot" />
            <div className="mora-preloader__brand">
              <span>N</span><span>i</span><span>k</span><span>h</span><span>i</span><span>l</span><span>&nbsp;</span><span>S</span><span>h</span><span>a</span><span>r</span><span>m</span><span>a</span>
            </div>
            <div className="mora-preloader__bar-wrap">
              <div className="mora-preloader__bar" />
            </div>
            <p className="mora-preloader__tagline">Portfolio &amp; Creative Studio</p>
          </div>
          {/* Keywords scrolling ticker at bottom */}
          <div className="mora-preloader__ticker-wrap" aria-hidden="true">
            <div className="mora-preloader__ticker">
              {tickerItems.map((kw, i) => (
                <span key={i} className="mora-preloader__ticker-item">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <main className="dashboard-container">
      <SEO
        title="Nikhil Sharma — Freelance PHP & React Developer Jaipur | Affordable Rates"
        description="Hire Nikhil Sharma, a Jaipur-based Full Stack Developer with 8+ years building websites, apps & digital solutions. Fast delivery, affordable rates, real results."
        keywords="Web Developer Jaipur, PHP Developer Jaipur, React Developer India, Full Stack Developer Jaipur, Hire Web Developer, Nikhil Sharma Developer"
        ogType="website"
        structuredData={[{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What services does Nikhil Sharma offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nikhil Sharma offers web development, mobile app development, UI/UX design, and full stack development services in Jaipur, India."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Nikhil Sharma based?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nikhil Sharma is based in Jaipur, Rajasthan, India and works with clients across India and the Middle East."
              }
            },
            {
              "@type": "Question",
              "name": "How much does Nikhil Sharma charge for web development?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nikhil Sharma offers affordable web development services tailored to small businesses and startups. Contact for a free quote."
              }
            }
          ]
        }]}
      />

      {/* Back to top button with scroll progress */}
      {showBackToTop && (
        <button className="back-to-top-btn" onClick={scrollToTop}>
          <svg viewBox="0 0 100 100" className="progress-ring">
            <circle cx="50" cy="50" r="45" className="progress-ring-bg" />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-ring-fill"
              style={{ strokeDashoffset: `calc(283 - (283 * ${scrollProgress}) / 100)` }}
            />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
                <p className="hero-hello-text">HELLO I'M</p>
                <h1 className="hero-stroke-name">Nikhil<br />Sharma</h1>
              </div>
              <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                <h2 className="hero-typing-line">
                  Freelance PHP, React &amp; Flutter Developer — Jaipur, India
                </h2>
                <p className="hero-typing-sub" aria-hidden="true">
                  I am a{' '}
                  <span className="hero-typed-word">
                    {typedText}
                    <span className="hero-cursor" style={{ opacity: showCursor ? 1 : 0 }}>|</span>
                  </span>
                </p>
              </div>
              <p className="hero-description" data-aos="zoom-out" data-aos-delay="300" data-aos-duration="1000">
                Hi, my name is Nikhil Sharma . I'm freelancer in India and throughout the Middle East. Over the past few years I have helped many small business owners in achieveing a presence online by developing quality websites and implementing successful online marketing strategies. I am an expert on helping start-up business and entrepreneurs who want an online presence with a simple, clean & effective websites but dont want to pay the high fees to larger web design corporations are charging. I believe in providing authentic and quality web development services at an affordable margin so that even small businesses can digitalize their services. I'm also a Full Stack Developer with over 8 Years of Exprience in IT              </p>
              <div className="hero-buttons" data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
                {/* WhatsApp Button (Replacing DOWNLOAD CV) */}
                <a
                  href="https://wa.me/919876543210?text=Hi%20Nikhil%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-hero-btn"
                  aria-label="Chat on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
                <button className="hero-btn-watch" onClick={() => setVideoOpen(true)}>
                  <span className="hero-play-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="hero-play-icon">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="hero-watch-text">Watch Intro</span>
                </button>
              </div>
            </div>
            <div className="hero-image" data-aos="fade-left" data-aos-delay="200" data-aos-duration="1200">
              <div className="profile-circle-wrapper">
                <div className="profile-circle-img-wrap">
                  <img
                    src="/images/Gemini_Generated_Image_s2k77gs2k77gs2k7.png"
                    alt="Nikhil Sharma - Full Stack Developer & UI/UX Designer in Jaipur"
                    className="profile-circle-img"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    width="500"
                    height="500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" ref={svcRef}>
        <div className="container">
          <div className={`svc-header ${svcVisible ? 'svc-header-visible' : ''}`}>
            <div className="svc-header-label">
              <span className="svc-stroke-label">My Service</span>
            </div>
            <div className="svc-header-title">
              <h2 className="svc-big-title" data-aos="zoom-out-down" data-aos-delay="200" data-aos-duration="1000" data-aos-offset="20">
                Web Development, App Development & UI/UX Design Services in Jaipur
              </h2>
            </div>
          </div>

          {/* Cards grid — show only first 3 services */}
          <div className="svc-cards-grid">
            {services.slice(0, 3).map((service, index) => (
              <div
                key={service.id}
                className={`svc-card ${svcVisible ? 'svc-card-visible' : ''}`}
                style={{ transitionDelay: `${0.1 + index * 0.15}s` }}
              >
                <div className="svc-card-icon">
                  {SERVICE_ICONS_SVG[index % SERVICE_ICONS_SVG.length]}
                </div>
                <h3 className="svc-card-title">{service.title}</h3>
                <p className="svc-card-desc">
                  {service.description
                    ? service.description.replace(/<[^>]*>/g, '').slice(0, 160) + (service.description.replace(/<[^>]*>/g, '').length > 160 ? '…' : '')
                    : ''}
                </p>
                <a
                  href={(() => {
                    if (!service.slug) return '/services';
                    const parts = service.slug.split('-');
                    const prefix = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                    const rest = parts.slice(1).join('-');
                    return rest ? `/${prefix}/${rest}` : `/${prefix}`;
                  })()}
                  className="svc-card-link"
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-header">
            <div className="about-header-label">
              <span className="about-stroke-label">About Me</span>
            </div>
            <div className="about-header-title">
              <h2 className="about-big-title" data-aos="zoom-out-down" data-aos-delay="200" data-aos-duration="1000">
                Nikhil Sharma
              </h2>
            </div>
          </div>
          <div className="about-content-row">
            <div className="about-img-col" data-aos="fade-right" data-aos-delay="100" data-aos-duration="1000">
              <div className="about-circle-wrapper">
                <div className="about-circle-img-wrap">
                  <img
                    src="/images/Gemini_Generated_Image_ca27fpca27fpca27.png"
                    alt="About Nikhil Sharma"
                    className="about-circle-img"
                  />
                </div>
              </div>
            </div>
            <div className="about-text-col" data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000">
              <p className="about-description">
                I am a Jaipur Rajasthan-based Full Stack Developer & Database architect with a focus on Software Development, Web Application, Mobile Application development. I am passionate about building excellent software that improves the lives of those around me.I have a diverse range of experience having worked across various fields and industries. I specialize in creating software for clients ranging from individuals and small-businesses all the way to large enterprise corporations. What would you do if you had a software expert available at your fingertips? I love helping pepole to build Awesome Application.              </p>
              <div className="about-checklist">
                {[
                  'Holistic Approach',
                  'Proven Track Record',
                  'Attention to Detail',
                  'Good Communication',
                ].map((item, idx) => (
                  <div key={item} className="about-check-item" data-aos="fade-right" data-aos-delay={300 + idx * 100} data-aos-duration="600">
                    <span className="about-check-icon">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="2 8 6 12 14 4" />
                      </svg>
                    </span>
                    <span className="about-check-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services ticker — static crawlable HTML, visually animated via CSS */}
      <div className="marquee-section" aria-label="Services offered">
        <ul className="marquee-track" aria-hidden="false">
          {[
            'Custom Web Development',
            'React JS Development',
            'PHP Laravel Development',
            'Mobile App Development',
            'Flutter App Development',
            'UI/UX Design',
            'E-Commerce Development',
            'SEO Optimisation',
            'Custom Web Development',
            'React JS Development',
            'PHP Laravel Development',
            'Mobile App Development',
            'Flutter App Development',
            'UI/UX Design',
            'E-Commerce Development',
            'SEO Optimisation',
          ].map((text, idx) => (
            <li key={idx} className="marquee-text">
              {text}
              {idx % 2 === 0 && <span className="marquee-star" aria-hidden="true">✦</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Resume/Experience Section */}
      <section className="resume-section">
        <div className="container">
          <div className="edu-title-wrap" data-aos="fade-up" data-aos-duration="1000">
            <div className="edu-title-row edu-title-row-1">
              <div className="edu-title-line"></div>
              <span className="edu-title-solid">MY EDUCATION</span>
            </div>
            <div className="edu-title-row edu-title-row-2">
              <span className="edu-title-solid">AND</span>
              <span className="edu-title-stroke">&nbsp;WORK</span>
            </div>
            <div className="edu-title-row edu-title-row-3">
              <span className="edu-title-stroke">EXPERIENCE</span>
              <div className="edu-title-line"></div>
            </div>
          </div>
          <div className="edu-timeline">
            <div className="edu-timeline-line"></div>

            {/* Row 1: Left = logo+company+date | Right = title+desc */}
            <div className="edu-item" data-aos="fade-right" data-aos-delay="100" data-aos-duration="800">
              <div className="edu-item-left edu-item-logo-side">
                <div className="edu-item-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                </div>
                <h4 className="edu-item-company">Apple</h4>
                <p className="edu-item-date">Jan 2023 – May 2024</p>
              </div>
              <div className="edu-item-dot"></div>
              <div className="edu-item-right edu-item-text-side">
                <h4 className="edu-item-title">UX / UI Designer</h4>
                <p className="edu-item-desc">Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus</p>
              </div>
            </div>

            {/* Row 2: Left = title+desc | Right = logo+company+date */}
            <div className="edu-item edu-item-reverse" data-aos="fade-left" data-aos-delay="200" data-aos-duration="800">
              <div className="edu-item-left edu-item-text-side">
                <h4 className="edu-item-title">UX / UI Designer</h4>
                <p className="edu-item-desc">Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus</p>
              </div>
              <div className="edu-item-dot"></div>
              <div className="edu-item-right edu-item-logo-side">
                <div className="edu-item-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </div>
                <h4 className="edu-item-company">Facebook</h4>
                <p className="edu-item-date">June 2020 – Jan 2023</p>
              </div>
            </div>

            {/* Row 3: Left = logo+company+date | Right = title+desc */}
            <div className="edu-item" data-aos="fade-right" data-aos-delay="300" data-aos-duration="800">
              <div className="edu-item-left edu-item-logo-side">
                <div className="edu-item-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 16.709c-1.013-1.271-1.609-2.386-1.808-3.34-.197-.769-.12-1.385.218-1.848.357-.532.89-.791 1.589-.791s1.231.259 1.589.796c.335.458.419 1.075.215 1.848-.218.974-.813 2.087-1.808 3.341l.005-.006zm7.196.855c-.14.934-.775 1.708-1.65 2.085-1.687.734-3.359-.437-4.789-2.026 2.365-2.961 2.803-5.268 1.787-6.758-.596-.855-1.449-1.271-2.544-1.271-2.206 0-3.419 1.867-2.942 4.034.276 1.173 1.013 2.506 2.186 3.996-.735.813-1.432 1.391-2.047 1.748-.478.258-.934.418-1.37.456-2.008.299-3.582-1.647-2.867-3.656.1-.259.297-.734.634-1.471l.019-.039c1.097-2.382 2.43-5.088 3.961-8.09l.039-.1.435-.836c.338-.616.477-.892 1.014-1.231.258-.157.576-.235.934-.235.715 0 1.271.418 1.511.753.118.18.259.419.436.716l.419.815.06.119c1.53 3.001 2.863 5.702 3.955 8.089l.02.019.401.915.237.573c.183.459.221.915.16 1.393z" /></svg>
                </div>
                <h4 className="edu-item-company">Airbnb</h4>
                <p className="edu-item-date">March 2019 – May 2020</p>
              </div>
              <div className="edu-item-dot"></div>
              <div className="edu-item-right edu-item-text-side">
                <h4 className="edu-item-title">Web Developer</h4>
                <p className="edu-item-desc">Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus</p>
              </div>
            </div>

            {/* Row 4: Left = title+desc | Right = logo+company+date */}
            <div className="edu-item edu-item-reverse" data-aos="fade-left" data-aos-delay="400" data-aos-duration="800">
              <div className="edu-item-left edu-item-text-side">
                <h4 className="edu-item-title">Multimedia & Creative Technology</h4>
                <p className="edu-item-desc">Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus</p>
              </div>
              <div className="edu-item-dot"></div>
              <div className="edu-item-right edu-item-logo-side">
                <div className="edu-item-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
                </div>
                <h4 className="edu-item-company">University</h4>
                <p className="edu-item-date">March 2016 – March 2019</p>
              </div>
            </div>
            {/* Row 5: Left = logo+company+date | Right = title+desc */}
            <div className="edu-item" data-aos="fade-right" data-aos-delay="500" data-aos-duration="800">
              <div className="edu-item-left edu-item-logo-side">
                <div className="edu-item-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
                </div>
                <h4 className="edu-item-company">University</h4>
                <p className="edu-item-date">March 2013 – March 2016</p>
              </div>
              <div className="edu-item-dot"></div>
              <div className="edu-item-right edu-item-text-side">
                <h4 className="edu-item-title">Multimedia & Creative Technology</h4>
                <p className="edu-item-desc">Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section" ref={skillsRef}>
        <div className="container">
          <div className="skill-layout">
            <div className="skill-label-col" data-aos="fade-right" data-aos-duration="1000">
              <span className="skill-stroke-label">My<br />Skill</span>
            </div>
            <div className="skill-bars-col">
              {skills.map((skill, i) => (
                <div key={skill.name} className="skill-item" data-aos="fade-up" data-aos-delay={i * 150} data-aos-duration="800">
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-track">
                    <div
                      className={`skill-bar${skillsVisible ? ' skill-bar-animate' : ''}`}
                      style={{
                        '--skill-width': `${skill.percent}%`,
                        animationDelay: `${i * 0.18}s`,
                      }}
                    >
                      <span className="skill-badge">{skill.percent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio-section">
        <div className="container">
          <div className="port-header">
            <div className="port-header-label">
              <span className="port-stroke-label">Portfolio</span>
            </div>
            <div className="port-header-title">
              <h2 className="port-big-title" data-aos="zoom-out-down" data-aos-delay="200" data-aos-duration="1000">
                Selected Projects — Web, App & UI/UX Work
              </h2>
            </div>
          </div>
          <div className="port-grid">
            {portfolios.length === 0
              ? Array.from({ length: 6 }).map((_, i) => <ShimmerPortfolioCard key={i} />)
              : portfolios.map((project, idx) => (
                <a key={project.id} href={`/portfolio/${project.id}`} style={{ textDecoration: 'none' }}>
                  <div className="port-item" data-aos="zoom-in" data-aos-delay={idx * 100} data-aos-duration="800">
                    <div className="port-img-wrap">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="port-img"
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="300"
                        data-aos="fade-in"
                        data-aos-delay={idx * 150}
                        data-aos-duration="600"
                        onError={e => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/project-5.jpg'; }}
                      />
                      <div className="port-overlay">
                        <div className="port-overlay-content">
                          <h4 className="port-overlay-title">{project.title}</h4>
                          {project.category && <p className="port-overlay-cat">{project.category}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }} data-aos="fade-up" data-aos-delay="200">
            <a href="/portfolio" className="view-all-btn">
              VIEW ALL PROJECTS &nbsp;›
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testi-header">
            <div className="testi-header-label">
              <span className="testi-stroke-label">Testimonials</span>
            </div>
            <div className="testi-header-title">
              <h2 className="testi-big-title" data-aos="zoom-out-down" data-aos-delay="200" data-aos-duration="1000">
                What Clients Say About Working With Me
              </h2>
            </div>
          </div>
          <div className="testi-slider-wrap">
            <div
              className="testi-slider-track"
              style={{ transform: `translateX(calc(-${activeSlide} * (50% + 1rem)))` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="testi-card"
                  data-aos="fade-up"
                  data-aos-delay={t.id * 100}
                  data-aos-duration="700"
                >
                  {/* Star rating */}
                  <div className="testi-stars" aria-label={`${t.rating || 5} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <svg key={s} viewBox="0 0 20 20" fill={s <= (t.rating || 5) ? '#f59e0b' : '#e5e7eb'} width="14" height="14">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="testi-text">"{t.text}"</p>
                  <div className="testi-client-row">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="testi-avatar"
                      loading="lazy"
                      decoding="async"
                      width="48"
                      height="48"
                    />
                    <div>
                      <h4 className="testi-name">{t.name}</h4>
                      <p className="testi-position">{t.position}{t.company ? `, ${t.company}` : ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="testi-controls">
            <div className="testi-arrows">
              <button className="testi-arrow-btn" onClick={() => { prevSlide(); startAutoScroll(); }} aria-label="Previous">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="testi-arrow-btn" onClick={() => { nextSlide(); startAutoScroll(); }} aria-label="Next">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="testi-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testi-dot ${i === activeSlide ? 'testi-dot-active' : ''}`}
                  onClick={() => { setActiveSlide(i); startAutoScroll(); }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos / Trusted By strip */}
      <section className="clients-section" data-aos="fade-up" aria-label="Clients and platforms">
        <div className="container">
          <p className="clients-label">TRUSTED BY CLIENTS & FEATURED ON</p>
          <div className="clients-logos-row">
            {[
              { name: 'Upwork', href: 'https://www.upwork.com/freelancers/nikhilsharma', abbr: 'UW' },
              { name: 'Clutch', href: 'https://clutch.co/profile/nikhil-sharma-developer', abbr: 'CL' },
              { name: 'GoodFirms', href: 'https://www.goodfirms.co/company/nikhil-sharma', abbr: 'GF' },
              { name: 'Sulekha', href: 'https://www.sulekha.com/nikhilsharma', abbr: 'SU' },
              { name: 'Justdial', href: 'https://www.justdial.com/nikhilsharma', abbr: 'JD' },
              { name: 'LinkedIn', href: 'https://www.linkedin.com/in/nikhil-sharma-jaipur', abbr: 'LI' },
              { name: 'GitHub', href: 'https://github.com/nikhilsharma', abbr: 'GH' },
            ].map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="client-logo-pill"
                aria-label={c.name}
              >
                <span className="client-logo-abbr">{c.abbr}</span>
                <span className="client-logo-name">{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section" ref={blogRef}>
        <div className="container">
          <div className={`blog-header ${blogVisible ? 'blog-header-visible' : ''}`}>
            <div className="blog-header-label">
              <span className="blog-stroke-label">My Blog</span>
            </div>
            <div className="blog-header-title">
              <h2 className="blog-big-title" data-aos="zoom-out-down" data-aos-delay="200" data-aos-duration="1000">
                Web Development Tips, Tutorials & Industry Insights
              </h2>
            </div>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <a
                key={post.id}
                href={`/${post.slug || post.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className={`blog-card ${blogVisible ? 'blog-card-visible' : ''}`}
                  style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                  data-aos-duration="800"
                >
                  <div className="blog-img-wrap">
                    <img src={
                      post.main_image
                        ? (post.main_image.startsWith('http') ? post.main_image : `/images/blogs/${post.main_image}`)
                        : 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg'
                    } alt={post.title} className="blog-img" loading="lazy" decoding="async" width="400" height="240"
                      onError={e => { e.target.src = 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/blog-fi-1.jpg'; }}
                    />
                  </div>
                  <div className="blog-card-body">
                    <h4 className="blog-card-title">{post.title}</h4>
                    <p className="blog-card-excerpt">
                      {post.meta_description
                        ? (post.meta_description.length > 120 ? post.meta_description.slice(0, 120) + '...' : post.meta_description)
                        : (post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : '')
                      }
                    </p>
                    <div className="blog-card-meta">
                      <div className="blog-card-author-wrap">
                        <div className="blog-card-avatar">
                          <img
                            src="https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-1.jpg"
                            alt="Nikhil Sharma"
                          />
                        </div>
                        <span className="blog-card-author">Nikhil Sharma</span>
                      </div>
                      <span className="blog-card-date">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="contact-section">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-left">
              <h2 className="contact-title" data-aos="fade-right" data-aos-duration="1000">
                LET'S<br />
                <span className="contact-title-indent">GET</span><br />
                IN TOUCH
              </h2>
              <div className="contact-items" ref={contactRef}>
                <div className={`contact-item ${contactVisible ? 'contact-item-visible' : ''}`} style={{ transitionDelay: '0s' }} data-aos="fade-right" data-aos-delay="100" data-aos-duration="600">
                  <div className="contact-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div className="contact-item-text">
                    <h4 className="contact-item-label">E-MAIL</h4>
                    <p className="contact-item-value">nikhilsharma@thenikhilsharma.in</p>
                  </div>
                </div>
                <div className={`contact-item ${contactVisible ? 'contact-item-visible' : ''}`} style={{ transitionDelay: '0.15s' }} data-aos="fade-right" data-aos-delay="250" data-aos-duration="600">
                  <div className="contact-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <div className="contact-item-text">
                    <h4 className="contact-item-label">PHONE</h4>
                    <p className="contact-item-value">+91 95299 21038</p>
                  </div>
                </div>
                <div className={`contact-item ${contactVisible ? 'contact-item-visible' : ''}`} style={{ transitionDelay: '0.3s' }} data-aos="fade-right" data-aos-delay="400" data-aos-duration="600">
                  <div className="contact-icon-circle">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="contact-item-text">
                    <h4 className="contact-item-label">LOCATION</h4>
                    <p className="contact-item-value">Jaipur, Rajasthan, India — 302001</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-right" data-aos="zoom-out" data-aos-delay="200" data-aos-duration="1000">
              <form
                className="contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  fetch('/contact', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                      'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                      name: fd.get('name'),
                      email: fd.get('email'),
                      message: fd.get('message'),
                    }),
                  })
                    .then(res => res.ok && e.target.reset())
                    .catch(() => { });
                }}
              >
                <div className="contact-field">
                  <label className="contact-field-label">Name</label>
                  <input type="text" name="name" required className="contact-input" placeholder="" />
                </div>
                <div className="contact-field">
                  <label className="contact-field-label">Email</label>
                  <input type="email" name="email" required className="contact-input" placeholder="" />
                </div>
                <div className="contact-field">
                  <label className="contact-field-label">Message</label>
                  <textarea name="message" required className="contact-textarea" rows={5} placeholder=""></textarea>
                </div>
                <button type="submit" className="contact-submit-btn">
                  SEND MESSAGE
                </button>
              </form>
              {/* WhatsApp secondary CTA */}
              <a
                href="https://wa.me/919529921038?text=Hi%20Nikhil%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-cta-btn"
                aria-label="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Keywords & Services Section (Side-by-Side) */}
      <section className="keywords-section" data-aos="fade-up" data-aos-delay="100">
        <div className="keywords-container">
          <div className="keywords-grid-row">
            {/* Keywords Column */}
            <div className="keywords-content">
              <p className="keywords-title">#KEYWORD</p>
              <div className="keywords-chips" data-lenis-prevent>
                {keywordHighlights.map((label, idx) => {
                  // New URL format: "Best Software Developer in Jaipur" → "/Best/software-developer/Jaipur"
                  const inParts = label.split(' in ');
                  const servicePart = (inParts[0] || label).trim();
                  const location = (inParts[1] || '').trim();
                  const words = servicePart.split(/\s+/);
                  const prefix = words[0] || 'Best';
                  const rest = words.slice(1).join(' ');
                  const serviceSlug = rest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  const href = location ? `/${prefix}/${serviceSlug}/${location}` : `/${prefix}/${serviceSlug}`;
                  return (
                    <a
                      key={idx}
                      href={href}
                      className="keyword-chip"
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Services Column */}
            <div className="keywords-content">
              <p className="keywords-title">#SERVICES</p>
              <div className="keywords-chips" data-lenis-prevent>
                {serviceHighlights.map((svc, idx) => {
                  let href = '/services';
                  if (svc.isFallback) {
                    if (svc.slug) {
                      const parts = svc.slug.split('-');
                      const prefix = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                      const rest = parts.slice(1).join('-');
                      href = rest ? `/${prefix}/${rest}` : `/${prefix}`;
                    }
                  } else {
                    // Service chips use keyword-style URL from title
                    // "Best Website Design Near Me" → "/Best/website-design-near-me"
                    const title = svc.title || '';
                    const inParts = title.split(' in ');
                    const servicePart = (inParts[0] || title).trim();
                    const location = (inParts[1] || '').trim();
                    const words = servicePart.split(/\s+/);
                    const prefix = words[0] || 'Best';
                    const rest = words.slice(1).join(' ');
                    const serviceSlug = rest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    href = location
                      ? `/${prefix}/${serviceSlug}/${location}`
                      : `/${prefix}/${serviceSlug}`;
                  }
                  return (
                    <a
                      key={idx}
                      href={href}
                      className="keyword-chip"
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      {svc.title}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && (
        <div className="video-modal-overlay" onClick={() => setVideoOpen(false)}>
          <div className="video-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setVideoOpen(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="video-modal-iframe-wrap">
              <iframe
                src="https://www.youtube.com/embed/yNDgFK2Jj1E?autoplay=1"
                title="What Is Visual Hierarchy?"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-modal-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
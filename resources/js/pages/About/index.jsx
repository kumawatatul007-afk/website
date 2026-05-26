import { useRef, useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import SEO from '../../components/SEO'
import OptimizedImage from '../../components/OptimizedImage'

const SKILLS = [
  { label: 'HTML',       pct: 85 },
  { label: 'CSS',        pct: 90 },
  { label: 'JAVASCRIPT', pct: 85 },
  { label: 'FIGMA',      pct: 80 },
]

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Rajesh Agarwal',
    position: 'Founder & CEO',
    company: 'TechRetail India',
    image: 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-1.jpg',
    text: "Nikhil redesigned our e-commerce platform from scratch using React and Laravel. Page load time dropped from 8s to under 2s, and our conversion rate improved by 34% in the first month. Highly professional, delivered on time.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Mehta',
    position: 'Marketing Director',
    company: 'Jaipur Handicrafts Co.',
    image: 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-2.jpg',
    text: "We needed a website that could rank for local search terms in Jaipur. Nikhil built us a fully SEO-optimised site with proper schema markup. We now appear on page 1 for 'handicrafts Jaipur' — something we struggled with for years.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Ahmed Al-Rashid',
    position: 'Operations Manager',
    company: 'Gulf Logistics LLC',
    image: 'https://wpdemo.ajufbox.com/mora/wp-content/uploads/2024/11/client-profile-3.jpg',
    text: "Nikhil built our courier management app in Flutter. It runs perfectly on both iOS and Android, integrates with our existing backend, and our drivers love the interface. He was responsive across time zones throughout the project.",
    rating: 5,
  },
]

export default function AboutPage() {
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS)

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 })
  }, [])

  // Fetch testimonials from API
  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data) })
      .catch(() => {})
  }, [])

  const nameParts = 'Nikhil Sharma'.trim().split(' ')
  const firstName = nameParts[0]
  const lastName  = nameParts.slice(1).join(' ') || ''

  return (
    <main className="ap-root">
      <SEO 
        title="About Nikhil Sharma | Full Stack Developer & UI/UX Designer — Jaipur"
        description="8+ years building PHP, React & Flutter apps. Nikhil Sharma is a Jaipur-based Full Stack Developer specialising in web apps, mobile apps, and UI/UX design for startups and SMEs."
        keywords="About Nikhil Sharma, Full Stack Developer Jaipur, PHP React Flutter Developer, Software Architect Jaipur, Web Development Expert India"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Nikhil Sharma",
            "url": "https://thenikhilsharma.in",
            "image": "https://thenikhilsharma.in/images/Gemini_Generated_Image_ca27fpca27fpca27.png",
            "jobTitle": "Full Stack Developer & UI/UX Designer",
            "description": "Jaipur-based Full Stack Developer with 8+ years of experience in PHP, React, Laravel, Flutter, and UI/UX design. Helping startups and SMEs build fast, SEO-optimised digital products.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Jaipur",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://www.linkedin.com/in/nikhil-sharma-jaipur",
              "https://github.com/nikhilsharma",
              "https://www.upwork.com/freelancers/nikhilsharma"
            ],
            "knowsAbout": [
              "PHP Development", "React.js", "Laravel", "Flutter", "UI/UX Design",
              "MySQL", "Full Stack Development", "Web Development", "Mobile App Development"
            ],
            "hasOccupation": {
              "@type": "Occupation",
              "name": "Full Stack Developer",
              "occupationLocation": {
                "@type": "City",
                "name": "Jaipur"
              },
              "skills": "PHP, React, Laravel, Flutter, MySQL, Figma, JavaScript, Node.js"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "mainEntity": {
              "@type": "Person",
              "name": "Nikhil Sharma",
              "url": "https://thenikhilsharma.in/about"
            }
          }
        ]}
      />

      {/* ══════════════════════════════════════
          SECTION 1 — ABOUT HERO
      ══════════════════════════════════════ */}
      <section className="ap-hero-section">
        <div className="ap-container">
          <div className="ap-hero-row">

            {/* Left — text */}
            <div className="ap-hero-text">
              <span
                className="ap-about-label"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                About Me
              </span>

              <h1
                className="ap-hero-name"
                data-aos="zoom-out-down"
                data-aos-duration="900"
                data-aos-delay="100"
              >
                {firstName}
                {lastName && <><br />{lastName}</>}
              </h1>

              <h3
                className="ap-hero-role"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="200"
              >
                Web Developer.
              </h3>

              <p
                className="ap-hero-desc"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="300"
              >
               I am a Jaipur Rajasthan-based Full Stack Developer & Database architect with a focus on Software Development, Web Application, Mobile Application development. I am passionate about building excellent software that improves the lives of those around me.I have a diverse range of experience having worked across various fields and industries. I specialize in creating software for clients ranging from individuals and small-businesses all the way to large enterprise corporations. What would you do if you had a software expert available at your fingertips? I love helping pepole to build Awesome Application.
              </p>

              <p
                className="ap-hero-desc ap-hero-desc--muted"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="400"
              >
                With a deep understanding of both design and development, I specialize.
                in creating seamless online experiences that resonate with users.
              </p>
            </div>

            {/* Right — profile image */}
            <div
              className="ap-hero-img-wrap"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              {/* <div className="ap-img-circle-bg" /> */}
              <div className="ap-img-blob">
                <OptimizedImage
                  src="/images/Gemini_Generated_Image_ca27fpca27fpca27.png"
                  alt="Nikhil Sharma - Full Stack Developer in Jaipur"
                  priority={true}
                  width={480}
                  height={520}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — SKILLS 
      ══════════════════════════════════════ */}
      <section className="ap-skills-section">
        <div className="ap-container">
          <div className="ap-skills-row">

            {/* Left — headline */}
            <div className="ap-skills-left">
              <h2
                className="ap-skills-heading"
                data-aos="fade-upteri"
                data-aos-duration="800"
              >
                Expertly Crafted Websites Designed to Inspire and Impress.
              </h2>

              <p
                className="ap-skills-desc"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="100"
              >
                Over the years, I have honed my skills in web technologies like HTML,
                CSS, JavaScript, React, and WordPress. My expertise spans across
                front-end and back-end development.
              </p>

              <div 
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="200"
              >
                <Link href="/contact" className="ap-btn-primary">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right — progress bars */}
            <div className="ap-skills-right">
              {SKILLS.map((skill, idx) => (
                <div 
                  key={skill.labele}
                  className="skill-progress-item"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay={idx * 100}
                >
                  <h6 className="title">{skill.label}</h6>
                  <div className="progress" role="progressbar" aria-label={skill.label}>
                    <div
                      className="progress-bar ap-bar-animate"
                      style={{
                        '--bar-width': `${skill.pct}%`,
                        animationDelay: `${0.3 + idx * 0.15}s`,
                      }}
                    >
                      <span>{skill.pct}%</span>
                    </div> 
                  </div>  
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="ap-testimonials-section">
        <div className="ap-container">
          <div className="ap-testimonials-row">

            {/* Left — heading */}
            <div className="ap-testimonials-left">
              <span
                className="ap-about-label"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                Testimonials
              </span>
              <h2
                className="ap-testimonials-heading"
                data-aos="zoom-out-down"
                data-aos-duration="900"
                data-aos-delay="100"
              >
               How Order Processing Drives Logistics Efficiency and client Satisfaction <br />
              </h2>
            </div>

            {/* Right — swiper */}
            <div className="ap-testimonials-right">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={42}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={1500}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current
                  swiper.params.navigation.nextEl = nextRef.current
                  swiper.navigation.init()
                  swiper.navigation.update()
                }}
              >
                {testimonials.map((t) => ( 
                  <SwiperSlide key={t.id}>
                    <div className="testimonial-item">
                      <div className="testimonial-item__client-img">
                        <img src={t.image} alt={t.name} loading="lazy" width="64" height="64" />
                      </div>
                      <div className="ap-testi-body">
                        <div className="ap-testi-stars" aria-label={`${t.rating || 5} out of 5 stars`}>
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} viewBox="0 0 20 20" fill={s <= (t.rating || 5) ? '#f59e0b' : '#e5e7eb'} width="13" height="13">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        <blockquote className="testimonial-item__text">
                          <p>"{t.text}"</p>
                        </blockquote>
                        <div className="ap-testi-meta">
                          <div className="testimonial-item__client-name">{t.name}</div>
                          <div className="testimonial-item__client-occ">{t.position}{t.company ? `, ${t.company}` : ''}</div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Nav buttons */}
              <div className="ap-slider-nav-row">
                <div className="ap-slider-nav">
                  <button ref={prevRef} className="ap-nav-btn" aria-label="Previous">
                    ‹
                  </button>
                  <button ref={nextRef} className="ap-nav-btn" aria-label="Next">
                    ›
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — AS SEEN ON / DIRECTORIES
      ══════════════════════════════════════ */}
      <section className="ap-dirs-section">
        <div className="ap-container">
          <span className="ap-about-label" data-aos="fade-right" data-aos-duration="800">
            Find Me Online
          </span>
          <h2 className="ap-dirs-heading" data-aos="zoom-out-down" data-aos-duration="900" data-aos-delay="100">
            As Seen On
          </h2>
          <p className="ap-dirs-desc" data-aos="fade-up" data-aos-delay="150">
            You can verify my work, read client reviews, and hire me through these trusted platforms and directories.
          </p>
          <div className="ap-dirs-grid" data-aos="fade-up" data-aos-delay="200">
            {[
              { name: 'Upwork',     href: 'https://www.upwork.com/freelancers/nikhilsharma',         desc: 'Freelance marketplace — verified profile & client reviews' },
              { name: 'Clutch',     href: 'https://clutch.co/profile/nikhil-sharma-developer',       desc: 'B2B ratings platform — portfolio & verified client feedback' },
              { name: 'GoodFirms', href: 'https://www.goodfirms.co/company/nikhil-sharma',           desc: 'Software company directory — listed & reviewed' },
              { name: 'Sulekha',   href: 'https://www.sulekha.com/nikhilsharma',                     desc: 'India local services — web developer Jaipur listing' },
              { name: 'Justdial',  href: 'https://www.justdial.com/nikhilsharma',                    desc: 'India business directory — local SEO presence' },
              { name: 'LinkedIn',  href: 'https://www.linkedin.com/in/nikhil-sharma-jaipur',         desc: '8+ years experience, endorsements & recommendations' },
              { name: 'GitHub',    href: 'https://github.com/nikhilsharma',                          desc: 'Open source contributions & public repositories' },
              { name: 'Toptal',    href: 'https://www.toptal.com/resume/nikhil-sharma',              desc: 'Top 3% freelancer network — screened & verified' },
            ].map((d) => (
              <a
                key={d.name}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ap-dir-card"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <p className="ap-dir-name">{d.name} ↗</p>
                <p className="ap-dir-desc">{d.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}

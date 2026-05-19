import { useRef, useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import './index.css';
import SEO from '../../components/SEO';

const ContactPage = () => {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Contact items slide-in animation (same as DashboardPage)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/contact', {
      onSuccess: () => reset(),
    });
  };

  return (
    <main className="contact-page-wrapper">
      <SEO 
        title="Contact Nikhil Sharma | Hire a Professional Web Developer"
        description="Get in touch with Nikhil Sharma for your next web development project. Professional services for small businesses and entrepreneurs."
        keywords="Contact Web Developer, Hire React Developer, Jaipur Software Services"
      />
      <div className="container mx-auto">
        <div className="contact-layout">

          {/* Left: Title + contact info */}
          <div className="contact-left">
            {/* Big stacked title — same as DashboardPage */}
            <h1 className="contact-title">
              LET'S<br />
              <span className="contact-title-indent">GET</span><br />
              IN TOUCH
            </h1>

            {/* Contact items with slide-in animation */}
            <div className="contact-items" ref={contactRef}>
              {/* E-Mail */}
              <div
                className={`contact-item contact-item-anim ${contactVisible ? 'contact-item-visible' : ''}`}
                style={{ transitionDelay: '0s' }}
              >
                <div className="contact-icon-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4 className="contact-item-label">E-MAIL</h4>
                  <p className="contact-item-value">
                    <a href="mailto:nikhilsharma@thenikhilsharma.in" style={{ color: 'inherit', textDecoration: 'none' }}>
                      nikhilsharma@thenikhilsharma.in
                    </a>
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div
                className={`contact-item contact-item-anim ${contactVisible ? 'contact-item-visible' : ''}`}
                style={{ transitionDelay: '0.15s' }}
              >
                <div className="contact-icon-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4 className="contact-item-label">PHONE / WHATSAPP</h4>
                  <p className="contact-item-value">+91 9529921038</p>
                </div>
              </div>

              {/* Location */}
              <div
                className={`contact-item contact-item-anim ${contactVisible ? 'contact-item-visible' : ''}`}
                style={{ transitionDelay: '0.3s' }}
              >
                <div className="contact-icon-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4 className="contact-item-label">LOCATION</h4>
                  <p className="contact-item-value">Jaipur, Rajasthan, India - 302001</p>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="contact-map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65047083281249!3d26.88514167956319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin"
                title="Nikhil Sharma — Web Developer, Jaipur, Rajasthan"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Quick-contact CTAs - ENHANCED THICK BUTTONS */}
            <div className="contact-quick-btns">
              <a
                href="https://wa.me/919876543210?text=Hi%20Nikhil%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="contact-quick-btn contact-quick-btn--whatsapp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href="https://calendly.com/nikhilsharma/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-quick-btn contact-quick-btn--calendly"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book a Free Call
              </a>
            </div>
          </div>

          {/* Right: Form with underline-only inputs */}
          <div className="contact-right">
            {(wasSuccessful || flash?.success) && (
              <div className="contact-success">
                ✓ {flash?.success || "Message sent! I'll get back to you soon."}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-field-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  className={`contact-input${errors.name ? ' contact-input-error' : ''}`}
                  placeholder=""
                />
                {errors.name && <span className="contact-error-msg">{errors.name}</span>}
              </div>

              <div className="contact-field">
                <label className="contact-field-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className={`contact-input${errors.email ? ' contact-input-error' : ''}`}
                  placeholder=""
                />
                {errors.email && <span className="contact-error-msg">{errors.email}</span>}
              </div>

              <div className="contact-field">
                <label className="contact-field-label">Subject (Optional)</label>
                <input
                  type="text"
                  name="subject"
                  value={data.subject}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder=""
                />
              </div>

              <div className="contact-field">
                <label className="contact-field-label">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={data.message}
                  onChange={handleChange}
                  className={`contact-textarea${errors.message ? ' contact-input-error' : ''}`}
                  placeholder=""
                ></textarea>
                {errors.message && <span className="contact-error-msg">{errors.message}</span>}
              </div>

              <button type="submit" disabled={processing} className="contact-submit-btn">
                {processing ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ContactPage;
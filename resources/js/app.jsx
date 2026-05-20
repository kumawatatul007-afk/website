import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { router } from '@inertiajs/react';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './components/layouts/MainLayout';

// ── Thin Top Progress Bar (no blocking overlay) ───────────────────────────────
(function () {
    const style = document.createElement('style');
    style.textContent = `
        #kiro-progress-bar {
            position: fixed;
            top: 0; left: 0;
            height: 2px;
            width: 0%;
            background: linear-gradient(90deg, #2563eb, #7c3aed);
            z-index: 99999;
            transition: width 0.3s ease, opacity 0.4s ease;
            opacity: 0;
            pointer-events: none;
        }
        #kiro-progress-bar.active {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'kiro-progress-bar';
    document.body.appendChild(bar);

    let timer = null;
    let fakeTimer = null;
    let width = 0;

    function startProgress() {
        bar.classList.add('active');
        width = 0;
        bar.style.width = '0%';
        // Fake progress: quickly go to 80%, then slow down
        fakeTimer = setInterval(() => {
            if (width < 80) {
                width += (80 - width) * 0.12;
                bar.style.width = width + '%';
            }
        }, 50);
    }

    function finishProgress() {
        clearInterval(fakeTimer);
        bar.style.width = '100%';
        setTimeout(() => {
            bar.classList.remove('active');
            setTimeout(() => { bar.style.width = '0%'; }, 400);
        }, 200);
    }

    router.on('start', () => {
        clearTimeout(timer);
        startProgress();
    });
    router.on('finish', () => {
        clearTimeout(timer);
        finishProgress();
    });
    router.on('error', () => {
        clearTimeout(timer);
        finishProgress();
    });
})();
// ─────────────────────────────────────────────────────────────────────────────

createInertiaApp({
    title: (title) => title, // Title is fully managed by the SEO component per page
    resolve: (name) => {
        // Admin pages alag folder se load karo
        const adminPages = import.meta.glob('./Admin/**/*.jsx', { eager: true });
        // Website pages alag folder se load karo
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });

        // Admin pages (Admin/ se shuru hone wale) ko Admin folder se resolve karo
        if (name.startsWith('Admin/')) {
            const adminKey = `./${name}.jsx`;
            const page = adminPages[adminKey];
            if (!page) {
                console.error(`[Inertia] Admin page not found: ${name} (key: ${adminKey})`);
                return;
            }
            return page;
        }

        // Website pages ko pages/ folder se resolve karo
        const pageKey = `./pages/${name}.jsx`;
        const page = pages[pageKey];

        if (!page) {
            console.error(`[Inertia] Page not found: ${name} (key: ${pageKey})`);
            return;
        }

        // Website pages ko MainLayout wrap karo
        page.default.layout = page.default.layout
            ?? ((page) => <MainLayout>{page}</MainLayout>);

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <HelmetProvider>
                <App {...props} />
            </HelmetProvider>
        );
    },
    progress: false,   // default blue bar band kar diya
});

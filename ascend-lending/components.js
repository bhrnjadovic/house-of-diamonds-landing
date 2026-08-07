/* ══════════════════════════════════════════════════════════════
   ASCEND LENDING PARTNERS — components.js
   Shared navbar + footer injection for all product pages
══════════════════════════════════════════════════════════════ */
(function () {
    const inProducts = window.location.pathname.includes('/products/');
    const B = inProducts ? '../' : './';

    // ── Navbar HTML ──────────────────────────────────────────────
    const navHTML = `
<header class="navbar" id="navbar">
  <div class="container navbar__inner">
    <a href="${B}index.html" class="navbar__logo" aria-label="Ascend Lending Partners">
      <img src="${B}logo-new.svg" alt="Ascend Lending Partners" class="navbar__logo-img" style="height:38px;width:auto;" />
    </a>
    <nav class="navbar__nav" aria-label="Primary navigation">
      <div class="navbar__mega-wrapper">
        <button class="navbar__mega-trigger" id="megaTrigger" aria-expanded="false" aria-haspopup="true" aria-controls="megaMenu">
          Business Lending
          <svg class="navbar__mega-chevron" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <a href="${B}index.html#process">How It Works</a>
      <a href="${B}index.html#why-ascend">Why Ascend</a>
      <a href="${B}index.html#contact">Contact</a>
    </nav>
    <a href="${B}index.html#contact" class="btn btn--navy navbar__cta">Get Started</a>
    <button class="navbar__hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="navbar__mega" id="megaMenu" aria-hidden="true" role="navigation" aria-label="Business Lending products">
    <div class="container">
      <div class="navbar__mega-inner">
        <div class="navbar__mega-col">
          <p class="navbar__mega-col-title">Business Loans</p>
          <a href="${B}products/business-loans.html">Business Loans</a>
          <a href="${B}products/small-business-loans.html">Small Business Loans</a>
          <a href="${B}products/unsecured-business-loans.html">Unsecured Business Loans</a>
          <a href="${B}products/secured-business-loans.html">Secured Business Loans</a>
          <a href="${B}products/low-doc-loans.html">Low Doc Loans</a>
          <a href="${B}products/high-doc-loans.html">Full Doc Loans</a>
        </div>
        <div class="navbar__mega-col">
          <p class="navbar__mega-col-title">Cash Flow & Working Capital</p>
          <a href="${B}products/business-line-of-credit.html">Business Line of Credit</a>
          <a href="${B}products/cashflow-loans.html">Cashflow Loans</a>
          <a href="${B}products/working-capital-loans.html">Working Capital Loans</a>
          <a href="${B}products/invoice-finance.html">Invoice Finance</a>
        </div>
        <div class="navbar__mega-col">
          <p class="navbar__mega-col-title">Specialist Finance</p>
          <a href="${B}products/equipment-finance.html">Equipment Finance</a>
          <a href="${B}products/trade-finance.html">Trade Finance</a>
          <a href="${B}products/ato-tax-debt-loans.html">ATO Tax Debt Finance</a>
          <a href="${B}products/short-term-business-loans.html">Short Term Business Loans</a>
        </div>
        <div class="navbar__mega-col">
          <p class="navbar__mega-col-title">Not sure where to start?</p>
          <p style="font-size:0.8rem;color:var(--steel);line-height:1.65;margin-bottom:1rem;">Talk to a specialist who understands complex commercial lending.</p>
          <a href="${B}index.html#contact" class="btn btn--navy">Talk to a Specialist</a>
        </div>
      </div>
    </div>
  </div>
  <div class="navbar__mobile-menu" id="mobileMenu" aria-hidden="true">
    <div class="mobile-accordion">
      <button class="mobile-accordion__trigger" id="mobileAccordionTrigger" aria-expanded="false">
        Business Lending
        <svg class="mobile-accordion__chevron" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="mobile-accordion__panel" id="mobileAccordionPanel">
        <div class="mobile-accordion__grid">
          <div>
            <p class="mobile-accordion__col-title">Business Loans</p>
            <a href="${B}products/business-loans.html" class="mobile-sub-link">Business Loans</a>
            <a href="${B}products/small-business-loans.html" class="mobile-sub-link">Small Business</a>
            <a href="${B}products/unsecured-business-loans.html" class="mobile-sub-link">Unsecured Loans</a>
            <a href="${B}products/secured-business-loans.html" class="mobile-sub-link">Secured Loans</a>
            <a href="${B}products/low-doc-loans.html" class="mobile-sub-link">Low Doc Loans</a>
            <a href="${B}products/high-doc-loans.html" class="mobile-sub-link">Full Doc Loans</a>
          </div>
          <div>
            <p class="mobile-accordion__col-title">Cash Flow</p>
            <a href="${B}products/business-line-of-credit.html" class="mobile-sub-link">Line of Credit</a>
            <a href="${B}products/cashflow-loans.html" class="mobile-sub-link">Cashflow Loans</a>
            <a href="${B}products/working-capital-loans.html" class="mobile-sub-link">Working Capital</a>
            <a href="${B}products/invoice-finance.html" class="mobile-sub-link">Invoice Finance</a>
            <p class="mobile-accordion__col-title" style="margin-top:0.75rem">Specialist</p>
            <a href="${B}products/equipment-finance.html" class="mobile-sub-link">Equipment Finance</a>
            <a href="${B}products/trade-finance.html" class="mobile-sub-link">Trade Finance</a>
            <a href="${B}products/ato-tax-debt-loans.html" class="mobile-sub-link">ATO Tax Debt</a>
            <a href="${B}products/short-term-business-loans.html" class="mobile-sub-link">Short Term Loans</a>
          </div>
        </div>
      </div>
    </div>
    <a href="${B}index.html#process" class="mobile-link">How It Works</a>
    <a href="${B}index.html#why-ascend" class="mobile-link">Why Ascend</a>
    <a href="${B}index.html#contact" class="mobile-link">Contact</a>
    <a href="${B}index.html#contact" class="btn btn--navy mobile-cta">Get Started</a>
  </div>
</header>`;

    // ── Footer HTML ──────────────────────────────────────────────
    const footerHTML = `
<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__brand">
      <a href="${B}index.html" class="footer__logo" aria-label="Ascend Lending Partners home">
        <img src="${B}logo-footer.svg" alt="Ascend Lending Partners" class="footer__logo-img" style="height:38px;width:auto;" />
      </a>
      <p class="footer__tagline">Lending with Precision.</p>
      <p class="footer__credit-rep">Australian Credit Licence No. XXXXXX &nbsp;|&nbsp; ACN XXX XXX XXX</p>
    </div>
    <div class="footer__links">
      <div class="footer__col">
        <h4 class="footer__col-title">Business Finance</h4>
        <a href="${B}products/business-loans.html">Business Loans</a>
        <a href="${B}products/business-line-of-credit.html">Line of Credit</a>
        <a href="${B}products/unsecured-business-loans.html">Unsecured Loans</a>
        <a href="${B}products/secured-business-loans.html">Secured Loans</a>
        <a href="${B}products/small-business-loans.html">Small Business Loans</a>
      </div>
      <div class="footer__col">
        <h4 class="footer__col-title">Specialist Finance</h4>
        <a href="${B}products/equipment-finance.html">Equipment Finance</a>
        <a href="${B}products/invoice-finance.html">Invoice Finance</a>
        <a href="${B}products/trade-finance.html">Trade Finance</a>
        <a href="${B}products/ato-tax-debt-loans.html">ATO Tax Debt</a>
        <a href="${B}products/cashflow-loans.html">Cashflow Loans</a>
      </div>
      <div class="footer__col">
        <h4 class="footer__col-title">Contact</h4>
        <a href="tel:1300000000">1300 000 000</a>
        <a href="mailto:hello@ascendlending.com.au">hello@ascendlending.com.au</a>
        <span>Sydney, NSW</span>
        <span>Australia-Wide</span>
      </div>
    </div>
  </div>
  <div class="footer__bottom">
    <div class="container footer__bottom-inner">
      <p>&copy; 2025 Ascend Lending Partners. All rights reserved.</p>
      <p class="footer__disclaimer">General information only. Not financial advice. Credit subject to lender assessment and approval criteria. Ascend Lending Partners Pty Ltd — Australian Credit Licence No. XXXXXX.</p>
    </div>
  </div>
</footer>`;

    // ── Inject ───────────────────────────────────────────────────
    const navPh = document.getElementById('navbar-placeholder');
    if (navPh) navPh.outerHTML = navHTML;
    const ftPh = document.getElementById('footer-placeholder');
    if (ftPh) ftPh.outerHTML = footerHTML;

    // ── Mega menu ────────────────────────────────────────────────
    (function () {
        const trigger = document.getElementById('megaTrigger');
        const panel   = document.getElementById('megaMenu');
        const wrapper = trigger && trigger.closest('.navbar__mega-wrapper');
        if (!trigger || !panel) return;
        let hideTimer;
        const openMenu  = () => { clearTimeout(hideTimer); panel.classList.add('is-open'); trigger.setAttribute('aria-expanded','true'); panel.setAttribute('aria-hidden','false'); };
        const closeMenu = () => { hideTimer = setTimeout(() => { panel.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false'); panel.setAttribute('aria-hidden','true'); }, 120); };
        wrapper.addEventListener('mouseenter', openMenu);
        wrapper.addEventListener('mouseleave', closeMenu);
        panel.addEventListener('mouseenter', () => clearTimeout(hideTimer));
        panel.addEventListener('mouseleave', closeMenu);
        trigger.addEventListener('click', () => panel.classList.contains('is-open') ? closeMenu() : openMenu());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) { closeMenu(); trigger.focus(); } });
        document.addEventListener('click', (e) => { if (!panel.contains(e.target) && !wrapper.contains(e.target)) closeMenu(); });
    })();

    // ── Mobile accordion ─────────────────────────────────────────
    const mAccTrigger = document.getElementById('mobileAccordionTrigger');
    const mAccPanel   = document.getElementById('mobileAccordionPanel');
    if (mAccTrigger && mAccPanel) {
        mAccTrigger.addEventListener('click', () => {
            const isOpen = mAccPanel.classList.contains('is-open');
            mAccPanel.classList.toggle('is-open', !isOpen);
            mAccTrigger.classList.toggle('is-open', !isOpen);
            mAccTrigger.setAttribute('aria-expanded', String(!isOpen));
        });
    }

    // ── Navbar JS ────────────────────────────────────────────────
    const navbar  = document.getElementById('navbar');
    const burger  = document.getElementById('hamburger');
    const mobMenu = document.getElementById('mobileMenu');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
        }, { passive: true });
    }
    if (burger && mobMenu) {
        burger.addEventListener('click', () => {
            const open = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', String(!open));
            mobMenu.setAttribute('aria-hidden', String(open));
            burger.classList.toggle('is-open', !open);
            mobMenu.classList.toggle('is-open', !open);
        });
        document.querySelectorAll('.mobile-link, .mobile-cta').forEach(l => {
            l.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                mobMenu.setAttribute('aria-hidden', 'true');
                burger.classList.remove('is-open');
                mobMenu.classList.remove('is-open');
            });
        });
    }

    // ── Smooth scroll ────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) {
                e.preventDefault();
                window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
            }
        });
    });

    // ── FAQ accordion ────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
            if (!wasOpen) item.classList.add('is-open');
        });
    });

    // ── Scroll-reveal ────────────────────────────────────────────
    const revealSel = '.benefit-card,.for-card,.faq-item,.related-card,.elig-item,.process__step,.why-card,.trust-stat,.prod-stat-card';
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(revealSel).forEach(el => obs.observe(el));

    // ── Loaded ───────────────────────────────────────────────────
    document.body.classList.add('loaded');
})();

/* ══════════════════════════════════════════════════════════════
   ASCEND LENDING PARTNERS — Meta Ads Landing Page — Form Engine
   9-step wizard driven entirely by the LP_STEPS config below.
   Step types: 'icon-grid' (auto-advance), 'slider' (tiered dynamic
   feedback), 'choice' (per-option message + optional reveal fields),
   'group' (multiple sub-fields on one screen, shared message area).

   To reuse this page for a different product/campaign:
     1. Duplicate this file + its .html alongside it.
     2. Edit LP_STEPS to add/remove/reorder questions.
     3. Edit LP_CONFIG.landingPage to a new unique slug.
══════════════════════════════════════════════════════════════ */

const LP_CONFIG = {
    landingPage: 'business-funding-check', // hidden field sent with every lead — unique per campaign page
    endpoint: '/api/ascend-lead',
};

// ── Recent approvals slider — PLACEHOLDER data ──────────────────────────
// All 6 entries are illustrative examples (see disclaimer on the page).
// Replace amount/product/description/date with real funded deals as they
// become available — most recent first, each ~3-7 days apart.
// `daysAgo` is relative to today, not a fixed date — see formatRelativeDate()
// below. This means the displayed dates roll forward automatically every
// time the page loads, with no manual updates ever needed.
const LP_DEALS = [
    {
        amount: '$180,000',
        product: 'Unsecured Working Capital',
        description: 'facility approved for a Melbourne logistics business — funds settled the same day.',
        daysAgo: 0,
    },
    {
        amount: '$420,000',
        product: 'Secured Business Loan',
        description: 'approved for a Sydney civil construction company — funded expansion into a second state.',
        daysAgo: 4,
    },
    {
        amount: '$310,000',
        product: 'Equipment Finance',
        description: 'approved for a Brisbane manufacturing business — funded a new production line.',
        daysAgo: 9,
    },
    {
        amount: '$95,000',
        product: 'ATO Tax Debt Finance',
        description: 'approved for a Perth hospitality group — debt cleared and resolved in 3 business days.',
        daysAgo: 13,
    },
    {
        amount: '$150,000',
        product: 'Invoice Finance',
        description: 'approved for an Adelaide freight & transport company — unlocked cash tied up in outstanding invoices.',
        daysAgo: 19,
    },
    {
        amount: '$68,000',
        product: 'Unsecured Business Loan',
        description: 'approved for a Gold Coast retail store — funded stock purchase ahead of peak trading season.',
        daysAgo: 25,
    },
];

// Formats a `daysAgo` offset as "22 Jul" relative to today's actual date.
function formatRelativeDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ── Icon set (24x24, stroke = currentColor, matches site icon style) ───────
const ICONS = {
    cashflow: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    equipment: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    stock: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
    ato: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M14 9h1M14 13h1M9 21v-4h6v4"/>',
    growth: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    trade: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    consolidate: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    general: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
};

// ── Slider tiers — dynamic feedback as the user drags ───────────────────
// `max` is the upper bound (inclusive) for each tier; last tier should be Infinity.
const AMOUNT_TIERS = [
    { max: 50000, emoji: '💡', text: "Under $50K is our fastest lane — unsecured, minimal paperwork, same day funding available." },
    { max: 150000, emoji: '👍', text: "This is where most of our clients land — unsecured against trading performance, no property required." },
    { max: 300000, emoji: '📈', text: "A solid amount — still comfortably within unsecured territory based on your trading alone." },
    { max: Infinity, emoji: '🚀', text: "Even at this level we have lenders who'll work from bank statements only — facilities up to $500K are possible without property." },
];
const REVENUE_TIERS = [
    { max: 50000, emoji: '👍', text: "Steady revenue — plenty of lenders on our panel are comfortable at this level." },
    { max: 150000, emoji: '💪', text: "Strong revenue — that opens up more lenders and sharper rates." },
    { max: 350000, emoji: '🔥', text: "Great numbers — lenders love revenue like this. Expect competitive offers." },
    { max: Infinity, emoji: '🏆', text: "Powerhouse revenue — this unlocks our best lenders and rates. Let's get started." },
];

// ── Step config — edit this array to customise the flow ────────────────────
const LP_STEPS = [
    {
        id: 'purpose', type: 'icon-grid',
        question: 'What Do You Need the Funds For?',
        options: [
            { label: 'Cashflow / Working Capital', value: 'cashflow', icon: 'cashflow' },
            { label: 'Equipment & Assets', value: 'equipment', icon: 'equipment' },
            { label: 'Stock & Supplies', value: 'stock', icon: 'stock' },
            { label: 'ATO Tax Debt', value: 'ato_debt', icon: 'ato' },
            { label: 'Growth & Expansion', value: 'growth', icon: 'growth' },
            { label: 'Trade & Import Finance', value: 'trade', icon: 'trade' },
            { label: 'Debt Consolidation', value: 'consolidation', icon: 'consolidate' },
            { label: 'General Business Needs', value: 'general', icon: 'general' },
        ],
    },
    {
        id: 'amount', type: 'slider',
        question: 'How Much Funding Do You Need?',
        helper: 'Drag to your ideal amount — you can fine-tune this later.',
        min: 5000, max: 500000, step: 5000, default: 50000,
        minLabel: '$5K', maxLabel: '$500K+',
        tiers: AMOUNT_TIERS,
    },
    {
        id: 'revenue', type: 'slider',
        question: "What's Your Business's Average Monthly Revenue?",
        helper: 'Ballpark is fine — the stronger your numbers, the more we can do for you.',
        min: 0, max: 500000, step: 5000, default: 25000,
        minLabel: '$0', maxLabel: '$500K+',
        tiers: REVENUE_TIERS,
    },
    {
        id: 'trading_months', type: 'choice',
        question: 'How Long Have You Been Trading?',
        options: [
            { label: 'Start-up / under 6 months', value: 'startup', message: "🚀 Start-ups are welcome — we work with lenders who back potential, not just history." },
            { label: '6 – 12 months', value: '6_12_months', message: "👍 That's enough trading history to open up real options." },
            { label: '1 – 2 years', value: '1_2_years', message: '📈 Solid trading history — this puts more lenders in play.' },
            { label: '2 – 5 years', value: '2_5_years', message: '💪 Strong track record — expect sharper rates and higher limits.' },
            { label: '5+ years', value: '5_plus_years', message: '🏆 5+ years trading — lenders love that track record. Expect our sharpest rates.' },
        ],
    },
    {
        id: 'homeowner', type: 'choice',
        question: 'Are You a Property Owner?',
        options: [
            {
                label: 'Yes', value: 'yes',
                message: "🏠 Being a property owner can unlock lower rates and higher limits — even when it's not used as security.",
                reveal: [{ id: 'property_value', label: 'Estimated Property Value (optional)', type: 'currency', placeholder: 'e.g. 650000' }],
            },
            { label: 'No', value: 'no', message: '👍 No problem — most of our facilities are approved on trading performance alone, no property required.' },
        ],
    },
    {
        id: 'eligibility', type: 'group',
        question: 'A Few Quick Checks',
        helper: 'No wrong answers — this just helps us match you with the right lender.',
        fields: [
            {
                id: 'citizen', label: 'Australian Citizen or Permanent Resident?',
                options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no', message: "This may limit some lenders, but let's see what's possible." }],
            },
            {
                id: 'abn', label: 'Active ABN?',
                options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no', message: "You'll need an active ABN to apply through our panel right now." }],
            },
            {
                id: 'defaults', label: 'Any Defaults or Adverse Credit?',
                options: [{ label: 'Yes', value: 'yes', message: 'No stress — this is common and we have lenders on our panel comfortable with it.' }, { label: 'No', value: 'no' }],
            },
        ],
        // Hard gate — an active ABN is required by every lender on our current panel.
        // Citizen/PR and "any defaults" are intentionally NOT disqualifiers — soft qualifiers only.
        disqualify: a => a.abn === 'no',
        disqualifyReason: () => "you'll need an active ABN",
    },
    {
        id: 'urgency', type: 'choice',
        question: 'How Soon Do You Need the Funds?',
        options: [
            { label: 'Urgent — I need funds today', value: 'urgent', message: '⚡ We prioritise urgent deals — same day funding is possible.' },
            { label: 'Fast — within 24–48 hours', value: 'fast', message: '👍 We move quickly — most clients hear back within 1-2 hours.' },
            { label: 'Planning — within the next 7 days', value: 'planning', message: '📅 Good timing — this gives us room to shop your deal across the full panel.' },
            { label: 'Just exploring my options', value: 'exploring', message: "🔍 No pressure — we'll show you what's possible so you're ready when you need it." },
        ],
    },
    {
        id: 'contact_name', type: 'group',
        question: "Almost Done — What's Your Name?",
        fields: [
            { id: 'first_name', label: 'First Name', type: 'text', placeholder: 'First name', autocomplete: 'given-name' },
            { id: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Last name', autocomplete: 'family-name' },
            { id: 'company', label: 'Registered Business Name', type: 'abn-lookup', placeholder: 'Start typing your business name…', autocomplete: 'off' },
        ],
    },
    {
        id: 'contact_details', type: 'group', isLast: true,
        question: 'Last Step — How Do We Reach You?',
        helper: "We'll call you with your options — no spam, no obligation.",
        fields: [
            { id: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '04XX XXX XXX', autocomplete: 'tel' },
            { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@business.com.au', autocomplete: 'email' },
        ],
    },
];

// ── State ────────────────────────────────────────────────────────────────
let currentStep = 0;
const answers = {};

// ── UTM / fbclid capture ────────────────────────────────────────────────
function captureTracking() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || '',
        fbclid: params.get('fbclid') || '',
    };
}

// ── DOM refs ─────────────────────────────────────────────────────────────
const bodyEl = document.getElementById('lpFormBody');
const progressBar = document.getElementById('lpProgressBar');
const progressLabel = document.getElementById('lpProgressLabel');

function iconSvg(name) {
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}
function formatCurrency(v) {
    return '$' + Number(v).toLocaleString('en-AU');
}
function tierFor(tiers, value) {
    return tiers.find(t => value <= t.max) || tiers[tiers.length - 1];
}

function renderStep(index) {
    const step = LP_STEPS[index];
    bodyEl.innerHTML = '';

    const stepEl = document.createElement('div');
    stepEl.className = 'lp-step is-active';

    const q = document.createElement('p');
    q.className = 'lp-step__question';
    q.textContent = step.question;
    stepEl.appendChild(q);

    if (step.helper) {
        const h = document.createElement('div');
        h.className = 'lp-step__helper';
        h.textContent = step.helper;
        stepEl.appendChild(h);
    }

    const body = document.createElement('div');

    if (step.type === 'icon-grid') {
        body.className = 'lp-icon-grid';
        step.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'lp-icon-btn';
            btn.innerHTML = `${iconSvg(opt.icon)}<span>${opt.label}</span>`;
            if (answers[step.id] === opt.value) btn.classList.add('is-selected');
            btn.addEventListener('click', () => {
                answers[step.id] = opt.value;
                goNext();
            });
            body.appendChild(btn);
        });
        stepEl.appendChild(body);
        appendFooter(stepEl, step, index, false);

    } else if (step.type === 'slider') {
        renderSliderStep(stepEl, body, step, index);

    } else if (step.type === 'choice') {
        renderChoiceStep(stepEl, body, step, index);

    } else if (step.type === 'group') {
        renderGroupStep(stepEl, body, step, index);
    }

    bodyEl.appendChild(stepEl);

    stepEl.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); handleGroupAdvance(step); }
        });
    });
    const firstInput = stepEl.querySelector('input:not([type=range])');
    if (firstInput) firstInput.focus({ preventScroll: true });

    updateProgress(index);
}

// ── Slider step ──────────────────────────────────────────────────────────
function renderSliderStep(stepEl, body, step, index) {
    const current = answers[step.id] !== undefined ? Number(answers[step.id]) : step.default;
    body.className = 'lp-slider-wrap';
    body.innerHTML = `
        <p class="lp-slider-label">Approx. ${step.id === 'revenue' ? 'monthly revenue' : 'loan amount'}</p>
        <p class="lp-slider-value" id="lpSliderValue">${formatCurrency(current)}</p>
        <input type="range" class="lp-slider-input" id="lpSliderInput"
               min="${step.min}" max="${step.max}" step="${step.step}" value="${current}" />
        <div class="lp-slider-minmax">
            <span>${step.minLabel}</span>
            <span>${step.maxLabel}</span>
        </div>
        <div class="lp-tier-message" id="lpTierMessage"></div>
    `;
    stepEl.appendChild(body);

    const rangeInput = body.querySelector('#lpSliderInput');
    const valueEl = body.querySelector('#lpSliderValue');
    const tierEl = body.querySelector('#lpTierMessage');

    function updateTierMessage(val) {
        const tier = tierFor(step.tiers, val);
        tierEl.innerHTML = `<span class="lp-tier-message__emoji">${tier.emoji}</span><span>${tier.text}</span>`;
    }
    updateTierMessage(current);
    updateSliderFill(rangeInput);

    rangeInput.addEventListener('input', () => {
        const val = Number(rangeInput.value);
        valueEl.textContent = val >= step.max ? formatCurrency(step.max) + '+' : formatCurrency(val);
        updateTierMessage(val);
        updateSliderFill(rangeInput);
        answers[step.id] = val;
    });
    answers[step.id] = current;

    appendFooter(stepEl, step, index, true, () => {
        goNext();
    });
}
function updateSliderFill(rangeInput) {
    const pct = ((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
    rangeInput.style.setProperty('--fill', pct + '%');
}

// ── Choice step (per-option message + optional reveal fields) ─────────────
function renderChoiceStep(stepEl, body, step, index) {
    body.className = 'lp-choices';
    step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lp-choice-btn';
        btn.textContent = opt.label;
        if (answers[step.id] === opt.value) btn.classList.add('is-selected');
        btn.addEventListener('click', () => selectChoice(step, opt, stepEl, body, index));
        body.appendChild(btn);
    });
    stepEl.appendChild(body);

    // If already answered (e.g. navigating back), restore the message/reveal/footer state
    const existing = step.options.find(o => o.value === answers[step.id]);
    if (existing) {
        showChoiceMessage(step, existing, stepEl, index);
    } else {
        appendFooter(stepEl, step, index, false);
    }
}
function selectChoice(step, opt, stepEl, body, index) {
    answers[step.id] = opt.value;
    [...body.children].forEach(btn => btn.classList.toggle('is-selected', btn.textContent === opt.label));

    if (opt.message || (opt.reveal && opt.reveal.length)) {
        showChoiceMessage(step, opt, stepEl, index);
    } else {
        goNext();
    }
}
function showChoiceMessage(step, opt, stepEl, index) {
    // Remove any previous message/reveal/footer so re-selecting an option refreshes cleanly
    stepEl.querySelectorAll('.lp-tier-message, .lp-reveal-fields, .lp-step__footer').forEach(el => el.remove());

    if (opt.message) {
        const msg = document.createElement('div');
        msg.className = 'lp-tier-message';
        msg.innerHTML = `<span>${opt.message}</span>`;
        stepEl.appendChild(msg);
    }
    if (opt.reveal && opt.reveal.length) {
        const reveal = document.createElement('div');
        reveal.className = 'lp-reveal-fields';
        opt.reveal.forEach(f => {
            const wrap = document.createElement('div');
            wrap.className = 'lp-field';
            wrap.innerHTML = `
                <label for="lpInput_${f.id}">${f.label}</label>
                ${f.type === 'currency'
                    ? `<div class="lp-currency-wrap"><span>$</span><input type="number" class="lp-input" id="lpInput_${f.id}" placeholder="${f.placeholder || ''}" value="${answers[f.id] || ''}" min="0" /></div>`
                    : `<input type="text" class="lp-input" id="lpInput_${f.id}" placeholder="${f.placeholder || ''}" value="${answers[f.id] || ''}" />`}
            `;
            reveal.appendChild(wrap);
        });
        stepEl.appendChild(reveal);
    }
    appendFooter(stepEl, step, index, false, () => {
        if (opt.reveal) {
            opt.reveal.forEach(f => {
                const el = document.getElementById(`lpInput_${f.id}`);
                if (el) answers[f.id] = el.value.trim();
            });
        }
        goNext();
    }, true);
}

// ── Group step (multiple sub-fields, one shared message area) ─────────────
function renderGroupStep(stepEl, body, step, index) {
    body.className = 'lp-group';
    const messageBox = document.createElement('div');
    messageBox.className = 'lp-tier-message';
    messageBox.id = 'lpGroupMessage';
    messageBox.style.display = 'none';

    step.fields.forEach(field => {
        const row = document.createElement('div');
        if (field.options) {
            // Toggle-style field (Yes/No pills)
            row.className = 'lp-group-field';
            const label = document.createElement('p');
            label.className = 'lp-group-field__label';
            label.textContent = field.label;
            row.appendChild(label);

            const toggles = document.createElement('div');
            toggles.className = 'lp-toggle-row';
            field.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'lp-toggle-btn';
                btn.textContent = opt.label;
                if (answers[field.id] === opt.value) btn.classList.add('is-selected');
                btn.addEventListener('click', () => {
                    answers[field.id] = opt.value;
                    [...toggles.children].forEach(b => b.classList.toggle('is-selected', b === btn));
                    if (opt.message) {
                        messageBox.innerHTML = `<span>${opt.message}</span>`;
                        messageBox.style.display = '';
                    } else {
                        messageBox.style.display = 'none';
                    }
                });
                toggles.appendChild(btn);
            });
            row.appendChild(toggles);
        } else if (field.type === 'abn-lookup') {
            row.className = 'lp-field lp-abn-field';
            row.innerHTML = `
                <label for="lpInput_${field.id}">${field.label}</label>
                <div class="lp-abn-wrap">
                    <input type="text" class="lp-input" id="lpInput_${field.id}"
                           placeholder="${field.placeholder || ''}" value="${answers[field.id] || ''}"
                           autocomplete="${field.autocomplete || 'off'}" />
                    <ul class="lp-abn-dropdown" id="lpAbnDropdown_${field.id}" hidden></ul>
                </div>
                <p class="lp-abn-hint">Can't find it? Just type your business name and continue.</p>
                <p class="lp-form-error" id="lpError_${field.id}">Please check this field.</p>
            `;
            body.appendChild(row);
            // Scoped lookups (row.querySelector) work on detached nodes — document.getElementById
            // would not, since this whole step subtree isn't attached to the live DOM yet.
            wireAbnLookup(
                field.id,
                row.querySelector(`#lpInput_${field.id}`),
                row.querySelector(`#lpAbnDropdown_${field.id}`)
            );
            return;
        } else {
            // Text-style field
            row.className = 'lp-field';
            row.innerHTML = `
                <label for="lpInput_${field.id}">${field.label}</label>
                <input type="${field.type}" class="lp-input" id="lpInput_${field.id}"
                       placeholder="${field.placeholder || ''}" value="${answers[field.id] || ''}"
                       autocomplete="${field.autocomplete || ''}" />
                <p class="lp-form-error" id="lpError_${field.id}">Please check this field.</p>
            `;
        }
        body.appendChild(row);
    });

    body.appendChild(messageBox);
    stepEl.appendChild(body);
    appendFooter(stepEl, step, index, false, () => handleGroupAdvance(step), false, step.isLast);
}

// ── ABN Lookup autocomplete ────────────────────────────────────────────────
// Searches the Australian Business Register (abr.business.gov.au) by partial
// business name via the /api/abn-lookup proxy (keeps the ABR GUID server-side).
// See api/abn-lookup.js for the setup required before this returns real results.
const ABN_LOOKUP_ENDPOINT = '/api/abn-lookup';

function wireAbnLookup(fieldId, input, dropdown) {
    let debounceTimer = null;
    let activeRequestId = 0;

    function closeDropdown() {
        dropdown.hidden = true;
        dropdown.innerHTML = '';
    }

    function renderResults(results, query) {
        if (!results.length) {
            dropdown.innerHTML = `<li class="lp-abn-dropdown__empty">No matches for "${query}" — you can still type it in manually.</li>`;
            dropdown.hidden = false;
            return;
        }
        dropdown.innerHTML = results.map((r, i) => `
            <li class="lp-abn-dropdown__item" data-idx="${i}">
                <span class="lp-abn-dropdown__name">${r.name}</span>
                <span class="lp-abn-dropdown__meta">ABN ${r.abn}${r.state ? ' · ' + r.state : ''}</span>
            </li>
        `).join('');
        dropdown.hidden = false;
        dropdown.querySelectorAll('.lp-abn-dropdown__item').forEach(li => {
            li.addEventListener('click', () => {
                const r = results[Number(li.dataset.idx)];
                input.value = r.name;
                answers[fieldId] = r.name;
                answers[`${fieldId}_abn`] = r.abn;
                closeDropdown();
            });
        });
    }

    input.addEventListener('input', () => {
        answers[fieldId] = input.value.trim();
        delete answers[`${fieldId}_abn`]; // typing manually invalidates a previous dropdown selection
        clearTimeout(debounceTimer);

        const query = input.value.trim();
        if (query.length < 3) { closeDropdown(); return; }

        debounceTimer = setTimeout(() => {
            const requestId = ++activeRequestId;
            dropdown.innerHTML = `<li class="lp-abn-dropdown__loading">Searching ABN Lookup…</li>`;
            dropdown.hidden = false;

            fetch(`${ABN_LOOKUP_ENDPOINT}?name=${encodeURIComponent(query)}`)
                .then(res => (res.ok ? res.json() : { results: [] }))
                .then(data => {
                    if (requestId !== activeRequestId) return; // a newer keystroke superseded this response
                    renderResults(data.results || [], query);
                })
                .catch(() => {
                    if (requestId !== activeRequestId) return;
                    closeDropdown(); // fail silently — they can still type the business name manually
                });
        }, 350);
    });

    document.addEventListener('click', e => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) closeDropdown();
    });
}

function handleGroupAdvance(step) {
    if (step.type !== 'group') return;
    let valid = true;
    let firstInvalid = null;

    step.fields.forEach(field => {
        if (field.options) {
            if (!answers[field.id]) { valid = false; if (!firstInvalid) firstInvalid = field.id; }
            return;
        }
        const input = document.getElementById(`lpInput_${field.id}`);
        const errorEl = document.getElementById(`lpError_${field.id}`);
        const val = input.value.trim();
        let fieldValid;
        if (field.type === 'email') fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        else if (field.type === 'tel') fieldValid = val.replace(/\D/g, '').length >= 8;
        else fieldValid = val !== '';

        if (!fieldValid) {
            valid = false;
            if (errorEl) errorEl.classList.add('is-visible');
            if (!firstInvalid) firstInvalid = field.id;
        } else {
            if (errorEl) errorEl.classList.remove('is-visible');
            answers[field.id] = val;
        }
    });

    if (!valid) {
        const el = document.getElementById(`lpInput_${firstInvalid}`);
        if (el) el.focus();
        return;
    }

    if (step.disqualify && step.disqualify(answers)) {
        showDisqualified(step);
        return;
    }

    if (step.isLast) {
        submitLead();
    } else {
        goNext();
    }
}

// ── Disqualification exit screen ────────────────────────────────────────
// Shown when a hard-gate step (see `disqualify` on the step config) fails.
// Gives the user a way back in case of a misclick, and an escape hatch to
// call directly in case a genuine edge case doesn't fit the simple rule.
function showDisqualified(step) {
    document.getElementById('lpProgressWrap').style.display = 'none';
    const reason = step.disqualifyReason ? step.disqualifyReason(answers) : 'you need to meet our current eligibility criteria';

    bodyEl.innerHTML = `
        <div class="lp-success">
            <div class="lp-success__icon lp-success__icon--info">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            </div>
            <p class="lp-success__title">We Can't Help Just Yet</p>
            <p class="lp-success__sub">Based on your answers, ${reason} to apply through our current lender panel.</p>

            <button type="button" class="lp-btn-back lp-disqualify__back" id="lpDisqualifyBack">← Go Back and Check My Answers</button>

            <p class="lp-disqualify__note">Think this doesn't apply to you? Call us on <a href="tel:1800845320">1800 845 320</a> — we may still be able to help.</p>

            <div class="lp-disqualify__notify" id="lpNotifyForm">
                <label for="lpNotifyEmail">Want us to let you know if this changes?</label>
                <div class="lp-disqualify__notify-row">
                    <input type="email" id="lpNotifyEmail" class="lp-input" placeholder="you@business.com.au" />
                    <button type="button" class="lp-btn-next" id="lpNotifyBtn">Notify Me</button>
                </div>
                <p class="lp-form-error" id="lpNotifyError">Please enter a valid email.</p>
            </div>
        </div>
    `;

    document.getElementById('lpDisqualifyBack').addEventListener('click', () => {
        renderStep(currentStep); // re-render the same eligibility step so they can change an answer
        document.getElementById('lpProgressWrap').style.display = '';
    });

    document.getElementById('lpNotifyBtn').addEventListener('click', () => {
        const emailInput = document.getElementById('lpNotifyEmail');
        const errorEl = document.getElementById('lpNotifyError');
        const email = emailInput.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorEl.classList.add('is-visible');
            return;
        }
        errorEl.classList.remove('is-visible');
        submitDisqualifiedLead(email, reason);
        document.getElementById('lpNotifyForm').innerHTML = `<p class="lp-disqualify__thanks">Thanks — we'll be in touch if this changes.</p>`;
    });
}
async function submitDisqualifiedLead(email, reason) {
    const payload = {
        first_name: 'Unknown',
        email,
        phone: '',
        status: 'disqualified',
        disqualify_reason: reason,
        loan_purpose: answers.purpose || '',
        landing_page: LP_CONFIG.landingPage,
        ...captureTracking(),
    };
    try {
        await fetch(LP_CONFIG.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error('Disqualified-lead notify submission failed:', err);
    }
}

// ── Shared footer (Back / Continue) ────────────────────────────────────────
function appendFooter(stepEl, step, index, alwaysShowContinue, onContinue, isChoiceReveal, isLast) {
    const footer = document.createElement('div');
    footer.className = 'lp-step__footer';

    if (index > 0) {
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'lp-btn-back';
        back.textContent = 'Back';
        back.addEventListener('click', goBack);
        footer.appendChild(back);
    }

    const needsContinue = step.type === 'slider' || step.type === 'group' || isChoiceReveal;
    if (needsContinue || alwaysShowContinue) {
        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'lp-btn-next';
        next.textContent = (step.isLast || isLast) ? 'Get My Free Assessment →' : 'Continue →';
        next.addEventListener('click', () => {
            if (onContinue) onContinue();
            else if (step.type === 'group') handleGroupAdvance(step);
        });
        footer.appendChild(next);
    }

    stepEl.appendChild(footer);
}

function goNext() {
    if (currentStep < LP_STEPS.length - 1) {
        currentStep++;
        renderStep(currentStep);
    }
}
function goBack() {
    if (currentStep > 0) {
        currentStep--;
        renderStep(currentStep);
    }
}

function updateProgress(index) {
    const pct = Math.round(((index + 1) / LP_STEPS.length) * 100);
    progressBar.style.width = pct + '%';
    progressLabel.textContent = `Step ${index + 1} of ${LP_STEPS.length}`;
}

// ── Submission ───────────────────────────────────────────────────────────
async function submitLead() {
    const nextBtn = bodyEl.querySelector('.lp-btn-next');
    if (nextBtn) { nextBtn.disabled = true; nextBtn.textContent = 'Submitting…'; }

    const payload = {
        first_name: answers.first_name || '',
        last_name: answers.last_name || '',
        email: answers.email || '',
        phone: answers.mobile || '',
        company_name: answers.company || '',
        company_abn: answers.company_abn || '',
        loan_purpose: answers.purpose || '',
        loan_amount: answers.amount || '',
        monthly_revenue: answers.revenue || '',
        trading_months: answers.trading_months || '',
        is_citizen_or_pr: answers.citizen || '',
        has_abn: answers.abn || '',
        is_property_owner: answers.homeowner || '',
        property_value: answers.property_value || '',
        has_defaults: answers.defaults || '',
        urgency: answers.urgency || '',
        status: 'qualified',
        landing_page: LP_CONFIG.landingPage,
        ...captureTracking(),
    };

    try {
        await fetch(LP_CONFIG.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error('Lead submission failed:', err);
    }

    // Meta Pixel / conversion event, if present on the page
    if (typeof fbq === 'function') {
        try { fbq('track', 'Lead'); } catch (e) { /* pixel not configured */ }
    }

    showSuccess();
}

function showSuccess() {
    document.getElementById('lpProgressWrap').style.display = 'none';
    bodyEl.innerHTML = `
        <div class="lp-success">
            <div class="lp-success__icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            <p class="lp-success__title">Thanks, ${answers.first_name || 'there'} — you're all set.</p>
            <p class="lp-success__sub">A funding specialist will call you within 1-2 hours to talk through your options. No obligation, no cost.</p>
            <a href="tel:1800845320" class="lp-btn-next" style="display:inline-flex;text-decoration:none;">Or Call Us Now: 1800 845 320</a>
        </div>
    `;
}

// ── Init ─────────────────────────────────────────────────────────────────
renderStep(0);

// ── FAQ accordion ────────────────────────────────────────────────────────
document.querySelectorAll('.lp-faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.lp-faq-item');
        const wasOpen = item.classList.contains('is-open');
        document.querySelectorAll('.lp-faq-item.is-open').forEach(i => i.classList.remove('is-open'));
        if (!wasOpen) item.classList.add('is-open');
    });
});

// ── "Check Eligibility" buttons scroll to the form (hero + mobile bar) ────
function scrollToForm() {
    const card = document.getElementById('lpFormCard');
    const headerEl = document.querySelector('.lp-header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;
    const extraBuffer = 24; // land a little higher so the step title + progress bar are visible, not just under the sticky header
    const targetY = card.getBoundingClientRect().top + window.scrollY - headerHeight - extraBuffer;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    const firstField = card.querySelector('input, button.lp-choice-btn, button.lp-icon-btn');
    if (firstField) setTimeout(() => firstField.focus({ preventScroll: true }), 400);
}
const mobileApplyBtn = document.getElementById('lpMobileApply');
if (mobileApplyBtn) mobileApplyBtn.addEventListener('click', scrollToForm);

const heroApplyBtn = document.getElementById('lpHeroApply');
if (heroApplyBtn) {
    heroApplyBtn.addEventListener('click', e => {
        e.preventDefault();
        scrollToForm();
    });
}

// ── Recent approvals slider — auto-advances through LP_DEALS ──────────────
(function initDealSlider() {
    const sliderEl = document.getElementById('lpDealSlider');
    const slideEl = document.getElementById('lpDealSlide');
    const dotsEl = document.getElementById('lpDealDots');
    if (!sliderEl || !slideEl || !dotsEl || LP_DEALS.length === 0) return;

    let dealIndex = 0;
    let timer = null;
    const INTERVAL_MS = 5000;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderDeal(index) {
        const deal = LP_DEALS[index];
        slideEl.classList.remove('lp-hero__deal-slide');
        void slideEl.offsetWidth; // restart fade animation
        slideEl.classList.add('lp-hero__deal-slide');
        slideEl.innerHTML = `
            <div class="lp-hero__deal-head">
                <span class="lp-hero__deal-tag">Recent Approval</span>
                <span class="lp-hero__deal-date">${formatRelativeDate(deal.daysAgo)}</span>
            </div>
            <p class="lp-hero__deal-text"><strong>${deal.amount}</strong> ${deal.product} ${deal.description}</p>
        `;
        [...dotsEl.children].forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }

    LP_DEALS.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => { dealIndex = i; renderDeal(dealIndex); resetTimer(); });
        dotsEl.appendChild(dot);
    });

    function advance() {
        dealIndex = (dealIndex + 1) % LP_DEALS.length;
        renderDeal(dealIndex);
    }
    function startTimer() {
        if (prefersReducedMotion) return;
        timer = setInterval(advance, INTERVAL_MS);
    }
    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    renderDeal(0);
    startTimer();

    // Pause while the user is looking at it, resume on mouse-leave
    sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
    sliderEl.addEventListener('mouseleave', startTimer);
})();

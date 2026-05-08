/* ============================================================
   MOHD ANAS PORTFOLIO — script.js
   Features:
   - Typed text animation (hero role)
   - Scroll-triggered reveal animations
   - Nav scroll behavior + active link highlight
   - Hamburger menu toggle
   - Skill bar fill animation
   - Contact form validation + mailto submission
   - Back to top button
   ============================================================ */

'use strict';

// ===== CONFIGURATION =====
// CUSTOMIZATION: Change YOUR_EMAIL to receive form submissions
const CONFIG = {
  email: 'mohdanas9595@gmail.com',

  // Typed role strings — CUSTOMIZE these to change the hero text rotation
  typedStrings: [
    'Backend Engineer',
    'AI Automation Engineer',
    'LLM Systems Builder',
    'RAG Pipeline Architect',
  ],

  // OPTIONAL: EmailJS config — fill these in to use EmailJS instead of mailto
  // 1. Create account at https://emailjs.com
  // 2. Uncomment the EmailJS script in index.html
  // 3. Fill in the values below
  emailjs: {
    serviceId:  'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey:  'YOUR_PUBLIC_KEY',
    enabled:    false, // Set to true after configuring EmailJS
  }
};

// ===== DOM REFERENCES =====
const nav        = document.querySelector('.nav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.nav__mobile-link');
const backToTop  = document.getElementById('back-to-top');
const typedEl    = document.getElementById('typed-role');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn  = document.getElementById('submit-btn');

/* ─────────────────────────────────────────────
   1. TYPED TEXT ANIMATION
   Cycles through CONFIG.typedStrings in the hero
───────────────────────────────────────────── */
(function initTyped() {
  if (!typedEl) return;

  let stringIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  const SPEED_TYPE   = 75;   // ms per character typed
  const SPEED_DELETE = 40;   // ms per character deleted
  const PAUSE_END    = 2000; // pause at end of string
  const PAUSE_START  = 400;  // pause before typing next

  function type() {
    const current = CONFIG.typedStrings[stringIndex];

    if (!isDeleting) {
      // Add next character
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        // Finished typing — pause before deleting
        isDeleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      // Remove last character
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        // Move to next string
        isDeleting = false;
        stringIndex = (stringIndex + 1) % CONFIG.typedStrings.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }

    setTimeout(type, isDeleting ? SPEED_DELETE : SPEED_TYPE);
  }

  // Start with a small delay
  setTimeout(type, 800);
})();

/* ─────────────────────────────────────────────
   2. NAVIGATION: Scroll state + active section
───────────────────────────────────────────── */
(function initNav() {
  // Toggle scrolled class for glass-morphism nav
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActive() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
})();

/* ─────────────────────────────────────────────
   3. HAMBURGER MENU
───────────────────────────────────────────── */
(function initHamburger() {
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ─────────────────────────────────────────────
   4. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver for performance
───────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation to free memory
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────
   5. SKILL BAR ANIMATIONS
   Triggers when skill bars scroll into view
───────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-item__fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-width');
          // Slight delay for visual polish
          setTimeout(() => {
            fill.style.width = `${targetWidth}%`;
          }, 200);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
})();

/* ─────────────────────────────────────────────
   6. CONTACT FORM
   Validation + mailto fallback (or EmailJS if configured)
───────────────────────────────────────────── */
(function initContactForm() {
  if (!contactForm) return;

  // Helper: show/clear error
  function setError(fieldId, msg) {
    const errEl = document.getElementById(`${fieldId}-error`);
    const input = document.getElementById(fieldId);
    if (!errEl || !input) return;
    errEl.textContent = msg;
    input.classList.toggle('error', !!msg);
  }

  function clearErrors() {
    ['name', 'email', 'message'].forEach(id => setError(id, ''));
  }

  // Validate a single email address format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Validate all form fields; returns true if valid
  function validateForm(name, email, message) {
    let valid = true;
    clearErrors();

    if (!name.trim()) {
      setError('name', '↑ Name is required');
      valid = false;
    }
    if (!email.trim()) {
      setError('email', '↑ Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('email', '↑ Please enter a valid email address');
      valid = false;
    }
    if (!message.trim()) {
      setError('message', '↑ Message is required');
      valid = false;
    } else if (message.trim().length < 10) {
      setError('message', '↑ Message must be at least 10 characters');
      valid = false;
    }

    return valid;
  }

  // Submit via EmailJS (if configured)
  async function sendWithEmailJS(name, email, message) {
    const { serviceId, templateId, publicKey } = CONFIG.emailjs;
    await window.emailjs.init(publicKey);
    return window.emailjs.send(serviceId, templateId, {
      from_name: name,
      from_email: email,
      message: message,
      to_email: CONFIG.email,
    });
  }

  // Fallback: open user's default mail client
  function sendWithMailto(name, email, message) {
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  }

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name    = document.getElementById('name').value;
    const email   = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!validateForm(name, email, message)) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    formSuccess.textContent = '';

    try {
      if (CONFIG.emailjs.enabled && window.emailjs) {
        // EmailJS path
        await sendWithEmailJS(name, email, message);
        formSuccess.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        contactForm.reset();
      } else {
        // Mailto fallback
        sendWithMailto(name, email, message);
        formSuccess.textContent = '✓ Your mail client should open. If not, email me directly at ' + CONFIG.email;
      }
    } catch (err) {
      console.error('Form submission error:', err);
      formSuccess.style.color = 'var(--error)';
      formSuccess.textContent = '✕ Something went wrong. Please email me directly at ' + CONFIG.email;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    }
  });

  // Real-time validation: clear error on input
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => setError(id, ''));
  });
})();

/* ─────────────────────────────────────────────
   7. BACK TO TOP BUTTON
───────────────────────────────────────────── */
(function initBackToTop() {
  if (!backToTop) return;
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────────
   8. SMOOTH ANCHOR SCROLL
   Ensures smooth scroll for all in-page links
───────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─────────────────────────────────────────────
   9. ACTIVE NAV LINK STYLING
   CSS class for the active state
───────────────────────────────────────────── */
// Inject CSS for active nav link dynamically
(function injectActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav__link.active {
      color: var(--accent) !important;
    }
    .nav__link.active::after {
      transform: scaleX(1) !important;
    }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────────
   10. PROJECT MODAL
   Full problem / solution / impact breakdown
───────────────────────────────────────────── */
const PROJECT_DATA = {
  'arc': {
    icon: 'fa-wand-magic-sparkles',
    internal: true,
    badgeText: 'Internal &middot; Teradata &middot; In Progress',
    title: 'ARC (Autonomous Remediation Code-fix) Agent',
    problem: 'Engineering teams spend hours manually diagnosing Jira bug tickets, reading code, writing fixes, creating PRs, and waiting for reviews. Most of this is repetitive — especially for well-scoped tickets with clear stack traces or error descriptions. The earlier AEA prototype proved the concept; ARC is the production-grade evolution built for Teradata\'s multi-language codebase.',
    solution: [
      'Jira webhooks trigger the pipeline automatically — the agent classifies the ticket, extracts error details, identifies affected files, and determines if it\'s a candidate for autonomous remediation',
      'Past fixes are embedded and stored in PostgreSQL + pgvector; the agent retrieves similar historical resolutions via RAG to guide the current fix — learning from what worked before',
      'Shallow-clones the target repo and performs static analysis using Tree-sitter AST parsing across Python, Java, Groovy, and YAML files — extracts every symbol (class, function), import statement, and qualified method call to build a full dependency graph with 600+ edges',
      'Assembles context in tiers instead of dumping the full repo into the LLM: target files → full source; direct dependencies → full source; direct dependents → signatures only; transitive connections → file names only — reducing token usage by ~60%',
      'The fix is committed to a branch and a GitHub PR is opened automatically; a CI sidecar runs the test suite — if tests fail, failure logs are fed back to the LLM for a self-healing retry loop across multiple iterations until tests pass and the PR auto-merges (L3 in active development)',
    ],
    impact: ['700+ file repos parsed in <30s', '~60% token reduction via tiered context', 'Language-agnostic AST plugin model', 'Self-healing CI retry loop (in progress)'],
    tech: ['Python', 'FastAPI', 'LangChain', 'LangGraph', 'Tree-sitter', 'PostgreSQL', 'pgvector', 'Docker', 'Kubernetes', 'GitHub API', 'Jira API', 'sentence-transformers'],
    diagram: 'arc-architecture.svg',
  },
  'ai-migration': {
    icon: 'fa-database',
    internal: false,
    badgeText: 'Nexyom &middot; In Progress',
    badgeClass: 'badge--consultancy',
    title: 'AI Migration Studio',
    problem: 'Migrating data between incompatible platforms (e.g., Cherwell → ServiceNow, PostgreSQL → Snowflake, Teradata → Snowflake) requires manual schema discovery, field mapping, and artifact generation — a tedious, error-prone process that doesn\u2019t scale when every source/target pair demands a new migration playbook.',
    solution: [
      'Designing a multi-agent pipeline using LangGraph where specialized AI agents handle each migration stage — discovery, schema analysis, field mapping, conversion, validation, and deployment artifact generation',
      'Building a pluggable adapter architecture supporting multiple source/target dialects — currently focused on Cherwell → ServiceNow incident ticket migration, with PostgreSQL → Snowflake and Teradata adapters planned',
      'Engineering a hybrid deterministic + LLM approach: YAML rulebooks handle standard type/field mappings reliably, LLM tool-calling resolves ambiguous edge cases, with graceful degradation to heuristic mode when LLM is unavailable',
      'Building a real-time agent dashboard in Next.js 14 streaming live agent reasoning traces via WebSocket, with agents displayed as business personas for stakeholder transparency',
    ],
    impact: ['Multi-agent migration pipeline', 'Pluggable multi-dialect adapters', 'Hybrid deterministic + LLM architecture', 'Real-time agent dashboard'],
    tech: ['LangGraph', 'Next.js 14', 'React 18', 'TypeScript', 'FastAPI', 'Python', 'sqlglot', 'LiteLLM', 'WebSocket', 'Docker', 'ServiceNow API', 'TailwindCSS'],
    diagram: 'ai-migration-architecture.svg',
  },
  'aea': {
    icon: 'fa-code-pull-request',
    internal: false,
    badgeText: 'Personal &middot; Completed',
    repoUrl: 'https://github.com/Anxs-11/autonomous-engineering-agent',
    title: 'Autonomous Engineering Agent (AEA)',
    problem: 'Every Jira ticket describing a feature or bug fix requires a developer to manually read the ticket, understand the codebase, write the code, and open a PR — a high-friction loop that is almost entirely automatable with the right AI pipeline.',
    solution: [
      'Built a FastAPI webhook server that receives real-time Jira events and uses Claude to classify tickets as automatable, needs clarification, too complex, or non-code related — posting targeted clarifying questions as Jira comments when a ticket is vague',
      'Engineered a two-pass code generation system: Pass 1 asks Claude to identify relevant files from the full repository tree; Pass 2 feeds those full file contents to Claude for context-aware code generation — solving the file-blindness problem of naive chunk-based RAG',
      'Automated the full GitHub PR lifecycle — feature branch creation, multi-file commits with real code changes, and PR opening — via the GitHub REST API, with zero developer code written',
      'Implemented stateful ticket lifecycle tracking (SQLite + SQLAlchemy) with state transitions (AWAITING_CLARIFICATION → AUTOMATABLE → PR created), duplicate webhook protection, and a retry mechanism via the aea-retry Jira label',
      'Designed label-based repo routing: the target GitHub repository is read from a repo:owner/name Jira label, making the agent flexible across multiple projects without any configuration changes'
    ],
    impact: ['Zero developer code written end-to-end', 'Jira ticket → mergeable GitHub PR autonomously', 'Multi-repo routing via Jira labels'],
    tech: ['FastAPI', 'Claude (Anthropic)', 'GitHub REST API', 'Jira REST API', 'SQLite', 'SQLAlchemy', 'Python 3.14', 'uvicorn'],
    diagram: 'aea-architecture.svg',
  },
  'ticket-deflection': {
    icon: 'fa-ticket',
    internal: true,
    title: 'AI Ticket Deflection System',
    problem: 'An internal support portal serving 40+ component areas (AWS, Tempo, PE, Jira, and more) was overwhelmed by high ticket volume. Most self-service requests could be resolved without human intervention, but there was no automated triage or resolution layer — every ticket landed with the support team regardless.',
    solution: [
      'Built an LLM-powered normalisation layer that strips customer-specific details (account numbers, owner names, etc.) from each request before classification — converting "please provide access to AWS account AW786" into a generic "aws account access requested"',
      'Classified normalised requests using a HuggingFace embeddings model with a RAG approach: each of the 40 components has 100 labelled admin-intervention samples and 100 self-service samples; the model picks the closest match above a confidence threshold of 75',
      'For admin requests, the system automatically creates a Jira support ticket and routes it to the support team with full context — no manual triage needed',
      'For self-service requests, an MCP Jira tool runs 10–20 iterations with different JQL queries to find the top 3–4 semantically similar resolved tickets; an LLM reads their comments (wiki links, redirects, how-to steps) to synthesise a final answer delivered directly to the user',
    ],
    impact: ['40% support volume automated', '15+ engineering hours saved/week', 'Duplicate & self-service tickets eliminated'],
    tech: ['HuggingFace', 'RAG', 'Embeddings', 'MCP', 'Jira API', 'LangChain', 'Python', 'FastAPI'],
    diagram: 'ticket-deflection-architecture.svg',
  },
  'text-to-sql': {
    icon: 'fa-code',
    internal: true,
    title: 'Text-to-SQL Engine',
    problem: 'Analysts needed to query complex Teradata databases without SQL expertise, but baseline LLM prompts were expensive and inaccurate — passing full schemas drove up token costs and confused the model with irrelevant tables.',
    solution: [
      'Built a RAG-powered intent detection layer that identifies the request type and selects only the relevant tables from the knowledge base — matching the query pattern to pre-indexed request samples without exposing the full schema',
      'Implemented a schema chunking strategy that fetches and passes only selected table schemas in chunks, eliminating noise from full schema dumps and reducing LLM token consumption by 35%',
      'Engineered a Teradata-specific SQL generation prompt with enforced syntax rules (QUALIFY, TOP N, CAST differences) and few-shot examples tuned for complex join patterns and aggregations',
      'Added an EXPLAIN keyword validation layer that runs the generated SQL through Teradata\'s query planner before execution — catching syntax errors without reading any data, with automatic regeneration on failure',
    ],
    impact: ['35% reduction in LLM token consumption', 'Self-serve data access for non-technical users', 'Higher accuracy on multi-table joins via RAG intent detection'],
    tech: ['Python', 'LLM', 'RAG', 'Teradata SQL', 'Prompt Engineering', 'FastAPI', 'Embeddings'],
    diagram: 'text-to-sql-architecture.svg',
  },
  'ai-agents': {
    icon: 'fa-robot',
    internal: true,
    title: 'Autonomous Enterprise AI Agents',
    problem: 'Operations like Jira ticket creation, Confluence page updates, and approval workflows required constant context switching between tools, fragmenting focus and slowing execution.',
    solution: [
      'Built autonomous agents integrated with Jira and Confluence REST APIs via LangChain tool-calling, handling multi-step workflows from a single input',
      'Deployed agent interfaces directly inside Slack and Microsoft Teams so users interact in natural language with zero app switching',
      'Implemented intent detection and parameter extraction to support chained operations like "create a Jira ticket and link the Confluence spec"',
    ],
    impact: ['Natural language enterprise operations', 'Jira + Confluence fully automated', 'Zero context switching for users'],
    tech: ['LangChain', 'Jira API', 'Confluence API', 'MS Teams', 'Slack', 'FastAPI', 'Python'],
  },
  'cicd-monitoring': {
    icon: 'fa-code-branch',
    internal: true,
    title: 'Enterprise CI/CD & Monitoring',
    problem: 'Token renewals, API synchronization, and stale-data detection were handled manually, consuming 6+ engineering hours per week with no systematic health reporting or audit trail.',
    solution: [
      'Automated token renewal and API sync via Jenkins pipelines on scheduled triggers, replacing all manual intervention',
      'Built a daily Playwright test suite covering critical user flows with results persisted to a database for trend analysis and alerting',
      'Productionized GitHub Actions image creation pipelines ensuring 99.9% environment consistency across all developer setups',
    ],
    impact: ['6+ hrs/week of manual ops eliminated', '99.9% environment consistency', 'Automated daily health reports'],
    tech: ['Jenkins', 'Playwright', 'GitHub Actions', 'Python', 'CI/CD'],
  },
  'workload-sync': {
    icon: 'fa-arrows-rotate',
    internal: true,
    title: 'Tempo Workload Sync Engine',
    problem: 'Workload schemas were manually synchronized with LOA source data, causing data drift, duplicate entries, and zero audit visibility for enterprise resource tracking.',
    solution: [
      'Built a backend service that automatically polls and synchronizes workload schemas with LOA data on a configurable schedule',
      'Implemented duplicate detection logic with configurable deduplication rules to prevent redundant entries silently accumulating',
      'Added per-sync rollback capability and daily audit trail logging for compliance, debugging, and executive reporting',
    ],
    impact: ['100% data accuracy achieved', 'Automatic rollback on sync failures', 'Full daily audit trail for compliance'],
    tech: ['Python', 'MongoDB', 'REST API', 'Audit Logs'],
  },
  'provisioning': {
    icon: 'fa-bolt',
    internal: true,
    title: 'Backend Provisioning Optimizer',
    problem: 'Cloud environment provisioning used a fully sequential execution model — each step blocked the next, resulting in 60-second setup times that slowed down the entire development cycle.',
    solution: [
      'Re-architected provisioning workflows with task isolation, identifying all independent steps and grouping them for parallel execution',
      'Replaced blocking sequential calls with async execution using Python asyncio and the Azure SDK',
      'Added per-task health checks and retry logic so isolated failures do not cascade and block the full provisioning chain',
    ],
    impact: ['75% faster provisioning (60s → 15s)', 'Parallel non-blocking execution', 'Resilient per-step retry logic'],
    tech: ['Python', 'Azure', 'Asyncio', 'System Design'],
  },
};

(function initProjectModal() {
  const overlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!overlay) return;

  function openModal(projectKey) {
    const data = PROJECT_DATA[projectKey];
    if (!data) return;

    document.getElementById('modal-icon').className = `fa-solid ${data.icon}`;
    document.getElementById('modal-title').textContent = data.title;
    const badgeEl = document.getElementById('modal-badge');
    if (data.internal && !data.badgeText) {
      badgeEl.className = 'badge--internal';
      badgeEl.innerHTML = '<i class="fa-solid fa-lock" aria-hidden="true"></i> Internal &middot; Teradata';
      badgeEl.style.display = '';
    } else if (data.internal && data.badgeText) {
      badgeEl.className = 'badge--internal';
      badgeEl.innerHTML = `<i class="fa-solid fa-lock" aria-hidden="true"></i> ${data.badgeText}`;
      badgeEl.style.display = '';
    } else if (data.badgeText) {
      badgeEl.className = data.badgeClass || 'badge--personal';
      const icon = data.badgeClass === 'badge--consultancy' ? 'fa-briefcase' : 'fa-flask';
      badgeEl.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i> ${data.badgeText}`;
      badgeEl.style.display = '';
    } else {
      badgeEl.style.display = 'none';
    }

    // GitHub repo link in modal header
    const existingRepoLink = document.getElementById('modal-repo-link');
    if (existingRepoLink) existingRepoLink.remove();
    if (data.repoUrl) {
      const repoLink = document.createElement('a');
      repoLink.id = 'modal-repo-link';
      repoLink.href = data.repoUrl;
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';
      repoLink.className = 'modal__repo-link';
      repoLink.setAttribute('aria-label', 'View on GitHub');
      repoLink.innerHTML = '<i class="fa-brands fa-github" aria-hidden="true"></i> View on GitHub';
      document.querySelector('.modal__header').appendChild(repoLink);
    }

    document.getElementById('modal-problem').textContent = data.problem;

    const solEl = document.getElementById('modal-solution');
    solEl.innerHTML = data.solution.map(s => `<li>${s}</li>`).join('');

    const impEl = document.getElementById('modal-impact');
    impEl.innerHTML = data.impact.map(i => `<span class="impact-badge">${i}</span>`).join('');

    const techEl = document.getElementById('modal-tech');
    techEl.innerHTML = data.tech.map(t => `<span class="tag">${t}</span>`).join('');

    const diagramSection = document.getElementById('modal-diagram-section');
    if (data.diagram) {
      document.getElementById('modal-diagram').src = data.diagram;
      diagramSection.style.display = '';
    } else {
      diagramSection.style.display = 'none';
    }

    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, 400);
  }

  document.querySelectorAll('.btn--details').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-project')));
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

# Mohd Anas — Portfolio Website

A modern, dark-theme personal portfolio built with HTML5, CSS3, and Vanilla JavaScript.

---

## 🗂️ File Structure

```
portfolio/
├── index.html     ← All HTML structure & content
├── style.css      ← All styles (variables, layout, components)
├── script.js      ← Interactivity (typed text, animations, form)
└── README.md      ← This file
```

---

## ✏️ Customization Guide

### 1. Personal Info (index.html)
- **Name / tagline** → Find `<h1 class="hero__name">` in the Hero section
- **Email / phone** → Search for `mohdanas9595@gmail.com` and `7534024294`
- **LinkedIn / GitHub** → Search for `linkedin.com` and `github.com/Anxs-11`

### 2. Typed Role Strings (script.js)
```js
typedStrings: [
  'Backend Engineer',
  'AI Automation Engineer',
  // Add or change any strings here
],
```

### 3. Projects (index.html)
Each project is an `<article class="project-card">`. To add a project:
1. Copy an existing `.project-card` block
2. Update: title, description, tech tags, GitHub link, impact badges

### 4. Skills (index.html + style.css)
- Add/remove `<span class="tag">` elements inside `.skill-tags`
- Change progress bar values: update `data-width="92"` and the `aria-valuenow`

### 5. Experience (index.html)
Each job is a `<article class="timeline__item">`. To add/remove:
1. Copy a `.timeline__item` block
2. Update company, role, period, bullet points, and tags
3. Remove the `<span class="timeline__line"></span>` from the last item's marker

### 6. Accent Color (style.css)
```css
:root {
  --accent: #00E5A0;  /* ← Change to any hex color */
}
```

### 7. Fonts
1. Change the `@import` URL in `<head>` of `index.html`
2. Update `--font-display`, `--font-body`, `--font-mono` in `:root` in `style.css`

---

## 📧 Contact Form Setup

### Option A: mailto (default, no setup needed)
The form already works — it opens the user's default email client.

### Option B: EmailJS (send without opening mail client)
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create a service & email template
3. In `index.html`, uncomment:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   ```
4. In `script.js`, update the `emailjs` config:
   ```js
   emailjs: {
     serviceId:  'service_xxxxxxx',
     templateId: 'template_xxxxxxx',
     publicKey:  'xxxxxxxxxxxxxx',
     enabled:    true,  // ← Set to true
   }
   ```
5. In your EmailJS template, use variables: `{{from_name}}`, `{{from_email}}`, `{{message}}`

---

## 🚀 Deployment

### GitHub Pages
1. Create a GitHub repo (e.g., `yourusername.github.io`)
2. Upload all 3 files to the repo root
3. Go to **Settings → Pages → Source: main branch / root**
4. Your site will be live at `https://yourusername.github.io`

### Netlify (Recommended — no build needed)
1. Go to [netlify.com](https://app.netlify.com/drop)
2. Drag and drop your `portfolio/` folder onto the page
3. Done! You'll get a live URL instantly
4. Optional: connect a custom domain in Site Settings

### Custom Domain
1. Buy a domain (Namecheap, Cloudflare, etc.)
2. In Netlify/GitHub Pages settings, add your custom domain
3. Update DNS records as instructed

---

## 🌟 Features

- Responsive mobile-first design with hamburger menu
- Smooth scroll reveal animations (IntersectionObserver)
- Animated skill progress bars
- Typed text rotation in the hero section
- Floating code card decoration
- Timeline-based experience section
- Contact form with full validation
- Back-to-top button
- Accessible semantic HTML with ARIA labels
- No frameworks or build tools required

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ArrowRight, Package, ShoppingBag, BadgeCheck,
  Link2, PenLine, Wallet, ChevronRight, CheckCircle2,
  Zap, Star,
} from 'lucide-vue-next'

// ── Waitlist form ─────────────────────────────────────────────────
const email      = ref('')
const submitted  = ref(false)
const submitting = ref(false)

async function submitWaitlist() {
  if (!email.value || submitting.value) return
  submitting.value = true
  // TODO: wire to your actual waitlist API
  await new Promise(r => setTimeout(r, 800))
  submitted.value  = true
  submitting.value = false
}

// ── Scroll reveal ─────────────────────────────────────────────────
let observer = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.classList.add('revealed')
          observer.unobserve(el.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
onUnmounted(() => observer?.disconnect())

// ── Static data ───────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'List your product',
    desc:  'Upload a photo, set your price, add variants. You get a clean shareable link in under 60 seconds.',
    tag:   'koomart.app/p/black-heels',
    icon:  Package,
  },
  {
    num: '02',
    title: 'Share the link anywhere',
    desc:  'Drop it in your WhatsApp status, IG bio, or DM. Buyers open the page and order without chatting you first.',
    tag:   'WhatsApp · Instagram · TikTok',
    icon:  Link2,
  },
  {
    num: '03',
    title: 'Orders land in your dashboard',
    desc:  'Name, phone, location, quantity — all there automatically. Mark payment. Add manual orders for DM customers.',
    tag:   'Zero setup. Just works.',
    icon:  ShoppingBag,
  },
]

const features = [
  {
    icon:  Package,
    title: 'Product listings',
    desc:  'Image, price, variants, availability status. One listing = one shareable link ready for social.',
  },
  {
    icon:  Link2,
    title: 'Shareable product pages',
    desc:  'Minimal buyer-facing page. Image, price, order button. Built for WhatsApp status and IG bio.',
  },
  {
    icon:  ShoppingBag,
    title: 'Buyer order form',
    desc:  'Buyers fill name, phone, location, quantity. Order hits your dashboard instantly. No DMs needed.',
  },
  {
    icon:  PenLine,
    title: 'Manual order entry',
    desc:  'Got a DM sale or offline customer? Add it yourself in seconds. Everything in one place.',
  },
  {
    icon:  Wallet,
    title: 'Payment tracking',
    desc:  'Mark orders as unpaid, paid, or pay on delivery. Simple manual tracking that actually works.',
  },
  {
    icon:  BadgeCheck,
    title: 'Order dashboard',
    desc:  'All your orders, search, filter by status. Built to handle the chaos of social selling at scale.',
  },
]

const mockOrders = [
  { id: '#KM-0041', name: 'Abena Mensah',  product: 'Black Heels · Size 40',   location: 'Kumasi',       amount: 'GH₵ 180', status: 'paid'    },
  { id: '#KM-0042', name: 'Kofi Asante',   product: 'Ankara Tote Bag · ×2',    location: 'Accra Central', amount: 'GH₵ 240', status: 'unpaid'  },
  { id: '#KM-0043', name: 'Efua Darko',    product: 'Silk Blouse · M, Cream',  location: 'East Legon',    amount: 'GH₵ 120', status: 'pod'     },
  { id: '#KM-0044', name: 'Ama Boateng',   product: 'Denim Jacket · Size L',   location: 'Takoradi',      amount: 'GH₵ 310', status: 'paid'    },
]
</script>

<template>
  <div class="landing">

    <!-- ── NAV ───────────────────────────────────────────────────── -->
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo">
          Koomart
          <span class="nav-beta">beta</span>
        </div>
        <ul class="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <a href="#waitlist" class="btn-primary btn--sm">
          Get early access
          <ArrowRight :size="13" :stroke-width="2" />
        </a>
      </div>
    </nav>

    <!-- ── HERO ──────────────────────────────────────────────────── -->
    <section class="hero">

      <!-- Subtle grid bg -->
      <div class="hero-grid" aria-hidden="true" />

      <div class="hero-inner">

        <!-- Eyebrow -->
        <div class="hero-eyebrow">
          <span class="eyebrow-dot" />
          Built for social sellers in Ghana &amp; West Africa
        </div>

        <!-- Headline -->
        <h1 class="hero-title">
          Your orders.<br />
          <span class="hero-title-muted">Finally organised.</span>
        </h1>

        <p class="hero-sub">
          Koomart is a lightweight workspace for social sellers. List products,
          capture buyer orders, and track payments — without the WhatsApp chaos.
        </p>

        <div class="hero-actions">
          <a href="#waitlist" class="btn-primary">
            Get early access — it's free
            <ArrowRight :size="14" :stroke-width="2" />
          </a>
          <a href="#how" class="btn-ghost">See how it works</a>
        </div>

        <p class="hero-footnote">
          <CheckCircle2 :size="11" :stroke-width="2" class="footnote-icon" />
          Free during beta &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; 2-minute setup
        </p>

        <!-- ── DASHBOARD PREVIEW ─────────────────────────────────── -->
        <div class="preview reveal">
          <div class="preview-bar">
            <div class="preview-dots">
              <span /><span /><span />
            </div>
            <div class="preview-url">koomart.app/dashboard/orders</div>
          </div>

          <!-- Stats strip -->
          <div class="preview-stats">
            <div class="stat-item">
              <p class="stat-label">Total orders</p>
              <p class="stat-value mono">24</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">Pending payment</p>
              <p class="stat-value mono">GH₵ 1,240</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">Paid today</p>
              <p class="stat-value mono">8</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">This week</p>
              <p class="stat-value mono">GH₵ 3,820</p>
            </div>
          </div>

          <!-- Orders table -->
          <div class="preview-table">
            <div class="pt-head">
              <span>Order</span>
              <span>Customer</span>
              <span>Product</span>
              <span>Location</span>
              <span class="ta-r">Amount</span>
              <span class="ta-r">Status</span>
            </div>
            <div
              v-for="(o, i) in mockOrders"
              :key="o.id"
              class="pt-row"
              :style="{ '--delay': `${i * 60}ms` }"
            >
              <span class="pt-id mono">{{ o.id }}</span>
              <span class="pt-name">{{ o.name }}</span>
              <span class="pt-product">{{ o.product }}</span>
              <span class="pt-location">{{ o.location }}</span>
              <span class="pt-amount mono ta-r">{{ o.amount }}</span>
              <span class="ta-r">
                <span :class="['status', `status--${o.status}`]">
                  {{ o.status === 'pod' ? 'pay on delivery' : o.status }}
                </span>
              </span>
            </div>
          </div>
        </div>
        <!-- end preview -->

      </div>
    </section>

    <!-- ── SOCIAL PROOF BAR ───────────────────────────────────────── -->
    <div class="proof-bar">
      <div class="proof-inner">
        <div class="proof-stars">
          <Star v-for="i in 5" :key="i" :size="12" fill="currentColor" :stroke-width="0" />
        </div>
        <p class="proof-text">
          Joined by <strong>120+ sellers</strong> on the waitlist across Kumasi, Accra &amp; Lagos
        </p>
        <div class="proof-sep" />
        <p class="proof-quote">
          "This is exactly what I've been needing." — Seller, Kumasi
        </p>
      </div>
    </div>

    <!-- ── THE PROBLEM ───────────────────────────────────────────── -->
    <section class="section" id="problem">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-label">The problem</p>
          <h2 class="section-title">
            You're running a business<br />
            from your camera roll.
          </h2>
          <p class="section-sub">
            Social selling works. The chaos that comes with it doesn't.
          </p>
        </div>

        <div class="pain-grid">
          <!-- <div v-for="(p, i) in [
            { emoji: '💬', title: 'DMs everywhere',       desc: 'Orders buried in 40 conversations. You can\'t remember who paid, who\'s waiting, who cancelled.' },
            { emoji: '📸', title: 'Screenshot overload',  desc: 'Payment proofs in your camera roll. Addresses in voice notes. Sizes in DMs from 3 weeks ago.' },
            { emoji: '😤', title: 'Same questions daily', desc: '\"What\'s your account?\" \"How much to deliver?\" — the same 5 questions, repeated to every customer.' },
            { emoji: '😰', title: 'Orders falling through',desc: 'A customer ordered 4 days ago. You forgot. Now they\'re upset, and you\'ve lost the sale forever.' },
          ]" :key="p.title" class="pain-item reveal" :style="{ '--delay': `${i * 80}ms` }">
            <div class="pain-emoji">{{ p.emoji }}</div>
            <div>
              <p class="pain-title">{{ p.title }}</p>
              <p class="pain-desc">{{ p.desc }}</p>
            </div>
          </div> -->
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ──────────────────────────────────────────── -->
    <section class="section section--alt" id="how">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-label">How it works</p>
          <h2 class="section-title">Three steps. That's it.</h2>
          <p class="section-sub">
            Same things you do today — just without the chaos.
          </p>
        </div>

        <div class="steps">
          <div
            v-for="(step, i) in steps"
            :key="step.num"
            class="step reveal"
            :style="{ '--delay': `${i * 100}ms` }"
          >
            <div class="step-num mono">{{ step.num }}</div>
            <div class="step-body">
              <div class="step-icon-wrap">
                <component :is="step.icon" :size="16" :stroke-width="1.8" />
              </div>
              <div>
                <p class="step-title">{{ step.title }}</p>
                <p class="step-desc">{{ step.desc }}</p>
                <div class="step-tag mono">{{ step.tag }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FEATURES ──────────────────────────────────────────────── -->
    <section class="section" id="features">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-label">Features</p>
          <h2 class="section-title">Everything you actually need.</h2>
          <p class="section-sub">
            Four core features. No noise. No subscription to a dozen add-ons.
          </p>
        </div>

        <div class="features-grid">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="feature-card reveal"
            :style="{ '--delay': `${i * 60}ms` }"
          >
            <div class="feature-icon">
              <component :is="f.icon" :size="14" :stroke-width="1.8" />
            </div>
            <p class="feature-title">{{ f.title }}</p>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PRODUCT LINK CALLOUT ──────────────────────────────────── -->
    <section class="section section--alt">
      <div class="section-inner">
        <div class="link-callout reveal">
          <div class="link-callout-left">
            <p class="section-label">Shareable product links</p>
            <h2 class="callout-title">One link. Every channel.</h2>
            <p class="callout-desc">
              Every product you list gets a clean, minimal buyer page. Share the link
              anywhere — WhatsApp status, Instagram bio, TikTok, DMs. Buyers place their
              order without messaging you first.
            </p>
            <div class="link-demo">
              <span class="mono link-demo-url">koomart.app/p/black-heels-size-40</span>
              <span class="link-demo-copy">Copy</span>
            </div>
            <div class="callout-channels">
              <span class="channel-pill">WhatsApp Status</span>
              <span class="channel-pill">IG Bio</span>
              <span class="channel-pill">Story Link</span>
              <span class="channel-pill">DM Link</span>
              <span class="channel-pill">TikTok</span>
            </div>
          </div>
          <div class="link-callout-right">
            <!-- Mini product page mockup -->
            <div class="product-page-mock">
              <div class="mock-img-wrap">
                <div class="mock-img">
                  <Package :size="28" :stroke-width="1" class="mock-img-icon" />
                </div>
              </div>
              <div class="mock-body">
                <p class="mock-name">Black Heels</p>
                <p class="mock-price mono">GH₵ 180</p>
                <div class="mock-variants">
                  <span class="variant-chip variant-chip--active">38</span>
                  <span class="variant-chip">39</span>
                  <span class="variant-chip">40</span>
                  <span class="variant-chip">41</span>
                </div>
                <button class="mock-cta">Place Order</button>
                <button class="mock-wa">WhatsApp seller</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PRICING ───────────────────────────────────────────────── -->
    <section class="section" id="pricing">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-label">Pricing</p>
          <h2 class="section-title">Free while we build together.</h2>
          <p class="section-sub">
            Early users get full access at no cost during beta. Help us shape what this becomes.
          </p>
        </div>

        <div class="pricing-wrap reveal">
          <div class="pricing-card">
            <div class="pricing-top">
              <div>
                <p class="pricing-tier">Beta access</p>
                <p class="pricing-price mono">Free</p>
                <p class="pricing-note">Honest pricing announced before public launch.</p>
              </div>
              <div class="pricing-badge">
                <Zap :size="11" fill="currentColor" :stroke-width="0" />
                Limited spots
              </div>
            </div>

            <ul class="pricing-list">
              <li v-for="item in [
                'Unlimited product listings',
                'Buyer order forms with shareable links',
                'Order dashboard with payment tracking',
                'Manual order entry for DM customers',
                'WhatsApp & IG-ready product pages',
                'Full access to all future beta features',
              ]" :key="item">
                <div class="check-icon">
                  <CheckCircle2 :size="13" :stroke-width="2" />
                </div>
                {{ item }}
              </li>
            </ul>

            <a href="#waitlist" class="btn-primary btn--full">
              Join the beta
              <ArrowRight :size="14" :stroke-width="2" />
            </a>
          </div>

          <div class="pricing-aside">
            <p class="aside-label">What sellers are saying</p>
            <div class="testimonial">
              <p class="testimonial-text">
                "I was tracking everything in my head and a notes app. I've been looking for something exactly like this."
              </p>
              <div class="testimonial-author">
                <div class="avatar">A</div>
                <div>
                  <p class="author-name">Akua D.</p>
                  <p class="author-role">Fashion seller, Kumasi</p>
                </div>
              </div>
            </div>
            <div class="testimonial">
              <p class="testimonial-text">
                "The DM chaos is real. Every week I'm losing track of who ordered what. This solves that."
              </p>
              <div class="testimonial-author">
                <div class="avatar">K</div>
                <div>
                  <p class="author-name">Kwame B.</p>
                  <p class="author-role">Electronics reseller, Accra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── WAITLIST CTA ───────────────────────────────────────────── -->
    <section class="cta-section" id="waitlist">
      <div class="cta-inner reveal">
        <p class="section-label section-label--inv">Join the waitlist</p>
        <h2 class="cta-title">Ready to stop the chaos?</h2>
        <p class="cta-sub">
          We're onboarding in small batches. Drop your email and we'll reach out when your spot is ready.
        </p>

        <form class="waitlist-form" @submit.prevent="submitWaitlist">
          <template v-if="!submitted">
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="waitlist-input"
              required
            />
            <button type="submit" class="btn-primary btn--form" :disabled="submitting">
              <span v-if="!submitting">Get early access</span>
              <span v-else class="loading-dots">
                <span /><span /><span />
              </span>
            </button>
          </template>
          <div v-else class="waitlist-success">
            <CheckCircle2 :size="16" :stroke-width="2" />
            You're on the list. We'll be in touch soon.
          </div>
        </form>

        <p class="cta-footnote">
          No spam. No credit card. Unsubscribe any time.
        </p>
      </div>
    </section>

    <!-- ── FOOTER ────────────────────────────────────────────────── -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo">
          Koomart
          <span class="mono footer-v">v0.1 · beta</span>
        </div>
        <ul class="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="mailto:hello@koomart.app">Contact</a></li>
        </ul>
        <p class="footer-copy">© 2025 Koomart</p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ── TOKENS ──────────────────────────────────────────────────────── */
.landing {
  --bg-page:        #FAFAF9;
  --bg-surface:     #F4F3F1;
  --bg-card:        #FFFFFF;
  --border:         #E5E4E1;
  --border-strong:  #CFCECA;
  --text-primary:   #1A1916;
  --text-secondary: #4A4945;
  --text-muted:     #8A8984;
  --text-disabled:  #BEBCB9;
  --green-bg:       #EAF3DE;
  --green-text:     #3B6D11;
  --amber-bg:       #FAEEDA;
  --amber-text:     #854F0B;
  --gray-bg:        #F0EFED;
  --gray-text:      #5F5E5A;

  font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── MONO ────────────────────────────────────────────────────────── */
.mono { font-family: 'JetBrains Mono', 'DM Mono', 'Fira Code', monospace; }

/* ── GLOBAL BUTTONS ──────────────────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 18px;
  background: var(--text-primary);
  color: var(--bg-page);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
  transition: opacity 0.15s;
  letter-spacing: -0.1px;
  white-space: nowrap;
}
.btn-primary:hover { opacity: 0.82; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--sm  { height: 34px; padding: 0 14px; font-size: 12px; }
.btn--full { width: 100%; justify-content: center; height: 42px; }
.btn--form { height: 46px; padding: 0 24px; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  background: none;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
}
.btn-ghost:hover { color: var(--text-primary); border-color: var(--text-muted); }

/* ── NAV ─────────────────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 250, 249, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.nav-logo {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.4px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}
.nav-beta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-muted);
  letter-spacing: 0.2px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links a {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}
.nav-links a:hover { color: var(--text-primary); }

/* ── HERO ────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  padding: 96px 40px 80px;
  overflow: hidden;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.45;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
  pointer-events: none;
}
.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 5px 14px 5px 8px;
  margin-bottom: 32px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green-text);
  box-shadow: 0 0 0 2px var(--green-bg);
  flex-shrink: 0;
}
.hero-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 600;
  letter-spacing: -2px;
  line-height: 1.05;
  color: var(--text-primary);
  margin-bottom: 22px;
  max-width: 700px;
}
.hero-title-muted { color: var(--text-disabled); }
.hero-sub {
  font-size: 16px;
  font-weight: 400;
  color: var(--text-secondary);
  line-height: 1.65;
  max-width: 480px;
  margin-bottom: 36px;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 16px;
}
.hero-footnote {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 56px;
}
.footnote-icon { color: var(--green-text); flex-shrink: 0; }

/* ── DASHBOARD PREVIEW ───────────────────────────────────────────── */
.preview {
  width: 100%;
  max-width: 900px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 40px rgba(0,0,0,0.07), 0 1px 0 rgba(0,0,0,0.04);
}
.preview-bar {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.preview-dots {
  display: flex;
  gap: 5px;
}
.preview-dots span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--border-strong);
}
.preview-url {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 3px 10px;
}

/* Stats strip */
.preview-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border);
}
.stat-item {
  padding: 14px 20px;
  border-right: 1px solid var(--border);
}
.stat-item:last-child { border-right: none; }
.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  line-height: 1;
}

/* Orders table */
.preview-table { overflow-x: auto; }
.pt-head {
  display: grid;
  grid-template-columns: 90px 1fr 1fr 90px 90px 110px;
  padding: 8px 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  gap: 12px;
}
.pt-head span {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.pt-row {
  display: grid;
  grid-template-columns: 90px 1fr 1fr 90px 90px 110px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  gap: 12px;
  animation: rowFadeIn 0.3s ease both;
  animation-delay: var(--delay, 0ms);
}
.pt-row:last-child { border-bottom: none; }
@keyframes rowFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pt-id       { font-size: 11px; color: var(--text-muted); }
.pt-name     { font-size: 12px; font-weight: 500; color: var(--text-primary); }
.pt-product  { font-size: 12px; color: var(--text-secondary); }
.pt-location { font-size: 12px; color: var(--text-muted); }
.pt-amount   { font-size: 12px; font-weight: 500; color: var(--text-primary); }
.ta-r { text-align: right; }

/* Status badges */
.status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
.status--paid   { background: var(--green-bg); color: var(--green-text); }
.status--unpaid { background: var(--amber-bg); color: var(--amber-text); }
.status--pod    { background: var(--gray-bg);  color: var(--gray-text); border: 1px solid var(--border); }

/* ── PROOF BAR ───────────────────────────────────────────────────── */
.proof-bar {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
  padding: 14px 40px;
}
.proof-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.proof-stars { display: flex; gap: 2px; color: #E6A817; }
.proof-text { font-size: 12px; color: var(--text-secondary); }
.proof-text strong { color: var(--text-primary); }
.proof-sep { width: 1px; height: 16px; background: var(--border-strong); }
.proof-quote { font-size: 12px; color: var(--text-muted); font-style: italic; }

/* ── SECTIONS ────────────────────────────────────────────────────── */
.section {
  padding: 88px 40px;
  background: var(--bg-page);
}
.section--alt { background: var(--bg-surface); }
.section-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.section-head {
  margin-bottom: 52px;
  max-width: 560px;
}
.section-label {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.section-label--inv { color: rgba(250,250,249,0.5); }
.section-title {
  font-size: clamp(26px, 4vw, 36px);
  font-weight: 600;
  letter-spacing: -0.9px;
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.section-sub {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ── PAIN GRID ───────────────────────────────────────────────────── */
.pain-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.pain-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.pain-emoji { font-size: 20px; flex-shrink: 0; line-height: 1; margin-top: 2px; }
.pain-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.1px; }
.pain-desc  { font-size: 12px; color: var(--text-muted); line-height: 1.55; }

/* ── STEPS ───────────────────────────────────────────────────────── */
.steps {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.step {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
}
.step:last-child { border-bottom: none; }
.step-num {
  width: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 24px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-disabled);
  border-right: 1px solid var(--border);
}
.step-body {
  flex: 1;
  padding: 22px 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.step-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-secondary);
}
.step-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.2px; }
.step-desc  { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 10px; }
.step-tag {
  display: inline-block;
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 3px 9px;
}

/* ── FEATURES GRID ───────────────────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  transition: border-color 0.15s;
}
.feature-card:hover { border-color: var(--border-strong); }
.feature-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  margin-bottom: 14px;
}
.feature-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 5px; letter-spacing: -0.1px; }
.feature-desc  { font-size: 12px; color: var(--text-muted); line-height: 1.55; }

/* ── LINK CALLOUT ────────────────────────────────────────────────── */
.link-callout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.callout-title {
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.8px;
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: 14px;
}
.callout-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 20px; }
.link-demo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  margin-bottom: 18px;
}
.link-demo-url { font-size: 11px; color: var(--text-secondary); }
.link-demo-copy {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s;
}
.link-demo-copy:hover { color: var(--text-primary); }
.callout-channels { display: flex; flex-wrap: wrap; gap: 6px; }
.channel-pill {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 100px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

/* Product page mockup */
.product-page-mock {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0,0,0,0.07);
  max-width: 300px;
  margin: 0 auto;
}
.mock-img-wrap { background: var(--bg-surface); padding: 32px; border-bottom: 1px solid var(--border); }
.mock-img {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mock-img-icon { color: var(--border-strong); }
.mock-body { padding: 20px; }
.mock-name  { font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.2px; }
.mock-price { font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 14px; letter-spacing: -0.5px; }
.mock-variants { display: flex; gap: 6px; margin-bottom: 16px; }
.variant-chip {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-surface);
  cursor: pointer;
}
.variant-chip--active {
  border-color: var(--text-primary);
  background: var(--text-primary);
  color: var(--bg-page);
}
.mock-cta {
  width: 100%;
  height: 38px;
  background: var(--text-primary);
  color: var(--bg-page);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 8px;
  transition: opacity 0.15s;
}
.mock-cta:hover { opacity: 0.85; }
.mock-wa {
  width: 100%;
  height: 36px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s;
}
.mock-wa:hover { border-color: var(--border-strong); }

/* ── PRICING ─────────────────────────────────────────────────────── */
.pricing-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
.pricing-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
}
.pricing-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}
.pricing-tier { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 8px; }
.pricing-price { font-family: 'JetBrains Mono', monospace; font-size: 38px; font-weight: 600; letter-spacing: -1.5px; color: var(--text-primary); line-height: 1; margin-bottom: 4px; }
.pricing-note { font-size: 12px; color: var(--text-muted); }
.pricing-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--amber-bg);
  color: var(--amber-text);
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  white-space: nowrap;
}
.pricing-list { list-style: none; margin: 0 0 28px; padding: 0; display: flex; flex-direction: column; gap: 11px; }
.pricing-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
}
.check-icon { color: var(--green-text); flex-shrink: 0; }

/* Testimonials */
.pricing-aside { display: flex; flex-direction: column; gap: 12px; }
.aside-label { font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; }
.testimonial {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px;
}
.testimonial-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px; font-style: italic; }
.testimonial-author { display: flex; align-items: center; gap: 10px; }
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.author-name { font-size: 12px; font-weight: 600; color: var(--text-primary); }
.author-role { font-size: 11px; color: var(--text-muted); }

/* ── CTA SECTION ─────────────────────────────────────────────────── */
.cta-section {
  background: var(--text-primary);
  padding: 100px 40px;
  text-align: center;
}
.cta-inner { max-width: 560px; margin: 0 auto; }
.cta-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 600;
  letter-spacing: -1.2px;
  color: var(--bg-page);
  margin-bottom: 14px;
  line-height: 1.1;
}
.cta-sub { font-size: 14px; color: rgba(250,250,249,0.55); line-height: 1.65; margin-bottom: 36px; }

.waitlist-form {
  display: flex;
  gap: 8px;
  max-width: 440px;
  margin: 0 auto 14px;
}
.waitlist-input {
  flex: 1;
  height: 46px;
  padding: 0 16px;
  background: rgba(250,250,249,0.08);
  border: 1px solid rgba(250,250,249,0.15);
  border-radius: 8px;
  font-size: 14px;
  color: var(--bg-page);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
.waitlist-input::placeholder { color: rgba(250,250,249,0.35); }
.waitlist-input:focus { border-color: rgba(250,250,249,0.4); }

.waitlist-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6fcf97;
  font-size: 14px;
  font-weight: 500;
  padding: 12px;
}
.cta-footnote { font-size: 11px; color: rgba(250,250,249,0.35); }

/* Loading dots */
.loading-dots {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}
.loading-dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--bg-page);
  animation: dot-pulse 1.2s ease-in-out infinite;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
  40%            { opacity: 1;   transform: scale(1); }
}

/* ── FOOTER ──────────────────────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--border);
  background: var(--bg-page);
  padding: 22px 40px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.footer-logo {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-v { font-size: 10px; color: var(--text-disabled); }
.footer-links {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.footer-links a { font-size: 12px; color: var(--text-muted); text-decoration: none; transition: color 0.15s; }
.footer-links a:hover { color: var(--text-secondary); }
.footer-copy { font-size: 11px; color: var(--text-disabled); }

/* ── SCROLL REVEAL ───────────────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--delay, 0ms);
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── RESPONSIVE ──────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .features-grid { grid-template-columns: 1fr 1fr; }
  .pricing-wrap  { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .nav-links    { display: none; }
  .hero         { padding: 64px 24px 56px; }
  .pain-grid    { grid-template-columns: 1fr; }
  .link-callout { grid-template-columns: 1fr; gap: 40px; }
  .section      { padding: 64px 24px; }
  .nav-inner    { padding: 0 24px; }
  .proof-inner  { flex-direction: column; align-items: flex-start; gap: 10px; }
  .proof-sep    { display: none; }
  .preview-stats { grid-template-columns: repeat(2, 1fr); }
  .pt-head,
  .pt-row       { grid-template-columns: 90px 1fr 90px; }
  .pt-head span:nth-child(3),
  .pt-head span:nth-child(4),
  .pt-row .pt-product,
  .pt-row .pt-location { display: none; }
  .waitlist-form { flex-direction: column; }
  .btn--form    { width: 100%; }
}

@media (max-width: 480px) {
  .features-grid { grid-template-columns: 1fr; }
  .hero-title    { font-size: 36px; }
}
</style>
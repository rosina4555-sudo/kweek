<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ArrowRight, Package, ShoppingBag, BadgeCheck,
  Link2, PenLine, Wallet, CheckCircle2, 
  AlarmClockCheck, 
  Menu, X as XIcon,
} from 'lucide-vue-next'

// ── Mobile nav ────────────────────────────────────────
const mobileNavOpen = ref(false)

// ── Waitlist form ─────────────────────────────────────
const email       = ref('')
const submitted   = ref(false)
const submitting  = ref(false)
const formError   = ref('')

function scrollToWaitlist(e) {
  e?.preventDefault()
  mobileNavOpen.value = false
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
}

async function submitWaitlist() {
  formError.value = ''
  const emailVal = email.value.trim()
  if (!emailVal) { formError.value = 'Please enter your email address.'; return }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailVal)) { formError.value = 'Please enter a valid email address.'; return }
  if (submitting.value) return
  submitting.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/waitlist/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailVal, source: 'landing_page' }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const detail = data?.detail
      if (typeof detail === 'string') formError.value = detail
      else if (Array.isArray(detail)) formError.value = detail.map(e => e.msg).join(', ')
      else formError.value = 'Something went wrong. Please try again.'
      return
    }
    submitted.value = true
    email.value = ''
  } catch {
    formError.value = 'Unable to connect. Please check your connection and try again.'
  } finally {
    submitting.value = false
  }
}

// ── Scroll reveal ─────────────────────────────────────
let observer = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) { el.target.classList.add('revealed'); observer.unobserve(el.target) }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
onUnmounted(() => observer?.disconnect())

// ── Static data ───────────────────────────────────────
const steps = [
  {
    num: '1/', title: 'List your product',
    desc: 'Upload a photo, set your price, add size and color variants. You get a clean shareable link in under 60 seconds.',
    tag: 'kweek.app/store/your-store', icon: Package,
  },
  {
    num: '2/', title: 'Share the link anywhere',
    desc: 'Drop it in your WhatsApp status, Instagram bio, or DM. Buyers open the page and order without messaging you first.',
    tag: 'WhatsApp · Instagram · TikTok · Facebook', icon: Link2,
  },
  {
    num: '3/', title: 'Orders land in your dashboard',
    desc: 'Buyer name, phone, location, quantity — all there automatically. Mark payment status. Add manual orders for DM customers.',
    tag: 'Zero setup. Just works.', icon: ShoppingBag,
  },
]

const features = [
  { icon: Package,    title: 'Product listings',         desc: 'Image, price, variants, availability status. One listing generates one shareable link, ready for every social channel.' },
  { icon: Link2,      title: 'Shareable product pages',  desc: 'A simple page that shows off the photo, price, and a buy button. Built to work perfectly for your WhatsApp status or Instagram bio.' },
  { icon: ShoppingBag,title: 'Buyer order form',         desc: 'Buyers fill their name, phone, location and quantity. The order hits your dashboard instantly. No DMs required.' },
  { icon: PenLine,    title: 'Manual order entry',       desc: 'Got a DM sale or an offline customer? Add the order yourself in seconds. Everything stays in one place.' },
  { icon: Wallet,     title: 'Payment tracking',         desc: 'Mark orders as unpaid, paid, or pay-on-delivery. Simple manual tracking that actually matches how sellers work.' },
  { icon: BadgeCheck, title: 'Order dashboard',          desc: 'All your orders in one view. Search, filter by status, export to CSV. Built to handle the scale of social selling.' },
]

const mockOrders = [
  { id: '#KW-1042', name: 'Abena Mensah',  product: 'Ankara Dress · Size M',     location: 'Kumasi',        amount: 'GHS 160', status: 'paid'   },
  { id: '#KW-1041', name: 'Kofi Asante',   product: 'Kente Bag · Brown · ×2',    location: 'Accra Central', amount: 'GHS 160', status: 'unpaid' },
  { id: '#KW-1040', name: 'Efua Darko',    product: 'Leather Sandals · Size 40', location: 'East Legon',    amount: 'GHS 120', status: 'pod'    },
  { id: '#KW-1039', name: 'Ama Boateng',   product: 'Dashiki Shirt · L, Navy',   location: 'Takoradi',      amount: 'GHS 85',  status: 'paid'   },
]

const pricingFeatures = [
  'Unlimited product listings',
  'Buyer order forms with shareable links',
  'Order dashboard with payment tracking',
  'Manual order entry for DM customers',
  'WhatsApp and Instagram-ready product pages',
  'Full access to all future beta features',
]

const testimonials = [
  { text: 'I was tracking everything in my head and a notes app. I have been looking for something exactly like this.', name: 'Sandra', role: 'Fashion seller, Kumasi', avatar: 'A' },
  { text: 'The DM chaos is real. Every week I lose track of who ordered what. Kweek solves that completely.', name: 'Ben', role: 'Electronics reseller, Accra', avatar: 'K' },
]
</script>

<template>
  <div class="landing">

    <!-- ── NAV ─────────────────────────────────────── -->
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo">
          <div class="nav-logo-icon">
            <img src="/images/kweek_logo_1.png" alt="Kweek" class="nav-logo-img" />
          </div>
          <span class="nav-logo-name">Kweek</span>
          <span class="nav-badge">beta</span>
        </div>

        <ul class="nav-links">
          <li><a href="#how"      @click.prevent="document.getElementById('how')?.scrollIntoView({behavior:'smooth'})">How it works</a></li>
          <li><a href="#features" @click.prevent="document.getElementById('features')?.scrollIntoView({behavior:'smooth'})">Features</a></li>
          <li><a href="#pricing"  @click.prevent="document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})">Pricing</a></li>
        </ul>

        <div class="nav-actions">
          <button class="btn-ghost-nav" @click.prevent="document.getElementById('how')?.scrollIntoView({behavior:'smooth'})">
            Contact sales
          </button>
          <button class="btn-primary btn--sm" @click="scrollToWaitlist">
            Get early access →
          </button>
        </div>

        <button class="nav-hamburger" @click="mobileNavOpen = !mobileNavOpen">
          <XIcon v-if="mobileNavOpen" :size="18" :stroke-width="1.8" />
          <Menu  v-else               :size="18" :stroke-width="1.8" />
        </button>
      </div>

      <Transition name="t-mobile-nav">
        <div v-if="mobileNavOpen" class="mobile-nav">
          <a href="#how"      class="mobile-nav-link" @click="mobileNavOpen = false; document.getElementById('how')?.scrollIntoView({behavior:'smooth'})">How it works</a>
          <a href="#features" class="mobile-nav-link" @click="mobileNavOpen = false; document.getElementById('features')?.scrollIntoView({behavior:'smooth'})">Features</a>
          <a href="#pricing"  class="mobile-nav-link" @click="mobileNavOpen = false; document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})">Pricing</a>
          <div class="mobile-nav-divider" />
          <button class="btn-primary btn--full" @click="scrollToWaitlist">
            Get early access
            <ArrowRight :size="13" :stroke-width="2" />
          </button>
        </div>
      </Transition>
    </nav>

    <!-- ── HERO ────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-grid" aria-hidden="true" />
      <div class="hero-inner">

        <!-- <div class="hero-eyebrow">
          Built for social sellers in Ghana and West Africa
        </div> -->

        <h1 class="hero-title">
          Your orders.<br />
          <span class="hero-title-dim">Finally organised.</span>
        </h1>

        <p class="hero-sub">
          Kweek is a simple workspace built for social sellers. List your products, take buyer orders, and track every payment without dealing with the usual WhatsApp chaos.
        </p>

        <div class="hero-actions">
          <button class="btn-primary btn--hero" @click="scrollToWaitlist">
            Get early access →
          </button>
          <a href="#how" class="btn-outline" @click.prevent="document.getElementById('how')?.scrollIntoView({behavior:'smooth'})">
            See how it works
          </a>
        </div>

        <div class="hero-trust">
          <!-- <Sparkles :size="13" :stroke-width="2.5" class="trust-check" /> -->
          Free during beta
          <span class="trust-sep">·</span>
          No credit card
          <span class="trust-sep">·</span>
          Easy setup
        </div>

        <!-- Dashboard preview -->
        <div class="preview reveal">
          <div class="preview-bar">
            <div class="preview-dots"><span /><span /><span /></div>
            <span class="preview-url">kweek.com/dashboard/orders</span>
          </div>
          <div class="preview-stats">
            <div class="stat-item">
              <p class="stat-label">Orders today</p>
              <p class="stat-value">24</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">Pending payment</p>
              <p class="stat-value">GHS 1,240</p>
               <!-- <p class="stat-value">GH&#x20B5; 1,240</p> -->
            </div>
            <div class="stat-item">
              <p class="stat-label">Paid today</p>
              <p class="stat-value">8</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">This week</p>
              <p class="stat-value">GHS 3,820</p>
              <!-- <p class="stat-value">GH&#x20b5; 3,820</p> -->
            </div>
          </div>
          <div class="preview-table-wrap">
            <div class="pt-head">
              <span>Order</span>
              <span>Customer</span>
              <span class="hide-sm">Product</span>
              <span class="hide-sm">Location</span>
              <span class="ta-r">Amount</span>
              <span class="ta-r">Status</span>
            </div>
            <div v-for="(o, i) in mockOrders" :key="o.id" class="pt-row" :style="{ '--delay': `${i * 70}ms` }">
              <span class="pt-id">{{ o.id }}</span>
              <span class="pt-name">{{ o.name }}</span>
              <span class="pt-product hide-sm">{{ o.product }}</span>
              <span class="pt-location hide-sm">{{ o.location }}</span>
              <span class="pt-amount ta-r">{{ o.amount }}</span>
              <!-- <span class="pt-amount ta-r" v-html="o.amount.replace('GH₵', 'GH&#x20B5;')"></span> -->
              <span class="ta-r">
                <span :class="['st-badge', `st-badge--${o.status}`]">
                  {{ o.status === 'pod' ? 'Pay on delivery' : o.status === 'paid' ? 'Paid' : 'Unpaid' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PROOF BAR ────────────────────────────────── -->
    <div class="proof-bar">
      <div class="proof-inner">
        <div class="proof-stars">
          <span v-for="i in 5" :key="i" class="star">★</span>
        </div>
        <p class="proof-text">
          Joined by <strong>120+ sellers</strong> on the waitlist across Kumasi, Accra and Sunyani
        </p>
        <div class="proof-sep" />
        <p class="proof-quote">"This is exactly what I've been needing." — Seller, Kumasi</p>
      </div>
    </div>

    <!-- ── THE PROBLEM ──────────────────────────────── -->
    <section class="section" id="problem">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-eyebrow">The problem</p>
          <h2 class="section-title">
            You're running a business<br />from your camera roll.
          </h2>
          <p class="section-sub">Social selling works. The chaos that comes with it doesn't.</p>
        </div>
        <div class="pain-grid">
          <div v-for="(p, i) in [
            { title: 'DMs everywhere',          desc: 'Orders buried in 40 conversations. You cannot remember who paid, who is waiting, who cancelled.' },
            { title: 'Screenshot overload',     desc: 'Payment proofs in your camera roll. Addresses in voice notes. Sizes in DMs from 3 weeks ago.' },
            { title: 'Same questions daily',    desc: 'What is your account? How much to deliver? The same five questions repeated to every customer.' },
            { title: 'Orders falling through',  desc: 'A customer ordered 4 days ago. You forgot. Now they are upset and you have lost the sale.' },
          ]" :key="p.title" class="pain-item reveal" :style="{ '--delay': `${i * 80}ms` }">
            <p class="pain-title">{{ p.title }}</p>
            <p class="pain-desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ─────────────────────────────── -->
    <section class="section section--alt" id="how">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-eyebrow">How it works</p>
          <h2 class="section-title">Three steps. That's it.</h2>
          <p class="section-sub">You can keep your current workflow while completely eliminating the usual chaos.</p>
        </div>
        <div class="steps">
          <div v-for="(step, i) in steps" :key="step.num" class="step reveal" :style="{ '--delay': `${i * 100}ms` }">
            <div class="step-num">{{ step.num }}</div>
            <div class="step-body">
              <div class="step-icon-wrap">
                <component :is="step.icon" :size="15" :stroke-width="2" />
              </div>
              <div class="step-content">
                <p class="step-title">{{ step.title }}</p>
                <p class="step-desc">{{ step.desc }}</p>
                <span class="step-tag">{{ step.tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FEATURES ─────────────────────────────────── -->
    <section class="section" id="features">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-eyebrow">Features</p>
          <h2 class="section-title">Everything you actually need.</h2>
          <p class="section-sub">Four essential features designed to eliminate distractions and unnecessary subscriptions.</p>
        </div>
        <div class="features-grid">
          <div v-for="(f, i) in features" :key="f.title" class="feature-card reveal" :style="{ '--delay': `${i * 60}ms` }">
            <div class="feature-icon">
              <component :is="f.icon" :size="16" :stroke-width="2" />
            </div>
            <p class="feature-title">{{ f.title }}</p>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── LINK CALLOUT ─────────────────────────────── -->
    <section class="section section--alt">
      <div class="section-inner">
        <div class="link-callout reveal">
          <div class="callout-left">
            <p class="section-eyebrow">Shareable storefront</p>
            <h2 class="callout-title">One link.<br />Every channel.</h2>
            <p class="callout-desc">
              Every product you list features a professional, streamlined checkout page. Share your unique link across platforms like WhatsApp, Instagram, and TikTok to enable customers to complete purchases directly without manual coordination.
            </p>
            <div class="link-demo">
              <span class="link-demo-url">kweek.app/store/amas-boutique</span>
              <span class="link-demo-tag">Your link</span>
            </div>
            <div class="channel-pills">
              <span class="channel-pill">WhatsApp Status</span>
              <span class="channel-pill">IG Bio</span>
              <span class="channel-pill">Story Link</span>
              <span class="channel-pill">DM Link</span>
              <span class="channel-pill">TikTok</span>
            </div>
          </div>
          <div class="callout-right">
            <div class="product-mock">
              <div class="mock-img-area">
                <div class="mock-img-placeholder">
                  <Package :size="32" :stroke-width="1.2" />
                </div>
              </div>
              <div class="mock-body">
                <p class="mock-name">Ankara Wrap Dress</p>
                <p class="mock-price">GH₵ 160</p>
                <p class="mock-desc-text">Premium fabric, fully lined. Available in multiple sizes and colour options.</p>
                <div class="mock-variants">
                  <span class="mock-variant mock-variant--active">S</span>
                  <span class="mock-variant">M</span>
                  <span class="mock-variant">L</span>
                  <span class="mock-variant">XL</span>
                </div>
                <button class="mock-order-btn">Place Order</button>
                <button class="mock-wa-btn">Message seller</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PRICING ──────────────────────────────────── -->
    <section class="section" id="pricing">
      <div class="section-inner">
        <div class="section-head reveal">
          <p class="section-eyebrow">Pricing</p>
          <h2 class="section-title">Free while we build together.</h2>
          <p class="section-sub">Early users get full access at no cost during beta. Help us shape what this becomes.</p>
        </div>
        <div class="pricing-wrap reveal">
          <div class="pricing-card">
            <div class="pricing-top">
              <div>
                <p class="pricing-tier">Beta access</p>
                <p class="pricing-price">Free</p>
                <p class="pricing-note">Honest pricing announced before public launch.</p>
              </div>
              <div class="pricing-badge">
                <AlarmClockCheck :size="14" :stroke-width="2" />
                Limited spots
              </div>
            </div>
            <ul class="pricing-list">
              <li v-for="item in pricingFeatures" :key="item">
                <div class="check-icon"><CheckCircle2 :size="13" :stroke-width="2" /></div>
                {{ item }}
              </li>
            </ul>
            <button class="btn-primary btn--full" @click="scrollToWaitlist">
              Join the beta
              <ArrowRight :size="13" :stroke-width="2" />
            </button>
          </div>
          <div class="pricing-aside">
            <p class="aside-label">What sellers are saying</p>
            <div v-for="t in testimonials" :key="t.name" class="testimonial">
              <p class="testimonial-text">{{ t.text }}</p>
              <div class="testimonial-author">
                <div class="t-avatar">{{ t.avatar }}</div>
                <div>
                  <p class="t-name">{{ t.name }}</p>
                  <p class="t-role">{{ t.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA / WAITLIST ───────────────────────────── -->
    <section class="cta-section" id="waitlist">
      <div class="cta-inner reveal">
        <p class="cta-eyebrow">Join the waitlist</p>
        <h2 class="cta-title">Ready to stop the chaos?</h2>
        <p class="cta-sub">
          We're onboarding in small batches. Drop your email and we'll reach out when your spot is ready.
        </p>

        <form class="waitlist-form" @submit.prevent="submitWaitlist" novalidate>
          <template v-if="!submitted">
            <div class="waitlist-form-row">
              <input
                v-model="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="your@email.com"
                class="waitlist-input"
                :class="{ 'waitlist-input--error': formError }"
                required
              />
              <button type="submit" class="waitlist-submit" :disabled="submitting">
                <span v-if="!submitting">Get early access</span>
                <span v-else class="loading-dots"><span /><span /><span /></span>
              </button>
            </div>
            <p v-if="formError" class="waitlist-error">{{ formError }}</p>
          </template>
          <div v-else class="waitlist-success">
            <CheckCircle2 :size="16" :stroke-width="2" />
            You're on the list. We'll be in touch soon.
          </div>
        </form>

        <p class="cta-note">No credit card required. Unsubscribe any time.</p>
      </div>
    </section>

    <!-- ── FOOTER ───────────────────────────────────── -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-col">
          <p class="footer-col-label">Product</p>
          <a href="#how" @click.prevent="document.getElementById('how')?.scrollIntoView({behavior:'smooth'})">How it works</a>
          <a href="#features" @click.prevent="document.getElementById('features')?.scrollIntoView({behavior:'smooth'})">Features</a>
          <a href="#pricing" @click.prevent="document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})">Pricing</a>
        </div>
        <div class="footer-col">
          <p class="footer-col-label">Legal</p>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
        <div class="footer-col">
          <p class="footer-col-label">Contact</p>
          <a href="mailto:hello@kweek.app">hello@kweek.app</a>
        </div>
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="footer-logo-icon">
              <img src="/images/kweek_logo_1.png" alt="Kweek" class="footer-logo-img" />
            </div>
            <span class="footer-logo-name">Kweek</span>
          </div>
          <p class="footer-tagline">Efficiency is simplicity.</p>
          <p class="footer-copy">© 2025 Kweek · v0.1 beta</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ── TOKENS (koomart palette) ────────────────────────── */
.landing {
  --bg-page:             #FAFAF9;
  --bg-surface:          #F4F3F1;
  --bg-card:             #FFFFFF;
  --border:              #E5E4E1;
  --border-strong:       #CFCECA;
  --text-primary:        #1A1916;
  --text-secondary:      #4A4945;
  --text-muted:          #8A8984;
  --text-disabled:       #BEBCB9;
  --brand:               #1A1916;
  --brand-hover:         #2D2C29;
  --green-bg:            #EAF3DE;
  --green-text:          #3B6D11;
  --amber-bg:            #FAEEDA;
  --amber-text:          #854F0B;
  --gray-bg:             #F0EFED;
  --gray-text:           #5F5E5A;
  --status-paid-bg:      #EAF3DE;
  --status-paid-text:    #3B6D11;
  --status-pending-bg:   #FAEEDA;
  --status-pending-text: #854F0B;
  font-family: 'Geist', 'Noto Sans', system-ui, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── BUTTONS ─────────────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 18px;
  background: var(--text-primary);
  color: var(--bg-page);
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
  letter-spacing: -0.1px;
  white-space: nowrap;
  transition: opacity 0.15s;
}
.btn-primary:hover    { opacity: 0.82; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--sm   { height: 34px; padding: 0 14px; font-size: 12px; }
.btn--hero { height: 44px; padding: 0 22px; font-size: 14px; font-weight: 500; }
.btn--full { width: 100%; height: 44px; font-size: 13px; }

.btn-outline {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  background: none;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
}
.btn-outline:hover { color: var(--text-primary); border-color: var(--text-muted); }

.btn-ghost-nav {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  background: none;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.btn-ghost-nav:hover { color: var(--text-primary); border-color: var(--text-muted); }

/* ── NAV ─────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 250, 249, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.nav-logo-icon {
  width: 28px; height: 28px; overflow: hidden; color: var(--text-primary);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.nav-logo-img  { width: 100%; height: 100%; object-fit: contain; }
.nav-logo-name { font-size: 15px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.4px; }
.nav-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 500;
  padding: 2px 6px; border-radius: 4px;
  background: var(--bg-surface); border: 1px solid var(--border);
  color: var(--text-muted); letter-spacing: 0.3px;
}
.nav-links {
  display: flex; align-items: center; gap: 28px;
  list-style: none; margin: 0; padding: 0; flex: 1;
}
.nav-links a {
  font-size: 13px; font-weight: 400; color: var(--text-secondary);
  text-decoration: none; transition: color 0.15s; cursor: pointer;
}
.nav-links a:hover { color: var(--text-primary); }
.nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.nav-hamburger {
  display: none; width: 36px; height: 36px; border-radius: 6px;
  border: 1px solid var(--border); background: none; color: var(--text-muted);
  align-items: center; justify-content: center; cursor: pointer; margin-left: auto; flex-shrink: 0;
}
.mobile-nav {
  border-top: 1px solid var(--border); background: var(--bg-page);
  padding: 16px 24px 20px; display: flex; flex-direction: column; gap: 2px;
}
.mobile-nav-link {
  display: block; padding: 10px 0; font-size: 14px; font-weight: 500;
  color: var(--text-secondary); text-decoration: none;
  border-bottom: 1px solid var(--border); transition: color 0.15s; cursor: pointer;
}
.mobile-nav-link:hover { color: var(--text-primary); }
.mobile-nav-divider { height: 1px; background: var(--border); margin: 10px 0; }
.t-mobile-nav-enter-active,
.t-mobile-nav-leave-active { transition: opacity 0.15s, transform 0.15s; }
.t-mobile-nav-enter-from,
.t-mobile-nav-leave-to     { opacity: 0; transform: translateY(-6px); }

/* ── HERO ────────────────────────────────────────────── */
.hero { position: relative; padding: 100px 40px 80px; overflow: hidden; }
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 80% 55% at 50% 0%, black 30%, transparent 100%);
  pointer-events: none;
}
.hero-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: flex-start; text-align: left;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 100px;
  padding: 5px 14px; margin-bottom: 32px;
  font-size: 11px; font-weight: 500;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--text-muted);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.hero-title {
  font-size: clamp(44px, 6.5vw, 80px);
  font-weight: 600;
  letter-spacing: -3px;
  line-height: 1.0;
  color: var(--text-primary);
  margin-bottom: 22px;
  max-width: 700px;
}
.hero-title-dim { color: var(--text-disabled); }
.hero-sub {
  font-size: 16px; color: var(--text-secondary); line-height: 1.7;
  max-width: 480px; margin-bottom: 36px; font-weight: 400;
}
.hero-actions {
  display: flex; align-items: center; gap: 10px;
  flex-wrap: wrap; margin-bottom: 16px;
}
.hero-trust {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: var(--text-disabled);
  margin-bottom: 60px; flex-wrap: wrap;
}
.trust-check { color: var(--green-text); flex-shrink: 0; }
.trust-sep   { color: var(--border-strong); }

/* ── PREVIEW ─────────────────────────────────────────── */
.preview {
  width: 100%; max-width: 960px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
  /* box-shadow: 0 4px 40px rgba(0,0,0,0.07), 0 1px 0 rgba(0,0,0,0.04); */
}
.preview-bar {
  background: var(--bg-surface); border-bottom: 1px solid var(--border);
  padding: 10px 16px; display: flex; align-items: center; gap: 10px;
}
.preview-dots        { display: flex; gap: 5px; }
.preview-dots span   { width: 9px; height: 9px; border-radius: 50%; background: var(--border-strong); }
.preview-url {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-muted);
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 5px; padding: 3px 10px;
}
.preview-stats { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--border); }
.stat-item { padding: 16px 20px; border-right: 1px solid var(--border); }
.stat-item:last-child { border-right: none; }
.stat-label {
  font-size: 10px; font-weight: 500; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 5px;
}
.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px; font-weight: 600; letter-spacing: -0.5px;
  color: var(--text-primary); line-height: 1;
}
.preview-table-wrap { overflow-x: auto; }
.pt-head {
  display: grid; grid-template-columns: 96px 1fr 1fr 96px 88px 120px;
  padding: 8px 20px; background: var(--bg-surface);
  border-bottom: 1px solid var(--border); gap: 12px;
}
.pt-head span {
  font-size: 10px; font-weight: 500; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.8px;
}
.pt-row {
  display: grid; grid-template-columns: 96px 1fr 1fr 96px 88px 120px;
  padding: 12px 20px; border-bottom: 1px solid var(--border);
  align-items: center; gap: 12px;
  animation: rowIn 0.3s ease both;
  animation-delay: var(--delay, 0ms);
}
.pt-row:last-child { border-bottom: none; }
@keyframes rowIn {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pt-id       { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-muted); }
.pt-name     { font-size: 12px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-product  { font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-location { font-size: 12px; color: var(--text-muted); }
.pt-amount   { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500; color: var(--text-primary); }
.ta-r { text-align: right; }
.st-badge {
  display: inline-block; font-size: 10px; font-weight: 500;
  padding: 3px 9px; border-radius: 4px; border: 1px solid; white-space: nowrap;
}
.st-badge--paid   { background: var(--green-bg);  color: var(--green-text);  border-color: var(--green-bg); }
.st-badge--unpaid { background: var(--amber-bg);  color: var(--amber-text);  border-color: var(--amber-bg); }
.st-badge--pod    { background: var(--bg-surface); color: var(--text-muted);  border-color: var(--border); }

/* ── PROOF BAR ───────────────────────────────────────── */
.proof-bar   { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg-surface); padding: 14px 40px; }
.proof-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.proof-stars { display: flex; gap: 2px; color: #D97706; font-size: 12px; }
.proof-text  { font-size: 12px; color: var(--text-secondary); }
.proof-text strong { color: var(--text-primary); font-weight: 600; }
.proof-sep   { width: 1px; height: 16px; background: var(--border-strong); }
.proof-quote { font-size: 12px; color: var(--text-muted); font-style: italic; }

/* ── SECTIONS ────────────────────────────────────────── */
.section      { padding: 96px 40px; background: var(--bg-page); }
.section--alt { background: var(--bg-surface); }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-head  { margin-bottom: 52px; max-width: 580px; }
.section-eyebrow {
  font-size: 10px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 1.4px;
  color: var(--text-muted); margin-bottom: 12px;
  display: block;
}
.section-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 600; letter-spacing: -1px; line-height: 1.12;
  color: var(--text-primary); margin-bottom: 12px;
}
.section-sub { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

/* ── PAIN ────────────────────────────────────────────── */
.pain-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.pain-item {
  background: var(--bg-card); padding: 28px 24px;
  transition: background 0.15s;
}
.pain-item:hover { background: var(--bg-surface); }
.pain-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; letter-spacing: -0.2px; }
.pain-desc  { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

/* ── STEPS ───────────────────────────────────────────── */
.steps { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.step  { display: flex; border-bottom: 1px solid var(--border); }
.step:last-child { border-bottom: none; }
.step-num {
  font-family: 'JetBrains Mono', monospace;
  width: 64px; flex-shrink: 0;
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 26px; font-size: 11px; font-weight: 500;
  color: var(--text-disabled); border-right: 1px solid var(--border);
}
.step-body { flex: 1; padding: 24px 28px; display: flex; gap: 16px; align-items: flex-start; }
.step-icon-wrap {
  width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--bg-surface); display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--text-secondary);
}
.step-content  { flex: 1; }
.step-title    { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 5px; letter-spacing: -0.2px; }
.step-desc     { font-size: 13px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 12px; }
.step-tag {
  display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--text-muted); background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: 4px; padding: 3px 9px;
}

/* ── FEATURES ────────────────────────────────────────── */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.feature-card  { background: var(--bg-card); padding: 24px; transition: background 0.15s; }
.feature-card:hover { background: var(--bg-surface); }
.feature-icon {
  width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--bg-surface); display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary); margin-bottom: 14px;
}
.feature-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; letter-spacing: -0.1px; }
.feature-desc  { font-size: 12px; color: var(--text-muted); line-height: 1.6; }

/* ── LINK CALLOUT ────────────────────────────────────── */
.link-callout { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.callout-title { font-size: clamp(28px, 4vw, 40px); font-weight: 600; letter-spacing: -1px; line-height: 1.1; color: var(--text-primary); margin-bottom: 14px; }
.callout-desc  { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px; }
.link-demo {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 6px; padding: 9px 12px; margin-bottom: 18px;
}
.link-demo-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-secondary); }
.link-demo-tag {
  font-size: 10px; font-weight: 500; color: var(--text-muted);
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: 4px; padding: 2px 7px;
}
.channel-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.channel-pill  {
  font-size: 11px; font-weight: 500; padding: 4px 11px; border-radius: 100px;
  background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary);
}
.callout-right   { display: flex; justify-content: center; }
.product-mock {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
  /* box-shadow: 0 4px 32px rgba(0,0,0,0.07); width: 100%; max-width: 300px; */
}
.mock-img-area { background: var(--bg-surface); padding: 28px; border-bottom: 1px solid var(--border); }
.mock-img-placeholder {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px;
  height: 140px; display: flex; align-items: center; justify-content: center; color: var(--border-strong);
}
.mock-body      { padding: 18px; }
.mock-name      { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.2px; }
.mock-price     { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; letter-spacing: -0.5px; }
.mock-desc-text { font-size: 11px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px; }
.mock-variants  { display: flex; gap: 6px; margin-bottom: 14px; }
.mock-variant {
  width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 500; color: var(--text-muted); background: var(--bg-surface);
}
.mock-variant--active { border-color: var(--text-primary); background: var(--text-primary); color: var(--bg-page); }
.mock-order-btn {
  width: 100%; height: 38px; background: var(--text-primary); color: var(--bg-page);
  border: none; border-radius: 6px; font-size: 13px; font-weight: 500;
  cursor: pointer; font-family: inherit; margin-bottom: 8px; transition: opacity 0.15s;
}
.mock-order-btn:hover { opacity: 0.82; }
.mock-wa-btn {
  width: 100%; height: 36px; background: none; border: 1px solid var(--border);
  border-radius: 6px; font-size: 12px; color: var(--text-secondary);
  cursor: pointer; font-family: inherit; transition: border-color 0.15s;
}
.mock-wa-btn:hover { border-color: var(--border-strong); }

/* ── PRICING ─────────────────────────────────────────── */
.pricing-wrap  { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
.pricing-card  { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 28px; }
.pricing-top   { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 12px; }
.pricing-tier  { font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 8px; }
.pricing-price { font-family: 'JetBrains Mono', monospace; font-size: 42px; font-weight: 600; letter-spacing: -2px; color: var(--text-primary); line-height: 1; margin-bottom: 6px; }
.pricing-note  { font-size: 11px; color: var(--text-muted); }
.pricing-badge {
  display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600;
  padding: 4px 10px; border-radius: 100px; white-space: nowrap; flex-shrink: 0;
  background: var(--amber-bg); color: var(--amber-text);
}
.pricing-list  { list-style: none; margin: 0 0 28px; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.pricing-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
.check-icon    { color: var(--green-text); flex-shrink: 0; margin-top: 1px; }
.pricing-aside { display: flex; flex-direction: column; gap: 10px; }
.aside-label   { font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; }
.testimonial   { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 18px; }
.testimonial-text   { font-size: 13px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 14px; font-style: italic; }
.testimonial-author { display: flex; align-items: center; gap: 10px; }
.t-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--text-secondary); flex-shrink: 0; }
.t-name   { font-size: 12px; font-weight: 600; color: var(--text-primary); }
.t-role   { font-size: 11px; color: var(--text-muted); }

/* ── CTA SECTION ─────────────────────────────────────── */
.cta-section { background: var(--text-primary); padding: 110px 40px; text-align: left; }
.cta-inner   { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.cta-eyebrow {
  font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.4px;
  color: rgba(250,250,249,0.4); margin-bottom: 14px; display: block;
}
.cta-title {
  font-size: clamp(32px, 4.5vw, 52px); font-weight: 600; letter-spacing: -1.5px;
  color: var(--bg-page); margin-bottom: 14px; line-height: 1.08;
}
.cta-sub  { font-size: 14px; color: rgba(250,250,249,0.5); line-height: 1.7; }
.cta-note { font-size: 11px; color: rgba(250,250,249,0.25); margin-top: 14px; }

/* ── WAITLIST FORM ───────────────────────────────────── */
.waitlist-form { max-width: 480px; }
.waitlist-form-row { display: flex; gap: 8px; align-items: stretch; }
.waitlist-input {
  flex: 1; height: 48px; min-width: 0; padding: 0 16px;
  background: rgba(250,250,249,0.07); border: 1px solid rgba(250,250,249,0.15);
  border-radius: 6px; font-size: 15px; color: var(--bg-page); font-family: inherit;
  outline: none; transition: border-color 0.15s, box-shadow 0.15s;
}
.waitlist-input::placeholder { color: rgba(250,250,249,0.3); }
.waitlist-input:focus { border-color: rgba(250,250,249,0.4); box-shadow: 0 0 0 3px rgba(250,250,249,0.06); }
.waitlist-input--error { border-color: rgba(239,68,68,0.6); }
.waitlist-submit {
  height: 48px; padding: 0 22px; background: var(--bg-page);
  color: var(--text-primary); border: none; border-radius: 6px;
  font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit;
  white-space: nowrap; flex-shrink: 0; transition: opacity 0.15s;
}
.waitlist-submit:hover:not(:disabled) { opacity: 0.88; }
.waitlist-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.waitlist-error { margin-top: 10px; font-size: 12px; color: #FCA5A5; }
.waitlist-success {
  display: flex; align-items: center; gap: 8px; color: #6EE7B7; font-size: 14px; font-weight: 500;
  padding: 14px; background: rgba(110,231,183,0.08); border: 1px solid rgba(110,231,183,0.2); border-radius: 6px;
}
.loading-dots        { display: flex; gap: 4px; align-items: center; justify-content: center; }
.loading-dots span   { width: 5px; height: 5px; border-radius: 50%; background: var(--text-primary); animation: dot-pulse 1.2s ease-in-out infinite; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
  40%            { opacity: 1;   transform: scale(1); }
}

/* ── FOOTER ──────────────────────────────────────────── */
.footer { border-top: 1px solid rgba(250,250,249,0.08); background: var(--text-primary); padding: 56px 40px; }
.footer-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 160px) 1fr;
  gap: 40px; align-items: start;
}
.footer-col { display: flex; flex-direction: column; gap: 10px; }
.footer-col-label {
  font-size: 10px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 1.2px; color: rgba(250,250,249,0.35); margin-bottom: 4px;
}
.footer-col a {
  font-size: 13px; color: rgba(250,250,249,0.55); text-decoration: none;
  transition: color 0.15s;
}
.footer-col a:hover { color: rgba(250,250,249,0.9); }
.footer-brand { text-align: right; }
.footer-logo  { display: flex; align-items: center; gap: 8px; justify-content: flex-end; margin-bottom: 8px; filter: brightness(0) invert(1); }
.footer-logo-icon { width: 22px; height: 22px; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.footer-logo-img  { width: 100%; height: 100%; object-fit: contain; }
.footer-logo-name { font-size: 14px; font-weight: 600; color: rgba(250,250,249,0.9); letter-spacing: -0.3px; }
.footer-tagline   { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(250,250,249,0.3); margin-bottom: 8px; }
.footer-copy      { font-size: 11px; color: rgba(250,250,249,0.2); }

/* ── SCROLL REVEAL ───────────────────────────────────── */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: var(--delay, 0ms); }
.reveal.revealed { opacity: 1; transform: translateY(0); }

/* ── RESPONSIVE ──────────────────────────────────────── */
@media (max-width: 900px) {
  .features-grid { grid-template-columns: 1fr 1fr; }
  .pricing-wrap  { grid-template-columns: 1fr; }
  .link-callout  { grid-template-columns: 1fr; gap: 36px; }
  .cta-inner     { grid-template-columns: 1fr; gap: 36px; }
  .footer-inner  { grid-template-columns: repeat(2, 1fr); }
  .footer-brand  { text-align: left; }
  .footer-logo   { justify-content: flex-start; }
}

@media (max-width: 768px) {
  .nav-links     { display: none; }
  .nav-actions   { display: none; }
  .nav-hamburger { display: flex; }
  .nav-inner     { padding: 0 24px; }
  .hero          { padding: 64px 24px 52px; }
  .hero-inner    { align-items: flex-start; }
  .section       { padding: 64px 24px; }
  .proof-bar     { padding: 14px 24px; }
  .pain-grid     { grid-template-columns: 1fr; }
  .preview-stats { grid-template-columns: repeat(2, 1fr); }
  .pt-head, .pt-row { grid-template-columns: 88px 1fr 80px 100px; }
  .cta-section   { padding: 72px 24px; }
  .footer        { padding: 40px 24px; }
  .hide-sm       { display: none; }
}

@media (max-width: 560px) {
  .waitlist-form-row { flex-direction: column; gap: 10px; }
  .waitlist-input    { width: 100%; font-size: 16px; }
  .waitlist-submit   { width: 100%; height: 50px; font-size: 15px; }
}

@media (max-width: 480px) {
  .features-grid { grid-template-columns: 1fr; }
  .proof-inner   { flex-direction: column; gap: 8px; }
  .proof-sep     { display: none; }
  .footer-inner  { grid-template-columns: 1fr; }
}
</style>
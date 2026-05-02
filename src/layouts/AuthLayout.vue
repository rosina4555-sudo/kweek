<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <div class="auth-shell">
    <div class="auth-left">

      <!-- Branding -->
      <div class="auth-brand">
        <img src="/images/logo_kweek.png" alt="Kweek" class="auth-logo-img" />
        <span class="auth-brand-name">Kweek</span>
      </div>

      <!-- Value proposition -->
      <div class="auth-pitch">
        <h2 class="auth-headline">Your social orders,<br>centralised.</h2>
        <p class="auth-sub">
          Stop tracking orders across WhatsApp, Instagram, and DMs.
          Kweek gives you one dashboard for every sale, every product, every buyer.
        </p>

        <div class="auth-features">
          <div class="auth-feature">
            <i class="pi pi-link" />
            <span>Share a storefront link — buyers order themselves</span>
          </div>
          <div class="auth-feature">
            <i class="pi pi-list" />
            <span>Track every order from pending to delivered</span>
          </div>
          <div class="auth-feature">
            <i class="pi pi-download" />
            <span>Export orders to CSV for your supplier</span>
          </div>
          <div class="auth-feature">
            <i class="pi pi-qrcode" />
            <span>Generate a QR code and share anywhere</span>
          </div>
        </div>
      </div>

      <p class="auth-left-footer">© {{ year }} Kweek. All rights reserved.</p>
    </div>

    <div class="auth-right">
      <div class="auth-form-wrap">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Shell ───────────────────────────────────────────────── */
.auth-shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* ── Left panel ──────────────────────────────────────────── */
.auth-left {
  background: #0F1117;
  border-right: 1px solid #1E2130;
  padding: 48px 52px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
}

/* ── Branding ────────────────────────────────────────────── */
.auth-brand {
  display: flex;
  align-items: center;
  gap: 11px;
}
.auth-logo-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 8px;
}
.auth-brand-name {
  font-size: 18px;
  font-weight: 600;
  color: #F9FAFB;
  letter-spacing: -0.4px;
}

/* ── Pitch ───────────────────────────────────────────────── */
.auth-pitch {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 0;
}
.auth-headline {
  font-size: 30px;
  font-weight: 600;
  color: #F9FAFB;
  letter-spacing: -0.8px;
  line-height: 1.25;
  margin: 0 0 16px;
}
.auth-sub {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.7;
  margin: 0 0 40px;
  max-width: 340px;
}

/* ── Feature list ────────────────────────────────────────── */
.auth-features {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.auth-feature {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}
.auth-feature i {
  font-size: 13px;
  color: #4F46E5;
  margin-top: 2px;
  flex-shrink: 0;
}
.auth-feature span {
  font-size: 13px;
  color: #9CA3AF;
  line-height: 1.55;
}

/* ── Left footer ─────────────────────────────────────────── */
.auth-left-footer {
  font-size: 11px;
  color: #374151;
  margin: 0;
}

/* ── Right panel ─────────────────────────────────────────── */
.auth-right {
  background: var(--bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  overflow-y: auto;
}
.auth-form-wrap {
  width: 100%;
  max-width: 380px;
}

/* ── Responsive ──────────────────────────────────────────── */

/* Tablet — collapse to single column */
@media (max-width: 860px) {
  .auth-shell {
    grid-template-columns: 1fr;
    min-height: 100vh;
  }
  .auth-left {
    position: static;
    height: auto;
    padding: 36px 32px 32px;
  }
  .auth-pitch {
    padding: 32px 0 24px;
  }
  .auth-headline {
    font-size: 24px;
  }
  .auth-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .auth-right {
    padding: 40px 24px;
    align-items: flex-start;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .auth-left {
    padding: 28px 20px 24px;
  }
  .auth-headline {
    font-size: 22px;
  }
  .auth-sub {
    font-size: 13px;
  }
  .auth-features {
    grid-template-columns: 1fr;
  }
  .auth-right {
    padding: 32px 20px;
  }
  .auth-form-wrap {
    max-width: 100%;
  }
}
</style>
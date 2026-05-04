<script setup>
import { ref }          from 'vue'
import { useSettings }  from '@/composables/useSettings'
import { useAuthStore } from '@/stores/auth'
import KButton          from '@/components/ui/KButton.vue'
import KInput           from '@/components/ui/KInput.vue'

const auth = useAuthStore()
const {
  profileForm, profileErrors, savingProfile, profileSaved,
  saveProfile,
  initials, avatarUploading,
  uploadAvatar, removeAvatar,
  passwordForm, passwordErrors, savingPassword,
  showCurrentPass, showNewPass,
  passwordStrength, passwordStrengthMeta,
  savePassword,
  deletingAccount, confirmDelete, deleteAccount,
} = useSettings()

// ── Section nav ───────────────────────────────────────
const activeSection = ref('profile')

const sections = [
  { key: 'profile',   label: 'Profile',      icon: 'pi-user',    group: 'Account' },
  { key: 'security',  label: 'Security',     icon: 'pi-shield',  group: 'Account' },
  { key: 'store',     label: 'Store info',   icon: 'pi-globe',   group: 'Store'   },
  { key: 'branding',  label: 'Branding',     icon: 'pi-image',   group: 'Store'   },
  { key: 'danger',    label: 'Danger zone',  icon: 'pi-trash',   group: 'System'  },
]

const groups = ['Account', 'Store', 'System']

function scrollTo(key) {
  activeSection.value = key
  const el = document.getElementById(`section-${key}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Avatar file input ─────────────────────────────────
const avatarInput = ref(null)

function onAvatarChange(e) {
  const file = e.target.files?.[0]
  if (file) uploadAvatar(file)
}
</script>

<template>
  <div class="settings-page">

    <!-- Left nav -->
    <aside class="settings-nav">
      <template v-for="group in groups" :key="group">
        <span class="nav-group-label">{{ group }}</span>
        <template v-for="s in sections.filter(x => x.group === group)" :key="s.key">
          <button
            :class="['nav-item', activeSection === s.key && 'nav-item--active']"
            @click="scrollTo(s.key)"
          >
            <i :class="['pi', s.icon]" />
            {{ s.label }}
          </button>
        </template>
      </template>
    </aside>

    <!-- Content -->
    <div class="settings-content">

      <!-- ── Profile ──────────────────────────────────── -->
      <section id="section-profile" class="settings-section">
        <div class="section-head">
          <h2 class="section-title">Profile</h2>
          <p class="section-sub">Your personal information and contact details</p>
        </div>

        <!-- Avatar -->
        <div class="avatar-row">
          <div class="avatar-wrap">
            <img
              v-if="auth.user?.avatar_url"
              :src="auth.user.avatar_url"
              class="avatar-img"
              alt="Avatar"
            />
            <div v-else class="avatar-initials">{{ initials }}</div>
            <div v-if="avatarUploading" class="avatar-overlay">
              <i class="pi pi-spin pi-spinner" />
            </div>
          </div>
          <div class="avatar-actions">
            <input
              ref="avatarInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style="display: none"
              @change="onAvatarChange"
            />
            <KButton variant="secondary" size="sm" @click="avatarInput.click()">
              Upload photo
            </KButton>
            <KButton
              v-if="auth.user?.avatar_url"
              variant="ghost"
              size="sm"
              @click="removeAvatar"
            >
              Remove
            </KButton>
            <p class="avatar-hint">JPG, PNG or WebP · max 2MB</p>
          </div>
        </div>

        <!-- General error -->
        <div v-if="profileErrors.general" class="alert-error">
          <i class="pi pi-exclamation-circle" />
          {{ profileErrors.general }}
        </div>

        <form @submit.prevent="saveProfile" novalidate>
          <div class="form-grid">

            <div class="form-field">
              <label>Full name</label>
              <KInput
                v-model="profileForm.name"
                placeholder="Your full name"
                icon-left="pi-user"
                :error="profileErrors.name"
              />
            </div>

            <div class="form-field">
              <label>Phone number</label>
              <KInput
                v-model="profileForm.phone"
                placeholder="+233 24 000 0000"
                icon-left="pi-phone"
                :error="profileErrors.phone"
              />
            </div>

            <div class="form-field form-field--full">
              <label>Email address</label>
              <KInput
                v-model="profileForm.email"
                type="email"
                placeholder="you@example.com"
                icon-left="pi-envelope"
                :error="profileErrors.email"
              />
              <span class="field-hint">Used for login and important notifications</span>
            </div>

          </div>

          <div class="form-actions">
            <KButton
              type="submit"
              variant="primary"
              size="sm"
              :loading="savingProfile"
            >
              <template v-if="profileSaved">
                <i class="pi pi-check" /> Saved
              </template>
              <template v-else>Save changes</template>
            </KButton>
          </div>
        </form>
      </section>

      <!-- ── Security ─────────────────────────────────── -->
      <section id="section-security" class="settings-section">
        <div class="section-head">
          <h2 class="section-title">Security</h2>
          <p class="section-sub">Change your password regularly to keep your account secure</p>
        </div>

        <div v-if="passwordErrors.general" class="alert-error">
          <i class="pi pi-exclamation-circle" />
          {{ passwordErrors.general }}
        </div>

        <form @submit.prevent="savePassword" novalidate>
          <div class="form-grid">

            <div class="form-field form-field--full">
              <label>Current password</label>
              <div class="pass-wrap">
                <KInput
                  v-model="passwordForm.currentPassword"
                  :type="showCurrentPass ? 'text' : 'password'"
                  placeholder="••••••••"
                  icon-left="pi-lock"
                  :error="passwordErrors.currentPassword"
                />
                <button
                  type="button"
                  class="pass-toggle"
                  @click="showCurrentPass = !showCurrentPass"
                  tabindex="-1"
                >
                  <i :class="['pi', showCurrentPass ? 'pi-eye-slash' : 'pi-eye']" />
                </button>
              </div>
            </div>

            <div class="form-field">
              <label>New password</label>
              <div class="pass-wrap">
                <KInput
                  v-model="passwordForm.newPassword"
                  :type="showNewPass ? 'text' : 'password'"
                  placeholder="••••••••"
                  icon-left="pi-lock"
                  :error="passwordErrors.newPassword"
                />
                <button
                  type="button"
                  class="pass-toggle"
                  @click="showNewPass = !showNewPass"
                  tabindex="-1"
                >
                  <i :class="['pi', showNewPass ? 'pi-eye-slash' : 'pi-eye']" />
                </button>
              </div>

              <!-- Strength meter -->
              <div v-if="passwordForm.newPassword" class="strength-meter">
                <div class="strength-bars">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="strength-bar"
                    :style="{ background: i <= passwordStrength ? passwordStrengthMeta?.color : 'var(--border)' }"
                  />
                </div>
                <span
                  v-if="passwordStrengthMeta"
                  class="strength-label"
                  :style="{ color: passwordStrengthMeta.color }"
                >
                  {{ passwordStrengthMeta.label }}
                </span>
              </div>
            </div>

            <div class="form-field">
              <label>Confirm new password</label>
              <KInput
                v-model="passwordForm.confirmPassword"
                :type="showNewPass ? 'text' : 'password'"
                placeholder="••••••••"
                icon-left="pi-lock"
                :error="passwordErrors.confirmPassword"
              />
            </div>

          </div>

          <div class="form-actions">
            <KButton
              type="submit"
              variant="primary"
              size="sm"
              :loading="savingPassword"
            >
              Update password
            </KButton>
          </div>
        </form>
      </section>

      <!-- ── Store info ────────────────────────────────── -->
      <section id="section-store" class="settings-section">
        <div class="section-head">
          <h2 class="section-title">Store info</h2>
          <p class="section-sub">This information appears on your public storefront</p>
        </div>

        <div class="form-grid">
          <div class="form-field form-field--full">
            <label>Store name</label>
            <KInput
              :model-value="auth.user?.store_name ?? ''"
              placeholder="e.g. Ama's Boutique"
              icon-left="pi-shop"
            />
          </div>
          <div class="form-field form-field--full">
            <label>Store description</label>
            <textarea
              class="k-textarea"
              rows="3"
              placeholder="Tell buyers what you sell and where you're based..."
            >{{ auth.user?.store_description ?? '' }}</textarea>
            <span class="field-hint">Keep it short — 2 to 3 sentences</span>
          </div>
          <div class="form-field form-field--full">
            <label>WhatsApp number</label>
            <KInput
              :model-value="auth.user?.whatsapp ?? ''"
              placeholder="+233 24 000 0000"
              icon-left="pi-whatsapp"
            />
            <span class="field-hint">Buyers will contact you on this number</span>
          </div>
        </div>

        <div class="form-actions">
          <KButton variant="primary" size="sm">Save store info</KButton>
        </div>
      </section>

      <!-- ── Branding ──────────────────────────────────── -->
      <section id="section-branding" class="settings-section">
        <div class="section-head">
          <h2 class="section-title">Branding</h2>
          <p class="section-sub">Your store logo and banner shown on the public storefront</p>
        </div>

        <!-- Logo upload -->
        <div class="upload-row">
          <div class="upload-label-wrap">
            <span class="upload-label">Store logo</span>
            <span class="upload-hint">Shown in the header of your storefront · 1:1 ratio recommended</span>
          </div>
          <div class="upload-target">
            <div class="upload-preview logo-preview">
              <i class="pi pi-image" />
            </div>
            <KButton variant="secondary" size="sm">Upload logo</KButton>
          </div>
        </div>

        <!-- Banner upload -->
        <div class="upload-row">
          <div class="upload-label-wrap">
            <span class="upload-label">Store banner</span>
            <span class="upload-hint">Wide banner across the top of your store · 3:1 ratio · max 3MB</span>
          </div>
          <div class="upload-target">
            <div class="upload-preview banner-preview">
              <i class="pi pi-image" />
            </div>
            <KButton variant="secondary" size="sm">Upload banner</KButton>
          </div>
        </div>

        <div class="form-actions">
          <KButton variant="primary" size="sm">Save branding</KButton>
        </div>
      </section>

      <!-- ── Danger zone ───────────────────────────────── -->
      <section id="section-danger" class="settings-section settings-section--danger">
        <div class="section-head">
          <h2 class="section-title section-title--danger">Danger zone</h2>
          <p class="section-sub">These actions are permanent and cannot be undone</p>
        </div>

        <div class="danger-list">

          <div class="danger-item">
            <div class="danger-item-info">
              <span class="danger-item-title">Delete all orders</span>
              <span class="danger-item-sub">Permanently removes all order history from your account</span>
            </div>
            <KButton variant="danger" size="sm">Delete orders</KButton>
          </div>

          <div class="danger-item">
            <div class="danger-item-info">
              <span class="danger-item-title">Delete account</span>
              <span class="danger-item-sub">Permanently deletes your Kweek account and all associated data</span>
            </div>

            <div v-if="!confirmDelete">
              <KButton
                variant="danger"
                size="sm"
                @click="confirmDelete = true"
              >
                Delete account
              </KButton>
            </div>

            <div v-else class="confirm-delete">
              <p class="confirm-text">Are you absolutely sure? This cannot be undone.</p>
              <div class="confirm-actions">
                <KButton
                  variant="ghost"
                  size="sm"
                  @click="confirmDelete = false"
                >
                  Cancel
                </KButton>
                <KButton
                  variant="danger"
                  size="sm"
                  :loading="deletingAccount"
                  @click="deleteAccount"
                >
                  Yes, delete my account
                </KButton>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* ── Page shell ──────────────────────────────────────── */
.settings-page {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 0;
  height: 100%;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

/* ── Left nav ────────────────────────────────────────── */
.settings-nav {
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  position: sticky;
  top: 0;
  height: fit-content;
}

.nav-group-label {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: var(--text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding: 12px 10px 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: none;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover {
  background: var(--bg-page);
  color: var(--text-secondary);
}
.nav-item--active {
  background: var(--bg-page);
  border-color: var(--border);
  color: var(--text-primary);
}
.nav-item i {
  font-size: 12px;
  width: 14px;
  text-align: center;
  color: var(--text-disabled);
}
.nav-item--active i { color: var(--brand); }

/* ── Content ─────────────────────────────────────────── */
.settings-content {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* ── Section ─────────────────────────────────────────── */
.settings-section {
  padding: 28px 32px;
  border-bottom: 1px solid var(--border);
}
.settings-section:last-child { border-bottom: none; }
.settings-section--danger {
  background: color-mix(in srgb, var(--error-bg) 40%, transparent);
}

.section-head { margin-bottom: 24px; }
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  margin: 0 0 4px;
}
.section-title--danger { color: var(--error-text); }
.section-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

/* ── Alert ───────────────────────────────────────────── */
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  color: var(--error-text);
  font-size: 12px;
  padding: 10px 14px;
  border-radius: 7px;
  margin-bottom: 18px;
}

/* ── Avatar ──────────────────────────────────────────── */
.avatar-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.avatar-wrap {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.avatar-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--border);
}
.avatar-initials {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: #1E1B4B;
  border: 1px solid #312E81;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A5B4FC;
  font-size: 18px;
  font-weight: 600;
}
.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
}
.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.avatar-hint {
  font-size: 11px;
  color: var(--text-disabled);
  margin: 0;
}

/* ── Form grid ───────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-field--full { grid-column: 1 / -1; }
.form-field label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.field-hint {
  font-size: 11px;
  color: var(--text-disabled);
}

/* ── Password ────────────────────────────────────────── */
.pass-wrap { position: relative; }
.pass-toggle {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  z-index: 1;
}
.pass-toggle:hover { color: var(--text-primary); }

.strength-meter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.strength-bars { display: flex; gap: 4px; flex: 1; }
.strength-bar {
  height: 2px;
  flex: 1;
  border-radius: 999px;
  transition: background 0.2s;
}
.strength-label {
  font-size: 11px;
  font-weight: 500;
  min-width: 40px;
}

/* ── Textarea ────────────────────────────────────────── */
.k-textarea {
  width: 100%;
  background: var(--bg-page);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: inherit;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.k-textarea:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-light);
}
.k-textarea::placeholder { color: var(--text-disabled); }

/* ── Upload rows ─────────────────────────────────────── */
.upload-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.upload-row:last-of-type { border-bottom: none; }
.upload-label-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.upload-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.upload-hint {
  font-size: 11px;
  color: var(--text-muted);
  max-width: 280px;
  line-height: 1.5;
}
.upload-target {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.upload-preview {
  border: 1px dashed var(--border-strong);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-disabled);
  font-size: 18px;
  background: var(--bg-surface);
}
.logo-preview   { width: 44px; height: 44px; border-radius: 8px; }
.banner-preview { width: 120px; height: 40px; border-radius: 6px; }

/* ── Form actions ────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

/* ── Danger list ─────────────────────────────────────── */
.danger-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.danger-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
}
.danger-item:last-child { border-bottom: none; }
.danger-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.danger-item-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.danger-item-sub {
  font-size: 12px;
  color: var(--text-muted);
  max-width: 360px;
  line-height: 1.5;
}

/* ── Confirm delete ──────────────────────────────────── */
.confirm-delete {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.confirm-text {
  font-size: 12px;
  color: var(--error-text);
  margin: 0;
  text-align: right;
}
.confirm-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .settings-page {
    grid-template-columns: 1fr;
  }
  .settings-nav {
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--border);
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px 12px;
    gap: 4px;
  }
  .nav-group-label { display: none; }
  .nav-item { width: auto; }
  .settings-section { padding: 22px 20px; }
  .form-grid { grid-template-columns: 1fr; }
  .form-field--full { grid-column: 1; }
}

@media (max-width: 480px) {
  .avatar-row { flex-direction: column; align-items: flex-start; }
  .upload-row { flex-direction: column; }
  .danger-item { flex-direction: column; gap: 12px; }
  .confirm-delete { align-items: flex-start; }
  .confirm-text { text-align: left; }
}
</style>
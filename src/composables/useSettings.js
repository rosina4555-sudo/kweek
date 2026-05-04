import { reactive, ref, computed } from 'vue'
import { authApi, updateProfileSchema, updatePasswordSchema } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { useToast }     from '@/composables/useToast'
import { useRouter }    from 'vue-router'

export function useSettings() {
  const auth   = useAuthStore()
  const toast  = useToast()
  const router = useRouter()

  // ── Profile ───────────────────────────────────────────
  const profileForm = reactive({
    name:  auth.user?.name  ?? '',
    email: auth.user?.email ?? '',
    phone: auth.user?.phone ?? '',
  })
  const profileErrors  = reactive({ name: '', email: '', phone: '', general: '' })
  const savingProfile  = ref(false)
  const profileSaved   = ref(false)

  function clearProfileErrors() {
    Object.keys(profileErrors).forEach(k => profileErrors[k] = '')
  }

  async function saveProfile() {
    clearProfileErrors()
    const result = updateProfileSchema.safeParse(profileForm)
    if (!result.success) {
      result.error.errors.forEach(e => {
        const f = e.path[0]
        if (f in profileErrors) profileErrors[f] = e.message
      })
      return
    }
    savingProfile.value = true
    try {
      const updated = await authApi.updateProfile(profileForm)
      auth.setSession(auth.token, { ...auth.user, ...updated })
      profileSaved.value = true
      toast.success('Profile updated')
      setTimeout(() => profileSaved.value = false, 2500)
    } catch (err) {
      profileErrors.general = err.message
      toast.error(err.message)
    } finally {
      savingProfile.value = false
    }
  }

  // ── Avatar ────────────────────────────────────────────
  const avatarUploading = ref(false)

  const initials = computed(() => {
    const name = profileForm.name || auth.sellerName
    if (!name) return 'K'
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  })

  async function uploadAvatar(file) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG or WebP images are allowed')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }
    avatarUploading.value = true
    try {
      const { avatar_url } = await authApi.uploadAvatar(file)
      auth.setSession(auth.token, { ...auth.user, avatar_url })
      toast.success('Photo updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      avatarUploading.value = false
    }
  }

  function removeAvatar() {
    auth.setSession(auth.token, { ...auth.user, avatar_url: null })
    toast.info('Photo removed')
  }

  // ── Password ──────────────────────────────────────────
  const passwordForm = reactive({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const passwordErrors  = reactive({
    currentPassword: '', newPassword: '', confirmPassword: '', general: '',
  })
  const savingPassword  = ref(false)
  const showCurrentPass = ref(false)
  const showNewPass     = ref(false)

  const passwordStrength = computed(() => {
    const p = passwordForm.newPassword
    if (!p) return 0
    let s = 0
    if (p.length >= 8)          s++
    if (/[A-Z]/.test(p))        s++
    if (/[0-9]/.test(p))        s++
    if (/[^a-zA-Z0-9]/.test(p)) s++
    return s
  })

  const passwordStrengthMeta = computed(() => ([
    null,
    { label: 'Weak',   color: '#EF4444' },
    { label: 'Fair',   color: '#F59E0B' },
    { label: 'Good',   color: '#EAB308' },
    { label: 'Strong', color: '#22C55E' },
  ][passwordStrength.value]))

  function clearPasswordErrors() {
    Object.keys(passwordErrors).forEach(k => passwordErrors[k] = '')
  }

  async function savePassword() {
    clearPasswordErrors()
    const result = updatePasswordSchema.safeParse(passwordForm)
    if (!result.success) {
      result.error.errors.forEach(e => {
        const f = e.path[0]
        if (f in passwordErrors) passwordErrors[f] = e.message
      })
      return
    }
    savingPassword.value = true
    try {
      await authApi.updatePassword(passwordForm)
      toast.success('Password updated')
      passwordForm.currentPassword = ''
      passwordForm.newPassword     = ''
      passwordForm.confirmPassword = ''
    } catch (err) {
      passwordErrors.general = err.message
      toast.error(err.message)
    } finally {
      savingPassword.value = false
    }
  }

  // ── Danger zone ───────────────────────────────────────
  const deletingAccount = ref(false)
  const confirmDelete   = ref(false)

  async function deleteAccount() {
    deletingAccount.value = true
    try {
      await authApi.deleteAccount()
      auth.clearSession()
      router.push({ name: 'Login' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      deletingAccount.value = false
      confirmDelete.value   = false
    }
  }

  return {
    // profile
    profileForm, profileErrors, savingProfile, profileSaved,
    saveProfile,
    // avatar
    initials, avatarUploading,
    uploadAvatar, removeAvatar,
    // password
    passwordForm, passwordErrors, savingPassword,
    showCurrentPass, showNewPass,
    passwordStrength, passwordStrengthMeta,
    savePassword,
    // danger
    deletingAccount, confirmDelete, deleteAccount,
  }
}
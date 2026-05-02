import { useAuthStore } from '@/stores/auth'

// Called before every protected route
export async function requireAuth(to, from, next) {
  const auth = useAuthStore()

  
  if (auth.token) {
    return next()
  }

  // No token in memory — try silent refresh via HttpOnly cookie
  // This handles page refresh scenarios
  const newToken = await auth.refreshAccessToken()

  if (newToken) {
    return next()
  }

  // No valid session at all — go to login
  next({ name: 'Login', query: { redirect: to.fullPath } })
}

// Called before auth pages — logged-in users shouldn't see login/register
export async function requireGuest(to, from, next) {
  const auth = useAuthStore()

  if (auth.token) {
    return next({ name: 'Overview' })
  }

  // Try silent refresh — maybe they're already logged in
  // const newToken = await auth.refreshAccessToken()

  // if (newToken) {
  //   return next({ name: 'Overview' })
  // }

  next()
}
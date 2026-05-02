import api from './axios'
import { z } from 'zod'

// ── Validation schemas ────────────────────────────────────
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(1, 'Password is required'),
})

// ── API calls ─────────────────────────────────────────────
export const authApi = {
  async login(credentials) {
    const validated = loginSchema.parse(credentials)
    const { data } = await api.post('/auth/login', {
      email:    validated.email,
      password: validated.password,
    })
    return data // { access_token, user }
  },

  async register(payload) {
    const validated = registerSchema.parse(payload)
    const { data } = await api.post('/auth/register', {
      name:     validated.name,
      email:    validated.email,
      password: validated.password,
    })
    return data // { access_token, user }
  },

  async logout() {
    await api.post('/auth/logout')
  },

  async refresh() {
    // No body needed — browser sends the HttpOnly cookie automatically
    const { data } = await api.post('/auth/refresh')
    return data // { access_token, user }
  },

  async getMe() {
    const { data } = await api.get('/auth/me')
    return data // { id, name, email, phone, ... }
  },
}
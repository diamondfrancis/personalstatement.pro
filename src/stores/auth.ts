import { reactive, computed } from 'vue'

export interface Subscription {
  plan: 'free' | 'pro'
  status: 'active' | 'cancelled' | 'expired' | 'none'
  startDate: string | null
  expiryDate: string | null
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  occupation: string
  avatarUrl: string
  subscription: Subscription
}

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
}

const defaultSubscription: Subscription = {
  plan: 'free',
  status: 'none',
  startDate: null,
  expiryDate: null,
}

const STORAGE_KEY = 'ps_auth_user'

function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const state = reactive<AuthState>({
  user: loadUser(),
  isAuthenticated: !!loadUser(),
})

function persist() {
  if (state.user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => state.isAuthenticated)
  const user = computed(() => state.user)

  function signUp(name: string, email: string, password: string) {
    // Store credentials list in localStorage for demo
    const users: Record<string, { password: string; profile: UserProfile }> = JSON.parse(
      localStorage.getItem('ps_users_db') || '{}'
    )
    if (users[email]) {
      throw new Error('An account with this email already exists.')
    }
    const profile: UserProfile = {
      name,
      email,
      phone: '',
      location: '',
      occupation: '',
      avatarUrl: '',
      subscription: { ...defaultSubscription },
    }
    users[email] = { password, profile }
    localStorage.setItem('ps_users_db', JSON.stringify(users))
    state.user = profile
    state.isAuthenticated = true
    persist()
  }

  function signIn(email: string, password: string) {
    const users: Record<string, { password: string; profile: UserProfile }> = JSON.parse(
      localStorage.getItem('ps_users_db') || '{}'
    )
    const entry = users[email]
    if (!entry || entry.password !== password) {
      throw new Error('Invalid email or password.')
    }
    state.user = entry.profile
    state.isAuthenticated = true
    persist()
  }

  function signInWithGoogle() {
    // Simulated Google sign-in for demo purposes.
    // In production, integrate with Google Identity Services.
    const profile: UserProfile = {
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '',
      location: '',
      occupation: '',
      avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=4285f4&color=fff&size=128',
      subscription: { ...defaultSubscription },
    }
    const users: Record<string, { password: string; profile: UserProfile }> = JSON.parse(
      localStorage.getItem('ps_users_db') || '{}'
    )
    if (!users[profile.email]) {
      users[profile.email] = { password: '', profile }
      localStorage.setItem('ps_users_db', JSON.stringify(users))
    } else {
      Object.assign(profile, users[profile.email]!.profile)
    }
    state.user = profile
    state.isAuthenticated = true
    persist()
  }

  function signOut() {
    state.user = null
    state.isAuthenticated = false
    persist()
  }

  function updateProfile(updates: Partial<UserProfile>) {
    if (!state.user) return
    Object.assign(state.user, updates)
    persist()
    // Also update in users DB
    const users: Record<string, { password: string; profile: UserProfile }> = JSON.parse(
      localStorage.getItem('ps_users_db') || '{}'
    )
    const entry = users[state.user.email]
    if (entry) {
      entry.profile = { ...state.user }
      localStorage.setItem('ps_users_db', JSON.stringify(users))
    }
  }

  const isPro = computed(() => {
    if (!state.user?.subscription) return false
    if (state.user.subscription.plan !== 'pro') return false
    if (state.user.subscription.status !== 'active') return false
    if (state.user.subscription.expiryDate) {
      return new Date(state.user.subscription.expiryDate) > new Date()
    }
    return false
  })

  function activateProSubscription() {
    if (!state.user) return
    const now = new Date()
    const expiry = new Date(now)
    expiry.setMonth(expiry.getMonth() + 1)
    state.user.subscription = {
      plan: 'pro',
      status: 'active',
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
    }
    persist()
    // Update users DB
    const users: Record<string, { password: string; profile: UserProfile }> = JSON.parse(
      localStorage.getItem('ps_users_db') || '{}'
    )
    const entry = users[state.user.email]
    if (entry) {
      entry.profile = { ...state.user }
      localStorage.setItem('ps_users_db', JSON.stringify(users))
    }
  }

  function cancelProSubscription() {
    if (!state.user) return
    state.user.subscription.status = 'cancelled'
    persist()
    const users: Record<string, { password: string; profile: UserProfile }> = JSON.parse(
      localStorage.getItem('ps_users_db') || '{}'
    )
    const entry = users[state.user.email]
    if (entry) {
      entry.profile = { ...state.user }
      localStorage.setItem('ps_users_db', JSON.stringify(users))
    }
  }

  return {
    isAuthenticated,
    user,
    isPro,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    activateProSubscription,
    cancelProSubscription,
  }
}

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { signIn, signUp, signInWithGoogle, isAuthenticated } = useAuth()

// Redirect if already logged in
if (isAuthenticated.value) {
  router.replace('/profile')
}

const mode = ref<'signin' | 'signup'>('signin')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

const isSignUp = computed(() => mode.value === 'signup')
const title = computed(() => (isSignUp.value ? 'Create Account' : 'Welcome Back'))
const subtitle = computed(() =>
  isSignUp.value
    ? 'Sign up to save your progress and access all features'
    : 'Sign in to continue where you left off'
)

function switchMode() {
  mode.value = isSignUp.value ? 'signin' : 'signup'
  error.value = ''
}

async function handleSubmit() {
  error.value = ''

  if (!email.value.trim() || !password.value) {
    error.value = 'Please fill in all required fields.'
    return
  }

  if (isSignUp.value) {
    if (!name.value.trim()) {
      error.value = 'Please enter your name.'
      return
    }
    if (password.value.length < 6) {
      error.value = 'Password must be at least 6 characters.'
      return
    }
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.'
      return
    }
  }

  loading.value = true
  try {
    if (isSignUp.value) {
      signUp(name.value.trim(), email.value.trim(), password.value)
    } else {
      signIn(email.value.trim(), password.value)
    }
    router.push('/profile')
  } catch (e: any) {
    error.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

function handleGoogleSignIn() {
  loading.value = true
  error.value = ''
  try {
    signInWithGoogle()
    router.push('/profile')
  } catch (e: any) {
    error.value = e.message || 'Google sign-in failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left decorative panel -->
      <div class="auth-hero">
        <div class="hero-content">
          <span class="hero-icon">📝</span>
          <h2>Personal Statement Pro</h2>
          <p>Craft compelling personal statements with AI-powered analysis and expert guidance.</p>
          <div class="hero-features">
            <div class="feature-item">
              <span class="feature-check">✓</span>
              <span>AI-powered statement analysis</span>
            </div>
            <div class="feature-item">
              <span class="feature-check">✓</span>
              <span>Save and track your progress</span>
            </div>
            <div class="feature-item">
              <span class="feature-check">✓</span>
              <span>Expert blog resources</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Auth form -->
      <div class="auth-form-panel">
        <div class="form-wrapper">
          <h1 class="form-title">{{ title }}</h1>
          <p class="form-subtitle">{{ subtitle }}</p>

          <!-- Google Sign-In -->
          <button class="google-btn" @click="handleGoogleSignIn" :disabled="loading">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <!-- Error message -->
          <Transition name="fade">
            <div v-if="error" class="error-msg">
              <span class="error-icon">⚠</span>
              {{ error }}
            </div>
          </Transition>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <!-- Name field (sign up only) -->
            <Transition name="slide">
              <div v-if="isSignUp" class="form-group">
                <label for="name">Full Name</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    id="name"
                    v-model="name"
                    type="text"
                    placeholder="John Doe"
                    autocomplete="name"
                  />
                </div>
              </div>
            </Transition>

            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                >
                  {{ showPassword ? '🙈' : '👁' }}
                </button>
              </div>
            </div>

            <!-- Confirm password (sign up only) -->
            <Transition name="slide">
              <div v-if="isSignUp" class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    autocomplete="new-password"
                  />
                </div>
              </div>
            </Transition>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
            </button>
          </form>

          <p class="switch-mode">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button @click="switchMode" class="switch-btn">
              {{ isSignUp ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 2rem 1rem;
}

.auth-container {
  display: flex;
  max-width: 900px;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
}

/* Left hero panel */
.auth-hero {
  flex: 1;
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
  padding: 3rem 2.5rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.auth-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.15), transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.1), transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.hero-content h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.hero-content p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.feature-check {
  color: #34d399;
  font-weight: 700;
}

/* Right form panel */
.auth-form-panel {
  flex: 1;
  padding: 3rem 2.5rem;
  display: flex;
  align-items: center;
}

.form-wrapper {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.form-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
  letter-spacing: -0.02em;
}

.form-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.88rem;
  margin-bottom: 1.75rem;
  line-height: 1.5;
}

/* Google button */
.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  flex-shrink: 0;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider span {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Error */
.error-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  color: #fca5a5;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.error-icon {
  flex-shrink: 0;
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.4rem;
  letter-spacing: 0.01em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.85rem;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.7rem 0.85rem 0.7rem 2.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  outline: none;
}

.input-wrapper input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.input-wrapper input:focus {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0.2rem;
}

/* Submit button */
.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Switch mode */
.switch-mode {
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
}

.switch-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  margin-left: 0.25rem;
}

.switch-btn:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
  overflow: hidden;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 100px;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    max-width: 480px;
  }

  .auth-hero {
    padding: 2rem 1.75rem;
  }

  .hero-features {
    display: none;
  }

  .hero-content p {
    margin-bottom: 0;
  }

  .auth-form-panel {
    padding: 2rem 1.75rem;
  }
}

@media (max-width: 480px) {
  .auth-container {
    border-radius: 12px;
    margin: 1rem 0;
  }

  .auth-hero {
    padding: 1.5rem 1.25rem;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .auth-form-panel {
    padding: 1.5rem 1.25rem;
  }

  .social-buttons {
    flex-direction: column;
  }

  .submit-btn {
    font-size: 0.9rem;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '../stores/auth'

const { isAuthenticated, user, isPro } = useAuth()
const route = useRoute()

const mobileMenuOpen = ref(false)
const scrolled = ref(false)

function toggleMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMenu() {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Close menu on route change
watch(() => route.path, () => {
  closeMenu()
})

// Close menu on Escape key
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileMenuOpen.value) {
    closeMenu()
  }
}

// Add scroll shadow effect
function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})

const userInitial = computed(() => {
  return (user.value?.name ?? 'U').charAt(0).toUpperCase()
})
</script>

<template>
  <nav class="navbar" :class="{ scrolled }">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand" @click="closeMenu">
        <span class="brand-icon">📝</span>
        <span class="brand-text">Personal Statement Pro</span>
      </RouterLink>

      <button class="hamburger" :class="{ active: mobileMenuOpen }" @click="toggleMenu" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-links-wrapper" :class="{ open: mobileMenuOpen }">
        <div class="nav-overlay" @click="closeMenu"></div>
        <ul class="nav-links" :class="{ open: mobileMenuOpen }">
          <li><RouterLink to="/" @click="closeMenu">Home</RouterLink></li>
          <li><RouterLink to="/analyzer" @click="closeMenu">Analyze Statement</RouterLink></li>
          <li><RouterLink to="/blog" @click="closeMenu">Blog</RouterLink></li>
          <li><RouterLink to="/jobs" @click="closeMenu">Jobs</RouterLink></li>
          <li><RouterLink to="/about" @click="closeMenu">About</RouterLink></li>
          <li>
            <RouterLink to="/pricing" @click="closeMenu" class="nav-pricing">
              <span v-if="!isPro">Pricing</span>
              <span v-else class="pro-tag">PRO ✓</span>
            </RouterLink>
          </li>
          <li v-if="!isAuthenticated" class="nav-cta-item">
            <RouterLink to="/auth" @click="closeMenu" class="nav-cta">Sign In</RouterLink>
          </li>
          <li v-else class="nav-cta-item">
            <RouterLink to="/profile" @click="closeMenu" class="nav-profile">
              <span class="nav-avatar">{{ userInitial }}</span>
              <span class="nav-profile-name">{{ user?.name || 'Profile' }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: box-shadow 0.3s ease;
}

.navbar.scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.brand-icon {
  font-size: 1.5rem;
}

/* Desktop nav links */
.nav-links-wrapper {
  display: contents;
}

.nav-overlay {
  display: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links a {
  display: block;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-cta {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
  color: #fff !important;
  padding: 0.5rem 1.25rem !important;
  border-radius: 8px !important;
  margin-left: 0.5rem;
}

.nav-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.nav-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem 0.35rem 0.35rem !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px !important;
  color: #fff !important;
  transition: all 0.2s ease;
}

.nav-profile:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.18);
}

.nav-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.nav-profile-name {
  font-size: 0.85rem;
  font-weight: 500;
}

.nav-pricing .pro-tag {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1010;
  -webkit-tap-highlight-color: transparent;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ─── Tablet breakpoint (≤ 900px) ─── */
@media (max-width: 900px) {
  .nav-links a {
    padding: 0.5rem 0.65rem;
    font-size: 0.84rem;
  }
}

/* ─── Mobile breakpoint (≤ 768px) ─── */
@media (max-width: 768px) {
  .navbar-inner {
    padding: 0 1rem;
  }

  .hamburger {
    display: flex;
  }

  .nav-links-wrapper {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1005;
    pointer-events: none;
    visibility: hidden;
  }

  .nav-links-wrapper.open {
    pointer-events: auto;
    visibility: visible;
  }

  .nav-overlay {
    display: block;
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .nav-links-wrapper.open .nav-overlay {
    opacity: 1;
  }

  .nav-links {
    position: absolute;
    top: 0;
    right: 0;
    width: 280px;
    max-width: 80vw;
    height: 100%;
    flex-direction: column;
    align-items: stretch;
    background: rgba(15, 23, 42, 0.99);
    backdrop-filter: blur(16px);
    padding: 80px 1.25rem 2rem;
    gap: 0.25rem;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .nav-links.open {
    transform: translateX(0);
  }

  .nav-links a {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
    text-align: left;
  }

  .nav-links a:hover,
  .nav-links a.router-link-exact-active {
    background: rgba(255, 255, 255, 0.06);
  }

  .nav-cta-item {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav-cta {
    margin-left: 0 !important;
    text-align: center !important;
    padding: 0.75rem 1.25rem !important;
  }

  .nav-profile {
    justify-content: flex-start;
    width: 100%;
    padding: 0.65rem 1rem 0.65rem 0.65rem !important;
  }
}

/* ─── Small phones (≤ 480px) ─── */
@media (max-width: 480px) {
  .navbar-inner {
    padding: 0 0.75rem;
    height: 56px;
  }

  .navbar-brand {
    font-size: 1.05rem;
    gap: 0.35rem;
  }

  .brand-icon {
    font-size: 1.25rem;
  }

  .nav-links {
    padding-top: 72px;
    width: 100%;
    max-width: 100%;
    border-left: none;
  }
}

/* ─── Very small phones (≤ 360px) ─── */
@media (max-width: 360px) {
  .brand-text {
    font-size: 0.92rem;
  }
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const menuOpen = ref(false)
const scrolled = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

watch(() => route.path, closeMenu)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMenu()
}

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
</script>

<template>
  <nav class="navbar" :class="{ scrolled }">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand" @click="closeMenu">
        <span class="brand-icon">📝</span>
        <span class="brand-text">PersonalStatement.pro</span>
      </RouterLink>

      <!-- Desktop links -->
      <ul class="nav-links-desktop">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/analyzer">Analyzer</RouterLink></li>
        <li><RouterLink to="/blog">Blog</RouterLink></li>
        <li><RouterLink to="/jobs">Jobs</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
      </ul>

      <!-- Hamburger button -->
      <button
        class="hamburger"
        :class="{ active: menuOpen }"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="fade">
      <div v-if="menuOpen" class="mobile-overlay" @click="closeMenu"></div>
    </Transition>
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <ul class="mobile-links">
        <li><RouterLink to="/" @click="closeMenu">🏠 Home</RouterLink></li>
        <li><RouterLink to="/analyzer" @click="closeMenu">📊 Analyze Statement</RouterLink></li>
        <li><RouterLink to="/blog" @click="closeMenu">📰 Blog</RouterLink></li>
        <li><RouterLink to="/jobs" @click="closeMenu">💼 Job Prospects</RouterLink></li>
        <li><RouterLink to="/about" @click="closeMenu">ℹ️ About</RouterLink></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
/* ═══════ Base navbar ═══════ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #0f1a2e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.3s ease;
  padding-top: env(safe-area-inset-top, 0px);
}

.navbar.scrolled {
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.5);
  border-bottom-color: rgba(255, 255, 255, 0.15);
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

/* ═══════ Brand ═══════ */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.brand-icon {
  font-size: 1.35rem;
}

/* ═══════ Desktop nav links ═══════ */
.nav-links-desktop {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links-desktop a {
  display: block;
  padding: 0.5rem 0.85rem;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
}

.nav-links-desktop a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
}

.nav-links-desktop a.router-link-exact-active {
  color: #fff;
  background: rgba(59, 130, 246, 0.15);
}

.nav-cta {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
  color: #fff !important;
  padding: 0.45rem 1.15rem !important;
  border-radius: 8px !important;
  margin-left: 0.35rem;
  font-weight: 600 !important;
}

.nav-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.nav-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.75rem 0.3rem 0.3rem !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px !important;
  color: #fff !important;
  margin-left: 0.35rem;
}

.nav-profile:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.18);
}

.nav-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.nav-profile-name {
  font-size: 0.83rem;
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

/* ═══════ Hamburger ═══════ */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  padding: 10px 9px;
  z-index: 1100;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 0.2s;
}

.hamburger:hover,
.hamburger:active {
  border-color: rgba(255, 255, 255, 0.35);
}

.hamburger span {
  display: block;
  width: 20px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active {
  border-color: rgba(255, 255, 255, 0.3);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ═══════ Mobile overlay ═══════ */
.mobile-overlay {
  display: none;
}

/* ═══════ Mobile slide-in menu ═══════ */
.mobile-menu {
  display: none;
}

/* ═══════ Transition for overlay ═══════ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════
   MOBILE — ≤ 768px
   ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .nav-links-desktop {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1050;
    background: rgba(0, 0, 0, 0.6);
  }

  .mobile-menu {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    max-width: 85vw;
    z-index: 1060;
    background: #0f1a2e;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: env(safe-area-inset-top, 0px);
  }

  .mobile-menu.open {
    transform: translateX(0);
  }

  .mobile-links {
    list-style: none;
    padding: 80px 1rem 2rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mobile-links li a {
    display: block;
    padding: 14px 16px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 1.05rem;
    font-weight: 500;
    border-radius: 12px;
    transition: background 0.15s, color 0.15s;
  }

  .mobile-links li a:active {
    background: rgba(255, 255, 255, 0.08);
  }

  .mobile-links li a.router-link-exact-active {
    color: #fff;
    background: rgba(59, 130, 246, 0.15);
    font-weight: 600;
  }

  .mobile-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 8px 16px;
  }

  .mobile-cta {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
    color: #fff !important;
    text-align: center;
    font-weight: 600 !important;
    font-size: 1.05rem !important;
    padding: 14px 16px !important;
  }

  .mobile-profile-link {
    display: flex !important;
    align-items: center;
    gap: 12px;
  }

  .nav-avatar-lg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .mobile-profile-name {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
  }

  .mobile-profile-sub {
    display: block;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 1px;
  }

  .pro-tag-mobile {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }
}

/* ═══════ Small phones — ≤ 480px ═══════ */
@media (max-width: 480px) {
  .navbar-inner {
    padding: 0 0.75rem;
    height: 56px;
  }

  .navbar-brand {
    font-size: 1rem;
    gap: 0.35rem;
  }

  .brand-icon {
    font-size: 1.15rem;
  }

  .mobile-menu {
    width: 100%;
    max-width: 100%;
    border-left: none;
  }

  .mobile-links {
    padding-top: 68px;
  }
}

/* ═══════ Very small phones — ≤ 360px ═══════ */
@media (max-width: 360px) {
  .brand-text {
    font-size: 0.88rem;
  }
}
</style>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="app-wrapper">
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.main-content {
  flex: 1;
  padding: 64px 1.5rem 0;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .main-content {
    padding: 64px 1rem 0;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 56px 0.75rem 0;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const currentDateTime = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
})
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <h3 class="footer-brand">📝 Personal Statement Pro</h3>
          <p class="footer-desc">
            Professional personal statement analysis and improvement for students and job seekers. Elevate your applications with expert-level feedback.
          </p>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/analyzer">Statement Analyzer</RouterLink></li>
            <li><RouterLink to="/blog">Blog</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Contact</h4>
          <ul class="contact-list">
            <li>
              <span class="contact-icon">📧</span>
              <a href="mailto:hello@personalstatement.pro">hello@personalstatement.pro</a>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Hours & Info</h4>
          <ul class="contact-list">
            <li>
              <span class="contact-icon">🕐</span>
              <span>{{ currentDateTime }}</span>
            </li>
            <li>
              <span class="contact-icon">📅</span>
              <span>Mon – Fri: 9 AM – 6 PM<br>Sat – Sun: 10 AM – 4 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Personal Statement Pro. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #0f172a;
  color: rgba(255, 255, 255, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-brand {
  color: #fff;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.footer-desc {
  font-size: 0.875rem;
  line-height: 1.7;
}

.footer-col h4 {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  margin-bottom: 0.5rem;
}

.footer-col ul a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-col ul a:hover {
  color: #fff;
}

.contact-list li {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.contact-icon {
  flex-shrink: 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .footer-inner {
    padding: 2.5rem 1.25rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-brand {
    text-align: center;
    align-items: center;
  }

  .footer-bottom {
    font-size: 0.75rem;
  }
}
</style>

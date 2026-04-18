<script setup lang="ts">
import { RouterLink } from 'vue-router'

const roles = [
  { icon: '💼', title: 'Sales', desc: 'Persuasion-driven statements that close the deal.' },
  { icon: '🤝', title: 'Assistant', desc: 'Organised, proactive, and detail-oriented messaging.' },
  { icon: '📣', title: 'Marketing', desc: 'Creative narratives that showcase brand thinking.' },
  { icon: '🔒', title: 'Cyber Security', desc: 'Technical precision with risk-aware language.' },
  { icon: '⚙️', title: 'Engineering', desc: 'Problem-solving focus and systems-thinking clarity.' },
]

const features = [
  {
    icon: '🔍',
    title: 'Deep Analysis',
    desc: 'Your statement is reviewed with the same critical eye a top recruiter uses when sourcing candidates for Fortune 500 roles.',
  },
  {
    icon: '✍️',
    title: 'Extended Variations',
    desc: 'Receive 2–3 professionally rewritten variations of your statement, each tailored to a different tone and emphasis.',
  },
  {
    icon: '🎯',
    title: 'Role Matching',
    desc: 'We identify which career role your statement best suits — Sales, Marketing, Engineering, Cyber Security, or Assistant.',
  },
  {
    icon: '📊',
    title: 'Actionable Feedback',
    desc: 'Concrete suggestions on structure, vocabulary, impact, and clarity — not vague advice, but real improvements.',
  },
]
</script>

<template>
  <div class="landing">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">Trusted by 10,000+ applicants</span>
        <h1>Your Personal Statement,<br><span class="gradient-text">Perfected.</span></h1>
        <p class="hero-subtitle">
          Paste your personal statement and receive recruiter-grade feedback in seconds.
          Get tailored rewrites, role-specific suggestions, and the clarity you need to stand out.
        </p>
        <div class="hero-actions">
          <RouterLink to="/analyzer" class="btn btn-primary">Analyze My Statement</RouterLink>
          <a href="#how-it-works" class="btn btn-outline">See How It Works</a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <strong>50K+</strong>
            <span>Statements Analyzed</span>
          </div>
          <div class="stat">
            <strong>4.9★</strong>
            <span>User Rating</span>
          </div>
          <div class="stat">
            <strong>95%</strong>
            <span>Improvement Rate</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="preview-card">
          <div class="preview-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="preview-body">
            <div class="preview-line w80"></div>
            <div class="preview-line w100"></div>
            <div class="preview-line w60"></div>
            <div class="preview-spacer"></div>
            <div class="preview-badge-row">
              <span class="preview-badge blue">Role: Marketing</span>
              <span class="preview-badge green-badge">Score: 87/100</span>
            </div>
            <div class="preview-spacer"></div>
            <div class="preview-line w90"></div>
            <div class="preview-line w70"></div>
            <div class="preview-line w100"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="how-it-works" class="features-section">
      <div class="section-header">
        <span class="section-badge">How It Works</span>
        <h2>Professional-Grade Analysis<br>at Your Fingertips</h2>
        <p>Our analyzer evaluates your statement with the precision of a seasoned executive recruiter.</p>
      </div>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <span class="feature-icon">{{ feature.icon }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Roles Section -->
    <section class="roles-section">
      <div class="section-header">
        <span class="section-badge">Roles We Cover</span>
        <h2>Tailored for Every Career Path</h2>
        <p>Whether you're entering the workforce or making a career pivot, we match your statement to the role that fits best.</p>
      </div>
      <div class="roles-grid">
        <div v-for="role in roles" :key="role.title" class="role-card">
          <span class="role-icon">{{ role.icon }}</span>
          <h3>{{ role.title }}</h3>
          <p>{{ role.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Elevate Your Application?</h2>
        <p>Join thousands of students and professionals who've transformed their personal statements into interview-winning narratives.</p>
        <RouterLink to="/analyzer" class="btn btn-primary btn-lg">Get Started — It's Free</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing {
  width: 100%;
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 6rem 0 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  margin-bottom: 1.5rem;
}

.hero h1 {
  font-size: 3.25rem;
  font-weight: 800;
  line-height: 1.15;
  color: #fff;
  margin-bottom: 1.25rem;
  letter-spacing: -0.03em;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.btn-outline {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
}

.btn-lg {
  padding: 1rem 2.5rem;
  font-size: 1.05rem;
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
}

.stat strong {
  display: block;
  font-size: 1.4rem;
  color: #fff;
  font-weight: 700;
}

.stat span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
}

/* Preview Card */
.hero-visual {
  display: flex;
  justify-content: center;
}

.preview-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.preview-header {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #eab308; }
.dot.green { background: #22c55e; }

.preview-body {
  padding: 1.5rem;
}

.preview-line {
  height: 10px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 0.6rem;
}

.w60 { width: 60%; }
.w70 { width: 70%; }
.w80 { width: 80%; }
.w90 { width: 90%; }
.w100 { width: 100%; }

.preview-spacer {
  height: 0.75rem;
}

.preview-badge-row {
  display: flex;
  gap: 0.5rem;
}

.preview-badge {
  font-size: 0.7rem;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-weight: 600;
}

.preview-badge.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.preview-badge.green-badge {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

/* Sections */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-badge {
  display: inline-block;
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.section-header p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.55);
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Features */
.features-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  line-height: 1.7;
}

/* Roles */
.roles-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 0;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.25rem;
}

.role-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.75rem 1.25rem;
  text-align: center;
  transition: all 0.3s ease;
}

.role-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.role-icon {
  font-size: 2.25rem;
  display: block;
  margin-bottom: 0.75rem;
}

.role-card h3 {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.role-card p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  line-height: 1.6;
}

/* CTA */
.cta-section {
  padding: 5rem 0;
}

.cta-content {
  max-width: 650px;
  margin: 0 auto;
  text-align: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 3.5rem 2rem;
}

.cta-content h2 {
  font-size: 2rem;
  color: #fff;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.cta-content p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .roles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 4rem 1rem 3rem;
    gap: 2rem;
  }

  .hero h1 {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    margin: 0 auto 2rem;
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-stats {
    justify-content: center;
    gap: 1.5rem;
  }

  .hero-visual {
    order: -1;
  }

  .features-section {
    padding: 3rem 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .roles-section {
    padding: 3rem 1rem;
  }

  .roles-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-header h2 {
    font-size: 1.75rem;
  }

  .cta-section {
    padding: 3rem 1rem;
  }

  .cta-content {
    padding: 2.5rem 1.5rem;
  }

  .cta-content h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 2.5rem 0.5rem 2rem;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .hero-badge {
    font-size: 0.72rem;
    padding: 0.3rem 0.75rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
    text-align: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .stat {
    text-align: center;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .section-badge {
    font-size: 0.72rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .cta-content {
    padding: 2rem 1rem;
    border-radius: 16px;
  }

  .preview-card {
    max-width: 100%;
  }
}

@media (max-width: 360px) {
  .hero h1 {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.88rem;
  }
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const timeline = [
  {
    year: '2023',
    title: 'The Spark',
    desc: 'Frustrated by generic advice and expensive consultants, our founders set out to make personal statement guidance accessible to everyone.',
  },
  {
    year: '2024',
    title: 'Building the Engine',
    desc: 'We developed our AI-powered analysis tool — trained on thousands of successful statements across industries — and opened it to the public.',
  },
  {
    year: '2025',
    title: 'Growing Together',
    desc: 'Over 50,000 statements analyzed. We partnered with career centres, universities, and job-readiness nonprofits to extend our reach.',
  },
  {
    year: '2026',
    title: 'Looking Ahead',
    desc: 'Expanding into multilingual support, mentorship matching, and free workshops for underserved communities.',
  },
]

const values = [
  {
    icon: '🌍',
    title: 'Accessibility',
    desc: 'Great career guidance shouldn\'t depend on your postcode or bank balance. Our core tools are free — always.',
  },
  {
    icon: '🤝',
    title: 'Empowerment',
    desc: 'We don\'t write your story for you. We give you the clarity, structure, and confidence to tell it yourself.',
  },
  {
    icon: '💡',
    title: 'Transparency',
    desc: 'Every suggestion we make comes with an explanation. No black-box magic — you understand every change.',
  },
  {
    icon: '❤️',
    title: 'Community First',
    desc: 'We reinvest in the communities that trust us — through free workshops, open-source tools, and scholarship partnerships.',
  },
]

const communityEfforts = [
  {
    icon: '🎓',
    title: 'University Partnerships',
    desc: 'We work with career services at 30+ universities to provide free premium access to students who need it most.',
    stat: '30+',
    statLabel: 'partner universities',
  },
  {
    icon: '📚',
    title: 'Free Workshops',
    desc: 'Monthly virtual workshops on personal branding, statement writing, and interview preparation — open to everyone.',
    stat: '120+',
    statLabel: 'workshops held',
  },
  {
    icon: '🌱',
    title: 'Scholarship Fund',
    desc: 'A portion of every premium subscription funds our scholarship programme for first-generation university applicants.',
    stat: '£50K+',
    statLabel: 'awarded so far',
  },
  {
    icon: '🔓',
    title: 'Open Source',
    desc: 'Our blog content, writing guides, and community templates are freely available for educators and mentors to use.',
    stat: '500+',
    statLabel: 'free resources',
  },
]

const team = [
  { name: 'Alex Morgan', role: 'Co-Founder & CEO', emoji: '👩‍💻' },
  { name: 'James Okafor', role: 'Co-Founder & CTO', emoji: '👨‍💻' },
  { name: 'Priya Sharma', role: 'Head of Content', emoji: '✍️' },
  { name: 'Liam Chen', role: 'Community Lead', emoji: '🤝' },
]
</script>

<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <div class="hero-inner">
        <span class="hero-badge">Our Story</span>
        <h1>Helping People Tell<br /><span class="gradient-text">Their Best Story</span></h1>
        <p class="hero-subtitle">
          Personal Statement Pro was born from a simple belief: everyone deserves the tools
          to present themselves with confidence — regardless of background, experience, or budget.
        </p>
      </div>
    </section>

    <!-- Mission -->
    <section class="section mission-section">
      <div class="section-inner">
        <div class="mission-grid">
          <div class="mission-card">
            <span class="mission-icon">🎯</span>
            <h3>Our Mission</h3>
            <p>
              To democratise access to high-quality personal statement feedback so that every
              applicant — whether applying for their first job or their dream university —
              can put their best foot forward.
            </p>
          </div>
          <div class="mission-card">
            <span class="mission-icon">🔭</span>
            <h3>Our Vision</h3>
            <p>
              A world where opportunity isn't gatekept by who you know or what you can afford.
              Where a powerful personal statement is a skill anyone can develop, not a privilege
              reserved for the few.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Journey / Timeline -->
    <section class="section journey-section">
      <div class="section-inner">
        <h2 class="section-title">The Journey So Far</h2>
        <p class="section-subtitle">From a side project to a platform trusted by thousands.</p>
        <div class="timeline">
          <div v-for="(item, i) in timeline" :key="i" class="timeline-item">
            <div class="timeline-marker">
              <span class="timeline-year">{{ item.year }}</span>
              <span class="timeline-dot"></span>
            </div>
            <div class="timeline-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section values-section">
      <div class="section-inner">
        <h2 class="section-title">What We Stand For</h2>
        <p class="section-subtitle">The principles that guide everything we build.</p>
        <div class="values-grid">
          <div v-for="(v, i) in values" :key="i" class="value-card">
            <span class="value-icon">{{ v.icon }}</span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Giving Back -->
    <section class="section community-section">
      <div class="section-inner">
        <h2 class="section-title">Giving Back</h2>
        <p class="section-subtitle">
          We believe success is only meaningful when it's shared. Here's how we invest
          in the communities that trust us.
        </p>
        <div class="community-grid">
          <div v-for="(c, i) in communityEfforts" :key="i" class="community-card">
            <div class="community-card-top">
              <span class="community-icon">{{ c.icon }}</span>
              <div class="community-stat">
                <strong>{{ c.stat }}</strong>
                <span>{{ c.statLabel }}</span>
              </div>
            </div>
            <h3>{{ c.title }}</h3>
            <p>{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section team-section">
      <div class="section-inner">
        <h2 class="section-title">Meet the Team</h2>
        <p class="section-subtitle">A small team with a big mission.</p>
        <div class="team-grid">
          <div v-for="(t, i) in team" :key="i" class="team-card">
            <span class="team-emoji">{{ t.emoji }}</span>
            <h4>{{ t.name }}</h4>
            <p>{{ t.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="section-inner cta-inner">
        <h2>Ready to Perfect Your Statement?</h2>
        <p>Join thousands of applicants who've transformed their personal statements with our tools.</p>
        <div class="cta-actions">
          <RouterLink to="/analyzer" class="btn btn-primary">Try the Analyzer</RouterLink>
          <RouterLink to="/blog" class="btn btn-outline">Read the Blog</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ───── Global Section ───── */
.about-page {
  overflow-x: hidden;
}

.section {
  padding: 5rem 1.5rem;
}

.section-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  max-width: 560px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

/* ───── Hero ───── */
.about-hero {
  text-align: center;
  padding: 5rem 1.5rem 3rem;
  position: relative;
}

.about-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 65%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 50px;
  color: #60a5fa;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.about-hero h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto;
}

/* ───── Mission ───── */
.mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.mission-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  transition: border-color 0.3s ease;
}

.mission-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
}

.mission-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.mission-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.6rem;
}

.mission-card p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.92rem;
  line-height: 1.65;
}

/* ───── Timeline ───── */
.journey-section {
  background: rgba(255, 255, 255, 0.015);
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #3b82f6, #8b5cf6, rgba(139, 92, 246, 0.2));
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  padding-bottom: 2.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0.35rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  border: 3px solid #0b1120;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.timeline-year {
  font-size: 0.78rem;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.timeline-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.35rem;
}

.timeline-content p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.92rem;
  line-height: 1.6;
  max-width: 540px;
}

/* ───── Values ───── */
.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.value-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.75rem;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.value-card:hover {
  transform: translateY(-3px);
  border-color: rgba(59, 130, 246, 0.25);
}

.value-icon {
  font-size: 1.75rem;
  display: block;
  margin-bottom: 0.75rem;
}

.value-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
}

.value-card p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.88rem;
  line-height: 1.6;
}

/* ───── Community / Giving Back ───── */
.community-section {
  background: rgba(255, 255, 255, 0.015);
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.community-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.75rem;
  transition: border-color 0.3s ease;
}

.community-card:hover {
  border-color: rgba(52, 211, 153, 0.3);
}

.community-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.community-icon {
  font-size: 2rem;
}

.community-stat {
  text-align: right;
}

.community-stat strong {
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  color: #34d399;
  letter-spacing: -0.02em;
}

.community-stat span {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.community-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
}

.community-card p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.88rem;
  line-height: 1.6;
}

/* ───── Team ───── */
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.team-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 2rem 1.25rem;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.team-card:hover {
  transform: translateY(-3px);
  border-color: rgba(59, 130, 246, 0.25);
}

.team-emoji {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.team-card h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.2rem;
}

.team-card p {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.8rem;
}

/* ───── CTA ───── */
.cta-section {
  padding: 4rem 1.5rem 5rem;
}

.cta-inner {
  text-align: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.08));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  padding: 3.5rem 2rem;
}

.cta-inner h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.6rem;
  letter-spacing: -0.02em;
}

.cta-inner p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  margin-bottom: 2rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ───── Buttons ───── */
.btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  border: none;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-outline {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

/* ───── Responsive ───── */
@media (max-width: 768px) {
  .section {
    padding: 3.5rem 1.25rem;
  }

  .mission-grid,
  .values-grid,
  .community-grid {
    grid-template-columns: 1fr;
  }

  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-inner {
    padding: 2.5rem 1.5rem;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .team-grid {
    grid-template-columns: 1fr;
  }

  .section {
    padding: 2.5rem 0.75rem;
  }

  .about-hero h1 {
    font-size: 1.75rem;
  }

  .about-hero p {
    font-size: 0.92rem;
  }

  .section-header h2 {
    font-size: 1.4rem;
  }

  .timeline-item {
    padding-left: 1.5rem;
  }

  .cta-inner {
    padding: 2rem 1rem;
    border-radius: 16px;
  }

  .cta-inner h2 {
    font-size: 1.35rem;
  }
}
</style>

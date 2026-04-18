<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

interface JobRole {
  title: string
  icon: string
  salary: string
  level: string
  tags: string[]
  description: string
  responsibilities: string[]
  skills: string[]
  tools: string[]
  color: string
}

const jobs: JobRole[] = [
  {
    title: 'Customer Support Representative',
    icon: '🎧',
    salary: '$35K – $55K',
    level: 'Entry – Mid',
    tags: ['Support', 'Communication', 'Remote'],
    description:
      'Be the voice of the brand. Help customers resolve issues, answer questions, and ensure a top-tier experience — all from the comfort of your home.',
    responsibilities: [
      'Respond to customer enquiries via chat, email, and phone',
      'Troubleshoot product issues and escalate when needed',
      'Document interactions and maintain knowledge base articles',
      'Gather feedback to improve products and processes',
    ],
    skills: ['Excellent communication', 'Problem-solving', 'Empathy', 'Multitasking', 'Patience'],
    tools: ['Zendesk', 'Intercom', 'Slack', 'Notion'],
    color: '#3b82f6',
  },
  {
    title: 'Short Form Editor',
    icon: '🎬',
    salary: '$40K – $70K',
    level: 'Entry – Mid',
    tags: ['Video', 'Creative', 'Social Media'],
    description:
      'Turn raw footage into scroll-stopping content. Edit short-form videos for TikTok, Reels, and Shorts that capture attention in seconds.',
    responsibilities: [
      'Edit and produce short-form video content (15s – 90s)',
      'Add captions, transitions, sound design, and motion graphics',
      'Stay on top of trending formats and platform algorithms',
      'Collaborate with creators and marketing teams on content strategy',
    ],
    skills: ['Pacing & rhythm', 'Trend awareness', 'Visual storytelling', 'Attention to detail', 'Fast turnaround'],
    tools: ['Premiere Pro', 'CapCut', 'After Effects', 'DaVinci Resolve'],
    color: '#ef4444',
  },
  {
    title: 'Creative Designer',
    icon: '🎨',
    salary: '$45K – $80K',
    level: 'Mid – Senior',
    tags: ['Design', 'Branding', 'Visual'],
    description:
      'Shape how brands look and feel. Design everything from social media graphics to full brand identities — with creative freedom and remote flexibility.',
    responsibilities: [
      'Create visual assets for digital campaigns, social, and web',
      'Develop and maintain brand style guides',
      'Collaborate with marketing and product teams on creative briefs',
      'Present concepts and iterate based on feedback',
    ],
    skills: ['Typography', 'Layout & composition', 'Brand thinking', 'Colour theory', 'Conceptual ideation'],
    tools: ['Figma', 'Adobe Creative Suite', 'Canva', 'Blender'],
    color: '#a855f7',
  },
  {
    title: 'Copywriter',
    icon: '✍️',
    salary: '$40K – $75K',
    level: 'Entry – Senior',
    tags: ['Writing', 'Marketing', 'Content'],
    description:
      'Words that sell, inspire, and convert. Craft compelling copy for websites, ads, emails, and campaigns that drive real results.',
    responsibilities: [
      'Write persuasive copy for landing pages, ads, and emails',
      'Develop brand voice and messaging frameworks',
      'A/B test headlines and CTAs for conversion optimisation',
      'Research audiences and competitors to inform strategy',
    ],
    skills: ['Persuasive writing', 'SEO knowledge', 'Research', 'Brand voice adaptation', 'Editing & proofing'],
    tools: ['Google Docs', 'Grammarly', 'Hemingway', 'Ahrefs'],
    color: '#f59e0b',
  },
  {
    title: 'Full-Stack Developer',
    icon: '💻',
    salary: '$70K – $130K',
    level: 'Mid – Senior',
    tags: ['Engineering', 'Web', 'Technical'],
    description:
      'Build the products people use every day. Work across the entire stack — from pixel-perfect frontends to robust APIs and databases.',
    responsibilities: [
      'Design, build, and maintain web applications end-to-end',
      'Write clean, tested, and well-documented code',
      'Collaborate with designers and product managers on features',
      'Optimise performance, security, and scalability',
    ],
    skills: ['JavaScript / TypeScript', 'React or Vue', 'Node.js', 'SQL & NoSQL databases', 'System design'],
    tools: ['VS Code', 'Git', 'Docker', 'AWS / Vercel'],
    color: '#10b981',
  },
  {
    title: 'Vlog Editor',
    icon: '📹',
    salary: '$40K – $75K',
    level: 'Entry – Mid',
    tags: ['Video', 'YouTube', 'Storytelling'],
    description:
      'Turn hours of footage into engaging stories. Edit vlogs for YouTube creators — pacing, music, colour grading, and narrative all in your hands.',
    responsibilities: [
      'Edit long-form vlog content (8 – 30+ minutes)',
      'Craft compelling story arcs from raw footage',
      'Handle colour correction, audio mixing, and sound design',
      'Create thumbnails, intros, and end screens',
    ],
    skills: ['Narrative pacing', 'Colour grading', 'Audio mixing', 'Thumbnail design', 'Creator collaboration'],
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Photoshop', 'Frame.io'],
    color: '#ec4899',
  },
]

const selectedJob = ref<JobRole | null>(null)
const searchQuery = ref('')

const filteredJobs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return jobs
  return jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(q) ||
      j.tags.some((t) => t.toLowerCase().includes(q)) ||
      j.description.toLowerCase().includes(q)
  )
})

function openJob(job: JobRole) {
  selectedJob.value = job
  document.body.style.overflow = 'hidden'
}

function closeJob() {
  selectedJob.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <div class="jobs-page">
    <!-- Hero -->
    <section class="jobs-hero">
      <div class="hero-inner">
        <span class="hero-badge">🌍 Work From Anywhere</span>
        <h1>Remote Job<br /><span class="gradient-text">Prospects</span></h1>
        <p class="hero-subtitle">
          Explore in-demand remote roles perfect for flexible lifestyles. Each role includes
          salary expectations, key skills, and the tools you'll need to succeed.
        </p>
        <!-- Search -->
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search roles, skills, or tags..."
          />
        </div>
      </div>
    </section>

    <!-- Job Cards Grid -->
    <section class="jobs-section">
      <div class="section-inner">
        <div v-if="filteredJobs.length" class="jobs-grid">
          <button
            v-for="(job, i) in filteredJobs"
            :key="i"
            class="job-card"
            @click="openJob(job)"
          >
            <div class="card-top">
              <span class="card-icon" :style="{ background: job.color + '18' }">{{ job.icon }}</span>
              <span class="card-level">{{ job.level }}</span>
            </div>
            <h3 class="card-title">{{ job.title }}</h3>
            <p class="card-desc">{{ job.description }}</p>
            <div class="card-tags">
              <span v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="card-footer">
              <span class="card-salary" :style="{ color: job.color }">{{ job.salary }}</span>
              <span class="card-arrow">→</span>
            </div>
          </button>
        </div>
        <div v-else class="no-results">
          <span class="no-results-icon">🔍</span>
          <p>No roles match "<strong>{{ searchQuery }}</strong>". Try a different search term.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="section-inner cta-inner">
        <h2>Ready to Apply?</h2>
        <p>Make sure your personal statement is polished and role-ready before you hit submit.</p>
        <div class="cta-actions">
          <RouterLink to="/analyzer" class="btn btn-primary">Analyze My Statement</RouterLink>
          <RouterLink to="/blog" class="btn btn-outline">Read Career Tips</RouterLink>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedJob" class="modal-overlay" @click.self="closeJob">
          <div class="modal-content">
            <button class="modal-close" @click="closeJob" aria-label="Close">✕</button>

            <div class="modal-header" :style="{ borderColor: selectedJob.color + '40' }">
              <span class="modal-icon" :style="{ background: selectedJob.color + '18' }">{{ selectedJob.icon }}</span>
              <div>
                <h2>{{ selectedJob.title }}</h2>
                <div class="modal-meta">
                  <span class="meta-salary" :style="{ color: selectedJob.color }">{{ selectedJob.salary }}</span>
                  <span class="meta-divider">·</span>
                  <span class="meta-level">{{ selectedJob.level }}</span>
                </div>
              </div>
            </div>

            <p class="modal-desc">{{ selectedJob.description }}</p>

            <div class="modal-section">
              <h3>Key Responsibilities</h3>
              <ul>
                <li v-for="(r, i) in selectedJob.responsibilities" :key="i">{{ r }}</li>
              </ul>
            </div>

            <div class="modal-section">
              <h3>Skills You'll Need</h3>
              <div class="skill-tags">
                <span
                  v-for="s in selectedJob.skills"
                  :key="s"
                  class="skill-tag"
                  :style="{ borderColor: selectedJob.color + '35', color: selectedJob.color }"
                >{{ s }}</span>
              </div>
            </div>

            <div class="modal-section">
              <h3>Common Tools</h3>
              <div class="tool-tags">
                <span v-for="t in selectedJob.tools" :key="t" class="tool-tag">{{ t }}</span>
              </div>
            </div>

            <RouterLink to="/analyzer" class="modal-cta" :style="{ background: selectedJob.color }" @click="closeJob">
              Prepare My Statement for This Role →
            </RouterLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ───── Page ───── */
.jobs-page {
  overflow-x: hidden;
}

/* ───── Hero ───── */
.jobs-hero {
  text-align: center;
  padding: 5rem 1.5rem 2.5rem;
  position: relative;
}

.jobs-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 65%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  max-width: 660px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 50px;
  color: #34d399;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.jobs-hero h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

/* Search */
.search-bar {
  position: relative;
  max-width: 440px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.search-bar input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 0.92rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-bar input:focus {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* ───── Jobs Grid ───── */
.jobs-section {
  padding: 2rem 1.5rem 4rem;
}

.section-inner {
  max-width: 1060px;
  margin: 0 auto;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* ───── Job Card ───── */
.job-card {
  text-align: left;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.75rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.job-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-level {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.card-desc {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
  line-height: 1.55;
  flex: 1;
  margin-bottom: 1rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.tag {
  padding: 0.2rem 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.card-salary {
  font-size: 0.9rem;
  font-weight: 700;
}

.card-arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.job-card:hover .card-arrow {
  transform: translateX(4px);
  color: rgba(255, 255, 255, 0.6);
}

/* No results */
.no-results {
  text-align: center;
  padding: 4rem 1rem;
}

.no-results-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.no-results p {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.95rem;
}

.no-results strong {
  color: rgba(255, 255, 255, 0.7);
}

/* ───── CTA ───── */
.cta-section {
  padding: 0 1.5rem 5rem;
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
  max-width: 460px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

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

/* ───── Modal ───── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  position: relative;
  max-width: 580px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Modal header */
.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 0.2rem;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.meta-salary {
  font-weight: 700;
}

.meta-divider {
  color: rgba(255, 255, 255, 0.2);
}

.meta-level {
  color: rgba(255, 255, 255, 0.45);
}

.modal-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.92rem;
  line-height: 1.65;
  margin-bottom: 1.5rem;
}

/* Modal sections */
.modal-section {
  margin-bottom: 1.5rem;
}

.modal-section h3 {
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.modal-section ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-section li {
  position: relative;
  padding-left: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.88rem;
  line-height: 1.5;
}

.modal-section li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: rgba(255, 255, 255, 0.25);
}

.skill-tags,
.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.skill-tag {
  padding: 0.3rem 0.75rem;
  background: transparent;
  border: 1px solid;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tool-tag {
  padding: 0.3rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.modal-cta {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.85rem;
  border-radius: 12px;
  color: #fff;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.modal-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.95) translateY(10px);
}

.modal-leave-to .modal-content {
  transform: scale(0.97) translateY(5px);
}

/* ───── Responsive ───── */
@media (max-width: 900px) {
  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1.5rem;
    max-height: 90vh;
  }

  .cta-inner {
    padding: 2.5rem 1.5rem;
  }

  .search-row {
    flex-direction: column;
  }

  .search-row select,
  .search-row input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .prospects-header h1 {
    font-size: 1.5rem;
  }

  .prospects-header p {
    font-size: 0.88rem;
  }

  .job-card {
    padding: 1.25rem;
  }

  .modal-content {
    padding: 1.25rem;
    margin: 0.5rem;
  }

  .cta-inner h2 {
    font-size: 1.35rem;
  }
}
</style>

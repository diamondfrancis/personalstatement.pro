<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { blogPosts } from '../data/blogPosts'

const tagColors: Record<string, string> = {
  Opinion: '#8b5cf6',
  Advice: '#3b82f6',
  Guide: '#22c55e',
  Strategy: '#f59e0b',
  'Career Change': '#ec4899',
}
</script>

<template>
  <div class="blog-page">
    <div class="blog-header">
      <span class="section-badge">Our Blog</span>
      <h1>Insights & <span class="gradient-text">Advice</span></h1>
      <p>Expert guidance on writing personal statements that open doors — from the Personal Statement Pro team.</p>
    </div>

    <div class="blog-grid">
      <RouterLink
        v-for="post in blogPosts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="blog-card"
      >
        <div class="card-tag" :style="{ background: tagColors[post.tag] || '#3b82f6' }">
          {{ post.tag }}
        </div>
        <h2>{{ post.title }}</h2>
        <p class="card-excerpt">{{ post.excerpt }}</p>
        <div class="card-meta">
          <span>{{ post.date }}</span>
          <span class="meta-dot">·</span>
          <span>{{ post.readTime }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 0 3rem;
}

.blog-header {
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

.blog-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-header p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.05rem;
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.7;
}

.blog-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.blog-card {
  display: block;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.blog-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.card-tag {
  display: inline-block;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.blog-card h2 {
  color: #fff;
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.35;
}

.card-excerpt {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
}

.meta-dot {
  font-size: 0.6rem;
}

@media (max-width: 768px) {
  .blog-header h1 {
    font-size: 1.75rem;
  }

  .blog-card {
    padding: 1.5rem;
  }

  .blog-card h2 {
    font-size: 1.15rem;
  }
}

@media (max-width: 480px) {
  .blog-header h1 {
    font-size: 1.35rem;
  }

  .blog-header p {
    font-size: 0.88rem;
  }

  .blog-card {
    padding: 1.25rem;
  }

  .blog-card h2 {
    font-size: 1.05rem;
  }

  .meta-row {
    flex-wrap: wrap;
    gap: 0.35rem;
  }
}
</style>

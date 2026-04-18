<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getPostBySlug } from '../data/blogPosts'

const route = useRoute()
const post = computed(() => getPostBySlug(route.params.slug as string))

function renderContent(raw: string): string {
  return raw
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const text = trimmed.slice(2, -2)
        return `<h3>${text}</h3>`
      }
      const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      return `<p>${withBold}</p>`
    })
    .join('')
}
</script>

<template>
  <div class="post-page" v-if="post">
    <div class="post-nav">
      <RouterLink to="/blog" class="back-link">← All Posts</RouterLink>
    </div>

    <article class="post-article">
      <header class="post-header">
        <span class="post-tag">{{ post.tag }}</span>
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span>{{ post.author }}</span>
          <span class="meta-dot">·</span>
          <span>{{ post.date }}</span>
          <span class="meta-dot">·</span>
          <span>{{ post.readTime }}</span>
        </div>
      </header>

      <div class="post-body" v-html="renderContent(post.content)"></div>

      <div class="post-cta">
        <h3>Ready to improve your statement?</h3>
        <p>Paste your personal statement into our analyzer and get instant, recruiter-grade feedback.</p>
        <RouterLink to="/analyzer" class="btn btn-primary">Analyze My Statement</RouterLink>
      </div>
    </article>
  </div>

  <div class="post-page not-found" v-else>
    <h1>Post not found</h1>
    <p>The blog post you're looking for doesn't exist.</p>
    <RouterLink to="/blog" class="btn btn-outline">← Back to Blog</RouterLink>
  </div>
</template>

<style scoped>
.post-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 0 4rem;
}

.post-nav {
  margin-bottom: 2rem;
}

.back-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #fff;
}

.post-header {
  margin-bottom: 2.5rem;
}

.post-tag {
  display: inline-block;
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

.post-header h1 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}

.meta-dot {
  font-size: 0.6rem;
}

/* Post body rendered HTML */
.post-body :deep(p) {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.9;
  margin-bottom: 1.25rem;
}

.post-body :deep(h3) {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.post-body :deep(strong) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

/* CTA at bottom */
.post-cta {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  text-align: center;
}

.post-cta h3 {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.post-cta p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  line-height: 1.6;
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
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* Not found */
.not-found {
  text-align: center;
  padding-top: 6rem;
}

.not-found h1 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.not-found p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .post-header h1 {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .post-header h1 {
    font-size: 1.3rem;
  }

  .article-content {
    font-size: 0.92rem;
  }

  .back-link {
    font-size: 0.85rem;
  }
}
</style>

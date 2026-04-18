<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { isAuthenticated, isPro } = useAuth()

const statement = ref('')
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const showProModal = ref(false)

interface WordStats {
  totalWords: number
  totalCharacters: number
  totalCharactersNoSpaces: number
  totalSentences: number
  totalParagraphs: number
  avgWordsPerSentence: number
  avgWordLength: number
  readingTimeSeconds: number
  longestWord: string
  mostUsedWords: { word: string; count: number }[]
  uniqueWordCount: number
  vocabularyRichness: number
}

interface AnalysisResult {
  score: number
  bestRole: string
  strengths: string[]
  improvements: string[]
  variations: { title: string; text: string }[]
  wordStats: WordStats
}

const result = ref<AnalysisResult | null>(null)

function computeWordStats(text: string): WordStats {
  const trimmed = text.trim()
  const words = trimmed.split(/\s+/).filter(w => w.length > 0)
  const totalWords = words.length
  const totalCharacters = trimmed.length
  const totalCharactersNoSpaces = trimmed.replace(/\s/g, '').length
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const totalSentences = sentences.length
  const totalParagraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1
  const avgWordsPerSentence = totalSentences > 0 ? Math.round((totalWords / totalSentences) * 10) / 10 : 0
  const avgWordLength = totalWords > 0 ? Math.round((words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0) / totalWords) * 10) / 10 : 0
  const readingTimeSeconds = Math.round((totalWords / 200) * 60)
  const longestWord = words.reduce((a, b) => b.replace(/[^a-zA-Z]/g, '').length > a.replace(/[^a-zA-Z]/g, '').length ? b : a, '')

  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','is','it','that','this','was','are','be','has','had','have','with','as','by','from','not','will','can','do','if','my','i','we','our','they','them','their','me','he','she','his','her'])
  const freq: Record<string, number> = {}
  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z']/g, '')
    if (clean.length > 2 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1
    }
  }
  const mostUsedWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }))

  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z']/g, '')))
  const uniqueWordCount = uniqueWords.size
  const vocabularyRichness = totalWords > 0 ? Math.round((uniqueWordCount / totalWords) * 100) : 0

  return {
    totalWords, totalCharacters, totalCharactersNoSpaces, totalSentences,
    totalParagraphs, avgWordsPerSentence, avgWordLength, readingTimeSeconds,
    longestWord, mostUsedWords, uniqueWordCount, vocabularyRichness,
  }
}

function formatReadingTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

const wordCount = computed(() => {
  const trimmed = statement.value.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
})

const roleKeywords: Record<string, string[]> = {
  Sales: [
    'revenue', 'target', 'client', 'customer', 'negotiate', 'persuade', 'close',
    'deal', 'pipeline', 'quota', 'relationship', 'growth', 'prospect', 'sell',
    'commission', 'account', 'business development', 'pitch', 'objection',
  ],
  Marketing: [
    'brand', 'campaign', 'content', 'social media', 'seo', 'digital', 'creative',
    'strategy', 'engagement', 'audience', 'analytics', 'market research', 'storytelling',
    'copywriting', 'advertising', 'promotion', 'outreach', 'funnel',
  ],
  'Cyber Security': [
    'security', 'threat', 'vulnerability', 'risk', 'compliance', 'firewall', 'network',
    'penetration', 'encryption', 'incident', 'audit', 'malware', 'phishing', 'protect',
    'cyber', 'information security', 'soc', 'forensic', 'ethical hacking',
  ],
  Engineering: [
    'build', 'develop', 'code', 'software', 'system', 'design', 'technical', 'architecture',
    'algorithm', 'database', 'api', 'performance', 'solution', 'infrastructure',
    'scalable', 'deploy', 'agile', 'testing', 'debug', 'programming',
  ],
  Assistant: [
    'organise', 'organize', 'schedule', 'coordinate', 'support', 'administrative',
    'calendar', 'communication', 'detail', 'prioritise', 'prioritize', 'multitask',
    'minutes', 'filing', 'correspondence', 'diary', 'efficient', 'proactive',
  ],
}

function detectBestRole(text: string): { role: string; scores: Record<string, number> } {
  const lower = text.toLowerCase()
  const scores: Record<string, number> = {}

  for (const [role, keywords] of Object.entries(roleKeywords)) {
    let count = 0
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      const matches = lower.match(regex)
      if (matches) count += matches.length
    }
    scores[role] = count
  }

  const maxScore = Math.max(...Object.values(scores))
  const bestRole = maxScore === 0
    ? 'General'
    : Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0]

  return { role: bestRole, scores }
}

function analyzeStatement(text: string): AnalysisResult {
  const words = text.trim().split(/\s+/)
  const wordLen = words.length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const avgSentenceLen = wordLen / Math.max(sentences.length, 1)

  const { role, scores } = detectBestRole(text)

  // Scoring
  let score = 50
  if (wordLen >= 100 && wordLen <= 500) score += 15
  else if (wordLen >= 50) score += 8
  if (avgSentenceLen >= 10 && avgSentenceLen <= 25) score += 10
  if (text.includes(',')) score += 3
  // Action verbs
  const actionVerbs = ['achieved', 'led', 'managed', 'developed', 'created', 'improved', 'delivered', 'implemented', 'designed', 'coordinated', 'increased', 'reduced', 'built', 'launched']
  const actionCount = actionVerbs.filter(v => text.toLowerCase().includes(v)).length
  score += Math.min(actionCount * 3, 15)
  // Specificity
  if (/\d+%|\d+ percent/i.test(text)) score += 5
  if (/\d{4}/.test(text)) score += 2
  score = Math.min(score, 98)

  // Strengths
  const strengths: string[] = []
  if (wordLen >= 100) strengths.push('Good length — provides adequate detail for the reader.')
  if (actionCount >= 2) strengths.push('Effective use of action verbs demonstrates impact and initiative.')
  if (avgSentenceLen >= 10 && avgSentenceLen <= 25) strengths.push('Well-structured sentences maintain reader engagement.')
  if (/\d+%|\d+ percent/i.test(text)) strengths.push('Includes quantifiable achievements — highly persuasive.')
  if (strengths.length === 0) strengths.push('Shows willingness and enthusiasm — a solid starting point.')

  // Improvements
  const improvements: string[] = []
  if (wordLen < 100) improvements.push('Expand your statement to at least 100 words to give recruiters a fuller picture of your capabilities.')
  if (actionCount < 2) improvements.push('Incorporate more action verbs (e.g., "achieved", "led", "delivered") to convey leadership and results.')
  if (avgSentenceLen > 25) improvements.push('Break long sentences into shorter, punchier ones for better readability.')
  if (avgSentenceLen < 10 && sentences.length > 1) improvements.push('Develop your sentences further — short fragments read as incomplete thoughts.')
  if (!/\d/.test(text)) improvements.push('Add specific numbers or percentages to quantify your achievements.')
  if (improvements.length === 0) improvements.push('Consider adding a brief mention of career goals to show forward-thinking direction.')

  // Generate variations
  const variations = generateVariations(text, role)

  const wordStats = computeWordStats(text)

  return { score, bestRole: role, strengths, improvements, variations, wordStats }
}

function generateVariations(text: string, role: string): { title: string; text: string }[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).map(s => s.trim())

  const openers: Record<string, string[]> = {
    Sales: [
      'A results-driven professional with a proven track record in revenue generation and client acquisition',
      'An accomplished sales strategist passionate about building lasting client relationships and exceeding targets',
      'A dynamic business development specialist adept at identifying opportunities and delivering measurable growth',
    ],
    Marketing: [
      'A creative marketing professional with extensive experience in brand strategy and audience engagement',
      'An innovative digital marketing specialist skilled in crafting campaigns that resonate and convert',
      'A strategic communicator with a passion for storytelling and data-driven marketing excellence',
    ],
    'Cyber Security': [
      'A detail-oriented cyber security professional committed to protecting organisational assets and mitigating risk',
      'An analytical security specialist with expertise in threat assessment, compliance, and incident response',
      'A vigilant information security practitioner dedicated to safeguarding critical infrastructure and sensitive data',
    ],
    Engineering: [
      'A technically adept engineer with a passion for building scalable, efficient solutions to complex problems',
      'An innovative software professional with a strong foundation in system design and performance optimisation',
      'A methodical problem-solver skilled in developing robust architectures and delivering clean, maintainable code',
    ],
    Assistant: [
      'A highly organised and proactive professional excelling in administrative support and cross-functional coordination',
      'An efficient and detail-oriented assistant with a talent for streamlining operations and managing competing priorities',
      'A dependable administrative professional committed to enabling executive productivity and seamless office management',
    ],
    General: [
      'A dedicated and adaptable professional with a strong work ethic and commitment to continuous improvement',
      'A motivated individual eager to contribute meaningful value through collaboration, initiative, and discipline',
      'An ambitious professional driven by a desire to grow, learn, and make a measurable impact in every role',
    ],
  }

  const closers: string[][] = [
    [
      'I am eager to bring my expertise and determination to a team that values performance and integrity.',
      'My goal is to leverage these competencies in a role where I can drive real, sustainable impact.',
    ],
    [
      'I thrive in fast-paced environments and am committed to exceeding expectations at every opportunity.',
      'I look forward to contributing to an organisation where ambition and results are recognised and rewarded.',
    ],
    [
      'I am seeking a role that challenges my skills while allowing me to develop into a stronger leader.',
      'My ambition is to join a forward-thinking team where dedication and innovation are truly valued.',
    ],
  ]

  const roleOpeners = openers[role] ?? openers.General!
  const middleContent = sentences.length > 1 ? sentences.slice(0, 3).join('. ') + '.' : sentences[0] || ''

  return roleOpeners.map((opener, i) => {
    const closer = closers[i % closers.length]!
    const variation = `${opener}. ${middleContent} ${closer[i % closer.length]!}`
    return {
      title: `Variation ${i + 1} — ${['Confident & Direct', 'Passionate & Driven', 'Strategic & Composed'][i]}`,
      text: variation,
    }
  })
}

function handleAnalyze() {
  if (statement.value.trim().length < 20) return
  isAnalyzing.value = true
  analysisComplete.value = false

  // Simulate processing delay
  setTimeout(() => {
    result.value = analyzeStatement(statement.value)
    isAnalyzing.value = false
    analysisComplete.value = true
  }, 1500)
}

function handleReset() {
  statement.value = ''
  result.value = null
  analysisComplete.value = false
}

function handleProClick() {
  if (isPro.value) return
  if (!isAuthenticated.value) {
    router.push('/auth')
    return
  }
  showProModal.value = true
}

function handleUnlockPro() {
  // Redirect to pricing page for payment
  showProModal.value = false
  router.push('/pricing')
}

function copyVariation(text: string) {
  navigator.clipboard.writeText(text)
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  return '#ef4444'
}
</script>

<template>
  <div class="analyzer-page">
    <div class="analyzer-header">
      <h1>Statement <span class="gradient-text">Analyzer</span></h1>
      <p>Paste your personal statement below and receive professional-grade feedback, role matching, and rewritten variations.</p>
    </div>

    <!-- Input Section -->
    <div class="analyzer-input-section" v-if="!analysisComplete">
      <div class="textarea-wrapper">
        <textarea
          v-model="statement"
          placeholder="Paste your personal statement here..."
          rows="10"
          :disabled="isAnalyzing"
        ></textarea>
        <div class="textarea-footer">
          <span class="word-count">{{ wordCount }} words</span>
          <span v-if="wordCount > 0 && wordCount < 20" class="word-warning">Minimum 20 words required</span>
        </div>
      </div>
      <button
        class="btn btn-primary btn-analyze"
        :disabled="wordCount < 20 || isAnalyzing"
        @click="handleAnalyze"
      >
        <span v-if="isAnalyzing" class="spinner"></span>
        {{ isAnalyzing ? 'Analyzing...' : 'Analyze My Statement' }}
      </button>
    </div>

    <!-- Results Section -->
    <div v-if="analysisComplete && result" class="results-section">
      <!-- Score & Role -->
      <div class="results-top">
        <div class="score-card">
          <div class="score-circle" :style="{ borderColor: scoreColor(result.score) }">
            <span class="score-number" :style="{ color: scoreColor(result.score) }">{{ result.score }}</span>
            <span class="score-label">/ 100</span>
          </div>
          <p class="score-title">Statement Score</p>
        </div>
        <div class="role-card">
          <span class="role-badge">Best-Matched Role</span>
          <h2 class="role-name">{{ result.bestRole }}</h2>
          <p class="role-desc">Your statement aligns most closely with <strong>{{ result.bestRole }}</strong> roles based on keyword analysis, tone, and content structure.</p>
        </div>
      </div>

      <!-- Strengths & Improvements -->
      <div class="feedback-grid">
        <div class="feedback-card strengths">
          <h3>✅ Strengths</h3>
          <ul>
            <li v-for="(s, i) in result.strengths" :key="i">{{ s }}</li>
          </ul>
        </div>
        <div class="feedback-card improvements">
          <h3>💡 Areas for Improvement</h3>
          <ul>
            <li v-for="(imp, i) in result.improvements" :key="i">{{ imp }}</li>
          </ul>
        </div>
      </div>

      <!-- Variations -->
      <div class="variations-section">
        <h2>📝 Rewritten Variations</h2>
        <p class="variations-desc">Each variation takes your core message and reimagines it with a different professional tone. Copy any that resonate with you.</p>
        <div class="variations-list">
          <div v-for="(v, i) in result.variations" :key="i" class="variation-card">
            <div class="variation-header">
              <h4>{{ v.title }}</h4>
              <button class="copy-btn" @click="copyVariation(v.text)">📋 Copy</button>
            </div>
            <p>{{ v.text }}</p>
          </div>
        </div>
      </div>

      <!-- Pro Word Count Analytics -->
      <div class="pro-section">
        <div class="pro-header">
          <div class="pro-title-row">
            <h2>📊 Word Count Analytics</h2>
            <span class="pro-badge">PRO</span>
          </div>
          <p class="pro-desc">Detailed breakdown of your statement's structure, vocabulary richness, reading time, and word frequency.</p>
        </div>

        <div v-if="isPro" class="pro-content">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ result.wordStats.totalWords }}</span>
              <span class="stat-label">Words</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ result.wordStats.totalCharacters }}</span>
              <span class="stat-label">Characters</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ result.wordStats.totalCharactersNoSpaces }}</span>
              <span class="stat-label">Chars (no spaces)</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ result.wordStats.totalSentences }}</span>
              <span class="stat-label">Sentences</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ result.wordStats.totalParagraphs }}</span>
              <span class="stat-label">Paragraphs</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ result.wordStats.avgWordsPerSentence }}</span>
              <span class="stat-label">Avg words/sentence</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ result.wordStats.avgWordLength }}</span>
              <span class="stat-label">Avg word length</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatReadingTime(result.wordStats.readingTimeSeconds) }}</span>
              <span class="stat-label">Reading time</span>
            </div>
          </div>

          <div class="pro-details-grid">
            <div class="pro-detail-card">
              <h4>🏆 Vocabulary Richness</h4>
              <div class="richness-bar-wrapper">
                <div class="richness-bar" :style="{ width: result.wordStats.vocabularyRichness + '%' }"></div>
              </div>
              <p class="richness-text">{{ result.wordStats.vocabularyRichness }}% — {{ result.wordStats.uniqueWordCount }} unique words out of {{ result.wordStats.totalWords }}</p>
            </div>
            <div class="pro-detail-card">
              <h4>📖 Longest Word</h4>
              <p class="longest-word">{{ result.wordStats.longestWord }}</p>
            </div>
          </div>

          <div class="word-freq-card" v-if="result.wordStats.mostUsedWords.length">
            <h4>🔤 Most Frequent Keywords</h4>
            <div class="freq-list">
              <div v-for="(w, i) in result.wordStats.mostUsedWords" :key="i" class="freq-item">
                <span class="freq-rank">#{{ i + 1 }}</span>
                <span class="freq-word">{{ w.word }}</span>
                <span class="freq-bar-wrapper">
                  <span class="freq-bar" :style="{ width: (w.count / result.wordStats.mostUsedWords[0]!.count * 100) + '%' }"></span>
                </span>
                <span class="freq-count">{{ w.count }}×</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="pro-locked" @click="handleProClick">
          <div class="pro-locked-overlay">
            <div class="lock-icon">🔒</div>
            <h3>Unlock Pro Analytics</h3>
            <p>Get word count, reading time, vocabulary richness, keyword frequency, and more.</p>
            <button class="btn btn-pro">Unlock for £4.99/month</button>
          </div>
          <div class="pro-preview-blur">
            <div class="stats-grid">
              <div class="stat-item" v-for="n in 8" :key="n">
                <span class="stat-value">—</span>
                <span class="stat-label">••••••</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-outline btn-reset" @click="handleReset">← Analyze Another Statement</button>
    </div>

    <!-- Pro Modal -->
    <Teleport to="body">
      <div v-if="showProModal" class="modal-overlay" @click.self="showProModal = false">
        <div class="modal">
          <button class="modal-close" @click="showProModal = false">×</button>
          <div class="modal-badge">PRO</div>
          <h2>Upgrade to Personal Statement Pro+</h2>
          <p class="modal-desc">Unlock advanced word count analytics to take your personal statement to the next level.</p>
          <ul class="modal-features">
            <li>✓ Total words, characters & sentences</li>
            <li>✓ Reading time estimate</li>
            <li>✓ Vocabulary richness score</li>
            <li>✓ Keyword frequency analysis</li>
            <li>✓ Average sentence & word length</li>
            <li>✓ Paragraph structure breakdown</li>
          </ul>
          <div class="modal-pricing">
            <span class="modal-price">£4.99</span>
            <span class="modal-period">/month</span>
          </div>
          <button class="btn btn-pro btn-lg" @click="handleUnlockPro">Unlock Pro Now</button>
          <p class="modal-note">Cancel anytime. 7-day free trial included.</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.analyzer-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 0 3rem;
}

.analyzer-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.analyzer-header h1 {
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

.analyzer-header p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Input */
.analyzer-input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.textarea-wrapper {
  width: 100%;
  margin-bottom: 1.25rem;
}

textarea {
  width: 100%;
  padding: 1.25rem;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.8;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0 0.25rem;
}

.word-count {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.word-warning {
  font-size: 0.8rem;
  color: #eab308;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-analyze {
  padding: 0.85rem 2.5rem;
}

.btn-reset {
  margin-top: 2rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Results */
.results-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.results-top {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.score-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.score-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.role-card {
  padding: 2rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.role-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a78bfa;
  margin-bottom: 0.5rem;
}

.role-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.5rem;
}

.role-desc {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  line-height: 1.7;
}

/* Feedback */
.feedback-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.feedback-card {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.feedback-card h3 {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.feedback-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feedback-card li {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.88rem;
  line-height: 1.7;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.feedback-card li:last-child {
  border-bottom: none;
}

.strengths {
  border-left: 3px solid #22c55e;
}

.improvements {
  border-left: 3px solid #eab308;
}

/* Variations */
.variations-section {
  margin-top: 1rem;
}

.variations-section h2 {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.variations-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.variations-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.variation-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
}

.variation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.variation-header h4 {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.variation-card p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.8;
}

/* Pro Section */
.pro-section {
  margin-top: 2.5rem;
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(30, 41, 59, 0.4);
}

.pro-header {
  padding: 1.75rem 2rem 0;
}

.pro-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.pro-title-row h2 {
  color: #fff;
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
}

.pro-badge {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.08em;
}

.pro-desc {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.88rem;
  margin-bottom: 1.5rem;
}

.pro-content {
  padding: 0 2rem 2rem;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 1.1rem 0.75rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pro-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pro-detail-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
}

.pro-detail-card h4 {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.richness-bar-wrapper {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.richness-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #a855f7);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.richness-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.longest-word {
  color: #60a5fa;
  font-size: 1.35rem;
  font-weight: 700;
  word-break: break-all;
}

.word-freq-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
}

.word-freq-card h4 {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.freq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.freq-item {
  display: grid;
  grid-template-columns: 30px 100px 1fr 40px;
  align-items: center;
  gap: 0.5rem;
}

.freq-rank {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.freq-word {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.freq-bar-wrapper {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.freq-bar {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  border-radius: 3px;
}

.freq-count {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: right;
}

/* Pro Locked */
.pro-locked {
  position: relative;
  cursor: pointer;
  padding: 0 2rem 2rem;
}

.pro-preview-blur {
  filter: blur(6px);
  pointer-events: none;
  opacity: 0.4;
}

.pro-locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.lock-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.pro-locked-overlay h3 {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.pro-locked-overlay p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.88rem;
  max-width: 340px;
  margin-bottom: 1.25rem;
  line-height: 1.6;
}

.btn-pro {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  padding: 0.7rem 1.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.btn-pro:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 440px;
  width: 100%;
  text-align: center;
  position: relative;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #fff;
}

.modal-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.modal h2 {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.modal-desc {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.modal-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  text-align: left;
}

.modal-features li {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.88rem;
  padding: 0.3rem 0;
}

.modal-pricing {
  margin-bottom: 1.25rem;
}

.modal-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
}

.modal-period {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
}

.modal .btn-lg {
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
}

.modal-note {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.75rem;
  margin-top: 0.75rem;
}

@media (max-width: 768px) {
  .results-top {
    grid-template-columns: 1fr;
  }

  .feedback-grid {
    grid-template-columns: 1fr;
  }

  .analyzer-header h1 {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pro-details-grid {
    grid-template-columns: 1fr;
  }

  .freq-item {
    grid-template-columns: 25px 80px 1fr 35px;
  }

  .analyzer-container {
    padding: 0;
  }

  .modal {
    width: 95%;
    padding: 1.75rem;
  }
}

@media (max-width: 480px) {
  .analyzer-header h1 {
    font-size: 1.35rem;
  }

  .analyzer-header p {
    font-size: 0.88rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .input-section textarea {
    min-height: 180px;
    font-size: 0.92rem;
  }

  .score-ring {
    width: 100px;
    height: 100px;
  }

  .btn-lg {
    width: 100%;
    font-size: 0.95rem;
    padding: 0.85rem 1.25rem;
  }

  .freq-item {
    grid-template-columns: 20px 60px 1fr 30px;
    font-size: 0.8rem;
  }

  .modal {
    padding: 1.25rem;
  }

  .modal-price {
    font-size: 2rem;
  }
}
</style>

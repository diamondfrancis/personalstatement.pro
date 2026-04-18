<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { user, isAuthenticated, isPro, updateProfile, signOut, cancelProSubscription } = useAuth()

// Redirect if not logged in
if (!isAuthenticated.value) {
  router.replace('/auth')
}

const editing = ref(false)
const showCancelConfirm = ref(false)

// Editable draft fields
const draft = ref({
  name: user.value?.name || '',
  phone: user.value?.phone || '',
  location: user.value?.location || '',
  occupation: user.value?.occupation || '',
})

function startEditing() {
  draft.value = {
    name: user.value?.name || '',
    phone: user.value?.phone || '',
    location: user.value?.location || '',
    occupation: user.value?.occupation || '',
  }
  editing.value = true
}

function cancelEditing() {
  editing.value = false
}

function saveProfile() {
  updateProfile(draft.value)
  editing.value = false
}

function handleSignOut() {
  signOut()
  router.push('/')
}

function handleCancelSub() {
  cancelProSubscription()
  showCancelConfirm.value = false
}

function handleUpgrade() {
  router.push('/pricing')
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const initials = computed(() => {
  const n = user.value?.name || '?'
  return n
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const avatarUrl = computed(() => {
  if (user.value?.avatarUrl) return user.value.avatarUrl
  const name = encodeURIComponent(user.value?.name || 'User')
  return `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff&size=128&font-size=0.4`
})
</script>

<template>
  <div class="profile-page" v-if="user">
    <div class="profile-container">
      <!-- Header card -->
      <div class="profile-header">
        <div class="header-bg"></div>
        <div class="header-content">
          <div class="avatar-section">
            <img :src="avatarUrl" :alt="user.name" class="avatar" />
            <div class="avatar-fallback" v-if="!user.avatarUrl">{{ initials }}</div>
          </div>
          <div class="header-info">
            <h1 class="user-name">{{ user.name || 'Your Name' }}</h1>
            <p class="user-email">{{ user.email }}</p>
            <span v-if="user.occupation" class="occupation-badge">{{ user.occupation }}</span>
          </div>
        </div>
      </div>

      <!-- Profile details card -->
      <div class="profile-card">
        <div class="card-header">
          <h2>Profile Information</h2>
          <button v-if="!editing" class="edit-btn" @click="startEditing">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
        </div>

        <div class="fields-grid">
          <!-- Name -->
          <div class="field">
            <div class="field-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Full Name
            </div>
            <div v-if="editing" class="field-edit">
              <input v-model="draft.name" type="text" placeholder="Enter your full name" />
            </div>
            <div v-else class="field-value">{{ user.name || '—' }}</div>
          </div>

          <!-- Email (read-only) -->
          <div class="field">
            <div class="field-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Email Address
            </div>
            <div class="field-value email-readonly">{{ user.email }}</div>
          </div>

          <!-- Phone -->
          <div class="field">
            <div class="field-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Phone Number
            </div>
            <div v-if="editing" class="field-edit">
              <input v-model="draft.phone" type="tel" placeholder="(555) 123-4567" />
            </div>
            <div v-else class="field-value">{{ user.phone || '—' }}</div>
          </div>

          <!-- Location -->
          <div class="field">
            <div class="field-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Location
            </div>
            <div v-if="editing" class="field-edit">
              <input v-model="draft.location" type="text" placeholder="City, State" />
            </div>
            <div v-else class="field-value">{{ user.location || '—' }}</div>
          </div>

          <!-- Occupation -->
          <div class="field full-width">
            <div class="field-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Occupation
            </div>
            <div v-if="editing" class="field-edit">
              <input v-model="draft.occupation" type="text" placeholder="e.g. Software Engineer, Student, Doctor" />
            </div>
            <div v-else class="field-value">{{ user.occupation || '—' }}</div>
          </div>
        </div>

        <!-- Edit actions -->
        <Transition name="fade">
          <div v-if="editing" class="edit-actions">
            <button class="cancel-btn" @click="cancelEditing">Cancel</button>
            <button class="save-btn" @click="saveProfile">Save Changes</button>
          </div>
        </Transition>
      </div>

      <!-- Subscription card -->
      <div class="profile-card subscription-card">
        <div class="card-header">
          <h2>Subscription</h2>
          <span v-if="isPro" class="sub-badge sub-active">PRO Active</span>
          <span v-else class="sub-badge sub-free">Free Plan</span>
        </div>

        <div v-if="isPro && user.subscription" class="sub-details">
          <div class="sub-info-grid">
            <div class="sub-info">
              <span class="sub-label">Plan</span>
              <span class="sub-value">Personal Statement Pro+</span>
            </div>
            <div class="sub-info">
              <span class="sub-label">Status</span>
              <span class="sub-value" :class="{ 'text-green': user.subscription.status === 'active', 'text-yellow': user.subscription.status === 'cancelled' }">
                {{ user.subscription.status === 'active' ? '● Active' : '● Cancelled' }}
              </span>
            </div>
            <div class="sub-info">
              <span class="sub-label">Started</span>
              <span class="sub-value">{{ formatDate(user.subscription.startDate) }}</span>
            </div>
            <div class="sub-info">
              <span class="sub-label">Renews</span>
              <span class="sub-value">{{ formatDate(user.subscription.expiryDate) }}</span>
            </div>
          </div>
          <div class="sub-actions">
            <button v-if="user.subscription.status === 'active'" class="cancel-sub-btn" @click="showCancelConfirm = true">Cancel Subscription</button>
          </div>

          <!-- Cancel confirmation -->
          <Transition name="fade">
            <div v-if="showCancelConfirm" class="cancel-confirm">
              <p>Are you sure you want to cancel your Pro subscription? You'll lose access to Pro analytics at the end of your billing period.</p>
              <div class="cancel-confirm-actions">
                <button class="btn-keep" @click="showCancelConfirm = false">Keep Pro</button>
                <button class="btn-cancel-confirm" @click="handleCancelSub">Yes, Cancel</button>
              </div>
            </div>
          </Transition>
        </div>

        <div v-else class="sub-upgrade">
          <div class="upgrade-content">
            <span class="upgrade-icon">⚡</span>
            <div>
              <h4>Upgrade to Pro</h4>
              <p>Unlock word count analytics, vocabulary richness, keyword frequency, and more for just £4.99/month.</p>
            </div>
          </div>
          <button class="btn-upgrade" @click="handleUpgrade">Upgrade Now</button>
        </div>
      </div>

      <!-- Sign out -->
      <button class="signout-btn" @click="handleSignOut">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: calc(100vh - 64px);
}

.profile-container {
  max-width: 680px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header card */
.profile-header {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.header-bg {
  height: 120px;
  background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #8b5cf6 100%);
}

.header-content {
  display: flex;
  align-items: flex-end;
  gap: 1.25rem;
  padding: 0 2rem 1.5rem;
  margin-top: -50px;
  position: relative;
  z-index: 1;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #0b1120;
  object-fit: cover;
  background: #1e3a5f;
}

.avatar-fallback {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  pointer-events: none;
}

.header-info {
  padding-bottom: 0.25rem;
}

.user-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.user-email {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.88rem;
  margin-top: 0.15rem;
}

.occupation-badge {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 20px;
  color: #60a5fa;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Profile card */
.profile-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.75rem 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 8px;
  color: #60a5fa;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

/* Fields grid */
.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.4rem;
}

.field-label svg {
  color: rgba(255, 255, 255, 0.3);
}

.field-value {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  padding: 0.5rem 0;
}

.field-value:has(+ .email-readonly),
.email-readonly {
  color: rgba(255, 255, 255, 0.5);
}

.field-edit input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.field-edit input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.field-edit input:focus {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Edit actions */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.cancel-btn {
  padding: 0.6rem 1.25rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.save-btn {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Sign out */
.signout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: #f87171;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.signout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.35);
}

/* Subscription */
.subscription-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sub-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.sub-active {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
}

.sub-free {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
}

.sub-details {
  margin-top: 0.25rem;
}

.sub-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.sub-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sub-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sub-value {
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.85);
}

.text-green { color: #22c55e; }
.text-yellow { color: #eab308; }

.sub-actions {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.cancel-sub-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.82rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.cancel-sub-btn:hover {
  color: #f87171;
}

.cancel-confirm {
  margin-top: 1rem;
  padding: 1.25rem;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 12px;
}

.cancel-confirm p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.cancel-confirm-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-keep {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel-confirm {
  padding: 0.5rem 1.25rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  color: #f87171;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

/* Upgrade prompt */
.sub-upgrade {
  margin-top: 0.25rem;
}

.upgrade-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.upgrade-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.upgrade-content h4 {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.upgrade-content p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  line-height: 1.6;
}

.btn-upgrade {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.btn-upgrade:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 1.25rem 1.25rem;
    margin-top: -40px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    padding: 1.25rem 1.5rem;
  }

  .card-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 0;
  }

  .profile-card {
    padding: 1rem 1.25rem;
    border-radius: 12px;
  }

  .avatar {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }

  .header-info h1 {
    font-size: 1.25rem;
  }

  .btn-save {
    width: 100%;
    text-align: center;
  }

  .subscription-card {
    padding: 1.25rem;
  }
}
</style>

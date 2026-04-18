<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { isAuthenticated, isPro, activateProSubscription } = useAuth()

const processing = ref(false)
const paymentStep = ref<'plans' | 'checkout' | 'success'>('plans')

// Card form fields (demo only)
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const paymentError = ref('')

const isFormValid = computed(() => {
  return (
    cardName.value.trim().length >= 2 &&
    cardNumber.value.replace(/\s/g, '').length === 16 &&
    /^\d{2}\/\d{2}$/.test(cardExpiry.value) &&
    cardCvc.value.length >= 3
  )
})

function formatCardNumber(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 16)
  value = value.replace(/(.{4})/g, '$1 ').trim()
  cardNumber.value = value
}

function formatExpiry(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 4)
  if (value.length >= 3) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  cardExpiry.value = value
}

function handleUpgradeClick() {
  if (!isAuthenticated.value) {
    router.push('/auth')
    return
  }
  if (isPro.value) return
  paymentStep.value = 'checkout'
}

function handlePayment() {
  if (!isFormValid.value) {
    paymentError.value = 'Please fill in all card details correctly.'
    return
  }
  paymentError.value = ''
  processing.value = true

  // Simulated payment processing
  setTimeout(() => {
    activateProSubscription()
    processing.value = false
    paymentStep.value = 'success'
  }, 2000)
}

function goToAnalyzer() {
  router.push('/analyzer')
}

function goToProfile() {
  router.push('/profile')
}

const features = {
  free: [
    'Statement score & rating',
    'Best-matched role detection',
    'Strengths analysis',
    'Improvement suggestions',
    '3 rewritten variations',
  ],
  pro: [
    'Everything in Free',
    'Word count analytics',
    'Reading time estimate',
    'Vocabulary richness score',
    'Keyword frequency analysis',
    'Sentence & word length stats',
    'Paragraph structure breakdown',
    'Priority support',
  ],
}
</script>

<template>
  <div class="pricing-page">
    <!-- Plans View -->
    <div v-if="paymentStep === 'plans'" class="plans-view">
      <div class="pricing-header">
        <span class="pricing-label">Pricing</span>
        <h1>Choose Your <span class="gradient-text">Plan</span></h1>
        <p>Get more from your personal statement with Pro analytics and insights.</p>
      </div>

      <div class="plans-grid">
        <!-- Free Plan -->
        <div class="plan-card">
          <div class="plan-top">
            <h3>Free</h3>
            <p class="plan-desc">Perfect for getting started</p>
            <div class="plan-price">
              <span class="price">£0</span>
              <span class="period">/forever</span>
            </div>
          </div>
          <ul class="features-list">
            <li v-for="f in features.free" :key="f">
              <span class="check">✓</span>
              {{ f }}
            </li>
          </ul>
          <button class="btn btn-outline" @click="router.push('/analyzer')">
            Get Started Free
          </button>
        </div>

        <!-- Pro Plan -->
        <div class="plan-card plan-pro">
          <div class="plan-popular">Most Popular</div>
          <div class="plan-top">
            <h3>Pro</h3>
            <p class="plan-desc">For serious applicants</p>
            <div class="plan-price">
              <span class="price">£4.99</span>
              <span class="period">/month</span>
            </div>
          </div>
          <ul class="features-list">
            <li v-for="f in features.pro" :key="f">
              <span class="check pro-check">✓</span>
              {{ f }}
            </li>
          </ul>
          <button
            v-if="isPro"
            class="btn btn-pro"
            disabled
          >
            ✓ Current Plan
          </button>
          <button
            v-else
            class="btn btn-pro"
            @click="handleUpgradeClick"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <!-- Guarantee -->
      <div class="guarantee">
        <span class="guarantee-icon">🛡️</span>
        <div>
          <strong>7-day free trial</strong>
          <p>Try Pro risk-free. Cancel anytime within 7 days for a full refund.</p>
        </div>
      </div>
    </div>

    <!-- Checkout View -->
    <div v-if="paymentStep === 'checkout'" class="checkout-view">
      <button class="back-btn" @click="paymentStep = 'plans'">← Back to plans</button>

      <div class="checkout-container">
        <div class="checkout-summary">
          <div class="summary-badge">PRO</div>
          <h2>Personal Statement Pro+</h2>
          <p class="summary-desc">Unlock advanced analytics to perfect your personal statement.</p>
          <div class="summary-price">
            <span class="price-big">£4.99</span>
            <span class="price-period">/month</span>
          </div>
          <ul class="summary-features">
            <li v-for="f in features.pro" :key="f">✓ {{ f }}</li>
          </ul>
        </div>

        <div class="checkout-form">
          <h3>Payment Details</h3>
          <p class="form-note">Demo mode — no real charges will be made.</p>

          <div v-if="paymentError" class="payment-error">
            <span>⚠</span> {{ paymentError }}
          </div>

          <div class="form-group">
            <label for="card-name">Name on Card</label>
            <input
              id="card-name"
              v-model="cardName"
              type="text"
              placeholder="John Doe"
              autocomplete="cc-name"
            />
          </div>

          <div class="form-group">
            <label for="card-number">Card Number</label>
            <div class="card-input-wrapper">
              <input
                id="card-number"
                :value="cardNumber"
                @input="formatCardNumber"
                type="text"
                placeholder="4242 4242 4242 4242"
                autocomplete="cc-number"
                maxlength="19"
              />
              <div class="card-brands">
                <span>💳</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="card-expiry">Expiry</label>
              <input
                id="card-expiry"
                :value="cardExpiry"
                @input="formatExpiry"
                type="text"
                placeholder="MM/YY"
                autocomplete="cc-exp"
                maxlength="5"
              />
            </div>
            <div class="form-group">
              <label for="card-cvc">CVC</label>
              <input
                id="card-cvc"
                v-model="cardCvc"
                type="text"
                placeholder="123"
                autocomplete="cc-csc"
                maxlength="4"
              />
            </div>
          </div>

          <button
            class="btn btn-pay"
            :disabled="!isFormValid || processing"
            @click="handlePayment"
          >
            <span v-if="processing" class="spinner"></span>
            {{ processing ? 'Processing...' : 'Pay £4.99 / month' }}
          </button>

          <p class="secure-note">🔒 Secure payment. Cancel anytime.</p>
        </div>
      </div>
    </div>

    <!-- Success View -->
    <div v-if="paymentStep === 'success'" class="success-view">
      <div class="success-card">
        <div class="success-icon">🎉</div>
        <h1>Welcome to Pro!</h1>
        <p>Your subscription is now active. You have full access to all Pro analytics features.</p>
        <div class="success-actions">
          <button class="btn btn-primary" @click="goToAnalyzer">Start Analyzing →</button>
          <button class="btn btn-outline" @click="goToProfile">View Profile</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;
  min-height: calc(100vh - 64px);
}

.pricing-header {
  text-align: center;
  margin-bottom: 3rem;
}

.pricing-label {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a78bfa;
  margin-bottom: 0.75rem;
}

.pricing-header h1 {
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

.pricing-header p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.05rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.plan-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.plan-pro {
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(30, 41, 59, 0.7);
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.08);
}

.plan-popular {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.plan-top {
  margin-bottom: 1.75rem;
}

.plan-top h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.3rem;
}

.plan-desc {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
}

.period {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.4);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  flex: 1;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.88rem;
  padding: 0.45rem 0;
}

.check {
  color: #22c55e;
  font-weight: 700;
  flex-shrink: 0;
}

.pro-check {
  color: #f59e0b;
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

.btn-outline {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
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

.btn-pro {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  padding: 0.8rem 2rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.btn-pro:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.btn-pro:disabled {
  opacity: 0.7;
  cursor: default;
  background: #22c55e;
}

/* Guarantee */
.guarantee {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  padding: 1.25rem 1.75rem;
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 14px;
}

.guarantee-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.guarantee strong {
  color: #fff;
  font-size: 0.92rem;
}

.guarantee p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.82rem;
  margin-top: 0.15rem;
  line-height: 1.5;
}

/* Checkout */
.back-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.88rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #fff;
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 850px;
  margin: 0 auto;
}

.checkout-summary {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem 2rem;
}

.summary-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.checkout-summary h2 {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.summary-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.88rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.summary-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.price-big {
  font-size: 2.25rem;
  font-weight: 800;
  color: #fff;
}

.price-period {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.4);
}

.summary-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-features li {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  padding: 0.35rem 0;
}

/* Checkout Form */
.checkout-form {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem 2rem;
}

.checkout-form h3 {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.form-note {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
}

.payment-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #f87171;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.4rem;
}

.form-group input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-group input:focus {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.card-input-wrapper {
  position: relative;
}

.card-input-wrapper input {
  padding-right: 3rem;
}

.card-brands {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-pay {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  margin-top: 0.5rem;
}

.btn-pay:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.btn-pay:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secure-note {
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.78rem;
  margin-top: 0.75rem;
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

/* Success */
.success-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.success-card {
  text-align: center;
  max-width: 500px;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1.25rem;
}

.success-card h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.75rem;
}

.success-card p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .checkout-container {
    grid-template-columns: 1fr;
  }

  .pricing-header h1 {
    font-size: 1.75rem;
  }

  .success-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .pricing-header h1 {
    font-size: 1.35rem;
  }

  .pricing-header p {
    font-size: 0.88rem;
  }

  .plans-grid {
    max-width: 100%;
  }

  .plan-card {
    padding: 1.5rem;
  }

  .checkout-form {
    padding: 1.5rem;
  }

  .checkout-summary {
    padding: 1.5rem;
  }

  .success-view {
    padding: 2rem 1rem;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>

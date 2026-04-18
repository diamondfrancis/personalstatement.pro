# PersonalStatement.pro

[![Netlify Status](https://api.netlify.com/api/v1/badges/4e71d49a-b9b4-4bda-828c-84461be8706c/deploy-status)](https://app.netlify.com/projects/personalstatementpro/deploys)

An AI-powered personal statement analyzer that helps students and professionals craft compelling personal statements. Get instant feedback on structure, tone, word choice, and role alignment.

## Features

- **Statement Analyzer** — Paste your personal statement and receive an AI-generated score with detailed feedback on strengths, weaknesses, and suggestions
- **Role Matching** — See how well your statement aligns with specific career roles and industries
- **Job Prospects** — Browse relevant job prospects and understand what employers look for
- **Pro Analytics** — Detailed word frequency analysis, readability stats, and statement variations (Pro tier)
- **User Accounts** — Sign up / sign in with email or Google, manage your profile and subscription
- **Blog** — Tips and guides on writing effective personal statements
- **Fully Responsive** — Optimized for desktop, tablet, and all phone sizes with an interactive mobile navbar

## Tech Stack

- **Vue 3** with Composition API (`<script setup>`)
- **TypeScript**
- **Vue Router** — Client-side routing
- **Vite** — Build tool and dev server
- **Scoped CSS** — Component-level styling with CSS custom properties

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/          # Global CSS (base reset, main styles)
├── components/      # Reusable components (NavBar, AppFooter, icons)
├── data/            # Static data (blog posts)
├── router/          # Vue Router configuration
├── stores/          # Auth state management
└── views/           # Page components
    ├── LandingPage.vue
    ├── StatementAnalyzer.vue
    ├── PricingPage.vue
    ├── AuthPage.vue
    ├── ProfilePage.vue
    ├── JobProspects.vue
    ├── AboutPage.vue
    ├── BlogList.vue
    └── BlogPost.vue
```

## License

This project is private.

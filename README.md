# AI Mini-SaaS: Smart Task Evaluator

A full-stack web application for AI-powered coding task evaluation. Users can sign up, submit code, run multi-criteria code reviews, view preview feedback, compare model predictions side-by-side, pay to unlock complete refactoring reports, and access historical evaluations.

## 📹 Video Demo
- [Project Video Demonstration](https://drive.google.com/file/d/10M5EFPl5obPVt0Hdv6aFv8YGogxcIRRo/view?usp=sharing)

## ✨ Core Features
- **Authentication**: Secure user login and signup powered by Supabase Auth.
- **Database & Storage**: Structured task, evaluation report, and transaction data stored with Supabase PostgreSQL and Row Level Security (RLS).
- **Multi-Provider Code Evaluation**: Code evaluation engine supporting OpenAI (`gpt-4o-mini`), Google Gemini (`gemini-1.5-flash`), and a deterministic mock provider for unit testing & CI.
- **Structured Schema Scoring**: Evaluates submissions across 4 criteria (Correctness, Readability, Efficiency, Security & Edge Cases) on a 1–5 scale with overall 0–100 score and refactored code output.
- **Side-by-Side Model Comparison**: Compare evaluation outputs between two provider models side-by-side with criterion score deltas and agreement highlights.
- **Mock Payment System**: Supabase-simulated transaction flow to unlock full report details (Stripe SDK not integrated).
- **Modern Responsive UI**: Built with Next.js App Router, React 19, Tailwind CSS v4, Framer Motion, and Lottie animations.

---

## ⚠️ Benchmark Limitations (N=15)

Evaluation benchmarks were measured against a hand-scored test set of N=15 coding submissions (`evals/human_scores.csv`):

- **Benchmark Size**: N=15 hand-scored code submissions.
- **Mean Absolute Error (MAE)**: **21.33 points** (0–100 scale, N=15).
- **Pearson Correlation (r)**: **0.297** (N=15).
- **Prompt Injection Vulnerability**: While the deterministic mock engine uses rule-based pattern matching to penalize injection attempts, real LLM providers (OpenAI / Gemini) rely on system prompts. Real LLMs are not immune to prompt injection attacks, and the application is not hack-proof.

> **Important Disclaimer**: LLM scoring shows weak correlation (r=0.30) with human judgment on a small N=15 item benchmark; treat scores as directional feedback, not authoritative ratings.

---

## 🏗 Database Schema

### `tasks`
| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Reference to Supabase Auth User |
| `title` | text | Task title |
| `description` | text | Problem statement & constraints |
| `code` | text | Submitted source code |
| `created_at` | timestamptz | Auto timestamp |

### `reports`
| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary Key |
| `task_id` | uuid | Reference to task |
| `user_id` | uuid | Supabase Auth User |
| `score` | integer | Overall rating (0–100) |
| `criteria` | jsonb | Per-criterion ratings (1–5) and justifications |
| `strengths` | text[] | Key strengths |
| `improvements` | text[] | Concrete improvement suggestions |
| `refactored_code` | text | Refactored clean solution |
| `locked` | boolean | True until report is unlocked |
| `created_at` | timestamptz | Auto timestamp |

### `payments`
| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Supabase Auth User |
| `report_id` | uuid | Reference to report |
| `amount` | integer | Transaction amount |
| `currency` | text | Currency code (INR) |
| `status` | text | Transaction status (`pending` → `completed`) |
| `created_at` | timestamptz | Auto timestamp |

---

## 🔐 Row Level Security (RLS)
All database tables enforce RLS policies (`auth.uid() = user_id`) to isolate data per authenticated user.

---

## 💻 Running Locally

1. Clone the repository:
```bash
git clone https://github.com/SiddhiDeshmukh310/ai-task-evaluator.git
cd ai-task-evaluator
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EVALUATOR_PROVIDER=mock # Options: mock | openai | gemini
OPENAI_API_KEY=your_openai_api_key # Required if EVALUATOR_PROVIDER=openai
GEMINI_API_KEY=your_gemini_api_key # Required if EVALUATOR_PROVIDER=gemini
```

4. Run tests:
```bash
npm test
```

5. Run evaluation benchmark script (N=15):
```bash
node evals/run_benchmark.js
```

6. Start the development server:
```bash
npm run dev
```
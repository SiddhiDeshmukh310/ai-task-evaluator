# AI Mini-SaaS: Smart Task Evaluator

A full-stack web application for AI-powered coding task evaluation. Users can sign up, submit code, run multi-criteria LLM code reviews, view preview feedback, pay to unlock complete refactoring reports, and access historical evaluations.

## 📹 Video Demo
- [Project Video Demonstration](https://drive.google.com/file/d/10M5EFPl5obPVt0Hdv6aFv8YGogxcIRRo/view?usp=sharing)

## ✨ Core Features
- **Authentication**: Secure user login and signup powered by Supabase Auth.
- **Database & Storage**: Structured task, evaluation report, and transaction data stored with Supabase PostgreSQL and Row Level Security (RLS).
- **Multi-Provider LLM Evaluation**: Automated code evaluation engine supporting OpenAI (gpt-4o-mini), Google Gemini (gemini-1.5-flash), and a deterministic mock provider for unit testing & CI.
- **Structured Schema Scoring**: Evaluates submissions across 4 criteria (Correctness, Readability, Efficiency, Edge Case Safety) on a 1–5 scale with overall 0–100 score and refactored code output.
- **Mock Payment Gateway**: Supabase-simulated checkout flow to unlock full report details (Stripe SDK not integrated).
- **Modern Responsive UI**: Built with Next.js App Router, React 19, Tailwind CSS v4, Framer Motion, and Lottie animations.

---

## 🏗 Database Schema

### 	asks
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary Key |
| user_id | uuid | Reference to Supabase Auth User |
| 	itle | text | Task title |
| description | text | Problem statement & constraints |
| code | text | Submitted source code |
| created_at | timestamptz | Auto timestamp |

### eports
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary Key |
| 	ask_id | uuid | Reference to task |
| user_id | uuid | Supabase Auth User |
| score | integer | Overall rating (0–100) |
| criteria | jsonb | Per-criterion ratings (1–5) and justifications |
| strengths | text[] | 3 key strengths |
| improvements | text[] | 3 concrete improvement suggestions |
| efactored_code | text | Refactored clean solution |
| locked | boolean | True until report is unlocked |
| created_at | timestamptz | Auto timestamp |

### payments
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary Key |
| user_id | uuid | Supabase Auth User |
| eport_id | uuid | Reference to report |
| mount | integer | Transaction amount |
| currency | text | Currency code (INR) |
| status | text | Status (pending → completed) |
| created_at | timestamptz | Auto timestamp |

---

## 🔐 Row Level Security (RLS)
All database tables enforce RLS policies (uth.uid() = user_id) to isolate data per authenticated user.

---

## 💻 Running Locally

1. Clone the repository:
`ash
git clone https://github.com/SiddhiDeshmukh310/ai-task-evaluator.git
cd ai-task-evaluator
`

2. Install dependencies:
`ash
npm install
`

3. Configure Environment Variables (.env.local):
`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EVALUATOR_PROVIDER=mock # Options: mock | openai | gemini
OPENAI_API_KEY=your_openai_api_key # Required if EVALUATOR_PROVIDER=openai
GEMINI_API_KEY=your_gemini_api_key # Required if EVALUATOR_PROVIDER=gemini
`

4. Start the development server:
`ash
npm run dev
`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
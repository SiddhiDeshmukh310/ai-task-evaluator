# AI Mini-SaaS: Smart Task Evaluator

A SaaS-style full-stack web app for AI-powered coding task evaluation. Users can sign up, submit code, run AI reviews, view preview feedback, pay to unlock full report, and access past evaluations.

## ✨ Demo Features
- Secure user authentication using :contentReference[oaicite:0]{index=0}
- Structured data storage using :contentReference[oaicite:1]{index=1}
- Bug diagnosis and code refactoring using :contentReference[oaicite:2]{index=2}
- Responsive UI built with :contentReference[oaicite:3]{index=3}
- Motion polish powered by :contentReference[oaicite:4]{index=4}
- UI illustrations and loops from :contentReference[oaicite:5]{index=5}

## 🚀 Live Deployment
Hosting and deployment handled via :contentReference[oaicite:6]{index=6}

## 🧠 AI Used During Development
Coding assistance, debugging fixes, and refactor suggestions generated using :contentReference[oaicite:7]{index=7}

---

## 🏗 Database Schema

### `tasks`
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | reference to Supabase Auth user |
| title | text | problem or task name |
| description | text | task statement |
| code | text | submitted solution code |
| created_at | timestamptz | auto timestamp |

### `reports`
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| task_id | uuid | reference to task |
| user_id | uuid | Supabase Auth user |
| score | integer | 0-100 rating |
| strengths | text[] | 3 key positives |
| improvements | text[] | 3 suggestions |
| refactored_code | text | improved code |
| created_at | timestamptz | auto timestamp |
| locked | boolean | true until payment |

### `payments`
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | Supabase Auth user |
| report_id | uuid | reference to report |
| amount | integer | mock checkout |
| currency | text | default INR |
| status | text | pending → success |
| created_at | timestamptz | auto timestamp |

---

## 🔐 Row Level Security
All tables have RLS enabled so users only manage their own rows:

- `auth.uid() = user_id` for select/insert/update on all tables.

---

## 💻 Run Locally

1. Clone the repo:
```bash
git clone https://github.com/SiddhiDeshmukh310/ai-task-evaluator.git
cd ai-task-evaluator
```
npm install
Set environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key

npm run dev
Open "http://localhost:3000"to see the app

Open `http://localhost:3000/login` in browser.

---

## ✅ User can
✔ Create an account and log in immediately  
✔ Submit a coding task and receive AI scoring (JSON)  
✔ See report preview and unlock full suggestions after payment  
✔ Visit `/reports` to view past evaluations  

## ❌ Features outside scope
This assignment uses **mock payment** and **mock providers**, not a real gateway.

---

## 🧪 Broken Code Artifacts Included
These files intentionally contain errors for AI debug/refactor testing:

- `app/components/BrokenReportCard.js` – invalid JSX nesting & assignment bug
- `app/api/broken-api/route.js` – wrong response format
- `lib/slowFunction.js` – slow loop & poor style

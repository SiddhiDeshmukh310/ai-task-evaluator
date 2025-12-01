import './globals.css';
import Link from "next/link";

<Link href="/" className="hover:text-emerald-400">Overview</Link>

export const metadata = {
  title: 'Smart Task Evaluator',
  description: 'AI-powered code review mini-SaaS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {/* Background gradient like Flow */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        <div className="min-h-screen flex flex-col">
          {/* Top nav similar to Flow */}
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-black/60 backdrop-blur-xl">
  <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/40">
        ST
      </div>
      <div className="leading-tight">
        <p className="text-base font-semibold tracking-tight">
          Smart Task Evaluator
        </p>
        <p className="text-[11px] text-slate-400">
          Where the next wave of task review happens
        </p>
      </div>
    </div>

    {/* Nav links */}
    <nav className="hidden items-center gap-5 text-sm text-slate-300 sm:flex">
      {[
        { href: "/", label: "Overview" },
        { href: "/submit-task", label: "Create" },
        { href: "/reports", label: "Gallery" },
        { href: "/pricing", label: "Pricing" },
     ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative px-1 py-0.5 transition-all duration-200 hover:text-emerald-300 group"
        >
          {item.label}
          <span className="pointer-events-none absolute inset-x-1 -bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-emerald-400/80 transition-transform duration-200 group-hover:scale-x-100" />
        </Link>
      ))}
    </nav>

    {/* Auth buttons */}
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <Link
        href="/login"
        className="hidden rounded-full border border-slate-700 px-4 py-1.5 text-slate-200 shadow-sm shadow-slate-900/40 transition-all duration-200 hover:border-slate-400 hover:bg-slate-900/80 sm:inline-flex"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-950 shadow-md shadow-slate-100/40 transition-all duration-200 hover:scale-105 hover:bg-white"
      >
        Get started
      </Link>
    </div>
  </div>
</header>

          {/* Page content */}
          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-800 bg-black/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-[11px] text-slate-500">
              <span>Smart Task Evaluator · Gen-AI mini SaaS</span>
              <span>Next.js · Supabase · OpenAI (mock)</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

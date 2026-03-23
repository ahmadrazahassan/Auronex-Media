"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("alinachod281@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[28px] border border-[#E2DFD8] bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between bg-[#FAF9F6] p-8 sm:p-10 lg:p-12">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#E2DFD8] bg-white px-4 py-2 text-[#0d1619]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h4" />
              </svg>
              <span className="font-display font-extrabold text-base leading-none flex items-baseline gap-[1px]">
                SmallBiz<span className="font-normal">Desk</span>
              </span>
            </div>

            <div className="mt-10 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#037aff]">Admin Access</p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[#0d1619] sm:text-5xl">
                Editorial control for your finance newsroom.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#5A6269]">
                Manage articles, categories, subscribers, uploads, and publishing workflows from one secure workspace built for SmallBiz Desk.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E2DFD8] bg-white p-5">
              <p className="text-sm font-semibold text-[#0d1619]">Publishing</p>
              <p className="mt-2 text-sm leading-6 text-[#5A6269]">Create, revise, publish, and organise long-form editorial content with live Supabase data.</p>
            </div>
            <div className="rounded-2xl border border-[#E2DFD8] bg-white p-5">
              <p className="text-sm font-semibold text-[#0d1619]">Operations</p>
              <p className="mt-2 text-sm leading-6 text-[#5A6269]">Handle categories, subscribers, storage uploads, and admin-only actions with proper access control.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-8 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#5A6269]">Sign in</p>
              <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-tight text-[#0d1619]">
                Auronex Media Admin
              </h2>
              <p className="mt-2 text-center text-sm text-[#5A6269]">
                Sign in to access your dashboard
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0d1619]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border border-[#E2DFD8] bg-white px-4 text-sm text-[#0d1619] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:ring-4 focus:ring-[#037aff]/10"
                  placeholder="alinachod281@gmail.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0d1619]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border border-[#E2DFD8] bg-white px-4 text-sm text-[#0d1619] outline-none transition-all placeholder:text-[#A0A8B0] focus:border-[#037aff] focus:ring-4 focus:ring-[#037aff]/10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <Button type="submit" disabled={loading} className="mt-1 h-12 w-full">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-between gap-4 text-sm">
              <span className="text-[#5A6269]">Secure admin access for authorised editors only.</span>
              <Link href="/" className="font-medium text-[#0d1619] hover:text-[#037aff] transition-colors whitespace-nowrap">
                Back to website
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

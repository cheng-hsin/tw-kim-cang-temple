"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData();
    form.set("username", username);
    form.set("password", password);

    const res = await fetch("/api/admin/login", { method: "POST", body: form });
    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("帳號或密碼錯誤");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 font-display text-2xl font-bold text-maroon">後台登入</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          帳號
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg border border-[#E3D8BF] px-3 py-2 text-sm outline-none focus:border-maroon"
            autoComplete="username"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          密碼
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-[#E3D8BF] px-3 py-2 text-sm outline-none focus:border-maroon"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-maroon px-6 py-2.5 text-sm font-bold text-ivory transition hover:bg-maroon-deep disabled:opacity-50"
        >
          {loading ? "登入中…" : "登入"}
        </button>
      </form>
    </main>
  );
}

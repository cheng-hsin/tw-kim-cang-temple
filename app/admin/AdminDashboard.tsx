"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Slot = {
  key: string;
  label: { vi: string; zh: string };
  src: string;
};

export default function AdminDashboard({ slots }: { slots: Slot[] }) {
  const router = useRouter();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [cacheBust, setCacheBust] = useState(0);

  async function handleUpload(key: string, file: File) {
    setBusyKey(key);
    setError("");

    const form = new FormData();
    form.set("key", key);
    form.set("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    setBusyKey(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "上傳失敗");
      return;
    }

    setCacheBust((v) => v + 1);
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-maroon">網站圖片管理</h1>
        <button
          onClick={handleLogout}
          className="text-sm font-bold text-jade underline underline-offset-4"
        >
          登出
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <div key={slot.key} className="rounded-2xl border border-[#E3D8BF] bg-white p-4">
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-ivory">
              {slot.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${slot.src}?v=${cacheBust}`}
                  alt={slot.label.zh}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-ink-soft">
                  尚未上傳
                </div>
              )}
            </div>
            <p className="mb-2 text-sm font-bold text-ink">{slot.label.zh}</p>
            <label className="block cursor-pointer rounded-full border-[1.5px] border-maroon px-4 py-1.5 text-center text-xs font-bold text-maroon transition hover:bg-maroon hover:text-ivory">
              {busyKey === slot.key ? "上傳中…" : "上傳 / 更換"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={busyKey !== null}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(slot.key, file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Ebook = {
  id: string;
  title: { vi: string; zh: string };
  description?: { vi: string; zh: string };
  pdf: string;
  epub: string;
};

export default function EbooksAdmin({ ebooks }: { ebooks: Ebook[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [titleVi, setTitleVi] = useState("");
  const [titleZh, setTitleZh] = useState("");
  const [descVi, setDescVi] = useState("");
  const [descZh, setDescZh] = useState("");

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    const res = await fetch("/api/admin/ebooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: { vi: titleVi, zh: titleZh },
        description: { vi: descVi, zh: descZh },
      }),
    });
    setCreating(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "新增失敗");
      return;
    }

    setTitleVi("");
    setTitleZh("");
    setDescVi("");
    setDescZh("");
    router.refresh();
  }

  async function handleUpload(id: string, file: File) {
    setBusyId(id);
    setError("");

    const form = new FormData();
    form.set("file", file);

    const res = await fetch(`/api/admin/ebooks/${id}/upload`, {
      method: "POST",
      body: form,
    });
    setBusyId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "上傳失敗");
      return;
    }

    router.refresh();
  }

  async function handleRemoveFile(id: string, kind: "pdf" | "epub") {
    setBusyId(id);
    setError("");

    const res = await fetch(`/api/admin/ebooks/${id}/upload?kind=${kind}`, {
      method: "DELETE",
    });
    setBusyId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "刪除失敗");
      return;
    }

    router.refresh();
  }

  async function handleDeleteEbook(id: string) {
    if (!confirm("確定要刪除這本電子書嗎?PDF / EPUB 檔案也會一併刪除。")) return;

    setBusyId(id);
    setError("");

    const res = await fetch(`/api/admin/ebooks/${id}`, { method: "DELETE" });
    setBusyId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "刪除失敗");
      return;
    }

    router.refresh();
  }

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-display text-xl font-bold text-maroon">電子書管理</h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-[#E3D8BF] bg-white p-4 sm:grid-cols-2"
      >
        <input
          value={titleZh}
          onChange={(e) => setTitleZh(e.target.value)}
          placeholder="中文標題"
          required
          className="rounded-lg border border-[#E3D8BF] px-3 py-2 text-sm outline-none focus:border-maroon"
        />
        <input
          value={titleVi}
          onChange={(e) => setTitleVi(e.target.value)}
          placeholder="越南文標題"
          required
          className="rounded-lg border border-[#E3D8BF] px-3 py-2 text-sm outline-none focus:border-maroon"
        />
        <input
          value={descZh}
          onChange={(e) => setDescZh(e.target.value)}
          placeholder="中文簡介(選填)"
          className="rounded-lg border border-[#E3D8BF] px-3 py-2 text-sm outline-none focus:border-maroon"
        />
        <input
          value={descVi}
          onChange={(e) => setDescVi(e.target.value)}
          placeholder="越南文簡介(選填)"
          className="rounded-lg border border-[#E3D8BF] px-3 py-2 text-sm outline-none focus:border-maroon"
        />
        <button
          type="submit"
          disabled={creating}
          className="sm:col-span-2 rounded-full bg-jade px-6 py-2 text-sm font-bold text-ivory transition hover:opacity-90 disabled:opacity-50"
        >
          {creating ? "新增中…" : "新增電子書"}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((book) => (
          <div key={book.id} className="rounded-2xl border border-[#E3D8BF] bg-white p-4">
            <p className="text-sm font-bold text-ink">{book.title.zh}</p>
            <p className="text-xs text-ink-soft">{book.title.vi}</p>

            <div className="mt-3 flex flex-col gap-2">
              <FileRow
                label="PDF"
                url={book.pdf}
                busy={busyId === book.id}
                onUpload={(file) => handleUpload(book.id, file)}
                onRemove={() => handleRemoveFile(book.id, "pdf")}
              />
              <FileRow
                label="EPUB"
                url={book.epub}
                busy={busyId === book.id}
                onUpload={(file) => handleUpload(book.id, file)}
                onRemove={() => handleRemoveFile(book.id, "epub")}
              />
            </div>

            <button
              onClick={() => handleDeleteEbook(book.id)}
              disabled={busyId === book.id}
              className="mt-3 text-xs font-bold text-red-600 underline underline-offset-4 disabled:opacity-50"
            >
              刪除這本電子書
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FileRow({
  label,
  url,
  busy,
  onUpload,
  onRemove,
}: {
  label: string;
  url: string;
  busy: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="font-bold text-ink-soft">{label}</span>
      <div className="flex items-center gap-2">
        {url && (
          <>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-jade underline underline-offset-4"
            >
              查看
            </a>
            <button
              onClick={onRemove}
              disabled={busy}
              className="font-bold text-red-600 underline underline-offset-4 disabled:opacity-50"
            >
              移除
            </button>
          </>
        )}
        <label className="cursor-pointer rounded-full border-[1.5px] border-maroon px-3 py-1 font-bold text-maroon transition hover:bg-maroon hover:text-ivory">
          {busy ? "處理中…" : url ? "更換" : "上傳"}
          <input
            type="file"
            accept={label === "PDF" ? "application/pdf" : ".epub,application/epub+zip"}
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

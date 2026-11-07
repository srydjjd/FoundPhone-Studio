import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LockKeyhole,
  Plus,
  Search,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { SkinProps } from "../AppSkins";
import { safeMedia, type Item } from "../schema";

export type Props = SkinProps;

const DEFAULT_OWNER_AVATAR =
  "data:image/jpeg;base64,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";

export const meta = (
  i: Pick<Item, "meta"> | undefined,
  key: string,
  fallback = "",
) => String(i?.meta?.[key] ?? fallback);

export function Header({ p, children }: { p: Props; children?: ReactNode }) {
  return (
    <header
      className="app-nav catalog-nav"
      data-authoring={p.creator}
      data-root={!p.thread}
    >
      <button aria-label="返回" onClick={p.onBack}>
        <ChevronLeft size={22} />
      </button>
      <strong>{p.name}</strong>
      <div>
        {children}
        {p.creator && (
          <button aria-label="新增内容" onClick={p.onAdd}>
            <Plus size={21} />
          </button>
        )}
      </div>
    </header>
  );
}

export function Avatar({
  name,
  round = true,
  src = "",
}: {
  name: string;
  round?: boolean;
  src?: string;
}) {
  const resolvedSrc =
    !src && (name === "机主" || name === "我") ? DEFAULT_OWNER_AVATAR : src;

  return (
    <span className={`catalog-avatar ${round ? "round" : ""}`}>
      {safeMedia(resolvedSrc)?.startsWith("data:image/") ? (
        <img src={safeMedia(resolvedSrc)} alt="" />
      ) : (
        name.slice(0, 1) || "人"
      )}
    </span>
  );
}

export function Tabs({
  tabs,
  value,
  set,
  icons,
}: {
  tabs: string[];
  value: string;
  set: (s: string) => void;
  icons?: ReactNode[];
}) {
  return (
    <nav className="catalog-tabs">
      {tabs.map((t, i) => (
        <button
          key={t}
          className={value === t ? "selected" : ""}
          onClick={() => set(t)}
        >
          {icons?.[i]}
          <span>{t}</span>
        </button>
      ))}
    </nav>
  );
}
export function SearchBox({
  value,
  set,
  placeholder = "搜索",
}: {
  value: string;
  set: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="catalog-search">
      <Search size={15} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}

export function Media({
  item,
  className = "",
}: {
  item: Item;
  className?: string;
}) {
  const src = safeMedia(item.media);
  return src ? (
    item.kind === "audio" ? (
      <audio className={className} controls src={src} />
    ) : item.kind === "video" ? (
      <video
        className={className}
        controls
        playsInline
        src={src}
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      <img className={className} loading="lazy" alt={item.title} src={src} />
    )
  ) : (
    <div className={`catalog-art ${className}`}>
      <span>{item.title}</span>
    </div>
  );
}
export function Row({
  item,
  onItem,
  leading,
  children,
}: {
  item: Item;
  onItem: (i: Item) => void;
  leading?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <button className="catalog-row" onClick={() => onItem(item)}>
      {leading ?? <FileText size={22} />}
      <span>
        <strong>{item.title}</strong>
        <p>{item.body.split("\n")[0]}</p>
        <small>{item.time}</small>
      </span>
      {children ??
        (item.password ? (
          <LockKeyhole size={13} />
        ) : (
          <ChevronRight size={15} />
        ))}
    </button>
  );
}
export function Empty({
  items,
  label = "暂无内容",
}: {
  items: Item[];
  label?: string;
}) {
  return !items.length ? <p className="catalog-empty">{label}</p> : null;
}
export function Add({ p, label = "添加内容" }: { p: Props; label?: string }) {
  return p.creator ? (
    <button className="catalog-add" onClick={p.onAdd}>
      <Plus size={15} />
      {label}
    </button>
  ) : null;
}
export function useContent(p: Props, first: string) {
  const [tab, setTab] = useState(first),
    [q, setQ] = useState("");
  const items = p.items.filter((i) =>
    (
      i.title +
      i.body +
      i.sender +
      i.folder +
      Object.values(i.meta ?? {}).join(" ")
    )
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return { tab, setTab, q, setQ, items };
}
export function groupItems(items: Item[], fallback = "未分类") {
  return [...new Set(items.map((i) => i.folder || fallback))];
}

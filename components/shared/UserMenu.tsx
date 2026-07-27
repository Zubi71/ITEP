"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type MenuLink = { label: string; href: string; icon: string };

export function UserMenu({
  name,
  roleLabel,
  links,
}: {
  name: string;
  roleLabel: string;
  links: MenuLink[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-sm rounded-full hover:bg-surface-container-high transition-colors py-1 pl-1 pr-3"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold flex-none">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block font-label-md text-label-md text-on-surface font-bold max-w-[10rem] truncate">
          {name}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl border border-outline-variant shadow-lg py-xs z-50">
          <div className="px-4 py-3 border-b border-outline-variant">
            <p className="font-label-md text-label-md text-on-surface font-bold truncate">{name}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{roleLabel}</p>
          </div>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-sm px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span className="font-label-md text-label-md">{link.label}</span>
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-sm px-4 py-2.5 text-error hover:bg-error/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-label-md text-label-md">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

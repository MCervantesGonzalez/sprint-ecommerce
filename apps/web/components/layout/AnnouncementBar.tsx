"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AnnouncementBarProps {
  message: string;
  link?: string;
  linkText?: string;
}

export function AnnouncementBar({
  message,
  link,
  linkText,
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm relative">
      <span>{message}</span>
      {link && linkText && (
        <a
          href={link}
          className="ml-2 underline font-semibold hover:opacity-80 transition-opacity"
        >
          {linkText}
        </a>
      )}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

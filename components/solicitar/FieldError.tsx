"use client";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-error">
      <span className="material-symbols-outlined text-sm" aria-hidden>
        error
      </span>
      {message}
    </p>
  );
}

"use client";

import { useId, useRef, useState } from "react";
import { RSVP } from "@/lib/content";

/*
 * The word from the invitation.
 *
 * A ruled blank rather than a boxed input: a bordered field with a "Password"
 * label turns the first thing a guest sees into a login screen. The word is
 * visible as typed, with autocapitalise and autocorrect off — it is a shared
 * word off a printed card, not a personal secret, and a phone keyboard
 * capitalising the first letter is the likeliest way this silently fails.
 */
export function GateForm({ next }: { next?: string }) {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value, next }),
      });
      const data = (await res.json()) as { redirect?: string; error?: string };

      if (!res.ok || !data.redirect) {
        setError(data.error ?? "That’s not the one — try again.");
        setBusy(false);
        /* Keep what they typed and select it: a near miss should be a
           one-character fix, not a retype. */
        inputRef.current?.select();
        return;
      }

      /* A full document request, not router.push. The client cache will
         happily replay a payload prefetched before the cookie existed — with
         the proxy's redirect baked into it — and bounce the guest straight
         back here. Only a real navigation makes the server see the cookie. */
      window.location.assign(data.redirect);
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 flex w-full flex-col items-center">
      <label htmlFor={fieldId} className="sr-only">
        The word on your invitation
      </label>
      <input
        id={fieldId}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="· · · · ·"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        autoComplete="off"
        disabled={busy}
        className="w-[min(330px,100%)] border-0 border-b border-ink/35 bg-transparent px-1 pt-2 pb-3 text-center font-utility text-[16px] tracking-[0.16em] text-ink transition-colors outline-none placeholder:text-ink-soft/50 focus:border-ribbon-deep disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-7 rounded-full border border-ink/35 px-8 py-3 font-utility text-[11px] uppercase tracking-[0.24em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory disabled:opacity-60"
      >
        {busy ? "One moment" : "Enter"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className="mt-5 min-h-[1.5em] font-body text-[16px] italic text-ink-soft"
      >
        {error}
      </p>

      <p className="mt-6 font-body text-[15.5px] leading-[1.6] text-ink-soft">
        Lost the card? Write to us at{" "}
        <a
          href={`mailto:${RSVP.mailtoFallback}`}
          className="underline decoration-ink/30 underline-offset-4 hover:text-ink"
        >
          {RSVP.mailtoFallback}
        </a>
      </p>
    </form>
  );
}

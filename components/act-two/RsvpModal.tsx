"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RSVP } from "@/lib/content";
import { RSVP_SHOW_GUEST_COUNT } from "@/lib/config";
import { EASE_OUT } from "@/lib/motion";

type Status = "idle" | "submitting" | "submitted" | "error";

const EMPTY = {
  name: "",
  email: "",
  attending: "",
  guests: "",
  dietary: "",
  message: "",
  _hp: "",
};

const fieldClass =
  "mt-1.5 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 " +
  "font-body text-[15px] text-ink placeholder:text-ink-soft/60 " +
  "focus:border-ribbon-deep focus:outline-none";

const labelClass =
  "block font-utility text-[11px] uppercase tracking-[0.18em] text-ink-soft";

/*
 * RSVP modal (reuses the app/page.tsx AnimatePresence + scrim overlay idiom).
 * Controlled inputs, no form library; submit runs a small idle→submitting→
 * submitted|error machine and POSTs JSON to /api/submit.
 */
export function RsvpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const set =
    (key: keyof typeof EMPTY) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  // Esc closes; lock body scroll while open; focus first field on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  // Reset back to a fresh form once the modal has fully closed.
  useEffect(() => {
    if (open) return;
    const t = window.setTimeout(() => {
      setForm(EMPTY);
      setStatus("idle");
      setErrorMsg("");
    }, 300);
    return () => window.clearTimeout(t);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setErrorMsg(data?.error ?? RSVP.errorBody);
        setStatus("error");
        return;
      }
      setStatus("submitted");
    } catch {
      setErrorMsg(RSVP.errorBody);
      setStatus("error");
    }
  }

  const overlayMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.98 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="rsvp-overlay"
          className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
          {...overlayMotion}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          suppressHydrationWarning
        >
          {/* Scrim — click to close */}
          <button
            type="button"
            aria-label="Close RSVP"
            onClick={onClose}
            className="absolute inset-0 bg-scrim"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 my-auto w-full max-w-md rounded-xl bg-ivory p-6 shadow-2xl sm:p-8"
            {...panelMotion}
            transition={{ duration: reduced ? 0.2 : 0.35, ease: EASE_OUT }}
            suppressHydrationWarning
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 font-utility text-[20px] leading-none text-ink-soft hover:text-ink"
            >
              ×
            </button>

            {status === "submitted" ? (
              <div className="py-6 text-center">
                <h2
                  id={titleId}
                  className="font-display text-5xl text-ink sm:text-6xl"
                >
                  {RSVP.successTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-[36ch] font-body text-[15.5px] leading-[1.75] text-ink-soft">
                  {RSVP.successBody}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-7 font-utility text-[11px] uppercase tracking-[0.24em] text-ink hover:text-ribbon-deep"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2
                  id={titleId}
                  className="font-display text-5xl text-ink sm:text-6xl"
                >
                  {RSVP.modalTitle}
                </h2>
                <p className="mt-2 font-body text-[14.5px] leading-[1.6] text-ink-soft">
                  {RSVP.modalIntro}
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="rsvp-name" className={labelClass}>
                      {RSVP.fields.name.label}
                    </label>
                    <input
                      id="rsvp-name"
                      ref={firstFieldRef}
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                      placeholder={RSVP.fields.name.placeholder}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="rsvp-email" className={labelClass}>
                      {RSVP.fields.email.label}
                    </label>
                    <input
                      id="rsvp-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder={RSVP.fields.email.placeholder}
                      className={fieldClass}
                    />
                  </div>

                  <fieldset>
                    <legend className={labelClass}>
                      {RSVP.fields.attending.label}
                    </legend>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
                      {(
                        [
                          ["yes", RSVP.fields.attending.yes],
                          ["no", RSVP.fields.attending.no],
                        ] as const
                      ).map(([value, text]) => (
                        <label
                          key={value}
                          className="flex cursor-pointer items-center gap-2 font-body text-[15px] text-ink"
                        >
                          <input
                            type="radio"
                            name="attending"
                            value={value}
                            required
                            checked={form.attending === value}
                            onChange={set("attending")}
                            className="accent-ribbon-deep"
                          />
                          {text}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {RSVP_SHOW_GUEST_COUNT && (
                    <div>
                      <label htmlFor="rsvp-guests" className={labelClass}>
                        {RSVP.fields.guests.label}
                      </label>
                      <input
                        id="rsvp-guests"
                        type="number"
                        min={1}
                        value={form.guests}
                        onChange={set("guests")}
                        placeholder={RSVP.fields.guests.placeholder}
                        className={fieldClass}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="rsvp-dietary" className={labelClass}>
                      {RSVP.fields.dietary.label}
                    </label>
                    <input
                      id="rsvp-dietary"
                      type="text"
                      value={form.dietary}
                      onChange={set("dietary")}
                      placeholder={RSVP.fields.dietary.placeholder}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="rsvp-message" className={labelClass}>
                      {RSVP.fields.message.label}
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={3}
                      value={form.message}
                      onChange={set("message")}
                      placeholder={RSVP.fields.message.placeholder}
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  {/* Honeypot — visually hidden, off the tab order */}
                  <div aria-hidden className="sr-only">
                    <label htmlFor="rsvp-hp">Leave this field empty</label>
                    <input
                      id="rsvp-hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form._hp}
                      onChange={set("_hp")}
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="mt-4 font-body text-[14px] leading-[1.6] text-ink">
                    {errorMsg || RSVP.errorBody}{" "}
                    <a
                      href={`mailto:${RSVP.mailtoFallback}`}
                      className="underline decoration-ribbon-deep underline-offset-2"
                    >
                      {RSVP.mailtoFallback}
                    </a>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-utility text-[12px] uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-ribbon-deep disabled:opacity-60"
                >
                  {status === "submitting"
                    ? RSVP.submittingLabel
                    : status === "error"
                      ? RSVP.retryLabel
                      : RSVP.submitLabel}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

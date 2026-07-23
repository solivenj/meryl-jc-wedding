"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RSVP } from "@/lib/content";
import { EASE_OUT } from "@/lib/motion";

/* Shape returned by /api/guests/lookup */
type Member = {
  guestId: string;
  name: string;
  plusOneAllowed: boolean;
  isKid: boolean;
};
type Prefill = {
  people: Record<string, { attending: string; dietary: string }>;
  plusOnes: Record<string, { name: string; attending: string; dietary: string }>;
  email: string;
  message: string;
};
type Match = {
  partyId: string;
  partyLabel: string;
  members: Member[];
  existing: Prefill | null;
};

type PersonAnswer = { attending: string; dietary: string };
type PlusOneAnswer = { name: string; attending: string; dietary: string };
type SubmitStatus = "idle" | "submitting" | "submitted" | "error";
type LookupStatus =
  | "idle"
  | "searching"
  | "results"
  | "notfound"
  | "closed"
  | "error";

const fieldClass =
  "mt-1.5 w-full rounded-md border border-ink/20 bg-ivory px-3 py-2.5 " +
  "font-body text-[15px] text-ink placeholder:text-ink-soft/60 " +
  "focus:border-ribbon-deep focus:outline-none";

const labelClass =
  "block font-utility text-[11px] uppercase tracking-[0.18em] text-ink-soft";

const mailtoLink = (
  <a
    href={`mailto:${RSVP.mailtoFallback}`}
    className="underline decoration-ribbon-deep underline-offset-2"
  >
    {RSVP.mailtoFallback}
  </a>
);

export function RsvpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const titleId = useId();
  const searchRef = useRef<HTMLInputElement>(null);

  // step 1 — search
  const [query, setQuery] = useState("");
  const [lookup, setLookup] = useState<LookupStatus>("idle");
  const [matches, setMatches] = useState<Match[]>([]);

  // step 1.5 — confirm before opening an existing RSVP for editing
  const [pendingEdit, setPendingEdit] = useState<Match | null>(null);

  // step 2 — party
  const [party, setParty] = useState<Match | null>(null);
  const [people, setPeople] = useState<Record<string, PersonAnswer>>({});
  const [plusOnes, setPlusOnes] = useState<Record<string, PlusOneAnswer>>({});
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isEditing = !!party?.existing;

  // Esc closes; lock body scroll; focus the search field on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => searchRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  // Reset everything once the modal has fully closed.
  useEffect(() => {
    if (open) return;
    const t = window.setTimeout(() => {
      setQuery("");
      setLookup("idle");
      setMatches([]);
      setPendingEdit(null);
      setParty(null);
      setPeople({});
      setPlusOnes({});
      setEmail("");
      setMessage("");
      setHp("");
      setStatus("idle");
      setErrorMsg("");
    }, 300);
    return () => window.clearTimeout(t);
  }, [open]);

  // Debounced name lookup while on the search step.
  useEffect(() => {
    if (!open || party) return;
    const q = query.trim();
    if (q.length < 2) {
      setMatches([]);
      setLookup("idle");
      return;
    }
    setLookup("searching");
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/guests/lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
          signal: ctrl.signal,
        });
        const data = await res.json();
        if (data.closed) {
          setLookup("closed");
          return;
        }
        const found: Match[] = data.matches ?? [];
        setMatches(found);
        setLookup(found.length ? "results" : "notfound");
      } catch (err) {
        if (!ctrl.signal.aborted) setLookup("error");
      }
    }, 300);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [query, open, party]);

  function selectParty(m: Match) {
    const nextPeople: Record<string, PersonAnswer> = {};
    const nextPlus: Record<string, PlusOneAnswer> = {};
    for (const member of m.members) {
      const prior = m.existing?.people[member.name];
      nextPeople[member.guestId] = {
        attending: prior?.attending ?? "",
        dietary: prior?.dietary ?? "",
      };
      const priorPlus = m.existing?.plusOnes[member.name];
      if (member.plusOneAllowed && priorPlus) {
        nextPlus[member.guestId] = {
          name: priorPlus.name,
          attending: priorPlus.attending,
          dietary: priorPlus.dietary,
        };
      }
    }
    setPeople(nextPeople);
    setPlusOnes(nextPlus);
    setEmail(m.existing?.email ?? "");
    setMessage(m.existing?.message ?? "");
    setStatus("idle");
    setErrorMsg("");
    setParty(m);
  }

  function backToSearch() {
    setParty(null);
    setStatus("idle");
    setErrorMsg("");
  }

  function setPerson(id: string, patch: Partial<PersonAnswer>) {
    setPeople((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  }
  function togglePlusOne(id: string, on: boolean) {
    setPlusOnes((p) => {
      const next = { ...p };
      if (on) next[id] = { name: "", attending: "yes", dietary: "" };
      else delete next[id];
      return next;
    });
  }
  function setPlusOne(id: string, patch: Partial<PlusOneAnswer>) {
    setPlusOnes((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!party || status === "submitting") return;

    // Light client checks; the server re-validates authoritatively.
    for (const m of party.members) {
      if (!people[m.guestId]?.attending) {
        setErrorMsg(`Please answer for ${m.name}.`);
        return;
      }
    }
    for (const [id, po] of Object.entries(plusOnes)) {
      if (!po.name.trim()) {
        const host = party.members.find((m) => m.guestId === id);
        setErrorMsg(`Please name ${host?.name ?? "your"}'s guest.`);
        return;
      }
    }
    if (!email.trim()) {
      setErrorMsg("Please add an email so we can reach you.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");
    const payload = {
      partyId: party.partyId,
      email,
      message,
      people: party.members.map((m) => ({
        guestId: m.guestId,
        attending: people[m.guestId].attending,
        dietary: people[m.guestId].dietary,
      })),
      plusOnes: Object.entries(plusOnes).map(([hostGuestId, po]) => ({
        hostGuestId,
        name: po.name,
        attending: po.attending,
        dietary: po.dietary,
      })),
      _hp: hp,
    };
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
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

  const overlayMotion = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const panelMotion = reduced
    ? overlayMotion
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
          <button
            type="button"
            aria-label="Close RSVP"
            onClick={onClose}
            className="absolute inset-0 bg-scrim"
          />

          <motion.div
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
                <h2 id={titleId} className="font-display text-5xl text-ink sm:text-6xl">
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
            ) : lookup === "closed" ? (
              <div className="py-6 text-center">
                <h2 id={titleId} className="font-display text-5xl text-ink sm:text-6xl">
                  {RSVP.closedTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-[36ch] font-body text-[15.5px] leading-[1.75] text-ink-soft">
                  {RSVP.closedBody} {mailtoLink}.
                </p>
              </div>
            ) : pendingEdit ? (
              /* ---- Step 1.5: confirm before opening an existing RSVP ---- */
              <div className="py-6 text-center">
                <h2 id={titleId} className="font-display text-4xl text-ink sm:text-5xl">
                  {RSVP.editConfirmTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-[36ch] font-body text-[15px] leading-[1.7] text-ink-soft">
                  {RSVP.editConfirmBody}
                </p>
                <div className="mt-7 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => setPendingEdit(null)}
                    className="font-utility text-[11px] uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
                  >
                    {RSVP.editConfirmNo}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      selectParty(pendingEdit);
                      setPendingEdit(null);
                    }}
                    className="rounded-full bg-ink px-6 py-3 font-utility text-[12px] uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-ribbon-deep"
                  >
                    {RSVP.editConfirmYes}
                  </button>
                </div>
              </div>
            ) : !party ? (
              /* ---- Step 1: find yourself ---- */
              <div>
                <h2 id={titleId} className="font-display text-5xl text-ink sm:text-6xl">
                  {RSVP.modalTitle}
                </h2>
                <p className="mt-2 font-body text-[14.5px] leading-[1.6] text-ink-soft">
                  {RSVP.search.intro}
                </p>

                <div className="mt-6">
                  <label htmlFor="rsvp-search" className={labelClass}>
                    {RSVP.search.label}
                  </label>
                  <input
                    id="rsvp-search"
                    ref={searchRef}
                    type="text"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={RSVP.search.placeholder}
                    className={fieldClass}
                  />
                  <p className="mt-2 font-body text-[13px] leading-[1.5] text-ink-soft/80">
                    {lookup === "searching" ? RSVP.search.searching : RSVP.search.help}
                  </p>
                </div>

                {lookup === "results" && (
                  <ul className="mt-4 space-y-2">
                    {matches.map((m) => (
                      <li key={m.partyId}>
                        <button
                          type="button"
                          onClick={() => (m.existing ? setPendingEdit(m) : selectParty(m))}
                          className="w-full rounded-md border border-ink/15 px-4 py-3 text-left transition-colors hover:border-ribbon-deep hover:bg-ribbon-light/30"
                        >
                          <span className="block font-body text-[15px] text-ink">
                            {m.members.map((x) => x.name).join(", ")}
                          </span>
                          <span className="mt-0.5 block font-utility text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                            {m.partyLabel}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {lookup === "notfound" && (
                  <p className="mt-4 font-body text-[14px] leading-[1.6] text-ink">
                    {RSVP.search.notFound} {mailtoLink}.
                  </p>
                )}
                {lookup === "error" && (
                  <p className="mt-4 font-body text-[14px] leading-[1.6] text-ink">
                    {RSVP.errorBody} {mailtoLink}.
                  </p>
                )}
              </div>
            ) : (
              /* ---- Step 2: your party ---- */
              <form onSubmit={handleSubmit} noValidate>
                <h2 id={titleId} className="font-display text-4xl text-ink sm:text-5xl">
                  {party.partyLabel}
                </h2>
                <p className="mt-2 font-body text-[14.5px] leading-[1.6] text-ink-soft">
                  {isEditing ? RSVP.editingNote : RSVP.party.intro}
                </p>

                <div className="mt-6 space-y-6">
                  {party.members.map((m) => (
                    <div key={m.guestId} className="border-t border-ink/10 pt-5 first:border-t-0 first:pt-0">
                      {/* Only worth naming the person when there's more than one
                          in the party — for a party of one it just repeats the
                          heading above. */}
                      {party.members.length > 1 && (
                        <div className="flex items-baseline justify-between">
                          <span className="font-body text-[16px] text-ink">{m.name}</span>
                          {m.isKid && (
                            <span className="font-utility text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                              {RSVP.party.kidTag}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
                        {([["yes", RSVP.party.yes], ["no", RSVP.party.no]] as const).map(
                          ([value, text]) => (
                            <label
                              key={value}
                              className="flex cursor-pointer items-center gap-2 font-body text-[15px] text-ink"
                            >
                              <input
                                type="radio"
                                name={`att-${m.guestId}`}
                                value={value}
                                checked={people[m.guestId]?.attending === value}
                                onChange={() => setPerson(m.guestId, { attending: value })}
                                className="accent-ribbon-deep"
                              />
                              {text}
                            </label>
                          ),
                        )}
                      </div>

                      <input
                        type="text"
                        aria-label={`${RSVP.party.dietaryLabel} for ${m.name}`}
                        value={people[m.guestId]?.dietary ?? ""}
                        onChange={(e) => setPerson(m.guestId, { dietary: e.target.value })}
                        placeholder={RSVP.party.dietaryPlaceholder}
                        className={fieldClass}
                      />

                      {m.plusOneAllowed &&
                        (plusOnes[m.guestId] ? (
                          <div className="mt-3 rounded-md border border-ribbon/40 bg-ribbon-light/20 p-3">
                            <div className="flex items-center justify-between">
                              <span className={labelClass}>{RSVP.party.addPlusOne}</span>
                              <button
                                type="button"
                                onClick={() => togglePlusOne(m.guestId, false)}
                                className="font-utility text-[10px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
                              >
                                {RSVP.party.removePlusOne}
                              </button>
                            </div>
                            <input
                              type="text"
                              aria-label="Guest name"
                              value={plusOnes[m.guestId].name}
                              onChange={(e) => setPlusOne(m.guestId, { name: e.target.value })}
                              placeholder={RSVP.party.plusOneNamePlaceholder}
                              className={fieldClass}
                            />
                            <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
                              {([["yes", RSVP.party.yes], ["no", RSVP.party.no]] as const).map(
                                ([value, text]) => (
                                  <label
                                    key={value}
                                    className="flex cursor-pointer items-center gap-2 font-body text-[15px] text-ink"
                                  >
                                    <input
                                      type="radio"
                                      name={`att-plus-${m.guestId}`}
                                      value={value}
                                      checked={plusOnes[m.guestId].attending === value}
                                      onChange={() => setPlusOne(m.guestId, { attending: value })}
                                      className="accent-ribbon-deep"
                                    />
                                    {text}
                                  </label>
                                ),
                              )}
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => togglePlusOne(m.guestId, true)}
                            className="mt-3 font-utility text-[11px] uppercase tracking-[0.2em] text-ribbon-deep hover:text-ink"
                          >
                            + {RSVP.party.addPlusOne}
                            <span className="ml-2 font-body text-[12px] normal-case tracking-normal text-ink-soft">
                              {RSVP.party.plusOneNote}
                            </span>
                          </button>
                        ))}
                    </div>
                  ))}

                  <div className="border-t border-ink/10 pt-5">
                    <label htmlFor="rsvp-email" className={labelClass}>
                      {RSVP.party.emailLabel}
                    </label>
                    <input
                      id="rsvp-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={RSVP.party.emailPlaceholder}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="rsvp-message" className={labelClass}>
                      {RSVP.party.messageLabel}
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={RSVP.party.messagePlaceholder}
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
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="mt-4 font-body text-[14px] leading-[1.6] text-ink">
                    {errorMsg} {status === "error" && <>— {mailtoLink}</>}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={backToSearch}
                    className="font-utility text-[11px] uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
                  >
                    ← {RSVP.search.backLabel}
                  </button>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="rounded-full bg-ink px-6 py-3 font-utility text-[12px] uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-ribbon-deep disabled:opacity-60"
                  >
                    {status === "submitting"
                      ? RSVP.submittingLabel
                      : status === "error"
                        ? RSVP.retryLabel
                        : RSVP.submitLabel}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

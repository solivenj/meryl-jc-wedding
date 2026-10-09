# Wiring up the Italy RSVP

The Italy RSVP form is already built and live at `/italy-wedding/rsvp`. What it
does **not** have is a spreadsheet to write to.

Until `ITALY_GOOGLE_SHEET_ID` is set, the Italy flow runs in *fixture mode*: it
looks guests up in `lib/guests-fixture-italy.ts` (six invented people), accepts
submissions, logs `would append`, and writes nothing — while still showing the
guest the success screen. In production that's now blocked (the submit route
returns 503 and tells the guest to email instead), but locally it will still
quietly no-op, which is what you want for development.

Everything below is a one-time setup.

---

## 1. Create the spreadsheet

Make a **new, separate** Google Sheet — not a tab on the church one. The two
events deliberately use different files because party ids can collide between
them ("the diaz family 1" could exist in both), and a browser's proof for one
wedding must never unlock the other's answers.

It needs exactly two tabs, named **`Guests`** and **`Responses`**.

## 2. The `Guests` tab — you fill this in

Put these headers in row 1. Columns are matched by **name**, not position, so
the order doesn't matter and extra columns of your own are ignored.

| Header | What it does |
|---|---|
| `party_label` | The household name shown in the form — "The Franco Family". Leave blank for someone invited alone; their own name is used. |
| `first_name` | Required. A row with both name cells empty is skipped. |
| `last_name` | Required. |
| `display_name` | Optional. Overrides "First Last" in the UI. Both forms still work for lookup, so a nickname here doesn't lock out someone typing their legal name. |
| `plus_one_allowed` | `yes` / `y` / `true` / `1` / `x` all count as yes. Anything else is no. |
| `is_kid` | Same rule. Shows the "Child" tag. |
| `party_id` | Usually leave blank — see the warning below. |
| `guest_id` | Leave blank. Overrides one person's derived id; you shouldn't need it. |

**The one thing that can go wrong:** `party_id` is only needed when **two
unrelated households share the same `party_label`** — two different "The Rossi
Family" entries, say. If that happens, give each household its own value (`1`
and `2` is fine) **on every row of both households**.

A half-filled `party_id` column silently merges the two families into one
party, which means either family can see and overwrite the other's RSVP. It's
the only genuinely dangerous cell on the sheet. Blank everywhere is safe;
blank on *some* rows is not.

## 3. The `Responses` tab — the app writes this

Put these seven headers in row 1, **exactly, in columns A–G**:

```
Timestamp | Name | Email | Yes/No? | Dietary Needs | Additional Messages | Notes
```

**You have to type this header row yourself.** The app never creates it, and it
treats row 1 as the header unconditionally — so an empty tab means every read
back is mis-mapped, and guests lose edit-prefill and resubmission detection.

Two things not to tidy up later:

- **Don't reformat the `Name` column.** A plus-one has no column of their own;
  they're written as `Jane Smith — guest of Aaron Diaz` and read back by that
  exact separator.
- **Don't re-sort or delete rows mid-season.** One submission is several rows
  sharing a timestamp, and that shared timestamp is the only thing grouping
  them. Editing a party's answer appends a fresh set rather than updating the
  old one, with a "Resubmitted …" stamp in `Notes`.

## 4. Share it

Share the spreadsheet with the service account address — the value of
`GOOGLE_SERVICE_ACCOUNT_EMAIL`, the same one the church sheet already uses — as
**Editor**. Viewer is not enough; the app appends.

## 5. Environment variables

Set these in `.env.local` for local dev **and** in the Vercel project settings
(Production, Preview and Development) for the deployed site. Restart `next dev`
after editing `.env.local`; redeploy after changing Vercel.

| Variable | New? | Notes |
|---|---|---|
| `ITALY_GOOGLE_SHEET_ID` | **yes** | The long token in the sheet's URL: `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | no | Already set. Shared by both weddings. |
| `GOOGLE_PRIVATE_KEY` | no | Already set. |
| `GOOGLE_SHEET_ID` | no | The church sheet. Already set. |
| `RSVP_COOKIE_SECRET` | no | Already set. Also what gates the accommodations page — if it's ever unset, no guest can reach their accommodation details. |

## 6. Check it worked

1. Look up a **real** guest from your new sheet. If you get back Marco Rossi,
   Elena Conti or Ana Santos, you're still on the fixtures — the sheet id isn't
   being read.
2. Submit a test RSVP with at least one **yes**.
3. Confirm a row actually appears in the `Responses` tab. This is the real
   proof; the success screen alone doesn't tell you anything.
4. Confirm the success screen offers the accommodation link, and that
   `/italy-wedding/accommodations` opens.
5. Delete the test rows.

---

## Related: things that are set elsewhere

- **The RSVP deadline** is `ITALY_RSVP_DEADLINE` in `lib/config.ts`, not an env
  var — changing it needs a deploy. It is currently `null`, meaning RSVPs never
  close, even though the page copy says "kindly reply by the first of February".
  Set it to an ISO string (e.g. `"2027-02-01T23:59:59-05:00"`) when you want
  that enforced.
- **The guest list is cached for 60 seconds.** An edit to the `Guests` tab takes
  up to a minute to show up. Responses are not cached.
- **Audit warnings** are logged on each cache refresh — duplicate names, a name
  shared across two parties, a half-filled `party_id`, a party over 8 people.
  Worth checking the logs once after you first paste the real list in.

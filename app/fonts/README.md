# Self-hosted fonts

Licensed webfont files that are not on Google Fonts live here, loaded with
`next/font/local` from the layout that uses them.

## Amoresa

`Amoresa.woff2`: Amoresa by Andrey Sharonov, a webfont license bought from
MyFonts. Loaded in `app/italy/layout.tsx` as `--font-amoresa` and used for the
venue name on the Italy home collage card. If it ever fails to load, the card
falls back to Pinyon Script (`var(--font-amoresa, var(--font-pinyon))` in
`components/italy/DetailCollage.tsx`).

The date line on the same card is set in Amoresa as well.

Le Jour Serif and TT Ramillas were tried for the dates and dropped: the free
copies were demo or trial builds (watermarked digits, or a letters-only
subset) and are git-ignored.

Trial copies (anything named `*Trial*` or `*trl*`) are git-ignored: their
license is evaluation only.

Only webfont-licensed files go here. Desktop or demo licenses do not cover
embedding on a website.

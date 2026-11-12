# Self-hosted fonts

Licensed webfont files that are not on Google Fonts live here, loaded with
`next/font/local` from the layout that uses them.

## Amoresa

`Amoresa.woff2`: Amoresa by Andrey Sharonov, a webfont license bought from
MyFonts. Loaded in `app/italy/layout.tsx` as `--font-amoresa` and used for the
venue name on the Italy home collage card. If it ever fails to load, the card
falls back to Pinyon Script (`var(--font-amoresa, var(--font-pinyon))` in
`components/italy/DetailCollage.tsx`).

## Le Jour Serif (pending)

The date line on the same collage card is meant to be Le Jour Serif by Din
Studio (https://din-studio.com/product/le-jour-font-duo/). The free
"Personal Use" file renders every digit and the comma as a "PERSONAL USE ONLY"
watermark, so it is git-ignored and not loaded. Once the licensed file is
here, load it in `app/italy/layout.tsx` as `--font-le-jour`; the card already
asks for it and shows Pinyon Script until then. The demo had no en dash, so the
card's dates use a hyphen.

Trial copies (anything named `*Trial*` or `*trl*`) are git-ignored: their
license is evaluation only.

Only webfont-licensed files go here. Desktop or demo licenses do not cover
embedding on a website.

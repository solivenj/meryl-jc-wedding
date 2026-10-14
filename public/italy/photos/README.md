# Home page carousel photos

Put photos here (`.jpg`, `.jpeg`, `.png`, `.webp` or `.avif`). They show up in the slow-scrolling band at the top of /italy, in filename order. Name them `01-…`, `02-…` and so on to control the sequence.

- **Crop to 4:5 before you add them.** Every slot on this site is 4:5 — the carousel slide, the polaroids on the home page, the Our Story tiles — so anything else is cropped anyway, and a landscape photo comes out visibly soft: `object-cover` scales a wide frame to match the slot's *height*, so the browser needs a bitmap far wider than `sizes` asks next/image for, and upscales what it gets. Measured at 1.5× on a 3:2 frame at DPR2 and 1.7× at DPR3. A 4:5 file has nothing to upscale.
- Aim for about 2300px on the long edge, which is what the rest of the folder is. More is wasted; next/image never serves above about 1100px wide here.
- You need at least 3 photos. With fewer, the band shows the warm placeholder panels.

`node scripts/process-photos.mjs <srcDir> <subdir>` does the resize and strips EXIF (including GPS) if you have a folder to bring in. It does not crop.

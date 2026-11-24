# varunsood189.github.io

Personal portfolio and School of AI (EAG V3) project catalog, deployed with GitHub Pages.

## Pages

- `index.html` — editorial homepage (selected work, experience, School of AI intro, certifications including EAG V3)
- `schoolofai.html` — full assignment catalog driven by `data/projects.json`
- `projects/*.html` — case studies for the four homepage selections
- `assets/schoolofai/EAGV3-certificate.pdf` — EAG V3 completion certificate

## Local preview

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/

## Design notes

Static HTML/CSS/JS only. Shared tokens live in `styles.css`. Catalog behavior is in `js/schoolofai.js`.
See `docs/phase0-audit.md` and `docs/phase1-design.md` for the redesign audit and token decisions.

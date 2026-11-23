# Phase 0 — Repository & content audit

**Date:** 24 Nov 2026 (Asia/Calcutta)  
**Branch base:** `main` @ `05ff1b6`  
**Live:** https://varunsood189.github.io/

## Architecture map

- Static GitHub Pages (`build_type: legacy`, source `main` `/`)
- No build step, no package manager
- Homepage: `index.html` + `styles.css` + Lucide CDN + `js/schoolofai.js` (featured fetch)
- Catalog: `schoolofai.html` + `css/schoolofai.css` + `js/schoolofai.js` + `data/projects.json`
- Assets: resume, thin portfolio PDF, EAG certificate, gradient project webps

## Resume ↔ site verification

| Fact | Resume | Site (pre-redesign) | Confidence |
|------|--------|---------------------|------------|
| Title framing | Senior AI Engineer | GenAI Architect / rotating roles | Align to resume |
| Current role | AVP, Python Engineer FX (Gen AI), Citi, Aug 2025– | Matches | High |
| Prior | Senior Data Scientist, dataeaze, Apr 2022–Aug 2025 | Present | High |
| Prior | Senior Software Specialist, Infineon, Jul 2019–Mar 2022 | Present | High |
| Intern | Extreme Blue, IBM, May–Jul 2018 | Often omitted on site | Add if space |
| Education | M.Tech IIT Delhi 8.48; BE UIET PU 8.37 Hons | Matches | High |
| Certs | DeepLearning.AI Coursera | Site had LinkedIn/edX set; EAG missing from Certs | Fix |
| Email | varunsood189@gmail.com | Matches | High |
| Metrics (90%+, 80%, 67%, 0.68%) | Resume-backed | Hero used as decorative stats | Keep only in experience/context |

## School of AI catalog

18 records in `data/projects.json`. All public `repoUrl` values returned HTTP 200 except PromptForge and Job Feed Curator (no public repo — keep as local/demo).

Featured shortlist for homepage (verified depth): `knowledge-graph`, `growing-graph`, `eag-cognitive`, `directory-agent`.

## Critical backlog (pre-redesign)

1. Remove rotating hero + unverified-feeling stat strip from first viewport
2. Replace purple glass visual system with editorial tokens
3. Unify project storytelling; drop hardcoded Key Projects duplication
4. Put EAG V3 certificate in Certifications + SoAI intro
5. Demote thin `School_of_AI_Portfolio.pdf` until redesigned
6. Rebuild SoAI catalog with shared visual system
7. Add 3–4 evidence-led case study pages

## Link check summary

All primary site assets and public project repos returned 200 at audit time.
# Phase 1 — Design direction

## Selected work (homepage)

1. `knowledge-graph` — System Design Knowledge Graph  
2. `growing-graph` — Multi-Agent Growing-Graph Orchestrator  
3. `eag-cognitive` — EAG Cognitive Agent  
4. `directory-agent` — Directory Agent (AgentSwitch seat 27)

Case study URLs: `/projects/<id>.html` (new; no existing URL breakage).

## Design tokens

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#F4F1EA` wait - plan said ivory but user rules avoid cream #F4F1EA terracotta look | Use `#F6F5F1` warm paper carefully OR cooler `#F3F4F6` with charcoal |

**Chosen system (avoid terracotta/serif AI cluster):**
- Background: `#F2F3F5` (cool paper)
- Surface: `#FFFFFF`
- Ink: `#14171C`
- Muted: `#5C6570`
- Border: `#D5DAE0`
- Accent: `#2F4B6E` (steel navy)
- Accent soft: `#E7EEF5`
- Font UI: **Figtree** (Google Fonts)
- Font display: **Fraunces** only for the wordmark / H1 name — restrained, not cream-terracotta pairing
- Radius: 4px max
- Motion: 150ms opacity/color; honor `prefers-reduced-motion`

## Homepage wireframe (desktop)

```
[ Name ]  Work  Experience  School of AI  About  Contact   [Resume]
────────────────────────────────────────────────────────────────
Varun Sood
Senior AI Engineer · AVP, Python Engineer FX (Gen AI), Citi
Two-line summary.
[ View selected work ]  [ Resume ]

Selected work
  1. Knowledge Graph — problem / contribution / tech — Case study · Repo
  2. Growing-Graph …
  3. EAG Cognitive …
  4. Directory Agent …

Experience (chronological)
Technical focus (3 prose areas)
School of AI (intro + cert + catalog link)
About · Education · Certifications (incl. EAG V3)
Contact
```

## Reference notes (transfer, don’t copy)

- Brittany Chiang: nav restraint, section rhythm  
- Kent C. Dodds: clarity of role + teaching credibility  
- Tania Rascia: typography + readable long-form  
Reject: neon themes, dashboard stats, bento glass cards.
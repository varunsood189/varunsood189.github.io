/**
 * School of AI catalog renderer for GitHub Pages.
 */
(function () {
  const DATA_URL = document.body.dataset.projectsUrl || "data/projects.json";
  const IS_CATALOG = document.body.dataset.page === "catalog";

  let catalogData = null;
  let sortMode = "assignment";
  let activeFilter = "all";

  const FILTER_MAP = {
    all: () => true,
    Chrome: (p) => /chrome|extension|manifest/i.test(JSON.stringify(p)),
    MCP: (p) => /mcp|fastmcp|prefab/i.test(JSON.stringify(p)),
    FastAPI: (p) => /fastapi/i.test(JSON.stringify(p)),
    Agents: (p) => /agent|orchestrat|pipeline|gemini|graph/i.test(JSON.stringify(p)),
    "Full-stack": (p) => /full-stack|react|postgres|fastapi|observatory/i.test(JSON.stringify(p)),
  };

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clip(str, max) {
    const clean = String(str || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const slice = clean.slice(0, max);
    const cut = slice.lastIndexOf(" ");
    return (cut > 40 ? slice.slice(0, cut) : slice).trimEnd() + "…";
  }

  function techPills(stack) {
    return (stack || [])
      .slice(0, 8)
      .map((t) => `<span class="tech-pill">${escapeHtml(t)}</span>`)
      .join("");
  }

  function repoLinks(p) {
    const links = [];
    if (p.repoUrl) {
      links.push(
        `<a href="${escapeHtml(p.repoUrl)}" class="btn btn-primary" target="_blank" rel="noopener">View repository</a>`
      );
    }
    (p.extraRepos || []).forEach((url, i) => {
      const label = p.id === "task-link" ? (i === 0 ? "Extension" : "Backend") : `Repo ${i + 1}`;
      links.push(
        `<a href="${escapeHtml(url)}" class="btn btn-ghost" target="_blank" rel="noopener">${label}</a>`
      );
    });
    if (!links.length) {
      return '<span class="text-small text-muted">No public repository listed yet</span>';
    }
    return links.join(" ");
  }

  function scoreBlockHtml(p) {
    return `<div class="card-scores">
      <span class="score-pill">Complexity ${p.complexityScore}</span>
      <span class="score-pill">Info ${p.infoScore}</span>
      <span class="score-pill">Assignment ${p.assignment}</span>
    </div>`;
  }

  function diagramBlock(p) {
    const d = p.diagram || {};
    if (d.type === "mermaid" && d.content) {
      return `<div class="diagram-wrap"><pre class="mermaid">${escapeHtml(d.content)}</pre></div>`;
    }
    if (d.type === "text" && d.content) {
      return `<div class="diagram-wrap"><pre class="diagram-text">${escapeHtml(d.content)}</pre></div>`;
    }
    return '<p class="text-small text-muted">No architecture diagram in the source README.</p>';
  }

  function catalogCard(p) {
    const hl = p.highlights || [];
    return `
      <details class="project-list-card">
        <summary>
          <div>
            <div class="card-label">Assignment ${p.assignment} · ${escapeHtml(p.category)}</div>
            <h3>${escapeHtml(p.name)}</h3>
            <p class="text-small text-muted">${escapeHtml(clip(p.tagline || "", 140))}</p>
          </div>
          ${scoreBlockHtml(p)}
        </summary>
        <div class="details-body">
          <p class="text-muted" style="margin-bottom:12px;">${escapeHtml((p.description || "").replace(/\*\*/g, ""))}</p>
          ${
            hl.length
              ? `<ul class="highlights-list">${hl
                  .map((h) => `<li>${escapeHtml(String(h).replace(/\*\*/g, ""))}</li>`)
                  .join("")}</ul>`
              : ""
          }
          <div style="margin:12px 0;">${techPills(p.techStack)}</div>
          <h4 style="font-size:14px;margin:16px 0 8px;">Architecture</h4>
          ${diagramBlock(p)}
          ${
            p.example
              ? `<h4 style="font-size:14px;margin:16px 0 8px;">Example</h4><pre class="example-code">${escapeHtml(
                  p.example
                )}</pre>`
              : ""
          }
          <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">${repoLinks(p)}</div>
        </div>
      </details>`;
  }

  function sortProjects(list) {
    const copy = [...list];
    if (sortMode === "assignment") {
      copy.sort((a, b) => a.assignment - b.assignment || a.name.localeCompare(b.name));
    } else if (sortMode === "info") {
      copy.sort((a, b) => b.infoScore - a.infoScore || b.complexityScore - a.complexityScore);
    } else {
      copy.sort((a, b) => b.complexityScore - a.complexityScore || b.infoScore - a.infoScore);
    }
    return copy;
  }

  function filterProjects(list) {
    const fn = FILTER_MAP[activeFilter] || FILTER_MAP.all;
    return list.filter(fn);
  }

  function renderCatalog(data) {
    const list = document.getElementById("project-list");
    if (!list) return;
    const filtered = filterProjects(sortProjects(data.projects));
    const countEl = document.getElementById("project-count");
    if (countEl) {
      countEl.textContent = `${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
    }
    list.innerHTML =
      filtered.map(catalogCard).join("") || '<p class="text-muted">No projects match this filter.</p>';
    renderMermaid();
  }

  function renderMermaid() {
    if (typeof mermaid === "undefined") return;
    mermaid.run({ querySelector: ".mermaid" }).catch(function () {});
  }

  function bindCatalogControls() {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", function (e) {
        sortMode = e.target.value;
        renderCatalog(catalogData);
      });
    }
    document.querySelectorAll(".filter-chips .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".filter-chips .chip").forEach(function (c) {
          c.classList.remove("active");
        });
        chip.classList.add("active");
        activeFilter = chip.dataset.filter || "all";
        renderCatalog(catalogData);
      });
    });
  }

  function init() {
    if (!IS_CATALOG) return;
    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(function (data) {
        catalogData = data;
        bindCatalogControls();
        renderCatalog(data);
      })
      .catch(function (err) {
        const el = document.getElementById("project-list");
        if (el) {
          el.innerHTML =
            '<p class="text-muted">Failed to load projects: ' + escapeHtml(err.message) + "</p>";
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

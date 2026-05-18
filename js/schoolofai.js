/**
 * School of AI portfolio renderer — shared by preview and GitHub Pages.
 */
(function () {
    const DATA_URL = document.body.dataset.projectsUrl || 'data/projects.json';
    const IS_HOME = document.body.dataset.page === 'home';
    const IS_CATALOG = document.body.dataset.page === 'catalog';
    const IS_EMBED = document.body.dataset.page === 'embed';

    let catalogData = null;
    let sortMode = 'complexity';
    let activeFilter = 'all';

    const GRADIENTS = {
        'task-link': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'research-pulse': 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        'stock-intel': 'linear-gradient(135deg, #10b981, #3b82f6)',
        'mcp-prefab': 'linear-gradient(135deg, #f59e0b, #8b5cf6)',
        'knowledge-graph': 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        stockwise: 'linear-gradient(135deg, #22c55e, #3b82f6)',
        promptforge: 'linear-gradient(135deg, #a855f7, #6366f1)',
        'job-finder': 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
    };

    const FILTER_MAP = {
        all: () => true,
        Chrome: (p) => /chrome|extension|manifest/i.test(JSON.stringify(p)),
        MCP: (p) => /mcp|fastmcp|prefab/i.test(JSON.stringify(p)),
        FastAPI: (p) => /fastapi/i.test(JSON.stringify(p)),
        Agents: (p) => /agent|orchestrat|pipeline|gemini/i.test(JSON.stringify(p)),
        'Full-stack': (p) => /full-stack|react|postgres|kafka/i.test(JSON.stringify(p)),
    };

    function initials(name) {
        return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function techPills(stack) {
        return (stack || []).slice(0, 6).map((t) => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('');
    }

    function repoLinks(p) {
        const links = [];
        if (p.repoUrl) {
            links.push(`<a href="${escapeHtml(p.repoUrl)}" class="btn btn-primary" target="_blank" rel="noopener">View Code</a>`);
        }
        (p.extraRepos || []).forEach((url, i) => {
            const label = p.id === 'task-link' ? (i === 0 ? 'Extension' : 'Backend') : `Repo ${i + 1}`;
            links.push(`<a href="${escapeHtml(url)}" class="btn btn-ghost" target="_blank" rel="noopener">${label}</a>`);
        });
        if (!links.length) return '<span class="text-small text-muted">Local project — repo coming soon</span>';
        return links.join(' ');
    }

    function thumbHtml(p, large) {
        const grad = GRADIENTS[p.id] || 'linear-gradient(135deg, #8b5cf6, #3b82f6)';
        const h = large ? 160 : 72;
        return `<div class="card-thumb" style="height:${h}px;background:${grad}" aria-hidden="true">${initials(p.name)}</div>`;
    }

    function scoreBlockHtml(p) {
        return `<div class="card-scores">
            <span class="score-pill">Complexity ${p.complexityScore}</span>
            <span class="score-pill">Info ${p.infoScore}</span>
            <span class="score-pill">Assignment ${p.assignment}</span>
        </div>`;
    }

    function featuredCard(p, colClass) {
        const hl = (p.highlights || []).slice(0, 3);
        return `
            <article class="glass-card project-card-featured ${colClass} reveal">
                ${thumbHtml(p, true)}
                <div class="card-label">${escapeHtml(p.category)} · Assignment ${p.assignment}</div>
                <h3 style="font-size:22px;margin-bottom:8px;">${escapeHtml(p.name)}</h3>
                <p class="text-muted text-small" style="margin-bottom:12px;">${escapeHtml((p.tagline || p.description || '').slice(0, 160))}</p>
                ${hl.length ? `<ul class="highlights-list">${hl.map((h) => `<li>${escapeHtml(h.replace(/\*\*/g, ''))}</li>`).join('')}</ul>` : ''}
                <div style="margin:12px 0;">${techPills(p.techStack)}</div>
                ${scoreBlockHtml(p)}
                <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">${repoLinks(p)}</div>
            </article>`;
    }

    function diagramBlock(p) {
        const d = p.diagram || {};
        if (d.type === 'mermaid' && d.content) {
            return `<div class="diagram-wrap"><pre class="mermaid">${escapeHtml(d.content)}</pre></div>`;
        }
        if (d.type === 'text' && d.content) {
            return `<div class="diagram-wrap"><pre class="diagram-text">${escapeHtml(d.content)}</pre></div>`;
        }
        return '<p class="text-small text-muted">No architecture diagram in README.</p>';
    }

    function catalogCard(p) {
        return `
            <details class="glass-card project-list-card reveal">
                <summary>
                    <div>
                        <div class="card-label">A${p.assignment} · ${escapeHtml(p.category)}</div>
                        <h3 style="font-size:20px;">${escapeHtml(p.name)}</h3>
                        <p class="text-small text-muted">${escapeHtml((p.tagline || '').slice(0, 100))}</p>
                    </div>
                    <div style="text-align:right;">${scoreBlockHtml(p)}</div>
                </summary>
                <div class="details-body">
                    <p class="text-muted" style="margin-bottom:12px;">${escapeHtml(p.description)}</p>
                    ${(p.highlights || []).length ? `<ul class="highlights-list">${p.highlights.map((h) => `<li>${escapeHtml(h.replace(/\*\*/g, ''))}</li>`).join('')}</ul>` : ''}
                    <div style="margin:12px 0;">${techPills(p.techStack)}</div>
                    <h4 style="font-size:14px;margin:16px 0 8px;">Architecture</h4>
                    ${diagramBlock(p)}
                    ${p.example ? `<h4 style="font-size:14px;margin:16px 0 8px;">Example</h4><pre class="example-code">${escapeHtml(p.example)}</pre>` : ''}
                    <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">${repoLinks(p)}</div>
                </div>
            </details>`;
    }

    function sortProjects(list) {
        const copy = [...list];
        if (sortMode === 'assignment') {
            copy.sort((a, b) => a.assignment - b.assignment || a.name.localeCompare(b.name));
        } else if (sortMode === 'info') {
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

    function renderHome(data) {
        const grid = document.getElementById('featured-grid') || document.getElementById('schoolofai-featured-grid');
        if (!grid) return;
        const top = data.projects.filter((p) => p.featuredRank).sort((a, b) => a.featuredRank - b.featuredRank);
        const cols = ['col-8', 'col-4', 'col-4'];
        grid.innerHTML = top.map((p, i) => featuredCard(p, cols[i] || 'col-4')).join('');
        observeReveal();
        renderMermaid();
    }

    function renderCatalog(data) {
        const list = document.getElementById('project-list');
        if (!list) return;
        const filtered = filterProjects(sortProjects(data.projects));
        list.innerHTML = filtered.map(catalogCard).join('') || '<p class="text-muted">No projects match this filter.</p>';
        observeReveal();
        renderMermaid();
    }

    function renderMermaid() {
        if (typeof mermaid === 'undefined') return;
        mermaid.run({ querySelector: '.mermaid' }).catch(function () {});
    }

    function observeReveal() {
        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    e.target.classList.add('active');
                }
            });
        }, { threshold: 0.08 });
        document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) { obs.observe(el); });
    }

    function bindCatalogControls() {
        var sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function (e) {
                sortMode = e.target.value;
                renderCatalog(catalogData);
            });
        }
        document.querySelectorAll('.filter-chips .chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                document.querySelectorAll('.filter-chips .chip').forEach(function (c) { c.classList.remove('active'); });
                chip.classList.add('active');
                activeFilter = chip.dataset.filter || 'all';
                renderCatalog(catalogData);
            });
        });
    }

    function init() {
        fetch(DATA_URL)
            .then(function (res) {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(function (data) {
                catalogData = data;
                if (IS_HOME || IS_EMBED) renderHome(data);
                if (IS_CATALOG) {
                    bindCatalogControls();
                    renderCatalog(data);
                }
            })
            .catch(function (err) {
                var el = document.getElementById('featured-grid') || document.getElementById('schoolofai-featured-grid') || document.getElementById('project-list');
                if (el) el.innerHTML = '<p class="text-muted">Failed to load projects: ' + escapeHtml(err.message) + '. Run extract_projects.py first.</p>';
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

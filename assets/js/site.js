/* Shared helpers for the home page and the player page. */
(function () {
  'use strict';
  const PV = (window.PV = {});
  const KEY = 'pv:';

  PV.get = (k, d) => { try { const v = localStorage.getItem(KEY + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  PV.set = (k, v) => { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } };

  PV.byId = (id) => window.GAMES.find((g) => g.id === id);
  PV.favs = () => PV.get('favs', []);
  PV.isFav = (id) => PV.favs().includes(id);
  PV.toggleFav = (id) => {
    const f = PV.favs();
    const i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.unshift(id);
    PV.set('favs', f);
    return i < 0;
  };
  PV.recents = () => PV.get('recent', []).filter((id) => PV.byId(id));
  PV.addRecent = (id) => {
    const r = PV.recents().filter((x) => x !== id);
    r.unshift(id);
    PV.set('recent', r.slice(0, 12));
  };
  PV.best = (id) => PV.get('best:' + id, null);
  PV.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  PV.tagLabel = (t) => (window.CATEGORIES.find((c) => c.id === t) || { label: t }).label;

  // Thumbnail with an emoji fallback if the image is missing.
  PV.thumbHTML = (g) =>
    `<span class="emoji" aria-hidden="true">${g.emoji}</span><img src="assets/thumbs/${g.id}.jpg" alt="" loading="lazy" onerror="this.remove()">`;

  PV.cardHTML = (g) => {
    const best = PV.best(g.id);
    const fav = PV.isFav(g.id);
    return `<a class="card" href="play.html?g=${encodeURIComponent(g.id)}" data-id="${g.id}">
      <div class="thumb" style="--c:${g.color}">
        ${PV.thumbHTML(g)}
        <span class="badge">${PV.esc(PV.tagLabel(g.tags[0]))}</span>
        <button class="fav${fav ? ' on' : ''}" type="button" data-fav="${g.id}" aria-label="${fav ? 'Remove from' : 'Add to'} favourites" title="Favourite">${fav ? '♥' : '♡'}</button>
        <div class="play"><span>▶</span></div>
      </div>
      <div class="meta">
        <h3>${PV.esc(g.title)}</h3>
        <p>${PV.esc(g.desc)}</p>
        ${best ? `<div class="best">★ Best: ${Number(best).toLocaleString()}</div>` : ''}
      </div>
    </a>`;
  };

  // Heart buttons inside cards (they sit inside a link, so stop the click from opening the game).
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const on = PV.toggleFav(b.dataset.fav);
    document.querySelectorAll(`[data-fav="${b.dataset.fav}"]`).forEach((x) => {
      x.classList.toggle('on', on);
      x.textContent = on ? '♥' : '♡';
      x.setAttribute('aria-label', (on ? 'Remove from' : 'Add to') + ' favourites');
    });
    document.dispatchEvent(new CustomEvent('pv:favs'));
  });

  PV.randomGame = (exclude) => {
    const list = window.GAMES.filter((g) => g.id !== exclude);
    return list[Math.floor(Math.random() * list.length)];
  };

  // Press "/" to jump to the search box.
  document.addEventListener('keydown', (e) => {
    const q = document.getElementById('q');
    if (e.key === '/' && q && document.activeElement !== q && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      e.preventDefault();
      q.focus();
    }
  });
})();

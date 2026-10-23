/* ==========================================================================
   7VEN ATHLETES & FAN-OUT DECK CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  let athletes = [];

  const grid = document.getElementById('athletesGrid');
  const searchInput = document.getElementById('rosterSearchInput');
  const filterBtns = document.querySelectorAll('.roster-directory-section .roster-filter-btn');

  // Modal elements
  const modal = document.getElementById('athleteModal');
  const modalClose = document.getElementById('athleteModalClose');
  const modalImg = document.getElementById('modalAthleteImg');
  const modalName = document.getElementById('modalAthleteName');
  const modalRole = document.getElementById('modalAthleteRole');
  const modalBadge = document.getElementById('modalAthleteBadge');
  const modalEarnings = document.getElementById('modalAthleteEarnings');
  const modalBio = document.getElementById('modalAthleteBio');
  const modalSocials = document.getElementById('modalAthleteSocials');

  // 1. Initialize Fan-Out Deck Interactions Immediately
  initFanDeckInteractions();

  // 2. Fetch Verified Athlete Data
  fetch('assets/roster_data.json')
    .then(res => res.json())
    .then(data => {
      athletes = data;
      renderGrid(athletes);
    })
    .catch(err => {
      console.error('Failed to load roster data:', err);
    });

  // Helper: check if athlete has positive tournament earnings
  function hasValidPurse(athlete) {
    if (!athlete || !athlete.earnings) return false;
    const num = parseInt(athlete.earnings.replace(/[^0-9]/g, ''), 10);
    return !isNaN(num) && num > 0;
  }

  // 2. Render Cards in Full Directory Grid
  function renderGrid(list) {
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color--grey-on-track); font-family: var(--font-mono);">
          NO ATHLETES FOUND MATCHING TRANSMISSION CRITERIA.
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(athlete => `
      <article class="athlete-card" data-slug="${athlete.slug}" data-division="${athlete.division}">
        <div class="athlete-card-media">
          <span class="badge-pill is-live" style="position: absolute; top: 1rem; left: 1rem; z-index: 2;">
            ${athlete.division}
          </span>
          <span style="position: absolute; top: 1rem; right: 1rem; z-index: 2; font-family: var(--font-mono); font-size: 0.7rem; padding: 0.2rem 0.6rem; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-pill); color: var(--color--white);">
            ${athlete.region}
          </span>
          <img src="${athlete.image}" alt="${athlete.name}" class="athlete-card-img" loading="lazy" decoding="async">
        </div>
        <div class="athlete-card-body">
          <div>
            <h3 class="athlete-card-title">${athlete.name}</h3>
            <div class="athlete-card-meta">${athlete.role}</div>
          </div>
          
          ${hasValidPurse(athlete) ? `
          <div class="athlete-card-earnings">
            <span style="color: var(--color--grey-on-track);">PURSE</span>
            <span class="athlete-card-earnings-val">${athlete.earnings}</span>
          </div>` : ''}

          <button class="btn-ln btn-ln-secondary" style="width: 100%; margin-top: auto; padding: 0.65rem 1rem; font-size: 0.78rem;" onclick="openAthleteModal('${athlete.slug}')">
            <span>DOSSIER & SOCIALS →</span>
          </button>
        </div>
      </article>
    `).join('');

    // Attach click events on cards
    grid.querySelectorAll('.athlete-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const slug = card.getAttribute('data-slug');
          openAthleteModal(slug);
        }
      });
    });
  }

  // 3. Search and Filtering Logic
  function filterAndSearch() {
    const activeBtn = document.querySelector('.roster-directory-section .roster-filter-btn.active');
    const divisionFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const filtered = athletes.filter(a => {
      const matchesDivision = (divisionFilter === 'all') || (a.division.toLowerCase().includes(divisionFilter.toLowerCase()));
      const matchesQuery = !query || 
        a.name.toLowerCase().includes(query) || 
        a.role.toLowerCase().includes(query) || 
        a.region.toLowerCase().includes(query) || 
        a.bio.toLowerCase().includes(query);
      return matchesDivision && matchesQuery;
    });

    renderGrid(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterAndSearch);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterAndSearch();
    });
  });

  // 4. Fan-Out Deck Interactions (Organic scale up + 10% lateral shift on neighbors)
  function getBaseConfigs() {
    const isMedium = window.innerWidth <= 900;
    if (isMedium) {
      return [
        { x: -240, y: 35, rot: -18, scale: 0.90, zIndex: 1, shift: 36 },
        { x: -160, y: 18, rot: -11, scale: 0.94, zIndex: 2, shift: 36 },
        { x: -80,  y: 5,  rot: -5,  scale: 0.98, zIndex: 3, shift: 36 },
        { x: 0,    y: 0,  rot: 0,   scale: 1.00, zIndex: 4, shift: 36 },
        { x: 80,   y: 5,  rot: 5,   scale: 0.98, zIndex: 3, shift: 36 },
        { x: 160,  y: 18, rot: 11,  scale: 0.94, zIndex: 2, shift: 36 },
        { x: 240,  y: 35, rot: 18,  scale: 0.90, zIndex: 1, shift: 36 }
      ];
    }
    return [
      { x: -340, y: 42, rot: -22, scale: 0.90, zIndex: 1, shift: 48 },
      { x: -230, y: 20, rot: -14, scale: 0.94, zIndex: 2, shift: 48 },
      { x: -115, y: 6,  rot: -7,  scale: 0.98, zIndex: 3, shift: 48 },
      { x: 0,    y: 0,  rot: 0,   scale: 1.00, zIndex: 4, shift: 48 },
      { x: 115,  y: 6,  rot: 7,   scale: 0.98, zIndex: 3, shift: 48 },
      { x: 230,  y: 20, rot: 14,  scale: 0.94, zIndex: 2, shift: 48 },
      { x: 340,  y: 42, rot: 22,  scale: 0.90, zIndex: 1, shift: 48 }
    ];
  }

  function initFanDeckInteractions() {
    const fanCards = Array.from(document.querySelectorAll('.fan-card'));
    const deckWrapper = document.getElementById('fanDeckWrapper');
    if (!fanCards.length) return;

    let currentHovered = -1;

    function applyHoverState(hoveredIdx) {
      if (window.innerWidth <= 860 || ('ontouchstart' in window)) return; // Mobile touch horizontal carousel
      const configs = getBaseConfigs();
      currentHovered = hoveredIdx;

      fanCards.forEach((card, idx) => {
        const base = configs[idx];
        if (!base) return;

        if (hoveredIdx === -1) {
          // Reset: natural arc positions from base CSS
          card.classList.remove('is-hovered');
          card.style.transform = '';
          card.style.zIndex = '';
        } else if (idx === hoveredIdx) {
          // Hovered card: scale up a little (1.08x), lift along arc, stay at its X position
          card.classList.add('is-hovered');
          const scaleUp = (base.scale * 1.08).toFixed(3);
          const liftY = base.y - 24;
          const softRot = (base.rot * 0.45).toFixed(1);
          card.style.transform = `translateX(${base.x}px) translateY(${liftY}px) rotate(${softRot}deg) scale(${scaleUp})`;
          card.style.zIndex = '30';
        } else if (idx < hoveredIdx) {
          // Cards to the LEFT shift further away to the left by ~10% (48px)
          card.classList.remove('is-hovered');
          const shiftX = base.x - base.shift;
          card.style.transform = `translateX(${shiftX}px) translateY(${base.y}px) rotate(${base.rot}deg) scale(${base.scale})`;
          card.style.zIndex = String(base.zIndex);
        } else {
          // Cards to the RIGHT shift further away to the right by ~10% (48px)
          card.classList.remove('is-hovered');
          const shiftX = base.x + base.shift;
          card.style.transform = `translateX(${shiftX}px) translateY(${base.y}px) rotate(${base.rot}deg) scale(${base.scale})`;
          card.style.zIndex = String(base.zIndex);
        }
      });
    }

    fanCards.forEach((card, idx) => {
      // Hover event
      card.addEventListener('mouseenter', () => {
        applyHoverState(idx);
      });

      card.addEventListener('mouseleave', (e) => {
        // If moving directly into another fan-card, let that card handle it
        if (e.relatedTarget && e.relatedTarget.closest('.fan-card')) {
          return;
        }
        // If leaving cards entirely
        if (!e.relatedTarget || !e.relatedTarget.closest('#fanDeckWrapper')) {
          applyHoverState(-1);
        }
      });

      // Click opens athlete modal
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-athlete-slug');
        if (slug) openAthleteModal(slug);
      });
    });

    if (deckWrapper) {
      deckWrapper.addEventListener('mouseleave', () => {
        applyHoverState(-1);
      });
    }

    window.addEventListener('resize', () => {
      if (currentHovered === -1) {
        applyHoverState(-1);
      } else {
        applyHoverState(currentHovered);
      }
    });
  }

  // 5. Athlete Profile Modal Popup
  window.openAthleteModal = function(slug) {
    const athlete = athletes.find(a => a.slug === slug);
    if (!athlete || !modal) return;

    modalImg.src = athlete.image;
    modalImg.alt = athlete.name;
    modalName.textContent = athlete.name;
    modalRole.textContent = `${athlete.region} // ${athlete.role.toUpperCase()}`;
    modalBadge.textContent = athlete.division.toUpperCase();

    const earningsBox = document.getElementById('modalEarningsBox');
    if (hasValidPurse(athlete)) {
      if (modalEarnings) modalEarnings.textContent = athlete.earnings;
      if (earningsBox) earningsBox.style.display = 'flex';
    } else {
      if (modalEarnings) modalEarnings.textContent = '';
      if (earningsBox) earningsBox.style.display = 'none';
    }

    modalBio.textContent = athlete.bio || 'Representing Club 7VEN on the global esports and entertainment stage.';

    // Social Links
    let socialsHtml = '';
    if (athlete.socials) {
      if (athlete.socials.twitch) {
        socialsHtml += `<a href="${athlete.socials.twitch}" target="_blank" rel="noopener" class="athlete-social-btn">📺 TWITCH</a>`;
      }
      if (athlete.socials.twitter) {
        socialsHtml += `<a href="${athlete.socials.twitter}" target="_blank" rel="noopener" class="athlete-social-btn">🐦 TWITTER / X</a>`;
      }
      if (athlete.socials.instagram) {
        socialsHtml += `<a href="${athlete.socials.instagram}" target="_blank" rel="noopener" class="athlete-social-btn">📸 INSTAGRAM</a>`;
      }
      if (athlete.socials.youtube) {
        socialsHtml += `<a href="${athlete.socials.youtube}" target="_blank" rel="noopener" class="athlete-social-btn">▶ YOUTUBE</a>`;
      }
      if (athlete.socials.tiktok) {
        socialsHtml += `<a href="${athlete.socials.tiktok}" target="_blank" rel="noopener" class="athlete-social-btn">🎵 TIKTOK</a>`;
      }
    }
    modalSocials.innerHTML = socialsHtml || `<span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color--grey-on-track);">OFFICIAL 7VEN CHANNELS: <a href="https://discord.gg/7ven" target="_blank" style="color: var(--color--lime);">DISCORD</a> • <a href="https://x.com/7venclub" target="_blank" style="color: var(--color--lime);">@7VENCLUB</a></span>`;

    modal.classList.add('open');
  };

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

});

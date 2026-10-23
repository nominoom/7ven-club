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

  // 1. Fetch Verified Athlete Data
  fetch('assets/roster_data.json')
    .then(res => res.json())
    .then(data => {
      athletes = data;
      renderGrid(athletes);
      initFanDeckClicks();
    })
    .catch(err => {
      console.error('Failed to load roster data:', err);
    });

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
          <img src="${athlete.image}" alt="${athlete.name}" class="athlete-card-img" loading="lazy">
        </div>
        <div class="athlete-card-body">
          <div>
            <h3 class="athlete-card-title">${athlete.name}</h3>
            <div class="athlete-card-meta">${athlete.role}</div>
          </div>
          
          <div class="athlete-card-earnings">
            <span style="color: var(--color--grey-on-track);">PURSE</span>
            <span class="athlete-card-earnings-val">${athlete.earnings}</span>
          </div>

          <button class="btn-ln btn-ln-secondary" style="width: 100%; padding: 0.65rem 1rem; font-size: 0.78rem;" onclick="openAthleteModal('${athlete.slug}')">
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

  // 4. Fan-Out Deck Clicks & Adjacent Spreading
  function initFanDeckClicks() {
    const fanCards = document.querySelectorAll('.fan-card');
    fanCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const slug = card.getAttribute('data-athlete-slug');
        openAthleteModal(slug);
      });

      // Mouseenter and mouseleave dynamic spreading
      card.addEventListener('mouseenter', () => {
        fanCards.forEach((other, otherIdx) => {
          if (otherIdx < index) {
            // Push left
            other.style.transform = getRestTransform(otherIdx, -35);
          } else if (otherIdx > index) {
            // Push right
            other.style.transform = getRestTransform(otherIdx, 35);
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        fanCards.forEach((other, otherIdx) => {
          other.style.transform = ''; // Reset to base CSS
        });
      });
    });
  }

  function getRestTransform(index, offsetPx) {
    const baseTransforms = [
      `translateX(${ -340 + offsetPx }px) translateY(42px) rotate(-22deg)`,
      `translateX(${ -230 + offsetPx }px) translateY(20px) rotate(-14deg)`,
      `translateX(${ -115 + offsetPx }px) translateY(6px) rotate(-7deg)`,
      `translateX(${ 0 + offsetPx }px) translateY(0px) rotate(0deg)`,
      `translateX(${ 115 + offsetPx }px) translateY(6px) rotate(7deg)`,
      `translateX(${ 230 + offsetPx }px) translateY(20px) rotate(14deg)`,
      `translateX(${ 340 + offsetPx }px) translateY(42px) rotate(22deg)`
    ];
    return baseTransforms[index] || '';
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
    modalEarnings.textContent = athlete.earnings;
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

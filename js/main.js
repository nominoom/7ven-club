/* ==========================================================================
   7VEN CLUB x LANDO NORRIS (LN4) INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER (HIGH-TECH TACTILE SOUND EFFECTS)
  // ------------------------------------------------------------------------
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('7ven_muted') === 'true';
      this.initButton();
    }

    initContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick(freq = 1200, duration = 0.04) {
      if (this.muted) return;
      try {
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio might be blocked before first user gesture
      }
    }

    playModeSwitch() {
      if (this.muted) return;
      try {
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    initButton() {
      const btn = document.getElementById('soundToggleBtn');
      if (!btn) return;

      if (this.muted) {
        btn.classList.add('muted');
        btn.querySelector('.sound-status-text').textContent = 'SFX: OFF';
      } else {
        btn.classList.remove('muted');
        btn.querySelector('.sound-status-text').textContent = 'SFX: ON';
      }

      btn.addEventListener('click', () => {
        this.muted = !this.muted;
        localStorage.setItem('7ven_muted', this.muted);
        if (this.muted) {
          btn.classList.add('muted');
          btn.querySelector('.sound-status-text').textContent = 'SFX: OFF';
        } else {
          btn.classList.remove('muted');
          btn.querySelector('.sound-status-text').textContent = 'SFX: ON';
          this.playClick(1400);
        }
      });
    }
  }

  const sfx = new SoundFX();

  // Attach hover and click sounds to all buttons & interactive elements
  document.querySelectorAll('button, .btn-ln, .cal-row, .vault-card, .player-card, .roster-filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => sfx.playClick(900, 0.02));
    el.addEventListener('click', () => sfx.playClick(1300, 0.05));
  });

  // ------------------------------------------------------------------------
  // 2. DUAL-STAGE MODE SWITCHER ("ON STAGE" vs "OFF STAGE")
  // ------------------------------------------------------------------------
  const switcher = document.getElementById('stageSwitcher');
  const pill = document.getElementById('switcherPill');
  const btnOn = document.getElementById('btnOnStage');
  const btnOff = document.getElementById('btnOffStage');

  function setStageMode(mode) {
    document.body.setAttribute('data-mode', mode);
    sfx.playModeSwitch();

    if (mode === 'on-stage') {
      btnOn.classList.add('active');
      btnOff.classList.remove('active');
      if (pill) {
        pill.style.left = `${btnOn.offsetLeft}px`;
        pill.style.width = `${btnOn.offsetWidth}px`;
      }
      showToast('MODE: ON STAGE (COMPETITIVE ESPORTS & TOURNAMENTS)');
    } else {
      btnOff.classList.add('active');
      btnOn.classList.remove('active');
      if (pill) {
        pill.style.left = `${btnOff.offsetLeft}px`;
        pill.style.width = `${btnOff.offsetWidth}px`;
      }
      showToast('MODE: OFF STAGE (STREETWEAR DROPS & CULTURE)');
    }
  }

  if (switcher && pill && btnOn && btnOff) {
    // Initial pill placement
    setTimeout(() => {
      pill.style.left = `${btnOn.offsetLeft}px`;
      pill.style.width = `${btnOn.offsetWidth}px`;
    }, 100);

    btnOn.addEventListener('click', () => setStageMode('on-stage'));
    btnOff.addEventListener('click', () => setStageMode('off-stage'));
  }

  // ------------------------------------------------------------------------
  // 3. NAVBAR SCROLL & ACTIVE SPY
  // ------------------------------------------------------------------------
  const nav = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.ln-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. LIVE TELEMETRY COUNTDOWN TIMER
  // ------------------------------------------------------------------------
  const countdownEl = document.getElementById('telemetryCountdown');
  if (countdownEl) {
    // Target 3 days, 14 hours from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(targetDate.getHours() + 14);

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        countdownEl.textContent = 'STAGE LIVE NOW';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownEl.textContent = `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ------------------------------------------------------------------------
  // 5. ROSTER DIVISION FILTERING
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.roster-filter-btn');
  const playerCards = document.querySelectorAll('.player-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      playerCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 6. 3D TILT EFFECT ON VAULT CARDS
  // ------------------------------------------------------------------------
  document.querySelectorAll('.vault-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ------------------------------------------------------------------------
  // 7. VAULT INSPECTION MODAL
  // ------------------------------------------------------------------------
  const vaultModal = document.getElementById('vaultModal');
  const vaultModalClose = document.getElementById('vaultModalClose');
  const modalImg = document.getElementById('modalVaultImg');
  const modalTitle = document.getElementById('modalVaultTitle');
  const modalSpec = document.getElementById('modalVaultSpec');
  const modalDesc = document.getElementById('modalVaultDesc');
  const modalSerial = document.getElementById('modalVaultSerial');

  const vaultData = {
    'helmet': {
      title: '7VEN CYBER STRIKE HELMET // LN4 EDITION',
      spec: 'WEIGHT: 1,240G | SHELL: MULTI-AXIAL CARBON | AERO VISOR: LIME IRIDIUM',
      serial: 'SPEC-7V-HELM-04',
      desc: 'Forged for high-velocity focus under intense championship pressure. Features acoustic noise isolation for LAN arenas, integrated biometric sensors, and custom 7VEN livery decals with reflective lime trim.',
      img: 'assets/images/vault-helmet.jpg'
    },
    'controller': {
      title: '7VEN CARBON ZERO PRO CONTROLLER',
      spec: 'SWITCHES: OPTICAL HALL-EFFECT | WEIGHT: 215G | POLLING RATE: 1000HZ',
      serial: 'SPEC-7V-CTRL-01',
      desc: 'Engineered for millisecond execution. Custom ergonomic grip with forged carbon composite faceplate, hair-trigger stops, tactile paddle assignments, and neon lime illuminated bumpers.',
      img: 'assets/images/vault-controller.jpg'
    },
    'hoodie': {
      title: '7VEN RACING DIVISION HOODIE',
      spec: 'FABRIC: 480GSM HEAVYWEIGHT COTTON | FIT: OVERSIZED BOXY | COLOR: OBSIDIAN / LIME',
      serial: 'SPEC-7V-APP-07',
      desc: 'Direct crossover between high-end motorsport streetwear and elite esports culture. Ultra-heavy organic brushed loopback fleece with screenprinted 7VEN speed division graphics.',
      img: 'assets/images/merch-hoodie.jpg'
    },
    'cap': {
      title: '7VEN SPEED DIVISION CAP 07',
      spec: 'MATERIAL: WATER-REPELLENT RIPSTOP | CLOSURE: MAGNETIC BUCKLE | CROWN: STRUCTURED',
      serial: 'SPEC-7V-CAP-02',
      desc: 'Worn on the podium and in the pit lane. High-density lime 3D embroidery, racing technical badge patch, breathable laser-cut eyelets, and moisture-wicking sweatband.',
      img: 'assets/images/merch-cap.jpg'
    }
  };

  document.querySelectorAll('.vault-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-vault-id');
      const item = vaultData[id];
      if (item && vaultModal) {
        modalTitle.textContent = item.title;
        modalSpec.textContent = item.spec;
        modalSerial.textContent = item.serial;
        modalDesc.textContent = item.desc;
        modalImg.src = item.img;
        vaultModal.classList.add('open');
      }
    });
  });

  if (vaultModalClose && vaultModal) {
    vaultModalClose.addEventListener('click', () => {
      vaultModal.classList.remove('open');
    });

    vaultModal.addEventListener('click', (e) => {
      if (e.target === vaultModal) {
        vaultModal.classList.remove('open');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. MERCHANDISE SHOPPING & CART DRAWER
  // ------------------------------------------------------------------------
  let cart = [];
  const cartTrigger = document.getElementById('cartTrigger');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartBadge');
  const cartTotalDisplay = document.getElementById('cartTotalDisplay');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Size buttons selector
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = btn.closest('.size-selector');
      parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const title = card.querySelector('.product-title').textContent;
      const priceStr = card.querySelector('.product-price').textContent;
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      const img = card.querySelector('.product-img').src;
      const sizeBtn = card.querySelector('.size-btn.selected');
      const size = sizeBtn ? sizeBtn.textContent : 'STD';

      const existing = cart.find(item => item.title === title && item.size === size);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ title, price, img, size, qty: 1 });
      }

      updateCartUI();
      openCart();
      showToast(`ADDED "${title} (${size})" TO VAULT CART`);
    });
  });

  function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (cartTotalDisplay) {
      cartTotalDisplay.textContent = `$${totalPrice.toFixed(2)}`;
    }

    if (cartItemsList) {
      if (cart.length === 0) {
        cartItemsList.innerHTML = `
          <div style="text-align: center; padding: 3rem 1rem; color: var(--color--grey-on-track); font-family: var(--font-mono); font-size: 0.85rem;">
            YOUR VAULT CART IS CURRENTLY EMPTY.
          </div>
        `;
      } else {
        cartItemsList.innerHTML = cart.map((item, index) => `
          <div class="cart-item">
            <img src="${item.img}" class="cart-item-thumb" alt="${item.title}">
            <div class="cart-item-details">
              <div>
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-meta">SIZE: ${item.size} | QTY: ${item.qty}</div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                <button class="remove-cart-item-btn" data-index="${index}" style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color--grey-on-track); cursor: pointer;">[REMOVE]</button>
              </div>
            </div>
          </div>
        `).join('');

        // Attach remove buttons
        document.querySelectorAll('.remove-cart-item-btn').forEach(b => {
          b.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            cart.splice(idx, 1);
            updateCartUI();
          });
        });
      }
    }
  }

  function openCart() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add('open');
  }

  function closeCart() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('open');
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('CART IS EMPTY. ADD MERCHANDISE FIRST.');
        return;
      }
      showToast('ORDER TRANSMITTED. PROCEEDING TO 7VEN SECURE CHECKOUT...');
      setTimeout(() => {
        cart = [];
        updateCartUI();
        closeCart();
        showToast('THANK YOU! ORDER #7V-8849 CONFIRMED.');
      }, 1500);
    });
  }

  // ------------------------------------------------------------------------
  // 9. CONTACT / JOIN CLUB APPLICATION FORM
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('joinForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const division = document.getElementById('formDivision').value;

      showToast(`APPLICATION RECEIVED FOR ${name.toUpperCase()} [${division}].`);
      contactForm.reset();
    });
  }

  // ------------------------------------------------------------------------
  // 10. HUD TOAST NOTIFICATION
  // ------------------------------------------------------------------------
  const toast = document.getElementById('hudToast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // ------------------------------------------------------------------------
  // 11. SMOOTH SCROLL FOR BUTTONS
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});

/* ==========================================================================
   7VEN CLUB — ADAPTIVE DEVICE & RAM OPTIMIZATION ENGINE
   Dynamically tailors graphics, memory pipelines, and DOM interactions
   based on real-time client hardware & network telemetry
   ========================================================================== */

(function() {
  'use strict';

  // 1. Hardware & Memory Capability Diagnostics
  const nav = navigator || {};
  const deviceMemory = nav.deviceMemory || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4 ? 2 : 4);
  const cpuCores = nav.hardwareConcurrency || 4;
  const isTouch = ('ontouchstart' in window) || (nav.maxTouchPoints > 0) || (nav.msMaxTouchPoints > 0);
  const isMobileViewport = window.innerWidth <= 860;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const isDataSaver = connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Determine Adaptive Performance Tier
  // Low tier: mobile device, deviceMemory <= 4GB, <= 4 CPU cores, or data saver
  const isLowRAM = (deviceMemory <= 4) || (cpuCores <= 4) || isMobileViewport || isDataSaver;
  const deviceTier = isLowRAM ? 'low' : 'high';

  // Set DOM Architecture Flags
  document.documentElement.setAttribute('data-device-tier', deviceTier);
  document.documentElement.setAttribute('data-device-mobile', isMobileViewport ? 'true' : 'false');
  document.documentElement.setAttribute('data-touch-device', isTouch ? 'true' : 'false');

  if (document.body) {
    document.body.setAttribute('data-device-tier', deviceTier);
    document.body.setAttribute('data-device-mobile', isMobileViewport ? 'true' : 'false');
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.setAttribute('data-device-tier', deviceTier);
      document.body.setAttribute('data-device-mobile', isMobileViewport ? 'true' : 'false');
    });
  }

  console.info(`[7VEN TELEMETRY] Adaptive Engine Active: Tier [${deviceTier.toUpperCase()}], RAM [~${deviceMemory}GB], Cores [${cpuCores}], Mobile [${isMobileViewport}], Touch [${isTouch}]`);

  document.addEventListener('DOMContentLoaded', () => {

    // Update telemetry badge in mobile drawer if present
    const tierDisplay = document.getElementById('mobileDeviceTier');
    if (tierDisplay) {
      tierDisplay.textContent = isLowRAM ? 'OPTIMIZED LOW-RAM' : 'HIGH-PERFORMANCE';
    }

    // 2. Hero Background Video / Memory Management
    const heroVideo = document.getElementById('heroStageVideo');
    if (heroVideo) {
      if (isLowRAM || isDataSaver) {
        // In memory-constrained mobile environments, avoid keeping decoded video frames in RAM
        heroVideo.pause();
        heroVideo.removeAttribute('autoplay');
        heroVideo.style.display = 'none';
        const posterImg = document.getElementById('heroStagePoster');
        if (posterImg) {
          posterImg.style.display = 'block';
        }
      } else {
        // High-spec desktop: start hardware-accelerated playback
        heroVideo.play().catch(() => {
          // Fallback if autoplay was blocked
        });
      }
    }

    // 3. Mobile Navigation Drawer Controller
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
    const mobileDrawerClose = document.getElementById('mobileDrawerClose');

    function openMobileDrawer() {
      if (mobileDrawerOverlay) {
        mobileDrawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeMobileDrawer() {
      if (mobileDrawerOverlay) {
        mobileDrawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openMobileDrawer();
      });
    }

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileDrawer();
      });
    }

    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.addEventListener('click', (e) => {
        if (e.target === mobileDrawerOverlay) {
          closeMobileDrawer();
        }
      });
    }

    // Close drawer when any mobile nav link is tapped
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileDrawer();
      }
    });

    // 4. Update Header Subtitle on Touch Devices
    if (isTouch || isMobileViewport) {
      document.querySelectorAll('.fan-deck-header .text-lead').forEach(p => {
        p.textContent = 'Swipe horizontally through the deck. Tap any athlete card to open their complete operational dossier, tournament earnings, and verified social channels.';
      });
    }

    // 5. Dynamic Viewport Resize Handler (Throttled via requestAnimationFrame)
    let resizeScheduled = false;
    window.addEventListener('resize', () => {
      if (!resizeScheduled) {
        resizeScheduled = true;
        requestAnimationFrame(() => {
          const currentMobile = window.innerWidth <= 860;
          document.documentElement.setAttribute('data-device-mobile', currentMobile ? 'true' : 'false');
          if (document.body) {
            document.body.setAttribute('data-device-mobile', currentMobile ? 'true' : 'false');
          }
          resizeScheduled = false;
        });
      }
    }, { passive: true });

  });

})();

(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const storageGet = key => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
  const storageSet = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };
  const storageRemove = key => { try { sessionStorage.removeItem(key); } catch (_) {} };
  root.classList.add('js');

  // Universal Lastoria preloader + reel transition system.
  // Every page transition uses the same connected 1.2-second pen-mask timeline.
  const preloader = document.querySelector('.page-wipe');
  const loaderArtwork = preloader?.querySelector('.page-wipe__signature--wave') || null;
  const loaderParts = preloader ? [
    preloader.querySelector('.page-wipe__wave--lead'),
    preloader.querySelector('.page-wipe__signature-line-v28'),
    preloader.querySelector('.page-wipe__wave--tail'),
  ].filter(Boolean) : [];
  const incomingReel = storageGet('shiva-reel-incoming') === '1';
  if (incomingReel) storageRemove('shiva-reel-incoming');
  const firstVisit = storageGet('shiva-visited') !== '1';
  storageSet('shiva-visited', '1');
  let preloaderFinished = false;
  let loaderRevealAnimation = null;
  let loaderDrawGeneration = 0;

  const setLoaderArtworkVisible = (visible) => {
    if (!loaderArtwork) return;
    if (visible && preloader?.classList.contains('is-lastoria')) {
      window.completePortfolioReportPreloader?.(loaderArtwork);
    }
    loaderArtwork.style.clipPath = visible ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)';
    loaderArtwork.style.webkitClipPath = visible ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)';
  };

  const finishPreloader = () => {
    if (preloaderFinished) return;
    preloaderFinished = true;
    loaderDrawGeneration += 1;
    loaderRevealAnimation?.cancel();
    loaderRevealAnimation = null;
    setLoaderArtworkVisible(true);
    loaderParts.forEach(path => {
      path.removeAttribute('pathLength');
      path.removeAttribute('pathlength');
      path.style.animation = 'none';
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      path.style.visibility = 'visible';
    });
    preloader?.classList.add('is-written');
    root.classList.add('is-ready');
    window.setTimeout(() => document.dispatchEvent(new Event('portfolio:ready')), 0);
    window.setTimeout(() => body.classList.add('hero-loaded'), reduceMotion ? 0 : 80);
    window.setTimeout(() => { if (!root.classList.contains('is-leaving')) preloader?.classList.add('is-parked-bottom'); }, reduceMotion ? 0 : 900);
  };

  const resetLoaderDrawing = () => {
    if (!preloader) return;
    loaderDrawGeneration += 1;
    loaderRevealAnimation?.cancel();
    loaderRevealAnimation = null;
    preloader.classList.remove('is-writing', 'is-written');
    preloader.classList.add('is-js-drawing');
    loaderParts.forEach(path => {
      path.removeAttribute('pathLength');
      path.removeAttribute('pathlength');
      path.style.animation = 'none';
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      path.style.visibility = 'visible';
    });
    setLoaderArtworkVisible(false);
  };

  const drawLoader = (onDone) => {
    if (!preloader || !loaderArtwork || reduceMotion) {
      setLoaderArtworkVisible(true);
      preloader?.classList.add('is-written');
      onDone?.();
      return;
    }

    resetLoaderDrawing();
    preloader.classList.add('is-writing');

    const generation = loaderDrawGeneration;
    // Commit hidden ink before exposing the first pen mark. Each report phase
    // is driven by one clock; there is no idle frame between the two joins.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (generation !== loaderDrawGeneration) return;
      const reportsLoader = preloader.classList.contains('is-lastoria');
      if (reportsLoader && window.playPortfolioReportPreloader) {
        loaderRevealAnimation = window.playPortfolioReportPreloader(loaderArtwork);
      } else {
        // Unchanged home sequence; a clipping fallback remains available if
        // the optional report-art module fails to load.
        const frames = reportsLoader ? [
          { clipPath: 'inset(0 100% 0 0)', offset: 0 },
          { clipPath: 'inset(0 56.2% 0 0)', offset: .25 },
          { clipPath: 'inset(0 44% 0 0)', offset: 880 / 1200 },
          { clipPath: 'inset(0 0% 0 0)', offset: 1 }
        ] : [
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)' }
        ];
        loaderRevealAnimation = loaderArtwork.animate(frames, {
          duration: reportsLoader ? 1200 : 1780,
          easing: reportsLoader ? 'linear' : 'cubic-bezier(.42,0,.18,1)',
          fill: 'forwards'
        });
      }

      let completed = false;
      const complete = () => {
        if (completed || generation !== loaderDrawGeneration) return;
        completed = true;
        setLoaderArtworkVisible(true);
        preloader.classList.add('is-written');
        onDone?.();
      };
      loaderRevealAnimation.finished.then(complete).catch(() => {});
      // Preserve the escape hatch without allowing an old drawing's timeout
      // to prematurely complete a later click or back/forward navigation.
      window.setTimeout(complete, reportsLoader ? 1500 : 2150);
    }));
  };

  const runPreloader = () => {
    if (!preloader) { finishPreloader(); return; }

    // During an internal reel navigation the previous document has already
    // drawn the loader. The incoming document starts with the loader complete
    // and lets the panel + page continue travelling upward as one reel stack.
    if (incomingReel || !firstVisit) {
      root.classList.add('is-fast-navigation');
      setLoaderArtworkVisible(true);
      preloader.classList.add('is-written', 'is-centered');
      root.classList.add('reel-incoming');
      requestAnimationFrame(() => requestAnimationFrame(() => finishPreloader()));
      return;
    }

    resetLoaderDrawing();
    root.classList.add('preloader-entering');

    // Let the orange panel finish entering before the pen begins drawing.
    // This prevents the line from appearing as clipped fragments while the
    // panel itself is still moving through the viewport.
    window.setTimeout(() => {
      preloader.classList.add('is-centered');
      drawLoader(() => window.setTimeout(finishPreloader, reduceMotion ? 0 : 140));
    }, reduceMotion ? 0 : 760);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runPreloader, { once: true });
  else runPreloader();

  // Last-resort escape hatch: no later JS error can trap the site behind the loader.
  window.setTimeout(finishPreloader, 3600);

  // Segmented page progress rail. It behaves like a chaptered YouTube
  // progress bar: completed chapters fill, the current chapter scrubs, and
  // every segment is a direct anchor for fast movement through the page.
  const progressConfigs = body.classList.contains('page-home')
    ? [
        ['top', 'Top'],
        ['intro', 'Approach'],
        ['work', 'Work'],
        ['writing', 'Writing'],
        ['vibes', 'Vibe apps'],
        ['manifesto', 'Principle']
      ]
    : body.classList.contains('page-case-agent')
      ? [
          ['top', 'Agent Management'], ['pitch', 'At a glance'], ['overview', 'From ambiguity to an operable system'], ['background', 'Understand agents through a city'],
          ['problem', 'It takes weeks'], ['user', 'Admin Adnan'], ['discovery', 'Discovery research'], ['cognitive-load', 'Measuring cognitive load'],
          ['direction', 'ZFI simplified one install'], ['agent-lifecycle', 'Focus on the lifecycle moments with the most leverage'], ['technical-landscape', 'From many installs to one orchestrator'],
          ['design', 'Brainstorming'], ['layout', 'Layout design'], ['validation', 'Low-fidelity validation'], ['solution', 'The final experience'],
          ['impact', 'Impact'], ['roadmap', 'UX defined the roadmap'], ['architecture-shift', 'A parallel platform experience'], ['learning', 'Four lessons that stayed with me']
        ]
      : body.classList.contains('page-case-domain')
        ? [
            ['top', 'Top'], ['overview', 'Overview'], ['alert', 'Alert'],
            ['current', 'Current UX'], ['discovery', 'Discovery'], ['insight', 'Insight'],
            ['stories', 'Stories'], ['proposal', 'Proposal'], ['design', 'Design'],
            ['feedback', 'Feedback'], ['ongoing', 'Ongoing']
          ]
        : body.classList.contains('page-case-reports')
          ? [['top','Top'],['problem','Legacy'],['needs','Needs'],['lifecycle','North star'],
             ['design','Design'],['experience','Experience'],['release','Release'],['impact','Usage']]
          : [];

  let sectionProgress = null;
  let dismissSectionProgress = () => {};
  let sectionProgressItems = [];
  if (header && progressConfigs.length) {
    sectionProgress = document.createElement('nav');
    sectionProgress.className = 'section-progress';
    sectionProgress.setAttribute('aria-label', 'Page progress and section navigation');
    const fragment = document.createDocumentFragment();
    progressConfigs.forEach(([id, label]) => {
      const target = document.getElementById(id);
      if (!target) return;
      const link = document.createElement('a');
      link.className = 'section-progress__segment';
      link.href = `#${id}`;
      link.dataset.label = label;
      link.setAttribute('aria-label', `Go to ${label}`);
      const fill = document.createElement('span');
      fill.className = 'section-progress__fill';
      link.appendChild(fill);
      fragment.appendChild(link);
      sectionProgressItems.push({ id, label, target, link, fill });
    });
    sectionProgress.appendChild(fragment);

    const progressPreviewMaps = body.classList.contains('page-case-agent') ? {
      top: { title: 'Agent Management', subtitle: 'Case' },
      pitch: { title: 'At a glance', subtitle: 'Overview' },
      overview: { title: 'From ambiguity to an operable system', subtitle: 'Role' },
      background: { title: 'Understand agent management through a city', subtitle: 'Analogy' },
      problem: { title: '“It takes weeks.”', subtitle: 'Scale' },
      user: { title: 'Admin Adnan', subtitle: 'User persona' },
      discovery: { title: 'Discovery research', subtitle: 'Research' },
      'cognitive-load': { title: 'Measuring cognitive load', subtitle: 'Synthesis' },
      direction: { title: 'ZFI simplified one install', subtitle: 'Precedent' },
      'agent-lifecycle': { title: 'Focus on the lifecycle moments with the most leverage', subtitle: 'Priorities' },
      'technical-landscape': { title: 'From many installs to one orchestrator', subtitle: 'Architecture' },
      design: { title: 'Brainstorming', subtitle: 'Ideation' },
      layout: { title: 'Layout design', subtitle: 'Structure' },
      validation: { title: 'Low-fidelity validation', subtitle: 'Testing' },
      solution: { title: 'The final experience', subtitle: 'Workflow' },
      impact: { title: 'Impact', subtitle: 'Outcomes' },
      roadmap: { title: 'UX defined the roadmap', subtitle: 'Strategy' },
      'architecture-shift': { title: 'A parallel platform experience', subtitle: 'Platform' },
      learning: { title: 'Four lessons that stayed with me', subtitle: 'Learnings' }
    } : body.classList.contains('page-home') ? {
      top: ['Home', 'assets/character-hero-q95/center-v4.webp'], intro: ['Approach', 'assets/process-board.webp'], work: ['Selected work', 'assets/agent-hero.webp'],
      writing: ['Writing', 'assets/feedback-card.webp'], vibes: ['Vibe apps', 'assets/project-placeholder-01.svg'], manifesto: ['Principle', 'assets/shiva-sketch-work.webp']
    } : body.classList.contains('page-case-domain') ? {
      top:['Case study','assets/domain-hero.webp'], overview:['Overview','assets/application-map.webp'], alert:['Alert','assets/alert-storm.webp'],
      current:['Current UX','assets/current-observe.webp'], discovery:['Research','assets/research-donut.webp'], insight:['Insight','assets/feedback-heatmap.webp'],
      stories:['Stories','assets/kalpana.webp'], proposal:['Proposal','assets/app-hierarchy.webp'], design:['Design','assets/prototype-01.webp'], feedback:['Feedback','assets/feedback-card.webp'], ongoing:['Ongoing','assets/domain-hero.webp']
    } : body.classList.contains('page-case-reports') ? {
      top:['Management Reports','assets/management-reports-thumbnail.png'],
      problem:['The legacy reporting cycle','assets/management-reports-thumbnail.png'],
      needs:['Three customer needs','assets/management-reports-thumbnail.png'],
      lifecycle:['North Star and scope','assets/reports/build-exploration.png'],
      design:['Simplifying the authoring model','assets/reports/style-exploration.png'],
      experience:['The report editor','assets/management-reports-thumbnail.png'],
      release:['Release alongside legacy','assets/management-reports-thumbnail.png'],
      impact:['Usage and next questions','assets/management-reports-thumbnail.png']
    } : {};

    const drawer = document.createElement('div');
    drawer.className = 'section-progress__drawer';
    drawer.id = 'section-progress-drawer';
    drawer.inert = true;
    drawer.setAttribute('aria-hidden', 'true');
    sectionProgressItems.forEach(item => {
      const preview = progressPreviewMaps[item.id] || {};
      const isArrayPreview = Array.isArray(preview);
      const title = isArrayPreview ? (preview[0] || item.label) : (preview.title || item.label);
      const subtitle = isArrayPreview ? item.label : (preview.subtitle || item.label);
      const thumb = isArrayPreview ? (preview[1] || '') : (preview.thumb || '');
      const drawerLink = document.createElement('a');
      drawerLink.className = 'section-progress__drawer-item';
      drawerLink.href = `#${item.id}`;
      const showThumb = body.classList.contains('page-home');
      drawerLink.innerHTML = `${showThumb && thumb ? `<img src="${thumb}" alt="">` : ''}<span><b>${title}</b><small>${subtitle}</small></span>`;
      drawer.appendChild(drawerLink);
      item.drawerLink = drawerLink;
    });
    sectionProgress.appendChild(drawer);

    header.insertAdjacentElement('afterend', sectionProgress);

    // A single state controls the drawer. The CSS bridge keeps pointer travel
    // continuous, while a short close delay tolerates diagonal/uneven movement.
    let closeTimer = 0;
    let dismissed = false;
    let expandOnTouchClick = false;
    let lastTrigger = sectionProgressItems[0]?.link;
    const cancelClose = () => { window.clearTimeout(closeTimer); closeTimer = 0; };
    const measureDrawer = () => {
      sectionProgress.style.setProperty('--progress-drawer-height', `${Math.ceil(drawer.getBoundingClientRect().height)}px`);
    };
    const setExpanded = expanded => {
      cancelClose();
      sectionProgress.classList.toggle('is-expanded', expanded);
      drawer.inert = !expanded;
      drawer.setAttribute('aria-hidden', String(!expanded));
      sectionProgressItems.forEach(item => item.link.setAttribute('aria-expanded', String(expanded)));
      if (expanded) measureDrawer();
    };
    const openDrawer = () => { if (!dismissed) setExpanded(true); };
    const scheduleClose = () => {
      cancelClose();
      closeTimer = window.setTimeout(() => {
        if (!sectionProgress.matches(':hover') && !sectionProgress.contains(document.activeElement)) setExpanded(false);
      }, 240);
    };
    sectionProgressItems.forEach(item => {
      item.link.setAttribute('aria-controls', drawer.id);
      item.link.setAttribute('aria-expanded', 'false');
    });
    if ('ResizeObserver' in window) new ResizeObserver(measureDrawer).observe(drawer);
    window.addEventListener('resize', measureDrawer, { passive: true });
    measureDrawer();

    sectionProgress.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      dismissed = false;
      openDrawer();
    });
    sectionProgress.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      dismissed = false;
      scheduleClose();
    });
    sectionProgress.addEventListener('focusin', event => {
      const item = sectionProgressItems.find(item => item.link === event.target);
      if (item) lastTrigger = item.link;
      openDrawer();
    });
    sectionProgress.addEventListener('focusout', scheduleClose);
    dismissSectionProgress = () => {
      dismissed = true;
      setExpanded(false);
    };
    sectionProgress.addEventListener('keydown', event => {
      if (event.key === 'Tab') { dismissed = false; return; }
      if (event.key !== 'Escape') return;
      event.preventDefault();
      dismissed = true;
      if (drawer.contains(document.activeElement)) {
        const item = sectionProgressItems.find(item => item.drawerLink === document.activeElement);
        (item?.link || lastTrigger)?.focus({ preventScroll: true });
      }
      setExpanded(false);
    });

    // Remember the state before touch-induced focus can open the drawer.
    sectionProgress.addEventListener('pointerdown', event => {
      expandOnTouchClick = event.pointerType === 'touch'
        && Boolean(event.target.closest('.section-progress__segment'))
        && !sectionProgress.classList.contains('is-expanded');
    }, true);

    // Capture the first touch before the anchor's own smooth-scroll handler.
    // This is only relevant to large touch screens; phone layouts hide the rail.
    sectionProgress.addEventListener('click', event => {
      const segment = event.target.closest('.section-progress__segment');
      const hasHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
      const shouldExpand = expandOnTouchClick || !sectionProgress.classList.contains('is-expanded');
      expandOnTouchClick = false;
      if (segment && !hasHover && shouldExpand) {
        event.preventDefault();
        event.stopPropagation();
        dismissed = false;
        setExpanded(true);
      }
    }, true);
    sectionProgress.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(link.getAttribute('href').slice(1));
      // Move keyboard focus to the destination before making the drawer inert.
      if (target) {
        const hadTabindex = target.hasAttribute('tabindex');
        if (!hadTabindex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (!hadTabindex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      dismissSectionProgress();
    });
    document.addEventListener('pointerdown', event => {
      if (sectionProgress.contains(event.target)) return;
      if (sectionProgress.contains(document.activeElement)) document.activeElement.blur();
      dismissed = false;
      setExpanded(false);
    }, { passive: true });
  }

  const homeChromeTrigger = body.classList.contains('page-home') ? document.getElementById('intro') : null;
  const updateHomeChrome = () => {
    if (!body.classList.contains('page-home')) return;
    if (!homeChromeTrigger) {
      body.classList.add('home-chrome-visible');
      return;
    }
    const triggerLine = Math.min(window.innerHeight * .16, 126);
    body.classList.toggle('home-chrome-visible', homeChromeTrigger.getBoundingClientRect().top <= triggerLine);
  };

  const updateSectionProgress = () => {
    if (!sectionProgress || !sectionProgressItems.length) return;
    const probe = window.scrollY + (parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 78) + 12;
    const docEnd = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    let activeIndex = 0;
    sectionProgressItems.forEach((item, index) => {
      const start = item.target.getBoundingClientRect().top + window.scrollY;
      const nextTarget = sectionProgressItems[index + 1]?.target;
      const next = nextTarget ? nextTarget.getBoundingClientRect().top + window.scrollY : docEnd;
      const span = Math.max(1, next - start);
      const progress = clamp((probe - start) / span);
      item.fill.style.transform = `scaleY(${progress})`;
      if (probe >= start) activeIndex = index;
    });
    sectionProgressItems.forEach((item, index) => {
      const active = index === activeIndex;
      [item.link, item.drawerLink].filter(Boolean).forEach(link => {
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  };

  // Hide the section rail only when the final reveal space is reached. The footer is
  // fixed behind the document, so IntersectionObserver would report it as visible all the time.
  const updateFooterChrome = () => {
    if (!sectionProgress) return;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const revealWindow = Math.min(window.innerHeight * .72, 720);
    body.classList.toggle('footer-in-view', window.scrollY >= Math.max(0, maxScroll - revealWindow));
  };
  window.addEventListener('scroll', updateFooterChrome, { passive: true });
  window.addEventListener('resize', updateFooterChrome);
  updateFooterChrome();

  // Shared menu and navigation. The overlay is outside the transformed page,
  // below the custom cursor, with one contained scroll region at every width.
  const menuButton = document.querySelector('.site-menu-trigger');
  const menu = document.getElementById('site-menu');
  const menuCloseButton = menu?.querySelector('.site-menu__close');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let menuIsOpen = false;
  let menuCloseTimer = 0;
  let menuOpener = null;
  let menuScrollY = 0;
  let lockedElements = [];
  let navigating = false;
  const focusableSelector = 'a[href], button:not(:disabled), summary, input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

  const pageName = pathname => {
    const name = pathname.split('/').filter(Boolean).pop() || 'index.html';
    return name.includes('.') ? name : 'index.html';
  };
  const currentPage = () => pageName(new URL(document.baseURI).pathname);
  const sameDocument = url => url.origin === new URL(document.baseURI).origin && pageName(url.pathname) === currentPage();
  const ordinaryClick = (event, link) => !event.defaultPrevented
    && (event.button === undefined || event.button === 0)
    && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
    && !link.hasAttribute('download') && (!link.target || link.target === '_self');
  const hashTarget = hash => {
    try { return document.getElementById(decodeURIComponent(hash.replace(/^#/, ''))); }
    catch (_) { return null; }
  };
  const focusDestination = element => {
    if (!element) return;
    const added = !element.hasAttribute('tabindex');
    if (added) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
    if (added) element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true });
  };
  const menuFocusables = () => menu ? [...menu.querySelectorAll(focusableSelector)]
    .filter(el => !el.closest('[inert], [hidden]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden') : [];

  const updateMenuCurrent = () => {
    if (!menu) return;
    const name = currentPage() === 'agent-preview.html' ? 'agent-management.html' : currentPage();
    menu.querySelectorAll('[data-menu-page]').forEach(link => {
      if (link.dataset.menuPage === name) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    let active = null;
    if (body.classList.contains('page-home')) {
      const probe = window.scrollY + Math.min(180, window.innerHeight * .25);
      active = 'top';
      for (const id of ['top', 'intro', 'work', 'writing', 'vibes', 'manifesto']) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= probe) active = id;
      }
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      if (maxScroll > 0 && window.scrollY >= maxScroll - 90) active = 'contact';
    }
    menu.querySelectorAll('[data-menu-section]').forEach(link => {
      if (link.dataset.menuSection === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  // Optional real Lottie asset: only load when configured and the menu is open.
  // The recording is not an animation asset. Until one is supplied, keep the
  // existing decorative image; no tooltip, fake animation or missing requests.
  const art = menu?.querySelector('.site-menu__art');
  const poster = art?.querySelector('.site-menu__poster');
  const animationConfig = window.PORTFOLIO_CONFIG?.menuAnimation || {};
  let menuAnimation = null;
  let animationLoading = false;
  let animationReady = false;
  if (poster && animationConfig.posterPath) poster.src = animationConfig.posterPath;
  const syncMenuAnimation = () => {
    const visible = menuIsOpen && !document.hidden && !motionPreference.matches
      && art && getComputedStyle(art).display !== 'none';
    if (menuAnimation) {
      art.classList.toggle('is-playing', Boolean(visible && animationReady));
      if (visible && animationReady) menuAnimation.play();
      else menuAnimation.pause();
      return;
    }
    if (!visible || animationLoading || !animationConfig.dataPath || !animationConfig.playerPath) return;
    animationLoading = true;
    const start = () => {
      if (!window.lottie?.loadAnimation) return;
      try {
        menuAnimation = window.lottie.loadAnimation({
          container: art.querySelector('[data-menu-animation]'),
          renderer: 'svg', loop: true, autoplay: false, path: animationConfig.dataPath,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
        });
        menuAnimation.addEventListener('DOMLoaded', () => { animationReady = true; syncMenuAnimation(); });
        menuAnimation.addEventListener('data_failed', () => art.classList.remove('is-playing'));
      } catch (_) { art.classList.remove('is-playing'); }
    };
    if (window.lottie) { start(); return; }
    const script = document.createElement('script');
    script.src = animationConfig.playerPath;
    script.onload = start;
    script.onerror = () => art.classList.remove('is-playing');
    document.head.appendChild(script);
  };
  document.addEventListener('visibilitychange', syncMenuAnimation);
  motionPreference.addEventListener('change', syncMenuAnimation);
  window.addEventListener('resize', syncMenuAnimation, { passive: true });

  const closeMenu = ({ restoreFocus = true, instant = false } = {}) => {
    if (!menuIsOpen || !menu) return;
    menuIsOpen = false;
    window.clearTimeout(menuCloseTimer);
    menu.classList.remove('is-open');
    root.classList.remove('menu-locked');
    body.classList.remove('menu-open');
    lockedElements.forEach(([el, wasInert]) => { el.inert = wasInert; });
    lockedElements = [];
    menuButton?.setAttribute('aria-expanded', 'false');
    if (Math.abs(window.scrollY - menuScrollY) > 1) window.scrollTo({ top: menuScrollY, behavior: 'instant' });
    // Move focus out before hiding the modal from assistive technology.
    if (menu.contains(document.activeElement)) document.activeElement.blur();
    if (restoreFocus && (menuOpener || menuButton)?.isConnected) {
      const returnTarget = menuOpener || menuButton;
      // The opener's header was both inert and visually hidden. Wait one frame
      // for those states to clear before restoring keyboard focus.
      requestAnimationFrame(() => {
        if (!menuIsOpen && returnTarget.isConnected) returnTarget.focus({ preventScroll: true });
      });
    }
    menu.inert = true;
    menu.setAttribute('aria-hidden', 'true');
    syncMenuAnimation();
    if (instant || motionPreference.matches) menu.hidden = true;
    else menuCloseTimer = window.setTimeout(() => { if (!menuIsOpen) menu.hidden = true; }, 250);
  };
  const openMenu = () => {
    if (!menu || menuIsOpen || navigating) return;
    dismissSectionProgress();
    window.clearTimeout(menuCloseTimer);
    menuOpener = document.activeElement instanceof HTMLElement ? document.activeElement : menuButton;
    menuScrollY = window.scrollY;
    // Cancel any in-flight smooth anchor scroll before locking the page.
    window.scrollTo({ top: menuScrollY, behavior: 'instant' });
    updateMenuCurrent();
    menu.hidden = false;
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    void menu.offsetHeight;
    menu.classList.add('is-open');
    menuIsOpen = true;
    body.classList.add('menu-open');
    root.classList.add('menu-locked');
    menuButton?.setAttribute('aria-expanded', 'true');
    // Focus first, then deactivate the opener and other background UI.
    (menuCloseButton || menu).focus({ preventScroll: true });
    lockedElements = [...body.children]
      .filter(el => el instanceof HTMLElement && el !== menu
        && !el.matches('script, style, link, .cursor-scribble, .page-wipe, .noise, .sketch-filter-defs'))
      .map(el => [el, el.inert]);
    lockedElements.forEach(([el]) => { el.inert = true; });
    syncMenuAnimation();
  };
  menuButton?.addEventListener('click', () => menuIsOpen ? closeMenu() : openMenu());
  menuCloseButton?.addEventListener('click', () => closeMenu());
  document.addEventListener('keydown', event => {
    if (!menuIsOpen) return;
    if (event.key === 'Escape') {
 const group=menu.querySelector('.site-menu__works-group'), toggle=group?.querySelector('button');
 if(toggle?.getAttribute('aria-expanded')==='true' && group.contains(document.activeElement)){
 event.preventDefault();event.stopPropagation();toggle.click();toggle.focus();return;
 }
 event.preventDefault();event.stopPropagation();closeMenu();return;
}
    if (event.key !== 'Tab') return;
    const items = menuFocusables();
    if (!items.length) { event.preventDefault(); menu.focus(); return; }
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !menu.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }, true);
  document.addEventListener('focusin', event => {
    if (menuIsOpen && !menu.contains(event.target)) (menuCloseButton || menu).focus({ preventScroll: true });
  });

  const scrollToDestination = (target, { smooth = true, updateHistory = true, focus = true } = {}) => {
    if (!target) return;
    closeMenu({ restoreFocus: false });
    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const fixedFooter = target.matches('.site-footer') && getComputedStyle(target).position === 'fixed';
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = target.id === 'top' ? 0 : fixedFooter ? maxScroll
      : clamp(target.getBoundingClientRect().top + window.scrollY - margin, 0, maxScroll);
    if (focus) focusDestination(target);
    window.scrollTo({ top, behavior: smooth && !motionPreference.matches ? 'smooth' : 'instant' });
    if (updateHistory && target.id) {
      try { history.pushState(null, '', `#${encodeURIComponent(target.id)}`); } catch (_) {}
    }
    updateMenuCurrent();
  };
  const navigateToPage = url => {
    if (navigating) return;
    closeMenu({ restoreFocus: false, instant: true });
    if (motionPreference.matches || !preloader) { location.assign(url.href); return; }
    navigating = true;
    finishPreloader();
    loaderRevealAnimation?.cancel();
    window.setPortfolioPreloaderVariant?.();
    preloader.classList.remove('is-parked-bottom');
    root.classList.add('is-fast-navigation', 'is-leaving');
    storageSet('shiva-reel-incoming', '1');

    // Every page now uses the authored 1.2-second connected signature.
    resetLoaderDrawing();
    // The charcoal panel enters first; the 1200ms pen sequence begins after it settles.
    window.setTimeout(() => drawLoader(() => location.assign(url.href)), 200);
  };

  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || !ordinaryClick(event, link)) return;
    const raw = link.getAttribute('href');
    if (!raw || raw === '#') return;
    let url;
    try { url = new URL(link.href, document.baseURI); } catch (_) { return; }
    const internal = url.origin === new URL(document.baseURI).origin && /^(https?:|file:)$/.test(url.protocol);
    // Hash-only links also work in offline DOM previews with no document origin.
    if (raw.startsWith('#') || (internal && sameDocument(url))) {
      const target = hashTarget(url.hash || '#top');
      if (!target) return;
      event.preventDefault();
      scrollToDestination(target);
      return;
    }
    if (internal && (link.closest('.site-menu') || link.classList.contains('transition-link'))) {
      event.preventDefault();
      navigateToPage(url);
    }
  });
  const restoreFragment = () => {
    const target = hashTarget(location.hash);
    if (target) scrollToDestination(target, { smooth: false, updateHistory: false, focus: false });
  };
  window.addEventListener('popstate', restoreFragment);
  window.addEventListener('hashchange', restoreFragment);
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    navigating = false;
    root.classList.remove('is-leaving', 'is-fast-navigation', 'menu-locked');
    closeMenu({ restoreFocus: true, instant: true });
    root.classList.add('is-ready');
    preloader?.classList.add('is-parked-bottom');
    updateMenuCurrent();
  });
  document.addEventListener('portfolio:ready', () => window.setTimeout(restoreFragment, 400), { once: true });
  updateMenuCurrent();

  // The original social links live in HTML and remain visible without config/JS.
  // Valid owner-supplied profiles override their original destinations in place.
  // Generic service homepages are restored legacy destinations, not personal profiles.
  const contact = window.PORTFOLIO_CONFIG?.contact || {};
  document.querySelectorAll('[data-contact-links]').forEach(container => {
    for (const [key, label] of [['email', 'Email'], ['linkedin', 'LinkedIn'], ['medium', 'Medium'], ['github', 'GitHub']]) {
      const value = String(contact[key] || '').trim();
      if (!value) continue;
      let href;
      if (key === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) continue;
        href = `mailto:${value}`;
      } else {
        try {
          const url = new URL(value);
          if (url.protocol !== 'https:' || url.username || url.password) continue;
          href = url.href;
        } catch (_) { continue; }
      }
      let link = container.querySelector(`[data-contact-key="${key}"]`);
      if (!link) {
        link = document.createElement('a');
        link.dataset.contactKey = key;
        if (key === 'email') container.prepend(link);
        else container.appendChild(link);
      }
      link.href = href;
      if (key === 'email') {
        link.textContent = label;
        link.removeAttribute('target');
        link.removeAttribute('rel');
        link.setAttribute('aria-label', `Email ${value}`);
      } else {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${label} (opens in a new tab)`);
        link.textContent = `${label} `;
        const arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '\u2197';
        link.appendChild(arrow);
      }
    }
  });

  // Reveals and drawing animations.
  const revealTargets = [...document.querySelectorAll('.reveal, .reveal-clip, [data-reveal]')];
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.revealDelay || 0);
        window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(target => revealObserver.observe(target));
  } else {
    revealTargets.forEach(target => target.classList.add('is-visible'));
  }

  // 95k-agent dot field. Dots begin slightly dispersed and assemble into the
  // final 10x10 grid as the section enters; motion is tied to scroll position.
  const dotFields = [...document.querySelectorAll('.dot-field')];
  dotFields.forEach(field => {
    const filled = Number(field.dataset.filled || 95);
    const total = Number(field.dataset.total || 100);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement('span');
      dot.classList.add(i < filled ? 'is-filled' : 'is-empty');
      const angle = ((i * 137.5) % 360) * Math.PI / 180;
      const distance = 18 + (i % 8) * 3.1;
      dot.dataset.dx = String(Math.cos(angle) * distance);
      dot.dataset.dy = String(Math.sin(angle) * distance);
      dot.dataset.rot = String(((i % 9) - 4) * .8);
      dot.style.opacity = '0';
      fragment.appendChild(dot);
    }
    field.appendChild(fragment);
    field.classList.add('has-dots');
  });

  const updateDotFields = () => {
    dotFields.forEach(field => {
      const rect = field.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = clamp((vh * .84 - rect.top) / Math.max(1, vh * .48));
      const dots = [...field.children];
      dots.forEach((dot, i) => {
        const stagger = Math.min(.42, i * .0038);
        const p = clamp((raw - stagger) / Math.max(.001, 1 - stagger));
        const eased = 1 - Math.pow(1 - p, 3);
        const dx = Number(dot.dataset.dx || 0) * (1 - eased);
        const dy = Number(dot.dataset.dy || 0) * (1 - eased);
        const rot = Number(dot.dataset.rot || 0) * (1 - eased);
        dot.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${.7 + eased * .3})`;
        dot.style.opacity = String(Math.min(1, p * 1.45));
      });
      field.classList.toggle('is-settled', raw > .985);
    });
  };
  let dotRaf = 0;
  const requestDotUpdate = () => {
    if (dotRaf) return;
    dotRaf = requestAnimationFrame(() => { dotRaf = 0; updateDotFields(); });
  };
  window.addEventListener('scroll', requestDotUpdate, { passive: true });
  window.addEventListener('resize', requestDotUpdate);
  requestDotUpdate();
  window.setTimeout(requestDotUpdate, 120);

  // Count-up metrics.
  const countTargets = [...document.querySelectorAll('[data-count]')];
  const animateCount = element => {
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';
    const end = Number(element.dataset.count || 0);
    const decimals = Number(element.dataset.decimals || 0);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = Number(element.dataset.duration || 1200);
    if (reduceMotion) {
      element.textContent = `${prefix}${end.toLocaleString(undefined, {minimumFractionDigits: decimals, maximumFractionDigits: decimals})}${suffix}`;
      return;
    }
    const startTime = performance.now();
    const frame = now => {
      const t = clamp((now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const value = end * eased;
      element.textContent = `${prefix}${value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ('IntersectionObserver' in window && !reduceMotion) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    countTargets.forEach(target => countObserver.observe(target));
  } else {
    countTargets.forEach(target => animateCount(target));
  }

  // Typewriter in the home hero.
  const typewriter = document.querySelector('[data-typewriter]');
  if (typewriter && !reduceMotion) {
    const phrases = (typewriter.dataset.typewriter || '').split('|').map(item => item.trim()).filter(Boolean);
    const output = typewriter.querySelector('.typewriter-output');
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    const tick = () => {
      const phrase = phrases[phraseIndex] || '';
      characterIndex += deleting ? -1 : 1;
      output.textContent = phrase.slice(0, Math.max(0, characterIndex));
      let delay = deleting ? 28 : 52;
      if (!deleting && characterIndex >= phrase.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 300;
      }
      window.setTimeout(tick, delay);
    };
    window.setTimeout(tick, 900);
  } else if (typewriter) {
    typewriter.querySelector('.typewriter-output').textContent = (typewriter.dataset.typewriter || '').split('|')[0] || '';
  }



  // One quiet achievement line loops in place: type, hold, erase, replace.
  const achievementTypewriter = document.querySelector('[data-achievement-typewriter]');
  if (achievementTypewriter) {
    const output = achievementTypewriter.querySelector('.typewriter-output');
    const line = achievementTypewriter.querySelector('p');
    const phrases = (achievementTypewriter.dataset.lines || '').split('|').map(item => item.trim()).filter(Boolean);
    if (output && phrases.length) {
      if (reduceMotion) {
        output.textContent = phrases[0];
      } else {
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;
        const tickAchievement = () => {
          const phrase = phrases[phraseIndex];
          line?.classList.add('is-typing');
          if (!deleting) {
            charIndex += 1;
            output.textContent = phrase.slice(0, charIndex);
            if (charIndex >= phrase.length) {
              line?.classList.remove('is-typing');
              deleting = true;
              window.setTimeout(tickAchievement, 2100);
              return;
            }
            const last = phrase[charIndex - 1] || '';
            window.setTimeout(tickAchievement, /[,.–—]/.test(last) ? 92 : 28 + Math.random() * 18);
          } else {
            charIndex = Math.max(0, charIndex - 1);
            output.textContent = phrase.slice(0, charIndex);
            if (charIndex <= 0) {
              deleting = false;
              phraseIndex = (phraseIndex + 1) % phrases.length;
              window.setTimeout(tickAchievement, 320);
              return;
            }
            window.setTimeout(tickAchievement, 14);
          }
        };
        window.setTimeout(tickAchievement, 1200);
      }
    }
  }

  // Typed editorial bridge on Agent Management. The cursor writes the line
  // only when the statement is actually in view; the pipe in data-analogy-type
  // becomes a deliberate line break.
  const analogyTypewriter = document.querySelector('[data-analogy-type]');
  if (analogyTypewriter) {
    const output = analogyTypewriter.querySelector('[data-analogy-output]');
    const source = (analogyTypewriter.dataset.analogyType || '').replace('|', '\n');
    const runAnalogyType = () => {
      if (!output || analogyTypewriter.dataset.typed === 'true') return;
      analogyTypewriter.dataset.typed = 'true';
      if (reduceMotion) {
        output.textContent = source;
        analogyTypewriter.classList.add('is-complete');
        return;
      }
      let index = 0;
      const typeNext = () => {
        index += 1;
        output.textContent = source.slice(0, index);
        if (index >= source.length) {
          analogyTypewriter.classList.add('is-complete');
          return;
        }
        const char = source[index - 1] || '';
        const delay = char === '\n' ? 260 : /[,.]/.test(char) ? 120 : 42 + Math.random() * 34;
        window.setTimeout(typeNext, delay);
      };
      window.setTimeout(typeNext, 180);
    };
    if ('IntersectionObserver' in window && !reduceMotion) {
      const analogyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          runAnalogyType();
          analogyObserver.disconnect();
        });
      }, { threshold: .48, rootMargin: '0px 0px -8% 0px' });
      analogyObserver.observe(analogyTypewriter);
    } else {
      runAnalogyType();
    }
  }


  // City -> Junction -> Camera narrative. The image state is derived only from
  // copy crossing the reading line after the visual has settled. Camera latches
  // while leaving the story and resets only after scrolling back above it.
  const cityStoryV14 = document.querySelector('[data-city-story-v13]');
  let cityActiveV14 = 0;
  let cityCompletedV14 = false;
  let cityLastScrollYV14 = window.scrollY;
  const setCityStepV14 = index => {
    if (!cityStoryV14) return;
    const images = [...cityStoryV14.querySelectorAll('[data-city-image]')];
    const steps = [...cityStoryV14.querySelectorAll('[data-city-step]')];
    const counter = cityStoryV14.querySelector('[data-city-counter]');
    const safe = Math.max(0, Math.min(steps.length - 1, index));
    cityActiveV14 = safe;
    if (safe === steps.length - 1) cityCompletedV14 = true;
    images.forEach((image, i) => image.classList.toggle('is-active', i === safe));
    steps.forEach((step, i) => step.classList.toggle('is-active', i === safe));
    if (counter) counter.textContent = String(safe + 1).padStart(2, '0');
  };
  const updateCityV14 = () => {
    if (!cityStoryV14) return;
    const visual = cityStoryV14.querySelector('.city-story-v13__visual');
    const card = cityStoryV14.querySelector('.city-story-v13__card');
    const steps = [...cityStoryV14.querySelectorAll('[data-city-step]')];
    if (!visual || !card || !steps.length) return;
    if (reduceMotion || window.innerWidth <= 980) { setCityStepV14(0); return; }

    const vh = window.innerHeight;
    const storyRect = cityStoryV14.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scrollingDown = window.scrollY >= cityLastScrollYV14;
    cityLastScrollYV14 = window.scrollY;

    if (!scrollingDown && storyRect.top > vh * .30) {
      cityCompletedV14 = false;
      setCityStepV14(0);
      return;
    }

    // Do not change anything until most of the illustration is actually visible.
    const visualReady = cardRect.top <= vh * .18 && cardRect.bottom >= vh * .72;
    if (!visualReady) {
      if (cityCompletedV14 && scrollingDown) setCityStepV14(2);
      else if (storyRect.top > 0) setCityStepV14(0);
      return;
    }

    const readingLine = vh * .60;
    let active = 0;
    steps.forEach((step, index) => {
      if (step.getBoundingClientRect().top <= readingLine) active = index;
    });
    if (cityCompletedV14 && scrollingDown) active = Math.max(active, 2);
    setCityStepV14(active);
  };

  // Background transitions are staged in empty scroll space rather than snapping
  // from one section colour to another. Content never shares the transition:
  // the colour settles first, then the next section enters.
  const homeManifesto = body.classList.contains('page-home') ? document.getElementById('manifesto') : null;
  const mixColor = (a, b, t) => {
    const k = clamp(t);
    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)} ${Math.round(a[1] + (b[1] - a[1]) * k)} ${Math.round(a[2] + (b[2] - a[2]) * k)})`;
  };

  const backgroundTones = {
    paper: { hex: '#fcfcf4', rgb: [252, 252, 244] },
    sand: { hex: '#ece9e4', rgb: [236, 233, 228] },
    grey: { hex: '#deded8', rgb: [222, 222, 216] },
    lavender: { hex: '#e8e4da', rgb: [232, 228, 218] },
    orange: { hex: '#ff5623', rgb: [255, 86, 35] },
    ink: { hex: '#232428', rgb: [35, 36, 40] },
    night: { hex: '#08070c', rgb: [8, 7, 12] },
    purple: { hex: '#232428', rgb: [35, 36, 40] },
    umber: { hex: '#343a3a', rgb: [52, 58, 58] },
    graphite: { hex: '#343a3a', rgb: [52, 58, 58] }
  };

  const toneForSection = section => {
    if (body.classList.contains('page-home')) {
      if (section.id === 'writing' || section.id === 'vibes') return 'grey';
      if (section.id === 'manifesto') return 'orange';
      return 'paper';
    }

    if (body.classList.contains('page-case-agent')) {
      if (section.classList.contains('screen-flow')) return 'night';
      if (section.classList.contains('section--ink')) return 'ink';
      if (section.classList.contains('section--orange')) return 'orange';
      if (section.classList.contains('section--graphite')) return 'graphite';
      if (section.classList.contains('section--umber')) return 'umber';
      if (section.classList.contains('section--sand') || section.classList.contains('lifecycle-scene')) return 'sand';
      return 'paper';
    }

    if (body.classList.contains('page-case-domain')) {
      if (section.classList.contains('screen-flow')) return 'night';
      if (section.classList.contains('section--ink')) return 'ink';
      if (section.classList.contains('section--orange')) return 'orange';
      if (section.classList.contains('section--purple')) return 'purple';
      if (section.classList.contains('section--lavender') || section.classList.contains('current-ux')) return 'lavender';
      if (section.classList.contains('section--sand')) return 'sand';
      return 'paper';
    }

    return 'paper';
  };

  const colourDistance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const bgBreathers = [];

  const installBackgroundBreathers = () => {
    // Keep the animated continuous colour plane on the homepage only. Case
    // studies own their section surfaces so an incoming section cannot recolour
    // an outgoing decision or sticky scene while both are still in view.
    if (!body.classList.contains('page-home')) return;
    const main = document.getElementById('main');
    if (!main || main.dataset.bgBreathersReady === 'true') return;
    main.dataset.bgBreathersReady = 'true';

    const sections = [...main.children].filter(el => el.matches('section'));
    if (!sections.length) return;

    let previousTone = toneForSection(sections[0]);
    sections[0].dataset.bgTone = previousTone;
    sections[0].style.backgroundColor = 'transparent';

    for (let index = 1; index < sections.length; index += 1) {
      const section = sections[index];
      const nextTone = toneForSection(section);
      section.dataset.bgTone = nextTone;
      section.style.backgroundColor = 'transparent';

      if (nextTone !== previousTone) {
        const from = backgroundTones[previousTone];
        const to = backgroundTones[nextTone];
        const distance = colourDistance(from.rgb, to.rgb);
        const breath = document.createElement('div');
        breath.className = 'bg-transition-breath';
        breath.setAttribute('aria-hidden', 'true');
        breath.dataset.fromTone = previousTone;
        breath.dataset.toTone = nextTone;
        breath.style.setProperty('--breath-from', from.hex);
        breath.style.setProperty('--breath-to', to.hex);
        const distanceClass = distance > 180 ? 'major' : distance > 70 ? 'medium' : 'minor';
        breath.dataset.distance = distanceClass;
        breath.style.setProperty('--breath-height', distanceClass === 'major' ? '14svh' : distanceClass === 'medium' ? '10svh' : '7svh');
        main.insertBefore(breath, section);
        bgBreathers.push({ el: breath, from: from.rgb, to: to.rgb });
      }

      previousTone = nextTone;
    }
  };

  const updateBackgroundBreathers = () => {
    if (!body.classList.contains('page-home')) return;
    const main = document.getElementById('main');
    if (!main) return;
    const vh = window.innerHeight || 1;
    const probe = vh * .5;
    let current = backgroundTones.paper.rgb;

    if (bgBreathers.length) current = bgBreathers[0].from;

    for (const { el, from, to } of bgBreathers) {
      const rect = el.getBoundingClientRect();
      if (rect.top > probe) break;

      if (rect.bottom <= probe) {
        current = to;
        el.style.setProperty('--breath-progress', '1');
        continue;
      }

      // The viewport-centre line is intentionally used as the scrub point.
      // Colour therefore does not begin changing when the breath merely
      // touches the bottom edge; it starts only once the blank transition
      // has moved into the composition and the previous section has cleared.
      const raw = clamp((probe - rect.top) / Math.max(1, rect.height));
      const eased = raw * raw * (3 - 2 * raw);
      current = [
        from[0] + (to[0] - from[0]) * eased,
        from[1] + (to[1] - from[1]) * eased,
        from[2] + (to[2] - from[2]) * eased
      ];
      el.style.setProperty('--breath-progress', eased.toFixed(4));
      break;
    }

    const colour = `rgb(${Math.round(current[0])} ${Math.round(current[1])} ${Math.round(current[2])})`;
    root.style.setProperty('--continuous-page-bg', colour);
    main.style.setProperty('--continuous-page-bg', colour);
    main.style.backgroundColor = colour;
  };

  installBackgroundBreathers();

  // Preserve the manifesto's delayed copy reveal, but keep colour changes out
  // of content-bearing sections. Colour is now handled exclusively above.
  const updateHomeBackground = () => {
    if (!homeManifesto) return;
    const rect = homeManifesto.getBoundingClientRect();
    homeManifesto.classList.toggle('is-text-ready', rect.top <= window.innerHeight * .52);
  };


  // Writing archive filters. The layout is editorial rather than app-like,
  // and filtering never changes the reading order of the visible items.
  const writingFilter = document.querySelector('.writing-filter');
  if (writingFilter) {
    const buttons = [...writingFilter.querySelectorAll('[data-writing-filter]')];
    const cards = [...document.querySelectorAll('#writing [data-writing-kind]')];
    const applyWritingFilter = kind => {
      buttons.forEach(button => {
        const selected = button.dataset.writingFilter === kind;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      cards.forEach(card => {
        const show = kind === 'all' || card.dataset.writingKind === kind;
        card.classList.toggle('is-filtered-out', !show);
        card.setAttribute('aria-hidden', show ? 'false' : 'true');
      });
    };
    buttons.forEach(button => button.addEventListener('click', () => applyWritingFilter(button.dataset.writingFilter)));
  }

  // Touch parity for the remaining hover-led books, tiles and lifecycle cards.
  // Selected-work cards show descriptions directly on touch and follow their
  // links on the first tap.
  if (!finePointer) {
    const touchCards = [
      ...document.querySelectorAll('.writing-book'),
      ...document.querySelectorAll('.vibe-tile'),
      ...document.querySelectorAll('.lifecycle-flip')
    ];

    const closeTouchCards = except => {
      touchCards.forEach(card => {
        if (card === except) return;
        card.classList.remove('is-tapped');
        card.setAttribute('aria-expanded', 'false');
      });
    };

    touchCards.forEach(card => {
      card.setAttribute('aria-expanded', 'false');
      card.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        const wasOpen = card.classList.contains('is-tapped');

        if (!wasOpen) {
          event.preventDefault();
          closeTouchCards(card);
          card.classList.add('is-tapped');
          card.setAttribute('aria-expanded', 'true');
          return;
        }

        // Non-link interactive tiles/books toggle closed on the second tap.
        if (!link) {
          card.classList.remove('is-tapped');
          card.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('pointerdown', event => {
      if (event.target.closest('.writing-book, .vibe-tile, .lifecycle-flip')) return;
      closeTouchCards(null);
    }, { passive: true });

  }

  // Scroll-drawn editorial scribbles. They occupy deliberate negative space
  // and draw once when they enter the viewport rather than constantly moving.
  const scrollScribbles = [...document.querySelectorAll('.scroll-scribble')];
  // Give each editorial mark two imperfect echo strokes. The tiny offsets make
  // the curves read like a pen that passed over the paper more than once.
  scrollScribbles.forEach(item => {
    const path = item.querySelector('path');
    if (!path || item.querySelector('.scribble-echo')) return;
    const echo = path.cloneNode(true);
    echo.classList.add('scribble-echo');
    const echo2 = path.cloneNode(true);
    echo2.classList.add('scribble-echo', 'scribble-echo--2');
    path.parentNode.insertBefore(echo, path);
    path.parentNode.insertBefore(echo2, path);
  });
  if (scrollScribbles.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      const scribbleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          scribbleObserver.unobserve(entry.target);
        });
      }, { threshold: .22, rootMargin: '0px 0px -12% 0px' });
      scrollScribbles.forEach(item => scribbleObserver.observe(item));
    } else {
      scrollScribbles.forEach(item => item.classList.add('is-visible'));
    }
  }

  // Vibe-app launchpad: hovering, focusing or clicking a rail item swaps the
  // central animated placeholder without navigating away from the portfolio.
  document.querySelectorAll('[data-vibe-launchpad]').forEach(launchpad => {
    const chips = [...launchpad.querySelectorAll('[data-vibe]')];
    const previews = [...launchpad.querySelectorAll('[data-vibe-preview]')];
    const activateVibe = key => {
      chips.forEach(chip => chip.classList.toggle('is-active', chip.dataset.vibe === key));
      previews.forEach(preview => preview.classList.toggle('is-active', preview.dataset.vibePreview === key));
    };
    chips.forEach(chip => {
      const key = chip.dataset.vibe;
      chip.addEventListener('mouseenter', () => activateVibe(key));
      chip.addEventListener('focus', () => activateVibe(key));
      chip.addEventListener('click', () => activateVibe(key));
    });
  });
  // One delegated cursor state covers links, their child images/text, and
  // dynamically created controls. Native cursors are hidden only while this
  // cursor is active, never on touch or when reduced motion is requested.
  const cursor = document.querySelector('.cursor-scribble');
  if (cursor) {
    const pointerMedia = window.matchMedia('(hover:hover) and (pointer:fine)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion:reduce)');
    const enabled = () => pointerMedia.matches && !motionMedia.matches;
    const clickable = 'a[href], button:not(:disabled), summary, [role="button"], [role="tab"], [data-cursor="link"]';
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    let visible = false;
    let cursorRaf = 0;

    const updateCursorMode = target => {
      const element = target instanceof Element ? target.closest(clickable) : null;
      cursor.classList.toggle('is-link', Boolean(element && !element.closest('[inert], [aria-disabled="true"]')));
    };
    const cursorFrame = () => {
      cursorRaf = 0;
      cursorX += (mouseX - cursorX) * .24;
      cursorY += (mouseY - cursorY) * .24;
      if (Math.abs(mouseX - cursorX) + Math.abs(mouseY - cursorY) < .1) {
        cursorX = mouseX; cursorY = mouseY;
      }
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      if (visible && (cursorX !== mouseX || cursorY !== mouseY)) cursorRaf = requestAnimationFrame(cursorFrame);
    };
    const hideCursor = () => {
      visible = false;
      cancelAnimationFrame(cursorRaf);
      cursorRaf = 0;
      cursor.style.opacity = '0';
      cursor.classList.remove('is-link', 'is-down');
      root.classList.remove('has-custom-cursor');
    };
    document.addEventListener('pointermove', event => {
      if (!enabled() || event.pointerType === 'touch') { hideCursor(); return; }
      mouseX = event.clientX; mouseY = event.clientY;
      if (!visible) {
        cursorX = mouseX; cursorY = mouseY;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        visible = true;
        cursor.style.opacity = '1';
        root.classList.add('has-custom-cursor');
      }
      updateCursorMode(event.target);
      if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorFrame);
    }, { passive: true });
    document.addEventListener('pointerover', event => {
      if (visible) updateCursorMode(event.target);
    }, { passive: true });
    document.addEventListener('pointerout', event => {
      if (!event.relatedTarget) hideCursor();
      else if (visible) updateCursorMode(event.relatedTarget);
    }, { passive: true });
    document.addEventListener('pointerdown', event => {
      if (visible && event.button === 0) cursor.classList.add('is-down');
    }, { passive: true });
    document.addEventListener('pointerup', () => cursor.classList.remove('is-down'), { passive: true });
    document.addEventListener('pointercancel', hideCursor, { passive: true });
    window.addEventListener('blur', hideCursor);
    document.addEventListener('visibilitychange', () => { if (document.hidden) hideCursor(); });
    pointerMedia.addEventListener('change', hideCursor);
    motionMedia.addEventListener('change', hideCursor);
  }

  const workSection = document.querySelector('.work-scroller');
  const workTrack = workSection?.querySelector('.work-track');
  const manifesto = document.querySelector('.manifesto');
  const manifestoWords = manifesto ? [...manifesto.querySelectorAll('.manifesto__word')] : [];
  const manifestoHalo = manifesto?.querySelector('.manifesto__halo');
  const cityStory = document.querySelector('.city-story');
  const cityCopy = cityStory ? [...cityStory.querySelectorAll('.city-step-copy__item')] : [];
  const beforeAfter = document.querySelector('.before-after');
  const beforeAfterCopy = beforeAfter ? [...beforeAfter.querySelectorAll('.before-after__copy-item')] : [];
  const flows = [...document.querySelectorAll('.screen-flow')];
  const currentUx = document.querySelector('.current-ux');
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  const themeSections = [...document.querySelectorAll('[data-header-theme]')].filter(section => !(body.classList.contains('page-home') && section.classList.contains('site-footer')));
  const fixedCaseIndex = document.querySelector('.case-index--fixed');

  const progressInElement = element => {
    const rect = element.getBoundingClientRect();
    const span = Math.max(1, element.offsetHeight - window.innerHeight);
    return clamp(-rect.top / span);
  };

  const activateIndexed = (items, index, activeClass = 'is-active') => {
    items.forEach((item, itemIndex) => item.classList.toggle(activeClass, itemIndex === index));
  };

  const updateWork = () => {
    if (!workSection || !workTrack || workSection.classList.contains('work-scroller--stack') || window.innerWidth <= 800 || reduceMotion) return;
    const progress = progressInElement(workSection);
    const maxShift = Math.max(0, workTrack.scrollWidth - window.innerWidth);
    workTrack.style.transform = `translate3d(${-maxShift * progress}px, 0, 0)`;
  };

  const updateManifesto = () => {
    if (!manifesto) return;
    if (manifestoHalo) {
      manifestoHalo.style.transform = 'scale(1) rotate(0deg)';
      manifestoHalo.style.opacity = '.24';
    }
  };

  const updateRoleNotes = () => {
    const section = document.querySelector('[data-role-notes]');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = clamp((vh * .78 - rect.top) / Math.max(1, rect.height * .78));
    const notes = [...section.querySelectorAll('[data-role-note]')];
    notes.forEach((note, index) => {
      const trigger = .08 + index * .14;
      note.classList.toggle('is-visible', progress >= trigger);
    });
  };

  const updateCity = () => {
    const story = document.querySelector('[data-city-story-v9]');
    if (!story) return;
    const rect = story.getBoundingClientRect();
    const stage = story.querySelector('.city-story-v9__stage');
    const stageRect = stage ? stage.getBoundingClientRect() : rect;
    const vh = window.innerHeight;
    const images = [...story.querySelectorAll('[data-city-image]')];
    const copies = [...story.querySelectorAll('[data-city-copy]')];

    // Nothing in the city composition becomes visible before the section
    // actually reaches the viewing area. This fixes the premature reveal.
    const entered = stageRect.top <= vh * .78 && stageRect.bottom >= vh * .16;
    story.classList.toggle('is-entered', entered);
    if (!entered) {
      images.forEach(image => image.classList.remove('is-active'));
      copies.forEach(copy => copy.classList.remove('is-active'));
      return;
    }

    const travel = Math.max(1, stageRect.height - vh * .18);
    const progress = clamp((vh * .78 - stageRect.top) / travel);
    const step = progress < .34 ? 0 : progress < .67 ? 1 : 2;
    images.forEach((image, index) => image.classList.toggle('is-active', index === step));
    copies.forEach((copy, index) => copy.classList.toggle('is-active', index === step));
    const counter = story.querySelector('[data-city-counter]');
    if (counter) counter.textContent = String(step + 1).padStart(2, '0');
    story.dataset.step = String(step);
  };

  const updateBeforeAfter = () => {
    if (!beforeAfter || !body.classList.contains('page-case-agent')) return;
    const images = [...beforeAfter.querySelectorAll('.before-after__image')];
    const copies = [...beforeAfter.querySelectorAll('.before-after__copy-item')];
    if (!images.length) return;
    if (reduceMotion || window.innerWidth <= 900) {
      activateIndexed(images, 0);
      activateIndexed(copies, 0);
      return;
    }
    const progress = progressInElement(beforeAfter);
    const step = progress < .5 ? 0 : 1;
    activateIndexed(images, step);
    activateIndexed(copies, step);
    const label = beforeAfter.querySelector('.before-after__label');
    if (label) label.textContent = step === 0 ? 'Scroll · before' : 'Scroll · after';
  };

  const updateFlow = flow => {
    if (!flow || !body.classList.contains('page-case-agent') || flow.hasAttribute('data-flow-managed')) return;
    const steps = [...flow.querySelectorAll('.flow-step')];
    const screens = [...flow.querySelectorAll('.flow-screen')];
    const rail = [...flow.querySelectorAll('.screen-flow__rail span')];
    if (!steps.length || !screens.length) return;
    if (reduceMotion || window.innerWidth <= 900) {
      activateIndexed(steps, 0);
      activateIndexed(screens, 0);
      return;
    }
    const progress = progressInElement(flow);
    const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
    activateIndexed(steps, index);
    activateIndexed(screens, index);
    activateIndexed(rail, index);
    const activeAspect = Number(screens[index]?.dataset.flowAspect || 0);
    if (activeAspect > 0) flow.style.setProperty('--flow-aspect', String(activeAspect));
  };

  const updateCurrentUx = () => {};

  const updateParallax = () => {
    if (reduceMotion) return;
    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const factor = Number(item.dataset.parallax || .12);
      const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      item.style.transform = `translate3d(0, ${-centerOffset * factor * 180}px, 0)`;
    });
  };

  const updateCaseIndexVisibility = () => {
    if (!fixedCaseIndex) return;
    body.classList.toggle('case-index-visible', window.scrollY > window.innerHeight * 0.72);
  };

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    const probe = Math.min(window.innerHeight * .14, 110);
    let theme = 'light';
    themeSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probe && rect.bottom > probe) theme = section.dataset.headerTheme || 'light';
    });
    if (body.classList.contains('page-home')) {
      const footerRevealStart = Math.max(0, document.documentElement.scrollHeight - window.innerHeight * 1.12);
      if (window.scrollY >= footerRevealStart) theme = 'dark';
    }
    header.dataset.theme = theme;
    if (sectionProgress) sectionProgress.dataset.theme = theme;
  };

  // Floating section index for case-study pages.
  const indexLinks = [...document.querySelectorAll('.case-index a[href^="#"]')];
  if (indexLinks.length && 'IntersectionObserver' in window) {
    const sectionMap = new Map(indexLinks.map(link => [link.getAttribute('href').slice(1), link]));
    const activeObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      indexLinks.forEach(link => link.classList.remove('is-active'));
      sectionMap.get(visible.target.id)?.classList.add('is-active');
    }, { rootMargin: '-25% 0px -58% 0px', threshold: [0, .1, .35, .7] });
    sectionMap.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) activeObserver.observe(section);
    });
  }

  // Header visibility follows direction only after the opening composition.
  let previousY = window.scrollY;
  let ticking = false;
  const render = () => {
    updateHomeChrome();
    updateHomeBackground();
    updateBackgroundBreathers();
    updateHeader();
    updateSectionProgress();
    updateCaseIndexVisibility();
    updateWork();
    updateManifesto();
    updateRoleNotes();
    updateCity();
    updateCityV14();
    updateBeforeAfter();
    flows.forEach(updateFlow);
    updateCurrentUx();
    updateParallax();
    previousY = window.scrollY;
    ticking = false;
  };
  const requestRender = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  };
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender);
  requestRender();
})();


/* V42 cognitive-load markers. Marker centers are derived from the SVG path.
   Tooltip copy is rendered by each marker itself via CSS, which keeps the
   annotation intrinsically sized and avoids legacy shared-tooltip sizing. */
(() => {
  const chart = document.querySelector('[data-cognitive-chart]');
  if (!chart) return;
  const line = chart.querySelector('[data-cog-line]');
  const points = [...chart.querySelectorAll('[data-cog-tip]')];
  if (!line || !points.length) return;

  const placePoints = () => {
    let length = 0;
    try { length = line.getTotalLength(); } catch (_) { return; }
    const chartRect = chart.getBoundingClientRect();
    const matrix = line.getScreenCTM?.();
    if (!matrix) return;
    points.forEach(point => {
      const t = Math.max(0, Math.min(1, Number(point.dataset.cogPosition || .5)));
      const p = line.getPointAtLength(length * t);
      const svgPoint = line.ownerSVGElement.createSVGPoint();
      svgPoint.x = p.x;
      svgPoint.y = p.y;
      const screen = svgPoint.matrixTransform(matrix);
      point.style.setProperty('--x', `${screen.x - chartRect.left}px`);
      point.style.setProperty('--y', `${screen.y - chartRect.top}px`);
    });
  };

  window.addEventListener('resize', placePoints, { passive: true });
  requestAnimationFrame(placePoints);
  if (document.fonts?.ready) document.fonts.ready.then(placePoints).catch(() => {});
})();

/* V15 enhancements: draggable role notes and lifecycle deck choreography. */
(() => {
  const clamp01 = value => Math.max(0, Math.min(1, value));

  document.querySelectorAll('[data-draggable-notes] .role-note').forEach(note => {
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let baseX = Number(note.dataset.dragX || 0);
    let baseY = Number(note.dataset.dragY || 0);

    const apply = (x, y) => {
      note.dataset.dragX = String(x);
      note.dataset.dragY = String(y);
      note.style.setProperty('--drag-x', `${x}px`);
      note.style.setProperty('--drag-y', `${y}px`);
    };

    note.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      baseX = Number(note.dataset.dragX || 0);
      baseY = Number(note.dataset.dragY || 0);
      note.classList.add('is-dragging');
      note.setPointerCapture?.(pointerId);
    });

    note.addEventListener('pointermove', event => {
      if (event.pointerId !== pointerId) return;
      apply(baseX + event.clientX - startX, baseY + event.clientY - startY);
    });

    const finish = event => {
      if (pointerId === null || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      note.classList.remove('is-dragging');
      try { note.releasePointerCapture?.(pointerId); } catch (_) {}
      pointerId = null;
    };
    note.addEventListener('pointerup', finish);
    note.addEventListener('pointercancel', finish);
  });

  const lifecycle = document.querySelector('[data-lifecycle-scene]');
  if (!lifecycle) return;
  const cards = [...lifecycle.querySelectorAll('[data-life-card]')];
  const spread = [-2, -1, 0, 1, 2];

  const renderLifecycle = () => {
    const linear = matchMedia('(max-width: 980px), (max-height: 849px), (prefers-reduced-motion: reduce)').matches;
    if (linear) {
      cards.forEach(card => { ['--life-x','--life-y','--life-r'].forEach(name => card.style.removeProperty(name)); card.style.opacity = '1'; });
      lifecycle.classList.add('is-prioritised', 'is-conclusion-ready', 'is-why-ready');
      return;
    }
    const rect = lifecycle.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = Math.max(1, rect.height - vh);
    const progress = clamp01(-rect.top / total);
    const fan = clamp01((progress - .08) / .34);
    const prioritise = clamp01((progress - .52) / .22);
    const conclusionReveal = clamp01((progress - .66) / .10);
    const whyReveal = clamp01((progress - .79) / .10);
    const maxStep = Math.min(window.innerWidth * .155, 245);

    cards.forEach((card, index) => {
      const x = spread[index] * maxStep * fan;
      const y = Math.abs(spread[index]) * 12 * (1 - fan);
      const r = spread[index] * 2.1 * fan;
      card.style.setProperty('--life-x', `${x}px`);
      card.style.setProperty('--life-y', `${y}px`);
      card.style.setProperty('--life-r', `${r}deg`);
      if (index === 0 || index === 4) card.style.opacity = String(1 - prioritise * .92);
      else card.style.opacity = '1';
    });
    lifecycle.classList.toggle('is-prioritised', prioritise > .68);
    lifecycle.classList.toggle('is-conclusion-ready', conclusionReveal > .08);
    lifecycle.classList.toggle('is-why-ready', whyReveal > .08);
  };

  let raf = 0;
  const request = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; renderLifecycle(); });
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  renderLifecycle();
})();


(() => {
  const deck = document.querySelector('[data-evidence-deck]');
  if (!deck) return;
  const cards = [...deck.querySelectorAll('[data-evidence-card]')];
  const tabs = [...document.querySelectorAll('[data-evidence-tab]')];
  const setActive = index => {
    const safe = Math.max(0, Math.min(cards.length - 1, Number(index) || 0));
    cards.forEach((card, i) => card.classList.toggle('is-active', i === safe));
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === safe);
      tab.setAttribute('aria-selected', i === safe ? 'true' : 'false');
    });
    deck.dataset.active = String(safe);
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActive(index));
    tab.addEventListener('mouseenter', () => setActive(index));
  });
  cards.forEach((card, index) => card.addEventListener('click', () => setActive(index)));
  setActive(0);
})();


/* V27 roadmap draw-in. */
(() => {
  const roadmaps = [...document.querySelectorAll('[data-roadmap-reveal]')];
  if (!roadmaps.length) return;
  if (!('IntersectionObserver' in window)) { roadmaps.forEach(el => el.classList.add('is-roadmap-visible')); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-roadmap-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .28 });
  roadmaps.forEach(el => observer.observe(el));
})();

/* V31 — Skiper-inspired sticky Selected Work + hover-expand Writing. */
(() => {
  const work = document.querySelector('.work-scroller--skiper');
  const shells = work ? [...work.querySelectorAll('[data-skiper-card]')] : [];
  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));

  const stackMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateStack = () => {
    if (!work || !shells.length || window.innerWidth <= 980 || stackMotion.matches) {
      shells.forEach(shell => shell.querySelector('.skiper-sticky-card')?.style.setProperty('--stack-scale', '1'));
      return;
    }
    const rect = work.getBoundingClientRect();
    const scrollable = Math.max(1, work.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / scrollable);
    shells.forEach((shell, i) => {
      const card = shell.querySelector('.skiper-sticky-card');
      if (!card) return;
      const start = i / Math.max(1, shells.length + .25);
      const local = clamp((p - start) / Math.max(.001, 1 - start));
      const target = Number(card.style.getPropertyValue('--stack-target')) || 1;
      const scale = 1 + (target - 1) * local;
      card.style.setProperty('--stack-scale', scale.toFixed(4));
    });
  };

  let stackRaf = 0;
  const requestStack = () => {
    if (stackRaf) return;
    stackRaf = requestAnimationFrame(() => { stackRaf = 0; updateStack(); });
  };
  if (work) {
    window.addEventListener('scroll', requestStack, { passive: true });
    window.addEventListener('resize', requestStack);
    stackMotion.addEventListener('change', requestStack);
    updateStack();
  }

  const gallery = document.querySelector('[data-hover-expand]');
  if (!gallery) return;
  const cards = [...gallery.querySelectorAll('.writing-expand-card')];
  let active = Math.min(1, Math.max(0, cards.length - 1));

  const setActive = index => {
    if (!cards[index] || cards[index].classList.contains('is-filtered-out')) return;
    active = index;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
  };

  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => setActive(i));
    card.addEventListener('focus', () => setActive(i));
    card.addEventListener('click', () => setActive(i));
  });
  gallery.addEventListener('mouseleave', () => {
    const visible = cards.findIndex(card => !card.classList.contains('is-filtered-out'));
    setActive(visible >= 0 ? visible : 0);
  });

  const filter = document.querySelector('.writing-filter');
  if (filter) {
    filter.addEventListener('click', () => requestAnimationFrame(() => {
      const current = cards.findIndex(card => card.classList.contains('is-active') && !card.classList.contains('is-filtered-out'));
      if (current >= 0) return;
      const first = cards.findIndex(card => !card.classList.contains('is-filtered-out'));
      setActive(first >= 0 ? first : 0);
    }));
  }
  setActive(active);
})();

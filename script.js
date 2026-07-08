// ===== Preloader =====
const preloader = document.getElementById('preloader');
const preloaderText = document.getElementById('preloaderText');
const preloaderMessages = [
  'loading modules...',
  'initializing security protocols...',
  'ready.'
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const alreadyVisited = sessionStorage.getItem('visited');

(async function runPreloader() {
  // Skip the intro on repeat visits (this session) or if the user prefers reduced motion.
  if (alreadyVisited || prefersReducedMotion) {
    preloader.classList.add('done');
    document.body.style.overflow = '';
    initAll();
    return;
  }
  sessionStorage.setItem('visited', '1');
  document.body.style.overflow = 'hidden';
  for (const msg of preloaderMessages) {
    preloaderText.textContent = '';
    for (let i = 0; i < msg.length; i++) {
      preloaderText.textContent += msg[i];
      await sleep(25);
    }
    await sleep(400);
  }
  await sleep(300);
  preloader.classList.add('done');
  document.body.style.overflow = '';
  initAll();
})();

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ===== Init everything after preloader =====
function initAll() {
  initTerminalTyping();
  initScrollProgress();
  initNavToggle();
  initNavActive();
  initProjectFilter();
  initScrollReveal();
  initNavbarShrink();
  initTiltCards();
  initCountUp();

  // Decorative motion — skip when the user prefers reduced motion.
  if (!prefersReducedMotion) {
    initCursorGlow();
    initGlitch();
    initParallax();
    initParticles();
  }
}

// ===== Terminal Typing =====
async function initTerminalTyping() {
  const terminal = document.getElementById('heroTerminal');
  if (!terminal) return;

  const lines = [
    { type: 'cmd', prompt: '~$', text: 'whoami' },
    { type: 'output', text: 'developer + pentester + arch_user_btw' },
    { type: 'cmd', prompt: '~$', text: 'cat certs.txt' },
    { type: 'output', text: 'eJPT // en progreso' },
    { type: 'cursor', prompt: '~$' }
  ];

  for (const line of lines) {
    const div = document.createElement('div');
    div.className = 'terminal-line';

    if (line.type === 'cmd') {
      div.innerHTML = `<span class="t-prompt">${line.prompt}</span><span class="t-cmd"></span>`;
      terminal.appendChild(div);
      const cmdSpan = div.querySelector('.t-cmd');
      for (let i = 0; i < line.text.length; i++) {
        cmdSpan.textContent += line.text[i];
        await sleep(40 + Math.random() * 30);
      }
      await sleep(200);
    } else if (line.type === 'output') {
      div.innerHTML = `<span class="t-output">${line.text}</span>`;
      div.style.opacity = '0';
      terminal.appendChild(div);
      await sleep(50);
      div.style.transition = 'opacity 0.3s';
      div.style.opacity = '1';
      await sleep(300);
    } else if (line.type === 'cursor') {
      div.innerHTML = `<span class="t-prompt">${line.prompt}</span><span class="t-cursor"></span>`;
      terminal.appendChild(div);
    }
  }
}

// ===== Scroll Progress Bar =====
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  });
}

// ===== Cursor Glow =====
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== Mobile Nav =====
function initNavToggle() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// ===== Active Nav Link =====
function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

// ===== Navbar shrink =====
function initNavbarShrink() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== Project Filter =====
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card, i) => {
        if (filter === 'todos' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = `stagger-in 0.4s ease ${i * 0.08}s forwards`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ===== Scroll Reveal =====
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(section => observer.observe(section));
}

// ===== Glitch Effect =====
function initGlitch() {
  const glitchElements = document.querySelectorAll('.glitch');

  function triggerGlitch() {
    glitchElements.forEach(el => {
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), 300);
    });
  }

  // Random glitch every 4-8 seconds
  function scheduleGlitch() {
    const delay = 4000 + Math.random() * 4000;
    setTimeout(() => {
      triggerGlitch();
      scheduleGlitch();
    }, delay);
  }
  scheduleGlitch();
}

// ===== Parallax on hero portrait =====
function initParallax() {
  const portrait = document.querySelector('.hero-portrait img');
  if (!portrait) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const speed = 0.3;
    portrait.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

// ===== 3D Tilt on project cards =====
function initTiltCards() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ===== Count Up Animation =====
function initCountUp() {
  const stats = document.querySelectorAll('.stat-num[data-count]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        if (target === 0) return; // Skip if placeholder
        animateCount(el, 0, target, 1500);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current + '+';

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Floating Particles =====
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const colors = ['#E91E8C', '#FF6633', '#0abdc6', '#711c91'];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = (60 + Math.random() * 40) + '%';
    particle.style.width = (1 + Math.random() * 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDuration = (8 + Math.random() * 12) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    hero.appendChild(particle);
  }
}

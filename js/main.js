const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.hero-dot')];
const heroContent = document.querySelector('.hero-content');
let currentSlide = 0;
let slideTimer;

function replayHeroText() {
  if (!heroContent) return;
  heroContent.classList.remove('is-animated');
  void heroContent.offsetWidth;
  heroContent.classList.add('is-animated');
}

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  replayHeroText();
}

function startSlider() {
  clearInterval(slideTimer);
  if (slides.length > 1) slideTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
}

dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); startSlider(); }));
showSlide(0);
startSlider();

const header = document.querySelector('.header');
const topBtn = document.querySelector('.top-btn');
const progressBar = document.querySelector('.scroll-progress');

function handleScroll() {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 30);
  topBtn?.classList.toggle('show', y > 350);
  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
function closeMenu() {
  menuToggle?.classList.remove('is-open');
  mobileMenu?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  mobileMenu?.setAttribute('aria-hidden', 'true');
}
menuToggle?.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('is-open');
  menuToggle.classList.toggle('is-open', open);
  mobileMenu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 1100) closeMenu(); });

// Brand Story Video Modal
const openVideoBtn = document.querySelector('#openVideo');
const videoModal = document.querySelector('#videoModal');
const brandVideo = document.querySelector('#brandVideo');
const videoCloseBtn = videoModal?.querySelector('.video-close');

function openVideoModal() {
  if (!videoModal || !brandVideo) return;
  videoModal.classList.add('is-open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  videoCloseBtn?.focus();
  brandVideo.currentTime = 0;
  brandVideo.play().catch(() => {});
}

function closeVideoModal() {
  if (!videoModal || !brandVideo) return;
  videoModal.classList.remove('is-open');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  brandVideo.pause();
  openVideoBtn?.focus();
}

openVideoBtn?.addEventListener('click', openVideoModal);
videoModal?.querySelectorAll('[data-video-close]').forEach(element => {
  element.addEventListener('click', closeVideoModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && videoModal?.classList.contains('is-open')) {
    closeVideoModal();
  }
});

// Product cards -> detail page
const productCards = document.querySelectorAll('.product-card[data-product]');
productCards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');
  const openProduct = () => {
    const productId = card.dataset.product;
    window.location.href = `./product.html?id=${encodeURIComponent(productId)}`;
  };
  card.addEventListener('click', openProduct);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProduct();
    }
  });
});











// Hero copy: elegant entrance on both the first and second video scenes.
(() => {
  const video = document.querySelector(".hero-video");
  const content = document.querySelector(".hero-content");
  if (!video || !content) return;

  const SECOND_SCENE_AT = 5.55;
  let secondPlayed = false;
  let previousTime = 0;

  const replay = () => {
    content.classList.remove("is-animated");
    void content.offsetWidth;
    content.classList.add("is-animated");
  };

  const resetLoop = () => {
    secondPlayed = false;
    content.classList.remove("is-animated");
    window.setTimeout(replay, 180);
  };

  // First scene
  if (video.readyState >= 1) {
    window.setTimeout(replay, 180);
  } else {
    video.addEventListener("loadedmetadata", () => window.setTimeout(replay, 180), { once: true });
  }

  video.addEventListener("timeupdate", () => {
    const now = video.currentTime;

    // Loop returns to scene one.
    if (previousTime > 1 && now < 0.45) {
      resetLoop();
    }

    // At the second scene, briefly clear then replay the copy.
    if (!secondPlayed && now >= SECOND_SCENE_AT) {
      secondPlayed = true;
      content.classList.remove("is-animated");
      window.setTimeout(replay, 170);
    }

    previousTime = now;
  });
})();


// BEST PRODUCT: soft makeup-powder particles that react to the pointer.
(() => {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card, cardIndex) => {
    const wrap = card.querySelector(".product-image-wrap");
    if (!wrap) return;

    let lastBurst = 0;

    const burst = (x, y, amount = 8) => {
      const now = performance.now();
      if (now - lastBurst < 90) return;
      lastBurst = now;

      for (let i = 0; i < amount; i += 1) {
        const dot = document.createElement("i");
        dot.className = "makeup-particle";
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.setProperty("--dx", `${(Math.random() - 0.5) * 110}px`);
        dot.style.setProperty("--dy", `${-25 - Math.random() * 85}px`);
        dot.style.setProperty("--size", `${3 + Math.random() * 8}px`);
        dot.style.setProperty("--delay", `${Math.random() * 0.08}s`);
        dot.dataset.tone = String(cardIndex % 3);
        wrap.appendChild(dot);
        dot.addEventListener("animationend", () => dot.remove(), { once: true });
      }
    };

    card.addEventListener("mouseenter", (e) => {
      const r = wrap.getBoundingClientRect();
      burst(r.width * 0.5, r.height * 0.62, 14);
    });

    card.addEventListener("mousemove", (e) => {
      const r = wrap.getBoundingClientRect();
      burst(e.clientX - r.left, e.clientY - r.top, 3);
      wrap.style.setProperty("--mx", `${e.clientX - r.left}px`);
      wrap.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
})();

// SPRING MAKEUP: editorial light softly follows the mouse.
(() => {
  const section = document.querySelector(".collection");
  if (!section) return;

  section.addEventListener("mousemove", (e) => {
    const r = section.getBoundingClientRect();
    section.style.setProperty("--light-x", `${e.clientX - r.left}px`);
    section.style.setProperty("--light-y", `${e.clientY - r.top}px`);
  });

  section.addEventListener("mouseleave", () => {
    section.style.removeProperty("--light-x");
    section.style.removeProperty("--light-y");
  });
})();

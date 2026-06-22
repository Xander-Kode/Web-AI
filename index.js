const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
  });
}

if (closeMenu && mobileMenu) {
  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});

const revealElements = document.querySelectorAll('.reveal-on-scroll');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((el) => observer.observe(el));



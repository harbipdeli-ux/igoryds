// ---------- Header scroll state ----------
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Hero terminal typewriter ----------
const terminalLines = [
  { el: document.getElementById('tLine1'), text: 'OYUNCU: igorYDS' },
  { el: document.getElementById('tLine2'), text: 'PLATFORM: KICK // TIKTOK' },
  { el: document.getElementById('tLine3'), text: 'OYUNLAR: GTA, MINECRAFT, CS2' },
  { el: document.getElementById('tLine4'), text: 'DURUM: YAYINA HAZIR ✓' },
];

function typeLine(index) {
  if (index >= terminalLines.length) return;
  const { el, text } = terminalLines[index];
  if (!el) return;
  let i = 0;
  const interval = setInterval(() => {
    el.textContent = text.slice(0, i + 1);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => typeLine(index + 1), 250);
    }
  }, 35);
}
typeLine(0);

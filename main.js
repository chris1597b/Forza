/* ══════════════════════════════════════════
   GRUPO FORZA — Minimal Edition JS
══════════════════════════════════════════ */

// ── Custom cursor ───────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
; (function cursorLoop() {
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(cursorLoop);
})();

// ── Scroll progress ─────────────────────────
const spb = document.getElementById('spb');
window.addEventListener('scroll', () => {
  const t = document.documentElement.scrollHeight - window.innerHeight;
  spb.style.width = (window.scrollY / t * 100) + '%';
}, { passive: true });

// ── Header ──────────────────────────────────
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

// ── Hamburger ───────────────────────────────
const burger = document.getElementById('burger');
const mnav = document.getElementById('mnav');
burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mnav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  mnav.classList.remove('open');
  document.body.style.overflow = '';
}));

// ── Clip reveal (hero) ──────────────────────
function initClips() {
  const delays = { ey1: 300, ht1: 500, ht2: 650, ht3: 800, ht4: 950 };
  Object.entries(delays).forEach(([id, ms]) => {
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.classList.add('up'), ms);
  });
}
window.addEventListener('load', initClips);

// ── Intersection reveal ─────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

// ── Count-up ────────────────────────────────
function countUp(el, target, dur = 1600) {
  const start = performance.now();
  const upd = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target);
    if (p < 1) requestAnimationFrame(upd);
    else el.textContent = target;
  };
  requestAnimationFrame(upd);
}
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(el => {
      countUp(el, +el.dataset.count);
    });
    cio.unobserve(e.target);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stats-bar, .nums-grid').forEach(s => cio.observe(s));

// ── Process step lights ─────────────────────
const procIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.proc-step').forEach((s, i) => {
      setTimeout(() => s.classList.add('lit'), i * 220);
    });
    procIO.disconnect();
  });
}, { threshold: 0.3 });
const pg = document.getElementById('proc-grid');
if (pg) procIO.observe(pg);

// ── Project filter ──────────────────────────
document.querySelectorAll('.flt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flt').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.filter;
    document.querySelectorAll('.pj-card').forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
    });
  });
});

// ── Testimonial carousel ────────────────────
let ti = 0;
const tt = document.getElementById('tst-track');
const tdots = document.querySelectorAll('.tst-dot');
const tcards = document.querySelectorAll('.tst-card');
let ap;
function goT(n) {
  ti = (n + tcards.length) % tcards.length;
  tt.style.transform = `translateX(-${ti * 100}%)`;
  tdots.forEach((d, i) => d.classList.toggle('on', i === ti));
}
document.getElementById('tst-prev').addEventListener('click', () => { goT(ti - 1); reset(); });
document.getElementById('tst-next').addEventListener('click', () => { goT(ti + 1); reset(); });
tdots.forEach(d => d.addEventListener('click', () => { goT(+d.dataset.i); reset(); }));
function reset() { clearInterval(ap); ap = setInterval(() => goT(ti + 1), 5500); }
ap = setInterval(() => goT(ti + 1), 5500);

// ── FAQ ─────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(q => {
  const handler = () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };
  q.addEventListener('click', handler);
  q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
});

// ── Contact form ────────────────────────────
const ctForm = document.getElementById('ct-form');
const ctSuccess = document.getElementById('cf-success');
function vf(el) {
  const ok = el.tagName === 'SELECT' ? el.value !== '' : el.value.trim() !== '';
  el.style.borderBottomColor = ok ? '' : 'var(--orange)';
  return ok;
}
ctForm.addEventListener('submit', e => {
  e.preventDefault();
  const nom = document.getElementById('cf-nom');
  const tel = document.getElementById('cf-tel');
  const proy = document.getElementById('cf-proy');
  const msg = document.getElementById('cf-msg');
  const ok = vf(nom) & vf(tel) & vf(proy);
  if (!ok) return;
  const text = `Hola, soy ${nom.value}. Mi teléfono es ${tel.value}. Proyecto: ${proy.value}. ${msg.value}`;
  ctForm.style.display = 'none';
  ctSuccess.classList.add('show');
  setTimeout(() => window.open(`https://wa.me/51972777696?text=${encodeURIComponent(text)}`, '_blank'), 800);
});

// ── Project Modal ───────────────────────────
document.querySelectorAll('.pj-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const modalId = card.getAttribute('data-modal-id');
    const modal = new bootstrap.Modal(document.getElementById(`projectModal-${modalId}`));
    modal.show();
  });
});

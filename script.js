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

// =====================================================
// FIREBASE (liderlik tablosu için) — kendi bilgilerinle değiştir
// README.md içindeki "Liderlik tablosunu aktif etme" bölümüne bak
// =====================================================
const firebaseConfig = {
  apiKey: "BURAYA_KENDI_APIKEY_DEGERINI_YAPISTIR",
  authDomain: "BURAYA_YAPISTIR",
  databaseURL: "BURAYA_YAPISTIR",
  projectId: "BURAYA_YAPISTIR",
  storageBucket: "BURAYA_YAPISTIR",
  messagingSenderId: "BURAYA_YAPISTIR",
  appId: "BURAYA_YAPISTIR"
};

let dbRef = null;
try {
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("BURAYA")) {
    firebase.initializeApp(firebaseConfig);
    dbRef = firebase.database().ref('leaderboard');
  }
} catch (e) {
  console.warn('Firebase başlatılamadı:', e);
}

function renderLeaderboard(entries) {
  const list = document.getElementById('leaderboardList');
  if (!entries || entries.length === 0) {
    list.innerHTML = '<li class="leaderboard-empty">Henüz kimse skor kaydetmemiş, ilk sen ol!</li>';
    return;
  }
  list.innerHTML = entries
    .map((e, i) => `<li><span>#${i + 1} ${escapeHtml(e.name)}</span><span>${e.score}</span></li>`)
    .join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

if (dbRef) {
  dbRef.orderByChild('score').limitToLast(10).on('value', (snapshot) => {
    const entries = [];
    snapshot.forEach((child) => entries.push(child.val()));
    entries.sort((a, b) => b.score - a.score);
    renderLeaderboard(entries);
  });
} else {
  renderLeaderboard([]);
  document.getElementById('leaderboardList').innerHTML =
    '<li class="leaderboard-empty">Liderlik tablosu henüz ayarlanmadı.</li>';
}

function saveScore(name, score) {
  if (!dbRef) {
    document.getElementById('scoreSaveNote').textContent =
      'Liderlik tablosu henüz aktif değil (Firebase kurulmamış).';
    return;
  }
  dbRef.push({ name: name.slice(0, 16), score, ts: Date.now() });
  document.getElementById('scoreSaveNote').textContent = 'Skorun kaydedildi! 🎉';
}

// =====================================================
// SNAKE OYUNU
// =====================================================
(function initSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const cellCount = 20;
  const cellSize = canvas.width / cellCount;
  const overlay = document.getElementById('snakeOverlay');
  const overlayText = document.getElementById('snakeOverlayText');
  const restartBtn = document.getElementById('snakeRestartBtn');
  const scoreEl = document.getElementById('snakeScore');
  const saveForm = document.getElementById('scoreSaveForm');
  const nameInput = document.getElementById('scoreNameInput');

  let snake, dir, nextDir, food, score, loop, running;

  function reset() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    scoreEl.textContent = '0';
    placeFood();
    running = false;
    overlay.style.display = 'flex';
    overlayText.textContent = 'Başlamak için bir yön tuşuna bas';
    restartBtn.style.display = 'none';
    saveForm.style.display = 'none';
    document.getElementById('scoreSaveNote').textContent = '';
    draw();
  }

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * cellCount),
        y: Math.floor(Math.random() * cellCount)
      };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#53FC18';
    snake.forEach((s, i) => {
      ctx.globalAlpha = i === 0 ? 1 : 0.75;
      ctx.fillRect(s.x * cellSize + 1, s.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FE2C55';
    ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
  }

  function tick() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (
      head.x < 0 || head.x >= cellCount ||
      head.y < 0 || head.y >= cellCount ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      gameOver();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function gameOver() {
    running = false;
    clearInterval(loop);
    overlay.style.display = 'flex';
    overlayText.textContent = `Oyun bitti! Skorun: ${score}`;
    restartBtn.style.display = 'inline-flex';
    if (score > 0) saveForm.style.display = 'flex';
  }

  function start() {
    if (running) return;
    running = true;
    overlay.style.display = 'none';
    loop = setInterval(tick, 120);
  }

  const keyMap = {
    ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
  };

  window.addEventListener('keydown', (e) => {
    const newDir = keyMap[e.key];
    if (!newDir) return;
    e.preventDefault();
    if (newDir.x === -dir.x && newDir.y === -dir.y) return; // ters yöne dönemez
    nextDir = newDir;
    start();
  });

  restartBtn.addEventListener('click', reset);

  saveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;
    saveScore(name, score);
    saveForm.style.display = 'none';
  });

  reset();
})();

// =====================================================
// QUIZ: Hangi Oyunda Kaç Puan Alırsın?
// =====================================================
(function initQuiz() {
  const questions = [
    {
      q: 'Bir yayında en çok hangi anı seversin?',
      options: [
        { text: 'Yüksek hızlı takip kovalamacası', points: { gta: 3, cs: 1, mc: 0 } },
        { text: 'Sakin sakin bir şeyler inşa etmek', points: { gta: 0, cs: 0, mc: 3 } },
        { text: 'Son ana kadar giden gergin bir round', points: { gta: 0, cs: 3, mc: 0 } },
      ]
    },
    {
      q: 'Arkadaşlarınla oynarken tarzın nasıldır?',
      options: [
        { text: 'Kaos çıkarırım, plan falan yok', points: { gta: 3, cs: 0, mc: 1 } },
        { text: 'Taktik kurar, sessizce ilerlerim', points: { gta: 0, cs: 3, mc: 0 } },
        { text: 'Herkesle beraber büyük bir proje yaparım', points: { gta: 0, cs: 0, mc: 3 } },
      ]
    },
    {
      q: 'Kaybettiğinde tepkin ne olur?',
      options: [
        { text: 'Hemen tekrar denerim, sinirli ama azimliyim', points: { gta: 1, cs: 3, mc: 0 } },
        { text: 'Boş verir, başka bir şey yapmaya başlarım', points: { gta: 2, cs: 0, mc: 2 } },
        { text: 'Neyi yanlış yaptığımı analiz ederim', points: { gta: 0, cs: 3, mc: 1 } },
      ]
    },
    {
      q: 'Sana göre en tatmin edici an hangisi?',
      options: [
        { text: 'Az kalsın kaçırdığım bir kaçış sahnesi', points: { gta: 3, cs: 0, mc: 0 } },
        { text: 'Uzun uğraş sonucu bitirdiğim bir yapı', points: { gta: 0, cs: 0, mc: 3 } },
        { text: 'Kill sayımın rakibimden yüksek olması', points: { gta: 0, cs: 3, mc: 0 } },
      ]
    },
  ];

  const results = {
    gta: { title: '🚔 Tam bir GTA canavarısın!', text: 'Kaos, hız ve sürpriz senin doğal ortamın. igorYDS ile GTA yayınlarında yerin hazır.' },
    cs: { title: '🎯 Counter-Strike\'ta doğmuşsun!', text: 'Soğukkanlı, taktiksel, hedefe kilitli. Round\'ları sen kazanırsın.' },
    mc: { title: '🧱 Minecraft ruhun var!', text: 'Sabır ve yaratıcılık senin süper gücün. Yavaş yavaş harikalar inşa edersin.' },
  };

  const wrap = document.getElementById('quizWrap');
  let current = 0;
  const totals = { gta: 0, cs: 0, mc: 0 };
  const answered = new Array(questions.length).fill(false);

  function renderQuestion() {
    const q = questions[current];
    wrap.innerHTML = `
      <p class="quiz-progress">Soru ${current + 1} / ${questions.length}</p>
      <div class="quiz-question">
        <h4>${q.q}</h4>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `<button type="button" class="quiz-option" data-i="${i}">${opt.text}</button>`).join('')}
        </div>
      </div>
    `;
    wrap.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const opt = q.options[parseInt(btn.dataset.i, 10)];
        totals.gta += opt.points.gta;
        totals.cs += opt.points.cs;
        totals.mc += opt.points.mc;
        current++;
        if (current < questions.length) {
          renderQuestion();
        } else {
          renderResult();
        }
      });
    });
  }

  function renderResult() {
    const winner = Object.keys(totals).reduce((a, b) => (totals[b] > totals[a] ? b : a));
    const r = results[winner];
    wrap.innerHTML = `
      <div class="quiz-result">
        <h4>${r.title}</h4>
        <p>${r.text}</p>
        <button type="button" class="btn btn-tiktok" id="quizRestart" style="margin-top:12px;">Tekrar Çöz</button>
      </div>
    `;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0;
      totals.gta = 0; totals.cs = 0; totals.mc = 0;
      renderQuestion();
    });
  }

  renderQuestion();
})();

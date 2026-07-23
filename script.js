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
// ---------- MİNİ OYUNLAR (Flappy & Pong) ----------
const canvas = document.getElementById('arcadeCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const tabFlappy = document.getElementById('tabFlappy');
  const tabPong = document.getElementById('tabPong');
  const startBtn = document.getElementById('arcadeStartBtn');
  const overlay = document.getElementById('arcadeOverlay');
  const overlayText = document.getElementById('overlayText');
  const scoreEl = document.getElementById('arcadeScore');
  const highScoreEl = document.getElementById('arcadeHighScore');
  const controlsHint = document.getElementById('controlsHint');

  let currentGame = 'flappy'; // 'flappy' veya 'pong'
  let gameLoop = null;
  let isRunning = false;
  let score = 0;

  // Rekorlar
  let highScores = {
    flappy: localStorage.getItem('igor_hs_flappy') || 0,
    pong: localStorage.getItem('igor_hs_pong') || 0
  };

  function updateHighScoreDisplay() {
    highScoreEl.textContent = highScores[currentGame];
  }
  updateHighScoreDisplay();

  // --- FLAPPY YAYINCI DEĞİŞKENLERİ ---
  let bird = { x: 50, y: 200, size: 16, gravity: 0.35, jump: -6.5, velocity: 0 };
  let pipes = [];
  let frameCount = 0;

  // --- PONG DEĞİŞKENLERİ ---
  let paddle = { width: 80, height: 12, x: 160, y: 460, speed: 6 };
  let ball = { x: 200, y: 200, size: 8, dx: 3, dy: -3 };

  // --- SEKMELER ARASI GEÇİŞ ---
  tabFlappy.addEventListener('click', () => {
    if (currentGame === 'flappy') return;
    currentGame = 'flappy';
    tabFlappy.classList.add('active');
    tabPong.classList.remove('active');
    controlsHint.textContent = 'Kontrol: Tıkla, Dokun veya Space (Boşluk) Tuşuna Bas';
    resetGame();
  });

  tabPong.addEventListener('click', () => {
    if (currentGame === 'pong') return;
    currentGame = 'pong';
    tabPong.classList.add('active');
    tabFlappy.classList.remove('active');
    controlsHint.textContent = 'Kontrol: Farenizi / Parmağınızı Sağa-Sola Kaydırın';
    resetGame();
  });

  function resetGame() {
    stopGame();
    score = 0;
    scoreEl.textContent = score;
    updateHighScoreDisplay();
    overlayText.textContent = 'Oyuna Başlamak İçin Butona Bas';
    overlay.style.display = 'flex';
    drawInitialState();
  }

  function stopGame() {
    isRunning = false;
    cancelAnimationFrame(gameLoop);
  }

  // --- OYUN DÖNGÜSÜ ---
  function startCurrentGame() {
    stopGame();
    score = 0;
    scoreEl.textContent = score;
    overlay.style.display = 'none';
    isRunning = true;

    if (currentGame === 'flappy') {
      bird.y = 200;
      bird.velocity = 0;
      pipes = [];
      frameCount = 0;
      runFlappy();
    } else {
      paddle.x = (canvas.width - paddle.width) / 2;
      ball.x = 200;
      ball.y = 200;
      ball.dx = (Math.random() > 0.5 ? 1 : -1) * 3;
      ball.dy = -3.5;
      runPong();
    }
  }

  startBtn.addEventListener('click', startCurrentGame);

  // ================= FLAPPY MANTIĞI =================
  function runFlappy() {
    if (!isRunning) return;

    // Güncelleme
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    frameCount++;
    if (frameCount % 90 === 0) {
      let gap = 120;
      let minPipe = 40;
      let maxPipe = canvas.height - gap - minPipe - 50;
      let topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
      pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap, passed: false });
    }

    // Ekranı Çiz
    ctx.fillStyle = '#0D0F12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Boruları Çiz & Çarpışma
    ctx.fillStyle = '#53FC18'; // Kick Yeşili
    for (let i = pipes.length - 1; i >= 0; i--) {
      let p = pipes[i];
      p.x -= 2;

      // Üst ve Alt Boru
      ctx.fillRect(p.x, 0, 48, p.top);
      ctx.fillRect(p.x, p.bottom, 48, canvas.height - p.bottom);

      // Çarpışma Testi
      if (
        bird.x + bird.size > p.x &&
        bird.x - bird.size < p.x + 48 &&
        (bird.y - bird.size < p.top || bird.y + bird.size > p.bottom)
      ) {
        gameOver();
        return;
      }

      // Skor Artışı
      if (!p.passed && p.x + 48 < bird.x) {
        p.passed = true;
        score++;
        scoreEl.textContent = score;
        checkHighScore();
      }

      if (p.x < -50) pipes.splice(i, 1);
    }

    // Taban / Tavan Çarpışması
    if (bird.y + bird.size >= canvas.height || bird.y - bird.size <= 0) {
      gameOver();
      return;
    }

    // Kuşu Çiz (TikTok Pembesi Top)
    ctx.fillStyle = '#FE2C55';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();

    gameLoop = requestAnimationFrame(runFlappy);
  }

  function flap() {
    if (currentGame === 'flappy' && isRunning) {
      bird.velocity = bird.jump;
    }
  }

  // ================= PONG MANTIĞI =================
  function runPong() {
    if (!isRunning) return;

    // Top Hareketi
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Yan Duvarlar
    if (ball.x - ball.size <= 0 || ball.x + ball.size >= canvas.width) {
      ball.dx *= -1;
    }

    // Tavan
    if (ball.y - ball.size <= 0) {
      ball.dy *= -1;
    }

    // Raket Çarpışması
    if (
      ball.y + ball.size >= paddle.y &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width &&
      ball.dy > 0
    ) {
      ball.dy = -(Math.abs(ball.dy) + 0.15); // Her çarpmada azıcık hızlanır
      score++;
      scoreEl.textContent = score;
      checkHighScore();
    }

    // Taban (Yanma)
    if (ball.y - ball.size > canvas.height) {
      gameOver();
      return;
    }

    // Çizim
    ctx.fillStyle = '#0D0F12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Raket (Kick Yeşili)
    ctx.fillStyle = '#53FC18';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Top (TikTok Cyan)
    ctx.fillStyle = '#25F4EE';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();

    gameLoop = requestAnimationFrame(runPong);
  }

  // --- ORTAK FONKSİYONLAR ---
  function checkHighScore() {
    if (score > highScores[currentGame]) {
      highScores[currentGame] = score;
      highScoreEl.textContent = score;
      localStorage.setItem(`igor_hs_${currentGame}`, score);
    }
  }

  function gameOver() {
    stopGame();
    overlayText.textContent = `Oyun Bitti! Skorun: ${score}`;
    overlay.style.display = 'flex';
  }

  function drawInitialState() {
    ctx.fillStyle = '#0D0F12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawInitialState();

  // --- KONTROLLER (GİRDİLER) ---
  // Klavyeden Space
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      if (currentGame === 'flappy') {
        e.preventDefault();
        flap();
      }
    }
  });

  // Canvas Tıklama / Dokunma (Flappy için Zıplama)
  canvas.addEventListener('pointerdown', e => {
    if (currentGame === 'flappy') {
      flap();
    }
  });

  // Fare / Dokunma Hareketi (Pong Raketi için)
  canvas.addEventListener('pointermove', e => {
    if (currentGame === 'pong' && isRunning) {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseX = e.clientX - rect.left - root.scrollLeft;
      // Raketi hizada tut
      paddle.x = mouseX - paddle.width / 2;
      // Sınırlar dışına çıkmasın
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
  });
}

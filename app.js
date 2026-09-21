// === ตั้งค่า ===
const CONFIG = {
  password: "thai2026",
  maxAttempts: 5,
  lockoutMinutes: 10,
  matchDuration: 90,
  tickPerMinute: 6
};

const STORAGE_KEY = "football_sim_auth";

// === ข้อมูลทีม ===
const teams = [
  { id: "thailand", name: "ทีมชาติไทย", attack: 78, defense: 72, color: "#2563eb", gkColor: "#fef08a" },
  { id: "japan", name: "ญี่ปุ่น", attack: 85, defense: 80, color: "#ffffff", gkColor: "#f97316" },
  { id: "korea", name: "เกาหลีใต้", attack: 83, defense: 78, color: "#f97316", gkColor: "#1e3a8a" },
  { id: "brazil", name: "บราซิล", attack: 92, defense: 88, color: "#fef08a", gkColor: "#2563eb" },
  { id: "germany", name: "เยอรมนี", attack: 88, defense: 85, color: "#000000", gkColor: "#ef4444" },
  { id: "france", name: "ฝรั่งเศส", attack: 89, defense: 84, color: "#2563eb", gkColor: "#ffffff" }
];

// === สถานะการแข่งขัน ===
let match = {
  teamA: null,
  teamB: null,
  scoreA: 0,
  scoreB: 0,
  minute: 0,
  tick: 0,
  running: false,
  ball: { x: 400, y: 225, vx: 0, vy: 0 },
  playersA: [],
  playersB: [],
  lastEvent: "",
  goalScored: false
};

// === DOM ===
const loginSection = document.getElementById("login-section");
const mainApp = document.getElementById("main-app");
const loginError = document.getElementById("login-error");
const passwordInput = document.getElementById("password-input");
const loginBtn = document.getElementById("login-btn");

const teamASelect = document.getElementById("team-a");
const teamBSelect = document.getElementById("team-b");
const simulateBtn = document.getElementById("simulate-btn");
const resetBtn = document.getElementById("reset-btn");

const nameA = document.getElementById("name-a");
const nameB = document.getElementById("name-b");
const scoreA = document.getElementById("score-a");
const scoreB = document.getElementById("score-b");
const matchMinute = document.getElementById("match-minute");
const eventText = document.getElementById("event-text");

const canvas = document.getElementById("pitch");
const ctx = canvas.getContext("2d");

// === Authentication ===
function getAuthState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : { authenticated: false, attempts: 0, lockedUntil: null };
}

function saveAuthState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isLocked() {
  const state = getAuthState();
  return state.lockedUntil && new Date(state.lockedUntil) > new Date();
}

function showApp() {
  loginSection.style.display = "none";
  mainApp.style.display = "block";
  populateTeamSelects();
}

function showLogin(message = "") {
  loginSection.style.display = "block";
  mainApp.style.display = "none";
  loginError.textContent = message;
}

function handleLogin() {
  const state = getAuthState();

  if (isLocked()) {
    const remaining = Math.ceil((new Date(state.lockedUntil) - new Date()) / 60000);
    loginError.textContent = `⏳ ถูกระงับชั่วคราว — กรุณารอ ${remaining} นาทีแล้วลองใหม่`;
    return;
  }

  const input = passwordInput.value.trim();

  if (input === CONFIG.password) {
    state.authenticated = true;
    state.attempts = 0;
    state.lockedUntil = null;
    saveAuthState(state);
    showApp();
  } else {
    state.attempts += 1;
    if (state.attempts >= CONFIG.maxAttempts) {
      state.lockedUntil = new Date(Date.now() + CONFIG.lockoutMinutes * 60000);
      state.attempts = 0;
      loginError.textContent = `❌ ใส่รหัสผิดเกินกำหนด — รอ ${CONFIG.lockoutMinutes} นาที`;
    } else {
      loginError.textContent = `❌ รหัสผ่านไม่ถูกต้อง — เหลือโอกาสอีก ${CONFIG.maxAttempts - state.attempts} ครั้ง`;
    }
    saveAuthState(state);
  }
}

// === Team Select ===
function populateTeamSelects() {
  [teamASelect, teamBSelect].forEach(select => {
    select.innerHTML = "";
    teams.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      select.appendChild(opt);
    });
  });
}

// === สร้างนักเตะ ===
function createPlayers() {
  match.playersA = [];
  match.playersB = [];

  const positionsA = [
    { x: 80, y: 225 },
    { x: 180, y: 80 },
    { x: 180, y: 160 },
    { x: 180, y: 290 },
    { x: 180, y: 370 },
    { x: 280, y: 120 },
    { x: 280, y: 225 },
    { x: 280, y: 330 },
    { x: 340, y: 160 },
    { x: 340, y: 290 },
    { x: 370, y: 225 }
  ];

  const positionsB = [
    { x: 720, y: 225 },
    { x: 620, y: 80 },
    { x: 620, y: 160 },
    { x: 620, y: 290 },
    { x: 620, y: 370 },
    { x: 520, y: 120 },
    { x: 520, y: 225 },
    { x: 520, y: 330 },
    { x: 460, y: 160 },
    { x: 460, y: 290 },
    { x: 430, y: 225 }
  ];

  positionsA.forEach((pos, i) => {
    match.playersA.push({
      x: pos.x,
      y: pos.y,
      baseX: pos.x,
      baseY: pos.y,
      team: "A",
      isGK: i === 0
    });
  });

  positionsB.forEach((pos, i) => {
    match.playersB.push({
      x: pos.x,
      y: pos.y,
      baseX: pos.x,
      baseY: pos.y,
      team: "B",
      isGK: i === 0
    });
  });
}

// === วาดสนาม ===
function drawPitch() {
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  // เส้นขอบสนาม
  ctx.strokeRect(10, 10, 780, 430);

  // เส้นกลาง
  ctx.beginPath();
  ctx.moveTo(400, 10);
  ctx.lineTo(400, 440);
  ctx.stroke();

  // วงกลมกลาง
  ctx.beginPath();
  ctx.arc(400, 225, 70, 0, Math.PI * 2);
  ctx.stroke();

  // จุดโทษ
  ctx.beginPath();
  ctx.arc(130, 225, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(670, 225, 3, 0, Math.PI * 2);
  ctx.fill();

  // เขตโทษ
  ctx.strokeRect(10, 130, 130, 190);
  ctx.strokeRect(660, 130, 130, 190);

  // เขตประตู
  ctx.strokeRect(10, 180, 60, 90);
  ctx.strokeRect(730, 180, 60, 90);

  // ประตู
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(0, 190, 15, 70);
  ctx.fillRect(785, 190, 15, 70);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 190, 15, 70);
  ctx.strokeRect(785, 190, 15, 70);
}

// === วาดนักเตะ ===
function drawPlayers() {
  const teamA = teams.find(t => t.id === match.teamA);
  const teamB = teams.find(t => t.id === match.teamB);

  function drawPlayer(player, teamColor, gkColor) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = player.isGK ? gkColor : teamColor;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // หัว
    ctx.beginPath();
    ctx.arc(player.x, player.y - 14, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fcd34d";
    ctx.fill();
  }

  match.playersA.forEach(p => drawPlayer(p, teamA.color, teamA.gkColor));
  match.playersB.forEach(p => drawPlayer(p, teamB.color, teamB.gkColor));
}

// === วาดลูกบอล ===
function drawBall() {
  ctx.beginPath();
  ctx.arc(match.ball.x, match.ball.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// === เคลื่อนไหวนักเตะ ===
function updatePlayers() {
  const allPlayers = [...match.playersA, ...match.playersB];

  allPlayers.forEach(player => {
    const dx = match.ball.x - player.x;
    const dy = match.ball.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 250 && Math.random() > 0.35) {
      const speed = player.isGK ? 1.5 : 2.5;
      player.x += (dx / dist) * speed;
      player.y += (dy / dist) * speed;
    } else {
      if (Math.random() > 0.85) {
        player.x += (Math.random() - 0.5) * 2;
        player.y += (Math.random() - 0.5) * 2;
      }
    }

    player.x = Math.max(20, Math.min(780, player.x));
    player.y = Math.max(20, Math.min(430, player.y));
  });
}

// === เคลื่อนไหวลูกบอล ===
function updateBall() {
  match.ball.x += match.ball.vx;
  match.ball.y += match.ball.vy;

  match.ball.vx *= 0.98;
  match.ball.vy *= 0.98;

  if (match.ball.x < 15 || match.ball.x > 785) {
    match.ball.vx *= -0.6;
    match.ball.x = Math.max(15, Math.min(785, match.ball.x));
  }

  if (match.ball.y < 15 || match.ball.y > 435) {
    match.ball.vy *= -0.6;
    match.ball.y = Math.max(15, Math.min(435, match.ball.y));
  }

  const allPlayers = [...match.playersA, ...match.playersB];

  allPlayers.forEach(player => {
    const dx = match.ball.x - player.x;
    const dy = match.ball.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 17) {
      const power = player.isGK ? 3 : 5 + Math.random() * 3;
      match.ball.vx = (dx / dist) * power;
      match.ball.vy = (dy / dist) * power + (Math.random() - 0.5) * 2;
    }
  });
}

// === ตรวจสอบประตู ===
function checkGoal() {
  if (match.ball.x < 18 && match.ball.y > 190 && match.ball.y < 260) {
    if (!match.goalScored) {
      match.scoreB += 1;
      match.goalScored = true;
      const teamB = teams.find(t => t.id === match.teamB);
      eventText.innerHTML = `🎉 <strong>GOAL!</strong> ${teamB.name} ทำประตูได้ในนาทีที่ ${match.minute}`;
      scoreB.textContent = match.scoreB;
    }
    return true;
  }

  if (match.ball.x > 782 && match.ball.y > 190 && match.ball.y < 260) {
    if (!match.goalScored) {
      match.scoreA += 1;
      match.goalScored = true;
      const teamA = teams.find(t => t.id === match.teamA);
      eventText.innerHTML = `🎉 <strong>GOAL!</strong> ${teamA.name} ทำประตูได้ในนาทีที่ ${match.minute}`;
      scoreA.textContent = match.scoreA;
    }
    return true;
  }

  return false;
}

// === เหตุการณ์การแข่งขัน ===
function updateEvent() {
  const rand = Math.random();

  if (rand < 0.08) {
    eventText.textContent = "ลูกทีมกำลังส่งบอลขึ้นหน้า...";
  } else if (rand < 0.15) {
    eventText.textContent = "นักเตะแย่งบอลกันกลางสนาม";
  } else if (rand < 0.22) {
    eventText.textContent = "บอลเข้าสู่เขตโทษ กำลังยิง!";
  } else if (rand < 0.28) {
    eventText.textContent = "ผู้รักษาประตูบินเซฟบอล!";
  } else if (rand < 0.34) {
    eventText.textContent = "บอลออกข้างสนาม";
  } else if (rand < 0.40) {
    eventText.textContent = "กำลังเปิดบอลจากมุมสนาม";
  } else if (rand < 0.46) {
    eventText.textContent = "นักเตะสไลด์ตัดบอล";
  } else {
    eventText.textContent = "การแข่งขันดำเนินไป...";
  }
}

// === Game Loop ===
function gameLoop() {
  if (!match.running) return;

  match.tick++;

  if (match.tick % CONFIG.tickPerMinute === 0) {
    match.minute++;
    matchMinute.textContent = match.minute;
    updateEvent();

    if (match.minute >= CONFIG.matchDuration) {
      match.running = false;
      eventText.innerHTML = `🏁 การแข่งขันจบลง! ${nameA.textContent} ${match.scoreA} - ${match.scoreB} ${nameB.textContent}`;
      return;
    }
  }

  updatePlayers();
  updateBall();

  if (!checkGoal()) {
    match.goalScored = false;
  }

  drawPitch();
  drawPlayers();
  drawBall();

  requestAnimationFrame(gameLoop);
}

// === เริ่มการแข่งขัน ===
function startMatch() {
  match.teamA = teamASelect.value;
  match.teamB = teamBSelect.value;

  if (match.teamA === match.teamB) {
    alert("กรุณาเลือกทีมที่แตกต่างกัน");
    return;
  }

  const teamA = teams.find(t => t.id === match.teamA);
  const teamB = teams.find(t => t.id === match.teamB);

  nameA.textContent = teamA.name;
  nameB.textContent = teamB.name;
  scoreA.textContent = 0;
  scoreB.textContent = 0;
  matchMinute.textContent = 0;

  match.scoreA = 0;
  match.scoreB = 0;
  match.minute = 0;
  match.tick = 0;
  match.running = true;
  match.ball = { x: 400, y: 225, vx: 0, vy: 0 };
  match.goalScored = false;

  createPlayers();

  eventText.textContent = "⚽ เริ่มการแข่งขัน!";

  gameLoop();
}

// === รีเซ็ต ===
function resetMatch() {
  match.running = false;

  teamASelect.value = teams[0].id;
  teamBSelect.value = teams[1].id;

  nameA.textContent = "-";
  nameB.textContent = "-";
  scoreA.textContent = 0;
  scoreB.textContent = 0;
  matchMinute.textContent = 0;
  eventText.textContent = "กดเริ่มการแข่งขันเพื่อเริ่มจำลอง...";

  drawPitch();
}

// === Event Listeners ===
loginBtn.addEventListener("click", handleLogin);
passwordInput.addEventListener("keydown", e => e.key === "Enter" && handleLogin());

simulateBtn.addEventListener("click", startMatch);
resetBtn.addEventListener("click", resetMatch);

window.addEventListener("load", () => {
  const state = getAuthState();
  if (state.authenticated && !isLocked()) {
    showApp();
  } else {
    showLogin();
  }

  drawPitch();
});

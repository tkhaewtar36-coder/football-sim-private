// === ตั้งค่า ===
const CONFIG = {
  password: "thai2026",
  maxAttempts: 5,
  lockoutMinutes: 10,
  matchDuration: 90,
  tickPerMinute: 6
};

const STORAGE_KEY = "football_sim_auth";

// === ข้อมูลนักเตะและทีม ===
const teams = [
  {
    id: "thailand",
    name: "ทีมชาติไทย",
    color: "#2563eb",
    gkColor: "#fef08a",
    players: [
      { pos: "GK", name: "กัมพล ปฐมภูมินทร์", speed: 1.2, pass: 75, shoot: 60, defense: 90 },
      { pos: "RB", name: "นฤบดินทร์ วีรวัฒโนดม", speed: 2.8, pass: 78, shoot: 65, defense: 82 },
      { pos: "CB", name: "ธีราทร บุญมาทัน", speed: 2.5, pass: 82, shoot: 70, defense: 85 },
      { pos: "CB", name: "มานูเอล ทอม เยฟติช", speed: 2.3, pass: 72, shoot: 62, defense: 88 },
      { pos: "LB", name: "สุภโชค สารชาติ", speed: 3.0, pass: 80, shoot: 72, defense: 75 },
      { pos: "CDM", name: "สรรวัชญ์ เดชมิตร", speed: 2.2, pass: 85, shoot: 68, defense: 80 },
      { pos: "CM", name: "ชนาธิป สรงกระสินธ์", speed: 3.2, pass: 90, shoot: 78, defense: 65 },
      { pos: "CAM", name: "สุภณัฏฐ์ เหมือนตา", speed: 3.5, pass: 82, shoot: 80, defense: 55 },
      { pos: "RW", name: "เจนริชาร์ด สุเรศ", speed: 3.8, pass: 78, shoot: 75, defense: 50 },
      { pos: "ST", name: "ศุภชัย ใจเด็ด", speed: 3.0, pass: 72, shoot: 88, defense: 45 },
      { pos: "LW", name: "อิทธิพล ทองสงคราม", speed: 3.3, pass: 80, shoot: 76, defense: 52 }
    ]
  },
  {
    id: "japan",
    name: "ญี่ปุ่น",
    color: "#ffffff",
    gkColor: "#f97316",
    players: [
      { pos: "GK", name: "ซูซากุ นิชิโกะ", speed: 1.3, pass: 80, shoot: 62, defense: 92 },
      { pos: "RB", name: "ฮิโรกิ ซากาอิ", speed: 3.0, pass: 85, shoot: 70, defense: 84 },
      { pos: "CB", name: "มายูกิ โยชิดะ", speed: 2.5, pass: 78, shoot: 68, defense: 90 },
      { pos: "CB", name: "คาโตะ อิทากุระ", speed: 2.7, pass: 75, shoot: 65, defense: 88 },
      { pos: "LB", name: "ยูโตะ นากาโตโมะ", speed: 3.2, pass: 88, shoot: 75, defense: 80 },
      { pos: "CDM", name: "วาตารุ เอ็นโดะ", speed: 2.4, pass: 92, shoot: 72, defense: 85 },
      { pos: "CM", name: "ทาคุมิ มินามิโนะ", speed: 3.4, pass: 90, shoot: 82, defense: 68 },
      { pos: "CAM", name: "เคอิโตะ โทคุนากะ", speed: 3.5, pass: 88, shoot: 80, defense: 60 },
      { pos: "RW", name: "เรย์ ฮัตเตะ", speed: 3.8, pass: 85, shoot: 78, defense: 55 },
      { pos: "ST", name: "ทาคาฟูซะ คูโบะ", speed: 3.6, pass: 82, shoot: 85, defense: 50 },
      { pos: "LW", name: "ยูโตะ เซกิเน่", speed: 3.7, pass: 86, shoot: 80, defense: 58 }
    ]
  },
  {
    id: "brazil",
    name: "บราซิล",
    color: "#fef08a",
    gkColor: "#2563eb",
    players: [
      { pos: "GK", name: "อลิสซง เบกเกอร์", speed: 1.4, pass: 82, shoot: 65, defense: 94 },
      { pos: "RB", name: "ดานีลู ซิลวา", speed: 3.3, pass: 88, shoot: 75, defense: 86 },
      { pos: "CB", name: "มาร์ควินยอส", speed: 2.8, pass: 80, shoot: 70, defense: 92 },
      { pos: "CB", name: "เอเดอร์ มิลิเตา", speed: 2.9, pass: 76, shoot: 68, defense: 90 },
      { pos: "LB", name: "วินิซิอุส จูเนียร์", speed: 4.0, pass: 90, shoot: 85, defense: 65 },
      { pos: "CDM", name: "คาเซมิโร", speed: 2.6, pass: 85, shoot: 78, defense: 92 },
      { pos: "CM", name: "ลูคัส ปาเกต้า", speed: 3.2, pass: 92, shoot: 82, defense: 72 },
      { pos: "CAM", name: "เนย์มาร์ ดา ซิลวา", speed: 3.8, pass: 95, shoot: 90, defense: 55 },
      { pos: "RW", name: "ราฟินญ่า", speed: 4.0, pass: 88, shoot: 85, defense: 60 },
      { pos: "ST", name: "ริชาร์ลิซอน", speed: 3.7, pass: 82, shoot: 92, defense: 58 },
      { pos: "LW", name: "เปโดร โชต้า", speed: 3.6, pass: 86, shoot: 88, defense: 55 }
    ]
  }
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

// === ตำแหน่งพื้นฐานของนักเตะ ===
const basePositionsA = [
  { x: 50, y: 225, role: "GK", minX: 10, maxX: 100, minY: 150, maxY: 300 },
  { x: 140, y: 80, role: "DEF", minX: 100, maxX: 250, minY: 30, maxY: 180 },
  { x: 140, y: 170, role: "DEF", minX: 100, maxX: 250, minY: 120, maxY: 230 },
  { x: 140, y: 280, role: "DEF", minX: 100, maxX: 250, minY: 230, maxY: 340 },
  { x: 140, y: 370, role: "DEF", minX: 100, maxX: 250, minY: 320, maxY: 420 },
  { x: 260, y: 130, role: "MID", minX: 200, maxX: 380, minY: 80, maxY: 220 },
  { x: 260, y: 225, role: "MID", minX: 200, maxX: 380, minY: 160, maxY: 290 },
  { x: 260, y: 320, role: "MID", minX: 200, maxX: 380, minY: 230, maxY: 380 },
  { x: 380, y: 100, role: "FWD", minX: 320, maxX: 480, minY: 50, maxY: 200 },
  { x: 380, y: 225, role: "FWD", minX: 320, maxX: 520, minY: 140, maxY: 310 },
  { x: 380, y: 350, role: "FWD", minX: 320, maxX: 480, minY: 250, maxY: 400 }
];

const basePositionsB = [
  { x: 750, y: 225, role: "GK", minX: 700, maxX: 790, minY: 150, maxY: 300 },
  { x: 660, y: 80, role: "DEF", minX: 550, maxX: 700, minY: 30, maxY: 180 },
  { x: 660, y: 170, role: "DEF", minX: 550, maxX: 700, minY: 120, maxY: 230 },
  { x: 660, y: 280, role: "DEF", minX: 550, maxX: 700, minY: 230, maxY: 340 },
  { x: 660, y: 370, role: "DEF", minX: 550, maxX: 700, minY: 320, maxY: 420 },
  { x: 540, y: 130, role: "MID", minX: 420, maxX: 600, minY: 80, maxY: 220 },
  { x: 540, y: 225, role: "MID", minX: 420, maxX: 600, minY: 160, maxY: 290 },
  { x: 540, y: 320, role: "MID", minX: 420, maxX: 600, minY: 230, maxY: 380 },
  { x: 420, y: 100, role: "FWD", minX: 320, maxX: 480, minY: 50, maxY: 200 },
  { x: 420, y: 225, role: "FWD", minX: 280, maxX: 480, minY: 140, maxY: 310 },
  { x: 420, y: 350, role: "FWD", minX: 320, maxX: 480, minY: 250, maxY: 400 }
];

// === สร้างนักเตะ ===
function createPlayers() {
  const teamAData = teams.find(t => t.id === match.teamA);
  const teamBData = teams.find(t => t.id === match.teamB);

  match.playersA = teamAData.players.map((p, i) => ({
    ...p,
    x: basePositionsA[i].x,
    y: basePositionsA[i].y,
    baseX: basePositionsA[i].x,
    baseY: basePositionsA[i].y,
    role: basePositionsA[i].role,
    minX: basePositionsA[i].minX,
    maxX: basePositionsA[i].maxX,
    minY: basePositionsA[i].minY,
    maxY: basePositionsA[i].maxY,
    team: "A",
    isGK: basePositionsA[i].role === "GK"
  }));

  match.playersB = teamBData.players.map((p, i) => ({
    ...p,
    x: basePositionsB[i].x,
    y: basePositionsB[i].y,
    baseX: basePositionsB[i].x,
    baseY: basePositionsB[i].y,
    role: basePositionsB[i].role,
    minX: basePositionsB[i].minX,
    maxX: basePositionsB[i].maxX,
    minY: basePositionsB[i].minY,
    maxY: basePositionsB[i].maxY,
    team: "B",
    isGK: basePositionsB[i].role === "GK"
  }));
}

// === วาดสนาม ===
function drawPitch() {
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 780, 430);
  ctx.beginPath(); ctx.moveTo(400, 10); ctx.lineTo(400, 440); ctx.stroke();
  ctx.beginPath(); ctx.arc(400, 225, 70, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(130, 225, 3, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
  ctx.beginPath(); ctx.arc(670, 225, 3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeRect(10, 130, 130, 190);
  ctx.strokeRect(660, 130, 130, 190);
  ctx.strokeRect(10, 180, 60, 90);
  ctx.strokeRect(730, 180, 60, 90);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(0, 190, 15, 70);
  ctx.fillRect(785, 190, 15, 70);
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 190, 15, 70);
  ctx.strokeRect(785, 190, 15, 70);
}

// === วาดนักเตะ + ชื่อ ===
function drawPlayers() {
  const teamAData = teams.find(t => t.id === match.teamA);
  const teamBData = teams.find(t => t.id === match.teamB);

  function drawPlayer(player, teamColor, gkColor) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = player.isGK ? gkColor : teamColor;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(player.x, player.y - 14, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fcd34d";
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "9px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.name.split(" ")[0], player.x, player.y + 24);
  }

  match.playersA.forEach(p => drawPlayer(p, teamAData.color, teamAData.gkColor));
  match.playersB.forEach(p => drawPlayer(p, teamBData.color, teamBData.gkColor));
}

// === วาดลูกบอล ===
function drawBall() {
  ctx.beginPath();
  ctx.arc(match.ball.x, match.ball.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// === อัปเดตตำแหน่งตามตำแหน่งหน้าที่ ===
function updatePlayers() {
  const allPlayers = [...match.playersA, ...match.playersB];

  allPlayers.forEach(player => {
    const dx = match.ball.x - player.x;
    const dy = match.ball.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let chaseFactor = 0;
    let returnSpeed = player.speed * 0.3;

    // พฤติกรรมตามตำแหน่ง
    if (player.role === "GK") {
      chaseFactor = dist < 80 ? 0.5 : 0;
    } else if (player.role === "DEF") {
      const ballInZone = (player.team === "A" && match.ball.x < 350) ||
                         (player.team === "B" && match.ball.x > 450);
      chaseFactor = ballInZone && dist < 150 ? 0.7 : 0;
    } else if (player.role === "MID") {
      const ballNear = (player.team === "A" && match.ball.x < 450) ||
                       (player.team === "B" && match.ball.x > 350);
      chaseFactor = ballNear && dist < 200 ? 0.85 : 0.3;
    } else if (player.role === "FWD") {
      chaseFactor = dist < 250 ? 1.0 : 0.4;
    }

    // เข้าหาลูกบอล
    if (chaseFactor > 0 && dist > 5) {
      const speed = player.speed * chaseFactor;
      player.x += (dx / dist) * speed;
      player.y += (dy / dist) * speed;
    } else {
      // กลับไปยังตำแหน่งพื้นฐาน
      const bdx = player.baseX - player.x;
      const bdy = player.baseY - player.y;
      const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
      if (bdist > 3) {
        player.x += (bdx / bdist) * returnSpeed;
        player.y += (bdy / bdist) * returnSpeed;
      }
    }

    // ขอบเขตพื้นที่รับผิดชอบ
    player.x = Math.max(player.minX, Math.min(player.maxX, player.x));
    player.y = Math.max(player.minY, Math.min(player.maxY, player.y));
  });
}

// === เคลื่อนไหวลูกบอลตามความสามารถนักเตะ ===
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
      const basePower = player.isGK ? 3 : 4 + (player.shoot / 25);
      const power = basePower * (0.8 + Math.random() * 0.4);
      match.ball.vx = (dx / dist) * power;
      match.ball.vy = (dy / dist) * power + (Math.random() - 0.5) * 3;
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

// === ข้อความเหตุการณ์ ===
function updateEvent() {
  const rand = Math.random();
  if (rand < 0.06) {
    eventText.textContent = "ผู้รักษาประตูส่งบอลยาว...";
  } else if (rand < 0.12) {
    eventText.textContent = "กองหลังเคลียร์บอลออกจากเขตโทษ";
  } else if (rand < 0.20) {
    eventText.textContent = "กองกลางจ่ายบอลต่อเนื่อง...";
  } else if (rand < 0.28) {
    eventText.textContent = "กองหน้าพาบอลเข้าเขตโทษ กำลังยิง!";
  } else if (rand < 0.35) {
    eventText.textContent = "แย่งบอลกลับได้แดนกลาง";
  } else if (rand < 0.42) {
    eventText.textContent = "เปิดบอลเข้าหน้าประตู...";
  } else if (rand < 0.50) {
    eventText.textContent = "ผู้รักษาประตูเซฟบอลได้!";
  } else {
    eventText.textContent = "การแข่งขันดำเนินไปอย่างสูสี...";
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
  if (!checkGoal()) match.goalScored = false;

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

  const teamAData = teams.find(t => t.id === match.teamA);
  const teamBData = teams.find(t => t.id === match.teamB);

  nameA.textContent = teamAData.name;
  nameB.textContent = teamBData.name;
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
resetBtn.addEventListener("click", resetMatch());

window.addEventListener("load", () => {
  const state = getAuthState();
  if (state.authenticated && !isLocked()) showApp();
  else showLogin();
  drawPitch();
});

// === ตั้งค่า ===
const PRIVATE_PASSWORD = "thai2026"; // เปลี่ยนรหัสผ่านตรงนี้ครับ

// === ข้อมูลทีม (หรือโหลดจากไฟล์ teams.json) ===
const teams = [
  { id: "thailand", name: "ทีมชาติไทย", attack: 78, defense: 72 },
  { id: "japan", name: "ญี่ปุ่น", attack: 85, defense: 80 },
  { id: "korea", name: "เกาหลีใต้", attack: 83, defense: 78 },
  { id: "brazil", name: "บราซิล", attack: 92, defense: 88 },
  { id: "germany", name: "เยอรมนี", attack: 88, defense: 85 },
  { id: "france", name: "ฝรั่งเศส", attack: 89, defense: 84 }
];

// === ส่วนล็อกอิน ===
const loginSection = document.getElementById("login-section");
const mainApp = document.getElementById("main-app");

document.getElementById("login-btn").addEventListener("click", () => {
  const input = document.getElementById("password-input").value;
  if (input === PRIVATE_PASSWORD) {
    loginSection.style.display = "none";
    mainApp.style.display = "block";
    populateTeamSelects();
  } else {
    document.getElementById("login-error").textContent = "รหัสผ่านไม่ถูกต้อง";
  }
});

// === เติมรายการทีม ===
function populateTeamSelects() {
  const selectA = document.getElementById("team-a");
  const selectB = document.getElementById("team-b");
  
  [selectA, selectB].forEach(select => {
    select.innerHTML = "";
    teams.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      select.appendChild(opt);
    });
  });
}

// === ตรรกะจำลองผล ===
function simulateMatch(teamIdA, teamIdB) {
  const tA = teams.find(t => t.id === teamIdA);
  const tB = teams.find(t => t.id === teamIdB);

  // คำนวณโอกาสทำประตูตามค่าความแข็งแรง
  const powerA = (tA.attack + tB.defense / 2) / 100;
  const powerB = (tB.attack + tA.defense / 2) / 100;

  let scoreA = 0, scoreB = 0;
  
  // จำลองเหตุการณ์ตลอด 90 นาที
  for (let i = 0; i < 10; i++) {
    if (Math.random() < 0.35 * powerA) scoreA++;
    if (Math.random() < 0.35 * powerB) scoreB++;
  }

  return { scoreA, scoreB, teamA: tA, teamB: tB };
}

// === ปุ่มกด ===
document.getElementById("simulate-btn").addEventListener("click", () => {
  const idA = document.getElementById("team-a").value;
  const idB = document.getElementById("team-b").value;
  
  if (idA === idB) {
    alert("กรุณาเลือกทีมที่แตกต่างกัน");
    return;
  }

  const result = simulateMatch(idA, idB);
  
  document.getElementById("name-a").textContent = result.teamA.name;
  document.getElementById("name-b").textContent = result.teamB.name;
  document.getElementById("score-a").textContent = result.scoreA;
  document.getElementById("score-b").textContent = result.scoreB;

  let summary = "";
  if (result.scoreA > result.scoreB) {
    summary = `🏆 ${result.teamA.name} ชนะ!`;
  } else if (result.scoreB > result.scoreA) {
    summary = `🏆 ${result.teamB.name} ชนะ!`;
  } else {
    summary = "🤝 ผลเสมอกัน";
  }
  document.getElementById("match-summary").textContent = summary;
  document.getElementById("result-card").classList.remove("hidden");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  document.getElementById("result-card").classList.add("hidden");
});

// === ตั้งค่า ===
// เปลี่ยนรหัสผ่านตรงนี้ได้เลยครับ
const CONFIG = {
  password: "thai2026",        // รหัสผ่านเข้าใช้งาน
  allowRetry: true,            // ให้ลองใหม่ได้เมื่อใส่ผิด
  maxAttempts: 5,              // จำนวนครั้งที่ลองผิดได้สูงสุด
  lockoutMinutes: 10           // ล็อกเป็นเวลากี่นาทีเมื่อใส่ผิดครบกำหนด
};

// === ตรวจสอบสถานะการล็อกอิน ===
const STORAGE_KEY = "football_sim_auth";

function getAuthState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {
    authenticated: false,
    attempts: 0,
    lockedUntil: null
  };
}

function saveAuthState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isLocked() {
  const state = getAuthState();
  if (state.lockedUntil && new Date(state.lockedUntil) > new Date()) {
    return true;
  }
  return false;
}

// === ส่วนล็อกอิน ===
const loginSection = document.getElementById("login-section");
const mainApp = document.getElementById("main-app");
const loginError = document.getElementById("login-error");

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
  
  // ตรวจสอบว่าถูกล็อกหรือไม่
  if (isLocked()) {
    const remaining = Math.ceil((new Date(state.lockedUntil) - new Date()) / 60000);
    loginError.textContent = `⏳ ถูกระงับชั่วคราว — กรุณารอ ${remaining} นาทีแล้วลองใหม่`;
    return;
  }

  const input = document.getElementById("password-input").value.trim();
  
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

document.getElementById("login-btn").addEventListener("click", handleLogin);
document.getElementById("password-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});

// ตรวจสอบสถานะตอนโหลดหน้า
window.addEventListener("load", () => {
  const state = getAuthState();
  if (state.authenticated && !isLocked()) {
    showApp();
  } else {
    showLogin();
  }
});

// === ส่วนอื่นๆ เหมือนเดิม ===
// ... (วางโค้ดส่วน teams, populateTeamSelects, simulateMatch, ปุ่มกด ต่อตรงนี้เหมือนเดิมครับ)

/**
 * PeanutBuild Corp. 申請表單
 * 使用 EmailJS 發送至 iilluussdd@gmail.com
 *
 * 設定方式（請到 https://www.emailjs.com 完成）：
 * 1. 建立帳號並連接 Email Service（例如 Gmail）
 * 2. 建立 Template，內容可參考下方 templateParams 的變數
 * 3. 把下面三個常數改成你的實際值
 */
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";   // Account → API Keys → Public Key
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";   // Email Services → Service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Email Templates → Template ID

// 初始化 EmailJS（請先填入 Public Key）
(function () {
  if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

const openBtn = document.getElementById("open-form-btn");
const closeBtn = document.getElementById("close-form-btn");
const formPanel = document.getElementById("form-panel");
const applyForm = document.getElementById("apply-form");
const successMsg = document.getElementById("success-msg");
const submitBtn = document.getElementById("submit-btn");
const backBtn = document.getElementById("back-btn");

function showForm() {
  formPanel.hidden = false;
  applyForm.hidden = false;
  successMsg.hidden = true;
  formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideForm() {
  formPanel.hidden = true;
}

function showSuccess() {
  applyForm.hidden = true;
  successMsg.hidden = false;
}

openBtn.addEventListener("click", showForm);
closeBtn.addEventListener("click", hideForm);
backBtn.addEventListener("click", () => {
  applyForm.reset();
  showForm();
});

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map((el) => el.value)
    .join(", ") || "無";
}

applyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const gamertag = document.getElementById("gamertag").value.trim();
  const building = document.getElementById("building").value.trim();
  const nutsTeamId = document.getElementById("nuts_team_id").value.trim();
  const materials = document.getElementById("materials").value.trim();
  const email = document.getElementById("email").value.trim();
  const floorsAbove = getCheckedValues("floors_above");
  const floorsBelow = getCheckedValues("floors_below");

  if (!gamertag || !building || !nutsTeamId || !materials || !email) {
    alert("請完整填寫所有必填欄位。");
    return;
  }

  // 至少選一個樓層較合理，但依需求可改為非強制
  if (floorsAbove === "無" && floorsBelow === "無") {
    const ok = confirm("你尚未選擇任何樓層，確定要繼續提交嗎？");
    if (!ok) return;
  }

  // 組成寄給管理員的完整內容
  const allData = `
有新的申請來自於 PeanutBuild Corp.

【Minecraft 名稱 / GamerTag】
${gamertag}

【想要的建築物內容】
${building}

【NutsTeamID】
${nutsTeamId}

【材料（方塊 ID）】
${materials}

【地面上樓層】
${floorsAbove}

【地面下樓層】
${floorsBelow}

【申請人 Email】
${email}

提交時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
`.trim();

  const templateParams = {
    // 以下變數名稱請對應你在 EmailJS Template 裡設定的 {{變數}}
    subject: "有新的申請來自於PeanutBuild Corp.",
    message: allData,
    from_name: gamertag,
    reply_to: email,
    gamertag: gamertag,
    building: building,
    nuts_team_id: nutsTeamId,
    materials: materials,
    floors_above: floorsAbove,
    floors_below: floorsBelow,
    user_email: email,
    to_email: "iilluussdd@gmail.com",
  };

  // 若尚未設定 EmailJS 金鑰，改用 mailto 後備方案並提示
  if (
    EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" ||
    EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
    EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID"
  ) {
    console.warn("EmailJS 尚未設定，將使用 mailto 後備方案。");
    const mailto = `mailto:iilluussdd@gmail.com?subject=${encodeURIComponent(
      "有新的申請來自於PeanutBuild Corp."
    )}&body=${encodeURIComponent(allData)}`;
    window.location.href = mailto;
    showSuccess();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "送出中…";

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    showSuccess();
    applyForm.reset();
  } catch (err) {
    console.error("EmailJS 發送失敗：", err);
    alert("送出失敗，請稍後再試，或直接聯絡管理員。錯誤訊息已輸出至主控台。");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "提交申請";
  }
});

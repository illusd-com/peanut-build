/**
 * PeanutBuild Corp. 申請表單
 * EmailJS 設定與 ccmc 相同（已驗證可寄送）
 */
const EMAILJS_PUBLIC_KEY = "aOHKgzUh3ITq0nFnH";
const EMAILJS_SERVICE_ID = "service_owi4ndt";
const EMAILJS_TEMPLATE_ID = "template_d2p074o";

// 與 ccmc 相同的初始化方式
emailjs.init(EMAILJS_PUBLIC_KEY);

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
  return (
    Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
      .map((el) => el.value)
      .join(", ") || "無"
  );
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

  if (floorsAbove === "無" && floorsBelow === "無") {
    const ok = confirm("你尚未選擇任何樓層，確定要繼續提交嗎？");
    if (!ok) return;
  }

  const time = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });

  // 完整申請內容（放進 message，方便 Template 用 {{message}} 顯示）
  const message = [
    "有新的申請來自於 PeanutBuild Corp.",
    "",
    "【Minecraft 名稱 / GamerTag】",
    gamertag,
    "",
    "【想要的建築物內容】",
    building,
    "",
    "【NutsTeamID】",
    nutsTeamId,
    "",
    "【材料（方塊 ID）】",
    materials,
    "",
    "【地面上樓層】",
    floorsAbove,
    "",
    "【地面下樓層】",
    floorsBelow,
    "",
    "【申請人 Email】",
    email,
    "",
    "提交時間：" + time,
  ].join("\n");

  // 與 ccmc 相同的核心欄位 + 額外欄位（Template 有對應才會顯示）
  const templateParams = {
    gamertag: gamertag,
    email: email,
    time: time,
    message: message,
    subject: "有新的申請來自於PeanutBuild Corp.",
    building: building,
    nuts_team_id: nutsTeamId,
    materials: materials,
    floors_above: floorsAbove,
    floors_below: floorsBelow,
    from_name: gamertag,
    reply_to: email,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "送出中…";

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    showSuccess();
    applyForm.reset();
  } catch (err) {
    console.error("EmailJS 發送失敗：", err);
    const detail =
      (err && (err.text || err.message)) ||
      (typeof err === "string" ? err : JSON.stringify(err));
    alert(
      "送出失敗：" +
        detail +
        "\n\n請打開瀏覽器 F12 → Console 查看完整錯誤。\n常見原因：\n1. EmailJS Template 的 To Email 未設定\n2. Gmail 服務需重新連線\n3. 本網域未加入 EmailJS Allowed Origins"
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "提交申請";
  }
});

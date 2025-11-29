$(document).ready(function () {
  const video = document.getElementById("videoElement");
  const img = document.getElementById("imageElement");
  const canvas = document.getElementById("timeCanvas");
  const ctx = canvas.getContext("2d");

  function generateRandomString(length) {
    const chars = "ABCDEFGHIJKMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return "防伪 " + result;
  }

  function drawTime(text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 30px Arial";
    ctx.textBaseline = "top";

    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.strokeText(text, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, 0, 40);
    gradient.addColorStop(0, "#5798ff");
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;
    ctx.fillText(text, 0, 0);
  }

  /** ---------------------------
   *  读取本地存储
   * --------------------------*/
  function loadSavedWatermark() {
    const savedB = localStorage.getItem("wm_b");

    if (savedB) $("#watermarkInputb").val(savedB);

    if (savedB) $("#watermarkTextb").text(savedB);
  }

  /** ---------------------------
   *  初始化水印
   * --------------------------*/
  function initWatermark() {
    const now = new Date();
    const h = ("0" + now.getHours()).slice(-2);
    const m = ("0" + now.getMinutes()).slice(-2);
    const timeStr = h + ":" + m;
    $("#watermarkInputa").val(timeStr);
    drawTime(timeStr);

    // 默认值
    const defaultB = "广东省广州市白云区龙井西路4号";
    const days = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    const dateStr =
      now.getFullYear() +
      "." +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "." +
      ("0" + now.getDate()).slice(-2) +
      " " +
      days[now.getDay()];

    // 默认填入输入框
    $("#watermarkInputb").val(defaultB);
    $("#watermarkInputc").val(dateStr);

    // 默认显示
    $("#watermarkTextb").text(defaultB);
    $("#watermarkTextc").text(dateStr);

    // 再尝试读取本地覆盖默认值
    loadSavedWatermark();

    $("#fw").text(generateRandomString(13));
  }

  initWatermark();

  /** ---------------------------
   *  使用相机
   * --------------------------*/
  $("#startCamera").click(function () {
    img.style.display = "none";
    video.style.display = "block";
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => (video.srcObject = stream))
      .catch((err) => console.log(err));
  });

  /** ---------------------------
   *  上传图片
   * --------------------------*/
  $("#uploadImage").change(function (e) {
    video.style.display = "none";
    img.style.display = "block";
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (ev) {
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  /** ---------------------------
   *  更新水印（保存本地）
   * --------------------------*/
  $("#updateWatermark").click(function () {
    const a = $("#watermarkInputa").val();
    const b = $("#watermarkInputb").val();
    const c = $("#watermarkInputc").val();

    drawTime(a);
    $("#watermarkTextb").text(b);
    $("#watermarkTextc").text(c);
    $("#fw").text(generateRandomString(13));

    // 保存到 localStorage
    localStorage.setItem("wm_b", b);
  });

  /** ---------------------------
   *  截图保存
   * --------------------------*/
  $("#captureBtn").click(async function () {
    showToast("正在生成图片...");

    const div = document.querySelector("#videoContainer");
    const snapshot = await html2canvas(div, { scale: 2, useCORS: true });

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      const imgData = snapshot.toDataURL("image/png");
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${imgData}" style="max-width:100%;">`;
      showToast("长按图片保存");
    } else {
      const link = document.createElement("a");
      link.download = "screenshot_" + Date.now() + ".png";
      link.href = snapshot.toDataURL("image/png");
      link.click();
      showToast("保存成功！");
    }
  });
  
  function showToast(text) {
    const toast = $("#toast");
    toast.text(text).fadeIn(200);
    setTimeout(() => toast.fadeOut(300), 2000);
  }
});

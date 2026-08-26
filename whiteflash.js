(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preview = document.getElementById("whiteflashPreview");
  const wash = document.getElementById("whiteflashWash");
  const toggle = document.getElementById("flashToggle");
  const stateLabel = document.getElementById("whiteflashState");
  const intensity = document.getElementById("flashIntensity");
  const frequency = document.getElementById("flashFrequency");
  const intensityOut = document.getElementById("flashIntensityOut");
  const frequencyOut = document.getElementById("flashFrequencyOut");
  let running = false;
  let animationFrame = 0;
  let startedAt = 0;

  const updateOutputs = () => {
    intensityOut.value = `${intensity.value}%`;
    frequencyOut.value = `${Number(frequency.value).toFixed(2)} Hz`;
  };

  const render = (time) => {
    if (!running) return;
    const elapsed = (time - startedAt) / 1000;
    const wave = (Math.sin(elapsed * Number(frequency.value) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
    const softened = wave * wave * (3 - 2 * wave);
    wash.style.opacity = String(softened * Number(intensity.value) / 100);
    animationFrame = requestAnimationFrame(render);
  };

  const setRunning = (next) => {
    running = next;
    cancelAnimationFrame(animationFrame);
    preview.classList.toggle("is-running", running);
    stateLabel.classList.toggle("is-running", running);
    stateLabel.innerHTML = `<i></i> ${running ? "ACTIVE" : "STANDBY"}`;
    toggle.setAttribute("aria-pressed", String(running));
    toggle.innerHTML = running
      ? '<span>停止预览</span><i data-lucide="square" aria-hidden="true"></i>'
      : '<span>启动局部预览</span><i data-lucide="play" aria-hidden="true"></i>';
    window.lucide?.createIcons();
    if (running) {
      startedAt = performance.now();
      animationFrame = requestAnimationFrame(render);
    } else {
      wash.style.opacity = "0";
    }
  };

  const updateClock = () => {
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Hong_Kong", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(new Date());
    document.getElementById("liveTime").textContent = `${time} HKT`;
  };

  updateOutputs();
  updateClock();
  setInterval(updateClock, 1000);
  window.lucide?.createIcons();
  intensity.addEventListener("input", updateOutputs);
  frequency.addEventListener("input", updateOutputs);

  if (reducedMotion) {
    toggle.disabled = true;
    toggle.querySelector("span").textContent = "已遵循减少动态效果";
    stateLabel.innerHTML = "<i></i> MOTION REDUCED";
  } else {
    toggle.addEventListener("click", () => setRunning(!running));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && running) setRunning(false);
    });
  }
})();

(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = { sound: false, audioContext: null };

  function bindConfig() {
    document.querySelectorAll("[data-bind]").forEach((element) => {
      const key = element.dataset.bind;
      if (config.identity[key]) element.textContent = config.identity[key];
    });

    const email = config.identity.email;
    const emailLink = document.getElementById("emailLink");
    const emailText = document.getElementById("emailText");
    emailLink.href = `mailto:${email}`;
    emailText.href = `mailto:${email}`;
    emailText.textContent = email;
    document.title = `${config.identity.name} / Digital Systems`;
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function renderContent() {
    document.getElementById("stats").innerHTML = config.stats.map((item) => `
      <div class="stat"><strong>${item.value}</strong><span>${item.label}</span></div>
    `).join("");

    document.getElementById("capabilities").innerHTML = config.capabilities.map((item) => `
      <article class="capability reveal">
        <span class="capability__code">CAPABILITY / ${item.code}</span>
        <h3>${item.title}</h3>
        <p>${item.detail}</p>
      </article>
    `).join("");

    document.getElementById("projectList").innerHTML = config.projects.map((project) => `
      <article class="project reveal" data-category="${project.category}">
        <span class="project__id">${project.id}</span>
        <div class="project__visual">
          <img src="${project.image}" alt="${project.alt}" loading="lazy">
          <span class="project__year">${project.year}</span>
        </div>
        <div class="project__body">
          <p class="project__category">${project.categoryLabel}</p>
          <h3>${project.title}</h3>
          <p class="project__description">${project.description}</p>
          <p class="project__services">${project.services}</p>
        </div>
        <span class="project__open" aria-hidden="true"><i data-lucide="plus"></i></span>
      </article>
    `).join("");

    document.getElementById("logList").innerHTML = config.logs.map((item) => `
      <article class="log-entry reveal">
        <time datetime="${item.date.replaceAll(".", "-")}">${item.date}<br>${item.type}</time>
        <h3>${item.title}</h3>
        <i data-lucide="arrow-up-right" aria-hidden="true"></i>
      </article>
    `).join("");

    document.getElementById("footerLinks").innerHTML = config.links.map((link) => `
      <a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>
    `).join("");
  }

  function runBoot() {
    const boot = document.getElementById("boot");
    if (reducedMotion || sessionStorage.getItem("portfolio-booted")) {
      boot.remove();
      return;
    }

    document.body.classList.add("is-locked");
    const percent = document.getElementById("bootPercent");
    const bar = document.getElementById("bootBar");
    let progress = 0;

    const finish = () => {
      progress = 100;
      percent.textContent = "100%";
      bar.style.width = "100%";
      sessionStorage.setItem("portfolio-booted", "1");
      setTimeout(() => {
        boot.classList.add("is-complete");
        document.body.classList.remove("is-locked");
      }, 260);
    };

    const timer = setInterval(() => {
      progress = Math.min(progress + Math.ceil(Math.random() * 13), 100);
      percent.textContent = `${String(progress).padStart(3, "0")}%`;
      bar.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(timer);
        finish();
      }
    }, 90);

    document.getElementById("bootSkip").addEventListener("click", () => {
      clearInterval(timer);
      finish();
    }, { once: true });
  }

  function updateClock() {
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Hong_Kong",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
    document.getElementById("liveTime").textContent = `${time} HKT`;
  }

  function initReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    elements.forEach((element) => observer.observe(element));
  }

  function initNavigation() {
    const toggle = document.getElementById("menuToggle");
    const menu = document.getElementById("mobileMenu");

    const closeMenu = () => {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "打开导航");
      toggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
      window.lucide?.createIcons();
      document.body.classList.remove("is-locked");
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) return closeMenu();
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "关闭导航");
      toggle.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>';
      window.lucide?.createIcons();
      document.body.classList.add("is-locked");
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll("[data-section-link]").forEach((link) => {
          link.classList.toggle("is-active", link.dataset.sectionLink === entry.target.dataset.section);
        });
      });
    }, { rootMargin: "-35% 0px -55%" });

    document.querySelectorAll("[data-section]").forEach((section) => sectionObserver.observe(section));
  }

  function initFilters() {
    document.querySelectorAll(".filter").forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.filter;
        document.querySelectorAll(".filter").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        document.querySelectorAll(".project").forEach((project) => {
          project.hidden = category !== "all" && project.dataset.category !== category;
        });
        playTone(340, 0.035);
      });
    });
  }

  function initCopy() {
    const toast = document.getElementById("toast");
    document.getElementById("copyEmail").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(config.identity.email);
        toast.textContent = "ADDRESS COPIED TO CLIPBOARD";
      } catch {
        toast.textContent = config.identity.email;
      }
      toast.classList.add("is-visible");
      playTone(520, 0.06);
      setTimeout(() => toast.classList.remove("is-visible"), 2200);
    });
  }

  function playTone(frequency, duration) {
    if (!state.sound) return;
    state.audioContext ||= new AudioContext();
    const oscillator = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.018, state.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, state.audioContext.currentTime + duration);
    oscillator.connect(gain).connect(state.audioContext.destination);
    oscillator.start();
    oscillator.stop(state.audioContext.currentTime + duration);
  }

  function initSound() {
    const button = document.getElementById("soundToggle");
    button.addEventListener("click", () => {
      state.sound = !state.sound;
      button.setAttribute("aria-pressed", String(state.sound));
      button.innerHTML = `<i data-lucide="${state.sound ? "volume-2" : "volume-x"}" aria-hidden="true"></i>`;
      button.title = state.sound ? "关闭界面音效" : "开启界面音效";
      window.lucide?.createIcons();
      playTone(460, 0.05);
    });
  }

  function initSignalCanvas() {
    const canvas = document.getElementById("signalCanvas");
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let raf = 0;
    const pointer = { x: 0.72, y: 0.45, targetX: 0.72, targetY: 0.45 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      const centerX = width * pointer.x;
      const centerY = height * pointer.y;
      context.save();
      context.translate(centerX, centerY);

      for (let ring = 0; ring < 12; ring += 1) {
        const base = 35 + ring * Math.min(width, height) * 0.045;
        context.beginPath();
        for (let angle = 0; angle <= Math.PI * 2 + 0.08; angle += 0.08) {
          const noise = Math.sin(angle * 7 + time * 0.0007 + ring) * (7 + ring * 0.9);
          const radius = base + noise;
          const x = Math.cos(angle) * radius * 1.38;
          const y = Math.sin(angle) * radius;
          if (angle === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(213, 255, 69, ${0.22 - ring * 0.012})`;
        context.lineWidth = ring % 4 === 0 ? 1.2 : 0.55;
        context.stroke();
      }

      context.strokeStyle = "rgba(87, 217, 210, 0.35)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-width, 0);
      context.lineTo(width, 0);
      context.moveTo(0, -height);
      context.lineTo(0, height);
      context.stroke();
      context.restore();

      if (!reducedMotion) raf = requestAnimationFrame(draw);
    };

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) / rect.width;
      pointer.targetY = (event.clientY - rect.top) / rect.height;
    });

    window.addEventListener("resize", resize);
    resize();
    draw(0);
    if (reducedMotion) cancelAnimationFrame(raf);
  }

  bindConfig();
  renderContent();
  runBoot();
  updateClock();
  setInterval(updateClock, 1000);
  initNavigation();
  initFilters();
  initCopy();
  initSound();
  initSignalCanvas();
  window.lucide?.createIcons();
  requestAnimationFrame(initReveal);
})();

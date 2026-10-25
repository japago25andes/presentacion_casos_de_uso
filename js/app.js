/* =========================================================
   Casos de Uso · Software I · Universidad Libre
   Motor de la presentación: navegación, pasos, quiz e índice
   ========================================================= */
(function () {
  "use strict";

  const stage = document.querySelector(".stage");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progress = document.querySelector(".progress");
  const counter = document.querySelector(".hud .count");
  const sectionLabel = document.querySelector(".hud .sec");
  const indexPanel = document.querySelector(".index");
  const indexList = indexPanel.querySelector(".sections");

  const W = 1280;
  const H = 720;

  let current = 0;
  let step = 0; // cuántos pasos están visibles en la diapositiva actual

  /* ---------- Escalado del escenario ---------- */
  function fit() {
    const s = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  window.addEventListener("resize", fit);
  fit();

  /* ---------- Pasos revelables ---------- */
  function stepsOf(slide) {
    const nums = new Set();
    slide.querySelectorAll("[data-step]").forEach((el) => nums.add(Number(el.dataset.step)));
    return Array.from(nums).sort((a, b) => a - b);
  }

  function applySteps(slide, visible) {
    const order = stepsOf(slide);
    const limit = visible > 0 ? order[visible - 1] : -Infinity;
    slide.querySelectorAll("[data-step]").forEach((el) => {
      el.classList.toggle("shown", Number(el.dataset.step) <= limit);
    });
  }

  /* ---------- Mostrar diapositiva ---------- */
  function show(index, showAllSteps) {
    index = Math.max(0, Math.min(slides.length - 1, index));

    slides.forEach((s, i) => {
      s.classList.toggle("active", i === index);
      s.classList.toggle("prev-side", i < index);
    });

    current = index;
    const slide = slides[current];
    step = showAllSteps ? stepsOf(slide).length : 0;
    applySteps(slide, step);

    progress.style.width = ((current + 1) / slides.length) * 100 + "%";
    counter.textContent = `${current + 1} / ${slides.length}`;
    sectionLabel.textContent = slide.dataset.section || "";
    document.title = (slide.dataset.title ? slide.dataset.title + " · " : "") + "Casos de Uso · Software I";

    if (location.hash !== "#" + (current + 1)) {
      history.replaceState(null, "", "#" + (current + 1));
    }
    markIndex();
  }

  function next() {
    const total = stepsOf(slides[current]).length;
    if (step < total) {
      step++;
      applySteps(slides[current], step);
    } else if (current < slides.length - 1) {
      show(current + 1, false);
    }
  }

  function prev() {
    if (step > 0) {
      step--;
      applySteps(slides[current], step);
    } else if (current > 0) {
      show(current - 1, true);
    }
  }

  /* ---------- Índice ---------- */
  function buildIndex() {
    const groups = new Map();
    slides.forEach((s, i) => {
      const sec = s.dataset.section || "Inicio";
      if (!groups.has(sec)) groups.set(sec, []);
      groups.get(sec).push({ i, title: s.dataset.title || "Diapositiva " + (i + 1) });
    });
    indexList.innerHTML = "";
    groups.forEach((items, sec) => {
      const g = document.createElement("div");
      g.className = "sec-group";
      const h = document.createElement("h3");
      h.textContent = sec;
      g.appendChild(h);
      items.forEach(({ i, title }) => {
        const a = document.createElement("a");
        a.href = "#" + (i + 1);
        a.dataset.i = i;
        a.innerHTML = `<span>${i + 1}</span>${title}`;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          toggleIndex(false);
          show(i, false);
        });
        g.appendChild(a);
      });
      indexList.appendChild(g);
    });
  }

  function markIndex() {
    indexList.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("current", Number(a.dataset.i) === current);
    });
  }

  function toggleIndex(force) {
    const open = typeof force === "boolean" ? force : !indexPanel.classList.contains("open");
    indexPanel.classList.toggle("open", open);
    if (open) {
      const cur = indexList.querySelector("a.current");
      if (cur) cur.scrollIntoView({ block: "center" });
    }
  }

  /* ---------- Pantalla completa ---------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
  }

  /* ---------- Teclado ---------- */
  document.addEventListener("keydown", (e) => {
    const target = e.target instanceof Element ? e.target : document.body;
    if (target.closest("input, textarea, select")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;

    if (indexPanel.classList.contains("open")) {
      if (k === "Escape" || k === "i" || k === "I") { toggleIndex(false); e.preventDefault(); }
      return;
    }

    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) {
      if (k === "Enter" && target.closest("button")) return;
      e.preventDefault(); next();
    } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) {
      e.preventDefault(); prev();
    } else if (k === "Home") {
      e.preventDefault(); show(0, false);
    } else if (k === "End") {
      e.preventDefault(); show(slides.length - 1, true);
    } else if (k === "f" || k === "F") {
      toggleFullscreen();
    } else if (k === "i" || k === "I" || k === "Escape") {
      toggleIndex();
    }
  });

  /* ---------- Gestos táctiles ---------- */
  let touchX = null, touchY = null;
  document.addEventListener("touchstart", (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    touchX = touchY = null;
  }, { passive: true });

  /* ---------- Botones del HUD ---------- */
  document.querySelector("[data-act=prev]").addEventListener("click", prev);
  document.querySelector("[data-act=next]").addEventListener("click", next);
  document.querySelector("[data-act=index]").addEventListener("click", () => toggleIndex());
  document.querySelector("[data-act=full]").addEventListener("click", toggleFullscreen);
  indexPanel.querySelector(".close").addEventListener("click", () => toggleIndex(false));

  /* ---------- Quiz: el docente marca la respuesta del grupo ---------- */
  document.querySelectorAll(".q").forEach((q) => {
    const answer = q.dataset.answer;
    const res = q.querySelector(".res");
    q.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const ok = b.dataset.v === answer;
        q.classList.remove("ok", "bad");
        q.querySelectorAll("button").forEach((x) => x.classList.remove("right", "wrong"));
        q.classList.add(ok ? "ok" : "bad");
        b.classList.add(ok ? "right" : "wrong");
        if (!ok) q.querySelector(`button[data-v="${answer}"]`).classList.add("right");
        res.textContent = ok ? "¡Correcto!" : "Revisemos…";
        b.blur();
      });
    });
  });

  document.querySelectorAll("[data-quiz-reveal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const quiz = document.getElementById(btn.dataset.quizReveal);
      quiz.querySelectorAll(".q").forEach((q) => {
        q.querySelector(`button[data-v="${q.dataset.answer}"]`).click();
      });
      btn.blur();
    });
  });

  document.querySelectorAll("[data-quiz-reset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const quiz = document.getElementById(btn.dataset.quizReset);
      quiz.querySelectorAll(".q").forEach((q) => {
        q.classList.remove("ok", "bad");
        q.querySelectorAll("button").forEach((x) => x.classList.remove("right", "wrong"));
        q.querySelector(".res").textContent = "";
      });
      btn.blur();
    });
  });

  /* ---------- Lista de chequeo ---------- */
  document.querySelectorAll(".check").forEach((c) => {
    c.addEventListener("click", () => c.classList.toggle("on"));
  });

  /* ---------- Inicio ---------- */
  buildIndex();
  const fromHash = parseInt(location.hash.replace("#", ""), 10);
  show(Number.isFinite(fromHash) ? fromHash - 1 : 0, false);

  window.addEventListener("hashchange", () => {
    const n = parseInt(location.hash.replace("#", ""), 10);
    if (Number.isFinite(n) && n - 1 !== current) show(n - 1, false);
  });
})();

(function () {
  const T = window.TRIP;
  if (!T) return;

  const $ = (sel, el = document) => el.querySelector(sel);
  const dayNav = $("#dayNav");
  const dayContent = $("#dayContent");
  let activeDay = T.days[0].id;

  // Theme
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("trip-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $("#themeToggle")?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (next === "light") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "dark");
    localStorage.setItem("trip-theme", next === "light" ? "" : "dark");
  });

  // Tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      document.querySelectorAll(".panel").forEach((p) => {
        const on = p.id === `panel-${name}`;
        p.classList.toggle("active", on);
        p.hidden = !on;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  function kindClass(kind) {
    if (kind === "lock") return "lock";
    if (kind === "opt") return "opt";
    if (kind === "taxi") return "taxi";
    return "";
  }

  function renderItem(item) {
    const k = kindClass(item.kind);
    const badge =
      item.kind === "lock"
        ? '<span class="badge-mini lock">鎖定</span>'
        : item.kind === "opt"
          ? '<span class="badge-mini opt">可選</span>'
          : "";
    const taxi = item.taxi ? `<div class="taxi">🚕 ${escapeHtml(item.taxi)}</div>` : "";
    return `
      <li>
        <div class="time">${escapeHtml(item.time)}</div>
        <div class="dot-col"><span class="dot ${k}"></span></div>
        <div class="item-body">
          <h3>${escapeHtml(item.title)}${badge}</h3>
          ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
          ${taxi}
        </div>
      </li>`;
  }

  function renderDay(day) {
    const tags = (day.tags || [])
      .map((t) => {
        let cls = "tag";
        if (t.includes("鎖定") || t === "滑雪" || t === "南謠" || t === "贏到粥") cls += " warn";
        else if (t.includes("彈性") || t.includes("可選")) cls += " opt";
        else if (t.includes("澳") || t.includes("百老匯") || t.includes("影匯") || t.includes("水樂園") || t.includes("搬家") || t.includes("回程") || t.includes("赴澳"))
          cls += " mac";
        return `<span class="${cls}">${escapeHtml(t)}</span>`;
      })
      .join("");

    let body = `<ul class="timeline">${day.items.map(renderItem).join("")}</ul>`;

    if (day.branches?.length) {
      body += day.branches
        .map(
          (b, i) => `
        <details class="branch" ${i === 0 ? "open" : ""}>
          <summary>${escapeHtml(b.title)}</summary>
          <div class="branch-body">
            <ul class="timeline">${b.items.map(renderItem).join("")}</ul>
          </div>
        </details>`
        )
        .join("");
    }

    const note = day.note
      ? `<div class="note-box"><strong>提示</strong> · ${escapeHtml(day.note)}</div>`
      : "";

    dayContent.innerHTML = `
      <article class="day-card">
        <div class="day-card-head">
          <div class="when">${escapeHtml(day.date)}／週${escapeHtml(day.weekday)}</div>
          <h2>${escapeHtml(day.title)}</h2>
          <p class="theme">${escapeHtml(day.theme)}</p>
          <div class="tags">${tags}</div>
        </div>
        ${body}
        ${note}
      </article>`;
  }

  function renderDayNav() {
    dayNav.innerHTML = T.days
      .map(
        (d) => `
      <button type="button" class="day-pill ${d.id === activeDay ? "active" : ""}" data-id="${d.id}">
        <span class="d">${escapeHtml(d.date)}</span>
        <span class="w">週${escapeHtml(d.weekday)}</span>
      </button>`
      )
      .join("");

    dayNav.querySelectorAll(".day-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeDay = btn.dataset.id;
        renderDayNav();
        renderDay(T.days.find((d) => d.id === activeDay));
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
  }

  function renderFood() {
    const tbody = $("#foodTable tbody");
    tbody.innerHTML = T.food
      .map((r) => {
        const dinnerCls = r.dinnerBooked ? ' class="booked"' : "";
        const bookCls = r.dinnerBooked || (r.booking && r.booking.includes("已訂")) ? ' class="booked"' : "";
        return `<tr>
          <td>${escapeHtml(r.date)}</td>
          <td>${escapeHtml(r.breakfast)}</td>
          <td>${escapeHtml(r.lunch)}</td>
          <td${dinnerCls}>${escapeHtml(r.dinner)}</td>
          <td${bookCls}>${escapeHtml(r.booking)}</td>
        </tr>`;
      })
      .join("");

    $("#breakfastList").innerHTML = T.breakfastNearHotel
      .map((x) => `<li>${escapeHtml(x)}</li>`)
      .join("");
  }

  function renderBackup() {
    $("#backupList").innerHTML = T.backups
      .map(
        (b) => `
      <article class="backup-card">
        <h3>${escapeHtml(b.name)}</h3>
        <div class="backup-meta">
          <span class="tag">${escapeHtml(b.duration)}</span>
          <span class="tag opt">最佳：${escapeHtml(b.best)}</span>
          ${b.alt && b.alt !== "—" ? `<span class="tag">次選：${escapeHtml(b.alt)}</span>` : ""}
        </div>
        <p>${escapeHtml(b.content)}</p>
        <p style="margin-top:6px">${escapeHtml(b.note)}</p>
      </article>`
      )
      .join("");

    $("#slotList").innerHTML = `
      <div class="card" style="padding-top:4px;padding-bottom:4px">
        ${T.slots
          .map(
            (s) => `
          <div class="slot-row">
            <div class="slot-day">${escapeHtml(s.day)}</div>
            <div class="slot-body">${escapeHtml(s.text)}</div>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function renderTaxi() {
    $("#taxiTable tbody").innerHTML = T.taxi
      .map(([a, b]) => `<tr><td>${escapeHtml(a)}</td><td>${escapeHtml(b)}</td></tr>`)
      .join("");
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Default day: today if in range, else first
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  if (y === 2026 && m === "07") {
    const id = `07${d}`;
    if (T.days.some((x) => x.id === id)) activeDay = id;
  }

  renderDayNav();
  renderDay(T.days.find((x) => x.id === activeDay));
  renderFood();
  renderBackup();
  renderTaxi();

  // PWA service worker (optional, ignore errors on file://)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
})();

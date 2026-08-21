/* ================================================================
   ERP READINESS & MATURITY ASSESSMENT — APP LOGIC
   ================================================================ */

/* ================================================================
   STATE
   ================================================================ */
let answers = {};
let industryIdx = 0;

const qCount = DIMENSIONS.reduce((s, d) => s + d.qs.length, 0);
const qDim = {};
(function () {
  let i = 0;
  DIMENSIONS.forEach((d, di) => { d.qs.forEach(() => { qDim[i++] = di; }); });
})();

/* ================================================================
   ICONS — Phosphor icon class per dimension
   ================================================================ */
const DIM_ICONS = [
  'ph ph-arrows-clockwise',
  'ph ph-database',
  'ph ph-cpu',
  'ph ph-users',
  'ph ph-shield-check',
  'ph ph-trend-up'
];

/* ================================================================
   RENDER — static
   ================================================================ */
const $ = id => document.getElementById(id);

function renderLevels() {
  $("lvl-cards").innerHTML = LEVELS.map(l => `
    <div class="lvl fade-up" data-lv="${l.lv}">
      <div class="lvl-color"></div>
      <div class="lvl-top">
        <h3>Level ${l.lv} - ${l.name}</h3>
        <span class="flag">${l.flag}</span>
      </div>
      <div class="range">Score ${l.range}</div>
      <div class="desc">${l.desc}</div>
    </div>`).join("");
}

function renderIndustries() {
  $("ind-selector").innerHTML = INDUSTRIES.map((ind, i) => `
    <button class="ind${i === industryIdx ? " active" : ""}" onclick="setIndustry(${i})">
      ${ind.name}<small>${ind.w.map(w => (w * 100) + "%").join(" · ")}</small>
    </button>`).join("");

  const cols = '<col class="dim-col">' +
    INDUSTRIES.map((_, ii) => `<col class="col-ind-${ii}">`).join("");

  const head = INDUSTRIES.map((ind, ii) =>
    `<th scope="col" class="col-ind-${ii}${ii === industryIdx ? " active-col" : ""}">${ind.name}</th>`
  ).join("");

  const rows = DIMENSIONS.map((d, di) => {
    const tds = INDUSTRIES.map((ind, ii) => {
      const hi = ind.w[di] === Math.max(...ind.w);
      return `<td class="col-ind-${ii}${hi ? " hi" : ""}${ii === industryIdx ? " active-col" : ""}">${(ind.w[di] * 100).toFixed(0)}%</td>`;
    }).join("");
    return `<tr><th scope="row">${d.n}. ${d.title}</th>${tds}</tr>`;
  }).join("");

  const totalTds = INDUSTRIES.map((_, ii) =>
    `<td class="col-ind-${ii}${ii === industryIdx ? " active-col" : ""}">100%</td>`
  ).join("");

  const box = $("wtable");
  box.className = "wtable only-" + industryIdx;
  box.setAttribute("data-active-industry", industryIdx);
  box.innerHTML = `
    <table>
      <colgroup>${cols}</colgroup>
      <thead><tr><th scope="col">Dimension</th>${head}</tr></thead>
      <tbody>
        ${rows}
        <tr class="total-row"><th scope="row">Total Weight</th>${totalTds}</tr>
      </tbody>
    </table>`;
}

function renderDims() {
  let qIdx = 0;
  $("dims").innerHTML = DIMENSIONS.map((d, di) => {
    const icon = DIM_ICONS[di] || 'ph ph-circle';
    const qs = d.qs.map(q => {
      const idx = qIdx++;
      return `
        <div class="q">
          <span class="q-idx">Q${idx + 1}</span>
          <div class="q-text">${q}</div>
          <div class="scale" role="radiogroup" aria-label="Q${idx + 1}">
            ${[1, 2, 3, 4, 5].map(v => `
              <button role="radio" aria-checked="false" data-q="${idx}" data-v="${v}"
                onclick="setAnswer(${idx},${v})">${v}</button>`).join("")}
          </div>
        </div>`;
    }).join("");
    return `
      <div class="dim fade-up" id="dim-${d.n}">
        <div class="dim-head">
          <div class="dim-icon"><i class="${icon}"></i></div>
          <div style="flex:1;min-width:0">
            <h3>${d.title}</h3>
            <p>${d.focus}</p>
          </div>
          <div class="dim-prog"><b>0</b> / 5</div>
        </div>
        <div class="scale-legend">
          <span><i></i>1 - Strongly disagree</span>
          <span><i></i>5 - Strongly agree</span>
        </div>
        ${qs}
      </div>`;
  }).join("");
}

function renderRadar(scores, color) {
  const cx = 150, cy = 132, R = 96, n = 6;
  let g = "";
  for (let ring = 1; ring <= 5; ring++) {
    const r = R * ring / 5;
    let pts = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    g += `<polygon points="${pts.join(" ")}" fill="none" stroke="rgba(120,100,75,0.1)" stroke-width="1"/>`;
  }
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    g += `<line x1="${cx}" y1="${cy}" x2="${(cx + R * Math.cos(a)).toFixed(1)}" y2="${(cy + R * Math.sin(a)).toFixed(1)}" stroke="rgba(120,100,75,0.1)" stroke-width="1"/>`;
  }
  const poly = scores.map((s, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    const r = R * s / 5;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  const dots = scores.map((s, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    const r = R * s / 5;
    return `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="3.4" fill="${color}"/>`;
  }).join("");
  const labels = DIMENSIONS.map(d => `D${d.n}`).map((t, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    const r = R + 20;
    return `<text x="${(cx + r * Math.cos(a)).toFixed(1)}" y="${(cy + r * Math.sin(a)).toFixed(1) + 4}"
      text-anchor="${Math.abs(Math.cos(a)) < .3 ? "middle" : (Math.cos(a) > 0 ? "start" : "end")}"
      fill="var(--ink-2)" font-family="Inter,system-ui" font-size="11.5" font-weight="600">${t}</text>`;
  }).join("");
  $("radar").innerHTML = `
    <svg viewBox="0 0 300 280" width="300" height="280" role="img" aria-label="Radar chart of dimension scores">
      ${g}
      <polygon points="${poly}" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" stroke-linejoin="round" style="transition:all 0.8s ease"/>
      ${dots}${labels}
    </svg>`;
}

function renderBars(scores, color) {
  $("bars").innerHTML = DIMENSIONS.map((d, i) => `
    <div class="bar-row">
      <div class="lab"><b>${d.n}. ${d.title}</b><em>${scores[i] === null ? "-" : scores[i].toFixed(2)}</em></div>
      <div class="bar-track"><div class="bar-fill" data-i="${i}" style="background:${color}"></div></div>
    </div>`).join("");
  requestAnimationFrame(() => {
    DIMENSIONS.forEach((d, i) => {
      const fill = document.querySelector(`.bar-fill[data-i="${i}"]`);
      if (fill && scores[i] != null) fill.style.width = (scores[i] / 5 * 100) + "%";
    });
  });
}

/* ================================================================
   STATE MUTATION
   ================================================================ */
function setIndustry(i) {
  industryIdx = i;
  renderIndustries();
  update();
}

function setAnswer(qIdx, val) {
  if (answers[qIdx] === val) delete answers[qIdx]; else answers[qIdx] = val;
  const btn = document.querySelector(`.scale button[data-q="${qIdx}"][data-v="${val}"]`);
  if (btn) {
    const sel = btn.parentElement.querySelector(".sel");
    if (sel) sel.classList.remove("sel"), sel.setAttribute("aria-checked", "false");
    if (answers[qIdx] !== undefined) btn.classList.add("sel"), btn.setAttribute("aria-checked", "true");
  }
  update();
}

function dimScores() {
  const out = [];
  let qIdx = 0;
  DIMENSIONS.forEach(d => {
    const vs = [];
    d.qs.forEach(() => {
      if (answers[qIdx] !== undefined) vs.push(answers[qIdx]);
      qIdx++;
    });
    out.push(vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null);
  });
  return out;
}

function levelFor(score) {
  if (score === null) return null;
  if (score < 1.9) return 0;
  if (score < 2.7) return 1;
  if (score < 3.5) return 2;
  if (score < 4.3) return 3;
  return 4;
}

function weightedScore(ds) {
  const w = INDUSTRIES[industryIdx].w;
  let sum = 0, wsum = 0;
  ds.forEach((s, i) => {
    if (s !== null) { sum += s * w[i]; wsum += w[i]; }
  });
  return wsum > 0 ? sum / wsum : null;
}

function update() {
  const answered = Object.keys(answers).length;
  const complete = answered === qCount;

  /* print button */
  const printBtn = $("print-btn");
  if (printBtn) printBtn.disabled = !complete;

  /* progress bar */
  const pct = (answered / qCount) * 100;
  const bar = $("progress-bar");
  if (bar) bar.style.width = pct + "%";

  /* dimension progress */
  DIMENSIONS.forEach((d, di) => {
    const el = document.querySelector(`#dim-${d.n} .dim-prog b`);
    let cnt = 0, qIdx = 0;
    DIMENSIONS.forEach((dd, i) => {
      dd.qs.forEach(() => {
        if (i === di && answers[qIdx] !== undefined) cnt++;
        qIdx++;
      });
    });
    if (el) el.textContent = cnt;
  });

  const ds = dimScores();
  const score = weightedScore(ds);
  const lvl = levelFor(score);
  const L = lvl !== null ? LEVELS[lvl] : null;

  /* topbar */
  $("tb-score").textContent = score !== null ? score.toFixed(2) : "-";
  const tb = $("tb-level");
  tb.textContent = L ? `Level ${L.lv}` : "Pending";
  tb.style.background = L ? L.c : "rgba(120,100,75,0.15)";
  tb.style.color = L ? "#fff" : "var(--ink-2)";

  /* gauge */
  const ring = $("ring");
  const C = 640.9;
  if (score !== null) {
    ring.style.stroke = L.c;
    ring.style.strokeDashoffset = C * (1 - score / 5);
    $("g-score").textContent = score.toFixed(2);
    $("g-score").style.color = L.c;
  } else {
    ring.style.strokeDashoffset = C;
    $("g-score").textContent = "-";
    $("g-score").style.color = "";
  }

  /* main verdict */
  if (L) {
    $("res-title").textContent = `Level ${L.lv} - ${L.name}`;
    const badge = $("res-badge");
    badge.textContent = L.flag;
    badge.style.color = L.c;
    badge.style.borderColor = L.c;
    badge.style.background = "rgba(0,0,0,0.04)";
    $("res-verdict").textContent = VERDICTS[lvl].v;
    $("res-kw").innerHTML = [
      `<span>Score <b>${score.toFixed(2)}</b> / 5.00</span>`,
      `<span>Range <b>${L.range}</b></span>`,
      `<span>Industry <b>${INDUSTRIES[industryIdx].name}</b></span>`,
      `<span>Answered <b>${answered}</b> / ${qCount}</span>`
    ].join("");
  } else {
    $("res-title").textContent = "Awaiting responses";
    $("res-badge").textContent = "PENDING";
    $("res-badge").style.color = "var(--accent)";
    $("res-badge").style.borderColor = "var(--accent)";
    $("res-badge").style.background = "var(--accent-soft)";
    $("res-verdict").textContent = "Complete the 30 statements to generate your executive readiness report.";
    $("res-kw").innerHTML = `<span>Answered <b>${answered}</b> / ${qCount}</span>`;
  }

  /* radar + bars */
  const s5 = ds.map(s => s === null ? 0 : s);
  const radarColor = L ? L.c : "var(--accent)";
  renderRadar(s5, radarColor);
  renderBars(ds, radarColor);

  /* playbook */
  if (L) {
    const P = PLAYBOOK[lvl];
    $("playbook").innerHTML = `
      <h4><span class="pnum">Action Playbook</span>Level ${L.lv} - ${L.name}</h4>
      <div class="pbv"><b>Primary Vulnerability</b><p>${P.vuln}</p></div>
      <div class="pba"><b>Immediate Remediation</b><p>${P.act}</p></div>`;
    $("roadmap").style.display = "";
    if (lvl <= 1) {
      $("roadmap").innerHTML = `
        <h4>90-Day Remediation Roadmap <span style="font-size:11px;color:var(--l1);letter-spacing:1.4px;text-transform:uppercase;font-family:var(--sans);font-weight:600">Mandatory before procurement</span></h4>
        <p>Level 1-2 organizations must pause software procurement and execute this targeted roadmap. Re-assess at day 90.</p>
        <div class="steps">
          ${ROADMAP.map(s => `<div class="step"><b>${s.t}</b><span>${s.d}</span></div>`).join("")}
        </div>`;
    } else {
      $("roadmap").innerHTML = `
        <h4>Mandate: Match Readiness Before Software Selection</h4>
        <p>${lvl === 2 ? "Green light granted - proceed to ERP Selection / RFP." : "Readiness validated - proceed with confidence."} Keep the steering committee active through go-live; readiness decays without sustained governance.</p>`;
    }
  } else {
    $("playbook").innerHTML = `
      <h4><span class="pnum">Action Playbook</span>Pending</h4>
      <p style="font-size:13.5px;color:var(--ink-2);line-height:1.6">The action playbook unlocks once all 30 statements receive a score.</p>`;
    $("roadmap").style.display = "none";
  }

  if (complete) toast("Readiness report finalized - " + L.name);
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}

function resetAll() {
  answers = {};
  document.querySelectorAll(".scale button").forEach(b => {
    b.classList.remove("sel"); b.setAttribute("aria-checked", "false");
  });
  update();
  toast("Assessment reset");
}

/* ================================================================
   SCROLL ANIMATIONS — IntersectionObserver for fade-up
   ================================================================ */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ================================================================
   INIT
   ================================================================ */
renderLevels();
renderIndustries();
renderDims();
update();
initScrollAnimations();

const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
const panel = document.getElementById("objectivePanel");
const list = document.getElementById("objectiveList");

const objectives = [
  {
    hour: 10,
    months: 1,
    title: "Foco nos estudos",
    tag: "Daqui 1 mes",
    detail:
      "Completar um ciclo de estudo com revisao e pratica. Dividir o conteudo em etapas semanais, estudar com foco real, resolver exercicios e registrar duvidas importantes. A meta e chegar ao fim do periodo conseguindo explicar o assunto com as proprias palavras, sem depender apenas de copiar exemplos.",
    note: "Comece escolhendo uma materia principal, reserve horarios fixos e revise o progresso toda semana.",
  },
  {
    hour: 1,
    months: 2,
    title: "Organizacao financeira",
    tag: "Daqui 2 meses",
    detail:
      "Montar uma reserva inicial, revisar gastos fixos e definir um limite claro para despesas variaveis sem comprometer contas importantes. O objetivo e entender para onde o dinheiro esta indo, cortar desperdicios pequenos que acumulam e criar uma rotina simples de controle.",
    note: "Separe entradas, contas obrigatorias, gastos livres e uma meta minima para guardar todo mes.",
  },
  {
    hour: 8,
    months: 3,
    title: "Documentos e pendencias",
    tag: "Daqui 3 meses",
    detail:
      "Resolver documentos, contas, arquivos e compromissos que costumam ficar para depois, chegando no prazo sem correria. A ideia e transformar pendencias soltas em uma lista clara, com prioridades, datas e comprovantes organizados.",
    note: "Crie uma pasta unica, confira o que vence primeiro e acompanhe tudo uma vez por semana.",
  },
  {
    hour: 5,
    months: 5,
    title: "Saude e rotina",
    tag: "Daqui 5 meses",
    detail:
      "Criar uma rotina estavel de sono, alimentacao e movimento, acompanhando o que realmente melhora energia e constancia. A meta nao e perfeicao, e consistencia: dormir melhor, ter pausas reais e reduzir habitos que deixam o dia pesado.",
    note: "Escolha poucas mudancas sustentaveis e acompanhe energia, humor e disposicao ao longo das semanas.",
  },
  {
    hour: 3,
    months: 8,
    title: "Plano profissional",
    tag: "Daqui 8 meses",
    detail:
      "Consolidar um projeto serio para apresentar como portfolio, com progresso registrado, qualidade revisada e apresentacao objetiva. O foco e construir algo que demonstre capacidade real: planejamento, execucao, acabamento e clareza para explicar decisoes.",
    note: "Divida em marcos mensais: pesquisa, prototipo, versao funcional, refinamento e apresentacao final.",
  },
];

let activeHour = null;
let markers = [];

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const size = Math.floor(canvas.getBoundingClientRect().width);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawClock();
}

function targetDate(objective, now = new Date()) {
  const date = new Date(now);
  const day = now.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + objective.months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  date.setHours(objective.hour, objective.hour === 5 ? 30 : 0, 0, 0);
  return date;
}

function remainingParts(target) {
  const total = Math.max(0, Math.floor((target - new Date()) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function objectiveByHour(hour) {
  return objectives.find((item) => item.hour === hour);
}

function setActive(hour) {
  activeHour = hour;
  document.body.classList.add("has-selection");
  panel.hidden = false;
  renderPanel();
  list.hidden = true;
  list.innerHTML = "";
  drawClock();
}

function resetSelection() {
  activeHour = null;
  document.body.classList.remove("has-selection");
  panel.hidden = true;
  list.hidden = true;
  list.innerHTML = "";
  drawClock();
}

function drawCircle(x, y, radius, fill, stroke = "#061024", line = 6) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = line;
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function drawHand(cx, cy, angle, length, width, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-width, 18);
  ctx.lineTo(width, 18);
  ctx.lineTo(width * 0.55, -length);
  ctx.lineTo(-width * 0.55, -length);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#030713";
  ctx.stroke();
  ctx.restore();
}

function drawClock() {
  const size = canvas.getBoundingClientRect().width || 620;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;
  markers = [];
  ctx.clearRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.2);
  glow.addColorStop(0, "#1bc2ff");
  glow.addColorStop(0.7, "#0d58bd");
  glow.addColorStop(1, "#083072");
  drawCircle(cx, cy, radius + 32, "#0b4da8", "#061024", 12);
  drawCircle(cx, cy, radius + 14, "#1178df", "#073066", 8);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#061024";
  ctx.stroke();

  for (let i = 0; i < 60; i += 1) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const inner = radius - (i % 5 === 0 ? 28 : 16);
    const outer = radius - 6;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
    ctx.lineWidth = i % 5 === 0 ? 5 : 2;
    ctx.strokeStyle = "#061024";
    ctx.stroke();
  }

  ctx.font = `900 ${Math.max(18, size * 0.05)}px "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let hour = 1; hour <= 12; hour += 1) {
    const angle = (hour / 12) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius * 0.72);
    const y = cy + Math.sin(angle) * (radius * 0.72);
    const isGoal = Boolean(objectiveByHour(hour));
    ctx.lineWidth = 5;
    ctx.strokeStyle = isGoal ? "#3c0610" : "#061024";
    ctx.fillStyle = isGoal ? "#ff4056" : "#fff8e8";
    ctx.strokeText(String(hour), x, y);
    ctx.fillText(String(hour), x, y);
    if (isGoal) {
      markers.push({
        hour,
        x,
        y,
        dotX: x,
        dotY: y + 34,
        radius: Math.max(58, size * 0.11),
      });
      drawCircle(x, y + 34, 9, activeHour === hour ? "#ffd34d" : "#ff4056", "#061024", 4);
    }
  }

  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;
  drawHand(cx, cy, (hours / 12) * Math.PI * 2, radius * 0.42, 10, "#071126");
  drawHand(cx, cy, (minutes / 60) * Math.PI * 2, radius * 0.66, 7, "#f5fbff");
  drawHand(cx, cy, (seconds / 60) * Math.PI * 2, radius * 0.7, 3, "#ff4056");
  drawCircle(cx, cy, 17, "#ffd34d", "#061024", 6);
}

function renderPanel() {
  if (activeHour === null) {
    panel.hidden = true;
    return;
  }
  const item = objectiveByHour(activeHour);
  const target = targetDate(item);
  const parts = remainingParts(target);
  const date = target.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  panel.innerHTML = `
    <span class="objective-tag">${item.tag}</span>
    <h2>${item.title}</h2>
    <p><strong>Prazo:</strong> ${date}, ${String(target.getHours()).padStart(2, "0")}:${String(target.getMinutes()).padStart(2, "0")}</p>
    <p>${item.detail}</p>
    <p class="objective-note">${item.note}</p>
    <div class="countdown-grid">
      <span><strong>${parts.days}</strong><small>dias</small></span>
      <span><strong>${parts.hours}</strong><small>horas</small></span>
      <span><strong>${parts.minutes}</strong><small>min</small></span>
      <span><strong>${parts.seconds}</strong><small>seg</small></span>
    </div>
    <button class="back-button" type="button" data-action="back">Voltar</button>
  `;
}

function renderList() {
  if (activeHour === null) {
    list.hidden = true;
    list.innerHTML = "";
    return;
  }
  list.hidden = false;
  list.innerHTML = objectives
    .map(
      (item) => `
        <button class="objective-item ${item.hour === activeHour ? "active" : ""}" type="button" data-hour="${item.hour}">
          <strong>${item.hour}h</strong>
          <b>${item.title}</b>
          <span>${item.tag}</span>
        </button>
      `,
    )
    .join("");
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const hit = markers.find((marker) => {
    const numberHit = Math.hypot(marker.x - x, marker.y - y) < marker.radius;
    const dotHit = Math.hypot(marker.dotX - x, marker.dotY - y) < marker.radius * 0.75;
    return numberHit || dotHit;
  });
  if (hit) setActive(hit.hour);
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  canvas.style.cursor = markers.some((marker) => {
    const numberHit = Math.hypot(marker.x - x, marker.y - y) < marker.radius;
    const dotHit = Math.hypot(marker.dotX - x, marker.dotY - y) < marker.radius * 0.75;
    return numberHit || dotHit;
  })
    ? "pointer"
    : "default";
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-hour]");
  if (!button) return;
  setActive(Number(button.dataset.hour));
});

panel.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='back']");
  if (!button) return;
  resetSelection();
});

window.addEventListener("resize", resizeCanvas);
resetSelection();
resizeCanvas();
setInterval(() => {
  drawClock();
  if (activeHour !== null) renderPanel();
}, 1000);

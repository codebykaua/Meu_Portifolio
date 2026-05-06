const skillCopy = {
  HTML: {
    title: "HTML",
    text: "Estruturo paginas com semantica, acessibilidade e uma base limpa para qualquer interface crescer sem virar bagunca."
  },
  CSS: {
    title: "CSS",
    text: "Monto layouts fluidos, componentes consistentes, microinteracoes e interfaces que seguram bem no mobile e no desktop."
  },
  JS: {
    title: "JS",
    text: "Crio interacoes, consumo APIs, organizo estados e transformo telas paradas em experiencias rapidas, claras e bem acabadas."
  },
  SQL: {
    title: "SQL",
    text: "Penso em modelagem, consultas, relacionamento entre dados e performance para o sistema nao quebrar quando crescer."
  },
  Python: {
    title: "Python",
    text: "Automatizo tarefas, trato dados, crio logica de back-end e resolvo problemas com codigo direto, legivel e poderoso."
  },
  Git: {
    title: "Git",
    text: "Versiono com disciplina, organizo branches e mantenho o historico do projeto claro para evoluir sem medo."
  },
  GitHub: {
    title: "GitHub",
    text: "Organizo repositorios, issues, pull requests e publicacao de projetos para mostrar codigo com presenca profissional."
  }
};

const terminalLines = [
  "inventario carregado: HTML, CSS, JS",
  "compilando pixels...",
  "otimizando responsividade...",
  "deploy mental concluido."
];

const typingLine = document.querySelector("#typingLine");
const slots = document.querySelectorAll(".slot");
const skillCard = document.querySelector("#skillCard");
const counters = document.querySelectorAll("[data-counter]");
const soundToggle = document.querySelector("#soundToggle");
const canvas = document.querySelector("#pixelSky");
const ctx = canvas.getContext("2d");

let terminalIndex = 0;
let charIndex = 0;
let particles = [];
let animationFrame;

function typeTerminalLine() {
  const currentLine = terminalLines[terminalIndex];
  typingLine.textContent = currentLine.slice(0, charIndex);
  charIndex += 1;

  if (charIndex <= currentLine.length) {
    window.setTimeout(typeTerminalLine, 58);
    return;
  }

  window.setTimeout(() => {
    charIndex = 0;
    terminalIndex = (terminalIndex + 1) % terminalLines.length;
    typeTerminalLine();
  }, 1300);
}

function updateSkillCard(skillName) {
  const selected = skillCopy[skillName];

  if (!selected) return;

  skillCard.querySelector("h3").textContent = selected.title;
  skillCard.querySelector("p:last-child").textContent = selected.text;
}

slots.forEach((slot) => {
  slot.addEventListener("click", () => {
    slots.forEach((item) => item.classList.remove("active"));
    slot.classList.add("active");
    updateSkillCard(slot.dataset.skill);
  });
});

function animateCounter(counter) {
  const target = Number(counter.dataset.counter);
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.dataset.done = "true";
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => observer.observe(counter));

soundToggle.addEventListener("click", () => {
  document.body.classList.toggle("scanlines");
});

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const particleCount = Math.max(38, Math.floor(window.innerWidth / 26));
  particles = Array.from({ length: particleCount }, (_, index) => ({
    x: (index * 97) % window.innerWidth,
    y: (index * 53) % window.innerHeight,
    size: 2 + ((index * 7) % 4),
    speed: 0.16 + ((index * 3) % 9) / 30,
    color: index % 5 === 0 ? "#ffd166" : index % 3 === 0 ? "#5dd7ff" : "#6ee06b"
  }));
}

function drawPixelSky() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.y += particle.speed;

    if (particle.y > window.innerHeight + 10) {
      particle.y = -10;
      particle.x = Math.random() * window.innerWidth;
    }

    ctx.fillStyle = particle.color;
    ctx.globalAlpha = 0.36;
    ctx.fillRect(
      Math.round(particle.x / 4) * 4,
      Math.round(particle.y / 4) * 4,
      particle.size,
      particle.size
    );
  });

  ctx.globalAlpha = 1;
  animationFrame = requestAnimationFrame(drawPixelSky);
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawPixelSky();
});

resizeCanvas();
drawPixelSky();
typeTerminalLine();

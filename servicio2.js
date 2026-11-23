// Yoga: filtrar clases, reservar cupos y cancelar (manipula el DOM)
const CLASES = [
  { id: 1, nombre: "Hatha suave", dia: "Lunes", hora: "07:00", nivel: "Principiante", cupos: 8 },
  { id: 2, nombre: "Vinyasa fluido", dia: "Lunes", hora: "19:00", nivel: "Intermedio", cupos: 6 },
  { id: 3, nombre: "Yoga para la espalda", dia: "Martes", hora: "08:00", nivel: "Principiante", cupos: 3 },
  { id: 4, nombre: "Power yoga", dia: "Miércoles", hora: "18:30", nivel: "Avanzado", cupos: 5 },
  { id: 5, nombre: "Meditación y respiración", dia: "Jueves", hora: "20:00", nivel: "Principiante", cupos: 10 },
  { id: 6, nombre: "Ashtanga", dia: "Viernes", hora: "07:00", nivel: "Avanzado", cupos: 1 },
  { id: 7, nombre: "Vinyasa de la tarde", dia: "Viernes", hora: "17:00", nivel: "Intermedio", cupos: 7 },
  { id: 8, nombre: "Yoga en familia", dia: "Sábado", hora: "10:00", nivel: "Principiante", cupos: 12 }
];

const contFiltros = document.getElementById("filtros");
const contClases = document.getElementById("clases");
const listaReservas = document.getElementById("reservas");
const cuenta = document.getElementById("cuenta-reservas");

let nivelActual = "Todos";
let reservas = []; // ids de las clases reservadas

function renderFiltros() {
  ["Todos", "Principiante", "Intermedio", "Avanzado"].forEach(nivel => {
    const b = document.createElement("button");
    b.textContent = nivel;
    b.dataset.nivel = nivel;
    if (nivel === nivelActual) b.classList.add("activo");
    contFiltros.appendChild(b);
  });
}

function renderClases() {
  contClases.replaceChildren();
  CLASES.filter(c => nivelActual === "Todos" || c.nivel === nivelActual).forEach(c => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "clase" + (c.cupos === 0 ? " completa" : "");

    const nivel = document.createElement("span");
    nivel.className = "nivel";
    nivel.textContent = c.nivel;
    const titulo = document.createElement("h3");
    titulo.textContent = c.nombre;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${c.dia} a las ${c.hora}`;
    const cupos = document.createElement("p");
    cupos.className = "cupos" + (c.cupos <= 2 ? " poco" : "");
    cupos.textContent = c.cupos === 0 ? "Clase completa" : `Cupos disponibles: ${c.cupos}`;

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.dataset.id = c.id;
    const yaReservada = reservas.includes(c.id);
    btn.textContent = yaReservada ? "Ya reservada" : c.cupos === 0 ? "Sin cupos" : "Reservar cupo";
    btn.disabled = yaReservada || c.cupos === 0;

    tarjeta.append(nivel, titulo, meta, cupos, btn);
    contClases.appendChild(tarjeta);
  });
}

function renderReservas() {
  listaReservas.replaceChildren();
  cuenta.textContent = reservas.length;
  if (reservas.length === 0) {
    const li = document.createElement("li");
    li.className = "vacio";
    li.textContent = "Todavía no reservaste ninguna clase.";
    listaReservas.appendChild(li);
    return;
  }
  reservas.forEach(id => {
    const c = CLASES.find(x => x.id === id);
    const li = document.createElement("li");
    const txt = document.createElement("span");
    txt.textContent = `${c.nombre}, ${c.dia} ${c.hora}`;
    const cancelar = document.createElement("button");
    cancelar.dataset.id = id;
    cancelar.textContent = "Cancelar";
    li.append(txt, cancelar);
    listaReservas.appendChild(li);
  });
}

contFiltros.addEventListener("click", e => {
  if (!e.target.dataset.nivel) return;
  nivelActual = e.target.dataset.nivel;
  contFiltros.querySelectorAll("button").forEach(b => b.classList.toggle("activo", b === e.target));
  renderClases();
});

contClases.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  const c = CLASES.find(x => x.id === id);
  if (c.cupos > 0 && !reservas.includes(id)) {
    c.cupos--;
    reservas.push(id);
    renderClases();
    renderReservas();
  }
});

listaReservas.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  CLASES.find(x => x.id === id).cupos++;
  reservas = reservas.filter(r => r !== id);
  renderClases();
  renderReservas();
});

renderFiltros();
renderClases();
renderReservas();

// Barbería: elegir servicios, calcular el total y reservar (manipula el DOM)
const SERVICIOS = [
  { id: "corte", nombre: "Corte clásico", precio: 50, min: 40 },
  { id: "barba", nombre: "Arreglo de barba", precio: 30, min: 25 },
  { id: "combo", nombre: "Corte + barba", precio: 70, min: 60 },
  { id: "afeitado", nombre: "Afeitado con toalla caliente", precio: 40, min: 30 },
  { id: "cejas", nombre: "Perfilado de cejas", precio: 15, min: 10 },
  { id: "tinte", nombre: "Tinte de cabello", precio: 60, min: 50 }
];

const lista = document.getElementById("lista-servicios");
const form = document.getElementById("form");
const selHora = document.getElementById("hora");
const inputFecha = document.getElementById("fecha");
const errorMsg = document.getElementById("error");
const confirmacion = document.getElementById("confirmacion");

// Crea las opciones de servicios
SERVICIOS.forEach(s => {
  const label = document.createElement("label");
  label.className = "servicio";
  const check = document.createElement("input");
  check.type = "checkbox";
  check.value = s.id;
  const nombre = document.createElement("span");
  nombre.className = "nombre";
  nombre.textContent = s.nombre;
  const duracion = document.createElement("small");
  duracion.textContent = s.min + " min";
  nombre.appendChild(duracion);
  const precio = document.createElement("span");
  precio.className = "precio";
  precio.textContent = "Bs " + s.precio;
  label.append(check, nombre, precio);
  lista.appendChild(label);
});

// Horas disponibles de 09:00 a 18:00
for (let h = 9; h <= 18; h++) {
  const op = document.createElement("option");
  op.value = op.textContent = String(h).padStart(2, "0") + ":00";
  selHora.appendChild(op);
}

// La fecha mínima es hoy
const hoy = new Date();
inputFecha.min = hoy.getFullYear() + "-" + String(hoy.getMonth() + 1).padStart(2, "0") + "-" + String(hoy.getDate()).padStart(2, "0");

function elegidos() {
  const ids = [...lista.querySelectorAll("input:checked")].map(i => i.value);
  return SERVICIOS.filter(s => ids.includes(s.id));
}

function actualizarResumen() {
  const sel = elegidos();
  document.getElementById("total").textContent = "Bs " + sel.reduce((t, s) => t + s.precio, 0);
  document.getElementById("duracion").textContent = sel.reduce((t, s) => t + s.min, 0) + " min";
}

lista.addEventListener("change", e => {
  e.target.closest(".servicio").classList.toggle("marcado", e.target.checked);
  actualizarResumen();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const sel = elegidos();
  confirmacion.replaceChildren();

  if (sel.length === 0) { errorMsg.textContent = "Elige al menos un servicio."; return; }
  if (nombre.length < 3) { errorMsg.textContent = "Escribe tu nombre (mínimo 3 letras)."; return; }
  if (!inputFecha.value) { errorMsg.textContent = "Elige una fecha para tu visita."; return; }
  errorMsg.textContent = "";

  const caja = document.createElement("div");
  caja.className = "ok";
  const titulo = document.createElement("h3");
  titulo.textContent = "Reserva confirmada, " + nombre;
  const detalle = document.createElement("p");
  detalle.textContent = `Te esperamos el ${inputFecha.value} a las ${selHora.value}.`;
  const ul = document.createElement("ul");
  sel.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.nombre}: Bs ${s.precio}`;
    ul.appendChild(li);
  });
  const total = document.createElement("p");
  total.innerHTML = "<strong></strong>";
  total.firstChild.textContent = "Total a pagar: " + document.getElementById("total").textContent;
  caja.append(titulo, detalle, ul, total);
  confirmacion.appendChild(caja);
  caja.scrollIntoView({ behavior: "smooth", block: "center" });
});

actualizarResumen();

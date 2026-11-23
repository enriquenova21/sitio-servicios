// Script común del sitio (se usa en todas las páginas)
document.documentElement.classList.add("js");

// Año actual en el pie de página
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

// Marca en el menú la página donde estás
const actual = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".top nav a").forEach(a => {
  a.classList.toggle("actual", a.getAttribute("href") === actual);
});

// Aparición suave de los elementos al hacer scroll
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(el => obs.observe(el));
} else {
  items.forEach(el => el.classList.add("visible"));
}

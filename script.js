function iniciarCarrusel() {
  let articulos = [];
  let indiceActual = 0;
  const articulosPorVista = 2;

  const carrusel = document.getElementById("carruselArticulos");
  const btnSiguiente = document.getElementById("btnSiguiente");
  const btnAnterior = document.getElementById("btnAnterior");

  if (!carrusel || !btnSiguiente || !btnAnterior) {
    return;
  }

  fetch("articulos.json")
    .then(response => response.json())
    .then(data => {
      articulos = data;
      mostrarArticulos();
    })
    .catch(error => {
      console.error("Error cargando articulos.json:", error);
    });

  function mostrarArticulos() {
    carrusel.innerHTML = "";

    const grupo = articulos.slice(indiceActual, indiceActual + articulosPorVista);

    grupo.forEach((articulo, index) => {
      const card = document.createElement("article");

      if (index === 0) {
        card.className = "card-articulo card-destacada";
      } else {
        card.className = "card-articulo";
      }

      card.innerHTML = `
        <img src="${articulo.imagen}" alt="${articulo.titulo}">
        <div class="card-texto">
          <h3>${articulo.titulo}</h3>
          <p>${articulo.descripcion}</p>
          <a href="${articulo.link}" class="boton-leer">Seguir Leyendo</a>
        </div>
      `;

      carrusel.appendChild(card);
    });
  }

  btnSiguiente.addEventListener("click", () => {
    indiceActual += articulosPorVista;

    if (indiceActual >= articulos.length) {
      indiceActual = 0;
    }

    mostrarArticulos();
  });

  btnAnterior.addEventListener("click", () => {
    indiceActual -= articulosPorVista;

    if (indiceActual < 0) {
      indiceActual = Math.max(articulos.length - articulosPorVista, 0);
    }

    mostrarArticulos();
  });
}

function iniciarNavbar() {
  const navbar = document.getElementById("navbar");

  if (!navbar) {
    console.error("No se encontró #navbar");
    return;
  }

  function revisarScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  revisarScroll();
  window.addEventListener("scroll", revisarScroll);
}

function iniciarMenuMovil() {
  const boton = document.getElementById("menuToggle");
  const menu = document.getElementById("menuNavbar");

  if (!boton || !menu) {
    return;
  }

  boton.addEventListener("click", () => {
    menu.classList.toggle("activo");
  });
}


function cargarArticulo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  fetch("articulo-completo.json")
    .then(res => res.json())
    .then(data => {
      const articulo = data.find(a => a.id === id);

      if (!articulo) return;

      document.getElementById("articuloTitulo").textContent = articulo.titulo;
      document.getElementById("articuloSubtitulo").textContent = articulo.subtitulo;
      document.getElementById("articuloAutor").textContent = articulo.autor;
      document.getElementById("articuloFecha").textContent = articulo.fecha;
      document.getElementById("articuloImagen").src = articulo.imagen;

      const cuerpo = document.getElementById("articuloCuerpo");
      cuerpo.innerHTML = "";

      articulo.cuerpo.forEach(parrafo => {
        const p = document.createElement("p");
        p.textContent = parrafo;
        cuerpo.appendChild(p);
      });
    });
}


document.addEventListener("DOMContentLoaded", () => {
  if (typeof cargarArticulo === "function") {
    cargarArticulo();
  }
});

function iniciarDropdownMovil() {
  const dropdown = document.querySelector(".dropdown");
  const boton = document.querySelector(".dropdown-toggle");
  const menu = document.querySelector(".dropdown-menu");

  if (!dropdown || !boton || !menu) return;

  boton.addEventListener("click", () => {
    menu.classList.toggle("activo");
  });
}
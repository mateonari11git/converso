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

function cargarCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoriaId = params.get("id");

  if (!categoriaId) return;

  const tituloCategoria = document.getElementById("categoriaTitulo");
  const descripcionCategoria = document.getElementById("categoriaDescripcion");
  const contenedor = document.getElementById("categoriaContenido");

  if (!tituloCategoria || !descripcionCategoria || !contenedor) return;

  Promise.all([
    fetch("categorias.json").then(res => res.json()),
    fetch("articulos.json").then(res => res.json())
  ])
    .then(([categorias, articulos]) => {
      const categoria = categorias.find(cat => cat.id === categoriaId);

      if (!categoria) {
        tituloCategoria.textContent = "Categoría no encontrada";
        descripcionCategoria.textContent = "La sección solicitada no existe.";
        return;
      }

      tituloCategoria.textContent = categoria.titulo;
      descripcionCategoria.textContent = categoria.descripcion;

      const articulosFiltrados = articulos.filter(
        articulo => articulo.categoria === categoriaId
      );

      contenedor.innerHTML = "";

      if (articulosFiltrados.length === 0) {
        contenedor.innerHTML = "<p>No hay artículos disponibles en esta sección todavía.</p>";
        return;
      }

      articulosFiltrados.forEach(articulo => {
        const card = document.createElement("article");
        card.className = "card-articulo";

        card.innerHTML = `
          <img src="${articulo.imagen}" alt="${articulo.titulo}">
          <div class="card-texto">
            <h3>${articulo.titulo}</h3>
            <p>${articulo.descripcion}</p>
            <a href="${articulo.link}" class="boton-leer">Seguir Leyendo</a>
          </div>
        `;

        contenedor.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error cargando la categoría:", error);
    });
}

function iniciarFormularioContacto() {
  const formulario = document.getElementById("formularioContacto");

  if (!formulario) return;

  formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const comentario = document.getElementById("comentario").value;

    const numeroWhatsApp = "573175004066";

    const mensaje = `Hola, soy ${nombre}.%0A%0ACorreo: ${correo}%0ATeléfono: ${telefono}%0A%0AComentario:%0A${comentario}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    window.open(url, "_blank");
  });
}

function cargarEdicion() {
  const flipbookElemento = document.getElementById("flipbook");

  if (!flipbookElemento) return;

  const params = new URLSearchParams(window.location.search);
  const edicionId = params.get("id");

  if (!edicionId) return;

  fetch("ediciones.json")
    .then(res => res.json())
    .then(ediciones => {
      const edicion = ediciones.find(item => item.id === edicionId);

      if (!edicion) {
        document.getElementById("edicionTitulo").textContent = "Edición no encontrada";
        document.getElementById("edicionDescripcion").textContent = "La edición solicitada no existe.";
        return;
      }

      document.getElementById("edicionTitulo").textContent = edicion.titulo;
      document.getElementById("edicionDescripcion").textContent = edicion.descripcion;

      const pageFlip = new St.PageFlip(flipbookElemento, {
        width: 1000,
        height: 1414,

        size: "fixed",

        minWidth: 1000,
        maxWidth: 1000,

        minHeight: 1414,
        maxHeight: 1414,

        autoSize: false,

        showCover: true,
        usePortrait: false,

        drawShadow: true,
        maxShadowOpacity: 0.25,

        mobileScrollSupport: false,
        clickEventForward: true
      });

      pageFlip.loadFromImages(edicion.paginas);

      let zoomManual = 1;

        function ajustarFlipbook() {
        const wrapper = document.getElementById("flipbookWrapper");

        if (!wrapper) return;

        const anchoBase = 2000;
        const altoBase = 1414;

        const escalaBase = Math.min(
            wrapper.clientWidth / anchoBase,
            wrapper.clientHeight / altoBase
        );

        const escalaFinal = escalaBase * zoomManual;

        flipbookElemento.style.transform = `scale(${escalaFinal})`;
        }

      setTimeout(ajustarFlipbook, 200);
      window.addEventListener("resize", ajustarFlipbook);

      document.addEventListener("fullscreenchange", () => {
        setTimeout(ajustarFlipbook, 200);
      });

      const btnZoomIn = document.getElementById("btnZoomIn");
        const btnZoomOut = document.getElementById("btnZoomOut");

        btnZoomIn.addEventListener("click", () => {
        zoomManual += 0.1;

        if (zoomManual > 2.5) {
            zoomManual = 2.5;
        }

        ajustarFlipbook();
        });

        btnZoomOut.addEventListener("click", () => {
        zoomManual -= 0.1;

        if (zoomManual < 0.5) {
            zoomManual = 0.5;
        }

        ajustarFlipbook();
        });

      const contador = document.getElementById("contadorPaginas");

      function actualizarContador() {
        const paginaActual = pageFlip.getCurrentPageIndex() + 1;
        contador.textContent = `Página ${paginaActual} de ${edicion.paginas.length}`;
      }

      pageFlip.on("flip", actualizarContador);
      actualizarContador();

      document.getElementById("btnPaginaAnterior").addEventListener("click", () => {
        pageFlip.flipPrev();
      });

      document.getElementById("btnPaginaSiguiente").addEventListener("click", () => {
        pageFlip.flipNext();
      });

      const btnPantallaCompleta = document.getElementById("btnPantallaCompleta");
      const wrapper = document.getElementById("flipbookWrapper");

      btnPantallaCompleta.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          wrapper.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      });
    })
    .catch(error => {
      console.error("Error cargando edición:", error);
    });
}
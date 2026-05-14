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

fetch("contenidos.json")
  .then(response => response.json())
  .then(data => {
    articulos = data.items.filter(item => item.tipo === "articulo" || item.tipo === "edicion");
    mostrarArticulos();
  })

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
          <a href="${articulo.tipo === "edicion" ? `edicion.html?id=${articulo.id}` : `articulo.html?id=${articulo.id}`}" class="boton-leer">Seguir Leyendo</a>
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

    fetch("contenidos.json")
    .then(res => res.json())
    .then(data => {
        const articulo = data.items.find(a => a.id === id && a.tipo === "articulo");

      if (!articulo) return;

      document.getElementById("articuloTitulo").textContent = articulo.titulo;
      document.getElementById("articuloSubtitulo").textContent = articulo.subtitulo;
      document.getElementById("articuloAutor").textContent = articulo.autor;
      document.getElementById("articuloFecha").textContent = articulo.fecha;
      document.getElementById("articuloImagen").src = articulo.imagen;

      const cuerpo = document.getElementById("articuloCuerpo");
      cuerpo.innerHTML = "";

      articulo.contenido.forEach(bloque => {
        if (bloque.type === "texto") {
            const p = document.createElement("p");
            p.innerHTML = marked.parse(bloque.contenido);
            cuerpo.appendChild(p);
        }

        if (bloque.type === "imagen") {
            const figure = document.createElement("figure");
            figure.className = "imagen-cuerpo-articulo";

            figure.innerHTML = `
            <img src="${bloque.url}" alt="${bloque.alt || ""}">
            ${bloque.alt ? `<figcaption>${bloque.alt}</figcaption>` : ""}
            `;

            cuerpo.appendChild(figure);
        }
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
    fetch("contenidos.json").then(res => res.json())
    ])
    .then(([categorias, contenidos]) => {
        const articulos = contenidos.items;

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
            <a href="${articulo.tipo === "edicion" ? `edicion.html?id=${articulo.id}` : `articulo.html?id=${articulo.id}`}" class="boton-leer">Seguir Leyendo</a>
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

  fetch("contenidos.json")
    .then(res => res.json())
    .then(data => {
        const edicion = data.items.find(item => item.id === edicionId && item.tipo === "edicion");

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

        mobileScrollSupport: true,
        useMouseEvents: false,
        swipeDistance: 999999,
        disableFlipByClick: true,
        clickEventForward: false
      });

      pageFlip.loadFromImages(edicion.paginas);

      // Permitir desplazamiento manual sobre el contenido del flipbook en móvil
      let touchStartX = 0;
      let touchStartY = 0;
      let scrollStartLeft = 0;
      let scrollStartTop = 0;

      flipbookElemento.addEventListener("touchstart", function(event) {
        if (event.touches.length !== 1) return;

        const wrapperPan = document.getElementById("flipbookWrapper");

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

        scrollStartLeft = wrapperPan.scrollLeft;
        scrollStartTop = wrapperPan.scrollTop;
      }, { passive: true, capture: true });

      flipbookElemento.addEventListener("touchmove", function(event) {
        if (event.touches.length !== 1) return;

        const wrapperPan = document.getElementById("flipbookWrapper");

        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;

        const deltaX = touchStartX - touchX;
        const deltaY = touchStartY - touchY;

        wrapperPan.scrollLeft = scrollStartLeft + deltaX;
        wrapperPan.scrollTop = scrollStartTop + deltaY;

        event.preventDefault();
        event.stopPropagation();
      }, { passive: false, capture: true });

      let zoomManual = 1;

        function ajustarFlipbook() {
        const wrapper = document.getElementById("flipbookWrapper");
        const shell = document.getElementById("flipbookShell");

        if (!wrapper) return;

        const anchoBase = 2000;
        const altoBase = 1414;

        const escalaBase = Math.min(
            wrapper.clientWidth / anchoBase,
            wrapper.clientHeight / altoBase
        );

        const escalaFinal = escalaBase * zoomManual;

        const canvas = document.getElementById("flipbookCanvas");

        flipbookElemento.style.transform = `scale(${escalaFinal})`;
        flipbookElemento.style.transformOrigin = "top left";

        if (canvas) {
          canvas.style.width = `${anchoBase * escalaFinal}px`;
          canvas.style.height = `${altoBase * escalaFinal}px`;
        }

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
          shell.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      });
    })
    .catch(error => {
      console.error("Error cargando edición:", error);
    });
}

function iniciarEventos() {
  const calendarioGrid = document.getElementById("calendarioGrid");
  const eventosPanel = document.getElementById("eventosPanel");
  const mesActual = document.getElementById("mesActual");

  if (!calendarioGrid || !eventosPanel) return;

  const fechaActual = new Date();
  let mes = fechaActual.getMonth();
  let anio = fechaActual.getFullYear();

  fetch("eventos.json")
    .then(res => res.json())
    .then(data => {
        const eventos = data.items;

      function renderCalendario() {
        calendarioGrid.innerHTML = "";

        const primerDia = new Date(anio, mes, 1);
        const ultimoDia = new Date(anio, mes + 1, 0);

        const nombresMeses = [
          "Enero", "Febrero", "Marzo", "Abril",
          "Mayo", "Junio", "Julio", "Agosto",
          "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        mesActual.textContent = `${nombresMeses[mes]} ${anio}`;

        let inicio = primerDia.getDay();
        if (inicio === 0) inicio = 7;

        for (let i = 1; i < inicio; i++) {
          const vacio = document.createElement("div");
          calendarioGrid.appendChild(vacio);
        }

        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {

          const fechaTexto =
            `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

          const divDia = document.createElement("div");
          divDia.className = "dia";
          divDia.textContent = dia;

          const eventoDelDia = eventos.find(e => e.fecha === fechaTexto);

          if (eventoDelDia) {
            divDia.classList.add("evento");

            divDia.addEventListener("click", () => {
              abrirEvento(eventoDelDia.id);

              document.querySelectorAll(".dia").forEach(d => {
                d.classList.remove("activo");
              });

              divDia.classList.add("activo");
            });
          }

          calendarioGrid.appendChild(divDia);
        }
      }

      function renderEventos() {
        eventosPanel.innerHTML = "";

        eventos.forEach(evento => {

          const card = document.createElement("div");
          card.className = "evento-card";
          card.dataset.id = evento.id;

          card.innerHTML = `
            <div class="evento-titulo">
              <div class="evento-info">
                <h3>${evento.titulo}</h3>
                <span>${evento.fecha} — ${evento.hora}</span>
              </div>
            </div>

            <div class="evento-descripcion">
              <p>${evento.descripcion}</p>
            </div>
          `;

          card.querySelector(".evento-titulo").addEventListener("click", () => {
            abrirEvento(evento.id);
          });

          eventosPanel.appendChild(card);
        });
      }

      function abrirEvento(id) {

        document.querySelectorAll(".evento-card").forEach(card => {
          card.classList.remove("activo");
        });

        const cardActiva = document.querySelector(`.evento-card[data-id="${id}"]`);

        if (cardActiva) {
          cardActiva.classList.add("activo");

          cardActiva.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }

        const evento = eventos.find(e => e.id === id);

        if (!evento) return;

        document.querySelectorAll(".dia").forEach(d => {
          d.classList.remove("activo");

          if (d.textContent == parseInt(evento.fecha.split("-")[2])) {
            d.classList.add("activo");
          }
        });
      }

      renderCalendario();
      renderEventos();

      document.getElementById("mesAnterior").addEventListener("click", () => {
        mes--;

        if (mes < 0) {
          mes = 11;
          anio--;
        }

        renderCalendario();
      });

      document.getElementById("mesSiguiente").addEventListener("click", () => {
        mes++;

        if (mes > 11) {
          mes = 0;
          anio++;
        }

        renderCalendario();
      });
    });
}

function cargarEventosHome() {
  const contenedor = document.getElementById("eventosHomeLista");

  if (!contenedor) return;

  fetch("eventos.json")
    .then(res => res.json())
    .then(data => {
      const eventos = data.items;

      contenedor.innerHTML = "";

      if (!eventos || eventos.length === 0) {
        contenedor.innerHTML = "<p>No hay eventos programados por ahora.</p>";
        return;
      }

      eventos.forEach(evento => {
        const card = document.createElement("div");
        card.className = "evento-home-card";

        card.innerHTML = `
          <div class="evento-home-titulo">
            <div class="evento-home-info">
              <h3>${evento.titulo}</h3>
              <span>${evento.fecha} — ${evento.hora}</span>
            </div>
            <div class="evento-home-icono">+</div>
          </div>

          <div class="evento-home-descripcion">
            <p>${evento.descripcion}</p>
          </div>
        `;

        card.querySelector(".evento-home-titulo").addEventListener("click", () => {
          card.classList.toggle("activo");

          const icono = card.querySelector(".evento-home-icono");
          icono.textContent = card.classList.contains("activo") ? "−" : "+";
        });

        contenedor.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error cargando eventos en home:", error);
    });
}

function cargarNotasFeed() {
  const contenedor = document.getElementById("feedNotas");

  if (!contenedor) return;

  fetch("notas.json")
    .then(res => res.json())
    .then(data => {
        const notas = data.items;
      
        contenedor.innerHTML = "";

      notas.forEach(nota => {
        const item = document.createElement("article");
        item.className = "nota-feed";

        let contenidoHTML = "";

        if (nota.tipo === "texto") {
          contenidoHTML = `<p>${nota.contenido}</p>`;
        }

        if (nota.tipo === "link") {
          contenidoHTML = `
            <p>${nota.contenido}</p>
            <a href="${nota.url}" target="_blank" rel="noopener">Abrir enlace</a>
          `;
        }

        if (nota.tipo === "imagen") {
          const rutaImagen = nota.imagen.startsWith("/")
            ? nota.imagen
            : `/${nota.imagen}`;

          let imagenHTML = `
            <img src="${rutaImagen}" alt="${nota.contenido}">
          `;

          if (nota.url) {
            imagenHTML = `
              <a href="${nota.url}" target="_blank" rel="noopener">
                <img src="${rutaImagen}" alt="${nota.contenido}">
              </a>
            `;
          }

          contenidoHTML = `
            <p>${nota.contenido}</p>
            ${imagenHTML}
          `;
        }

        item.innerHTML = `
          <div class="nota-meta">
            <strong>${nota.usuario}</strong>
            <span>${nota.fecha} · ${nota.hora}</span>
          </div>

          <div class="nota-contenido">
            ${contenidoHTML}
          </div>
        `;

        contenedor.appendChild(item);
      });
    })
    .catch(error => {
      console.error("Error cargando notas:", error);
    });
}
async function cargarComponentes() {
  const elementos = document.querySelectorAll("[data-include]");

  for (const elemento of elementos) {
    const archivo = elemento.getAttribute("data-include");

    try {
      const respuesta = await fetch(archivo);
      const contenido = await respuesta.text();
      elemento.innerHTML = contenido;
    } catch (error) {
      console.error("Error cargando componente:", archivo, error);
    }
  }

  if (typeof iniciarCarrusel === "function") {
    iniciarCarrusel();
  }

  if (typeof cargarEventosHome === "function") {
  cargarEventosHome();
}

if (typeof cargarNotasFeed === "function") {
  cargarNotasFeed();
}

  if (typeof iniciarNavbar === "function") {
  iniciarNavbar();
 }

 if (typeof iniciarMenuMovil === "function") {
  iniciarMenuMovil();
}

if (typeof iniciarDropdownMovil === "function") {
  iniciarDropdownMovil();
}

}

if (typeof cargarCategoria === "function") {
  cargarCategoria();
}

if (typeof cargarEdicion === "function") {
  cargarEdicion();
}

if (typeof iniciarEventos === "function") {
  iniciarEventos();
}



document.addEventListener("DOMContentLoaded", cargarComponentes);


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
  if (typeof iniciarNavbar === "function") {
  iniciarNavbar();
 }
}

document.addEventListener("DOMContentLoaded", cargarComponentes);
document.addEventListener("DOMContentLoaded", () => {
  const fechaBoda = new Date("2024-07-13T20:00:00");
  const diasRestantesElement = document.getElementById("dias-restantes");
  const horasRestantesElement = document.getElementById("horas-restantes");
  const minutosRestantesElement = document.getElementById("minutos-restantes");
  const segundosRestantesElement =
    document.getElementById("segundos-restantes");

  function calcularTiempoRestante(fechaFutura) {
    const fechaActual = new Date();
    const diferencia = fechaFutura - fechaActual;

    const diasRestantes = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horasRestantes = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutosRestantes = Math.floor(
      (diferencia % (1000 * 60 * 60)) / (1000 * 60)
    );
    const segundosRestantes = Math.floor((diferencia % (1000 * 60)) / 1000);

    return {
      dias: diasRestantes,
      horas: horasRestantes,
      minutos: minutosRestantes,
      segundos: segundosRestantes,
    };
  }

  function actualizarContador() {
    const tiempoRestante = calcularTiempoRestante(fechaBoda);
    diasRestantesElement.textContent = tiempoRestante.dias;
    horasRestantesElement.textContent = tiempoRestante.horas;
    minutosRestantesElement.textContent = tiempoRestante.minutos;
    segundosRestantesElement.textContent = tiempoRestante.segundos;
  }

  actualizarContador();
  setInterval(actualizarContador, 1000);

  function suma(...numeros) {
    return numeros.reduce((total, num) => total + num, 0);
  }

  function cargarDatosInvitado(id) {
    fetch("invitados.json")
      .then((response) => response.json())
      .then((data) => {
        const invitado = data.find((inv) => inv.id === id);
        // Obtener todos los pases de los invitados
        const pases = data.map((invitado) => invitado.pases);

        // Calcular la suma de los pases
        const totalPases = suma(...pases);

        if (invitado) {
          const pluralPases = invitado.pases > 1 ? "s" : "";
          const mensaje = `
            <h2>¡Bienvenido${pluralPases}, ${invitado.nombre}!</h2>
            <p>Estamos emocionados de compartir este día especial contigo${
              pluralPases ? " y tu familia" : ""
            }.</p>
            <p>Toda la información detallada está disponible en tu invitación.</p>
            <strong>${
              invitado.pases > 1 ? "Por favor, respeten" : " Por favor, respete"
            } el número de ${
            invitado.pases
          } pase${pluralPases} asignado${pluralPases}.</strong>
          `;
          document.getElementById(
            "contenido"
          ).innerHTML = `<div>${mensaje}</div>`;
        } else {
          document.getElementById(
            "contenido"
          ).innerHTML = `<p>No se encontró la invitación.</p>`;
        }
      })
      .catch((error) => {
        console.error("Error al cargar los datos de invitados:", error);
        document.getElementById(
          "contenido"
        ).innerHTML = `<p>Error al cargar los datos.</p>`;
      });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const invitacionId = urlParams.get("id");
  if (invitacionId) {
    cargarDatosInvitado(invitacionId);
  } else {
    document.getElementById(
      "contenido"
    ).innerHTML = `<p>No se especificó un ID válido en la URL.</p>`;
  }

  // Event listener para copiar texto
  document.getElementById("btn-copiar").addEventListener("click", copiarTexto);

  // Event listener para abrir en Google Maps
  document
    .getElementById("btn-maps")
    .addEventListener("click", abrirEnGoogleMaps);

  function copiarTexto() {
    const texto = document.getElementById("texto-copiar").innerText;
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        alert("Texto copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar el texto: ", err);
        alert("No se pudo copiar el texto. Por favor, inténtalo manualmente.");
      });
  }

  function abrirEnGoogleMaps() {
    const direccion = "Calle Venus 1634 32540 Ciudad Juárez, México";
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(direccion);
    window.open(url, "_blank");
  }
});

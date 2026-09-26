(function () {
  const { SUPABASE_URL, SUPABASE_KEY, VERSION_POLITICA } = window.CONFIG;

  const form = document.getElementById("form");
  const boton = document.getElementById("boton");
  const mensaje = document.getElementById("mensaje");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Guarda de dónde viene la persona (p. ej. ?utm_source=instagram en el enlace de la bio)
  const params = new URLSearchParams(location.search);
  const origen = (params.get("utm_source") || params.get("ref") || "directo").slice(0, 50);

  function mostrarError(texto) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje error";
  }

  function mostrarGracias(nombre) {
    document.getElementById("nombre-gracias").textContent = nombre;
    document.getElementById("bloque-form").hidden = true;
    document.getElementById("gracias").hidden = false;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    mensaje.textContent = "";

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim().toLowerCase();

    // Bot: rellenó el campo oculto. Fingimos éxito sin guardar nada.
    if (form.empresa_web.value) return mostrarGracias(nombre);

    if (!nombre) return mostrarError("Escribe tu nombre.");
    if (!EMAIL_RE.test(email)) return mostrarError("Revisa tu correo electrónico.");
    if (!form.consentimiento.checked) return mostrarError("Necesito tu consentimiento para poder escribirte.");

    boton.disabled = true;
    boton.textContent = "Enviando…";

    try {
      const res = await fetch(SUPABASE_URL + "/rest/v1/suscriptores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          consentimiento: true,
          version_politica: VERSION_POLITICA,
          origen: origen
        })
      });

      // 409 = el correo ya estaba en la lista: para la persona también es un éxito
      if (res.ok || res.status === 409) return mostrarGracias(nombre);

      throw new Error("HTTP " + res.status);
    } catch (err) {
      console.error(err);
      mostrarError("No se ha podido enviar. Inténtalo de nuevo en unos minutos.");
      boton.disabled = false;
      boton.textContent = "Quiero recibirlo";
    }
  });
})();

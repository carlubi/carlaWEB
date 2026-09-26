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

  const MENSAJES = {
    nuevo: {
      titulo: "¡Ya estás dentro! ✅",
      texto: "Gracias, {n}. Te escribiré pronto con ideas y nuevas noticias sobre IA que puedas aplicar en tu día a día."
    },
    existente: {
      titulo: "¡Ya estás en la lista! ✅",
      texto: "{n}, este correo ya lo tengo registrado. No hace falta que hagas nada más: pronto recibirás mis ideas sobre IA."
    },
    reactivado: {
      titulo: "¡Qué bien verte de nuevo! 🎉",
      texto: "{n}, ya vuelves a estar de alta. Me alegra que te interese de nuevo la IA."
    }
  };

  function mostrarGracias(nombre, estado) {
    const m = MENSAJES[estado] || MENSAJES.nuevo;
    document.getElementById("titulo-gracias").textContent = m.titulo;
    document.getElementById("texto-gracias").textContent = m.texto.replace("{n}", nombre);
    document.getElementById("bloque-form").hidden = true;
    document.getElementById("gracias").hidden = false;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    mensaje.textContent = "";

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim().toLowerCase();

    // Bot: rellenó el campo oculto. Fingimos éxito sin guardar nada.
    if (form.empresa_web.value) return mostrarGracias(nombre, "nuevo");

    if (!nombre) return mostrarError("Escribe tu nombre.");
    if (!EMAIL_RE.test(email)) return mostrarError("Revisa tu correo electrónico.");
    if (!form.consentimiento.checked) return mostrarError("Necesito tu consentimiento para poder escribirte.");

    boton.disabled = true;
    boton.textContent = "Enviando…";

    try {
      const res = await fetch(SUPABASE_URL + "/rest/v1/rpc/suscribir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY
        },
        body: JSON.stringify({
          p_nombre: nombre,
          p_email: email,
          p_version: VERSION_POLITICA,
          p_origen: origen
        })
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      // La función devuelve "nuevo", "existente" o "reactivado"
      return mostrarGracias(nombre, await res.json());
    } catch (err) {
      console.error(err);
      mostrarError("No se ha podido enviar. Inténtalo de nuevo en unos minutos.");
      boton.disabled = false;
      boton.textContent = "Quiero recibirlo";
    }
  });
})();

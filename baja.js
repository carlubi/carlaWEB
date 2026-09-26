(function () {
  const { SUPABASE_URL, SUPABASE_KEY } = window.CONFIG;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const bloque = document.getElementById("bloque-confirmar");
  const hecho = document.getElementById("hecho");
  const sinEnlace = document.getElementById("sin-enlace");
  const boton = document.getElementById("boton-baja");
  const mensaje = document.getElementById("mensaje");

  // El id de cada suscriptor irá en el enlace de baja de cada correo,
  // p. ej. https://tuweb.com/baja.html?id=<id-del-suscriptor>
  const id = new URLSearchParams(location.search).get("id");

  if (!id || !UUID_RE.test(id)) {
    bloque.hidden = true;
    sinEnlace.hidden = false;
    return;
  }

  boton.addEventListener("click", async function () {
    boton.disabled = true;
    boton.textContent = "Procesando…";
    mensaje.textContent = "";

    try {
      const res = await fetch(
        SUPABASE_URL + "/rest/v1/suscriptores?id=eq." + encodeURIComponent(id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Prefer: "return=minimal"
          },
          body: JSON.stringify({ baja_at: new Date().toISOString() })
        }
      );

      if (!res.ok) throw new Error("HTTP " + res.status);

      bloque.hidden = true;
      hecho.hidden = false;
    } catch (err) {
      console.error(err);
      mensaje.textContent = "No se ha podido procesar la baja. Inténtalo de nuevo en unos minutos.";
      mensaje.className = "mensaje error";
      boton.disabled = false;
      boton.textContent = "Sí, darme de baja";
    }
  });
})();

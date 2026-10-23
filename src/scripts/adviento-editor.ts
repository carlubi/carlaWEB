const editor = document.getElementById('local-editor');

if (editor && ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  const day = Number(document.getElementById('day-app')?.dataset.day);
  const endpoint = `/__adviento_editor?dia=${day}`;
  const form = document.getElementById('editor-form') as HTMLFormElement;
  const panel = document.getElementById('editor-panel') as HTMLElement;
  const toggle = document.getElementById('editor-toggle') as HTMLButtonElement;
  const status = document.getElementById('editor-status') as HTMLElement;
  const body = document.getElementById('editor-body') as HTMLTextAreaElement;
  const picker = document.getElementById('editor-file') as HTMLInputElement;
  const save = document.getElementById('editor-save') as HTMLButtonElement;
  let dirty = false;
  let uploadKind:'image'|'document' = 'image';

  function setStatus(message:string, failed = false) {
    status.textContent = message;
    status.classList.toggle('is-error', failed);
  }
  async function request(url:string, options?:RequestInit) {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudo guardar.');
    return result;
  }
  function insert(text:string, atEnd = false) {
    const start = atEnd ? body.value.length : body.selectionStart;
    const end = atEnd ? start : body.selectionEnd;
    body.setRangeText(text, start, end, 'end');
    body.focus(); dirty = true;
  }
  function fileBase64(file:File):Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(new Error('No se ha podido leer el archivo.'));
      reader.readAsDataURL(file);
    });
  }
  async function open() {
    panel.hidden = false; toggle.setAttribute('aria-expanded', 'true'); toggle.textContent = 'Cerrar editor';
    if (form.dataset.loaded) return;
    setStatus('Cargando contenido…');
    try {
      const data = await request(endpoint);
      for (const [name, value] of Object.entries(data)) {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = String(value);
      }
      form.dataset.loaded = 'true';
      setStatus('');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'No se pudo abrir el editor.', true); }
  }
  toggle.addEventListener('click', () => {
    if (panel.hidden) void open();
    else { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Abrir editor'; }
  });
  form.addEventListener('input', () => { dirty = true; setStatus('Cambios sin guardar'); });
  window.addEventListener('beforeunload', event => { if (dirty) event.preventDefault(); });
  document.getElementById('editor-image')?.addEventListener('click', () => { uploadKind = 'image'; picker.accept = 'image/png,image/jpeg,image/webp,image/gif,image/avif'; picker.click(); });
  document.getElementById('editor-document')?.addEventListener('click', () => { uploadKind = 'document'; picker.accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.md,.txt,.zip,.odt,.ods,.odp'; picker.click(); });
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0]; if (!file) return;
    if (file.size > 15 * 1024 * 1024) { setStatus('El archivo supera el límite de 15 MB.', true); return; }
    setStatus('Subiendo archivo…');
    try {
      const result = await request(`${endpoint}&action=upload`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ kind:uploadKind, name:file.name, content:await fileBase64(file) })
      });
      if (uploadKind === 'image') {
        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        insert(`\n\n![${alt}](${result.file})\n\n`);
      } else {
        const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        insert(`\n\n## Descarga · ${title}\n\narchivo: ${result.file}${file.name.toLowerCase().endsWith('.md') ? '\nformato: md' : ''}\n`, true);
      }
      setStatus('Archivo añadido. Pulsa «Guardar cambios» para publicarlo.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'No se pudo subir el archivo.', true); }
    finally { picker.value = ''; }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    save.disabled = true; setStatus('Guardando y regenerando los días…');
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      await request(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(data) });
      dirty = false;
      sessionStorage.setItem(`adviento-editor-saved-${day}`, '1');
      location.reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudieron guardar los cambios.', true);
      save.disabled = false;
    }
  });
  if (sessionStorage.getItem(`adviento-editor-saved-${day}`)) {
    sessionStorage.removeItem(`adviento-editor-saved-${day}`);
    void open().then(() => setStatus('Cambios guardados en el proyecto.'));
  }
}

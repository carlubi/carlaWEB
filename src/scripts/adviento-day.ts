import { db, verifiedSession, type AdventContent, type AdventDownload } from './adviento-api';
import { completePreview, openPreview, readPreview } from './adviento-preview';

const app = document.querySelector<HTMLElement>('#day-app');
if (app) {
  const day = Number(app.dataset.day);
  const previewMode = import.meta.env.DEV && app.dataset.preview === 'true';
  const $ = <T extends HTMLElement = HTMLElement>(id:string) => document.getElementById(id) as T;
  const loading = $('challenge-loading');
  const errorPanel = $('challenge-error');
  const contentPanel = $('challenge-content');
  const completeButton = $<HTMLButtonElement>('complete-button');
  const completeBadge = $('complete-badge');
  const completeStatus = $('complete-status');
  const completeDialog = $<HTMLDialogElement>('complete-dialog');
  function showError(text:string) {
    loading.hidden = true; contentPanel.hidden = true; errorPanel.hidden = false;
    $('challenge-error-text').textContent = text;
  }
  function el<K extends keyof HTMLElementTagNameMap>(tag:K, className = '', text = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  /* The HTML comes from our own Markdown, rendered by scripts/build-adviento.mjs. */
  function html(tag:keyof HTMLElementTagNameMap, className:string, markup:string) {
    const node = el(tag, className); node.innerHTML = markup; return node;
  }
  /* The three labels share one grid cell, so the button keeps its width whatever state it shows. */
  const copyStatus = $('copy-status');
  function copyButton(label:string, text:string, source?:HTMLElement) {
    const button = el('button', 'resource-button copy-button'); button.type = 'button';
    button.innerHTML = '<span class="copy-state copy-idle"></span><span class="copy-state copy-done" aria-hidden="true"><svg class="copy-check" viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/></svg>Copiado</span><span class="copy-state copy-fail" aria-hidden="true">Copia a mano</span>';
    button.querySelector('.copy-idle')!.textContent = label;
    let reset = 0;
    button.addEventListener('click', async () => {
      clearTimeout(reset); button.classList.remove('is-copied', 'is-failed');
      try {
        await navigator.clipboard.writeText(text);
        void button.offsetWidth; /* restart the animation on repeated clicks */
        button.classList.add('is-copied'); copyStatus.textContent = 'Copiado. Ya puedes pegarlo.';
      } catch {
        button.classList.add('is-failed'); copyStatus.textContent = 'No se ha podido copiar. Selecciona el texto y cópialo a mano.';
        if (source) { const range = document.createRange(); range.selectNodeContents(source); getSelection()?.removeAllRanges(); getSelection()?.addRange(range); }
      }
      reset = window.setTimeout(() => button.classList.remove('is-copied', 'is-failed'), 2400);
    });
    return button;
  }
  function markCompleted(text:string) {
    completeButton.hidden = true; completeBadge.hidden = false; completeStatus.textContent = text;
  }

  function renderDownload(item:AdventDownload) {
    const row = el('li', 'download-item');
    const badge = el('span', `file-badge file-${item.formato.toLowerCase()}`, item.formato); badge.setAttribute('aria-hidden', 'true');
    const info = el('div', 'download-info');
    info.append(el('h3', '', item.titulo));
    if (item.descripcion) info.append(el('p', '', item.descripcion));
    info.append(el('span', 'download-meta', `${item.formato} · ${item.peso}`));
    const actions = el('div', 'download-actions');
    const link = el('a', 'resource-button is-primary', 'Descargar'); link.href = item.url; link.download = item.nombre;
    link.setAttribute('aria-label', `Descargar ${item.titulo} (${item.formato}, ${item.peso})`);
    actions.append(link);
    if (item.copiar) actions.append(copyButton('Copiar texto', item.copiar));
    row.append(badge, info, actions);
    return row;
  }

  function renderContent(content:AdventContent) {
    const sections = $('challenge-sections'); sections.replaceChildren();
    for (const section of content.secciones || []) {
      const block = el('section', 'reading-section');
      block.append(el('h2', '', section.titulo), html('div', 'reading-body', section.html));
      sections.append(block);
    }

    const downloads = content.descargas || [];
    const downloadList = $('download-list'); downloadList.replaceChildren(...downloads.map(renderDownload));
    $('challenge-downloads').hidden = !downloads.length;
    const byName = new Map(downloads.map(item => [item.nombre, item]));

    const prompts = content.prompts || [];
    const promptList = $('prompt-list'); promptList.replaceChildren();
    for (const prompt of prompts) {
      /* two columns on wide screens: the step and its notes on the left, the prompts to copy on the right */
      const card = el('section', 'prompt-card');
      const guide = el('div', 'prompt-guide'); guide.append(el('h3', '', prompt.titulo));
      const body = el('div', 'prompt-body');
      card.append(guide, body);
      for (const block of prompt.bloques) {
        if (block.tipo === 'texto') { guide.append(html('div', 'prompt-note', block.html)); continue; }
        const box = el('div', 'prompt-block');
        const promptText = html('div', 'prompt-text', block.html);
        box.append(promptText);
        const footer = el('div', 'prompt-footer');
        footer.append(copyButton('Copiar prompt', block.texto, promptText));
        box.append(footer);
        if (block.adjuntos?.length) {
          const attach = el('p', 'prompt-attach', 'Adjunta: ');
          block.adjuntos.forEach((name, i) => {
            const file = byName.get(name);
            if (i) attach.append(i === block.adjuntos!.length - 1 ? ' y ' : ', ');
            if (file) { const a = el('a', '', name); a.href = file.url; a.download = name; attach.append(a); }
            else attach.append(name);
          });
          box.append(attach);
        }
        body.append(box);
      }
      promptList.append(card);
    }
    $('challenge-prompts').hidden = !prompts.length;
    contentPanel.querySelector('.challenge-layout')?.classList.toggle('is-single', !downloads.length);
    const jump = contentPanel.querySelector<HTMLAnchorElement>('.jump-link');
    if (jump) { jump.hidden = !(prompts.length || downloads.length); jump.href = downloads.length ? '#challenge-downloads' : '#challenge-prompts'; }
  }

  async function start() {
    try {
      if (previewMode) {
        const localContent = JSON.parse(app.dataset.previewContent || 'null') as AdventContent|null;
        if (!localContent) throw new Error('Falta el contenido de prueba. Ejecuta npm run build:adviento.');
        openPreview(day);
        renderContent(localContent);
        if (readPreview().find(row => row.dia === day)?.completado_en) markCompleted('Ya lo completaste en la vista local.');
        loading.hidden = true; contentPanel.hidden = false;
        return;
      }
      const session = await verifiedSession();
      if (!session) { showError('Entra con tu correo desde el calendario para descubrir este reto.'); return; }
      const profile = await db<{user_id:string}[]>('adviento_perfiles?select=user_id&limit=1');
      if (!profile.length) { showError('Completa tu registro en el calendario para guardar tus avances.'); return; }
      const content = await db<AdventContent>('rpc/adviento_abrir','POST',{p_dia:day});
      if (!content) throw new Error('Este reto todavía no tiene contenido.');
      renderContent(content);
      const progress = await db<{completado_en:string|null}[]>(`adviento_progreso?select=completado_en&dia=eq.${day}`);
      if (progress[0]?.completado_en) markCompleted('Puedes volver siempre que quieras.');
      loading.hidden = true; contentPanel.hidden = false;
    } catch (error) {
      const text = error instanceof Error ? error.message : 'No hemos podido cargar el reto.';
      showError(/todavía|disponible/i.test(text) ? 'Este día aún no se ha abierto. Vuelve cuando llegue su fecha.' : text);
    }
  }
  const completeLabel = completeButton.innerHTML;
  completeButton.addEventListener('click',async()=>{
    completeButton.disabled = true; completeButton.textContent = 'Guardando…'; completeStatus.textContent = '';
    try {
      const success = previewMode ? Boolean(completePreview(day)) : await db<boolean>('rpc/adviento_completar','POST',{p_dia:day});
      if (!success) throw new Error('No se ha guardado el reto. Inténtalo de nuevo.');
      const count = previewMode
        ? readPreview().filter(row => row.completado_en).length
        : (await db<{dia:number}[]>('adviento_progreso?select=dia&completado_en=not.is.null').catch(() => null))?.length;
      $('complete-count').textContent = count === undefined ? 'Tu progreso se ha guardado' : `${count} de 24 completados`;
      markCompleted('¡Bien hecho! Tu progreso se ha guardado.');
      completeDialog.showModal();
      completeDialog.querySelector<HTMLAnchorElement>('a')?.focus();
    } catch (error) {
      completeStatus.textContent = error instanceof Error ? error.message : 'No hemos podido guardar el reto. Inténtalo de nuevo.';
      completeButton.disabled = false; completeButton.innerHTML = completeLabel;
    }
  });
  $('stay-button').addEventListener('click',()=>completeDialog.close());
  completeDialog.addEventListener('click',event=>{if(event.target===completeDialog)completeDialog.close();});
  start();
}

import { db, verifiedSession, type AdventContent } from './adviento-api';
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
  const completeDialog = $<HTMLDialogElement>('complete-dialog');
  function showError(text:string) {
    loading.hidden = true; contentPanel.hidden = true; errorPanel.hidden = false;
    $('challenge-error-text').textContent = text;
  }
  function textNode(parent:HTMLElement,tag:string,text:string,className='') {
    const node = document.createElement(tag); node.textContent = text;
    if (className) node.className = className;
    parent.append(node); return node;
  }
  function renderBody(parent:HTMLElement,body:string) {
    let list:HTMLElement|null = null; let listKind = ''; let code:HTMLElement|null = null;
    for (const raw of body.split('\n')) {
      const line = raw.trim();
      if (line.startsWith('```')) { if (code) { code = null; } else { code = document.createElement('pre'); parent.append(code); } list = null; continue; }
      if (code) { code.textContent += `${raw}\n`; continue; }
      if (!line) { list = null; continue; }
      const ordered = line.match(/^\d+[.)]\s+(.+)/); const bullet = line.match(/^[-*]\s+(.+)/);
      if (ordered || bullet) {
        const kind = ordered ? 'ol' : 'ul';
        if (!list || listKind !== kind) { list = document.createElement(kind); parent.append(list); listKind = kind; }
        textNode(list,'li',(ordered || bullet)![1].replace(/\*\*|`/g,''));
      } else if (line.startsWith('### ')) { list = null; textNode(parent,'h3',line.slice(4)); }
      else { list = null; textNode(parent,'p',line.replace(/\*\*|`/g,'')); }
    }
  }
  function renderContent(content:AdventContent) {
    const sections = $('challenge-sections'); sections.replaceChildren();
    for (const section of content.secciones || []) {
      const block = document.createElement('section'); block.className = 'reading-section';
      textNode(block,'h2',section.heading.replace(/`/g,'')); renderBody(block,section.body); sections.append(block);
    }
    const prompt = $('challenge-prompt'); prompt.replaceChildren();
    if (content.prompt?.trim()) {
      prompt.hidden = false; textNode(prompt,'h2','Prompt listo para copiar');
      textNode(prompt,'p','Puedes pegarlo en la herramienta y adaptarlo a tu contexto.');
      textNode(prompt,'pre',content.prompt.trim());
      const copy = textNode(prompt,'button','Copiar prompt','copy-button') as HTMLButtonElement;
      copy.type = 'button';
      copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(content.prompt);copy.textContent='Copiado';setTimeout(()=>copy.textContent='Copiar prompt',2200);}catch{copy.textContent='Selecciona y copia el texto de arriba';}});
    }
    const downloads = $('challenge-downloads'); downloads.replaceChildren();
    if (content.recursos?.length) {
      downloads.hidden = false; textNode(downloads,'h2','Para llevártelo contigo');
      textNode(downloads,'p','Materiales de este reto, listos para descargar.');
      for (const resource of content.recursos) {
        const button = textNode(downloads,'button',`↓  ${resource.name}`,'download-button') as HTMLButtonElement;
        button.type = 'button';
        button.addEventListener('click',()=>{const blob=new Blob([resource.content],{type:resource.mime});const objectURL=URL.createObjectURL(blob);const link=document.createElement('a');link.href=objectURL;link.download=resource.name;link.click();setTimeout(()=>URL.revokeObjectURL(objectURL),1000);});
      }
    }
  }
  async function start() {
    try {
      if (previewMode) {
        const localContent = JSON.parse(app.dataset.previewContent || 'null') as AdventContent|null;
        if (!localContent) throw new Error('Falta el contenido de prueba. Ejecuta npm run build:adviento.');
        openPreview(day);
        renderContent(localContent);
        if (readPreview().find(row => row.dia === day)?.completado_en) {
          completeButton.hidden = true;
          $('complete-status').textContent = 'Ya has completado este reto en la vista local.';
        }
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
      if (progress[0]?.completado_en) { completeButton.hidden = true; $('complete-status').textContent = 'Ya has completado este reto. Puedes volver siempre que quieras.'; }
      loading.hidden = true; contentPanel.hidden = false;
    } catch (error) {
      const text = error instanceof Error ? error.message : 'No hemos podido cargar el reto.';
      showError(/todavía|disponible/i.test(text) ? 'Este día aún no se ha abierto. Vuelve cuando llegue su fecha.' : text);
    }
  }
  completeButton.addEventListener('click',async()=>{
    completeButton.disabled = true; completeButton.textContent = 'Guardando…';
    try {
      const success = previewMode ? Boolean(completePreview(day)) : await db<boolean>('rpc/adviento_completar','POST',{p_dia:day});
      if (!success) throw new Error('No se ha guardado el reto. Inténtalo de nuevo.');
      const count = previewMode
        ? readPreview().filter(row => row.completado_en).length
        : (await db<{dia:number}[]>('adviento_progreso?select=dia&completado_en=not.is.null').catch(() => null))?.length;
      $('complete-count').textContent = count === undefined ? 'Tu progreso se ha guardado' : `${count} de 24 completados`;
      completeButton.hidden = true; $('complete-status').textContent = 'Reto completado. ¡Bien hecho!';
      completeDialog.showModal();
      completeDialog.querySelector<HTMLAnchorElement>('a')?.focus();
    } catch (error) { $('complete-status').textContent = error instanceof Error ? error.message : 'No hemos podido guardar el reto. Inténtalo de nuevo.'; completeButton.disabled = false; completeButton.textContent = 'Marcar como completado'; }
  });
  $('stay-button').addEventListener('click',()=>{completeDialog.close();$('challenge-content').scrollIntoView({behavior:'smooth'});});
  completeDialog.addEventListener('click',event=>{if(event.target===completeDialog)completeDialog.close();});
  start();
}

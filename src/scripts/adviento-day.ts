import { db, verifiedSession, type AdventContent, type AdventDownload } from './adviento-api';
import { completePreview, openPreview, readPreview } from './adviento-preview';
import { makeLearningIllustration, slidesForIllustration } from './adviento-illustrations';

type Slide = { kicker:string; title:string; nodes:Node[]; sectionStart:boolean };

const app = document.querySelector<HTMLElement>('#day-app');
if (app) {
  const day = Number(app.dataset.day);
  const previewMode = import.meta.env.DEV && app.dataset.preview === 'true';
  if (previewMode) void import('./adviento-editor');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = <T extends HTMLElement = HTMLElement>(id:string) => document.getElementById(id) as T;
  const loading = $('challenge-loading');
  const errorPanel = $('challenge-error');
  const contentPanel = $('challenge-content');
  const completeButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-complete]')];
  const completeStatuses = [...document.querySelectorAll<HTMLElement>('[data-complete-status]')];
  const iconUrl = (name:string) => `/assets/adviento-icons.svg#${name}`;

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
  /* ---------- copy buttons: the three labels share one grid cell, so the width never jumps ---------- */
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

  /* ---------- slides: one per «##» section, and one per «###» step inside it ---------- */
  function splitSections(content:AdventContent):Slide[] {
    const slides:Slide[] = [];
    for (const section of content.secciones || []) {
      const template = document.createElement('template'); template.innerHTML = section.html;
      const intro:Node[] = []; const steps:{ title:string; nodes:Node[] }[] = [];
      for (const node of [...template.content.childNodes]) {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue;
        if (node instanceof HTMLHeadingElement && node.tagName === 'H3') { steps.push({ title:node.textContent?.trim() || '', nodes:[] }); continue; }
        (steps.at(-1)?.nodes ?? intro).push(node);
      }
      if (!steps.length) { slides.push({ kicker:'', title:section.titulo, nodes:intro, sectionStart:true }); continue; }
      /* a one-line intro reads better as the lead of the first step than as a slide of its own */
      const introText = intro.map(node => node.textContent || '').join(' ').trim();
      const shortIntro = introText.length < 280 && !intro.some(node => node instanceof Element && node.matches('figure, table'));
      if (intro.length && shortIntro) steps[0].nodes.unshift(...intro);
      else if (intro.length) slides.push({ kicker:'', title:section.titulo, nodes:intro, sectionStart:true });
      steps.forEach((step, i) => slides.push({ kicker:section.titulo, title:step.title, nodes:step.nodes, sectionStart:i === 0 && !(intro.length && !shortIntro) }));
    }
    return slides;
  }

  const deck = $('deck');
  const viewport = $('deck-viewport');
  const progress = $('deck-progress');
  const count = $('deck-count');
  const prev = $<HTMLButtonElement>('deck-prev');
  const next = $<HTMLButtonElement>('deck-next');
  const nextTitle = $('deck-next-title');
  const nextSmall = next.querySelector('small')!;
  const nextIcon = $('deck-next-icon').querySelector('use')!;
  const deckStatus = $('deck-status');
  let slideEls:HTMLElement[] = [];
  let titles:string[] = [];
  let current = 0;
  let resourcesTarget:HTMLElement|null = null;

  function slideElement(slide:Slide, index:number, total:number, illustrate = false) {
    const article = el('article', 'slide');
    article.setAttribute('aria-roledescription', 'diapositiva');
    article.setAttribute('aria-label', `${index + 1} de ${total}: ${slide.title}`);
    article.hidden = true;
    const head = el('header', 'slide-head');
    if (slide.kicker) head.append(el('p', 'slide-kicker', slide.kicker));
    const h2 = el('h2', '', slide.title); h2.tabIndex = -1; head.append(h2);
    const body = el('div', 'reading-body slide-body');
    const figures = slide.nodes.filter(node => node instanceof Element && node.matches('figure.captura'));
    const text = slide.nodes.filter(node => !figures.includes(node));
    if (figures.length && text.length) {
      /* steps with a screenshot: explanation on the left, the screen on the right */
      body.classList.add('has-media');
      const textCol = el('div', 'slide-text'); textCol.append(...text);
      const mediaCol = el('div', 'slide-media'); mediaCol.append(...figures);
      body.append(textCol, mediaCol);
    } else body.append(...slide.nodes);
    if (slide.title.toLocaleLowerCase('es') === 'palabras del día'.toLocaleLowerCase('es')) {
      /* same layout every day: one card per word, filling the slide (DESIGN.md · Tarjeta) */
      article.classList.add('glossary-slide');
      body.classList.add('glossary-body');
      const list = [...body.children].find(node => node instanceof HTMLUListElement) as HTMLUListElement|undefined;
      if (list) {
        const glossary = el('dl', 'glossary-grid');
        [...list.children].filter((node):node is HTMLLIElement => node instanceof HTMLLIElement).forEach(item => {
          const sourceTerm = item.querySelector(':scope > strong');
          const group = el('div', 'glossary-term');
          const term = el('dt', 'glossary-word', sourceTerm?.textContent?.trim().replace(/:\s*$/, '') || 'Término');
          /* the big initial behind the card, like a dictionary entry */
          group.dataset.initial = (term.textContent || '').trim().charAt(0).toLocaleUpperCase('es');
          const definition = el('dd', 'glossary-definition');
          if (sourceTerm) {
            let sibling = sourceTerm.nextSibling;
            let firstText = true;
            while (sibling) {
              const next = sibling.nextSibling;
              if (firstText && sibling.nodeType === Node.TEXT_NODE) sibling.textContent = sibling.textContent?.trimStart() || '';
              definition.append(sibling);
              firstText = false;
              sibling = next;
            }
          } else {
            definition.append(...item.childNodes);
          }
          group.append(term, definition);
          glossary.append(group);
        });
        glossary.dataset.count = String(glossary.children.length);
        list.replaceWith(glossary);
      }
    }
    const illustration = illustrate ? makeLearningIllustration(day, slide.title) : null;
    if (illustration) {
      body.classList.add('has-illustration');
      const textCol = el('div', 'slide-text');
      textCol.append(...[...body.childNodes]);
      body.append(textCol, illustration);
    }
    for (const img of body.querySelectorAll<HTMLImageElement>('figure.captura img')) {
      const link = el('a', 'captura-zoom'); link.href = img.src; link.target = '_blank'; link.rel = 'noopener';
      link.setAttribute('aria-label', `Ver la captura a tamaño completo: ${img.alt}`);
      img.replaceWith(link); link.append(img);
    }
    article.append(head, body);
    return article;
  }

  function agendaSlide(slides:Slide[]):Slide {
    const nodes:Node[] = [];
    const summary = app!.dataset.summary; const needs = app!.dataset.needs;
    if (summary) nodes.push(el('p', 'agenda-summary', summary));
    if (needs) { const p = el('p', 'agenda-needs'); p.append(el('strong', '', 'Lo que necesitas: '), needs); nodes.push(p); }
    const list = el('ol', 'agenda-list');
    slides.forEach((slide, i) => {
      if (!slide.sectionStart) return;
      const item = el('li'); const button = el('button', 'agenda-link'); button.type = 'button';
      button.append(el('span', 'agenda-title', slide.kicker || slide.title));
      button.addEventListener('click', () => goTo(i + 1));
      item.append(button); list.append(item);
    });
    nodes.push(el('h3', 'agenda-heading', 'Lo que vas a ver'), list);
    nodes.push(el('p', 'agenda-hint', 'Pasa de una diapositiva a otra con los botones de abajo, con las flechas del teclado o deslizando el dedo.'));
    return { kicker:'', title:'De qué va hoy', nodes, sectionStart:false };
  }

  function buildDeck(content:AdventContent) {
    const slides = splitSections(content);
    const all = [agendaSlide(slides), ...slides];
    const illustrated = slidesForIllustration(day, slides);
    titles = all.map(slide => slide.title);
    slideEls = all.map((slide, i) => slideElement(slide, i, all.length, i > 0 && illustrated.has(i - 1)));
    viewport.replaceChildren(...slideEls);
    progress.replaceChildren(...all.map(() => el('span')));
    goTo(0, { initial:true });
  }

  function updateNav() {
    const last = current === slideEls.length - 1;
    prev.disabled = current === 0;
    $<HTMLButtonElement>('deck-index').disabled = current === 0;
    [...progress.children].forEach((bar, i) => { bar.classList.toggle('is-seen', i < current); bar.classList.toggle('is-current', i === current); });
    count.textContent = `${current + 1} de ${slideEls.length}`;
    if (!last) {
      nextSmall.textContent = 'Siguiente'; nextTitle.textContent = titles[current + 1];
      next.setAttribute('aria-label', `Siguiente diapositiva: ${titles[current + 1]}`);
      nextIcon.setAttribute('href', iconUrl('arrow-right'));
    } else {
      const label = resourcesTarget ? 'Ir a prompts y descargas' : 'Terminar el reto';
      nextSmall.textContent = 'Has llegado al final'; nextTitle.textContent = label;
      next.setAttribute('aria-label', label);
      nextIcon.setAttribute('href', iconUrl('arrow-down'));
    }
    next.classList.toggle('is-final', last);
  }

  function goTo(index:number, { initial = false } = {}) {
    const target = Math.max(0, Math.min(index, slideEls.length - 1));
    const direction = target >= current ? 'is-forward' : 'is-back';
    slideEls[current]?.setAttribute('hidden', '');
    current = target;
    const slide = slideEls[current];
    slide.hidden = false; slide.style.transform = '';
    slide.classList.remove('is-forward', 'is-back');
    if (!initial && !reduceMotion.matches) { void slide.offsetWidth; slide.classList.add(direction); }
    viewport.scrollTop = 0;
    updateNav();
    history.replaceState(null, '', current ? `#diapositiva-${current + 1}` : location.pathname + location.search);
    if (initial) return;
    deckStatus.textContent = `Diapositiva ${current + 1} de ${slideEls.length}: ${titles[current]}`;
    /* if the reader had scrolled down a long slide, bring the new one in from its top */
    const top = deck.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top:window.scrollY + top - 16, behavior:reduceMotion.matches ? 'auto' : 'smooth' });
  }

  function finishDeck() {
    const target = resourcesTarget || document.querySelector<HTMLElement>('.finish');
    target?.scrollIntoView({ behavior:reduceMotion.matches ? 'auto' : 'smooth', block:'start' });
    if (resourcesTarget) resourcesTarget.focus({ preventScroll:true });
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => current === slideEls.length - 1 ? finishDeck() : goTo(current + 1));
  $('deck-index').addEventListener('click', () => goTo(0));
  window.addEventListener('pageshow', event => {
    if (event.persisted && slideEls.length) goTo(0, { initial:true });
  });

  /* keyboard: arrows move the deck while it is on screen and the reader is not typing */
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const box = deck.getBoundingClientRect();
    if (contentPanel.hidden || box.bottom < 80 || box.top > innerHeight - 80) return;
    event.preventDefault();
    goTo(current + (event.key === 'ArrowRight' ? 1 : -1));
  });

  /* touch: the slide follows the finger; a clear horizontal swipe changes slide, a vertical one scrolls */
  let swipe:{ id:number; x:number; y:number; dx:number; axis:''|'x'|'y' } | null = null;
  const scrollsSideways = (node:EventTarget|null) => {
    const box = (node as HTMLElement)?.closest?.('pre, table');
    return Boolean(box && box.scrollWidth > box.clientWidth);
  };
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || scrollsSideways(event.target)) return;
    swipe = { id:event.pointerId, x:event.clientX, y:event.clientY, dx:0, axis:'' };
  });
  viewport.addEventListener('pointermove', event => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x; const dy = event.clientY - swipe.y;
    if (!swipe.axis && Math.hypot(dx, dy) > 10) swipe.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (swipe.axis !== 'x') return;
    swipe.dx = dx;
    const atEdge = (dx > 0 && current === 0) || (dx < 0 && current === slideEls.length - 1);
    if (!reduceMotion.matches) slideEls[current].style.transform = `translateX(${dx * (atEdge ? .15 : .45)}px)`;
  });
  const endSwipe = (event:PointerEvent) => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const { dx, axis } = swipe; swipe = null;
    const slide = slideEls[current];
    if (axis === 'x' && Math.abs(dx) > 56) {
      if (dx < 0 && current < slideEls.length - 1) return goTo(current + 1);
      if (dx > 0 && current > 0) return goTo(current - 1);
    }
    slide.classList.add('is-settling'); slide.style.transform = '';
    setTimeout(() => slide.classList.remove('is-settling'), 220);
  };
  viewport.addEventListener('pointerup', endSwipe);
  viewport.addEventListener('pointercancel', endSwipe);

  /* ---------- prompts and downloads ---------- */
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

  function renderResources(content:AdventContent) {
    const downloads = content.descargas || [];
    $('download-list').replaceChildren(...downloads.map(renderDownload));
    const byName = new Map(downloads.map(item => [item.nombre, item]));

    const prompts = content.prompts || [];
    const promptList = $('prompt-list'); promptList.replaceChildren();
    for (const prompt of prompts) {
      const card = el('section', 'prompt-card');
      card.append(el('h3', '', prompt.titulo));
      for (const block of prompt.bloques) {
        if (block.tipo === 'texto') { card.append(html('div', 'prompt-note', block.html)); continue; }
        const box = el('div', 'prompt-block');
        const promptText = html('div', 'prompt-text', block.html);
        box.append(promptText);
        const footer = el('div', 'prompt-footer');
        if (block.adjuntos?.length) {
          const attach = el('p', 'prompt-attach', 'Adjunta ');
          block.adjuntos.forEach((name, i) => {
            const file = byName.get(name);
            if (i) attach.append(i === block.adjuntos!.length - 1 ? ' y ' : ', ');
            if (file) { const a = el('a', '', name); a.href = file.url; a.download = name; attach.append(a); }
            else attach.append(name);
          });
          footer.append(attach);
        }
        footer.append(copyButton('Copiar prompt', block.texto, promptText));
        box.append(footer);
        card.append(box);
      }
      promptList.append(card);
    }
    $('challenge-prompts').hidden = !prompts.length;
    $('challenge-downloads').hidden = !downloads.length;
    const resources = $('resources');
    resources.hidden = !prompts.length && !downloads.length;
    resources.classList.toggle('has-both', Boolean(prompts.length && downloads.length));
    resourcesTarget = prompts.length ? $('challenge-prompts') : downloads.length ? $('challenge-downloads') : null;
  }

  /* long prompts start folded so the list can be scanned; «Copiar» always copies the whole text */
  function foldLongPrompts() {
    for (const text of document.querySelectorAll<HTMLElement>('.prompt-text')) {
      if (text.scrollHeight <= 300) continue;
      text.classList.add('is-folded');
      const toggle = el('button', 'prompt-toggle', 'Ver el prompt entero'); toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () => {
        const open = text.classList.toggle('is-folded') === false;
        toggle.textContent = open ? 'Ver menos' : 'Ver el prompt entero';
        toggle.setAttribute('aria-expanded', String(open));
      });
      text.after(toggle);
    }
  }

  /* ---------- completed ---------- */
  function setStatus(text:string, withLink = false) {
    for (const status of completeStatuses) {
      status.replaceChildren(text);
      if (withLink) { const a = el('a', '', 'Volver al calendario'); a.href = '/adviento'; status.append(' ', a); }
    }
  }
  function markCompleted(text:string, celebrate = false) {
    for (const button of completeButtons) {
      button.classList.remove('is-saving'); button.classList.add('is-done');
      button.disabled = true;
      button.querySelector('.complete-label')!.textContent = 'Reto completado';
      if (celebrate && !reduceMotion.matches) {
        button.classList.add('is-celebrating');
        setTimeout(() => button.classList.remove('is-celebrating'), 1400);
      }
    }
    $('day-badge').classList.add('is-done');
    if (celebrate) $('day-badge').classList.add('is-stamping');
    setStatus(text, true);
  }

  for (const button of completeButtons) button.addEventListener('click', async () => {
    for (const other of completeButtons) { other.disabled = true; other.classList.add('is-saving'); other.querySelector('.complete-label')!.textContent = 'Guardando…'; }
    setStatus('');
    try {
      const success = previewMode ? Boolean(completePreview(day)) : await db<boolean>('rpc/adviento_completar','POST',{p_dia:day});
      if (!success) throw new Error('No se ha guardado el reto. Inténtalo de nuevo.');
      const total = previewMode
        ? readPreview().filter(row => row.completado_en).length
        : (await db<{dia:number}[]>('adviento_progreso?select=dia&completado_en=not.is.null').catch(() => null))?.length;
      markCompleted(total === undefined ? '¡Hecho! Tu progreso se ha guardado.' : `¡Hecho! Llevas ${total} de 24.`, true);
    } catch (error) {
      for (const other of completeButtons) { other.disabled = false; other.classList.remove('is-saving'); other.querySelector('.complete-label')!.textContent = 'Marcar como completado'; }
      setStatus(error instanceof Error ? error.message : 'No hemos podido guardar el reto. Inténtalo de nuevo.');
    }
  });

  /* ---------- start ---------- */
  function render(content:AdventContent) {
    renderResources(content);
    buildDeck(content);
  }
  function reveal() {
    loading.hidden = true; contentPanel.hidden = false;
    requestAnimationFrame(foldLongPrompts);
  }

  async function start() {
    try {
      if (previewMode) {
        const localContent = JSON.parse(app!.dataset.previewContent || 'null') as AdventContent|null;
        if (!localContent) throw new Error('Falta el contenido de prueba. Ejecuta npm run build:adviento.');
        openPreview(day);
        render(localContent);
        if (readPreview().find(row => row.dia === day)?.completado_en) markCompleted('Ya lo completaste en la vista local.');
        reveal();
        return;
      }
      const session = await verifiedSession();
      if (!session) { showError('Entra con tu correo desde el calendario para descubrir este reto.'); return; }
      const profile = await db<{user_id:string}[]>('adviento_perfiles?select=user_id&limit=1');
      if (!profile.length) { showError('Completa tu registro en el calendario para guardar tus avances.'); return; }
      const content = await db<AdventContent>('rpc/adviento_abrir','POST',{p_dia:day});
      if (!content) throw new Error('Este reto todavía no tiene contenido.');
      render(content);
      const progressRows = await db<{completado_en:string|null}[]>(`adviento_progreso?select=completado_en&dia=eq.${day}`);
      if (progressRows[0]?.completado_en) markCompleted('Ya lo tienes. Puedes volver siempre que quieras.');
      reveal();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'No hemos podido cargar el reto.';
      showError(/todavía|disponible/i.test(text) ? 'Este día aún no se ha abierto. Vuelve cuando llegue su fecha.' : text);
    }
  }
  start();
}

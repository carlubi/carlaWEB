import { auth, db, saveSession, savedSession, verifiedSession, signOut, subscribeNewsletter } from './adviento-api';
import { openPreview, previewAchievements, readPreview, resetPreview } from './adviento-preview';
import { achievementIcon, dayIcon, iconHref } from '../data/adviento-icons';

type Day = { dia:number; titulo:string; tipo:string; herramienta:string; minutos:number; datos:string; descripcion:string; simbolo:string; abre_el:string };
type Progress = { dia:number; abierto_en:string; completado_en:string|null };
type Profile = { user_id:string; nombre:string; avisos_email:boolean };
const root = document.querySelector<HTMLElement>('#advent-app');
if (root) {
  const days:Day[] = JSON.parse(root.dataset.days || '[]');
  const previewMode = import.meta.env.DEV && root.dataset.preview === 'true';
  const $ = <T extends HTMLElement = HTMLElement>(id:string) => document.getElementById(id) as T;
  const stage = $('calendar-stage');
  const board = $('calendar-board');
  const gate = $('access-gate');
  const emailForm = $<HTMLFormElement>('email-form');
  const codeForm = $<HTMLFormElement>('code-form');
  const registerForm = $<HTMLFormElement>('register-form');
  const message = $('auth-message');
  const emailInput = $<HTMLInputElement>('email');
  const nameInput = $<HTMLInputElement>('name');
  const codeInput = $<HTMLInputElement>('code');
  const privacyInput = $<HTMLInputElement>('privacy-check');
  const mailInput = $<HTMLInputElement>('mail-check');
  const registerButton = $<HTMLButtonElement>('register-button');
  const gift = $<HTMLDialogElement>('gift-dialog');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const achievements = [
    ['primera','El primer cajón','Abre el día 1'],['tres','Tres seguidos','Completa 3 retos'],
    ['conectada','Conectada','Completa el día 3'],['critica','Ojo crítico','Completa el día 6'],
    ['sola','Trabaja sola','Completa el día 7'],['mitad','A mitad de camino','Completa 12 retos'],
    ['datos','Sin miedo a los datos','Completa el día 14'],['vigilante','La que automatiza','Completa el día 22'],
    ['todas','Las 24','Completa todos']
  ];
  let profile:Profile|null = null;
  let progress:Progress[] = [];
  let earned = new Set<string>();
  let today = '';
  let lastDoor:HTMLButtonElement|null = null;

  function makeIcon(name:string) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    const use = document.createElementNS(ns,'use');
    use.setAttribute('href',iconHref(name));
    svg.append(use);
    return svg;
  }

  function errorText(error:unknown) {
    const text = error instanceof Error ? error.message : String(error);
    return /rate limit|429|too many/i.test(text) ? 'Has pedido varios accesos seguidos. Espera un minuto y vuelve a intentarlo.' : text;
  }
  function setMessage(text:string) { message.textContent = text; }
  /* Supabase envía un código de 6 cifras (plantillas con {{ .Token }}); si cambias «Email OTP Length», cambia esto. */
  const otpLength = 6;
  const accessCopy = {
    email: ['Calendario de Adviento IA · Diciembre 2026', 'Tu diciembre empieza aquí', 'Un reto al día, de 5 a 25 minutos, para trabajar mejor con IA. Entra con tu correo y guardaremos tus avances.'],
    verify: ['Código enviado', 'Revisa tu correo', ''],
    register: ['Correo verificado', 'Un último paso', 'Ponle nombre a tu calendario para guardar tus avances.']
  } as const;
  function step(which:'email'|'verify'|'register') {
    emailForm.hidden = which !== 'email';
    $('verify-step').hidden = which !== 'verify';
    registerForm.hidden = which !== 'register';
    setMessage('');
    /* el aviso de error va justo debajo del formulario del paso visible */
    (which === 'email' ? emailForm : which === 'verify' ? codeForm : registerForm).append(message);
    const [eyebrow, title, description] = accessCopy[which];
    $('access-eyebrow').textContent = eyebrow; $('access-title').textContent = title;
    const desc = $('access-description');
    if (which === 'verify') {
      const strong = document.createElement('strong'); strong.textContent = sessionStorage.getItem('adviento_email') || 'tu correo';
      desc.replaceChildren(`Te hemos enviado un código de ${otpLength} cifras a `, strong, '. Escríbelo aquí para entrar.');
    } else desc.textContent = description;
    (which === 'register' ? nameInput : which === 'verify' ? codeInput : emailInput).focus();
  }
  function busy(button:HTMLButtonElement, label:string|null) {
    const text = button.querySelector('.button-label')!;
    if (label) { button.dataset.label ??= text.textContent || ''; text.textContent = label; button.disabled = true; }
    else { text.textContent = button.dataset.label || text.textContent; button.disabled = false; }
  }
  /* Supabase solo deja pedir otro código pasados 60 segundos. */
  const resendButton = $<HTMLButtonElement>('resend-code');
  let resendTimer = 0;
  function startResendCooldown(seconds = 60) {
    clearInterval(resendTimer);
    const tick = () => {
      resendButton.disabled = seconds > 0;
      resendButton.textContent = seconds > 0 ? `Reenviar código en ${seconds} s` : 'Reenviar código';
      if (seconds-- <= 0) clearInterval(resendTimer);
    };
    tick(); resendTimer = window.setInterval(tick, 1000);
  }
  async function sendCode(email:string) {
    await auth('otp', { email, create_user:true });
    sessionStorage.setItem('adviento_email', email);
    startResendCooldown();
  }
  async function loadProfile() {
    const rows = await db<Profile[]>('adviento_perfiles?select=user_id,nombre,avisos_email&limit=1');
    profile = rows?.[0] || null;
    if (profile) await unlock(); else step('register');
  }
  async function start() {
    if (previewMode) { unlockPreview(); return; }
    const hash = new URLSearchParams(location.hash.slice(1));
    if (hash.has('access_token') && hash.has('refresh_token')) {
      saveSession({ access_token:hash.get('access_token'), refresh_token:hash.get('refresh_token'), expires_in:Number(hash.get('expires_in') || 3600) });
      history.replaceState(null, '', location.pathname + location.search);
    }
    const hashError = hash.get('error_description');
    if (hashError) history.replaceState(null, '', location.pathname);
    if (savedSession()) {
      try { await verifiedSession(); await loadProfile(); return; }
      catch (error) { await signOut(); step('email'); setMessage(errorText(error)); }
    }
    if (sessionStorage.getItem('adviento_email')) step('verify');
    if (hashError) setMessage(hashError);
  }
  emailForm.addEventListener('submit', async event => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    if (!emailPattern.test(email)) { setMessage('Ese correo no parece completo. Revísalo.'); emailInput.focus(); return; }
    const button = emailForm.querySelector<HTMLButtonElement>('button')!;
    busy(button, 'Enviando código…'); setMessage('');
    try { await sendCode(email); codeInput.value = ''; step('verify'); }
    catch (error) { setMessage('No hemos podido enviar el código. ' + errorText(error)); }
    finally { busy(button, null); }
  });
  codeInput.addEventListener('input', () => {
    const digits = codeInput.value.replace(/\D/g, '').slice(0, 10);
    if (digits !== codeInput.value) codeInput.value = digits;
    setMessage('');
    if (digits.length === otpLength) codeForm.requestSubmit();
  });
  codeForm.addEventListener('submit', async event => {
    event.preventDefault();
    const email = sessionStorage.getItem('adviento_email');
    const token = codeInput.value.trim();
    if (!email) { step('email'); return; }
    if (!/^\d{6,10}$/.test(token)) { setMessage(`Escribe las ${otpLength} cifras del código que te hemos enviado.`); codeInput.focus(); return; }
    const button = codeForm.querySelector<HTMLButtonElement>('button')!;
    if (button.disabled) return;
    busy(button, 'Comprobando…');
    try { saveSession(await auth('verify', { email, token, type:'email' })); sessionStorage.removeItem('adviento_email'); clearInterval(resendTimer); await verifiedSession(); await loadProfile(); }
    catch (error) {
      const text = error instanceof Error ? error.message : '';
      setMessage(/rate limit|429|too many/i.test(text) ? errorText(error) : 'Ese código no es correcto o ha caducado. Revísalo o pide uno nuevo.');
      codeInput.select();
    }
    finally { busy(button, null); }
  });
  resendButton.addEventListener('click', async () => {
    const email = sessionStorage.getItem('adviento_email');
    if (!email) { step('email'); return; }
    resendButton.disabled = true; resendButton.textContent = 'Enviando…';
    try { await sendCode(email); setMessage(''); $('code-help').textContent = 'Te hemos enviado un código nuevo. Usa el último que recibas.'; codeInput.value = ''; codeInput.focus(); }
    catch (error) { setMessage('No hemos podido reenviar el código. ' + errorText(error)); startResendCooldown(0); }
  });
  $('change-email').addEventListener('click', () => { sessionStorage.removeItem('adviento_email'); clearInterval(resendTimer); step('email'); });
  function registrationReady() { registerButton.disabled = !nameInput.value.trim() || !privacyInput.checked; }
  nameInput.addEventListener('input', registrationReady); privacyInput.addEventListener('change', registrationReady);
  registerForm.addEventListener('submit', async event => {
    event.preventDefault(); if (registerButton.disabled || !privacyInput.checked) return;
    const session = await verifiedSession().catch(() => null);
    if (!session) { step('email'); setMessage('Tu sesión ha terminado. Entra de nuevo con tu correo.'); return; }
    const nombre = nameInput.value.trim(); busy(registerButton, 'Creando tu calendario…');
    try {
      const rows = await db<Profile[]>('adviento_perfiles','POST',{user_id:session.user.id,nombre,acepto_politicas:true,version_politica:'2026-10-12',avisos_email:mailInput.checked});
      profile = rows[0];
      if (mailInput.checked) await subscribeNewsletter(nombre, session.user.email).catch(() => {});
      await unlock();
    } catch (error) { setMessage('No se ha podido crear tu calendario. ' + errorText(error)); registerButton.disabled = false; }
    finally { busy(registerButton, null); registrationReady(); }
  });
  $('signout').addEventListener('click', async () => { await signOut(); location.reload(); });
  document.getElementById('preview-reset')?.addEventListener('click', () => { resetPreview(); progress = []; earned.clear(); render(); });

  function unlockPreview() {
    /* local preview: everything is open, or the date in ?hoy=2026-12-10 to see future drawers */
    today = new URLSearchParams(location.search).get('hoy')?.match(/^2026-12-\d\d$/)?.[0] || '2026-12-25';
    progress = readPreview();
    earned = previewAchievements(progress);
    stage.classList.remove('is-locked'); board.inert = false; gate.hidden = true;
    $('achievements').hidden = false;
    $('welcome-name').textContent = 'Vista de prueba';
    render();
  }

  async function unlock() {
    if (!profile) return;
    const [date,rows,medals] = await Promise.all([
      db<string>('rpc/adviento_hoy','POST',{}),
      db<Progress[]>('adviento_progreso?select=dia,abierto_en,completado_en&order=dia'),
      db<{logro:string}[]>('adviento_logros?select=logro')
    ]);
    today = date; progress = rows || []; earned = new Set((medals || []).map(item => item.logro));
    stage.classList.remove('is-locked'); board.inert = false; gate.hidden = true;
    $('signout').hidden = false; $('achievements').hidden = false;
    $('welcome-name').textContent = `Hola, ${profile.nombre.split(/\s+/)[0]}`;
    render();
  }
  function available(day:Day) { return Boolean(today && day.abre_el <= today); }
  function render() {
    const opened = progress.length;
    const completed = progress.filter(item => item.completado_en).length;
    const released = days.filter(available).length;
    if (previewMode) {
      $('calendar-status').textContent = 'Todos los cajones están disponibles para explorar.';
      $('calendar-hint').textContent = 'Abre cualquier día, descarga sus materiales y prueba la animación de completado.';
    } else if (!released) {
      $('calendar-status').textContent = 'El primer regalo llega el 1 de diciembre.';
      $('calendar-hint').textContent = 'Tu sitio ya está reservado. El primer cajón se abre el 1 de diciembre.';
    } else if (released === 24 && today > '2026-12-24') {
      $('calendar-status').textContent = 'Los 24 cajones están abiertos para ti.';
      $('calendar-hint').textContent = 'El calendario sigue aquí. Vuelve a cualquier reto cuando te apetezca.';
    } else {
      $('calendar-status').textContent = `Ya puedes abrir ${released === 1 ? 'el primer cajón' : `hasta el día ${released}`}.`;
      $('calendar-hint').textContent = opened === 0 && released > 1 ? '¿Acabas de llegar? Empieza por el día 1 y sigue a tu ritmo.' : 'Puedes abrir los días que quieras y volver a los anteriores.';
    }
    renderRing(); renderDoors(); renderAchievements();
  }
  /* 24 arcos, uno por día, dibujados como trazos reales (no guiones) a tamaño 1:1 para que queden nítidos. */
  function renderRing() {
    const completed = progress.filter(row => row.completado_en).length;
    const openOnly = progress.length - completed;
    const svg = document.getElementById('progress-ring') as unknown as SVGSVGElement; svg.replaceChildren();
    const ns = 'http://www.w3.org/2000/svg', c = 48, r = 42, gap = 3.2;
    const point = (deg:number) => { const a = (deg - 90) * Math.PI / 180; return `${(c + r * Math.cos(a)).toFixed(3)} ${(c + r * Math.sin(a)).toFixed(3)}`; };
    for (let i = 0; i < 24; i++) {
      const item = progress.find(row => row.dia === i + 1);
      const arc = document.createElementNS(ns, 'path');
      arc.setAttribute('d', `M ${point(i * 15 + gap / 2)} A ${r} ${r} 0 0 1 ${point((i + 1) * 15 - gap / 2)}`);
      arc.setAttribute('class', `ring-arc ${item?.completado_en ? 'is-done' : item ? 'is-open' : 'is-pending'}`);
      svg.append(arc);
    }
    $('completed-count').textContent = String(completed);
    svg.setAttribute('aria-label', `Progreso: ${completed} de 24 retos completados, ${openOnly} en curso`);
    const unlocked = !stage.classList.contains('is-locked');
    $('progress-caption').hidden = unlocked;
    $('progress-legend').hidden = !unlocked;
    $('legend-done').textContent = `${completed} ${completed === 1 ? 'completado' : 'completados'}`;
    $('legend-open').textContent = `${openOnly} en curso`;
  }
  function renderDoors() {
    const grid = $('door-grid'); grid.replaceChildren();
    for (const [index, day] of days.entries()) {
      const item = progress.find(row => row.dia === day.dia);
      const state = item?.completado_en ? 'completed' : item ? 'opened' : available(day) ? 'available' : 'future';
      const button = document.createElement('button'); button.type = 'button'; button.dataset.day = String(day.dia);
      /* diagonal colour ribbons, shared with the 3D house (adviento-house3d.ts · frontStyle) */
      const tone = day.dia === 24 ? 'eve' : day.dia === 15 ? 'halfway' : day.tipo === 'Sorpresa' ? 'pine' : ((index % 6 - Math.floor(index / 6)) % 3 + 3) % 3;
      button.className = `calendar-door tone-${tone}${day.tipo === 'Regalo' ? ' is-gift' : ''} ${state}`;
      button.disabled = state === 'future';
      button.setAttribute('aria-label',state==='future' ? `Día ${day.dia}, todavía cerrado` : `Día ${day.dia}: ${day.titulo}${state==='completed'?', completado':''}`);
      const inside = document.createElement('span'); inside.className = 'door-content';
      const prize = document.createElement('span'); prize.className = 'door-prize'; prize.setAttribute('aria-hidden','true'); prize.append(makeIcon(dayIcon(day.dia)));
      const title = document.createElement('span'); title.className = 'door-title'; title.textContent = day.titulo;
      inside.append(prize,title);
      const front = document.createElement('span'); front.className = 'door-front';
      const notch = document.createElement('span'); notch.className = 'drawer-notch'; notch.setAttribute('aria-hidden','true');
      const number = document.createElement('span'); number.className = 'door-number'; number.textContent = String(day.dia).padStart(2,'0');
      const illustration = makeIcon(dayIcon(day.dia)); illustration.classList.add('door-illustration');
      const flake = document.createElement('span'); flake.className = 'door-flake'; flake.setAttribute('aria-hidden','true'); flake.textContent = day.dia % 3 === 0 ? '✦' : '✳';
      front.append(notch,number,illustration,flake);
      const sleeve = document.createElement('span'); sleeve.className = 'drawer-sleeve';
      const side = document.createElement('span'); side.className = 'drawer-side'; side.setAttribute('aria-hidden','true');
      const bottom = document.createElement('span'); bottom.className = 'drawer-bottom'; bottom.setAttribute('aria-hidden','true');
      sleeve.append(side,bottom,front);
      const stamp = document.createElement('span'); stamp.className = 'door-stamp'; stamp.textContent = '✓'; stamp.setAttribute('aria-hidden','true');
      button.append(inside,sleeve,stamp);
      button.addEventListener('click', () => openDoor(day,button)); grid.append(button);
    }
  }
  async function openDoor(day:Day,button:HTMLButtonElement) {
    if (button.disabled) return;
    if (progress.some(item => item.dia === day.dia)) { location.href = `/adviento/dia/${day.dia}`; return; }
    button.disabled = true;
    try {
      const content = previewMode ? openPreview(day.dia) : await db<unknown>('rpc/adviento_abrir','POST',{p_dia:day.dia});
      if (!content) throw new Error('Este reto todavía no tiene contenido.');
      progress = previewMode ? readPreview() : [...progress,{dia:day.dia,abierto_en:new Date().toISOString(),completado_en:null}];
      button.classList.remove('available'); button.classList.add('opening'); lastDoor = button;
      renderRing();
      /* the drawer animation takes ~0.9s; the extra half second lets the open drawer be seen before the dialog covers it */
      await new Promise(resolve => setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 1420));
      button.classList.remove('opening'); button.classList.add('opened'); button.disabled = false;
      $('gift-day').textContent = `Día ${day.dia} de 24 · ${day.tipo}`;
      $('gift-title').textContent = day.titulo;
      $('gift-description').textContent = day.descripcion;
      $('gift-tool').textContent = day.herramienta;
      $('gift-time').textContent = `${day.minutos} minutos`;
      $('gift-cta').textContent = /regalo/i.test(day.tipo) && !/reto/i.test(day.tipo) ? 'Ver mi regalo' : day.tipo === 'Tip' ? 'Leer el tip' : day.tipo === 'Sorpresa' ? 'Descubrir la sorpresa' : day.tipo === 'Formación' ? 'Empezar la clase' : 'Empezar el reto';
      document.getElementById('gift-icon-use')?.setAttribute('href',iconHref(dayIcon(day.dia)));
      $<HTMLAnchorElement>('gift-link').href = `/adviento/dia/${day.dia}`;
      gift.showModal();
      $<HTMLAnchorElement>('gift-link').focus();
      if (previewMode) { earned = previewAchievements(progress); renderAchievements(); }
      else {
        const result = await db<{logro:string}[]>('adviento_logros?select=logro').catch(() => null);
        if (result) { earned = new Set(result.map(row => row.logro)); renderAchievements(); }
      }
    } catch (error) { button.disabled = false; button.classList.remove('opening'); setMessage(errorText(error)); alert('No se ha podido abrir el cajón. ' + errorText(error)); }
  }
  function renderAchievements() {
    const grid = $('achievement-grid'); grid.replaceChildren();
    for (const [key,title,description] of achievements) {
      const item = document.createElement('div'); item.className = `achievement${earned.has(key)?' earned':''}`;
      const mark = document.createElement('span'); mark.className = 'achievement-mark'; mark.append(makeIcon(achievementIcon(key))); mark.setAttribute('aria-hidden','true');
      const text = document.createElement('span'); const strong = document.createElement('strong'); strong.textContent = title; const small = document.createElement('small'); small.textContent = description; text.append(strong,small); item.append(mark,text); grid.append(item);
    }
    $('achievement-status').textContent = `${earned.size} de 9 conseguidas`;
  }
  $('gift-close').addEventListener('click', () => gift.close());
  $('gift-later').addEventListener('click', () => gift.close());
  const caganerDialog = $<HTMLDialogElement>('caganer-dialog');
  board.addEventListener('caganer-found', event => {
    if (caganerDialog.open) return;
    /* the 3D house sends a portrait of the very figure that was found; without it, a gift icon stands in */
    const portrait = (event as CustomEvent<{ portrait?:string|null }>).detail?.portrait;
    const img = $<HTMLImageElement>('caganer-portrait');
    if (portrait) { img.src = portrait; img.alt = 'El caganer que has encontrado, con su barretina roja'; }
    img.hidden = !portrait; $('caganer-fallback').toggleAttribute('hidden', Boolean(portrait));
    caganerDialog.showModal(); $('caganer-ok').focus();
  });
  for (const id of ['caganer-close','caganer-ok']) $(id).addEventListener('click', () => caganerDialog.close());
  caganerDialog.addEventListener('click', event => { if (event.target === caganerDialog) caganerDialog.close(); });
  gift.addEventListener('click', event => { if (event.target === gift) gift.close(); });
  gift.addEventListener('close', () => { lastDoor?.focus(); lastDoor = null; });
  function snow() {
    const canvas = $<HTMLCanvasElement>('snow'); const ctx = canvas.getContext('2d');
    if (!ctx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const flakes = Array.from({length:innerWidth<640?32:70},(_,i)=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:i%12===0?2.2:Math.random()*1.3+.5,v:Math.random()*.55+.25,w:Math.random()*5}));
    let frame = 0;
    function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx!.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
    function draw(){frame=requestAnimationFrame(draw);ctx!.clearRect(0,0,innerWidth,innerHeight);for(const flake of flakes){flake.y+=flake.v;flake.x+=Math.sin(flake.y/42+flake.w)*.17;if(flake.y>innerHeight+5){flake.y=-5;flake.x=Math.random()*innerWidth;}ctx!.fillStyle='rgba(255,255,255,.74)';ctx!.beginPath();ctx!.arc(flake.x,flake.y,flake.r,0,Math.PI*2);ctx!.fill();}}
    resize();draw();addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(!frame)draw();});
  }
  const houseScene = document.querySelector<HTMLElement>('.house-scene');
  /* La casa CSS queda oculta hasta saber si hay WebGL; solo se muestra como respaldo. */
  const houseFallback = (error?:unknown) => { houseScene?.classList.add('is-fallback'); if (error) console.warn('Casa 3D no disponible, se muestra la versión CSS.', error); };
  if (houseScene) import('./adviento-house3d').then(module => module.mountHouse3D(houseScene, $('door-grid'), days)).then(house => { if (!house) houseFallback(); }).catch(houseFallback);
  snow(); start();
}

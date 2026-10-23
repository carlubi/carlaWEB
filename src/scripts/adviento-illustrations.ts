/**
 * Ilustraciones de las diapositivas: cada dibujo está hecho para el texto de su
 * diapositiva (ver adviento-drawings.ts), así que solo se ilustran las que tienen uno.
 */
import { drawingFor } from './adviento-drawings';

export function makeLearningIllustration(day:number, title:string):HTMLElement|null {
  const drawing = drawingFor(day, title);
  if (!drawing) return null;
  const figure = document.createElement('figure');
  figure.className = 'learning-illustration';
  figure.setAttribute('role', 'img');
  figure.setAttribute('aria-label', drawing.alt);
  figure.innerHTML = drawing.svg;
  return figure;
}

export function slidesForIllustration(day:number, slides:{ title:string; nodes:Node[] }[]):Set<number> {
  const illustrated = new Set<number>();
  slides.forEach((slide, index) => {
    /* las capturas, tablas y bloques de código ya ocupan el espacio del dibujo */
    const busy = slide.nodes.some(node => node instanceof Element && node.matches('figure, table, pre'));
    if (!busy && drawingFor(day, slide.title)) illustrated.add(index);
  });
  return illustrated;
}

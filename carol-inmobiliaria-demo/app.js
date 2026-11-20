const imageRoot = './manus-storage/async-images/';

const properties = [
  {
    id: 'la-encarnacion',
    title: 'Terreno en La Encarnación',
    city: 'Asunción',
    district: 'La Encarnación',
    area: 1442,
    areaText: '1.442 m² total',
    price: 433000,
    currency: 'USD',
    source: 'https://viaparaguay.com/es/propiedades/terreno-en-venta-en-barrio-la-encarnacion-asuncion',
    sourceLabel: 'Vía Paraguay',
    image: imageRoot + 'rqFGgf1y3G8mtK74iWgLlM/image-1.webp',
    note: '',
    alt: 'Imagen ilustrativa de un terreno suburbano amplio y verde, no es la fotografía del aviso.'
  },
  {
    id: 'san-vicente',
    title: 'Terreno en San Vicente',
    city: 'Asunción',
    district: 'San Vicente',
    area: 471,
    areaText: '471 m² total',
    price: 610000000,
    currency: 'PYG',
    source: 'https://viaparaguay.com/es/propiedades/terreno-en-venta-en-san-vicente-asuncion-7',
    sourceLabel: 'Vía Paraguay',
    image: imageRoot + 'rqFGgf1y3G8mtK74iWgLlM/image-2.webp',
    note: '',
    alt: 'Imagen ilustrativa de un lote urbano con césped en un vecindario residencial, no es la fotografía del aviso.'
  },
  {
    id: 'loma-pyta',
    title: 'Terreno en Loma Pytá',
    city: 'Asunción',
    district: 'Loma Pytá',
    area: 5400,
    areaText: '5.400 m² total',
    price: 1890000,
    currency: 'USD',
    source: 'https://viaparaguay.com/es/propiedades/terreno-en-venta-en-loma-pyta-asuncion-7',
    sourceLabel: 'Vía Paraguay',
    image: imageRoot + 'rqFGgf1y3G8mtK74iWgLlM/image-3.webp',
    note: '',
    alt: 'Imagen aérea ilustrativa de un terreno grande con vegetación y casas dispersas, no es la fotografía del aviso.'
  },
  {
    id: 'santisima-trinidad',
    title: 'Terreno en Santísima Trinidad',
    city: 'Asunción',
    district: 'Santísima Trinidad',
    area: 1627,
    areaText: '1.627 m² total',
    price: 813000,
    currency: 'USD',
    source: 'https://viaparaguay.com/es/propiedades/terreno-en-venta-en-santisima-trinidad-asuncion-5',
    sourceLabel: 'Vía Paraguay',
    image: imageRoot + 'rqFGgf1y3G8mtK74iWgLlM/image-4.webp',
    note: 'El aviso publica 1.627 m² en total; la suma de las tres medidas detalladas da 1.627,84 m².',
    alt: 'Imagen ilustrativa de un lote amplio con árboles y calle de tierra, no es la fotografía del aviso.'
  },
  {
    id: 'santa-maria',
    title: '5 lotes en Barrio Santa María',
    city: 'Encarnación',
    district: 'Barrio Santa María · Itapúa',
    area: 3440,
    areaText: '3.440 m² total',
    price: 412800,
    currency: 'USD',
    source: 'https://viaparaguay.com/es/propiedades/5-lotes-en-venta-en-barrio-santa-maria-encarnacion',
    sourceLabel: 'Vía Paraguay',
    image: imageRoot + 'rqFGgf1y3G8mtK74iWgLlM/image-5.webp',
    note: 'El encabezado publica 3.440 m²; la descripción detalla 3.440,80 m².',
    alt: 'Imagen ilustrativa de varios lotes contiguos en una zona residencial, no es la fotografía del aviso.'
  },
  {
    id: 'barrio-la-paz',
    title: 'Terreno en Barrio La Paz',
    city: 'Encarnación',
    district: 'Barrio La Paz · Itapúa',
    area: 503,
    areaText: '503 m² total',
    price: 180000,
    currency: 'USD',
    source: 'https://viaparaguay.com/es/propiedades/terreno-en-venta-en-barrio-la-paz-encarnacion-2',
    sourceLabel: 'Vía Paraguay',
    image: imageRoot + 'LQuhjMBoUUc9PoiHg1E3zT/image-1.webp',
    note: '',
    alt: 'Imagen ilustrativa de un terreno urbano con césped y árboles, no es la fotografía del aviso.'
  }
];

const grid = document.querySelector('#listings-grid');
const resultCount = document.querySelector('#results-count');
const emptyState = document.querySelector('#empty-state');
const locationFilter = document.querySelector('#location-filter');
const areaMinInput = document.querySelector('#area-min');
const areaMaxInput = document.querySelector('#area-max');
const currencyFilter = document.querySelector('#currency-filter');
const priceMinInput = document.querySelector('#price-min');
const priceMaxInput = document.querySelector('#price-max');
const currencyUnit = document.querySelector('#currency-unit');
const currencyUnitMax = document.querySelector('#currency-unit-max');
const currencyHint = document.querySelector('#currency-hint');
const filters = document.querySelector('#filters');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxLocation = document.querySelector('#lightbox-location');
const lightboxSource = document.querySelector('#lightbox-source');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxImageWrap = document.querySelector('#lightbox-image-wrap');
const zoomToggle = document.querySelector('#zoom-toggle');
let lastFocus = null;
let toastTimer;

const numberFormat = new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat('es-PY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function money(amount, currency, monthly = false) {
  const formatted = currency === 'USD'
    ? (monthly ? decimalFormat.format(amount) : numberFormat.format(amount))
    : numberFormat.format(Math.round(amount));
  return `${currency === 'USD' ? 'US$' : 'Gs.'} ${formatted}`;
}
function areaLabel(area) { return `${numberFormat.format(area)} m²`; }
function safe(value) {
  return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}
function waUrl(property) {
  const message = `Hola, vi el ejemplo de ${property.title} en la página de Carol Inmobiliaria. Quisiera consultar.`;
  return `https://wa.me/595971616033?text=${encodeURIComponent(message)}`;
}
function cardMarkup(property, index) {
  const monthly = property.price / 48;
  const note = property.note ? `<p class="property-note">${safe(property.note)}</p>` : '';
  return `
    <article class="property-card" style="animation-delay:${index * 55}ms">
      <div class="property-photo">
        <img src="${safe(property.image)}" alt="${safe(property.alt)}" loading="lazy">
        <span class="photo-tag">Imagen ilustrativa</span>
        <span class="photo-disclaimer">NO ES FOTO DEL LOTE ANUNCIADO</span>
        <button class="zoom-button" type="button" data-open-image="${safe(property.id)}" aria-label="Ampliar imagen ilustrativa de ${safe(property.title)}">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4.3 4.3M10.8 7.7v6.2M7.7 10.8h6.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="property-body">
        <div class="property-meta"><span class="location-tag">${safe(property.city)}</span><span class="district-tag">${safe(property.district)}</span></div>
        <h3 class="property-title">${safe(property.title)}</h3>
        <div class="property-spec"><span class="area-icon" aria-hidden="true">▦</span><span>${safe(property.areaText)}</span></div>
        <div class="property-price-label">Precio publicado en el aviso</div>
        <p class="property-price">${money(property.price, property.currency)}</p>
        <p class="price-qualifier">Referencia del valor publicado; el aviso no confirma un descuento por pago al contado.</p>
        <div class="installment-box"><div class="installment-copy"><span>SIMULACIÓN · 48 PAGOS IGUALES</span><strong>${money(monthly, property.currency, true)} <small>/ mes</small></strong></div><small>Sin interés<br>solo cálculo orientativo</small></div>
        ${note}
        <div class="property-actions"><a class="source-link" href="${safe(property.source)}" target="_blank" rel="noopener noreferrer">Ver anuncio original ↗</a><a class="consult-link whatsapp-link" href="${waUrl(property)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp sobre ${safe(property.title)}"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 11.8a8.1 8.1 0 0 1-12 7.1L4 20l1.1-4A8.1 8.1 0 1 1 20.2 11.8Z" stroke="currentColor" stroke-width="1.5"/><path d="M8.2 8.4c.3-.6.6-.6.9-.6h.4c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.5.6c-.2.2-.2.4 0 .7.6 1 1.5 1.8 2.5 2.3.3.1.5.1.7-.1l.7-.8c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.5 0 .3-.1 1-.6 1.4-.5.5-1.1.7-1.8.6-1-.1-2.2-.6-3.6-1.8-1.7-1.5-2.8-3.2-3-4.5-.1-.6.1-1.1.6-1.5Z" fill="currentColor"/></svg>Consultar</a></div>
      </div>
    </article>`;
}
function applyFilters() {
  const city = locationFilter.value;
  const minArea = areaMinInput.value === '' ? null : Number(areaMinInput.value);
  const maxArea = areaMaxInput.value === '' ? null : Number(areaMaxInput.value);
  const currency = currencyFilter.value;
  const minPrice = priceMinInput.value === '' ? null : Number(priceMinInput.value);
  const maxPrice = priceMaxInput.value === '' ? null : Number(priceMaxInput.value);
  const shown = properties.filter(property => {
    if (city !== 'all' && property.city !== city) return false;
    if (minArea !== null && property.area < minArea) return false;
    if (maxArea !== null && property.area > maxArea) return false;
    if (currency !== 'all' && property.currency !== currency) return false;
    if (currency !== 'all' && minPrice !== null && property.price < minPrice) return false;
    if (currency !== 'all' && maxPrice !== null && property.price > maxPrice) return false;
    return true;
  });
  grid.innerHTML = shown.map(cardMarkup).join('');
  grid.setAttribute('aria-busy', 'false');
  resultCount.textContent = String(shown.length).padStart(2, '0');
  emptyState.hidden = shown.length !== 0;
  grid.hidden = shown.length === 0;
}
function setCurrencyControl() {
  const currency = currencyFilter.value;
  const enabled = currency !== 'all';
  [priceMinInput, priceMaxInput].forEach(input => {
    input.disabled = !enabled;
    input.placeholder = enabled ? 'Sin límite' : 'Elegí moneda';
  });
  const unit = currency === 'USD' ? 'US$' : currency === 'PYG' ? 'Gs.' : '—';
  currencyUnit.textContent = unit;
  currencyUnitMax.textContent = unit;
  currencyHint.textContent = enabled
    ? `Rango aplicado solo a anuncios publicados en ${currency === 'USD' ? 'dólares estadounidenses' : 'guaraníes'}.`
    : 'Elegí una moneda para filtrar por precio. USD y Gs. no se mezclan.';
  applyFilters();
}
filters.addEventListener('input', applyFilters);
filters.addEventListener('change', event => {
  if (event.target === currencyFilter) setCurrencyControl();
  else applyFilters();
});
filters.addEventListener('reset', () => setTimeout(() => { setCurrencyControl(); }, 0));
document.querySelector('#empty-reset').addEventListener('click', () => {
  filters.reset();
  locationFilter.value = 'all';
  areaMinInput.value = '';
  areaMaxInput.value = '';
  currencyFilter.value = 'all';
  priceMinInput.value = '';
  priceMaxInput.value = '';
  setCurrencyControl();
});

function openLightbox(property) {
  lastFocus = document.activeElement;
  lightboxImage.src = property.image;
  lightboxImage.alt = property.alt;
  lightboxTitle.textContent = property.title;
  lightboxLocation.textContent = `${property.city} · ${property.district} · ${areaLabel(property.area)}`;
  lightboxSource.href = property.source;
  lightboxCaption.textContent = 'Imagen generada para esta demostración; no corresponde a la parcela anunciada.';
  lightboxImageWrap.classList.remove('zoomed');
  zoomToggle.innerHTML = '⌕ <span>Ampliar</span>';
  zoomToggle.setAttribute('aria-label', 'Ampliar imagen');
  lightbox.hidden = false;
  document.body.classList.add('modal-open');
  document.querySelector('#lightbox-close').focus();
}
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  document.body.classList.remove('modal-open');
  lightboxImage.removeAttribute('src');
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-open-image]');
  if (!button) return;
  const property = properties.find(item => item.id === button.dataset.openImage);
  if (property) openLightbox(property);
});
document.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelectorAll('[data-close-lightbox]').forEach(button => button.addEventListener('click', closeLightbox));
zoomToggle.addEventListener('click', () => {
  const zoomed = lightboxImageWrap.classList.toggle('zoomed');
  zoomToggle.innerHTML = zoomed ? '× <span>Ajustar</span>' : '⌕ <span>Ampliar</span>';
  zoomToggle.setAttribute('aria-label', zoomed ? 'Ajustar imagen a la pantalla' : 'Ampliar imagen');
});
lightboxImage.addEventListener('dblclick', () => zoomToggle.click());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeLightbox();
    closeMobileMenu();
  }
  if (event.key === 'Tab' && !lightbox.hidden) {
    const focusable = [...lightbox.querySelectorAll('button:not([disabled]), a[href]')];
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

const menuToggle = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMobileMenu() {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
}
menuToggle.addEventListener('click', () => {
  const opening = mobileMenu.hidden;
  mobileMenu.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMobileMenu(); });

document.querySelectorAll('.whatsapp-link').forEach(link => {
  link.addEventListener('click', () => {
    const toast = document.querySelector('#toast');
    toast.textContent = 'Abriendo WhatsApp para contactar al 0971 616033…';
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  });
});
setCurrencyControl();

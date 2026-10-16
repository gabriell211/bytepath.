import { BASE_RATE, currentRate, localCalendarDay, shouldReplace, sanitizedSettings } from './logic.mjs';

const STORE_KEY = 'bytepath_nicolas_optin_v1';
const NICK_URL = 'https://upload.wikimedia.org/wikipedia/commons/3/33/Nicolas_Cage_2011_CC.jpg';
const courses = [
  ['html','HTML & CSS','Seu primeiro site do zero','Estrutura, estilos e páginas responsivas.','Fundamentos','Comece aqui'],
  ['javascript','JavaScript','Dê vida às suas ideias','Aprenda eventos, funções e lógica na prática.','Linguagem','Mais popular'],
  ['typescript','TypeScript','Código com mais confiança','Tipos e ferramentas para projetos robustos.','Linguagem','Evolução'],
  ['react','React','Interfaces que impressionam','Componentes, estado e experiências modernas.','Frontend','Projetos reais'],
  ['php','PHP & Laravel','Construa o backend','Rotas, APIs e lógica do lado do servidor.','Backend','Do zero'],
  ['rust','Rust','Explore alta performance','Memória segura e ferramentas poderosas.','Sistemas','Avançado'],
  ['python','Python','Automatize o cotidiano','Scripts, dados e primeiros passos com Python.','Linguagem','Prático'],
  ['sql','SQL','Converse com seus dados','Consultas, tabelas e modelagem relacional.','Dados','Essencial'],
  ['git','Git & GitHub','Guarde cada evolução','Controle versões e colabore com segurança.','Ferramentas','Essencial'],
  ['node','Node.js','JavaScript no servidor','Construa APIs e integre serviços.','Backend','Para criar'],
  ['security','Segurança Web','Proteja seus projetos','Autenticação e boas práticas para aplicações.','Qualidade','Importante'],
  ['deploy','Deploy','Coloque seu projeto no ar','Domínio, hospedagem e primeiros deploys.','Publicação','Resultado'],
];

const learningLinks = {
  html:'https://developer.mozilla.org/pt-BR/docs/Web/HTML',
  javascript:'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript',
  typescript:'https://www.typescriptlang.org/docs/',
  react:'https://react.dev/learn',
  php:'https://laravel.com/docs',
  rust:'https://doc.rust-lang.org/book/',
  python:'https://docs.python.org/3/tutorial/',
  sql:'https://www.postgresql.org/docs/current/tutorial.html',
  git:'https://git-scm.com/book/pt-br/v2',
  node:'https://nodejs.org/en/learn',
  security:'https://developer.mozilla.org/pt-BR/docs/Web/Security',
  deploy:'https://vercel.com/docs/deployments'
};

const coursesHost = document.querySelector('#courses');
for (const [id, title, subtitle, description, category, level] of courses) {
  const article = document.createElement('article');
  article.className = 'course-card';
  const media = document.createElement('div'); media.className = 'course-media';
  const img = document.createElement('img');
  img.src = `./assets/trilha-${id}.svg`; img.alt = `Ilustração do curso ${title}`;
  img.loading = 'lazy'; img.width = 600; img.height = 340;
  img.dataset.prankTarget = id;
  img.dataset.originalSrc = img.src;
  media.append(img);
  const body = document.createElement('div'); body.className = 'course-body';
  const tags = document.createElement('div'); tags.className = 'course-tags';
  for (const text of [category, level]) {
    const tag = document.createElement('span'); tag.textContent = text; tags.append(tag);
  }
  const h3 = document.createElement('h3'); h3.textContent = subtitle;
  const p = document.createElement('p'); p.textContent = description;
  const anchor = document.createElement('a'); anchor.href = learningLinks[id];
  anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
  anchor.textContent = 'Abrir material gratuito ↗'; anchor.setAttribute('aria-label', `Abrir documentação sobre ${title} em nova aba`);
  body.append(tags,h3,p,anchor); article.append(media,body); coursesHost.append(article);
}

const dialog = document.querySelector('#experiment-dialog');
const toast = document.querySelector('#toast');
const demoImage = document.querySelector('#demo-image');
let demoTimer = null;
let toastTimer = null;
let consent = readConsent();

function readConsent() {
  try { return sanitizedSettings(JSON.parse(localStorage.getItem(STORE_KEY))); }
  catch { return null; }
}
function writeConsent(value) {
  try {
    if (value) localStorage.setItem(STORE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORE_KEY);
  } catch { showToast('Armazenamento indisponível: o efeito vale só nesta aba.'); }
}
function makeSeed() {
  if (globalThis.crypto?.getRandomValues) {
    const a = new Uint32Array(2); globalThis.crypto.getRandomValues(a);
    return Array.from(a, x => x.toString(36)).join('-').padEnd(8, '0');
  }
  return 'local-' + String(Date.now());
}
function applyEffect() {
  const rate = consent ? currentRate(consent.startDay) : 0;
  for (const img of document.querySelectorAll('img[data-prank-target]')) {
    const source = img.dataset.originalSrc;
    const replace = consent && shouldReplace(img.dataset.prankTarget, consent.seed, rate);
    img.src = replace ? NICK_URL : source;
    img.alt = replace ? 'Nicolas Cage, imagem de brincadeira ativada pelo visitante' : `Ilustração da trilha ${img.dataset.prankTarget}`;
    img.classList.toggle('is-cage', !!replace);
  }
  document.querySelector('#setting-state').textContent = consent ? 'Ativado' : 'Desativado';
  document.querySelector('#setting-rate').textContent = `${consent ? rate : BASE_RATE}%`;
  document.querySelector('#setting-day').textContent = `Dia ${consent ? Math.max(1, localCalendarDay() - consent.startDay + 1) : 1}`;
  document.querySelector('#enable-experiment').textContent = consent ? 'Já está ativado' : 'Ativar neste site';
  document.querySelector('#enable-experiment').disabled = !!consent;
}
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3800);
}
function openDialog() {
  applyEffect();
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}
function closeDialog() { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); }
document.querySelector('#open-experiment').addEventListener('click', openDialog);
const installDialog = document.querySelector('#install-dialog');
function closeInstallDialog() {
  if (!installDialog) return;
  if (typeof installDialog.close === 'function' && installDialog.open) installDialog.close();
  else installDialog.removeAttribute('open');
}
for (const selector of ['#skip-install', '#dismiss-install-x', '#go-to-store']) {
  document.querySelector(selector)?.addEventListener('click', closeInstallDialog);
}
installDialog?.addEventListener('click', event => {
  if (event.target === installDialog) closeInstallDialog();
});
// A janela aparece na abertura. A instalação só ocorre se o visitante
// escolher a loja oficial e confirmar as permissões no navegador.
if (installDialog) {
  if (typeof installDialog.showModal === 'function') installDialog.showModal();
  else installDialog.setAttribute('open', '');
}
document.querySelector('#close-dialog').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
document.querySelector('#enable-experiment').addEventListener('click', () => {
  if (consent) return;
  consent = { accepted: true, startDay: localCalendarDay(), seed: makeSeed() };
  writeConsent(consent);
  applyEffect(); closeDialog(); showToast('Experimento ativado! A chance começa em 1% e cresce 1 ponto por dia.');
});
document.querySelector('#disable-experiment').addEventListener('click', () => {
  consent = null; writeConsent(null); applyEffect(); closeDialog(); showToast('Experimento desativado. Todas as imagens voltaram ao normal.');
});


applyEffect();
// Recalcula na volta à aba e durante sessões longas, inclusive após mudança de dia.
document.addEventListener('visibilitychange', () => { if (!document.hidden) applyEffect(); });
setInterval(() => { if (!document.hidden) applyEffect(); }, 60_000);

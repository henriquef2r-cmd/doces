// Guarda as páginas do site para abrirem mesmo sem internet.
// Sempre tenta a versão nova primeiro; sem conexão, usa a cópia guardada.
// Chamadas para a planilha (script.google.com) não passam por aqui.
const CACHE = 'loja-v19';
const ARQUIVOS = ['./', 'inicio.html', 'index.html', 'pdv.html', 'encomenda.html', 'icone.svg', 'icone-192.png', 'icone-512.png', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});

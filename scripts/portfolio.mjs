// scripts/portfolio.mjs — gera a cópia jogável do Futrle para o portfólio.
//
// Uso (na pasta do futrle):  npm run portfolio
//
// O que faz:
//  1. Compila o jogo numa pasta temporária (fora de dist/), com base './'.
//     O build normal (npm run build / dist/) não é tocado.
//  2. Junta tudo num único index.html: o JS vai num <script type="module"> e o CSS
//     num <style>; as imagens importadas em src/ (escudos locais) viram data URI.
//     Assim a página abre direto do disco (file://) e também no GitHub Pages
//     (https://renatocandiani.github.io/projetos/futrle/).
//  3. Grava em ../portfolio/projetos/futrle o index.html + os arquivos de public/
//     que a página usa (ex.: favicon.svg) e apaga o que sobrou de cópias antigas.
//
// Opções (só para testes): --root <pasta do futrle>  --dest <pasta de saída>

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const opcao = (nome) => {
  const i = process.argv.indexOf(nome);
  return i > -1 ? process.argv[i + 1] : undefined;
};

const RAIZ = path.resolve(opcao('--root') ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const DESTINO = path.resolve(opcao('--dest') ?? path.join(RAIZ, '..', 'portfolio', 'projetos', 'futrle'));

// Trava de segurança: o destino é limpo (arquivos antigos são apagados), então
// só aceita uma pasta chamada "futrle" que não seja nem contenha o projeto.
const minusculo = (p) => p.toLowerCase();
if (
  path.basename(DESTINO) !== 'futrle' ||
  minusculo(RAIZ) === minusculo(DESTINO) ||
  minusculo(RAIZ).startsWith(minusculo(DESTINO) + path.sep) ||
  minusculo(DESTINO).startsWith(minusculo(RAIZ) + path.sep)
) {
  throw new Error(`Destino recusado: ${DESTINO}`);
}

// Usa o Vite instalado no próprio futrle (vale mesmo rodando o script de outro lugar).
const requireDoProjeto = createRequire(path.join(RAIZ, 'package.json'));
const { build, loadConfigFromFile, mergeConfig } = await import(
  pathToFileURL(requireDoProjeto.resolve('vite')).href
);

// Lista os arquivos de uma pasta (caminhos relativos com "/").
function listarArquivos(pasta, prefixo = '') {
  if (!fs.existsSync(pasta)) return [];
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? listarArquivos(path.join(pasta, e.name), `${prefixo}${e.name}/`)
      : [`${prefixo}${e.name}`],
  );
}

const saidaTemp = fs.mkdtempSync(path.join(os.tmpdir(), 'futrle-portfolio-'));
try {
  // 1. Build com a config normal do projeto (vite.config.js) + ajustes do portfólio.
  const env = { command: 'build', mode: 'production', isSsrBuild: false, isPreview: false };
  const carregada = await loadConfigFromFile(env, undefined, RAIZ, undefined, undefined, 'native');
  const config = mergeConfig(carregada?.config ?? {}, {
    root: RAIZ,
    base: './',
    build: {
      outDir: saidaTemp,
      emptyOutDir: true,
      assetsInlineLimit: () => true, // toda imagem importada vira data URI
      cssCodeSplit: false, // um CSS só
      modulePreload: { polyfill: false }, // nada a pré-carregar: é um arquivo só
      rolldownOptions: { output: { codeSplitting: false } }, // um único chunk JS
      chunkSizeWarningLimit: 8192, // o JS fica grande de propósito (escudos locais embutidos)
    },
  });
  await build({ ...config, configFile: false });

  // 2. Embute JS e CSS no index.html.
  let html = fs.readFileSync(path.join(saidaTemp, 'index.html'), 'utf8');
  const arquivoDe = (url) => path.join(saidaTemp, decodeURI(url.replace(/^\.\//, '')));

  const scripts = [...html.matchAll(/[ \t]*<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>[ \t]*\r?\n?/g)];
  if (scripts.length !== 1 || !/\btype="module"/.test(scripts[0][0])) {
    throw new Error(`Esperava 1 <script type="module" src>, achei ${scripts.length}.`);
  }
  const js = fs
    .readFileSync(arquivoDe(scripts[0][1]), 'utf8')
    .replace(/<\/(script)/gi, '<\\/$1') // "</script" dentro do JS fecharia a tag antes da hora
    .replace(/<!--/g, '\\x3C!--') // evita o modo "escaped" do parser de HTML
    .trim();

  const links = [...html.matchAll(/[ \t]*<link\b[^>]*\brel="stylesheet"[^>]*>[ \t]*\r?\n?/g)];
  const css = links
    .map((l) => fs.readFileSync(arquivoDe(l[0].match(/\bhref="([^"]+)"/)[1]), 'utf8'))
    .join('\n')
    .replace(/<\/(style)/gi, '<\\/$1')
    .trim();

  // Funções no replace: o JS tem "$" e não pode virar padrão de substituição.
  for (const tag of [...scripts, ...links]) html = html.replace(tag[0], () => '');

  // Arquivos de public/ que a página usa: os citados no HTML do Vite (ex.: favicon.svg)
  // e os que o JS citar pelo nome. O resto de public/ não vai para o portfólio.
  const htmlSemCodigo = html;
  const publicos = listarArquivos(saidaTemp).filter(
    (rel) =>
      !rel.startsWith('assets/') &&
      rel !== 'index.html' &&
      (htmlSemCodigo.includes(`"./${rel}"`) || htmlSemCodigo.includes(`"${rel}"`) || js.includes(rel)),
  );

  if (css) html = html.replace(/[ \t]*<\/head>/, () => `    <style>\n${css}\n    </style>\n  </head>`);
  html = html.replace(/[ \t]*<\/body>/, () => `    <script type="module">\n${js}\n    </script>\n  </body>`);

  // 3. Conferências: nada pode apontar para assets/ nem para caminhos "/x" da raiz
  //    (quebram em /projetos/futrle/ e no file://).
  const embutidos = new Set([scripts[0][1], ...links.map((l) => l[0].match(/\bhref="([^"]+)"/)[1])].map((u) => u.replace(/^\.\//, '')));
  for (const rel of listarArquivos(saidaTemp).filter((r) => r.startsWith('assets/') && !embutidos.has(r))) {
    if (html.includes(path.posix.basename(rel))) throw new Error(`Arquivo não embutido e ainda usado: ${rel}`);
    console.warn(`[portfolio] aviso: ${rel} foi gerado mas não é usado (ignorado).`);
  }
  if (/\b(?:src|href)\s*=\s*["']\/(?!\/)/i.test(htmlSemCodigo) || /url\(\s*["']?\/(?!\/)/i.test(css)) {
    throw new Error('Há src/href/url() com caminho absoluto "/..." no HTML/CSS.');
  }
  const pareceArquivo = /^(?:assets|img|src|public)\/|\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|m?js|json|html?|mp3|ogg|wav|woff2?|ttf)$/i;
  const absolutos = new Map();
  for (const m of html.matchAll(/(["'`])\/(?![/*])([^"'`\s<>]{0,60})/g)) {
    const trecho = `${m[1]}/${m[2]}`;
    if (pareceArquivo.test(m[2])) throw new Error(`Caminho absoluto de arquivo no JS: ${trecho}`);
    absolutos.set(trecho, (absolutos.get(trecho) ?? 0) + 1);
  }

  // 4. Grava no portfólio e apaga o que a nova cópia não usa mais.
  const novos = new Map([['index.html', html], ...publicos.map((rel) => [rel, fs.readFileSync(path.join(saidaTemp, rel))])]);
  for (const [rel, conteudo] of novos) {
    fs.mkdirSync(path.dirname(path.join(DESTINO, rel)), { recursive: true });
    fs.writeFileSync(path.join(DESTINO, rel), conteudo);
  }
  const removidos = listarArquivos(DESTINO).filter((rel) => !novos.has(rel));
  for (const rel of removidos) fs.rmSync(path.join(DESTINO, rel), { force: true });
  // pastas que ficaram vazias
  for (const e of fs.readdirSync(DESTINO, { withFileTypes: true })) {
    const p = path.join(DESTINO, e.name);
    if (e.isDirectory() && listarArquivos(p).length === 0) fs.rmSync(p, { recursive: true, force: true });
  }

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(`\n[portfolio] Cópia do Futrle gerada em ${DESTINO}`);
  console.log(`[portfolio] index.html: ${kb(Buffer.byteLength(html))} (JS ${kb(Buffer.byteLength(js))}, CSS ${kb(Buffer.byteLength(css))}, ${(js.match(/data:image\//g) ?? []).length} imagens em data URI)`);
  console.log(`[portfolio] arquivos de public/ copiados: ${publicos.join(', ') || '(nenhum)'}`);
  console.log(`[portfolio] removidos do destino: ${removidos.join(', ') || '(nenhum)'}`);
  console.log(`[portfolio] strings começando com "/" no JS (nenhuma é arquivo local): ${[...absolutos].map(([t, n]) => `${t} (${n}x)`).join('  ') || '(nenhuma)'}`);
} finally {
  fs.rmSync(saidaTemp, { recursive: true, force: true });
}

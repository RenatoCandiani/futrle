// Cloudflare Pages Function — endpoint /api/sugestoes
//
// POST  /api/sugestoes  → salva uma nova sugestão de time no banco D1
//   corpo: { "nome": "Nome do Time" }
//
// O binding do banco (env.DB) é configurado no painel do Cloudflare
// (Settings → Functions → D1 database bindings), com o nome "DB".

const MAX_NOME = 60; // limite de tamanho do nome (evita abuso)

// Resposta JSON com os cabeçalhos padrão.
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Banco não configurado ainda → erro claro (ajuda a depurar).
  if (!env.DB) {
    return json({ ok: false, erro: 'Banco de dados não configurado.' }, 500);
  }

  // Lê e valida o corpo.
  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return json({ ok: false, erro: 'Corpo inválido.' }, 400);
  }

  const nome = (corpo?.nome ?? '').toString().trim();
  if (!nome) {
    return json({ ok: false, erro: 'Nome do time é obrigatório.' }, 400);
  }
  if (nome.length > MAX_NOME) {
    return json({ ok: false, erro: 'Nome muito longo.' }, 400);
  }

  // País de origem do visitante (Cloudflare injeta esse cabeçalho de graça).
  const pais = request.headers.get('cf-ipcountry') || null;

  try {
    await env.DB
      .prepare('INSERT INTO sugestoes (nome, pais) VALUES (?, ?)')
      .bind(nome, pais)
      .run();
    return json({ ok: true });
  } catch {
    return json({ ok: false, erro: 'Falha ao salvar a sugestão.' }, 500);
  }
}

// Bloqueia outros métodos (GET etc.) com uma mensagem clara.
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return json({ ok: false, erro: 'Use POST para enviar uma sugestão.' }, 405);
  }
  return onRequestPost(context);
}

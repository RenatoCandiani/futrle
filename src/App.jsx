import { useState, useRef, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { TIMES } from './data/times';
import LogoFutrle from './LogoFutrle';
import './App.css';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const MAX_TENTATIVAS = 5;
const LS_STREAK      = 'futrle_streak';
const LS_MAX_STREAK  = 'futrle_max_streak';
const LS_JOGADOS     = 'futrle_jogados';

// Chave PIX (aleatória) para o botão "Apoie o projeto".
const PIX_CHAVE = 'e4372dbf-45d2-4872-85da-ba4debc9c582';
// PIX Copia e Cola (BR Code) — validado no app do banco (destinatário: Renato Candiani).
// Gerado a partir da chave acima + nome + cidade, com CRC16 calculado.
const PIX_BRCODE = '00020126580014br.gov.bcb.pix0136e4372dbf-45d2-4872-85da-ba4debc9c5825204000053039865802BR5915RENATO CANDIANI6009SAO PAULO62070503***630496C0';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Retorna o time do dia usando a data atual como seed.
 * Todo mundo vê o mesmo time no mesmo dia (modo diário).
 */
function getTimeDoDia() {
  const hoje = new Date();
  const seed  = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
  return TIMES[seed % TIMES.length];
}

/**
 * Sorteia um time aleatório (modo treino).
 */
function getTimeAleatorio() {
  return TIMES[Math.floor(Math.random() * TIMES.length)];
}

/**
 * Compara duas listas de cores:
 * 'correct' → mesmas cores (ignora ordem)
 * 'partial' → ao menos uma cor em comum
 * 'wrong'   → nenhuma em comum
 */
function compararCores(coresChute, coresDia) {
  const a = coresChute.map(c => c.toLowerCase());
  const b = coresDia.map(c => c.toLowerCase());
  if (a.length === b.length && a.every(c => b.includes(c))) return 'correct';
  if (a.some(c => b.includes(c))) return 'partial';
  return 'wrong';
}

/**
 * Normaliza texto para comparação tolerante:
 * - remove acentos (gremio = Grêmio)
 * - minúsculas
 * - remove tudo que não é letra/número (hífens, parênteses, espaços, pontos)
 * Ex: "Osasco Sporting (Oeste)" → "osascosportingoeste"
 */
function normalizar(txt) {
  return txt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');      // só letras e números
}

/**
 * Distância de Levenshtein (quantas edições para transformar a em b).
 * Usada para o "Você quis dizer?" quando o chute tem erro de digitação.
 */
function distancia(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let linhaAnterior = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const linhaAtual = [i];
    for (let j = 1; j <= n; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      linhaAtual[j] = Math.min(
        linhaAnterior[j] + 1,      // remoção
        linhaAtual[j - 1] + 1,     // inserção
        linhaAnterior[j - 1] + custo // substituição
      );
    }
    linhaAnterior = linhaAtual;
  }
  return linhaAnterior[n];
}

/**
 * Procura o time correspondente a um texto digitado, de forma tolerante.
 * Retorna { tipo, time }:
 *   tipo 'exato'    → bateu exatamente (após normalizar nome ou apelido)
 *   tipo 'sugestao' → não bateu, mas há um candidato próximo (typo)
 *   tipo 'nenhum'   → nada parecido
 */
function buscarTime(texto) {
  const alvo = normalizar(texto);
  if (!alvo) return { tipo: 'nenhum', time: null };

  // 1) Correspondência exata por nome OU apelido (ignorando acento/caixa/pontuação)
  for (const t of TIMES) {
    if (normalizar(t.nome) === alvo) return { tipo: 'exato', time: t };
    if (t.apelidos && t.apelidos.some(ap => normalizar(ap) === alvo)) {
      return { tipo: 'exato', time: t };
    }
  }

  // 2) Melhor candidato por distância de edição (para erros de digitação)
  let melhor = null;
  let melhorDist = Infinity;
  for (const t of TIMES) {
    const candidatos = [t.nome, ...(t.apelidos || [])];
    for (const cand of candidatos) {
      const d = distancia(alvo, normalizar(cand));
      if (d < melhorDist) { melhorDist = d; melhor = t; }
    }
  }

  // Tolera erro proporcional ao tamanho do texto (até ~40% de diferença, no mínimo 2).
  const limite = Math.max(2, Math.floor(alvo.length * 0.4));
  if (melhor && melhorDist <= limite) return { tipo: 'sugestao', time: melhor };

  return { tipo: 'nenhum', time: null };
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function App() {
  // Modo de jogo: 'diario' (1 por dia, vale streak) ou 'treino' (ilimitado, sem streak)
  const [modo,            setModo]            = useState('diario');
  // Alvo do treino (sorteado); no diário usamos getTimeDoDia()
  const [timeTreino,      setTimeTreino]      = useState(() => getTimeAleatorio());

  // O alvo atual depende do modo
  const timeDoDia = modo === 'diario' ? getTimeDoDia() : timeTreino;

  const [chutes,          setChutes]          = useState([]);
  const [input,           setInput]           = useState('');
  const [jogoFinalizado,  setJogoFinalizado]  = useState(false);
  const [venceu,          setVenceu]          = useState(false);
  const [imgCarregada,    setImgCarregada]    = useState(false);
  const [imgErro,         setImgErro]         = useState(false);  // fallback se escudo não carregar
  const [toast,           setToast]           = useState(null);   // { msg, tipo }
  const [shake,           setShake]           = useState(false);  // shake no input
  const [sugestao,        setSugestao]        = useState(null);   // "Você quis dizer: X?"
  const [streak,          setStreak]          = useState(() => Number(localStorage.getItem(LS_STREAK)  || 0));
  const [maxStreak,       setMaxStreak]       = useState(() => Number(localStorage.getItem(LS_MAX_STREAK) || 0));
  const [jogados,         setJogados]         = useState(() => Number(localStorage.getItem(LS_JOGADOS) || 0));
  const [aba,             setAba]             = useState('jogo'); // 'jogo' | 'times' | 'sugerir'
  const [sugInput,        setSugInput]        = useState('');     // texto da sugestão de time
  const [sugResultado,    setSugResultado]    = useState(null);   // { tipo, nome } do feedback
  const [sugEnviando,     setSugEnviando]     = useState(false);  // enviando pro backend
  const [sugEnviado,      setSugEnviado]      = useState(false);  // sugestão enviada com sucesso
  const [modalPix,        setModalPix]        = useState(false);  // modal "Apoie o projeto"
  const [qrPix,           setQrPix]           = useState('');     // dataURL do QR Code do PIX

  const toastTimer  = useRef(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, tipo = 'erro') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, tipo });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  // ── Confetes ───────────────────────────────────────────────────────────────
  const dispararConfetes = useCallback(() => {
    const end    = Date.now() + 3000;
    const colors = ['#538d4e', '#fca311', '#ffffff'];
    (function frame() {
      confetti({ particleCount: 3, angle: 60,  spread: 55, origin: { x: 0, y: 1 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }, []);

  // ── Atualizar streak / histórico ───────────────────────────────────────────
  const atualizarEstatisticas = useCallback((ganhou) => {
    const novosJogados = jogados + 1;
    setJogados(novosJogados);
    localStorage.setItem(LS_JOGADOS, novosJogados);

    if (ganhou) {
      const novaStreak = streak + 1;
      const novoMax    = Math.max(novaStreak, maxStreak);
      setStreak(novaStreak);
      setMaxStreak(novoMax);
      localStorage.setItem(LS_STREAK,     novaStreak);
      localStorage.setItem(LS_MAX_STREAK, novoMax);
    } else {
      setStreak(0);
      localStorage.setItem(LS_STREAK, 0);
    }
  }, [jogados, streak, maxStreak]);

  // ── Reinicia a partida (limpa o tabuleiro) ────────────────────────────────
  // A imagem do escudo é remontada pelo React via `key={timeDoDia.nome}` na <img>,
  // então NÃO mexemos no src manualmente (isso causava corrida e escudo sumindo).
  const reiniciarPartida = useCallback(() => {
    setImgCarregada(false);
    setImgErro(false);
    setChutes([]);
    setInput('');
    setSugestao(null);
    setJogoFinalizado(false);
    setVenceu(false);
  }, []);

  // ── Modo TREINO: nova partida com time aleatório ──────────────────────────
  const novoTreino = useCallback(() => {
    setTimeTreino(getTimeAleatorio());
    reiniciarPartida();
  }, [reiniciarPartida]);

  // ── Troca de modo (diário ⇄ treino) ───────────────────────────────────────
  const trocarModo = useCallback((novoModo) => {
    if (novoModo === modo) return;
    setModo(novoModo);
    if (novoModo === 'treino') setTimeTreino(getTimeAleatorio());
    reiniciarPartida();
  }, [modo, reiniciarPartida]);

  // ── Chutar ─────────────────────────────────────────────────────────────────
  // Recebe opcionalmente um time já resolvido (quando o usuário confirma a sugestão).
  const handleChutar = useCallback((timeConfirmado = null) => {
    let timeChutado = timeConfirmado;

    if (!timeChutado) {
      const r = buscarTime(input);
      if (r.tipo === 'exato') {
        timeChutado = r.time;
      } else if (r.tipo === 'sugestao') {
        // Não bateu exato, mas há um candidato próximo: oferece "Você quis dizer?"
        setSugestao(r.time);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        showToast('Nenhum time encontrado com esse nome!');
        return;
      }
    }

    setSugestao(null);

    if (chutes.some(c => c.nome === timeChutado.nome)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Você já chutou esse time!');
      return;
    }

    const resultado = {
      ...timeChutado,
      statusNome:   timeChutado.nome   === timeDoDia.nome   ? 'correct' : 'wrong',
      statusEstado: timeChutado.estado === timeDoDia.estado ? 'correct' : 'wrong',
      statusRegiao: timeChutado.regiao === timeDoDia.regiao ? 'correct' : 'wrong',
      statusCores:  compararCores(timeChutado.cores, timeDoDia.cores),
      // Fundação: 'correct' se mesmo ano; senão 'wrong' com dica de direção.
      // dicaFundacao: 'mais-velho' = o time do dia foi fundado ANTES (⬆️ procure mais antigo)
      //               'mais-novo'  = o time do dia foi fundado DEPOIS (⬇️ procure mais novo)
      statusFundacao: timeChutado.fundacao === timeDoDia.fundacao ? 'correct' : 'wrong',
      dicaFundacao:
        timeChutado.fundacao === timeDoDia.fundacao
          ? null
          : timeDoDia.fundacao < timeChutado.fundacao
            ? 'mais-velho'
            : 'mais-novo',
    };

    const novosChutes = [...chutes, resultado];
    setChutes(novosChutes);
    setInput('');

    const acertou = timeChutado.nome === timeDoDia.nome;
    if (acertou) {
      setJogoFinalizado(true);
      setVenceu(true);
      // Streak e estatísticas contam APENAS no modo diário.
      if (modo === 'diario') atualizarEstatisticas(true);
      dispararConfetes();
    } else if (novosChutes.length >= MAX_TENTATIVAS) {
      setJogoFinalizado(true);
      if (modo === 'diario') atualizarEstatisticas(false);
    }
  }, [input, chutes, timeDoDia, modo, showToast, dispararConfetes, atualizarEstatisticas]);

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleChutar(); };

  // ── Compartilhar ───────────────────────────────────────────────────────────
  const compartilhar = () => {
    const emojiMap = { correct: '🟩', partial: '🟨', wrong: '⬛' };
    let mapa = `Futrle BR 🇧🇷 — ${chutes.length}/${MAX_TENTATIVAS}\n\n`;
    chutes.forEach(c => {
      mapa +=
        emojiMap[c.statusNome]     +
        emojiMap[c.statusEstado]   +
        emojiMap[c.statusRegiao]   +
        emojiMap[c.statusFundacao] +
        emojiMap[c.statusCores]    + '\n';
    });
    mapa += '\nJogue em: https://renatocandiani.github.io/projetos/futrle/';
    navigator.clipboard.writeText(mapa).then(() => showToast('Copiado! 📋', 'sucesso'));
  };

  // ── Sugerir time ───────────────────────────────────────────────────────────
  // Fase 1 (sem backend): só verifica se o time já está na base e dá o feedback.
  // Fase 2 (Cloudflare): aqui vamos PERSISTIR a sugestão num banco.
  const verificarSugestao = () => {
    setSugEnviado(false);
    const texto = sugInput.trim();
    if (!texto) {
      setSugResultado({ tipo: 'vazio' });
      return;
    }
    const r = buscarTime(texto);
    if (r.tipo === 'exato') {
      setSugResultado({ tipo: 'existe', nome: r.time.nome, estado: r.time.estado });
    } else if (r.tipo === 'sugestao') {
      // Parecido com um time existente — mas pode ser um HOMÔNIMO diferente
      // (ex.: "Flamengo-SP" de Guarulhos ≠ "Flamengo" do RJ). Não afirmamos que
      // é o mesmo: mostramos qual já existe e deixamos a sugestão em aberto.
      setSugResultado({ tipo: 'parecido', nome: r.time.nome, estado: r.time.estado, digitado: texto });
    } else {
      setSugResultado({ tipo: 'novo', nome: texto });
    }
  };

  // ── Enviar sugestão pro backend (Cloudflare Function + D1) ─────────────────
  const enviarSugestao = async (nome) => {
    setSugEnviando(true);
    try {
      const resp = await fetch('/api/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });
      const dados = await resp.json().catch(() => ({}));
      if (resp.ok && dados.ok) {
        setSugEnviado(true);
        showToast('Sugestão enviada! Valeu 🙌', 'sucesso');
      } else {
        showToast(dados.erro || 'Não foi possível enviar. Tente mais tarde.');
      }
    } catch {
      showToast('Sem conexão com o servidor. Tente mais tarde.');
    } finally {
      setSugEnviando(false);
    }
  };

  // ── Copiar PIX Copia e Cola (BR Code) ──────────────────────────────────────
  const copiarPix = () => {
    navigator.clipboard.writeText(PIX_BRCODE)
      .then(() => showToast('PIX copiado! Cole no app do banco 🙌', 'sucesso'))
      .catch(() => showToast('Não consegui copiar — selecione o código manualmente.'));
  };

  // ── Gera o QR Code do PIX quando o modal abre ──────────────────────────────
  useEffect(() => {
    if (modalPix && !qrPix) {
      QRCode.toDataURL(PIX_BRCODE, { width: 220, margin: 1 })
        .then(setQrPix)
        .catch(() => {}); // se falhar, o modal ainda tem o copia-e-cola
    }
  }, [modalPix, qrPix]);

  // ── Blur dinâmico ──────────────────────────────────────────────────────────
  // 0 erros → 20px | 1 → 16px | 2 → 12px | 3 → 8px | 4 (última tent.) → 4px
  // O 0px só acontece ao finalizar o jogo (acerto ou derrota).
  const blurAtual = jogoFinalizado
    ? 0
    : Math.max(4, 20 - chutes.length * 4);

  const tentativasRestantes = MAX_TENTATIVAS - chutes.length;

  // ── Agrupamento para a aba "Times disponíveis" ──────────────────────────────
  // Ordem fixa das regiões; dentro de cada uma, agrupa por estado (UF).
  const ORDEM_REGIOES = ['Sul', 'Sudeste', 'Centro-Oeste', 'Nordeste', 'Norte'];
  const porRegiao = ORDEM_REGIOES
    .map(regiao => {
      const doRegiao = TIMES.filter(t => t.regiao === regiao);
      const estados = [...new Set(doRegiao.map(t => t.estado))].sort();
      return {
        regiao,
        total: doRegiao.length,
        estados: estados.map(uf => ({
          uf,
          times: doRegiao
            .filter(t => t.estado === uf)
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
        })),
      };
    })
    .filter(r => r.total > 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="futrle-app">

      {/* ─── AMBIENTAÇÃO DE ESTÁDIO (puro CSS, decorativo) ─── */}
      <div className="estadio-bg" aria-hidden="true">
        <div className="estadio-arquibancada" />
        <div className="estadio-gramado" />
        <div className="estadio-linha-central" />
        <div className="estadio-circulo-central" />
        <div className="estadio-bola estadio-bola--1" />
        <div className="estadio-bola estadio-bola--2" />
        <div className="estadio-refletor estadio-refletor--esq" />
        <div className="estadio-refletor estadio-refletor--dir" />
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`toast toast--${toast.tipo}`}>
          {toast.msg}
        </div>
      )}

      <div className={`game-container${aba === 'times' ? ' game-container--lista' : ''}`}>

        {/* HEADER */}
        <header className="game-header">
          <LogoFutrle size={76} />
          <h1 className="game-title">FUTRLE <span className="title-br">BR</span></h1>

          {/* STREAK */}
          <div className="streak-bar">
            <span title="Jogos">🎮 {jogados}</span>
            <span title="Sequência atual">🔥 {streak}</span>
            <span title="Melhor sequência">🏆 {maxStreak}</span>
          </div>

          <p className="game-subtitle">
            {jogoFinalizado
              ? venceu
                ? `🎯 GOLAÇO! Em ${chutes.length}/${MAX_TENTATIVAS}!`
                : `❌ Era o ${timeDoDia?.nome}`
              : modo === 'treino'
                ? '🎲 Modo treino — adivinhe o clube'
                : 'Adivinhe o clube pelo escudo'}
          </p>

          {/* ABAS: Jogo | Times disponíveis */}
          <div className="abas">
            <button
              className={`aba${aba === 'jogo' ? ' aba--ativa' : ''}`}
              onClick={() => setAba('jogo')}
            >
              ⚽ Jogo
            </button>
            <button
              className={`aba${aba === 'times' ? ' aba--ativa' : ''}`}
              onClick={() => setAba('times')}
            >
              📋 Times ({TIMES.length})
            </button>
            <button
              className={`aba${aba === 'sugerir' ? ' aba--ativa' : ''}`}
              onClick={() => setAba('sugerir')}
            >
              💡 Sugerir
            </button>
          </div>

          {/* SELETOR DE MODO (só na aba Jogo) */}
          {aba === 'jogo' && (
            <div className="modo-seletor">
              <button
                className={`modo-btn${modo === 'diario' ? ' modo-btn--ativo' : ''}`}
                onClick={() => trocarModo('diario')}
                title="Um desafio por dia, igual para todos — vale a sequência"
              >
                📅 Diário
              </button>
              <button
                className={`modo-btn${modo === 'treino' ? ' modo-btn--ativo' : ''}`}
                onClick={() => trocarModo('treino')}
                title="Jogue quantas vezes quiser com times aleatórios"
              >
                🎲 Treino
              </button>
            </div>
          )}
        </header>

        {/* ─── ABA: TIMES DISPONÍVEIS ─── */}
        {aba === 'times' && (
          <div className="lista-times">
            <p className="lista-intro">
              {TIMES.length} times no jogo, por região e estado.
            </p>
            {porRegiao.map(({ regiao, total, estados }) => (
              <section key={regiao} className="lista-regiao">
                <h2 className="lista-regiao-titulo">
                  {regiao} <span className="lista-regiao-count">{total}</span>
                </h2>
                {estados.map(({ uf, times }) => (
                  <div key={uf} className="lista-estado">
                    <h3 className="lista-estado-titulo">{uf}</h3>
                    <ul className="lista-estado-times">
                      {times.map(t => (
                        <li key={t.nome} className="lista-time-item">
                          <div className="lista-time-escudo">
                            <img
                              src={t.escudo}
                              alt={`Escudo do ${t.nome}`}
                              loading="lazy"
                              onError={(e) => {
                                // fallback: esconde a img e mostra as iniciais
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }}
                            />
                            <span className="lista-time-iniciais">
                              {t.nome.split(' ').map(p => p[0]).join('').slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <div className="lista-time-info">
                            <span className="lista-time-nome">{t.nome}</span>
                            <span className="lista-time-ano">Fundado em {t.fundacao}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}

        {/* ─── ABA: SUGERIR TIME ─── */}
        {aba === 'sugerir' && (
          <div className="sugerir">
            <p className="sugerir-intro">
              Faltou algum clube? Digite o nome e veja se ele já está no jogo.
            </p>
            <div className="sugerir-form">
              <input
                type="text"
                className="input-time"
                value={sugInput}
                onChange={(e) => { setSugInput(e.target.value); setSugResultado(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') verificarSugestao(); }}
                placeholder="Nome do time..."
                autoComplete="off"
              />
              <button className="btn-chutar" onClick={verificarSugestao}>
                VERIFICAR
              </button>
            </div>

            {sugResultado && (
              <div className={`sugerir-feedback sugerir-feedback--${sugResultado.tipo}`}>
                {sugResultado.tipo === 'vazio' && 'Digite o nome de um time primeiro.'}
                {sugResultado.tipo === 'existe' && (
                  <>✅ <strong>{sugResultado.nome}</strong> ({sugResultado.estado}) já está no jogo!</>
                )}
                {sugResultado.tipo === 'parecido' && (
                  sugEnviado ? (
                    <>🙌 Valeu! <strong>{sugResultado.digitado}</strong> foi enviado como clube diferente.</>
                  ) : (
                    <>
                      🤔 Já temos o <strong>{sugResultado.nome}</strong> ({sugResultado.estado}).
                      <br />
                      Se o seu <strong>{sugResultado.digitado}</strong> for outro clube:
                      <br />
                      <button
                        className="sugerir-enviar"
                        onClick={() => enviarSugestao(sugResultado.digitado)}
                        disabled={sugEnviando}
                      >
                        {sugEnviando ? 'Enviando…' : '📨 É outro clube, enviar'}
                      </button>
                    </>
                  )
                )}
                {sugResultado.tipo === 'novo' && (
                  sugEnviado ? (
                    <>🙌 Valeu! <strong>{sugResultado.nome}</strong> foi enviado pra fila de novos times.</>
                  ) : (
                    <>
                      📩 <strong>{sugResultado.nome}</strong> ainda não está no jogo.
                      <br />
                      <button
                        className="sugerir-enviar"
                        onClick={() => enviarSugestao(sugResultado.nome)}
                        disabled={sugEnviando}
                      >
                        {sugEnviando ? 'Enviando…' : '📨 Enviar sugestão'}
                      </button>
                    </>
                  )
                )}
              </div>
            )}

            <p className="sugerir-nota">
              Sua sugestão entra numa fila para novos times. Nem todo clube tem escudo disponível, mas toda sugestão é bem-vinda! ⚽
            </p>
          </div>
        )}

        {/* ─── ABA: JOGO ─── */}
        {aba === 'jogo' && (<>
        {/* ESCUDO */}
        <div
          className="escudo-box"
          onContextMenu={(e) => { if (!jogoFinalizado) e.preventDefault(); }}
        >
          {imgErro ? (
            /* Fallback: escudo não carregou — mostra iniciais do time */
            <div
              className="escudo-fallback"
              style={{ filter: `blur(${blurAtual}px)` }}
            >
              {timeDoDia.nome.split(' ').map(p => p[0]).join('').slice(0, 3).toUpperCase()}
            </div>
          ) : (
            <img
              key={timeDoDia.nome}
              ref={(el) => {
                // Se a imagem já veio do cache, 'complete' é true na montagem e o
                // onLoad pode não disparar — então marcamos como carregada aqui.
                if (el && el.complete && el.naturalWidth > 0) setImgCarregada(true);
              }}
              src={timeDoDia.escudo}
              alt="Escudo do time"
              className={[
                'escudo-img',
                imgCarregada  ? 'loaded'      : '',
                venceu        ? 'vitoria-anim': '',
              ].join(' ').trim()}
              style={{ filter: `blur(${blurAtual}px)`, opacity: imgCarregada ? 1 : 0 }}
              draggable={false}
              onLoad={() => setImgCarregada(true)}
              onError={() => setImgErro(true)}
            />
          )}
        </div>

        {/* CONTADOR DE TENTATIVAS */}
        {!jogoFinalizado && (
          <p className="tentativas-restantes">
            {tentativasRestantes === 1
              ? '⚠️ Última tentativa!'
              : `${tentativasRestantes} tentativas restantes`}
          </p>
        )}

        {/* INPUT */}
        {!jogoFinalizado && (
          <div className={`input-section${shake ? ' shake' : ''}`}>
            <input
              type="text"
              className="input-time"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              list="lista-times"
              placeholder="Qual é o time?"
              autoComplete="off"
            />
            <datalist id="lista-times">
              {[...TIMES].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(t => (
                <option key={t.nome} value={t.nome} />
              ))}
            </datalist>
            <button className="btn-chutar" onClick={() => handleChutar()}>
              CHUTAR
            </button>
          </div>
        )}

        {/* VOCÊ QUIS DIZER? (sugestão para erro de digitação) */}
        {!jogoFinalizado && sugestao && (
          <div className="sugestao">
            <span>Você quis dizer</span>
            <button
              className="sugestao-btn"
              onClick={() => handleChutar(sugestao)}
            >
              {sugestao.nome}
            </button>
            <span>?</span>
            <button
              className="sugestao-fechar"
              onClick={() => setSugestao(null)}
              aria-label="Dispensar sugestão"
            >
              ✕
            </button>
          </div>
        )}

        {/* LABELS */}
        <div className="stats-labels">
          <span>Time</span>
          <span>Estado</span>
          <span>Região</span>
          <span>Fundação</span>
          <span>Cores</span>
        </div>

        {/* SLOTS DE TENTATIVAS */}
        <div className="container-slots">
          {[...Array(MAX_TENTATIVAS)].map((_, i) => {
            const c = chutes[i];
            return (
              <div key={i} className={`guess-slot${c ? ' filled' : ''}`}>
                {c && (
                  <div className="guess-row">
                    {[
                      { status: c.statusNome,   label: c.nome },
                      { status: c.statusEstado, label: c.estado },
                      { status: c.statusRegiao, label: c.regiao },
                      {
                        status: c.statusFundacao,
                        label: c.dicaFundacao
                          ? `${c.fundacao} ${c.dicaFundacao === 'mais-velho' ? '⬆️' : '⬇️'}`
                          : c.fundacao,
                      },
                      { status: c.statusCores,  label: c.cores.join(', ') },
                    ].map(({ status, label }, j) => (
                      <div
                        key={j}
                        className={`square ${status}`}
                        style={{ animationDelay: `${j * 80}ms` }}
                      >
                        <span className="square-label">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* LEGENDA */}
        <div className="legenda">
          <span className="legenda-item"><span className="dot correct" />Correto</span>
          <span className="legenda-item"><span className="dot partial" />Parcial (cores)</span>
          <span className="legenda-item"><span className="dot wrong"   />Errado</span>
          <span className="legenda-item">⬆️ mais antigo · ⬇️ mais novo</span>
        </div>
        </>)}

      </div>

      {/* AÇÕES AO FINALIZAR */}
      {aba === 'jogo' && jogoFinalizado && (
        <div className="footer-actions">
          {modo === 'treino' ? (
            <button className="btn-compartilhar" onClick={novoTreino}>
              🎲 Jogar outro
            </button>
          ) : (
            <button className="btn-compartilhar" onClick={compartilhar}>
              Compartilhar Resultado 📲
            </button>
          )}
          {/* Apoio em destaque no fim do jogo — momento de maior engajamento */}
          <button className="btn-apoiar-destaque" onClick={() => setModalPix(true)}>
            {venceu ? '☕ Curtiu? Me paga um café!' : '☕ Quase! Me paga um café vai 😅'}
          </button>
        </div>
      )}

      {/* RODAPÉ: apoie o projeto (sempre acessível) */}
      <footer className="rodape">
        <button className="btn-apoiar" onClick={() => setModalPix(true)}>
          ☕ Apoie o projeto
        </button>
      </footer>

      {/* MODAL PIX */}
      {modalPix && (
        <div className="modal-overlay" onClick={() => setModalPix(false)}>
          <div className="modal-pix" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-fechar"
              onClick={() => setModalPix(false)}
              aria-label="Fechar"
            >
              ✕
            </button>
            <h2 className="modal-titulo">☕ Apoie o Futrle</h2>
            <p className="modal-texto">
              O Futrle é gratuito e feito por um torcedor só. Se curtiu, me paga um café via PIX — ajuda a manter o projeto no ar! ⚽
            </p>

            {/* QR Code pra escanear */}
            {qrPix && (
              <div className="modal-qr">
                <img src={qrPix} alt="QR Code do PIX" width="200" height="200" />
                <span className="modal-qr-legenda">Escaneie com o app do banco</span>
              </div>
            )}

            {/* PIX Copia e Cola */}
            <button className="btn-copiar-pix" onClick={copiarPix}>
              📋 Copiar código PIX (Copia e Cola)
            </button>

            {/* Chave simples, como alternativa */}
            <details className="modal-chave-alt">
              <summary>ou use a chave PIX</summary>
              <code className="modal-pix-codigo">{PIX_CHAVE}</code>
            </details>
            <p className="modal-recebedor">Recebedor: Renato Candiani</p>
          </div>
        </div>
      )}
    </div>
  );
}

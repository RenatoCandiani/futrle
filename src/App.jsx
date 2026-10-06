import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TIMES } from './data/times';
import './App.css';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const MAX_TENTATIVAS = 5;
const LS_STREAK      = 'futrle_streak';
const LS_MAX_STREAK  = 'futrle_max_streak';
const LS_JOGADOS     = 'futrle_jogados';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Retorna o time do dia usando a data atual como seed.
 * Todo mundo vê o mesmo time no mesmo dia.
 */
function getTimeDoDia() {
  const hoje = new Date();
  const seed  = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
  return TIMES[seed % TIMES.length];
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

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function App() {
  const timeDoDia = getTimeDoDia(); // estável: mesmo valor durante a sessão do dia

  const [chutes,          setChutes]          = useState([]);
  const [input,           setInput]           = useState('');
  const [jogoFinalizado,  setJogoFinalizado]  = useState(false);
  const [venceu,          setVenceu]          = useState(false);
  const [imgCarregada,    setImgCarregada]    = useState(false);
  const [imgErro,         setImgErro]         = useState(false);  // fallback se escudo não carregar
  const [toast,           setToast]           = useState(null);   // { msg, tipo }
  const [shake,           setShake]           = useState(false);  // shake no input
  const [streak,          setStreak]          = useState(() => Number(localStorage.getItem(LS_STREAK)  || 0));
  const [maxStreak,       setMaxStreak]       = useState(() => Number(localStorage.getItem(LS_MAX_STREAK) || 0));
  const [jogados,         setJogados]         = useState(() => Number(localStorage.getItem(LS_JOGADOS) || 0));
  const [novaPartida,     setNovaPartida]     = useState(false);  // flag para reset visual
  const [verLista,        setVerLista]        = useState(false);  // aba "Times disponíveis"

  const imgRef      = useRef(null);
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

  // ── Reset visual do escudo ao iniciar nova partida ─────────────────────────
  useEffect(() => {
    if (novaPartida) {
      if (imgRef.current) imgRef.current.src = '';
      setImgCarregada(false);
      setImgErro(false);
      setNovaPartida(false);
    }
  }, [novaPartida]);

  // ── Novo Jogo (reservado para uso futuro) ─────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  const novoJogo = useCallback(() => {
    if (imgRef.current) imgRef.current.src = '';
    setImgCarregada(false);
    setChutes([]);
    setInput('');
    setJogoFinalizado(false);
    setVenceu(false);
    setNovaPartida(true);
  }, []);

  // ── Chutar ─────────────────────────────────────────────────────────────────
  const handleChutar = useCallback(() => {
    const timeChutado = TIMES.find(
      t => t.nome.toLowerCase() === input.trim().toLowerCase()
    );

    if (!timeChutado) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Escolha um time válido da lista!');
      return;
    }

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

    if (timeChutado.nome === timeDoDia.nome) {
      setJogoFinalizado(true);
      setVenceu(true);
      atualizarEstatisticas(true);
      dispararConfetes();
    } else if (novosChutes.length >= MAX_TENTATIVAS) {
      setJogoFinalizado(true);
      atualizarEstatisticas(false);
    }
  }, [input, chutes, timeDoDia, showToast, dispararConfetes, atualizarEstatisticas]);

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
    navigator.clipboard.writeText(mapa).then(() => showToast('Copiado! 📋', 'sucesso'));
  };

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

      <div className={`game-container${verLista ? ' game-container--lista' : ''}`}>

        {/* HEADER */}
        <header className="game-header">
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
              : 'Adivinhe o clube pelo escudo'}
          </p>

          {/* ABAS: Jogo | Times disponíveis */}
          <div className="abas">
            <button
              className={`aba${!verLista ? ' aba--ativa' : ''}`}
              onClick={() => setVerLista(false)}
            >
              ⚽ Jogo
            </button>
            <button
              className={`aba${verLista ? ' aba--ativa' : ''}`}
              onClick={() => setVerLista(true)}
            >
              📋 Times ({TIMES.length})
            </button>
          </div>
        </header>

        {/* ─── ABA: TIMES DISPONÍVEIS ─── */}
        {verLista && (
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

        {/* ─── ABA: JOGO ─── */}
        {!verLista && (<>
        {/* ESCUDO */}
        <div className="escudo-box">
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
              ref={imgRef}
              src={timeDoDia.escudo}
              alt="Escudo do time"
              className={[
                'escudo-img',
                imgCarregada  ? 'loaded'      : '',
                venceu        ? 'vitoria-anim': '',
              ].join(' ').trim()}
              style={{ filter: `blur(${blurAtual}px)`, opacity: imgCarregada ? 1 : 0 }}
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
            <button className="btn-chutar" onClick={handleChutar}>
              CHUTAR
            </button>
          </div>
        )}

        {/* BOTÃO NOVO JOGO — removido: jogo é uma vez por dia */}

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

      {/* BOTÃO COMPARTILHAR */}
      {!verLista && jogoFinalizado && (
        <div className="footer-actions">
          <button className="btn-compartilhar" onClick={compartilhar}>
            Compartilhar Resultado 📲
          </button>
        </div>
      )}
    </div>
  );
}

-- Tabela de sugestões de times enviadas pelos jogadores.
-- Banco: Cloudflare D1 (SQLite).
CREATE TABLE IF NOT EXISTS sugestoes (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,              -- nome do time sugerido (como o jogador digitou)
  pais      TEXT,                       -- país de origem do visitante (cf-ipcountry), pensando no global
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))  -- data/hora em UTC
);

-- Índice para consultar as mais recentes primeiro.
CREATE INDEX IF NOT EXISTS idx_sugestoes_criado_em ON sugestoes (criado_em);

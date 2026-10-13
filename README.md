# ⚽ FUTRLE BR

Um jogo diário estilo Wordle para adivinhar clubes do futebol brasileiro pelo escudo.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)

## 🎮 Como Jogar

1. Um escudo de clube aparece **borrado** na tela
2. Você tem **5 tentativas** para adivinhar qual time é
3. A cada chute errado, o blur diminui, revelando mais do escudo
4. Após cada tentativa, você recebe dicas visuais:
   - 🟩 **Correto** — atributo igual ao do time do dia
   - 🟨 **Parcial** — ao menos uma cor em comum (apenas para cores)
   - ⬛ **Errado** — atributo diferente
   - Na coluna **Fundação**, uma seta indica a direção: ⬆️ o time do dia é mais antigo · ⬇️ é mais novo

### Atributos comparados

| Coluna   | Exemplo |
|----------|---------|
| Time     | Flamengo, Palmeiras... |
| Estado   | RJ, SP, MG... |
| Região   | Sudeste, Sul, Nordeste... |
| Fundação | 1895, 1914, 2019... (com dica de seta ⬆️/⬇️) |
| Cores    | Vermelho, Preto, Branco... |

### Mecânica do blur

| Tentativas usadas | Blur |
|:-:|:-:|
| 0 | 20px |
| 1 | 16px |
| 2 | 12px |
| 3 | 8px |
| 4 | 4px |
| Fim | 0px |

## 🏟️ Times Disponíveis

289 clubes de todo o Brasil — das Séries A, B, C e D a tradicionais e históricos de todas as 5 regiões (Sul, Sudeste, Centro-Oeste, Nordeste e Norte). De gigantes como Flamengo e Palmeiras a clubes de almanaque como Bangu, Guarany de Bagé, Gavião Kyikatejê e Mixto. O jogo compara por estado, região, fundação e cores — não por divisão, que muda a cada temporada.

## ✨ Funcionalidades

- **Um desafio por dia** — mesmo time para todos os jogadores (seed baseada na data)
- **Streak e estatísticas** — sequência de vitórias e total de jogos salvos no localStorage
- **Compartilhamento** — copie seu resultado em formato emoji para enviar aos amigos
- **Confetes** na vitória 🎉
- **Ambientação de estádio** — fundo temático de futebol (gramado em perspectiva, arquibancada, refletores e bolas flutuando nos cantos), tudo em CSS puro, sem imagens externas
- **Aba "Times"** — lista todos os clubes disponíveis agrupados por região e estado, com o ano de fundação de cada um
- **Aba "Sugerir"** — digite o nome de um clube e veja na hora se ele já está no jogo (trata homônimos: mostra o estado para diferenciar, ex. Flamengo-RJ vs Flamengo-SP)
- **Dois modos de jogo** — 📅 Diário (um desafio por dia, igual para todos, vale a sequência) e 🎲 Treino (jogue quantas vezes quiser com times aleatórios; não afeta a sequência)
- **Anti-cola** — durante o jogo, o escudo borrado bloqueia botão direito e arrastar, para dificultar ver o escudo sem o blur
- **Identidade própria** — logo/brasão vintage do Futrle (escudo em SVG) no topo e no favicon
- **Entrada tolerante** — não precisa acertar o nome exato: ignora acentos e maiúsculas ("gremio" = "Grêmio"), aceita apelidos ("oeste" para "Osasco Sporting") e sugere "Você quis dizer?" quando há erro de digitação
- **Responsivo** — funciona bem em mobile e desktop
- **Dark mode** por padrão

## 🛠️ Tech Stack

- **React 19** — UI declarativa com hooks
- **Vite 8** — bundler e dev server
- **canvas-confetti** — animação de confetes na vitória
- **CSS puro** — variáveis CSS, grid, animações (flip, shake)
- **LocalStorage** — persistência de streak e estatísticas

## 🚀 Rodando localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Pré-visualizar build
npm run preview
```

## 🌐 Cópia para o portfólio

```bash
npm run portfolio
```

Gera a versão jogável que fica no portfólio (`../portfolio/projetos/futrle`): um único `index.html` com o JS, o CSS e os escudos locais embutidos, mais o `favicon.svg`. Assim o jogo abre no GitHub Pages e também direto do disco (`file://`). O build normal (`npm run build` / `dist/`) não muda.

Rode sempre que o jogo mudar (times novos, escudos, visual) e depois suba de novo a pasta `projetos/futrle` do portfólio.

## 📁 Estrutura do Projeto

```
futrle/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── img/              # Escudos locais (backup)
├── scripts/
│   └── portfolio.mjs     # Gera a cópia do jogo para o portfólio (npm run portfolio)
├── src/
│   ├── App.jsx           # Componente principal do jogo
│   ├── App.css           # Estilos do jogo
│   ├── data/
│   │   └── times.js      # Base de dados dos times
│   ├── index.css
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 📝 Notas

- Os escudos são carregados via Wikimedia Commons / Wikipedia (domínio público / PD-textlogo), com URLs resolvidas pela API oficial do Wikipedia
- Caso o escudo não carregue, um fallback com as iniciais do time é exibido — então nenhum time quebra o jogo
- O time do dia é determinístico: `seed = ano*10000 + mês*100 + dia`, indexado na lista de times
- A coluna **Fundação** usa o ano de fundação (dado estável) em vez de divisão, com dica de seta para orientar o palpite

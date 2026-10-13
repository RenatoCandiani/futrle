// Logo/brasão do Futrle — escudo vintage, 100% SVG (sem imagem externa).
// Usada no topo do jogo. O mesmo desenho vira o favicon em public/favicon.svg.
export default function LogoFutrle({ size = 72 }) {
  return (
    <svg
      viewBox="0 0 260 300"
      width={size}
      height={size * (300 / 260)}
      role="img"
      aria-label="Escudo do Futrle"
      className="logo-futrle"
    >
      <defs>
        <linearGradient id="futrleCorpo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#20201f" />
          <stop offset="1" stopColor="#121212" />
        </linearGradient>
      </defs>

      {/* Aro externo dourado */}
      <path
        d="M130 8 L246 46 L246 168 Q246 250 130 292 Q14 250 14 168 L14 46 Z"
        fill="#c8841a"
        stroke="#8a5a10"
        strokeWidth="3"
      />
      {/* Anel escuro */}
      <path
        d="M130 22 L234 56 L234 166 Q234 240 130 278 Q26 240 26 166 L26 56 Z"
        fill="#121212"
      />
      {/* Corpo */}
      <path
        d="M130 34 L223 65 L223 164 Q223 232 130 266 Q37 232 37 164 L37 65 Z"
        fill="url(#futrleCorpo)"
        stroke="#fca311"
        strokeWidth="2.5"
      />
      {/* Três estrelas */}
      <g fill="#fca311">
        <path d="M100 56 l3 7 8 .6 -6 5 2 7.6 -7 -4.2 -7 4.2 2 -7.6 -6 -5 8 -.6z" />
        <path d="M130 50 l3.4 8 9 .7 -6.8 5.6 2.2 8.6 -7.8 -4.7 -7.8 4.7 2.2 -8.6 -6.8 -5.6 9 -.7z" />
        <path d="M160 56 l3 7 8 .6 -6 5 2 7.6 -7 -4.2 -7 4.2 2 -7.6 -6 -5 8 -.6z" />
      </g>
      {/* Monograma FBR */}
      <text
        x="130" y="158"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="76" fontWeight="700" fill="#f4f4f4"
        textAnchor="middle" fontStyle="italic"
      >
        FBR
      </text>
      {/* Faixa verde */}
      <path d="M34 182 L226 182 L214 206 L46 206 Z" fill="#538d4e" stroke="#2f5a2c" strokeWidth="2" />
      <text
        x="130" y="200"
        fontFamily="Georgia, serif" fontSize="19" fontWeight="700"
        fill="#ffffff" textAnchor="middle" letterSpacing="3"
      >
        FUTRLE
      </text>
      {/* Data de fundação */}
      <text
        x="130" y="236"
        fontFamily="Georgia, serif" fontSize="15" fontWeight="700"
        fill="#fca311" textAnchor="middle" letterSpacing="4"
      >
        — 2025 —
      </text>
    </svg>
  );
}

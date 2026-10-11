// ─── BASE DE TIMES ────────────────────────────────────────────────────────────
// Escudos via Wikimedia Commons / Wikipedia (domínio público / PD-textlogo).
// URLs resolvidas pela API oficial do Wikipedia (pt.wikipedia.org).
//
// Estrutura de cada time:
//   nome     → nome popular do clube
//   estado   → sigla da UF
//   regiao   → macrorregião do Brasil
//   fundacao → ano de fundação (number) — dica com seta ⬆️/⬇️ no jogo
//   cores    → cores predominantes do clube
//   escudo   → URL da imagem do escudo
//   apelidos → (OPCIONAL) array de nomes alternativos aceitos como chute
//              Ex: ["Oeste", "Osasco"]. O jogo já ignora acento, caixa e
//              pontuação, então só adicione apelidos realmente diferentes.

const WK  = 'https://upload.wikimedia.org/wikipedia/commons';
const WKE = 'https://upload.wikimedia.org/wikipedia/en';
const WKP = 'https://upload.wikimedia.org/wikipedia/pt';

// ─── ESCUDOS LOCAIS (src/img) ───────────────────────────────────────────────
// Clubes sem escudo no Wikipedia; imagens fornecidas manualmente.
// No Vite, imagens em src/ são importadas (o bundler resolve a URL final).
// Região Sul:
import escBarra            from '../img/sul/barra.png';
import escBrasilPelotas    from '../img/sul/brasilDePelotas.png';
import escEsportivo        from '../img/sul/esportivo.png';
import escInterSantaMaria  from '../img/sul/interDeSantaMaria.png';
import escJMalucelli       from '../img/sul/jMalu.png';
import escMaringaFc        from '../img/sul/maringaFc.png';
import escNacao            from '../img/sul/nacao.png';
import escParanavai        from '../img/sul/paranavai.png';
import escVeranopolis      from '../img/sul/veranopolis.png';
// Região Sudeste:
import escAngraDosReis     from '../img/sudeste/AngraDosReis.png';
import escAsterBrasil      from '../img/sudeste/AsterBrasil.png';
import escComercialLins    from '../img/sudeste/comercialDeLins.png';
import escGuaraniDivi      from '../img/sudeste/guaraniDivi.png';
import escJaguare          from '../img/sudeste/jagaure.png';
import escLinense          from '../img/sudeste/linense.png';
import escMonteAzul        from '../img/sudeste/monteAzul.png';
import escNacionalMuriae   from '../img/sudeste/nacionalMuriae.png';
import escNoroeste         from '../img/sudeste/noroeste.png';
import escOeste            from '../img/sudeste/oeste.png';
import escPrimavera        from '../img/sudeste/primavera.png';
import escRioBrancoSP      from '../img/sudeste/rioBranco.png';
import escSaoCristovao     from '../img/sudeste/saoCristovao.png';
import escSaoJoaoDaBarra   from '../img/sudeste/saoJoaoDaBarra.png';
import escSerranoRJ        from '../img/sudeste/serrano.png';
import escAmericaMG        from '../img/sudeste/americamg.png';
import escAmericano        from '../img/sudeste/americanorj.png';
// Região Sul (lote 2):
import escYpirangaRS       from '../img/sul/ypiranga.png';
// Região Nordeste:
import escConfianca        from '../img/nordeste/confiancase.png';
// Região Norte:
import escHumaita          from '../img/norte/humaitaac.png';
// Região Centro-Oeste:
import escOperarioMT       from '../img/centroOeste/operariomt.png';

// Array em ordem alfabética. Mantenha a ordem ao adicionar times.
export const TIMES = [
  {
    nome: "4 de Julho", estado: "PI", regiao: "Nordeste", fundacao: 1946,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/1/1f/4_de_Julho_Esporte_Clube_logo_%28with_4_stars%29.png`,
  },
  {
    nome: "ABC", estado: "RN", regiao: "Nordeste", fundacao: 1915,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/e/e8/ABC_FC_%28E%29_-_RN.svg`,
  },
  {
    nome: "Água Santa", estado: "SP", regiao: "Sudeste", fundacao: 1981,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/b/b8/Ecaguasanta.png`,
  },
  {
    nome: "Águia de Marabá", estado: "PA", regiao: "Norte", fundacao: 1982,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/3/3d/%C3%81guia_de_Marab%C3%A1.png`,
  },
  {
    nome: "Águia Negra", estado: "MS", regiao: "Centro-Oeste", fundacao: 2003,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/1/19/ECAguiaNegra.png`,
  },
  {
    nome: "Aimoré", estado: "RS", regiao: "Sul", fundacao: 1936,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/c/c8/CEAimor%C3%A9.png`,
  },
  {
    nome: "Altos", estado: "PI", regiao: "Nordeste", fundacao: 2013,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/d/df/Associa%C3%A7%C3%A3o_Atl%C3%A9tica_de_Altos.png`,
  },
  {
    nome: "América Football Club (RJ)", estado: "RJ", regiao: "Sudeste", fundacao: 1904,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/3/38/America_Football_Club_%28Rio_de_Janeiro%2C_Brazil%29_logo.svg`,
  },
  {
    nome: "América-MG", estado: "MG", regiao: "Sudeste", fundacao: 1912,
    cores: ["Verde", "Branco"],
    escudo: escAmericaMG,
  },
  {
    nome: "América-PE", estado: "PE", regiao: "Nordeste", fundacao: 1914,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/6/6c/America_FC_%28PE%29.svg`,
  },
  {
    nome: "América-RN", estado: "RN", regiao: "Nordeste", fundacao: 1915,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/6/61/Am%C3%A9rica_Futebol_Clube_%28Natal%29_logo_%282023%29.png`,
  },
  {
    nome: "América-SP", estado: "SP", regiao: "Sudeste", fundacao: 1930,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/c/c4/America_FC-SJ_%28A1%29_-_SP.svg`,
  },
  {
    nome: "Amazonas", estado: "AM", regiao: "Norte", fundacao: 2019,
    cores: ["Verde", "Branco", "Preto"],
    escudo: `${WKP}/7/74/AmazonasFC.png`,
  },
  {
    nome: "Americano", estado: "RJ", regiao: "Sudeste", fundacao: 1917,
    cores: ["Vermelho", "Branco"],
    escudo: escAmericano,
  },
  {
    nome: "Anapolina", estado: "GO", regiao: "Centro-Oeste", fundacao: 1945,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/f/f2/AA_Anapolina-06.svg`,
  },
  {
    nome: "Anápolis", estado: "GO", regiao: "Centro-Oeste", fundacao: 1946,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/8/85/An%C3%A1polis-GO_%28BRA%29.png`,
  },
  {
    nome: "Andirá", estado: "AC", regiao: "Norte", fundacao: 1965,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/7/7f/Andira-Esporte-Clube-AC.png`,
  },
  {
    nome: "Angra dos Reis", estado: "RJ", regiao: "Sudeste", fundacao: 1952,
    cores: ["Azul", "Branco"],
    escudo: escAngraDosReis,
  },
  {
    nome: "Aparecidense", estado: "GO", regiao: "Centro-Oeste", fundacao: 1986,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/a/a4/Aparecidense2022.png`,
  },
  {
    nome: "Araguaína", estado: "TO", regiao: "Norte", fundacao: 2003,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/9/9c/AraguainaFR.png`,
  },
  {
    nome: "ASA", estado: "AL", regiao: "Nordeste", fundacao: 1952,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/e/e4/Escudo_ASA.png`,
  },
  {
    nome: "Aster Brasil", estado: "ES", regiao: "Sudeste", fundacao: 2020,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: escAsterBrasil,
  },
  {
    nome: "Athletic", estado: "MG", regiao: "Sudeste", fundacao: 1909,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/f/f8/Athletic_Club_%28Minas_Gerais%29.svg`,
  },
  {
    nome: "Athletico-PR", estado: "PR", regiao: "Sul", fundacao: 1924,
    cores: ["Vermelho", "Preto"],
    escudo: `${WK}/4/43/Athletico_Paranaense_%28Logo_2019%29.svg`,
  },
  {
    nome: "Atlético Acreano", estado: "AC", regiao: "Norte", fundacao: 1952,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/1/15/Escudoatleticoac.png`,
  },
  {
    nome: "Atlético Cearense", estado: "CE", regiao: "Nordeste", fundacao: 1997,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/2/2d/FCAtl%C3%A9ticoCearense.png`,
  },
  {
    nome: "Atlético de Alagoinhas", estado: "BA", regiao: "Nordeste", fundacao: 1972,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/e/ea/AA_Alagoinhas_-_BA.svg`,
  },
  {
    nome: "Atlético Goianiense", estado: "GO", regiao: "Centro-Oeste", fundacao: 1937,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/9/91/Atl%C3%A9tico_Goianiense_logo_%28sem_estrelas%29.png`,
  },
  {
    nome: "Atlético-MG", estado: "MG", regiao: "Sudeste", fundacao: 1908,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/2/27/Clube_Atl%C3%A9tico_Mineiro_logo.svg`,
  },
  {
    nome: "Atlético Roraima", estado: "RR", regiao: "Norte", fundacao: 1944,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/5/5d/ARCRoraima_2018.png`,
  },
  {
    nome: "Audax Rio", estado: "RJ", regiao: "Sudeste", fundacao: 2005,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/2/2a/Escudo_Audax_Rio_2017.png`,
  },
  {
    nome: "Auto Esporte-PB", estado: "PB", regiao: "Nordeste", fundacao: 1936,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/2/2b/Auto_Esporte_Clube_%28Para%C3%ADba%29_logo.png`,
  },
  {
    nome: "Avaí", estado: "SC", regiao: "Sul", fundacao: 1923,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/8/8c/Ava%C3%AD_Futebol_Clube_logo.svg`,
  },
  {
    nome: "Avenida", estado: "RS", regiao: "Sul", fundacao: 1933,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/4/4f/Esporte_Clube_Avenida.svg`,
  },
  {
    nome: "Azuriz", estado: "PR", regiao: "Sul", fundacao: 2019,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/3/3f/Azuriz_FC.png`,
  },
  {
    nome: "Bahia", estado: "BA", regiao: "Nordeste", fundacao: 1931,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WK}/2/2c/Esporte_Clube_Bahia_logo.svg`,
  },
  {
    nome: "Bahia de Feira", estado: "BA", regiao: "Nordeste", fundacao: 1937,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WK}/0/0b/Associa%C3%A7%C3%A3o_Desportiva_Bahia_de_Feira.png`,
  },
  {
    nome: "Bangu", estado: "RJ", regiao: "Sudeste", fundacao: 1904,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/c/ca/Bangu_Atletico_Clube.svg`,
  },
  {
    nome: "Baré", estado: "RR", regiao: "Norte", fundacao: 1947,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/8/8c/Bar%C3%A9EC_logo.png`,
  },
  {
    nome: "Barra", estado: "SC", regiao: "Sul", fundacao: 2007,
    cores: ["Azul", "Branco"],
    escudo: escBarra,
  },
  {
    nome: "Barra Mansa", estado: "RJ", regiao: "Sudeste", fundacao: 1933,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/5/5c/Barra_Mansa_Futebol_Clube_escudo.png`,
  },
  {
    nome: "Barretos", estado: "SP", regiao: "Sudeste", fundacao: 1973,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/4/42/Barretos_EC.svg`,
  },
  {
    nome: "Bento Gonçalves", estado: "RS", regiao: "Sul", fundacao: 1919,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/3/36/Clube_Esportivo_Bento_Gon%C3%A7alves_logo.svg`,
  },
  {
    nome: "Boa Esporte", estado: "MG", regiao: "Sudeste", fundacao: 1973,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/b/ba/Boa_EC_-_MG.svg`,
  },
  {
    nome: "Boavista", estado: "RJ", regiao: "Sudeste", fundacao: 2002,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/d/d5/Boavista_Sport_Club_SAF_logo.png`,
  },
  {
    nome: "Bonsucesso", estado: "RJ", regiao: "Sudeste", fundacao: 1913,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/7/76/Bonsucesso_FC_-_Oficial.png`,
  },
  {
    nome: "Botafogo", estado: "RJ", regiao: "Sudeste", fundacao: 1904,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg`,
  },
  {
    nome: "Botafogo-PB", estado: "PB", regiao: "Nordeste", fundacao: 1931,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/b/b8/BotafogoPB_logo.png`,
  },
  {
    nome: "Botafogo-SP", estado: "SP", regiao: "Sudeste", fundacao: 1918,
    cores: ["Preto", "Branco", "Vermelho"],
    escudo: `${WK}/3/3e/Botafogo_Futebol_Clube.svg`,
  },
  {
    nome: "Bragantino-PA", estado: "PA", regiao: "Norte", fundacao: 1975,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/9/96/BragantinoCP2018.png`,
  },
  {
    nome: "Brasil de Pelotas", estado: "RS", regiao: "Sul", fundacao: 1911,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: escBrasilPelotas,
  },
  {
    nome: "Brasiliense", estado: "DF", regiao: "Centro-Oeste", fundacao: 2000,
    cores: ["Amarelo", "Azul"],
    escudo: `${WKP}/3/3a/Brasiliense_Futebol_Clube.png`,
  },
  {
    nome: "Brusque", estado: "SC", regiao: "Sul", fundacao: 1987,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/b/b8/Brusque_Futebol_Clube_logo_%282023%29.png`,
  },
  {
    nome: "CRAC", estado: "GO", regiao: "Centro-Oeste", fundacao: 1970,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/d/d2/Escudo_do_Clube_Recreativo_e_Atl%C3%A9tico_Catalano_%28CRAC%29.svg`,
  },
  {
    nome: "CRB", estado: "AL", regiao: "Nordeste", fundacao: 1912,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/f/fe/Clube_de_Regatas_Brasil_logo.svg`,
  },
  {
    nome: "CSA", estado: "AL", regiao: "Nordeste", fundacao: 1913,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/f/fa/Centro_Sportivo_Alagoano_logo.png`,
  },
  {
    nome: "Cabofriense", estado: "RJ", regiao: "Sudeste", fundacao: 1997,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/f/f5/AD_Cabofriense_-_RJ.svg`,
  },
  {
    nome: "Caldense", estado: "MG", regiao: "Sudeste", fundacao: 1925,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/1/11/LOGO-OFICIAL-DA-CALDENSE-contorno-verde.png`,
  },
  {
    nome: "Camboriú", estado: "SC", regiao: "Sul", fundacao: 1973,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/1/17/Escudo_do_Cambori%C3%BA_FC_%282022%29.png`,
  },
  {
    nome: "Cametá", estado: "PA", regiao: "Norte", fundacao: 1973,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/3/3b/CametaSC.png`,
  },
  {
    nome: "Campinense", estado: "PB", regiao: "Nordeste", fundacao: 1915,
    cores: ["Preto", "Branco", "Vermelho"],
    escudo: `${WK}/7/7d/Campinense_Clube_logo.png`,
  },
  {
    nome: "Canto do Rio", estado: "RJ", regiao: "Sudeste", fundacao: 1913,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/f/fa/Cantusca.png`,
  },
  {
    nome: "Capital-DF", estado: "DF", regiao: "Centro-Oeste", fundacao: 2007,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/a/a8/Capital_CF_escudo_%282024%29.png`,
  },
  {
    nome: "Capivariano", estado: "SP", regiao: "Sudeste", fundacao: 1946,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/4/43/Capivariano_FC.png`,
  },
  {
    nome: "Cascavel CR", estado: "PR", regiao: "Sul", fundacao: 2001,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/d/d8/CASCAVEL2001.png`,
  },
  {
    nome: "Castanhal", estado: "PA", regiao: "Norte", fundacao: 1921,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/b/b0/Castanhal_Esporte_Clube.svg`,
  },
  {
    nome: "Caxias", estado: "RS", regiao: "Sul", fundacao: 1935,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/9/92/Escudo_Oficial_da_Sociedade_Esportiva_e_Recreativa_Caxias_do_Sul.svg`,
  },
  {
    nome: "Ceará", estado: "CE", regiao: "Nordeste", fundacao: 1914,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/3/38/Cear%C3%A1_Sporting_Club_logo.svg`,
  },
  {
    nome: "Ceilândia", estado: "DF", regiao: "Centro-Oeste", fundacao: 1979,
    cores: ["Amarelo", "Verde", "Branco"],
    escudo: `${WK}/0/06/Escudo_ceilandia-removebg-preview.png`,
  },
  {
    nome: "Central", estado: "PE", regiao: "Nordeste", fundacao: 1920,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/2/2a/CentralSC.png`,
  },
  {
    nome: "Chapecoense", estado: "SC", regiao: "Sul", fundacao: 1973,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/4/4e/Logo_Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol.svg`,
  },
  {
    nome: "Cianorte", estado: "PR", regiao: "Sul", fundacao: 1971,
    cores: ["Verde", "Branco", "Vermelho"],
    escudo: `${WKP}/1/11/Cianorte.png`,
  },
  {
    nome: "Comercial de Lins", estado: "SP", regiao: "Sudeste", fundacao: 1944,
    cores: ["Vermelho", "Branco"],
    escudo: escComercialLins,
  },
  {
    nome: "Comercial-MS", estado: "MS", regiao: "Centro-Oeste", fundacao: 1944,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/d/db/EC_Comercial_ms.png`,
  },
  {
    nome: "Comercial-SP", estado: "SP", regiao: "Sudeste", fundacao: 1946,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/a/ad/Comercial_Futebol_Clube.svg`,
  },
  {
    nome: "Concórdia", estado: "SC", regiao: "Sul", fundacao: 1976,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/1/16/Conc%C3%B3rdia_Atl%C3%A9tico_Clube.png`,
  },
  {
    nome: "Confiança", estado: "SE", regiao: "Nordeste", fundacao: 1936,
    cores: ["Azul", "Branco"],
    escudo: escConfianca,
  },
  {
    nome: "Corinthians", estado: "SP", regiao: "Sudeste", fundacao: 1910,
    cores: ["Preto", "Branco"],
    escudo: `${WKP}/b/b4/Corinthians_simbolo.png`,
  },
  {
    nome: "Coritiba", estado: "PR", regiao: "Sul", fundacao: 1909,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/b/bd/Coritiba_Foot_Ball_Club_logo.svg`,
  },
  {
    nome: "Corumbaense", estado: "MS", regiao: "Centro-Oeste", fundacao: 1915,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/6/6d/Escudo_do_Corumbaense_FC.png`,
  },
  {
    nome: "Costa Rica", estado: "MS", regiao: "Centro-Oeste", fundacao: 1967,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/d/d4/CostaRicaEC.png`,
  },
  {
    nome: "Criciúma", estado: "SC", regiao: "Sul", fundacao: 1947,
    cores: ["Amarelo", "Preto", "Branco"],
    escudo: `${WK}/9/9b/Crici%C3%BAma_EC_2025_crest.svg`,
  },
  {
    nome: "Cruzeiro", estado: "MG", regiao: "Sudeste", fundacao: 1921,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg`,
  },
  {
    nome: "Cruzeiro-RS", estado: "RS", regiao: "Sul", fundacao: 1913,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/8/8f/Esporte_Clube_Cruzeiro_%28Porto_Alegre%29_logo.png`,
  },
  {
    nome: "Cuiabá", estado: "MT", regiao: "Centro-Oeste", fundacao: 2001,
    cores: ["Dourado", "Verde", "Branco"],
    escudo: `${WK}/9/96/Cuiab%C3%A1_Esporte_Clube.svg`,
  },
  {
    nome: "Democrata-GV", estado: "MG", regiao: "Sudeste", fundacao: 1933,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/e/e2/Esporte_Clube_Democrata_logo.svg`,
  },
  {
    nome: "Desportiva Ferroviária", estado: "ES", regiao: "Sudeste", fundacao: 1963,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/e/e4/EscudoDesportivaFerrovi%C3%A1ria.png`,
  },
  {
    nome: "Dourados", estado: "MS", regiao: "Centro-Oeste", fundacao: 1973,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/d/d3/DouradosAC.png`,
  },
  {
    nome: "Duque de Caxias", estado: "RJ", regiao: "Sudeste", fundacao: 2005,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/e/e3/Duque_de_Caxias_Futebol_Clube.png`,
  },
  {
    nome: "Esportivo", estado: "RS", regiao: "Sul", fundacao: 1919,
    cores: ["Azul", "Branco"],
    escudo: escEsportivo,
  },
  {
    nome: "Estrela do Norte", estado: "ES", regiao: "Sudeste", fundacao: 1942,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/0/03/Escudo_Estrela_do_Norte_FC_2021.png`,
  },
  {
    nome: "FC Cascavel", estado: "PR", regiao: "Sul", fundacao: 2008,
    cores: ["Azul", "Verde", "Branco"],
    escudo: `${WKP}/2/29/FC_Cascavel.png`,
  },
  {
    nome: "Farroupilha", estado: "RS", regiao: "Sul", fundacao: 1926,
    cores: ["Verde", "Vermelho", "Branco"],
    escudo: `${WKP}/f/f4/Escudo_do_Farroupilha_de_Pelotas.png`,
  },
  {
    nome: "Fast Clube", estado: "AM", regiao: "Norte", fundacao: 1930,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/3/32/Fast_Clube.png`,
  },
  {
    nome: "Ferroviário-CE", estado: "CE", regiao: "Nordeste", fundacao: 1933,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/2/20/Escudo_do_Ferrovi%C3%A1rio_Atl%C3%A9tico_Clube.png`,
  },
  {
    nome: "Figueirense", estado: "SC", regiao: "Sul", fundacao: 1921,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/0/05/Figueirense_Futebol_Clube.svg`,
  },
  {
    nome: "Flamengo", estado: "RJ", regiao: "Sudeste", fundacao: 1895,
    cores: ["Vermelho", "Preto"],
    escudo: `${WK}/9/96/Clube_de_Regatas_do_Flamengo_logo.svg`,
  },
  {
    nome: "Floresta", estado: "CE", regiao: "Nordeste", fundacao: 1954,
    cores: ["Preto", "Verde", "Branco"],
    escudo: `${WKP}/8/86/Floresta_Esporte_Clube.png`,
  },
  {
    nome: "Fluminense", estado: "RJ", regiao: "Sudeste", fundacao: 1902,
    cores: ["Verde", "Grená", "Branco"],
    escudo: `${WK}/1/12/Fluminense_Football_Club.svg`,
  },
  {
    nome: "Fluminense de Feira", estado: "BA", regiao: "Nordeste", fundacao: 1941,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/b/b0/Fluminense-de-feira.png`,
  },
  {
    nome: "Fortaleza", estado: "CE", regiao: "Nordeste", fundacao: 1918,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WK}/3/3d/Fortaleza_Esporte_Clube_logo.svg`,
  },
  {
    nome: "Francana", estado: "SP", regiao: "Sudeste", fundacao: 1912,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/d/d3/Associacao-atletica-francana.png`,
  },
  {
    nome: "Friburguense", estado: "RJ", regiao: "Sudeste", fundacao: 1944,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/0/00/Friburguense.png`,
  },
  {
    nome: "Galícia", estado: "BA", regiao: "Nordeste", fundacao: 1933,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/a/a3/Gal%C3%ADciaEC.png`,
  },
  {
    nome: "Galvez", estado: "AC", regiao: "Norte", fundacao: 1963,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/f/fc/Galvez_ac.png`,
  },
  {
    nome: "Gama", estado: "DF", regiao: "Centro-Oeste", fundacao: 1975,
    cores: ["Verde", "Vermelho", "Branco"],
    escudo: `${WK}/7/7d/Sociedade_Esportiva_do_Gama_logo_%281_gold_star%29.svg`,
  },
  {
    nome: "GAS", estado: "RR", regiao: "Norte", fundacao: 1946,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/6/60/GASampaio_%281%29.png`,
  },
  {
    nome: "Gaúcho", estado: "RS", regiao: "Sul", fundacao: 1935,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/1/14/SCGaucho.png`,
  },
  {
    nome: "Globo", estado: "RN", regiao: "Nordeste", fundacao: 2012,
    cores: ["Verde", "Branco", "Vermelho"],
    escudo: `${WKP}/0/08/GloboFC2020.png`,
  },
  {
    nome: "Glória", estado: "RS", regiao: "Sul", fundacao: 1936,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/6/60/Gloria-logo.png`,
  },
  {
    nome: "Goianésia", estado: "GO", regiao: "Centro-Oeste", fundacao: 1996,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/2/23/Escudo_Goian%C3%A9sia_EC.png`,
  },
  {
    nome: "Goiânia", estado: "GO", regiao: "Centro-Oeste", fundacao: 1938,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/c/cc/Goiania_EC.svg`,
  },
  {
    nome: "Goiás", estado: "GO", regiao: "Centro-Oeste", fundacao: 1943,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/4/4a/Goi%C3%A1s_Esporte_Clube_logo.svg`,
  },
  {
    nome: "Goytacaz", estado: "RJ", regiao: "Sudeste", fundacao: 1912,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/9/92/Goytacaz_Futebol_Clube.png`,
  },
  {
    nome: "Guarani", estado: "SP", regiao: "Sudeste", fundacao: 1911,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/0/04/Guarani_Futebol_Clube_logo.svg`,
  },
  {
    nome: "Guarani de Divinópolis", estado: "MG", regiao: "Sudeste", fundacao: 1946,
    cores: ["Verde", "Branco"],
    escudo: escGuaraniDivi,
  },
  {
    nome: "Guarani de Juazeiro", estado: "CE", regiao: "Nordeste", fundacao: 1938,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/e/ee/Escudo_do_Guarani_de_Juazeiro.png`,
  },
  {
    nome: "Guarani de Palhoça", estado: "SC", regiao: "Sul", fundacao: 1973,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/a/aa/GuaraniPalhoca.png`,
  },
  {
    nome: "Guarany de Bagé", estado: "RS", regiao: "Sul", fundacao: 1907,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/5/57/Guarany_Futebol_Clube.svg`,
  },
  {
    nome: "Grêmio", estado: "RS", regiao: "Sul", fundacao: 1903,
    cores: ["Azul", "Preto", "Branco"],
    escudo: `${WK}/0/08/Gremio_logo.svg`,
  },
  {
    nome: "Grêmio Anápolis", estado: "GO", regiao: "Centro-Oeste", fundacao: 1945,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/5/50/Gr%C3%AAmio_An%C3%A1polis.png`,
  },
  {
    nome: "Grêmio Bagé", estado: "RS", regiao: "Sul", fundacao: 1913,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/6/6e/GE_Bage.svg`,
  },
  {
    nome: "Grêmio Maringá", estado: "PR", regiao: "Sul", fundacao: 1963,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/4/40/GEM_Maring%C3%A1_1964.png`,
  },
  {
    nome: "Gurupi", estado: "TO", regiao: "Norte", fundacao: 1976,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/d/d5/Gurupi_Esporte_Clube.png`,
  },
  {
    nome: "Hercílio Luz", estado: "SC", regiao: "Sul", fundacao: 1918,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/5/5d/Herc%C3%ADlio_Luz-SC.png`,
  },
  {
    nome: "Hermann Aichinger", estado: "SC", regiao: "Sul", fundacao: 1931,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/9/92/CA_Hermann_Aichinger_-_02_-_%28Ibirama_-_SC%29.svg`,
  },
  {
    nome: "Horizonte", estado: "CE", regiao: "Nordeste", fundacao: 2002,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/a/a8/Horizonte_Futebol_Clube.png`,
  },
  {
    nome: "Humaitá", estado: "AC", regiao: "Norte", fundacao: 1990,
    cores: ["Verde", "Vermelho", "Branco"],
    escudo: escHumaita,
  },
  {
    nome: "Icasa", estado: "CE", regiao: "Nordeste", fundacao: 1963,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/8/87/Escudo_da_Associa%C3%A7%C3%A3o_Desportiva_Recreativa_Cultural_Icasa.svg`,
  },
  {
    nome: "Igrejinha", estado: "RS", regiao: "Sul", fundacao: 1960,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/0/07/ECIgrejinha.png`,
  },
  {
    nome: "Iguaçu", estado: "PR", regiao: "Sul", fundacao: 1965,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/3/31/AA_Igua%C3%A7u_logo.png`,
  },
  {
    nome: "Imperatriz", estado: "MA", regiao: "Nordeste", fundacao: 1963,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/f/fc/SImperatrizD.png`,
  },
  {
    nome: "Inter de Lages", estado: "SC", regiao: "Sul", fundacao: 1976,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/d/d7/Inter-de-lages-escudo.png`,
  },
  {
    nome: "Inter de Limeira", estado: "SP", regiao: "Sudeste", fundacao: 1913,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/b/b4/Inter_de_Limeira.svg`,
  },
  {
    nome: "Inter de Santa Maria", estado: "RS", regiao: "Sul", fundacao: 1929,
    cores: ["Vermelho", "Branco"],
    escudo: escInterSantaMaria,
  },
  {
    nome: "Internacional", estado: "RS", regiao: "Sul", fundacao: 1909,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/c/c5/Sport_Club_Internacional_logo.svg`,
  },
  {
    nome: "Interporto", estado: "TO", regiao: "Norte", fundacao: 2015,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/0/0d/InterportoFC.png`,
  },
  {
    nome: "Ipatinga", estado: "MG", regiao: "Sudeste", fundacao: 1998,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/9/95/IpatingaFC.png`,
  },
  {
    nome: "Iporá", estado: "GO", regiao: "Centro-Oeste", fundacao: 1990,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/b/b6/IporaEC.png`,
  },
  {
    nome: "Itabaiana", estado: "SE", regiao: "Nordeste", fundacao: 1938,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/b/b8/Associa%C3%A7%C3%A3o_Ol%C3%ADmpica_de_Itabaiana_logo.png`,
  },
  {
    nome: "Itabuna", estado: "BA", regiao: "Nordeste", fundacao: 1976,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/6/6d/ItabunaECBA.png`,
  },
  {
    nome: "Ituano", estado: "SP", regiao: "Sudeste", fundacao: 1947,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/5/5d/Ituano_Futebol_Clube_logo.svg`,
  },
  {
    nome: "Itumbiara", estado: "GO", regiao: "Centro-Oeste", fundacao: 1970,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/e/e7/ItumbiaraEC.png`,
  },
  {
    nome: "Ivinhema", estado: "MS", regiao: "Centro-Oeste", fundacao: 1990,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/c/cb/IvinhemaFC.png`,
  },
  {
    nome: "J. Malucelli", estado: "PR", regiao: "Sul", fundacao: 1994,
    cores: ["Branco", "Preto", "Amarelo"],
    escudo: escJMalucelli,
  },
  {
    nome: "Jabaquara", estado: "SP", regiao: "Sudeste", fundacao: 1914,
    cores: ["Azul", "Branco", "Preto"],
    escudo: `${WK}/c/cb/Jabaquara_Atl%C3%A9tico_Clube.svg`,
  },
  {
    nome: "Jacobina", estado: "BA", regiao: "Nordeste", fundacao: 1966,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/5/59/JacobinaEC.gif`,
  },
  {
    nome: "Jacuipense", estado: "BA", regiao: "Nordeste", fundacao: 1967,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/3/3d/ECJacuipense.png`,
  },
  {
    nome: "Jaguaré", estado: "ES", regiao: "Sudeste", fundacao: 2017,
    cores: ["Verde", "Branco"],
    escudo: escJaguare,
  },
  {
    nome: "Jaraguá", estado: "GO", regiao: "Centro-Oeste", fundacao: 2006,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/7/7c/Jaragu%C3%A1_EC_1-01.png`,
  },
  {
    nome: "Ji-Paraná", estado: "RO", regiao: "Norte", fundacao: 1992,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/5/54/Ji-Paran%C3%A1FutebolClube.png`,
  },
  {
    nome: "Joinville", estado: "SC", regiao: "Sul", fundacao: 1976,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/3/31/Joinville-SC.png`,
  },
  {
    nome: "Juazeirense", estado: "BA", regiao: "Nordeste", fundacao: 1973,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/6/61/Sociedade_Desportiva_Juazeirense_2026.png`,
  },
  {
    nome: "Juventude", estado: "RS", regiao: "Sul", fundacao: 1913,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/2/2d/Esporte_Clube_Juventude_logo.svg`,
  },
  {
    nome: "Juventus-SP", estado: "SP", regiao: "Sudeste", fundacao: 1924,
    cores: ["Grená", "Branco"],
    escudo: `${WK}/e/e5/Juventus_da_Mooca.svg`,
  },
  {
    nome: "Lagarto", estado: "SE", regiao: "Nordeste", fundacao: 2003,
    cores: ["Verde", "Branco", "Vermelho"],
    escudo: `${WKP}/e/e5/LagartoFC.png`,
  },
  {
    nome: "Lajeadense", estado: "RS", regiao: "Sul", fundacao: 1912,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/6/6e/CE_Lejaedense_%28RS%29.svg`,
  },
  {
    nome: "Legião", estado: "DF", regiao: "Centro-Oeste", fundacao: 2009,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/2/26/Legi%C3%A3o_DF.png`,
  },
  {
    nome: "Lemense", estado: "SP", regiao: "Sudeste", fundacao: 1915,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/1/12/Ec_lemense_sp.gif`,
  },
  {
    nome: "Linense", estado: "SP", regiao: "Sudeste", fundacao: 1932,
    cores: ["Verde", "Branco"],
    escudo: escLinense,
  },
  {
    nome: "Londrina", estado: "PR", regiao: "Sul", fundacao: 1956,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/9/96/Londrina_EC.png`,
  },
  {
    nome: "Luverdense", estado: "MT", regiao: "Centro-Oeste", fundacao: 2004,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/5/59/Luverdense_%283_stars%29.png`,
  },
  {
    nome: "Luziânia", estado: "GO", regiao: "Centro-Oeste", fundacao: 1998,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/2/23/AALuziania2020.png`,
  },
  {
    nome: "Macaé", estado: "RJ", regiao: "Sudeste", fundacao: 1990,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/0/04/Maca%C3%A9_Esporte_FC.png`,
  },
  {
    nome: "Madureira", estado: "RJ", regiao: "Sudeste", fundacao: 1914,
    cores: ["Verde", "Branco", "Vermelho"],
    escudo: `${WK}/e/ed/Madureira_EC_%28RJ%29.svg`,
  },
  {
    nome: "Manaus", estado: "AM", regiao: "Norte", fundacao: 2013,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WKP}/a/a3/Escudo_do_Manaus_Futebol_Clube.png`,
  },
  {
    nome: "Maranhão", estado: "MA", regiao: "Nordeste", fundacao: 1933,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/6/6d/Maranh%C3%A3o_Atl%C3%A9tico_Clube.png`,
  },
  {
    nome: "Maringá FC", estado: "PR", regiao: "Sul", fundacao: 2010,
    cores: ["Preto", "Branco"],
    escudo: escMaringaFc,
  },
  {
    nome: "Marcílio Dias", estado: "SC", regiao: "Sul", fundacao: 1919,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/3/3f/Clube_N%C3%A1utico_Marc%C3%ADlio_Dias.png`,
  },
  {
    nome: "Marília", estado: "SP", regiao: "Sudeste", fundacao: 1942,
    cores: ["Branco", "Azul", "Vermelho"],
    escudo: `${WK}/c/cf/Mar%C3%ADlia_Atl%C3%A9tico_Clube.svg`,
  },
  {
    nome: "Mesquita", estado: "RJ", regiao: "Sudeste", fundacao: 1949,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/f/fc/MesquitaFC2021.png`,
  },
  {
    nome: "Metropolitano", estado: "SC", regiao: "Sul", fundacao: 2002,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/3/3e/CA_Metropolitano_Escudo.png`,
  },
  {
    nome: "Mirassol", estado: "SP", regiao: "Sudeste", fundacao: 1925,
    cores: ["Amarelo", "Verde"],
    escudo: `${WK}/f/fd/Mirassol_Futebol_Clube_logo_%283_stars%29.png`,
  },
  {
    nome: "Misto", estado: "MS", regiao: "Centro-Oeste", fundacao: 1932,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/9/9f/MistoEC.png`,
  },
  {
    nome: "Mixto", estado: "MT", regiao: "Centro-Oeste", fundacao: 1934,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/9/94/Mixto_EC.svg`,
  },
  {
    nome: "Mogi Mirim", estado: "SP", regiao: "Sudeste", fundacao: 1933,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/6/60/Mogi_Mirim_EC.svg`,
  },
  {
    nome: "Monte Azul", estado: "SP", regiao: "Sudeste", fundacao: 1947,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: escMonteAzul,
  },
  {
    nome: "Morrinhos", estado: "GO", regiao: "Centro-Oeste", fundacao: 1948,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/d/da/Morrinhos_FC.svg`,
  },
  {
    nome: "Moto Club", estado: "MA", regiao: "Nordeste", fundacao: 1937,
    cores: ["Preto", "Vermelho", "Branco"],
    escudo: `${WKP}/6/64/Moto_Club_logo.png`,
  },
  {
    nome: "Nação", estado: "PR", regiao: "Sul", fundacao: 1995,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: escNacao,
  },
  {
    nome: "Nacional-AM", estado: "AM", regiao: "Norte", fundacao: 1913,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/a/af/Nacional_FC_Amazonas_2021.png`,
  },
  {
    nome: "Nacional de Muriaé", estado: "MG", regiao: "Sudeste", fundacao: 1913,
    cores: ["Vermelho", "Branco"],
    escudo: escNacionalMuriae,
  },
  {
    nome: "Nacional-SP", estado: "SP", regiao: "Sudeste", fundacao: 1919,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/8/82/Nacional_AC_-_SP_-_06.svg`,
  },
  {
    nome: "Náutico", estado: "PE", regiao: "Nordeste", fundacao: 1901,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/d/de/Simbolo-escudo-nautico.png`,
  },
  {
    nome: "Náutico-MS", estado: "MS", regiao: "Centro-Oeste", fundacao: 1913,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/4/42/N%C3%A1utico-MS_%28BRA%29.png`,
  },
  {
    nome: "Noroeste", estado: "SP", regiao: "Sudeste", fundacao: 1910,
    cores: ["Vermelho", "Branco"],
    escudo: escNoroeste,
  },
  {
    nome: "Nova Iguaçu", estado: "RJ", regiao: "Sudeste", fundacao: 2004,
    cores: ["Laranja", "Azul"],
    escudo: `${WKP}/7/7a/NovaIguacuFC.png`,
  },
  {
    nome: "Nova Mutum", estado: "MT", regiao: "Centro-Oeste", fundacao: 2017,
    cores: ["Azul", "Branco", "Amarelo"],
    escudo: `${WKP}/8/81/NovaMutumEC.png`,
  },
  {
    nome: "Nova Venécia", estado: "ES", regiao: "Sudeste", fundacao: 2005,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/9/9a/Escudo_do_Novo_Ven%C3%A9cia.png`,
  },
  {
    nome: "Novo Hamburgo", estado: "RS", regiao: "Sul", fundacao: 1911,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/b/b9/Esporte_Clube_Novo_Hamburgo.svg`,
  },
  {
    nome: "Novorizontino", estado: "SP", regiao: "Sudeste", fundacao: 2010,
    cores: ["Preto", "Branco", "Vermelho"],
    escudo: `${WK}/1/1b/Gr%C3%AAmio_Novorizontino.svg`,
  },
  {
    nome: "Olaria", estado: "RJ", regiao: "Sudeste", fundacao: 1915,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WKP}/d/d4/Olaria_Atl%C3%A9tico_Clube.svg`,
  },
  {
    nome: "Operário-MS", estado: "MS", regiao: "Centro-Oeste", fundacao: 1938,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/3/30/Operario_FC_MS.svg`,
  },
  {
    nome: "Operário-MT", estado: "MT", regiao: "Centro-Oeste", fundacao: 1949,
    cores: ["Verde", "Vermelho", "Branco"],
    escudo: escOperarioMT,
  },
  {
    nome: "Operário-PR", estado: "PR", regiao: "Sul", fundacao: 1912,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/f/f0/Oper%C3%A1rio_Ferrovi%C3%A1rio_Esporte_Clube_logo.svg`,
  },
  {
    nome: "Osasco Audax", estado: "SP", regiao: "Sudeste", fundacao: 2010,
    cores: ["Verde", "Branco", "Preto"],
    escudo: `${WK}/1/1d/Gr%C3%AAmio_Osasco_Audax_%2801%29_-_SP.png`,
  },
  {
    nome: "Osasco Sporting (Oeste)", estado: "SP", regiao: "Sudeste", fundacao: 1921,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: escOeste,
    apelidos: ["Oeste", "Osasco", "Osasco Sporting"],
  },
  {
    nome: "Palmas", estado: "TO", regiao: "Norte", fundacao: 1997,
    cores: ["Vermelho", "Azul", "Branco"],
    escudo: `${WKP}/8/83/PalmasFutebolRegatas.png`,
  },
  {
    nome: "Palmeiras", estado: "SP", regiao: "Sudeste", fundacao: 1914,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/6/68/Sociedade_Esportiva_Palmeiras_logo_%281_red_star%29.svg`,
  },
  {
    nome: "Paraná", estado: "PR", regiao: "Sul", fundacao: 1989,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/9/9f/Paran%C3%A1_Clube_logo.png`,
  },
  {
    nome: "Paranavaí", estado: "PR", regiao: "Sul", fundacao: 1948,
    cores: ["Vermelho", "Branco"],
    escudo: escParanavai,
  },
  {
    nome: "Passo Fundo", estado: "RS", regiao: "Sul", fundacao: 1944,
    cores: ["Vermelho", "Branco", "Verde"],
    escudo: `${WK}/8/8a/Esporte_Clube_Passo_Fundo_logo.svg`,
  },
  {
    nome: "Paulista", estado: "SP", regiao: "Sudeste", fundacao: 1909,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/5/50/Paulista_Futebol_Clube.svg`,
  },
  {
    nome: "Paysandu", estado: "PA", regiao: "Norte", fundacao: 1914,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/2/2f/PaysanduSC.png`,
  },
  {
    nome: "Pelotas", estado: "RS", regiao: "Sul", fundacao: 1908,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/a/aa/Esporte_Clube_Pelotas.svg`,
  },
  {
    nome: "Plácido de Castro", estado: "AC", regiao: "Norte", fundacao: 1972,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/a/a1/Escudo_Pl%C3%A1cido_de_Castro.png`,
  },
  {
    nome: "Ponte Preta", estado: "SP", regiao: "Sudeste", fundacao: 1900,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/0/07/Logo_AA_Ponte_Preta.svg`,
  },
  {
    nome: "Porto Velho", estado: "RO", regiao: "Norte", fundacao: 1952,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/6/67/PortoVelhoEC.png`,
  },
  {
    nome: "Porto Vitória", estado: "ES", regiao: "Sudeste", fundacao: 2011,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/f/fa/Escudo_Porto_Vit%C3%B3ria.png`,
  },
  {
    nome: "Porto-PE", estado: "PE", regiao: "Nordeste", fundacao: 1915,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/f/fd/Clube_Atl%C3%A9tico_do_Porto.png`,
  },
  {
    nome: "Portuguesa", estado: "SP", regiao: "Sudeste", fundacao: 1920,
    cores: ["Vermelho", "Verde", "Branco"],
    escudo: `${WK}/6/61/Associa%C3%A7%C3%A3o_Portuguesa_de_Desportos.svg`,
  },
  {
    nome: "Portuguesa Santista", estado: "SP", regiao: "Sudeste", fundacao: 1917,
    cores: ["Vermelho", "Verde", "Branco"],
    escudo: `${WK}/5/56/Escudo_da_Portuguesa_Santista.png`,
  },
  {
    nome: "Portuguesa-RJ", estado: "RJ", regiao: "Sudeste", fundacao: 1924,
    cores: ["Vermelho", "Verde", "Branco"],
    escudo: `${WK}/4/4e/Associa%C3%A7%C3%A3o_Atl%C3%A9tica_Portuguesa-RJ.png`,
  },
  {
    nome: "Potiguar de Mossoró", estado: "RN", regiao: "Nordeste", fundacao: 1945,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/1/1c/ACDPotiguar.png`,
  },
  {
    nome: "Pouso Alegre", estado: "MG", regiao: "Sudeste", fundacao: 1913,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/9/99/Pouso_Alegre_Futebol_Clube.png`,
  },
  {
    nome: "Primavera", estado: "SP", regiao: "Sudeste", fundacao: 1947,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: escPrimavera,
  },
  {
    nome: "Princesa do Solimões", estado: "AM", regiao: "Norte", fundacao: 1992,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/1/1d/Princesa_do_Solim%C3%B5es-AM.png`,
  },
  {
    nome: "Próspera", estado: "SC", regiao: "Sul", fundacao: 1947,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/9/9f/ECPr%C3%B3spera.png`,
  },
  {
    nome: "Real Ariquemes", estado: "RO", regiao: "Norte", fundacao: 2018,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WK}/6/6b/Logo_Real_Ariquemes_2022.png`,
  },
  {
    nome: "Real Brasília", estado: "DF", regiao: "Centro-Oeste", fundacao: 2008,
    cores: ["Azul", "Branco", "Amarelo"],
    escudo: `${WK}/8/8f/RealBras%C3%ADliaFC.svg`,
  },
  {
    nome: "Real Noroeste", estado: "ES", regiao: "Sudeste", fundacao: 2006,
    cores: ["Azul", "Branco", "Amarelo"],
    escudo: `${WKP}/c/c8/RealNoroesteCFC.png`,
  },
  {
    nome: "Red Bull Bragantino", estado: "SP", regiao: "Sudeste", fundacao: 1928,
    cores: ["Branco", "Vermelho"],
    escudo: `${WKP}/9/9e/RedBullBragantino.png`,
  },
  {
    nome: "Remo", estado: "PA", regiao: "Norte", fundacao: 1905,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/7/70/Clube_do_Remo.svg`,
  },
  {
    nome: "Resende", estado: "RJ", regiao: "Sudeste", fundacao: 1909,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/1/1d/Resende_FC_logo.png`,
  },
  {
    nome: "Retrô", estado: "PE", regiao: "Nordeste", fundacao: 2016,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/4/4b/Retr%C3%B4_FC_Brasil-PE_%28BRA%29.png`,
  },
  {
    nome: "Rio Branco-AC", estado: "AC", regiao: "Norte", fundacao: 1919,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/5/55/Escudorbfc.png`,
  },
  {
    nome: "Rio Branco-ES", estado: "ES", regiao: "Sudeste", fundacao: 1913,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/e/e0/Rio_Branco_Esporte_Clube_logo.svg`,
  },
  {
    nome: "Rio Branco-SP", estado: "SP", regiao: "Sudeste", fundacao: 1913,
    cores: ["Vermelho", "Branco"],
    escudo: escRioBrancoSP,
  },
  {
    nome: "Rio Branco-PR", estado: "PR", regiao: "Sul", fundacao: 1913,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/a/a0/EscudoRioBrancoSC.png`,
  },
  {
    nome: "Rio Preto", estado: "SP", regiao: "Sudeste", fundacao: 1919,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/4/4f/Rio_Preto_EC.png`,
  },
  {
    nome: "River-PI", estado: "PI", regiao: "Nordeste", fundacao: 1946,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/f/f4/R_PIAUI.png`,
  },
  {
    nome: "Salgueiro", estado: "PE", regiao: "Nordeste", fundacao: 1973,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/b/ba/SalgueiroAC2020.png`,
  },
  {
    nome: "Sampaio Corrêa", estado: "MA", regiao: "Nordeste", fundacao: 1923,
    cores: ["Vermelho", "Verde", "Branco"],
    escudo: `${WK}/8/86/Sampaio_Corr%C3%AAa_FC.png`,
  },
  {
    nome: "Sampaio Corrêa-RJ", estado: "RJ", regiao: "Sudeste", fundacao: 1934,
    cores: ["Verde", "Vermelho", "Branco"],
    escudo: `${WKP}/4/4e/Sampaio_Corr%C3%AAa-RJ_logo.png`,
  },
  {
    nome: "Santa Cruz", estado: "PE", regiao: "Nordeste", fundacao: 1914,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/6/69/Santa_Cruz_Futebol_Clube_logo.svg`,
  },
  {
    nome: "Santo André", estado: "SP", regiao: "Sudeste", fundacao: 1967,
    cores: ["Verde", "Branco", "Amarelo"],
    escudo: `${WKP}/5/50/Santo_Andre_escudo.png`,
  },
  {
    nome: "Santos", estado: "SP", regiao: "Sudeste", fundacao: 1912,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/0/0e/Santos_Futebol_Clube_logo_%28with_stars_and_crown%29.png`,
  },
  {
    nome: "São Bento", estado: "SP", regiao: "Sudeste", fundacao: 1914,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/b/bb/S%C3%A3o_Bento.svg`,
  },
  {
    nome: "São Bernardo", estado: "SP", regiao: "Sudeste", fundacao: 2004,
    cores: ["Amarelo", "Preto"],
    escudo: `${WK}/8/88/S%C3%A3o_Bernardo_FC_2020_crest.png`,
  },
  {
    nome: "São Caetano", estado: "SP", regiao: "Sudeste", fundacao: 1989,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WKP}/a/a8/Associa%C3%A7%C3%A3o_Desportiva_S%C3%A3o_Caetano.png`,
  },
  {
    nome: "São Cristóvão", estado: "RJ", regiao: "Sudeste", fundacao: 1898,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: escSaoCristovao,
  },
  {
    nome: "São João da Barra", estado: "RJ", regiao: "Sudeste", fundacao: 1991,
    cores: ["Verde", "Branco"],
    escudo: escSaoJoaoDaBarra,
  },
  {
    nome: "São José-RS", estado: "RS", regiao: "Sul", fundacao: 1913,
    cores: ["Vermelho", "Preto"],
    escudo: `${WK}/1/1f/Esporte_Clube_S%C3%A3o_Jos%C3%A9_logo.png`,
  },
  {
    nome: "São José-SP", estado: "SP", regiao: "Sudeste", fundacao: 1970,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/8/85/S%C3%A3o_Jos%C3%A9_Esporte_Clube.svg`,
  },
  {
    nome: "São Luiz", estado: "RS", regiao: "Sul", fundacao: 1938,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/0/0b/S%C3%83O-LUIZ.png`,
  },
  {
    nome: "São Paulo", estado: "SP", regiao: "Sudeste", fundacao: 1930,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/f/f4/S%C3%A3o_Paulo_Futebol_Clube_logo_%282022%29.svg`,
  },
  {
    nome: "São Paulo-RS", estado: "RS", regiao: "Sul", fundacao: 1908,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/8/8a/Sport_Club_S%C3%A3o_Paulo.svg`,
  },
  {
    nome: "São Raimundo-AM", estado: "AM", regiao: "Norte", fundacao: 1918,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/7/7d/S%C3%A3o_Raimundo-AM_2017.png`,
  },
  {
    nome: "São Raimundo-PA", estado: "PA", regiao: "Norte", fundacao: 1917,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/2/29/SaoRaimundoPA.png`,
  },
  {
    nome: "São Raimundo-RR", estado: "RR", regiao: "Norte", fundacao: 2003,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/1/1b/Escudo_do_S%C3%A3o_Raimundo-RR.png`,
  },
  {
    nome: "Sergipe", estado: "SE", regiao: "Nordeste", fundacao: 1909,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/2/20/CSSergipe.png`,
  },
  {
    nome: "Serra", estado: "ES", regiao: "Sudeste", fundacao: 1976,
    cores: ["Azul", "Branco"],
    escudo: `${WK}/1/18/Escudo_do_Serra_-_2017_PNG.png`,
  },
  {
    nome: "Serrano-RJ", estado: "RJ", regiao: "Sudeste", fundacao: 1915,
    cores: ["Verde", "Branco"],
    escudo: escSerranoRJ,
  },
  {
    nome: "Sertãozinho", estado: "SP", regiao: "Sudeste", fundacao: 1976,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/a/a0/Sert%C3%A3ozinho_Futebol_Clube.svg`,
  },
  {
    nome: "Sinop", estado: "MT", regiao: "Centro-Oeste", fundacao: 1976,
    cores: ["Verde", "Branco", "Amarelo"],
    escudo: `${WKP}/0/05/SinopFCMT.png`,
  },
  {
    nome: "Sport Recife", estado: "PE", regiao: "Nordeste", fundacao: 1905,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WKP}/1/1a/Sport-clube-recife.svg`,
  },
  {
    nome: "Taguatinga", estado: "DF", regiao: "Centro-Oeste", fundacao: 1976,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/0/09/Taguatinga_EC.png`,
  },
  {
    nome: "Taubaté", estado: "SP", regiao: "Sudeste", fundacao: 1914,
    cores: ["Branco", "Azul"],
    escudo: `${WK}/1/1c/Escudo_do_Esporte_Clube_Taubat%C3%A9.svg`,
  },
  {
    nome: "Tigres do Brasil", estado: "RJ", regiao: "Sudeste", fundacao: 2003,
    cores: ["Laranja", "Preto"],
    escudo: `${WKP}/7/78/Tigres2016.png`,
  },
  {
    nome: "Tocantinópolis", estado: "TO", regiao: "Norte", fundacao: 1973,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/d/d6/Tocantinopolis_EC.svg`,
  },
  {
    nome: "Toledo", estado: "PR", regiao: "Sul", fundacao: 2016,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/d/de/ToledoEC2026.png`,
  },
  {
    nome: "Tombense", estado: "MG", regiao: "Sudeste", fundacao: 1914,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/8/85/TombenseFC.png`,
  },
  {
    nome: "Trem", estado: "AP", regiao: "Norte", fundacao: 1947,
    cores: ["Verde", "Branco", "Vermelho"],
    escudo: `${WK}/d/d8/Trem_Desportivo_Clube_%282022%29.png`,
  },
  {
    nome: "Treze", estado: "PB", regiao: "Nordeste", fundacao: 1925,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/0/04/Treze_Futebol_Clube_logo.svg`,
  },
  {
    nome: "Trindade", estado: "GO", regiao: "Centro-Oeste", fundacao: 2008,
    cores: ["Verde", "Branco"],
    escudo: `${WKP}/0/05/TrindadeAtl%C3%A9ticoClube.png`,
  },
  {
    nome: "Tubarão", estado: "SC", regiao: "Sul", fundacao: 2004,
    cores: ["Azul", "Vermelho", "Branco"],
    escudo: `${WKP}/b/bb/Atl%C3%A9tico_Tubar%C3%A3o-SC.png`,
  },
  {
    nome: "Tuna Luso", estado: "PA", regiao: "Norte", fundacao: 1903,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WK}/0/01/Tuna_Luso_1903.svg`,
  },
  {
    nome: "Tupi", estado: "MG", regiao: "Sudeste", fundacao: 1912,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/3/3e/Tupi_Football_Club.png`,
  },
  {
    nome: "Uberaba", estado: "MG", regiao: "Sudeste", fundacao: 1917,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/a/a7/Uberaba_SC.png`,
  },
  {
    nome: "Uberlândia", estado: "MG", regiao: "Sudeste", fundacao: 1922,
    cores: ["Verde", "Branco"],
    escudo: `${WK}/d/d0/Uberl%C3%A2ndia_Esporte_Clube.svg`,
  },
  {
    nome: "União Frederiquense", estado: "RS", regiao: "Sul", fundacao: 2007,
    cores: ["Azul", "Branco"],
    escudo: `${WKP}/e/ec/Uni%C3%A3o_Frederiquense_de_Futebol.png`,
  },
  {
    nome: "União Rondonópolis", estado: "MT", regiao: "Centro-Oeste", fundacao: 1972,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/2/28/Uni%C3%A3oRondon%C3%B3polis.png`,
  },
  {
    nome: "União São João", estado: "SP", regiao: "Sudeste", fundacao: 1924,
    cores: ["Vermelho", "Verde", "Branco"],
    escudo: `${WKP}/8/83/Uni%C3%A3o_S%C3%A3o_Jo%C3%A3o.png`,
  },
  {
    nome: "URT", estado: "MG", regiao: "Sudeste", fundacao: 1939,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/d/d2/URTmg.png`,
  },
  {
    nome: "Várzea Grande", estado: "MT", regiao: "Centro-Oeste", fundacao: 2002,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: `${WKP}/2/23/V%C3%A1rzeaGrandeEC2025.png`,
  },
  {
    nome: "Vasco da Gama", estado: "RJ", regiao: "Sudeste", fundacao: 1898,
    cores: ["Preto", "Branco"],
    escudo: `${WKP}/thumb/8/8b/EscudoDoVascoDaGama.svg/250px-EscudoDoVascoDaGama.svg.png`,
  },
  {
    nome: "Velo Clube", estado: "SP", regiao: "Sudeste", fundacao: 1910,
    cores: ["Verde", "Vermelho", "Branco"],
    escudo: `${WK}/7/74/Escudo_Oficial_da_Associa%C3%A7%C3%A3o_Esportiva_Velo_Clube_Rioclarense.svg`,
  },
  {
    nome: "Veranópolis", estado: "RS", regiao: "Sul", fundacao: 1992,
    cores: ["Azul", "Branco", "Vermelho"],
    escudo: escVeranopolis,
  },
  {
    nome: "Vila Nova", estado: "GO", regiao: "Centro-Oeste", fundacao: 1943,
    cores: ["Vermelho", "Branco"],
    escudo: `${WK}/c/c3/Vila_Nova_Logo_Oficial.svg`,
  },
  {
    nome: "Vilavelhense", estado: "ES", regiao: "Sudeste", fundacao: 1917,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/d/d3/Vilavelhense_VV.png`,
  },
  {
    nome: "Vilhena", estado: "RO", regiao: "Norte", fundacao: 1973,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WKP}/a/a7/Escudo_do_Vilhena_%282023%29.png`,
  },
  {
    nome: "Villa Nova-MG", estado: "MG", regiao: "Sudeste", fundacao: 1908,
    cores: ["Vermelho", "Branco", "Preto"],
    escudo: `${WK}/9/9c/Villa_Nova_AC_%28Estr%29_-_MG.svg`,
  },
  {
    nome: "Vitória", estado: "BA", regiao: "Nordeste", fundacao: 1899,
    cores: ["Vermelho", "Preto"],
    escudo: `${WK}/1/15/Esporte_Clube_Vit%C3%B3ria_%282024%29.svg`,
  },
  {
    nome: "Vitória-ES", estado: "ES", regiao: "Sudeste", fundacao: 1947,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/e/e7/Vit%C3%B3riaFCES.png`,
  },
  {
    nome: "Volta Redonda", estado: "RJ", regiao: "Sudeste", fundacao: 1976,
    cores: ["Verde", "Branco", "Preto"],
    escudo: `${WK}/0/08/Volta_Redonda_Futebol_Clube.svg`,
  },
  {
    nome: "XV de Jaú", estado: "SP", regiao: "Sudeste", fundacao: 1924,
    cores: ["Vermelho", "Preto", "Branco"],
    escudo: `${WK}/3/33/XV_de_Ja%C3%BA.svg`,
  },
  {
    nome: "XV de Piracicaba", estado: "SP", regiao: "Sudeste", fundacao: 1913,
    cores: ["Preto", "Branco"],
    escudo: `${WK}/c/c5/Esporte_Clube_XV_de_Novembro_de_Piracicaba_logo.svg`,
  },
  {
    nome: "Ypiranga-AP", estado: "AP", regiao: "Norte", fundacao: 1963,
    cores: ["Vermelho", "Branco"],
    escudo: `${WKP}/6/62/Ypiranga_Clube_-_logo.png`,
  },
  {
    nome: "Ypiranga-RS", estado: "RS", regiao: "Sul", fundacao: 1924,
    cores: ["Verde", "Amarelo", "Vermelho"],
    escudo: escYpirangaRS,
  },
];

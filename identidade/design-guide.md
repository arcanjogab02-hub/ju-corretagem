# Identidade visual

> Como a marca aparece em tudo que o MazyOS gera.
> As skills de conteúdo, carrossel e post leem esse arquivo antes de criar qualquer visual.
> Edite quando a marca evoluir.

---

## Cores

- **Fundo principal:** Preto / grafite (#0D0D0D – #1A1A1A)

- **Cor de destaque / CTA:** Branco puro (#FFFFFF) — alto contraste sobre o preto

- **Texto principal:** Branco / off-white (#FFFFFF – #F5F5F5)

- **Fundo alternativo / cards:** Grafite claro (#1B1B1B – #242424) com bordas discretas (#262626)

- **Cor proibida:** Dourado e tons berrantes/saturados (neon, rosa-choque, azul elétrico)

> Paleta base: **preto e branco** — alto contraste, estilo SERHANT./The Agency.
> A COR vem da fotografia (imóveis, retratos), nunca da interface.
> Verde WhatsApp (#25D366) é permitido APENAS no botão de conversão.
> Quando o material for da URBS Cerrado, o degradê do logo (laranja→rosa→roxo)
> pode entrar como micro-detalhe/assinatura, mantendo a base P&B.

---

## Tipografia

- **Títulos e destaques:** Serifada elegante (estilo Playfair Display / Cormorant) para dar ar sofisticado

- **Corpo, subtítulos e botões:** Sans-serif limpa (estilo Montserrat / Inter)

- **Peso do título:** Médio a bold, com bastante respiro (espaçamento generoso)

---

## Estilo geral

Sofisticado, neutro e clean. Muito espaço em branco (ou preto), fotografia de
imóvel em destaque, pouco texto sobreposto. Sensação de alto padrão sem ser
pesado. Combina com o feed da Juliana: imagens reais de imóveis e bastidor,
estética minimalista.

---

## Elementos-chave

- Bordas: finas, discretas (ou ausentes)
- Border-radius dos cards: suave (8–16px)
- Botões: retangulares com cantos levemente arredondados, branco sobre fundo escuro (texto preto)
- Sombras: sutis, nada de drop-shadow pesado

---

## O que NUNCA fazer

- Poluir com texto demais ou muitos elementos
- Usar cores saturadas/berrantes fora da paleta
- Emoji em excesso nas artes
- Promessa exagerada como headline ("fique rico", "oportunidade única")

---

## Logo

- **Arquivo (URBS):** `identidade/logo_urbs.jpg` — logo branca sobre fundo preto sólido (JPG sem transparência). Em fundo escuro usar `mix-blend-mode:screen` (o preto some); em fundo claro usar `filter:invert(1)` + `mix-blend-mode:multiply`.
- **Retrato oficial da Juliana:** `identidade/foto_Ju.jpg` — quadrada (1:1), fundo marrom-escuro elegante, ideal pra recortes 4:5 com `object-position: top center`.
- **Logo própria da marca pessoal:** *(ainda não existe — criar futuramente)*
- **Onde usar:** slide final do carrossel (CTA), header de propostas, slides
- **Tamanho sugerido:** largura entre 120–200px nos HTMLs
- **Por enquanto:** assinar as peças com o nome **"Juliana Alves · Corretora de Imóveis · CRECI 5377"** em branco/sans-serif com letter-spacing generoso. Logo da URBS Cerrado pode entrar quando o imóvel for da imobiliária.

---

## Observações adicionais

- Estética de referência: o próprio feed @juu_alves8 (neutro, elegante) e a
  identidade da @urbscerrado.
- Quando gerar carrossel/post de imóvel: foto grande, dado-chave em destaque
  (preço, localização, dormitórios/suítes/vagas), CTA discreto (branco — nunca dourado).

---

## Padrão de carrossel (REGRA FIXA — todo carrossel obedece)

> Carrossel com tamanho/visual consistente engaja ~3x mais e faz o feed "ter cara da Ju".
> Implementação de referência (copiar como base): a `style.css` de
> `marketing/conteudo/carrossel-aluguel-vs-financiamento-2026-06-15/`.

- **Tamanho:** 1080 × 1350 px (4:5 retrato). **Todos os slides no mesmo tamanho** — recortar
  antes de subir, nunca deixar o Instagram cortar.
- **Mobile / grade do perfil:** 4:5 é o que ocupa mais tela no celular (postar nesse formato).
  Atenção: no **grid do perfil a capa é recortada em 1:1** (quadrado central) — manter o título/elemento
  principal no **centro** (zona segura), nada essencial nos ~135px de cima/baixo. Salvar os PNGs
  nomeados em ordem (`slide-01…06`) numa pasta só, pra subir na sequência certa pelo celular.
- **Nº de slides:** 6 a 10 (sweet spot). Capa + miolo + CTA.
- **Capa (slide 1):** gancho forte que vale o swipe (erro comum, número, mito×verdade, promessa
  concreta). Título serifado grande, pouco texto.
- **Rótulo / eyebrow:** etiqueta no topo-esquerdo, **sempre mesma posição/fonte/caixa**
  (mono, UPPERCASE, letter-spacing aberto, cinza). Identifica o tema do slide.
- **Numeração:** indicador discreto no topo-direito, formato fixo **"NN / NN"** (ex.: 02 / 06).
- **Paleta (tons EXATOS — nunca desviar, senão parece amador):** fundo escuro **`#0D0D0D`** OU claro
  **`#F5F5F5`**, alternando (nunca 2 iguais seguidos). Texto sobre escuro: branco **`#F5F5F5`** (apoio
  **`#cfcfcf`**); sobre claro: **`#141414`** (apoio **`#555`**). Rótulo, contador e assinatura em
  **`#8f8f8f`**. Destaque em **`#C0392B`** (1 por slide). **Nada de tom intermediário (#171717 etc.),
  dourado ou neon.** Cor "de verdade" só vem da foto.
- **Tipografia:** título serifado (Playfair/Cormorant); corpo sans (Inter); muito respiro.
- **Fonte do dado:** quando usar número, citar a fonte pequena embaixo (ex.: "IBGE · 2023").
  Só dado real (ver `marketing/dados-mercado-palmas.md`).
- **@ e assinatura:** rodapé, **sempre mesma posição** — "@juu_alves8" à esquerda,
  "Juliana Alves · CRECI 5377" à direita. Logo URBS só quando o imóvel for da imobiliária.
- **Slide final = CTA:** ação clara (link na bio / me chama no direct). Fundo claro, contraste alto.
- **Legenda (estrutura fixa):** (1) 1ª linha = gancho; (2) corpo curto, 1ª pessoa, **máx 1 emoji**;
  (3) palavras-chave naturais no texto ("apartamento em Palmas", "investir em Palmas-TO") —
  substituem hashtag como busca; (4) CTA + incentivo a compartilhar ("manda pra quem procura em
  Palmas"); (5) **3 a 6 hashtags** locais/nicho no fim — nunca 30.

## Cadência e mix (resumo — detalhe em `_memoria/estrategia.md`)

- **Ritmo sustentável:** 3 Reels + 1–2 carrosséis + (0–1 post) por semana + **stories diários**.
  Consistência > volume. Reels = alcance/descoberta; carrossel = captação/saves; stories = o
  canal nº1 de conversão (link/WhatsApp).
- **Mix:** ~30% bastidor · 25% técnico/educativo · 20% imóvel/oferta · 15% pessoal · 10% prova social.
  Pessoal forte é o ativo da Ju — mas toda peça pessoal reforça trabalho/Palmas/confiança.

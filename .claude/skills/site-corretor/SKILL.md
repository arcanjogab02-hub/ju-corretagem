---
name: site-corretor
description: >
  Cria e evolui o SITE ORGÂNICO (SEO local) de corretor de imóveis — uma landing de
  marca pessoal feita pra RANQUEAR no Google e funilar pra página de captura / WhatsApp / CRM.
  NÃO é catálogo nem Linktree: cada bloco existe pra virar lead. Três direções de design prontas
  (editorial, imersivo, conteúdo), todas P&B (Playfair+Inter), com schema, tracking de origem e
  deploy no Cloudflare Pages. Parametrizável pra qualquer corretor (produto Captação 360).
  Use quando pedirem "site do corretor", "página orgânica", "landing de SEO", "site da Ju",
  "página pra crescer no Google", ou /site-corretor.
---

# Site do corretor — landing orgânica de captação

> Filosofia: **a página não existe pra "ter site". Existe pra virar lead.** Todo elemento
> empurra pra UMA ação: cair na página de captura (`investir.html`) ou no WhatsApp — e tudo
> é medido no CRM/BI. Se um bloco não ajuda a ranquear, dar confiança ou converter, ele sai.

Referência de design escolhida pro perfil: **Carlin Wright** (Luxury Presence) — marca pessoal
P&B + autoridade de mercado. Foto-first inspirado em **Ginger Martin**.

---

## 1. Antes de começar (sempre)

Ler pra calibrar tom e visual:
- `identidade/design-guide.md` — **regra fixa**: fundo preto `#0c0c0c`, texto off-white `#f5f5f5`,
  **Playfair Display** (títulos) + **Inter** (corpo). Verde `#25D366` só no botão WhatsApp.
  **Proibido**: dourado, cores saturadas, emoji em excesso, promessa furada.
- `_memoria/empresa.md` e `_memoria/preferencias.md` — tom direto/real, bastidor + investimento,
  **equilibrar morar E investir** (nunca investimento-only), no máx. 1 emoji.

Coletar do corretor (se faltar, pedir): nome, CRECI, cidade/UF, WhatsApp, imobiliária parceira,
3–4 bairros/regiões de atuação, fotos (retrato + imóveis), endpoint do CRM, domínio.

---

## 2. Posicionamento — regra inegociável

O corretor é **parceiro da imobiliária**, não autônomo solto e nem extensão da imobiliária:
- Sempre assinar **"Corretora parceira [Imobiliária]"** (rodapé + tag perto do nome). Logo da
  imob discreto no rodapé (`mix-blend-mode:screen` sobre preto).
- A marca é do CORRETOR (nome, rosto, CRECI no topo). A imob aparece como selo de confiança,
  nunca como dona da página. Sem header/cores corporativas da imob dominando.
- No caso da Ju: imobiliária = **URBS Cerrado**, WhatsApp `5563992226998`, CRECI `5377`, Palmas-TO.

---

## 3. SEO local — checklist (o 80/20 que move o ranking)

Implementar SEMPRE, em toda página:
- **`<title>`** com keyword + cidade: `"Corretora de Imóveis em Palmas-TO | Nome · ..."`.
- **`<meta name="description">`** ~155 car. com keyword local + CTA.
- **1 só `<h1>`** com a keyword principal ("Corretora de imóveis em Palmas"). `<h2>` nas seções.
- **Keywords locais naturais no texto** (sem encher): bairros reais, "apartamento na planta",
  "imóvel pra investir", "[cidade]-[UF]". Substituem hashtag — escrever pra humano.
- **JSON-LD `RealEstateAgent`** (nome, telefone, areaServed, address, sameAs Instagram,
  memberOf imobiliária). Ganho enorme de SEO por pouco esforço — ver templates.
- **JSON-LD `FAQPage`** quando houver FAQ (mira featured snippet do Google). Só na direção "conteúdo".
- **Open Graph** (og:title/description/type) + **`<link rel="canonical">`**.
- **`alt`** descritivo com keyword em toda imagem ("Apartamento à venda em Palmas").
- **Performance**: CSS inline no `<head>`, sem libs/JS pesado, fontes via `preconnect`. Página leve = rankeia melhor + 69% acessam no celular.
- **Links internos** pro funil: todo CTA aponta pra `investir.html?origem=site` (a captura) e/ou WhatsApp.
- Orgânico leva **3–6 meses** de conteúdo local consistente. A landing é a base; o crescimento
  vem de publicar (bairros + FAQ viram páginas). Deixar isso claro pro corretor — sem isso é Linktree bonito.

---

## 4. As 3 direções (templates em `templates/`)

Todas P&B, responsivas, com funil + tracking + schema. Escolher 1 com o corretor:

| Direção | Arquivo | Quando usar |
|---|---|---|
| **Editorial** | `editorial.html` | Autoridade/elegância (estilo Carlin Wright). Hero serifado, 3 frentes (morar/investir/planta), bloco SEO de texto, prova, CTA. **Default seguro.** |
| **Imersivo** | `imersivo.html` | Foto-first cinematográfico (estilo Ginger Martin). Hero fullscreen, retrato + história, grid de imóveis. Pra quem tem fotos fortes. |
| **Conteúdo** | `conteudo.html` | **Motor de SEO**. Hero enxuto, lead-magnet, cards de bairro (futuras landings), FAQ com FAQPage schema. Pra quem vai investir em orgânico de verdade. |

Pra adaptar: trocar nome, CRECI, cidade, WhatsApp, imobiliária, bairros, fotos, `CRM_ENDPOINT`,
domínio no canonical/schema. Manter a estrutura de SEO e o funil intactos.

---

## 5. Captura + tracking (o que faz virar lead mensurável)

- Toda página inclui o `<script>` de tracking: `track(alvo,pagina)` manda `clique` por
  `navigator.sendBeacon` pro `CRM_ENDPOINT`, com `origem` (`?origem=` > utm > referrer).
- CTAs primários → `investir.html?origem=site` (a página de captura que já grava lead + abre WhatsApp).
- WhatsApp direto com mensagem pré-preenchida (`wa.me/NUM?text=...`).
- Resultado: cliques, origem e leads aparecem no painel/BI — a página "se traduz em número".

---

## 6. Render de preview (Chrome headless — validado jun/2026, Chrome 149)

`--headless=new` captura **só o viewport** (= `--window-size`), não a página inteira.
Então definir a altura da janela por página. Escala 2 = retina. PowerShell:

```powershell
$chrome="C:\Program Files\Google\Chrome\Application\chrome.exe"
$dir="<pasta dos HTMLs>"
$url=([System.Uri]::new((Join-Path $dir "arquivo.html"))).AbsoluteUri   # encoda acento/espaço
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 `
  --virtual-time-budget=9000 --run-all-compositor-stages-before-draw `
  --window-size=430,3500 --screenshot="$dir\_prev.png" "$url" | Out-Null
```

- Largura **430** = preview mobile (como a audiência vê). Altura: ~3500 (editorial/conteúdo);
  sobra de preto no fim é inofensiva (bg preto). Não usar `2>$null` em exe nativo (corrompe a saída).
- **Hero `100dvh` (imersivo)**: num print alto o hero ocupa a tela toda. Pra ver a página inteira,
  renderizar uma cópia temporária trocando `min-height:100vh;min-height:100dvh` por `height:600px`;
  e renderizar o hero real à parte em `--window-size=430,920`.
- Render é determinístico (mesmo HTML → PNG idêntico). Prefixar previews com `_` (working files).

---

## 7. Deploy (só depois do corretor validar)

1. Copiar o HTML escolhido pra `marketing/site/` (vira `index.html` ou página própria, ex. `corretora.html`).
2. Garantir que as imagens referenciadas existem em `marketing/site/` (paths relativos simples).
3. **Encoding**: se editar via PowerShell, usar `[System.IO.File]::WriteAllText` UTF8 **sem BOM**
   (o `Set-Content -Encoding UTF8` do PS 5.1 corrompe acento). Pelas tools Write/Edit já sai certo.
4. `git add` + commit + push na `main` → **Cloudflare Pages deploya sozinho** (~1 min) em `juliana-alves.pages.dev`.
5. Trocar o link da bio do Instagram quando publicar oficialmente.

---

## 8. QA final (antes de entregar)

- [ ] 1 `<h1>` só, com keyword + cidade · title/description/canonical/OG preenchidos
- [ ] JSON-LD válido (RealEstateAgent; FAQPage se tiver FAQ)
- [ ] Todo CTA leva a captura (`?origem=site`) ou WhatsApp · script de tracking presente
- [ ] "Corretora parceira [imob]" no rodapé · CRECI visível · sem cara de catálogo/autônomo solto
- [ ] P&B, Playfair+Inter, sem dourado, máx. 1 emoji, sem promessa furada
- [ ] Equilibra morar E investir (não investimento-only)
- [ ] Responsivo (testar 390–430px e desktop) · pill WhatsApp do header não corta no mobile
- [ ] Fotos com `alt` de keyword · página leve (CSS inline, sem lib)

---

## Produtizar pra outro corretor

A skill é parametrizável: rodar com os dados do novo corretor (nome/CRECI/cidade/WhatsApp/
imob/bairros/fotos/endpoint), escolher 1 das 3 direções e seguir do passo 3 ao 8. Complementa a
`/novo-corretor` (bio+captura+catálogo+CRM): esta entrega a **camada de aquisição orgânica** (SEO).

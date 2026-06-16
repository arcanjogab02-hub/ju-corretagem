---
name: trafego
description: >
  Monta a campanha de tráfego pago no Meta/Instagram (Facebook + Instagram) pro corretor de imóveis,
  focada em Click-to-WhatsApp (CTWA) e/ou página de captura — com funil de 3 temperaturas, briefs de
  criativo por persona (A: 1º imóvel / B: investidor), segmentação amplo+sinal, qualificação de lead,
  setup de medição (Pixel/CAPI/eventos) e metas de BI (CPL, custo por conversa qualificada). Pensada
  pra GANHAR em mercado saturado (Palmas), onde todos rodam o mesmo "casa à venda → zap" na tora.
  Use quando o usuário pedir "tráfego pago", "rodar anúncio", "meta ads", "anúncio no instagram",
  "impulsionar", "click to whatsapp", "campanha de imóvel", "gestor de tráfego", ou /trafego.
  Não confundir com /anuncio-google (Google Search) nem /relatorio-ads (leitura de resultado).
---

# /trafego — Tráfego pago Meta/Instagram pro corretor (CTWA + BI)

Transforma um imóvel/oferta num **plano de campanha pronto pra subir** no Gerenciador da Meta — não um
boost na tora. O entregável é um doc de campanha (estrutura + criativos + segmentação + medição + teste)
que o corretor (ou o gestor) executa, e que o `/relatorio-ads` depois lê.

> Filosofia (ver `marketing/produto-corretores/analise-mercado.md`, seção 6): **o concorrente compra
> alcance; a gente vende decisão.** Criativo persona-fit + CTWA medido + sinal/lookalike da base +
> leitura de CPL por criativo = tráfego de qualidade num mercado saturado.

## Dependências (ler antes)
- **Contexto:** `_memoria/empresa.md` · `_memoria/estrategia.md` · `marketing/produto-corretores/analise-mercado.md`
- **Tom de voz:** `_memoria/preferencias.md` (direto, leve, real, máx 1 emoji)
- **Personas (compradores):** seção "Cliente ideal & dores" da skill `/agencia` (A = 1º imóvel/sair do aluguel · B = investidor)
- **Dado real de Palmas:** `marketing/dados-mercado-palmas.md` (nunca inventar número)
- **Visual do criativo:** `identidade/design-guide.md` (P&B, destaque `#C0392B`, anti-clichê)
- **Captação/medição:** `_memoria/estrategia.md` (CRM endpoint, links `?origem=`, Pixel/GA4)
- **Output:** `marketing/campanhas/trafego-meta-<YYYY-MM-DD>/`

---

## Workflow

### Passo 1 — Briefing (perguntar só o que faltar)
1. **O que vai anunciar?** 1 imóvel específico (ideal) ou oferta/serviço. Preço, bairro, m², dormitórios/suítes, diferencial.
2. **Persona-alvo:** A (sair do aluguel / 1º imóvel / planta) ou B (investir / renda / valorização)? (muda criativo e imóvel)
3. **Objetivo:** conversa no WhatsApp (CTWA) ou lead na página de captura? (default: CTWA + Pixel)
4. **Orçamento/dia** e por quantos dias o teste roda?
5. **Tem material?** vídeo/foto do imóvel, ou render? (vídeo 9:16 > foto)
6. **Conta configurada?** Pixel instalado? CAPI? Página de captura/link rastreável pronto? (se não, gerar checklist do Passo 5)

### Passo 2 — Estrutura de campanha (funil 3 temperaturas)
Montar conforme a verba. Com pouca verba, começar só pelo **fundo (CTWA)** e subir depois.
- **Topo (frio) — alcance/descoberta:** o melhor criativo (Reel que já performou no orgânico). Público **amplo** + geo. Objetivo: ser descoberto / gerar visualização de vídeo.
- **Meio (morno) — consideração:** remarketing de quem viu ≥50% do vídeo ou engajou → criativo de valor (comparação, prova, tour). Objetivo: desejo.
- **Fundo (quente) — conversão:** CTWA (ou form de captura) → quem visitou a página (Pixel) + **lookalike dos leads/compradores do CRM**. Objetivo: conversa qualificada / lead.

### Passo 3 — Segmentação (mira moderna 2026: amplo + sinal)
- **Geo:** Palmas + raio (definir km); excluir o que não atende.
- **Público:** **amplo / Advantage+** — deixar o algoritmo achar o comprador com bom criativo + evento de lead qualificado. **Não** micro-segmentar interesse (perdeu força e encarece).
- **Idade/gênero:** abrir, salvo motivo claro.
- **Camadas que importam de verdade:** retargeting (vídeo ≥50%, visitantes da página) + **lookalike 1–3% da base do CRM** (ativo que compõe com o tempo).

### Passo 4 — Criativos (1–3 por teste, persona-fit) — o lance principal
Para CADA criativo, entregar um **brief** com:
- **Formato:** vídeo **9:16** legendado (preferência) · carrossel · imagem única.
- **Gancho (2 primeiros segundos):** obrigatório. Persona A: "e se a parcela coubesse no seu aluguel?" · Persona B: número/prova (valorização 9–14%, ocupação Airbnb).
- **Regra:** **1 imóvel, 1 oferta, 1 CTA.** Sem poluir. Tom do `preferencias.md`.
- **Roteiro/estrutura:** gancho → 2–3 provas/benefícios → CTA ("chama no WhatsApp / toca no link").
- **CTA + destino:** botão → WhatsApp (CTWA) com **mensagem pré-preenchida** OU link `investir.html?origem=ads`.
- Anti-clichê e anti-cara-de-IA (ver `identidade/guia-conteudo.md`). Render bonito sem gancho = dinheiro queimado.
- Se precisar gerar a arte/legenda, chamar `/carrossel` ou `/agencia`.

### Passo 5 — Medição (o diferencial = BI) — checklist técnico
- **Pixel** no site (PageView na bio, ViewContent na página de captura).
- **CAPI** (Conversions API) pra recuperar sinal pós-iOS.
- **Evento Lead:** envio do form (já via `sendBeacon` no CRM) e/ou **conversa qualificada** no CTWA.
- **Link rastreável:** `investir.html?origem=ads` (e `?origem=ads-retarget` etc.) pra separar no painel do CRM.
- **CTWA medido:** usar Click-to-WhatsApp com rastreio — nunca "joga no zap e perde o rastro".

### Passo 6 — Qualificação (lead melhor, não mais lead)
Definir 2–3 perguntas de triagem (no form da captura ou na 1ª resposta do WhatsApp): **morar × investir**,
**região/bairro**, **orçamento/entrada**, **prazo**. Objetivo: o corretor fala com menos gente e melhor —
o "na tora" se afoga em curioso.

### Passo 7 — Teste & escala (disciplina)
- Teste: **R$ 20–30/dia**, 2–3 criativos, 5–7 dias.
- **Métrica-rainha:** CPL + **custo por conversa qualificada**. Olhar também CTR, hook rate (3s), conversão da página.
- Escalar só o criativo/público de **melhor CPL**; pausar o resto. Subir verba aos poucos (não dobrar de uma vez).
- Depois de rodar, jogar os números no `/relatorio-ads` pra leitura semanal.

---

## Entregável (salvar em `marketing/campanhas/trafego-meta-<YYYY-MM-DD>/`)
- `plano-campanha.md` — estrutura (funil/conjuntos), segmentação, orçamento, cronograma de teste.
- `criativos.md` — 1–3 briefs de criativo (gancho, roteiro, CTA, destino) por persona.
- `setup-medicao.md` — checklist Pixel/CAPI/eventos/links rastreáveis + perguntas de qualificação.
- `metas.md` — CPL-alvo, custo por conversa qualificada, gatilhos de matar/escalar.

## Regras
- Toda campanha mira persona A ou B e termina em **conversa/lead medido** (CTWA com rastreio ou form).
- Criativo persona-fit > verba. **1 imóvel, 1 oferta, 1 CTA.**
- Dado de Palmas só com fonte. Sem promessa exagerada (regra do `guia-conteudo.md`).
- **Validar orgânico antes de escalar pago** — o criativo de ad é o conteúdo que já provou prender.
- Liga com: `/agencia` (estratégia/criativo), `/carrossel` (arte), `/anuncio-google` (Search), `/relatorio-ads` (leitura).

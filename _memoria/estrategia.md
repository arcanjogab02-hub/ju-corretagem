# Estratégia

> O que importa agora. Prioridades, metas, prazos.

## Fase atual (jun/2026)

Sistema de captação da Juliana está **construído e no ar** em `juliana-alves.pages.dev`.
Hospedado no **Cloudflare Pages**, deploy automático a cada `git push` na `main` (migrado do
Netlify em 13/06/2026, que travou por falta de créditos — modelo de crédito medido descartado
para o produto). Próxima semana: sentar com a Ju, ajustar com dados/fotos reais, publicar
oficialmente e rodar 1 semana de validação. Depois disso: produtizar o sistema para outros corretores.

## O que está no ar (produção)

- **Bio Premium** (`index.html`) — foto da Ju, logo URBS, slideshow Ken Burns, stats animados, botão "Quero investir"
- **Página de Captura** (`investir.html`) — form 3 campos, sendBeacon → planilha + WhatsApp, ping de visita rastreado
- **Catálogo** (`imoveis.html`) — 3 imóveis demo (trocar pelas fotos reais)
- **CRM** (Google Sheets + Apps Script) — painel `/exec`: kanban no desktop, ação contextual no mobile
- **PWA launcher** (`crm.html`) — instala como app no celular da Ju
- **BI da captação** — painel Desempenho: visitas, leads, conversão %, gráfico 14 dias, por origem

## CRM endpoint
`https://script.google.com/macros/s/AKfycbxPjat7C66mU5GDRjHTMBuymxNilBvQ1pv0Jn31LXtdxwHlnI7pyPuuSqYjkS5EJwZg/exec`

## WhatsApp
- Ju: `5563992226998`
- Gabriel (operador): `5563981493039`

## Prioridades imediatas (semana que vem)

1. **Sentar com a Ju** — usar `marketing/produto-corretores/apresentacao-juliana.html`
2. **Substituir fotos demo** — `imoveis.html` (3 imóveis reais da URBS)
3. **Atualizar stats da bio** — número real de famílias atendidas, seguidores atuais
4. **Instalar PWA** no celular da Ju — `juliana-alves.pages.dev/crm.html`
5. **Ativar CallMeBot** — lembrete diário às 8h no WhatsApp (ver `marketing/crm/SETUP-CRM.md`)
6. **Trocar link da bio do Instagram** → `juliana-alves.pages.dev`
7. **Rodar 1 semana** → validar funil, analisar conversão no painel

## Cadência e mix de conteúdo (Instagram @juu_alves8)

Régua sustentável (consistência > volume), calibrada pro perfil da Ju (mistura pessoal+trabalho):
- **Semana:** 3 Reels + 1–2 carrosséis + 0–1 post estático + **stories diários** (4–10 frames).
- **Papéis:** Reels = alcance/descoberta · carrossel = captação/saves (CTA pro link) ·
  stories = canal nº1 de conversão (link/WhatsApp) · estático = autoridade/recado.
- **Mix:** ~30% bastidor · 25% técnico/educativo · 20% imóvel/oferta · 15% pessoal · 10% prova social.
  Pessoal é o ativo da Ju, mas toda peça pessoal reforça trabalho/Palmas/confiança.
- **Algoritmo 2026:** compartilhamento em DM pesa 3–5x mais que like; palavra-chave na legenda
  vale mais que hashtag (usar 3–6); gancho nos 2 primeiros segundos do Reel.
- **Dias/horários (validar no Insights do perfil):** ter–qui, fim de manhã/almoço e 18h–21h; evitar domingo.
- **Padrão visual dos carrosséis:** ver "Padrão de carrossel" em `identidade/design-guide.md`.
- Dados de Palmas pra embasar conteúdo: `marketing/dados-mercado-palmas.md`.
Pesquisa: Buffer, Sprout, SERHANT/BAM, Social Realtr (jun/2026).

## Fase seguinte: produtizar para outros corretores

- Página de vendas pronta: `marketing/produto-corretores/vendas.html`
- Skill `/novo-corretor` construída: `.claude/skills/novo-corretor/SKILL.md`
- Skill `/copy-imobiliaria` construída: pacote mensal de copy (8 stories + 4 reels + 4 posts),
  parametrizável por corretor. Entra como brinde de estreia / entregável de conteúdo.
- Material de estudos (consultor de captação): `marketing/produto-corretores/estudos/manual-consultor.html`
- Bônus de fechamento prontos: `marketing/produto-corretores/bonus/`

### Modelo de oferta — Captação 360 (atual)

Plano único, dois preços conforme a porta de entrada:
- **Venda crua (público / orgânico):** implementação **R$ 497,90** + **R$ 297,90/mês**. É o que está na
  `vendas.html` (ga-business.pages.dev) — pra quem chega pelo orgânico.
- **Indicação da Ju (fundador):** implementação **R$ 297,90** + **R$ 197/mês**. **3 vagas**, reavaliar depois.
  Preço de fundador, passado no direto (NÃO fica na página pública).
- **Escopo:** bio premium + captura + catálogo editável + CRM 1 toque + painel (visitas/cliques/leads/conversão)
  + relatórios por IA (recomendação semanal + fechamento mensal). GA4 + Pixel como ativo do cliente.
- **Entrega:** sistema na mão do corretor em até **3 dias**.
- **Brindes de fundador (one-time):** pacote de conteúdo de estreia (`/copy-imobiliaria`) + carrossel de lançamento (`/carrossel`).
- **Compromisso 90 dias**, depois mês a mês (cancela quando quiser).
- **Posicionamento completo** (cliente ideal corretor, dores, método autoral, escada de oferta):
  `marketing/produto-corretores/posicionamento.md`.
- Decisão de produto: corretor edita só os **imóveis em destaque** (catálogo lê de planilha,
  mesma stack do CRM) — NÃO migrar pra Vercel/CMS antes de validar. Feature pós-validação.

## Regra de posicionamento — COMPLEMENTAR, não concorrente (permanente)

Em TODA divulgação do produto, deixar claro que o nosso CRM **não substitui o CRM da
imobiliária** — eles medem coisas diferentes e por isso se completam. É um risco real:
se o corretor achar que tem que escolher, larga um dos dois (provavelmente o nosso, já que
o da imob é obrigatório).

- **CRM da imob (ex: URBS):** gere a carteira e o processo — documentação, repasse, comissão.
- **Nosso CRM:** funil de **captação pessoal** do corretor — mede os leads que ELE gerou com
  bio, stories e indicações (via links rastreados). É dele, vai junto se trocar de imobiliária.

**Frase-mãe (usar nas peças):** *"Não substitui o CRM da sua imobiliária — ele mede o que é
SEU. A imob gerencia a venda; aqui você prova quantos leads sua bio, seus stories e suas
indicações trouxeram. É o número do seu esforço de captação, que hoje ninguém te mostra."*

Aplicado na `vendas.html` (seção "E o CRM da imobiliária?"). Replicar em qualquer material novo.

## Links rastreáveis por canal

Ver catálogo completo em `marketing/site/links-rastreaveis.md`.
Regra: `investir.html?origem=CANAL` (story, ads, whatsapp, indicacao, bio já automático).

## O que pode esperar

- Identidade visual 100% formalizada (logo próprio não existe — usa estética P&B + logo URBS)
- Automações avançadas de ads — primeiro validar o funil orgânico

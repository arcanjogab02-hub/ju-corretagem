# Landing Page da Juliana — Pesquisa + Estrutura + 3 Modelos

> Pasta criada em 2026-06-12. Objetivo: dar à Juliana a página de destino
> (link-in-bio) que NENHUM corretor de Palmas tem hoje. Vantagem competitiva real.

---

## 1. O que a pesquisa mostrou (referências reais)

Varri ~17 fontes (landing pages de corretor que convertem, sites de alto padrão,
link-in-bio mobile, conversão por WhatsApp). O que se repete entre os que **convertem de verdade**:

**Números que importam**
- Página de corretor mediana converte **2,7%**. As do top 25% convertem **11%+**; as melhores chegam a **34%** no tráfego de Instagram/Facebook.
- Formulário de **3 campos converte ~10%**; de 9 campos cai pra ~3,6%. → **pedir pouco.**
- Botão "Click to Chat" do WhatsApp aumenta contato em **~20%**. WhatsApp tem **98% de abertura** (e-mail tem 20-30%).
- Vídeo na hero pode subir conversão até **86%**.

**Estética que vende alto padrão**
- **Preto + dourado + branco** eleva o valor percebido do imóvel em ~30%. (Confirma a escolha da Juliana.)
- Tendência "quiet luxury": logos discretas, fontes serifadas elegantes, muito respiro, simplicidade.
- Headline de **benefício** ("Seu imóvel pode ser o melhor investimento") bate headline de produto ("Veja imóveis em Palmas").

**Regras de ouro**
- **1 ação principal** clara (WhatsApp), repetida em vários pontos (hero, meio, fim, botão fixo).
- Foto **real** (não banco de imagem) — o rosto gera confiança. A Juliana já tem isso.
- Prova social: nº de imóveis, depoimentos, seguidores.
- Mobile-first — o tráfego vem do Instagram (celular).

---

## 2. A estrutura ideal (o esqueleto que recomendo)

```
┌─ HERO ───────────────────────────────────────────┐
│ Foto + Headline de BENEFÍCIO + 1 botão WhatsApp  │  ← decide em 3s
│ (opcional: mini-formulário de 3 campos)          │
├─ FAIXA DE PROVA SOCIAL ──────────────────────────┤
│ +50 imóveis · 18,8k seguidores · URBS · 5★       │
├─ POR QUE COMPRAR COMIGO (3 cards) ───────────────┤
│ Investimento · Acesso a lançamentos · Atendimento│
├─ IMÓVEIS EM DESTAQUE (3 cards) ──────────────────┤
│ Foto · localização · preço · specs              │
├─ DEPOIMENTOS ────────────────────────────────────┤
│ 2-4 frases reais de clientes                     │
├─ SOBRE A JULIANA ────────────────────────────────┤
│ Retrato + história curta + CRECI                 │
├─ CTA FINAL + WhatsApp ───────────────────────────┤
│ "Bora encontrar o seu?" + botão                  │
└─ Botão WhatsApp FIXO o tempo todo ───────────────┘
```

Regras: copy total < 250 palavras, 1 cor de destaque (dourado), CTA sempre visível.

---

## 3. Os 3 modelos (abra cada .html no navegador)

| Modelo | Arquivo | Pra quê serve | Vibe |
|---|---|---|---|
| **1 · Bio Premium** | `modelo-1-bio-premium.html` | Substituto do Linktree. Curtinho, mobile, vai direto no link da bio do Insta. Decisão em segundos. | Elegante, vertical, botões grandes |
| **2 · Captura** | `modelo-2-captura-conversao.html` | Máquina de lead. Formulário de 3 campos que cai direto no WhatsApp + seções de prova. É o que mais converte. | Comercial, completo, persuasivo |
| **3 · Editorial** | `modelo-3-editorial.html` | Site de marca/alto padrão. Conta a história, posiciona como autoridade. Impressiona cliente premium. | Revista de luxo, cinematográfico |

**Recomendação:** começar pelo **Modelo 2** (é o que gera lead) OU usar o **Modelo 1** como link-in-bio imediato e o **3** como site institucional. Os três compartilham a mesma identidade (preto/bege/dourado) e podem coexistir.

---

## 4. Antes de publicar — o que falta preencher

Procure e substitua nos 3 arquivos:

- `55639XXXXXXXX` → **número de WhatsApp real da Juliana** (formato: 55 + DDD 63 + número, sem espaços).
- `JA` / `[ FOTO ... ]` / `FOTO DO IMÓVEL` → **fotos reais** (retrato da Juliana + fotos dos imóveis).
- Imóveis, preços e specs do Modelo 2 → trocar pelos imóveis reais do estoque.
- Depoimentos → usar prints/reviews reais de clientes.
- `contato@julianaalves.com` → e-mail real (ou remover).

A faixinha amarela "MODELO X" no canto é só referência — **apague a div `.note`** antes de publicar.

---

## 5. Como colocar no ar (grátis)

Igual você fez com o `ga-business-insights`:
1. Cria conta no **Netlify** (ou Vercel).
2. Arrasta o arquivo `.html` escolhido pra área de deploy → sai no ar em segundos.
3. (Opcional) registra um domínio tipo `julianaalves.com.br` e aponta pro Netlify.
4. Cola o link na bio do Instagram (@juu_alves8).

> Quer que eu ajuste algum modelo, junte o melhor dos três num só, ou já prepare
> a versão final com os dados reais? Manda os números/fotos que eu finalizo.

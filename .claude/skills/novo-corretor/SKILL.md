---
name: novo-corretor
description: >
  Gera o produto completo de captação (bio premium + página de captura + catálogo + CRM)
  para um novo cliente corretor de imóveis. Entrevista o cliente, escolhe os templates,
  injeta dados/fotos/cor de acento, monta a pasta pronta pra deploy e o CRM. Use quando
  o Gabriel disser "novo cliente", "montar sistema pro corretor X", "/novo-corretor".
---

# /novo-corretor — Fábrica do produto de captação

Esta skill transforma a entrega de ~2h num processo guiado. O resultado é uma pasta
`clientes/<slug>/` pronta pra subir no Netlify + o CRM do cliente. Mantém o padrão
**P&B premium** (não negociável — é a assinatura da marca) com **uma cor de acento** opcional.

## Pré-requisitos
- Templates em `templates/produto-corretor/` (ver estrutura abaixo)
- Onboarding preenchido (as 12 perguntas) — **não começar sem tudo**, evita retrabalho

---

## Fase 1 — Onboarding

Coletar via `templates/produto-corretor/onboarding.md` (mandar pro cliente ou preencher na conversa).
Confirmar que vieram: nome, CRECI, cidade/UF, imobiliária + logo, WhatsApp, Instagram, números de
prova, foco, 3-6 imóveis (foto+preço+specs), foto retrato, foto capa, e-mail Google (pro CRM).

Se faltar foto ou dado essencial, **parar e pedir** antes de gerar.

## Fase 2 — Escolha dos templates

Apresentar as opções e deixar o cliente (ou o Gabriel) escolher:
- **Bio:** `bio/opcao-1` (cartão editorial) · `opcao-2` (fullscreen) · `opcao-3` (business-card) · `opcao-4` (tipográfica branca)
- **Captura:** `captura/A` (editorial) · `B` (imersiva) · `C` (split) · `D` (branca/investimento)
- **Catálogo:** `imoveis/grid-3` · `imoveis/grid-6`

Registrar a escolha. Default recomendado: bio-3 + captura-B + grid-3 (o combo da Ju, validado).

## Fase 3 — Cor de acento

Perguntar a cor de acento da imobiliária (hex ou nome). Regra: **base sempre P&B**; o acento entra
SÓ em detalhes (selo, hover, linha). Se o cliente não tiver, manter 100% P&B (branco como acento).
Validar contraste (não usar cor clara demais sobre preto sem ajuste).

## Fase 4 — Geração da pasta do cliente

1. Criar `clientes/<slug>/` (slug = nome em minúsculas, sem acento, com hífen)
2. Copiar os templates escolhidos pra `clientes/<slug>/site/` como `index.html`, `investir.html`, `imoveis.html`
3. Substituir TODOS os placeholders (ver tabela §Placeholders) — usar replace seguro (função, não string,
   por causa de `$` em nomes)
4. Copiar/processar assets: `juliana.jpg`→`<slug>.jpg`, vetorizar logo da imob (processo do PowerShell:
   System.Drawing, luminância→alpha, gera PNG branca + preta transparente)
5. Preencher os 3-6 imóveis no `imoveis.html` (blocos repetíveis)
6. **Encoding:** gravar HTML com `[System.IO.File]::WriteAllText` UTF-8 sem BOM (o `Set-Content` do PS 5.1 corrompe acento)

## Fase 5 — CRM do cliente

1. Copiar `templates/produto-corretor/crm/Code.gs`, trocar `Juliana Alves` → `{{NOME}}`
2. Guiar o cliente (ou fazer com acesso temporário) a:
   criar planilha na conta Google DELE → colar Code.gs → rodar `setup` → `testarNotificacao` →
   publicar Web App ("Qualquer pessoa") → copiar URL `/exec`
3. Colar a URL no `CRM_ENDPOINT` do `investir.html`
4. (Opcional) configurar CallMeBot + `ativarLembreteDiario`

> **Decisão fixa:** o CRM fica na conta do CLIENTE (LGPD + "a base é sua" verdadeiro). Gabriel mantém acesso de editor pra suporte.

## Fase 6 — Deploy + entrega

1. Deploy `clientes/<slug>/site/` no Netlify (conta do cliente ou da agência) → nome `<slug>`
2. Colar o link na bio do Instagram do cliente
3. Chamada de entrega (15 min): instalar painel no celular, testar lead real, ensinar os 4 toques
4. Agendar follow-up D+7 (chegou lead?) e D+30 (primeiro relatório → vira depoimento)

## Fase 7 — Registrar o cliente

Anotar em `clientes/<slug>/ficha.md`: plano contratado, valores, data, URLs (site + CRM), status.
Atualizar um `clientes/_carteira.md` (lista de todos os clientes, MRR somado).

---

## Estrutura de pastas (montar uma vez)

```
templates/produto-corretor/
├── site/
│   ├── index.html        ← bio (com {{PLACEHOLDERS}})
│   ├── investir.html     ← captura
│   └── imoveis.html      ← catálogo
├── bio/                  ← as 4 variações de bio
├── captura/              ← as 4 variações de captura
├── imoveis/              ← grid-3 e grid-6
├── crm/Code.gs           ← genérico
├── onboarding.md         ← as 12 perguntas
└── checklist-entrega.md  ← roteiro das 2h
```

## Placeholders (a tabela de substituição)

| Placeholder | Vem de | Exemplo |
|---|---|---|
| `{{NOME}}` | onboarding | Juliana Alves |
| `{{CRECI}}` | onboarding | 5377 |
| `{{CIDADE_UF}}` | onboarding | Palmas — Tocantins |
| `{{WHATS}}` | onboarding | 5563992226998 |
| `{{INSTAGRAM}}` | onboarding | juu_alves8 |
| `{{IMOBILIARIA}}` | onboarding | URBS Cerrado |
| `{{N_IMOVEIS}}` `{{N_SEGUIDORES}}` | onboarding | +50 / 18,8k |
| `{{GANCHO}}` | padrão ("Seleção feita pra você") ou ajuste | — |
| `{{COR_ACENTO}}` | Fase 3 | #ffffff (default) |
| `{{CRM_ENDPOINT}}` | Fase 5 | https://script.google.com/.../exec |
| `{{IMOVEL_N_*}}` | onboarding | foto, título, preço, specs |
| `{{SLUG}}` | gerado | juliana-alves |

## Regras
- **Nunca** gerar com foto/dado faltando — pedir antes.
- **Nunca** abandonar o P&B premium. Acento é detalhe, não tema.
- Cada cliente = pasta isolada em `clientes/<slug>/`. Não misturar.
- Reaproveitar os processos já validados: vetorização de logo, sendBeacon no form, encoding UTF-8.
- Ao terminar, perguntar se quer registrar na carteira e atualizar o MRR.

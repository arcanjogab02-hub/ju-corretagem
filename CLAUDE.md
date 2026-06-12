# MazyOS — Sistema operacional do negócio

Sua empresa roda em cima desse arquivo. Aqui ficam as regras de operação
do MazyOS — como o Claude lê o contexto, aprende com correções, mantém
tudo atualizado e cria skills novas conforme a operação evolui.

Esse arquivo é editável. Quando o `/instalar` rodar, ele complementa o
final dessa página com as regras específicas do seu negócio.

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (quando existirem
e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos

Usar essas informações como base pra qualquer resposta ou decisão. Ao
sugerir prioridades, formatos ou abordagens, considerar o foco atual
descrito em `estrategia.md`.

Pra qualquer tarefa visual (carrossel, post, landing page), consultar
`identidade/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas
usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante
em `.claude/skills/`. Se encontrar, seguir as instruções da skill. Se
não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o
usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o
padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma
instrução que parece permanente (frases como "na verdade é assim", "não
faça mais isso", "prefiro assim", "sempre que...", "evita...", "da
próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (clientes, serviços, mercado) → `_memoria/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato, o que evitar) → `_memoria/preferencias.md`
- **Sobre prioridades e foco** (projetos, metas, prazos) → `_memoria/estrategia.md`
- **Regra de comportamento nessa pasta** → próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro.
Confirmar mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na
verdade o arquivo se chama X"). Só perguntar quando a informação tiver
valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante (cliente novo, skill
nova, mudança de foco, processo novo, ferramenta instalada, estrutura
alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize a memória?"

Se sim, identificar o que atualizar:

- **Cliente, serviço, ferramenta, equipe** → `_memoria/empresa.md`
- **Mudança de prioridade ou foco** → `_memoria/estrategia.md`
- **Tom ou estilo** → `_memoria/preferencias.md`
- **Pasta, regra de organização, skill criada** → `CLAUDE.md`
- **Visual (cores, fontes, logo)** → `identidade/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo
inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais sem impacto no contexto (escrever um email avulso, criar um post)
- Perguntas simples ou conversas sem ação
- Mudanças já salvas pelo bloco "Aprender com correções"

**Dica:** rode `/atualizar` pra uma varredura completa quando houver dúvida.

---

## Criação de skills

Quando o usuário pedir skill nova:

1. Verificar se existe template relevante em `templates/skills/`. Se
   existir, usar como base e adaptar pro contexto
2. Perguntar se é específica desse projeto ou útil em qualquer:
   - Específica → `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Universal → `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` pra calibrar
   o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, exemplos),
   criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code

---

# Este negócio — Juliana Alves, Corretora de Imóveis

> Seção adicionada pelo `/instalar`. Perfil: **criador solo / marca pessoal**.
> A marca pessoal é o ativo principal — a audiência no Instagram alimenta a captação.

## O que é esse workspace

Operação da marca pessoal e do negócio de corretagem da **Juliana Alves**
(Palmas/TO). Aqui se produz conteúdo, capta e atende leads, mantém relação
com a audiência e organiza as vendas. Quem opera o sistema no dia a dia é o
**Gabriel** (ajuda na operação e marketing).

**Estrutura de pastas:**
- `_memoria/` — quem é a Juliana, como ela fala, o que está em foco
- `identidade/` — cores, fontes, padrão visual (preto/bege/dourado)
- `marketing/` — conteúdo, SEO, campanhas (saída das skills)
- `saidas/` — análises, emails, documentos pontuais
- `dados/` — arquivos a analisar (CSV, PDF, planilha de imóveis/leads)
- `scripts/` — utilitários
- `templates/` — modelos de skills e perfis

## Quem é

Juliana Alves — corretora de imóveis em Palmas/TO (CRECI 5377), vinculada à
imobiliária **URBS Cerrado**. Foco em lançamentos e revenda de médio-alto
padrão, com discurso de imóvel como investimento. Forte presença no Instagram
(@juu_alves8, ~18,8 mil seguidores), mostrando o dia a dia real da corretagem.

## O que produz

- Stories de bastidor (visitas, plantões, imóveis entrando no estoque)
- Reels e carrosséis de imóvel no Instagram
- Atendimento de leads no direct / WhatsApp

## Audiência

~18,8 mil seguidores no Instagram, base em Palmas/TO. Perfil de comprador-investidor
de médio-alto padrão. A relação é próxima — ela conversa com a audiência, pede
opinião, mostra rotina.

## Tom de voz

Direto, leve, real. Bastidor + valor de investimento. No máximo 1 emoji por peça.
Sem promessa furada, sem clichê de corretor. (Detalhe em `_memoria/preferencias.md`.)

## Posicionamento

A corretora que mostra o processo de verdade e trata imóvel como investimento
inteligente em Palmas — não vende sonho genérico, mostra o bom negócio.

## Regras do sistema

- Conteúdo novo salvar em `marketing/conteudo/<tipo>-<tema>-<data>/`
- Toda peça visual respeita `identidade/design-guide.md` (preto/bege/dourado, elegante)
- Imóvel da URBS Cerrado pode levar assinatura/cores da imobiliária
- Foco operacional atual: **captação de leads** e **automatizar perguntas repetitivas**
  (candidata a `/mapear-rotinas`)

## Ferramentas conectadas

- [ ] Instagram
- [x] WhatsApp — 5563992226998 (número de captação da Ju)
- [ ] Notion
- [ ] Canva
- [ ] Google Calendar
- [ ] Meta Ads
- [ ] Google Ads

*(Marcar conforme for instalando os MCPs)*

## Stack do projeto "Site + CRM" (definida)

- **Site/landing:** HTML estático em `marketing/site/` → deploy no **Netlify** (não Linktree).
  - `index.html` = bio premium (modelo business-card). Botão destaque "Quero investir" → `investir.html`.
  - `investir.html` = página de captura (variante B imersiva). Form de 3 campos.
  - `imoveis.html` = catálogo (3 imóveis demo da URBS, trocar pelos reais).
- **CRM:** **Google Sheets + Apps Script** (`marketing/crm/Code.gs`). A planilha é o banco; o
  Apps Script é a API (`doPost` grava lead) + BI nativo (aba Painel) + **Painel de Ação web** (`doGet`).
  O form posta via `navigator.sendBeacon` (sobrevive ao redirect pro WhatsApp). **Stack oficial.**
  - **Filosofia do CRM:** zero atrito. Status se atualiza pela ação (tocar "Responder" → marca "Conversando").
    Gestão 100% no painel web, **nunca na planilha**. Etapas: Novo · Conversando · Visita · Fechado · Perdido.
  - Lembrete diário no WhatsApp via CallMeBot (`resumoDiario` + trigger 8h). Notificação de lead por e-mail nativo.
  - URL do Web App `/exec` = painel da Ju (salvar na tela inicial). Editou o `Code.gs`? Re-implantar nova versão.
- **Identidade:** preto e branco (sem dourado). Logo URBS vetorizada em PNG transparente
  (`identidade/logo-urbs-branca.png` / `-preta.png`).
- **Regra de encoding:** ao editar HTML via PowerShell, usar `[System.IO.File]::WriteAllText` com
  UTF8 sem BOM — o `Set-Content -Encoding UTF8` do PS 5.1 corrompe acentos (dupla codificação).

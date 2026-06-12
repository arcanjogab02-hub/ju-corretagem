---
name: copy-imobiliaria
description: >
  Gera o pacote mensal de copy pro corretor de imóveis — 8 ideias de story, 4 roteiros
  de reels e 4 legendas de post, focados em captação de leads pra página de captura.
  Parametrizável: pergunta nome, cidade, nicho, tom e link a cada uso (serve a Ju e a
  qualquer corretor cliente do GA Business Insights). É o entregável do plano Performance.
  Use quando pedirem "copy do mês", "pacote de conteúdo", "copy imobiliária", "conteúdo
  pro corretor", ou /copy-imobiliaria.
---

# /copy-imobiliaria — Pacote mensal de copy pro corretor

Skill de produto. Entrega, num arquivo só, o lote de conteúdo que o corretor posta
durante o mês — pensado pra **trazer lead pra página de captura**, não pra likes.

É o entregável recorrente do plano **Performance** (R$ 497,90/mês). Roda uma vez por
mês, por cliente. O resultado é texto pronto pra copiar e colar.

## Dependências

- **Tom da Ju (referência):** `_memoria/preferencias.md` — usar como calibre de qualidade
  quando o cliente for a própria Juliana
- **Posicionamento do produto:** `CLAUDE.md` (seção do negócio)
- **Outputs vão em:** `marketing/produto-corretores/copy/<corretor>-<YYYY-MM>/pacote.md`
  (pra Ju: `marketing/conteudo/copy-<YYYY-MM>/pacote.md`)

---

## Passo 1 — Coletar os parâmetros

Antes de gerar, perguntar (num bloco só, e aceitar respostas curtas):

1. **Corretor** — nome e @ do Instagram
2. **Cidade / região** — ex: Palmas — TO
3. **Nicho** — ex: lançamento, revenda, alto padrão, primeiro imóvel, investimento
4. **Tom** — direto/leve, sóbrio/premium, descontraído? (default: direto, leve, real,
   máx. 1 emoji por peça — o padrão da casa)
5. **Link de captura** — a URL pra onde o conteúdo manda o lead (ex:
   `juliana-alves.netlify.app/investir`)
6. **Destaques do mês (opcional)** — 1-3 imóveis ou novidades pra ancorar o conteúdo
   (bairro, faixa de preço, diferencial). Se não houver, gerar genérico do nicho.

Se o cliente for a Juliana, pré-preencher com os dados dela e só confirmar.

---

## Passo 2 — Gerar o pacote

Produzir **exatamente**: 8 stories + 4 roteiros de reels + 4 legendas de post.
Cada peça precisa ter um **objetivo de captação** claro. Variar os ângulos — não repetir
o mesmo gancho.

### Regras de copy (valem pra tudo)

- **Foco em captação, não em vaidade.** Toda peça leva, direta ou indiretamente, pro
  link de captura. Pelo menos metade tem CTA explícito pro link.
- **Sem clichê de corretor.** Proibido: "realizando sonhos", "a chave da sua felicidade",
  "imóvel dos sonhos", "não perca essa oportunidade única".
- **Imóvel como decisão inteligente**, não sonho genérico. Falar de investimento, bairro
  que valoriza, oportunidade real, custo de oportunidade de esperar.
- **Máx. 1 emoji por peça.** Sem emoji em rajada.
- **Bastidor + valor.** Mostrar o processo real da corretagem (visita, plantão, negociação)
  é o que mais engaja — usar isso como gancho.
- **Hook nos 3 primeiros segundos / primeira linha.** Sempre.
- Respeitar o **tom** informado. Quando for a Ju, casar com `preferencias.md`.

### Estrutura de cada tipo

**STORY (8 un.)** — cada um com:
- `Gancho`: a primeira tela (frase curta de parar o dedo)
- `Sequência`: 2-4 telas do que mostrar/falar
- `CTA`: ação (arrasta pra cima / link na bio / "manda 'QUERO' no direct")
- Variar os tipos entre: bastidor de visita, enquete/caixa de pergunta, dado de mercado
  de Palmas, antes/depois de negociação, depoimento, "imóvel que entrou hoje", erro comum
  de quem compra, lembrete do link.

**REELS (4 un.)** — cada um com:
- `Gancho` (texto da capa + fala de abertura)
- `Roteiro`: bullets do que falar/mostrar, cena a cena (até ~30s)
- `Legenda` curta com CTA
- `Áudio/ritmo`: sugestão (trend, fala direta, corte rápido)
- Ângulos diferentes: educativo (ex: "3 erros ao investir em imóvel"), bastidor,
  contra-narrativa ("não, não precisa de X pra começar"), tour rápido.

**POST / LEGENDA (4 un.)** — cada um com:
- `Tipo`: carrossel, foto única ou imóvel em destaque
- `Legenda` completa pronta pra colar (hook na 1ª linha, corpo, CTA pro link)
- `Sugestão de imagem/carrossel`: o que mostrar
- Pelo menos 1 ancorado num imóvel/destaque do mês (se houver).

---

## Passo 3 — Entregar

Salvar em `pacote.md` na pasta do mês, com cabeçalho:

```
# Pacote de conteúdo — <Corretor> — <Mês/Ano>
Cidade: <...> · Nicho: <...> · Link de captura: <...>
Calendário sugerido: distribuir as 16 peças ao longo do mês
(2 stories + 1 reels + 1 post por semana, ajustável).
```

Depois listar as 3 seções (Stories, Reels, Posts) numeradas.

No fim, oferecer:
> "Quer que eu transforme algum desses posts em carrossel visual? (`/carrossel`)"

A ponte natural: a copy sai daqui, o visual sai da `/carrossel`. Juntas, fecham o
entregável do mês.

---

## Observações de produto

- Este é o componente **manual-assistido** do plano Performance: por enquanto o Gabriel
  roda a skill 1x/mês por cliente. Quando houver volume, parte disso pode ser embarcada
  (API) — mas a calibragem de tom feita aqui é o diferencial, não terceirizar cedo.
- O **relatório automático dia 1** (números do funil) é separado: sai do Apps Script do
  CRM, não daqui. Esta skill cuida só do conteúdo.

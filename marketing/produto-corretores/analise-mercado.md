# Análise de mercado & estratégia — Captação 360 (BI aplicado ao corretor)

> Doc de decisão. Base: análise sincera jun/2026 (Gabriel + Claude). Complementa
> `posicionamento.md` (oferta/escada) e `_memoria/estrategia.md` (fase/cadência).

---

## 0. A virada de posicionamento (o mais importante)

**GA Business = consultoria de BI para negócio local. Captação 360 = a ferramenta de execução e coleta de dado.**

Não vender como "site bonito", "CRM" nem "agência de social". Vender como a **camada de inteligência**
que transforma a captação do corretor em **decisão**: qual criativo trazer, qual origem converte,
qual o CPL, qual a conversão da página, qual lead vale a conversa.

- **Por que é mais defensável:** BI/leitura de dado é *competência*, não template. O CRM dá o dado,
  a agência gasta a verba — **ninguém lê o dado e decide**. Esse é o buraco.
- **Frase-mãe:** *"O corretor não tem problema de postar nem de rodar anúncio. Tem problema de não
  saber o que funciona. A gente mede e decide por ele — a ferramenta só coleta o dado pra isso."*
- Consequência: o produto-núcleo é o **relatório/decisão recorrente** (BI), não o software. O software
  é o que torna o BI possível e barato.

---

## 1. Veredito do produto (honesto)

**Forte:** dor real e mal resolvida ("like não vira comissão", lead some, corretor não mede nada);
ângulo "a base é sua / complementar ao CRM da imob"; margem alta (stack quase custo zero);
a Ju como case vivo + distribuição.

**Frágil:** o *software* é commodity (bio+landing+form+planilha qualquer um copia; Tecimob/Jetimob
fazem site+CRM por R$ 69–149/mês); o valor real é o **serviço/BI**, não a ferramenta → isto é
**agência/consultoria produtizada, não SaaS** (margem e escala diferentes); stack Sheets+Apps Script
tem **teto operacional** (~15–20 clientes); **churn** se o corretor não produz conteúdo/tráfego;
ticket baixo × entrega manual = suporte come a margem.

---

## 2. SWOT

**Forças**
- Posicionamento BI/decisão (difícil de copiar) + "a base é sua".
- Case-âncora real (Ju, corretora, 18,8k) → prova + canal de indicação.
- Custo de stack ~zero → margem alta no que cobra.
- Método autoral "Captação 360" (atrair→capturar→converter→medir→melhorar) dá narrativa.

**Fraquezas**
- Moat tecnológico ~nulo (a ferramenta é replicável).
- Entrega manual por cliente (não escala como software).
- Stack Sheets/Apps Script frágil acima de ~15–20 clientes.
- Ticket baixo (R$ 197–297/mês) × suporte alto a público não-técnico.
- Valor depende do cliente produzir (risco de churn).

**Oportunidades**
- Maioria dos CRECIs com presença digital fraca e dor exata.
- Tráfego pago "na tora" domina o mercado → espaço pra **tráfego + BI bem-feito**.
- Palmas desassistida de especialista em captação fim-a-fim (beachhead).
- Reframe BI permite subir ticket e vender pra quem já gasta com ads.

**Ameaças**
- Plataformas site+CRM mais baratas (Tecimob/Jetimob/Kenlo/Imobzi).
- Agências de tráfego e gurus/mentorias disputando atenção e verba.
- DIY grátis (Linktree + Google Forms + WhatsApp) — concorrente invisível.
- Mudança de regra de API (Sheets/WhatsApp/Meta) quebrando a stack.

---

## 3. Concorrentes (3 frentes + local)

| Frente | Quem | Preço/ref. | Onde falham (nossa brecha) |
|---|---|---|---|
| Plataformas site+CRM | Tecimob, Jetimob (R$69–149/mês), Kenlo, Imobzi, Vista, Arbo | baixo | template igual; dado preso; **sem conteúdo/tráfego/leitura** |
| Agências de marketing/tráfego | agências + freelancers de tráfego | médio/alto | peça avulsa; **rodam mas não leem o dado**; base não é do corretor |
| Gurus/mentorias | Guilherme Machado, Thiago Concer, Gabi Archetti | alto (curso) | **ensinam, não montam/operam nem medem** |
| DIY grátis | Linktree + Forms + WhatsApp | R$0 | sem captura/medição/decisão |

**Local (Palmas/TO):** agências de social genéricas + freelancers de tráfego. **Nenhum especialista em
captação fim-a-fim com BI.** Mercado pequeno, mas desassistido → beachhead pra cravar prova social.

---

## 4. Nicho — explorável?

**Sim, como serviço de BI/captação produtizado** (faturamento bom em escala pequena-média, dezenas de
clientes), **não** como SaaS defensável sem afiar a diferença.

- **TAM:** centenas de milhares de CRECIs; sobra dor.
- **Moat real:** (a) competência de BI/leitura, (b) marca/distribuição da Ju + cases,
  (c) motor de conteúdo (fazer, não ensinar). **Não vem do código.**
- **Caminho:** beachhead Palmas → expandir por **nicho** (corretor pessoa-marca), não por geografia ampla.

---

## 5. Plano (5 movimentos)

1. **Assumir que é consultoria/agência de BI produtizada**, não SaaS. Carro-chefe = "faço por você + leio
   o dado". Matar/automatizar 100% o tier "só ferramenta".
2. **Subir o ticket do done-for-you** (conteúdo + tráfego + BI vale mais que R$ 297/mês). R$ 197 fundador
   só pras 3 vagas de prova; depois reprecificar.
3. **Ju como case-âncora**, vender por **indicação/orgânico primeiro** (CAC baixo). Cold só após 5–10 cases.
4. **Templatizar a entrega** (`/novo-corretor`) e definir **gatilho de re-plataformar o CRM** (~15–20 clientes,
   sair do Sheets pra um backend de verdade).
5. **Beachhead Palmas → nicho.** Cada cliente vira case e prova de CPL/conversão pro próximo.

---

## 6. Tráfego pago — como ganhar num mercado saturado (Palmas)

> Contexto: tráfego pago domina Palmas. Muita agência, muito corretor rodando o MESMO anúncio
> ("casa à venda → link no zap") **na tora** — boost de post, sem funil, sem qualificação, sem leitura.
> Ex.: story patrocinado da MC Construções (render + "3 suítes... wa.me"). Funciona, mas é genérico.

**Onde se ganha (não é gastar mais — é gastar melhor):**

1. **Criativo + oferta + persona-fit > verba.** Em mercado saturado, criativo é o lance. Vídeo vertical
   9:16, **gancho nos 2 primeiros segundos**, legendado, **1 imóvel, 1 oferta, 1 CTA**. Persona A
   ("saia do aluguel / 1º imóvel / pouca entrada") e Persona B ("investir, renda, valorização") pedem
   **criativos e imóveis diferentes**. Aí mora a "especificidade".
2. **Click-to-WhatsApp (CTWA) sim — mas MEDIDO.** O "na tora" joga no zap e perde o rastro. Rodar CTWA
   com **Pixel + CAPI** e/ou passar pela página de captura, logando no CRM. Otimizar por **conversa
   qualificada/lead**, não por clique.
3. **Mira moderna (2026): amplo + sinal, não micro-targeting manual.** Deixar o algoritmo achar o
   comprador (Advantage+/público amplo) com **bom criativo + evento de lead qualificado** alimentando.
   Micro-segmentação de interesse perdeu força. Fixar **geo (Palmas + raio)** e deixar o resto pro sinal.
4. **Retargeting + Lookalike da base** (o que o "na tora" não tem): quem viu ≥50% do vídeo / engajou →
   próximo anúncio; visitantes da página (Pixel) → fundo; **lookalike dos leads/compradores do CRM**.
   Isso **compõe** com o tempo — vira ativo.
5. **Qualificar pra lead melhor, não mais lead.** Perguntas de qualificação (orçamento, região, prazo,
   morar×investir) no formulário/conversa → o corretor fala com menos gente e melhor. O "na tora" afoga
   em curioso.
6. **BI em cima (o diferencial-mãe):** **CPL**, **custo por conversa qualificada**, conversão da página,
   resultado **por criativo e por origem** → matar perdedor, escalar vencedor. Todo mundo sabe dar boost;
   quase ninguém **lê e decide**. Esse é o produto.
7. **Disciplina de teste:** R$ 20–30/dia, 2–3 criativos, 5–7 dias; escalar só o de melhor CPL, pausar o
   resto. O criativo de ad = o melhor conteúdo orgânico (que já provou prender).

**Resumo:** o concorrente compra alcance; nós vendemos **decisão**. Criativo persona-fit + CTWA medido +
sinal/lookalike da base + leitura de CPL por criativo = tráfego de qualidade num mercado saturado.

---

## 7. Riscos a monitorar
- **Escala da stack** (Sheets/Apps Script) — gatilho de migração ~15–20 clientes.
- **Churn** se o cliente não produz — mitigado pelo "faço por você".
- **ACV baixo** — resolver com ticket maior do done-for-you + BI, não com volume manual.
- **Dependência de APIs** (Meta/WhatsApp/Google) — desenhar pra trocar peça sem quebrar tudo.

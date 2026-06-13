# CRM Juliana — Setup

> Stack: **Google Sheets** (banco) + **Apps Script** (API que recebe o lead + painel web de gestão).
> Tudo grátis, na conta Google da Ju (ou sua). É a stack que vamos usar daqui pra frente.

---

## 🔄 JÁ TEM O CRM RODANDO? Atualizar pro v2 (Painel de Ação)

O `Code.gs` novo transforma o painel web num **CRM de 1 toque** (a gestão é toda nele, **nunca na planilha**):
feed de cards, muda etapa tocando, "Responder" abre o WhatsApp e já marca "Conversando", e resumo diário.

1. Abre **Extensões → Apps Script**, apaga tudo, cola o [Code.gs](Code.gs) novo, **salva**.
2. Roda **`setup`** de novo (atualiza as etapas pra Novo · Conversando · Visita · Fechado · Perdido).
3. **Re-publica:** Implantar → **Gerenciar implantações** → ✏ (editar) → Versão: **Nova versão** → Implementar.
   *(A URL `/exec` continua a mesma — não precisa mexer no site.)*
4. Abre a URL `/exec` no celular → agora é o **Painel de Ação**. Salva na tela inicial.

### Ligar o lembrete diário no WhatsApp (escolhido)
1. No WhatsApp, adiciona **+34 644 51 95 23**, manda *"I allow callmebot to send me messages"* → o bot devolve sua **apikey**.
2. No `Code.gs`, preenche `CALLMEBOT_PHONE = '5563992226998'` e `CALLMEBOT_APIKEY = 'sua-key'`.
3. Salva, roda **`ativarLembreteDiario`** (autoriza quando pedir). Pronto — todo dia 8h a Ju recebe o resumo.
   *(Sem CallMeBot, o resumo cai por e-mail automaticamente.)*

### Ligar o relatório mensal automático (entregável do plano Performance)
Fecha o mês anterior todo **dia 1 às 8h**: visitas, leads, conversão, melhor canal, funil + uma **leitura do mês**.
1. *(Opcional)* Pra leitura escrita por **IA** (Sonnet 4.6):
   - Pegue uma chave em **console.anthropic.com → Chaves de API** e ponha um crédito em **Billing** (US$ 5 dura meses).
   - ⚠ **Não cole a chave no `Code.gs`** (ele vai pro GitHub). Guarde no cofre do projeto:
     **⚙ Configurações do projeto → Propriedades do script → Adicionar propriedade** →
     Propriedade `ANTHROPIC_APIKEY`, Valor `sk-ant-...`. **Salvar.** O código lê dali sozinho.
   - **Sem chave, a leitura sai automática por código** (heurística) — funciona igual, de graça.
2. Roda **`ativarRelatorioMensal`** uma vez (autoriza). Sai por e-mail (e WhatsApp, se o CallMeBot estiver ligado).
3. Quer ver agora sem esperar o dia 1? Roda **`testarRelatorioMensal`** — manda o relatório do mês anterior na hora.
4. Trocou de chave ou modelo? Não precisa reimplantar — as funções de gatilho rodam a versão salva do código.

### Ligar as recomendações semanais (entregável toda segunda)
Toda **segunda às 8h**, olha os últimos 7 dias + os leads em aberto/esfriando e manda **2-3 ações práticas pra semana** (curtinho). Complementa o relatório mensal.
1. Usa a **mesma chave** Anthropic do relatório mensal (a do cofre). Modelo: **Haiku** (rápido e barato) — definido em `ANTHROPIC_MODELO_SEMANAL`. Sem chave, cai na recomendação automática por código.
2. Roda **`ativarRecomendacoesSemanais`** uma vez (autoriza). Sai por e-mail (e WhatsApp, se o CallMeBot estiver ligado).
3. Quer ver agora? Roda **`testarRecomendacoesSemanais`** — manda o foco da semana na hora.

> **Os dois modelos:** mensal = Sonnet (vitrine, escrita mais rica) · semanal = Haiku (ação rápida). Os dois juntos custam ~R$1-2/mês por cliente.

### IA embarcada no lead (sempre ligada, sem ativar nada)
Diferente do relatório (1x/mês) e das recomendações (1x/semana), essa IA age **em todo lead** e aparece no painel do dia a dia. Usa a **mesma chave** do cofre (modelo Haiku — fração de centavo por lead). **Sem chave, cai numa análise heurística por código** — funciona igual, de graça.

O que ela faz, automático, assim que o lead entra:
- **Perfil** — classifica o comprador (Investidor, Pra morar, Lançamento…) → vira um selo no card.
- **Score 0-100** — prioridade de atendimento. O painel **se ordena sozinho**: o lead mais quente fica no topo (🔥 a partir de 70).
- **1ª resposta sugerida** — escreve a primeira mensagem no tom da Ju. Ao tocar **"Responder no WhatsApp"**, o WhatsApp já abre **com a mensagem escrita** (ela só revisa e envia).

E sob demanda, no painel:
- **Botão "🔥 Gerar follow-up"** (aparece nos leads esfriando) — a IA escreve uma mensagem de reativação citando o que o lead procurava e há quantos dias está parado. Toca → abre o WhatsApp já preenchido.
- **Botão "✨ Analisar leads"** (topo da aba Leads) — preenche perfil/score/sugestão dos leads antigos que ainda não foram analisados (teto de 25 por vez).

> **Custo:** com Haiku, a análise por lead é fração de centavo. Mesmo com 1.000 leads/mês fica em poucos reais. Sem chave configurada, **tudo funciona na heurística** — a Ju não fica travada.
> **Colunas novas na planilha:** `IA Perfil`, `IA Score`, `IA Sugestão` (I/J/K) — criadas sozinhas no primeiro lead analisado. Não precisa rodar `setup` de novo.
> **Briefing matinal:** o lembrete das 8h (`resumoDiario`) virou um **briefing acionável** — a IA diz quem contatar primeiro e quem precisa de follow-up, usando o score. Teste agora com **`testarBriefing`**.

### Como a Ju usa o painel (zero planilha)
- **Card novo** aparece no topo, marcado 🔴 se está esfriando.
- Toca **"Responder no WhatsApp"** → abre a conversa **e** marca "Conversando" sozinho.
- Toca numa **etapa** (Conversa / Visita / Fechou / Perdeu) → muda na hora.
- **Anotação rápida** opcional no fim do card.
- Filtros: *A trabalhar · Visita · Fechados · Todos*.

---

## ⬇️ PRIMEIRA INSTALAÇÃO (se ainda não montou)

---

## Parte 1 — Criar a planilha e colar o código

1. Acesse [sheets.new](https://sheets.new) → cria uma planilha em branco. Nomeie **"CRM Juliana"**.
2. Menu **Extensões → Apps Script**. Abre o editor de código.
3. Apaga o `function myFunction(){}` que vem lá.
4. Abre o arquivo [Code.gs](Code.gs) desta pasta, **copia TUDO** e cola no editor.
5. **Salva** (ícone de disquete ou Ctrl+S).

## Parte 2 — Rodar o setup

6. No topo do editor, no seletor de função, escolhe **`setup`** → clica em **▶ Executar**.
7. Vai pedir autorização: **Revisar permissões → escolhe a conta → Avançado → Acessar (não seguro) → Permitir**.
   *(É seu próprio script acessando sua própria planilha — seguro.)*
8. Volta na planilha: vão aparecer 2 abas novas:
   - **Leads** — onde cada contato cai (com dropdown de status colorido)
   - **Painel** — BI nativo: total, funil, gráfico de pizza por interesse, barras por status

## Parte 2.5 — Notificação automática (NOVO)

Toda vez que um lead entra, a Juliana é avisada na hora. **Por e-mail já funciona sozinho.**

- **E-mail:** sem configurar nada, o aviso vai pro e-mail dono do script. Pra mandar pra outro
  (ex: e-mail da Ju), abre o `Code.gs` e preenche `EMAIL_NOTIFICACAO = 'juliana@gmail.com'`.
- **WhatsApp (opcional, grátis):** quer o aviso caindo no WhatsApp também? Segue as instruções no
  comentário do `Code.gs` (ativar o CallMeBot) e preenche `CALLMEBOT_PHONE` e `CALLMEBOT_APIKEY`.
- **Testar:** no editor, seleciona a função **`testarNotificacao`** → ▶ Executar. Vai pedir
  uma permissão extra (enviar e-mail) — autoriza. Cai um e-mail de teste bonitão com botão
  "Responder no WhatsApp". Se chegou, está ligado. ✅

## Parte 3 — Publicar como Web App (a "API")

9. No editor Apps Script: **Implantar → Nova implantação**.
10. Engrenagem ⚙ → tipo **App da Web**.
11. Configura:
    - **Descrição:** CRM Juliana
    - **Executar como:** Eu (sua conta)
    - **Quem pode acessar:** **Qualquer pessoa** ← importante, senão o site não consegue gravar
12. **Implantar** → copia a **URL do app da Web** (termina em `/exec`).

## Parte 4 — Conectar o site

13. Abre [marketing/site/investir.html](../site/investir.html), acha a linha:
    ```js
    var CRM_ENDPOINT = "";
    ```
    e cola a URL entre as aspas:
    ```js
    var CRM_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
    ```
14. Pronto. Cada lead agora **cai na planilha E abre o WhatsApp** ao mesmo tempo.

---

## Como usar no dia a dia

- **Painel na planilha:** aba *Painel* — números e gráficos atualizam sozinhos.
- **Painel web (celular):** abre a mesma URL `/exec` no navegador → dashboard P&B que atualiza a cada 2 min. Salva como favorito/atalho na tela inicial do celular da Ju.
- **Trabalhar o lead:** na aba *Leads*, muda a coluna **Status** (Novo → Contatado → Visita → Proposta → Fechado/Perdido). O funil no Painel acompanha.

## Se mudar o Code.gs depois

Toda vez que editar o código: **Implantar → Gerenciar implantações → ✏ editar → Versão: Nova → Implementar**. A URL `/exec` continua a mesma (não precisa trocar no site).

---

## Evolução (quando vingar)

- **Notificação:** dá pra adicionar no `doPost` um e-mail/WhatsApp automático pra Ju a cada lead novo.
- **Follow-up:** coluna de "próximo contato" + gatilho diário que avisa os leads parados.
- **Origem detalhada:** já gravamos a página (`B-imersiva`) — quando rodar mais de uma página/anúncio, dá pra ver qual traz mais lead fechado.

Me avisa quando estiver no ar que eu ligo essas camadas.

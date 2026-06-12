# Playbook — Transformar o sistema da Ju em produto/serviço

> A tese: você não vai vender horas de desenvolvimento. Vai vender um **produto padronizado
> com entrega de serviço** — o mesmo sistema, replicado em ~2h por cliente, cobrado como
> assinatura. O lucro está na **margem da replicação** e no **MRR** (receita recorrente).

---

## 1. O que é replicável (e o que muda por cliente)

O sistema da Ju já é 90% template. Por cliente, só muda:

| Item | Fonte | Esforço |
|---|---|---|
| Nome, CRECI, cidade, imobiliária | formulário de onboarding | 5 min |
| WhatsApp (links `wa.me`) | onboarding | busca/troca |
| Foto retrato + foto capa + fotos de 3 imóveis | cliente envia | 10 min |
| Logo da imobiliária | cliente envia → vetorizar (processo que já temos) | 10 min |
| Números de prova (imóveis, seguidores) | onboarding | 2 min |
| Textos (pitch, gancho) | 80% padrão + ajuste de tom | 15 min |
| Planilha CRM + Apps Script | colar `Code.gs`, rodar `setup`, publicar | 20 min |
| Deploy Netlify + nome | arrastar pasta | 5 min |
| **Total por cliente** | | **~1h30–2h** |

**Decisão de arquitetura importante:** cada cliente tem **sua própria planilha/Apps Script na
conta Google DELE** (não na sua). Por quê: os leads são dele (LGPD e confiança), você não vira
gargalo, e o argumento de venda "a base é sua pra sempre" é real. Você guarda acesso de editor
pra dar suporte.

## 2. O kit de templates (montar uma vez)

Criar a pasta `templates/produto-corretor/` com:

```
templates/produto-corretor/
├── site/
│   ├── index.html        ← bio com placeholders: {{NOME}}, {{CRECI}}, {{WHATS}}, {{CIDADE}}…
│   ├── investir.html     ← captura com {{GANCHO}} e {{CRM_ENDPOINT}}
│   └── imoveis.html      ← catálogo com 3 blocos {{IMOVEL_1..3}}
├── crm/
│   └── Code.gs           ← genérico (já é — só trocar "Juliana Alves" por {{NOME}})
├── onboarding.md         ← as 12 perguntas do cliente
└── checklist-entrega.md  ← passo a passo da implantação (o roteiro das 2h)
```

**As 12 perguntas do onboarding** (manda como formulário ou conversa de WhatsApp):
1. Nome completo como aparece na marca · 2. CRECI · 3. Cidade/UF · 4. Imobiliária (e logo)
5. WhatsApp de captação · 6. Instagram · 7. Nº aproximado de imóveis vendidos · 8. Nº de seguidores
9. Foco (lançamento/revenda/aluguel/investimento) · 10. 3 imóveis pro catálogo (foto+preço+specs)
11. Foto retrato profissional · 12. E-mail Google (pro CRM ficar na conta dele)

## 3. A entrega como esteira (o "roteiro das 2h")

1. Recebe onboarding completo → **não começa sem tudo** (evita retrabalho)
2. Copia `templates/produto-corretor/` → `clientes/<nome-corretor>/`
3. Busca/troca dos placeholders (eu faço isso em minutos — ver §6)
4. Vetoriza logo, ajusta fotos (processo pronto)
5. Cliente cria planilha + cola Code.gs em chamada de 15 min COM você (ou você faz com acesso temporário)
6. Deploy Netlify na conta DELE (mesmo motivo: é dele) — ou na sua, se preferir reter controle
7. Chamada de entrega (15 min): instala o painel no celular, testa lead real, ensina os 4 toques
8. D+7: follow-up "chegou lead?" · D+30: primeiro relatório → vira depoimento

## 4. Precificação (recap + estrutura)

| Plano | Implantação | Mensal | Margem |
|---|---|---|---|
| Essencial | R$ 800 | R$ 147 | ~2h de trabalho + custo zero de infra |
| **Pro** ⭐ | R$ 1.500 | R$ 297 | + ~1h/mês (catálogo + relatório) |
| Gestão | R$ 1.500 | R$ 500–1.500 | vira agência (tráfego+conteúdo) |

- Fundadores (3 primeiros): 50% off implantação, preço travado 12 meses, em troca de virar case.
- Meta ano 1 realista: **10 clientes no Pro ≈ R$ 3.000/mês recorrente + R$ 15k de implantações.**
- Custo de infra por cliente: **R$ 0** (Netlify free + Google free). Sua margem é quase 100%.

## 5. Escada de crescimento

1. **Agora:** case da Ju rodando → prints de leads = material de venda
2. **Mês 1-2:** 3 fundadores (preferir corretores de imobiliárias DIFERENTES — sem conflito com a Ju)
3. **Mês 3+:** subir preço pro cheio, pedir indicação (corretor indica corretor — dar 1 mês grátis por indicação fechada)
4. **Tese B2B:** vender pra IMOBILIÁRIA (white label: 1 sistema por corretor da casa, preço por assento). A URBS com ~20 corretores a R$ 97/assento = R$ 1.940/mês num contrato só
5. **Horizonte:** mesmo sistema serve advogado, dentista, arquiteto… mas **só depois** de dominar o nicho corretor (nicho = preço premium)

## 6. O papel do MazyOS (sua vantagem injusta)

A replicação pode virar uma **skill**: `/novo-corretor`. Você roda o comando, responde as 12
perguntas do onboarding, e eu (Claude) gero a pasta do cliente inteira — HTMLs preenchidos,
Code.gs personalizado, checklist — em minutos em vez de horas. Sua "fábrica" é o MazyOS.

Quando fechar o primeiro cliente pagante, me pede: **"cria a skill /novo-corretor"** — eu monto
usando o template e o processo deste playbook.

## 7. Riscos e cuidados

- **Conflito de interesse:** corretores da mesma praça competem com a Ju. Validar com ela a lista de prospecção. Corretores de outras imobiliárias primeiro.
- **Suporte:** definir canal (WhatsApp comercial seu) e expectativa (resposta em 24h útil). Não prometer 24/7.
- **Churn:** o que segura o cliente é o LEAD chegando. O relatório mensal do plano Pro existe pra **mostrar valor** todo mês.
- **CallMeBot** é gratuito mas não-oficial — pro resumo diário serve; pra notificação crítica, o e-mail é o canal confiável. Se o produto crescer, migrar pra API oficial do WhatsApp (custo baixo, profissionaliza).
- **Não venda "site".** Se o cliente pedir "quanto custa o site?", a resposta é: "site é uma das 6 peças — o que eu entrego é o sistema de captação completo."

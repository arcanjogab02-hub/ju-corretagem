# Setup de medição (BI) — o que liga ANTES de subir

> É aqui que a gente vira o jogo: o concorrente "joga no zap e perde o rastro". A gente mede tudo.

## Checklist técnico
- [ ] **Pixel da Meta** instalado no site (`marketing/site/`): `PageView` na bio, `ViewContent` na `investir.html`.
- [ ] **CAPI (Conversions API)** ativo — recupera sinal pós-iOS (idealmente via Pixel + servidor/integração).
- [ ] **Número do WhatsApp** (`5563992226998`) conectado ao Gerenciador da Meta (pra rodar CTWA e medir conversas).
- [ ] **Evento de conversa/lead** marcado: conversa iniciada no CTWA + (se usar página) `Lead` no envio do form (já vai via `sendBeacon` pro CRM).
- [ ] **Link rastreável** pronto: `investir.html?origem=ads` (e `?origem=ads-retarget` na semana 2) — separa no painel do CRM por origem.
- [ ] **UTM** no link (`utm_source=meta&utm_medium=cpc&utm_campaign=urban-atrio-planta`) pra cruzar com GA4.

## O que cada número responde (o BI)
| Métrica | Onde | Pergunta que responde |
|---|---|---|
| Hook rate (visualização 3s) | Gerenciador | O criativo prende? (mata/escala criativo) |
| Custo por conversa | Gerenciador | Quanto custa puxar alguém pro WhatsApp? |
| **Custo por conversa qualificada** | Gerenciador + triagem | Quanto custa um lead que **vale** a conversa? (rainha) |
| CPL (form) | Painel do CRM (por `origem=ads`) | Custo do lead que entrou na base |
| Conversão da página | Painel do CRM | A `investir.html` converte o clique pago? |

## Qualificação (lead melhor, não mais lead)
Triagem na 1ª resposta do WhatsApp (ou no form). 3 perguntas:
1. **Morar ou investir?** (confirma persona A)
2. **Já tem uma entrada/valor guardado pra começar?** (faixa, sem constranger)
3. **Pra quando?** (agora / até 6 meses / só pesquisando)

→ "Conversa qualificada" = respondeu as 3 e tem intenção real de morar + algum prazo. O resto entra como "curioso" (nutrir, não priorizar).

## Suposições 〔sup.〕 a confirmar
- Pixel/CAPI: confirmar se já estão instalados na `investir.html` (o CRM já capta lead; falta validar o Pixel).
- Conta de anúncios + número no Gerenciador: confirmar acesso antes de subir.

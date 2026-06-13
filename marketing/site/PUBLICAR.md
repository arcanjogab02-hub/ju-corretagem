# Publicar o site da Juliana (Cloudflare Pages — grátis, deploy automático)

> Esta pasta (`site/`) é o que vai pro ar. Contém tudo que o navegador precisa.
> **No ar em:** https://juliana-alves.pages.dev

## O que tem aqui

| Arquivo | É | Link na bio |
|---|---|---|
| `index.html` | **Bio premium** (página principal) | o link da bio aponta pra cá |
| `investir.html` | **Página de captura** (form → CRM + WhatsApp) | botão "Quero investir" |
| `imoveis.html` | **Catálogo** de imóveis | botão "Imóveis em destaque" |
| `juliana.jpg`, `logo-urbs.png`, `imovel1-6.jpg` | imagens | — |

As páginas já se linkam entre si. O fluxo: **bio → captura/catálogo → WhatsApp**.

## Como está publicado (Cloudflare Pages)

O site é um **projeto no Cloudflare Pages** conectado ao repositório GitHub
`arcanjogab02-hub/ju-corretagem`, com estas configurações:

- **Production branch:** `main`
- **Build command:** *(vazio — é HTML estático, sem build)*
- **Build output directory:** `marketing/site`

> Migramos do Netlify em 13/06/2026 (a conta travou por falta de créditos e o site saiu do ar).
> O Cloudflare Pages é grátis, permite uso comercial e hospeda sites ilimitados — ideal pro produto.

## Atualizar o site

**Deploy é automático.** Mudou alguma página ou foto? É só **commitar e dar push na `main`**
(ou rodar `/salvar`) — o Cloudflare detecta o push e republica sozinho em ~1 min.
Sem upload manual, sem CLI.

Pra trocar uma foto de imóvel, basta substituir o arquivo (`imovel1.jpg`…`imovel6.jpg`)
mantendo o mesmo nome e dar push.

## Colocar na bio

Cola `https://juliana-alves.pages.dev` na bio do Instagram (@juu_alves8), no campo de link.
(Opcional, ~R$40/ano: registrar `julianaalves.com.br` e apontar pro Cloudflare pra ficar
com cara de marca própria — o Cloudflare dá domínio personalizado + SSL de graça.)

---

**Por que site real e não Linktree:** o Linktree só faz lista de links — não rodaria nosso
formulário, nem o CRM, nem o catálogo. O Cloudflare Pages hospeda o HTML real, de graça,
com deploy automático. É o caminho certo pra essa stack.

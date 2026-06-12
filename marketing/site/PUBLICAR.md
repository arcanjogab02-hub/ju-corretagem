# Publicar o site da Juliana (Netlify — grátis, 5 min)

> Esta pasta (`site/`) é o que vai pro ar. Contém tudo que o navegador precisa.

## O que tem aqui

| Arquivo | É | Link na bio |
|---|---|---|
| `index.html` | **Bio premium** (página principal) | o link da bio aponta pra cá |
| `investir.html` | **Página de captura** (form → CRM + WhatsApp) | botão "Quero investir" |
| `imoveis.html` | **Catálogo** de imóveis | botão "Imóveis em destaque" |
| `juliana.jpg`, `capa.jpg`, `logo-urbs.png`, `imovel1-3.jpg` | imagens | — |

As páginas já se linkam entre si. O fluxo: **bio → captura/catálogo → WhatsApp**.

## Antes de publicar (checklist)

- [ ] CRM conectado: `CRM_ENDPOINT` preenchido no `investir.html` (ver [../crm/SETUP-CRM.md](../crm/SETUP-CRM.md))
- [ ] WhatsApp confere: **5563992226998** (já configurado)
- [ ] Trocar as 3 fotos de imóvel (`imovel1/2/3.jpg`) e os dados do `imoveis.html` pelos reais
- [ ] (Opcional) trocar `capa.jpg` por uma foto real de imóvel da URBS

## Publicar

### Opção rápida — arrastar e soltar
1. Cria conta em [netlify.com](https://app.netlify.com/signup) (login com Google).
2. Vai em **"Add new site" → "Deploy manually"**.
3. **Arrasta a pasta `site/` inteira** pra área de upload.
4. Sai no ar na hora, numa URL tipo `random-name-123.netlify.app`.
5. **Site configuration → Change site name** → coloca algo como `juliana-alves` → vira `juliana-alves.netlify.app`.

### Colocar na bio
6. Copia o link final e cola na bio do Instagram (@juu_alves8), no campo de link.
7. (Opcional, ~R$40/ano) registra `julianaalves.com.br` e aponta pro Netlify pra ficar com cara de marca própria.

## Atualizar depois

Mudou alguma página? Volta no Netlify → aba **Deploys** → arrasta a pasta `site/` de novo. Substitui tudo em segundos. (Quando o projeto crescer, dá pra ligar no GitHub e publicar automático — a gente faz via `/salvar`.)

---

**Por que Netlify e não Linktree:** o Linktree só faz lista de links — não rodaria nosso formulário, nem o CRM, nem o catálogo. Netlify hospeda o HTML real, de graça. É o caminho certo pra essa stack.
